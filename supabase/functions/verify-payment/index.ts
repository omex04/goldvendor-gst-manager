
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error("User not found or not authenticated");
    }

    // Get payment details from the request
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, planId, planName, amount, validDays } = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !planId || !validDays) {
      throw new Error("Missing required parameters");
    }

    // Verify the signature
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") || "";
    const hmac = createHmac("sha256", RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    const isSignatureValid = generatedSignature === razorpay_signature;
    if (!isSignatureValid) {
      throw new Error("Invalid payment signature");
    }

    // Calculate valid until date
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validDays);

    // Store subscription in the database
    const { error: subscriptionError } = await supabaseClient.from("subscriptions").insert({
      user_id: user.id,
      plan_id: planId,
      status: "active",
      payment_id: razorpay_payment_id,
      valid_until: validUntil.toISOString(),
      // For demo purposes, we'll set a reasonable limit
      invoice_limit: planId === "basic" ? 100 : planId === "premium" ? 500 : 50,
      invoice_count: 0,
    });

    if (subscriptionError) {
      throw new Error(`Failed to store subscription: ${subscriptionError.message}`);
    }

    // Reset the invoice usage
    const { error: resetError } = await supabaseClient
      .from("invoice_usage")
      .update({ free_invoices_used: 0 })
      .eq("user_id", user.id);

    if (resetError) {
      console.error("Failed to reset invoice usage:", resetError);
      // Not throwing error here, since subscription is already created
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment verified and subscription created successfully",
        data: {
          planId,
          validUntil: validUntil.toISOString(),
          paymentId: razorpay_payment_id,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
