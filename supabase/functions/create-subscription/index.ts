
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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
    // Get request body
    const { planId, planName, amount, currency } = await req.json();
    
    if (!planId || !amount || !currency) {
      throw new Error("Missing required fields: planId, amount, or currency");
    }

    // Get authorization header
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

    // Get current user
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("User not found or not authenticated");
    }

    const user = userData.user;
    console.log("Creating subscription for user:", user.id, "with plan:", planId);

    // Load Razorpay keys
    const keyId = Deno.env.get("RAZORPAY_KEY_ID");
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!keyId || !keySecret) {
      throw new Error("Razorpay API keys not configured");
    }

    // Generate a unique order ID
    const orderId = crypto.randomUUID();

    // Create Razorpay order
    const orderData = {
      amount: amount * 100, // Convert to paise (Razorpay uses smallest currency unit)
      currency: currency,
      receipt: `order_${orderId}`,
      notes: {
        planId: planId,
        userId: user.id,
        userEmail: user.email,
      },
    };

    console.log("Creating Razorpay order with data:", JSON.stringify(orderData));

    // Create Authorization header for Razorpay API
    const auth = btoa(`${keyId}:${keySecret}`);

    // Create Razorpay order using fetch
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.json();
      console.error("Razorpay API error:", errorData);
      throw new Error(`Razorpay API error: ${JSON.stringify(errorData)}`);
    }

    const razorpayOrder = await razorpayResponse.json();
    console.log("Razorpay order created:", razorpayOrder);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          order_id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          key_id: keyId,
          planId: planId,
          planName: planName,
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
        error: error.message || "Failed to create subscription",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
