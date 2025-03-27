
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import ManageSubscription from "@/components/ManageSubscription";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { SubscriptionStatus } from "@/types";
import { getSubscriptionStatus } from "@/lib/api";

const Subscription = () => {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (user) {
        try {
          const status = await getSubscriptionStatus();
          setSubscriptionStatus(status);
        } catch (error) {
          console.error("Error fetching subscription status:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 sm:py-20 bg-gradient-to-br from-background via-accent/20 to-background/90">
      <header className="max-w-3xl w-full text-center mb-12 animate-slide-down">
        <Link to="/" className="inline-flex items-center gap-1.5 px-4 py-1 bg-background/80 text-foreground rounded-full text-sm font-medium mb-4 hover:bg-background transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
        </Link>
        
        <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          {subscriptionStatus?.hasActiveSubscription 
            ? "Manage Your Subscription" 
            : "Upgrade Your Experience"}
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight ai-text-gradient">
          {subscriptionStatus?.hasActiveSubscription 
            ? "Subscription Management" 
            : "Choose Your Plan"}
        </h1>
        
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          {subscriptionStatus?.hasActiveSubscription 
            ? "Manage your current subscription or update your payment information." 
            : "Unlock unlimited user stories with our premium plans."}
          {user ? '' : ' Sign in to continue.'}
        </p>
      </header>

      <main className="w-full max-w-5xl mx-auto">
        {user ? (
          isLoading ? (
            <div className="text-center p-8">Loading subscription information...</div>
          ) : subscriptionStatus?.hasActiveSubscription ? (
            <div className="space-y-8">
              <ManageSubscription />
            </div>
          ) : (
            <SubscriptionPlans />
          )
        ) : (
          <div className="text-center p-8 bg-background/80 rounded-lg border shadow-sm">
            <p className="mb-4 text-lg">Please sign in to view subscription options</p>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        )}
      </main>

      <footer className="mt-20 text-center text-sm text-foreground/60">
        <p>Secure payments powered by Stripe</p>
      </footer>
    </div>
  );
};

export default Subscription;
