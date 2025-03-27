
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
    // Get the signature from the header
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No Stripe signature found');
    }

    // Get the raw request body
    const body = await req.text();
    
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });
    
    // Verify the webhook signature
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!endpointSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set');
    }
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed` }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Connect to Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Handle the event
    console.log(`Processing event: ${event.type}`);
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // If this is a subscription
        if (session.mode === 'subscription') {
          // Get the subscription
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          
          // Extract the user ID from the metadata 
          const userId = session.metadata?.user_id;
          if (!userId) {
            console.error('No user_id found in session metadata');
            break;
          }
          
          // Update the subscription record in the database
          const { error } = await supabaseClient
            .from('subscriptions')
            .update({
              is_premium: true,
              subscription_type: subscription.items.data[0].price.recurring.interval === 'year' ? 'yearly' : 'monthly',
              starts_at: new Date(subscription.current_period_start * 1000).toISOString(),
              expires_at: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq('user_id', userId);

          if (error) {
            console.error('Error updating subscription:', error);
          } else {
            console.log(`Subscription updated for user ${userId}`);
          }
        } 
        // If this is a one-time payment
        else if (session.mode === 'payment') {
          // One-time payment processing logic can be added here if needed
          console.log('One-time payment completed');
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        // Handle successful subscription renewals
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          const customer = await stripe.customers.retrieve(invoice.customer);
          
          // Find the user by customer email
          const { data: users, error: userError } = await supabaseClient
            .from('profiles')
            .select('id')
            .eq('username', customer.email)
            .limit(1);
            
          if (userError || !users || users.length === 0) {
            console.error('Could not find user for customer:', customer.email);
            break;
          }
          
          const userId = users[0].id;
          
          // Update the subscription record
          const { error } = await supabaseClient
            .from('subscriptions')
            .update({
              is_premium: true,
              starts_at: new Date(subscription.current_period_start * 1000).toISOString(),
              expires_at: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq('user_id', userId);
            
          if (error) {
            console.error('Error updating subscription on renewal:', error);
          } else {
            console.log(`Subscription renewed for user ${userId}`);
          }
        }
        break;
      }
      case 'customer.subscription.deleted': {
        // Handle subscription cancellations
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        
        // Find the user by customer email
        const { data: users, error: userError } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('username', customer.email)
          .limit(1);
          
        if (userError || !users || users.length === 0) {
          console.error('Could not find user for customer:', customer.email);
          break;
        }
        
        const userId = users[0].id;
        
        // Update the subscription record
        const { error } = await supabaseClient
          .from('subscriptions')
          .update({
            is_premium: false,
            expires_at: new Date().toISOString() // Set to current time as it's cancelled
          })
          .eq('user_id', userId);
          
        if (error) {
          console.error('Error updating subscription on cancellation:', error);
        } else {
          console.log(`Subscription cancelled for user ${userId}`);
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
