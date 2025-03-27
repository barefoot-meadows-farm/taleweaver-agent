
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
    const { plan } = await req.json();
    
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

    // Check if customer already exists
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    let customer_id = undefined;
    let price_id = '';
    let mode = 'subscription';

    // Set price ID based on the selected plan
    switch (plan) {
      case 'one_time':
        price_id = 'price_1R76oFPRdN87cPdW5egSuEmu'; // One-time credits price
        mode = 'payment';
        break;
      case 'monthly':
        price_id = 'price_1R76oyPRdN87cPdW1Hd6eeTs'; // Monthly subscription price
        mode = 'subscription';
        break;
      case 'yearly':
        price_id = 'price_1R76oyPRdN87cPdW378gtG77'; // Yearly subscription price
        mode = 'subscription';
        break;
      default:
        throw new Error('Invalid plan selected');
    }

    if (customers.data.length > 0) {
      customer_id = customers.data[0].id;
      
      // For subscriptions, check if already subscribed
      if (mode === 'subscription') {
        const subscriptions = await stripe.subscriptions.list({
          customer: customer_id,
          status: 'active',
          price: price_id,
          limit: 1
        });

        if (subscriptions.data.length > 0) {
          throw new Error('You already have an active subscription for this plan');
        }
      }
    }

    console.log(`Creating ${mode} session for plan: ${plan}`);
    const session = await stripe.checkout.sessions.create({
      customer: customer_id,
      customer_email: customer_id ? undefined : email,
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: mode as 'payment' | 'subscription',
      success_url: `${req.headers.get('origin')}/`,
      cancel_url: `${req.headers.get('origin')}/`,
      metadata: {
        user_id: user.id
      }
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
