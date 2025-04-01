
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const Razorpay = {
  keyId: Deno.env.get("RAZORPAY_KEY_ID"),
  keySecret: Deno.env.get("RAZORPAY_KEY_SECRET"),
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

    // Get the request body
    const { planId, planName, amount, currency = "INR" } = await req.json();

    if (!planId || !planName || !amount) {
      throw new Error("Missing required parameters");
    }

    // Current timestamp in seconds
    const receipt = `receipt_${Date.now()}`;

    // Create an order with Razorpay
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${Razorpay.keyId}:${Razorpay.keySecret}`)}`,
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency,
        receipt,
        notes: {
          userId: user.id,
          planId,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Razorpay error:", errorData);
      throw new Error(`Razorpay error: ${errorData.error.description || "Could not create order"}`);
    }

    const orderData = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          orderId: orderData.id,
          amount: orderData.amount / 100, // Convert back to rupees
          currency: orderData.currency,
          receipt,
          keyId: Razorpay.keyId,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating subscription:", error);
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
