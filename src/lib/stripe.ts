
/**
 * Stripe client-side utilities
 */

// The publishable key is used for client-side Stripe integrations
export const STRIPE_PUBLISHABLE_KEY = "pk_test_51R75PBPRdN87cPdWDL0pSgcO3sOh7TScyWsyXEyBpK1OlhxvGwXBUXHoY4YJQXrMT6tVLT8XCjMKbOCXFbDfZQYM00LpOYXFFR";

/**
 * Helper to load the Stripe.js script dynamically
 */
export const loadStripeScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('stripe-js')) {
      // Script is already loaded
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.id = 'stripe-js';
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Stripe.js'));
    document.head.appendChild(script);
  });
};

/**
 * Get the Stripe instance
 * Note: This function should be called after the Stripe.js script is loaded
 */
export const getStripe = (): any => {
  // @ts-ignore - Stripe is loaded via the script
  return window.Stripe?.(STRIPE_PUBLISHABLE_KEY);
};
