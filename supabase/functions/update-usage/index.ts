
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

    // If user has an active subscription, update the invoice count
    if (activeSubscription) {
      // Check if they've hit their limit
      if (
        activeSubscription.invoice_limit !== null &&
        activeSubscription.invoice_count >= activeSubscription.invoice_limit
      ) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "You have reached your subscription invoice limit. Please upgrade your plan.",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 403,
          }
        );
      }

      // Increment invoice count for the subscription
      const { error: updateError } = await supabaseClient
        .from("subscriptions")
        .update({ invoice_count: (activeSubscription.invoice_count || 0) + 1, updated_at: new Date().toISOString() })
        .eq("id", activeSubscription.id);

      if (updateError) {
        throw new Error(`Failed to update subscription usage: ${updateError.message}`);
      }
    } else {
      // User doesn't have an active subscription, check and update free usage
      // First check if the user has an invoice_usage entry
      const { data: usageData, error: usageError } = await supabaseClient
        .from("invoice_usage")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (usageError && usageError.code !== "PGRST116") {
        // PGRST116 means no rows found
        throw new Error(`Failed to check invoice usage: ${usageError.message}`);
      }

      const freeInvoicesLimit = 3;

      // If no entry exists, create one
      if (!usageData) {
        const { error: insertError } = await supabaseClient.from("invoice_usage").insert({
          user_id: user.id,
          free_invoices_used: 1,
        });

        if (insertError) {
          throw new Error(`Failed to create invoice usage: ${insertError.message}`);
        }
      } else {
        // Check if they've hit their free limit
        if (usageData.free_invoices_used >= freeInvoicesLimit) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "You have used all your free invoices. Please subscribe to continue.",
              freeUsage: {
                used: usageData.free_invoices_used,
                limit: freeInvoicesLimit,
              },
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 403,
            }
          );
        }

        // Increment free usage count
        const { error: updateError } = await supabaseClient
          .from("invoice_usage")
          .update({ 
            free_invoices_used: usageData.free_invoices_used + 1,
            updated_at: new Date().toISOString()
          })
          .eq("id", usageData.id);

        if (updateError) {
          throw new Error(`Failed to update invoice usage: ${updateError.message}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Usage updated successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating usage:", error);
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
