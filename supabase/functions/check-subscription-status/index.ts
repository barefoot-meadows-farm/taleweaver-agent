
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client for user authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get the user from the authorization header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Not authenticated');
    }

    const email = user.email;
    if (!email) {
      throw new Error('User email not found');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Check if customer exists
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    if (customers.data.length === 0) {
      return new Response(
        JSON.stringify({ 
          status: 'no_subscription',
          hasActiveSubscription: false,
          remainingOneTimeCredits: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const customerId = customers.data[0].id;
    
    // Check for active subscriptions (both monthly and yearly)
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 100
    });

    const hasActiveSubscription = subscriptions.data.length > 0;
    
    // Get one-time payment information
    const charges = await stripe.charges.list({
      customer: customerId,
      limit: 100
    });
    
    // For simplicity, each one-time payment gives 30 credits
    // In a real app, you'd track this in your database
    const oneTimePaymentsCount = charges.data.filter(
      charge => charge.amount_captured > 0 && !charge.disputed
    ).length;
    
    const totalOneTimeCredits = oneTimePaymentsCount * 30;
    
    // For a real app, you'd need to track usage in the database
    // This is a simplified version
    const { data: userStories } = await supabaseClient
      .from('user_stories')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);
    
    const usedCredits = (userStories?.length || 0) - 5; // 5 free credits
    const remainingOneTimeCredits = Math.max(0, totalOneTimeCredits - Math.max(0, usedCredits));

    return new Response(
      JSON.stringify({ 
        status: hasActiveSubscription ? 'subscribed' : 'not_subscribed',
        hasActiveSubscription,
        remainingOneTimeCredits
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
