
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import { useAuth } from "@/context/AuthContext";

const Subscription = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 sm:py-20 bg-gradient-to-br from-background via-accent/20 to-background/90">
      <header className="max-w-3xl w-full text-center mb-12 animate-slide-down">
        <Link to="/" className="inline-flex items-center gap-1.5 px-4 py-1 bg-background/80 text-foreground rounded-full text-sm font-medium mb-4 hover:bg-background transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
        </Link>
        
        <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          Upgrade Your Experience
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight ai-text-gradient">
          Choose Your Plan
        </h1>
        
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Unlock unlimited user stories with our premium plans.
          {user ? '' : ' Sign in to continue.'}
        </p>
      </header>

      <main className="w-full max-w-5xl mx-auto">
        {user ? (
          <SubscriptionPlans />
        ) : (
          <div className="text-center p-8 bg-background/80 rounded-lg border shadow-sm">
            <p className="mb-4 text-lg">Please sign in to view subscription options</p>
            <Button as={Link} to="/auth">Sign In</Button>
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
