
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { SubscriptionStatus } from "@/types";
import { getSubscriptionStatus } from "@/lib/api";

const ManageSubscription = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionStatus | null>(null);

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      try {
        const status = await getSubscriptionStatus();
        setSubscriptionInfo(status);
      } catch (error) {
        console.error("Failed to fetch subscription info:", error);
        toast.error("Failed to load subscription information");
      }
    };
    
    if (user) {
      fetchSubscriptionInfo();
    }
  }, [user]);

  const handleCreatePortalSession = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-portal-session');
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No customer portal URL returned");
      }
    } catch (error) {
      console.error("Portal error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create customer portal session");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Manage Subscription</CardTitle>
        <CardDescription>
          {subscriptionInfo?.hasActiveSubscription 
            ? "Manage your subscription or payment method"
            : subscriptionInfo?.remainingOneTimeCredits && subscriptionInfo.remainingOneTimeCredits > 0
              ? `You have ${subscriptionInfo.remainingOneTimeCredits} credits remaining`
              : "You don't have an active subscription"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscriptionInfo?.hasActiveSubscription && (
          <Button 
            onClick={handleCreatePortalSession} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader className="mr-2 h-4 w-4 animate-spin" /> Loading...</>
            ) : (
              <><CreditCard className="mr-2 h-4 w-4" /> Manage Subscription</>
            )}
          </Button>
        )}
        {!subscriptionInfo?.hasActiveSubscription && (
          <Button 
            asChild
            className="w-full"
          >
            <a href="/subscription">Upgrade Your Plan</a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ManageSubscription;
