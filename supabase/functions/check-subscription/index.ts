
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

    console.log("Checking subscription for user:", user.id);

    // Check if user has an active subscription
    const { data: subscriptions, error: subError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .gte("valid_until", new Date().toISOString())
      .order("valid_until", { ascending: false })
      .limit(1);

    if (subError) {
      console.error("Error fetching subscriptions:", subError);
      throw new Error(`Failed to check subscription: ${subError.message}`);
    }

    const subscription = subscriptions && subscriptions.length > 0 ? subscriptions[0] : null;
    const isSubscribed = !!subscription;
    console.log("Subscription status:", isSubscribed);

    // Get user's free invoice usage
    let { data: usageData, error: usageError } = await supabaseClient
      .from("invoice_usage")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (usageError && usageError.code !== "PGRST116") {
      console.error("Error fetching invoice usage:", usageError);
      throw new Error(`Failed to check invoice usage: ${usageError.message}`);
    }

    // Create usage record if it doesn't exist - this is critical for new users
    if (!usageData) {
      console.log("No usage record found for user, creating new record with 0 usage");
      const { data: newUsage, error: createError } = await supabaseClient
        .from("invoice_usage")
        .insert({ user_id: user.id, free_invoices_used: 0 })
        .select()
        .single();

      if (createError) {
        console.error("Error creating invoice usage:", createError);
        throw new Error(`Failed to create invoice usage: ${createError.message}`);
      }

      usageData = newUsage;
    }

    console.log("User free invoices used:", usageData?.free_invoices_used);

    // Determine if user can create invoices
    const freeUsageLimit = 3;
    const freeUsageUsed = usageData?.free_invoices_used || 0;
    const freeUsageRemaining = freeUsageLimit - freeUsageUsed;
    const canUseFreeTier = freeUsageRemaining > 0;
    
    // This is the key change - a user can create an invoice if:
    // 1. They have an active subscription, OR
    // 2. They have free invoices remaining
    const canCreateInvoice = isSubscribed || canUseFreeTier;

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          isSubscribed,
          canCreateInvoice,
          subscription,
          freeUsage: {
            used: freeUsageUsed,
            limit: freeUsageLimit,
            canUseFreeTier,
          },
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error checking subscription:", error);
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
