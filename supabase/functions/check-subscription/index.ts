
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
    const { data: subscriptions, error: subError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .lt("valid_until", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    if (subError) {
      console.error("Error fetching subscriptions:", subError);
    }

    const subscription = subscriptions && subscriptions.length > 0 ? subscriptions[0] : null;
    const isSubscribed = !!subscription;

    // Get user's free invoice usage
    let { data: usageData, error: usageError } = await supabaseClient
      .from("invoice_usage")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (usageError && usageError.code !== "PGRST116") {
      console.error("Error fetching invoice usage:", usageError);
    }

    // Create usage record if it doesn't exist
    if (!usageData) {
      const { data: newUsage, error: createError } = await supabaseClient
        .from("invoice_usage")
        .insert({ user_id: user.id, free_invoices_used: 0 })
        .select()
        .single();

      if (createError) {
        console.error("Error creating invoice usage:", createError);
        throw createError;
      }

      usageData = newUsage;
    }

    // Determine if user can create invoices
    const freeUsageLimit = 3;
    const freeUsageRemaining = freeUsageLimit - (usageData?.free_invoices_used || 0);
    const canUseFreeTier = freeUsageRemaining > 0;
    const canCreateInvoice = isSubscribed || canUseFreeTier;

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          isSubscribed,
          canCreateInvoice,
          subscription,
          freeUsage: {
            used: usageData?.free_invoices_used || 0,
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
