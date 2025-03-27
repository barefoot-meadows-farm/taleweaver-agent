
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon, Loader, Zap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const SubscriptionPlans = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubscribe = async (plan: string) => {
    try {
      setIsLoading(plan);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please log in to subscribe");
        navigate("/auth");
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { plan },
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create checkout session");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
      {/* One-time payment plan */}
      <Card className="flex flex-col border-2 transition-all hover:border-primary/50 hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">One-time Credits</CardTitle>
          <CardDescription>Pay once for a set of credits</CardDescription>
          <div className="mt-4">
            <p className="text-3xl font-bold">$10</p>
            <p className="text-sm text-muted-foreground">One-time payment</p>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              <span>30 user story generations</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              <span>No recurring charges</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              <span>Credits never expire</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => handleSubscribe('one_time')} 
            className="w-full"
            disabled={isLoading !== null}
          >
            {isLoading === 'one_time' ? (
              <><Loader className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
            ) : (
              <>Buy Credits</>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Monthly subscription plan */}
      <Card className="flex flex-col border-2 border-primary transition-all hover:shadow-md relative">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
          Popular Choice
        </div>
        <CardHeader>
          <CardTitle className="text-xl">Monthly Plan</CardTitle>
          <CardDescription>Unlimited stories, monthly billing</CardDescription>
          <div className="mt-4">
            <p className="text-3xl font-bold">$8<span className="text-sm font-normal">/month</span></p>
            <p className="text-sm text-muted-foreground">Billed monthly</p>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              <span>Unlimited user story generations</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              <span>Access to all features</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              <span>Priority support</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => handleSubscribe('monthly')} 
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading !== null}
          >
            {isLoading === 'monthly' ? (
              <><Loader className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
            ) : (
              <>Subscribe Monthly</>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Annual subscription plan */}
      <Card className="flex flex-col border-2 transition-all hover:border-primary/50 hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Annual Plan</CardTitle>
          <CardDescription>Best value for regular use</CardDescription>
          <div className="mt-4">
            <p className="text-3xl font-bold">$60<span className="text-sm font-normal">/year</span></p>
            <p className="text-sm text-muted-foreground">$5/month, billed annually</p>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              <span>Unlimited user story generations</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              <span>37.5% savings vs monthly plan</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              <span>Priority support</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              <span>All future updates</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => handleSubscribe('yearly')} 
            className="w-full"
            disabled={isLoading !== null}
          >
            {isLoading === 'yearly' ? (
              <><Loader className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
            ) : (
              <>Subscribe Yearly</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubscriptionPlans;
