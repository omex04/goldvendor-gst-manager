
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

    // Check if user has an active subscription
    const { data: subscriptions, error: subscriptionError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .gte("valid_until", new Date().toISOString())
      .order("valid_until", { ascending: false })
      .limit(1);

    if (subscriptionError) {
      throw new Error(`Failed to check subscription: ${subscriptionError.message}`);
    }

    const activeSubscription = subscriptions && subscriptions.length > 0 ? subscriptions[0] : null;

    // Check invoice usage for free tier
    const { data: usageData, error: usageError } = await supabaseClient
      .from("invoice_usage")
      .select("free_invoices_used")
      .eq("user_id", user.id)
      .single();

    if (usageError && usageError.code !== "PGRST116") {
      // PGRST116 means no rows found, which is fine for a new user
      throw new Error(`Failed to check invoice usage: ${usageError.message}`);
    }

    const freeInvoicesUsed = usageData?.free_invoices_used || 0;
    const freeInvoicesLimit = 3; // Free tier limit
    const canUseFreeTier = freeInvoicesUsed < freeInvoicesLimit;

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
          },
          subscription: activeSubscription,
          freeUsage: {
            used: freeInvoicesUsed,
            limit: freeInvoicesLimit,
            canUseFreeTier,
          },
          isSubscribed: !!activeSubscription,
          canCreateInvoice: !!activeSubscription || canUseFreeTier,
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
