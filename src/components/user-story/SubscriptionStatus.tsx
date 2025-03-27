
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SubscriptionStatusProps {
  isLoading: boolean;
  hasActiveSubscription: boolean;
  remainingOneTimeCredits: number;
  usageCount: number | null;
}

const SubscriptionStatus = ({
  isLoading,
  hasActiveSubscription,
  remainingOneTimeCredits,
  usageCount,
}: SubscriptionStatusProps) => {
  if (isLoading) return null;

  const remainingFreeStories = usageCount !== null ? Math.max(0, 5 - usageCount) : null;
  const hasReachedFreeLimit = !hasActiveSubscription && 
    remainingOneTimeCredits <= 0 && 
    remainingFreeStories !== null && 
    remainingFreeStories <= 0;

  return (
    <div 
      className={`mb-4 p-3 rounded-md ${
        hasReachedFreeLimit ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
      } flex items-center justify-between`}
    >
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4" />
        {hasActiveSubscription ? (
          <span className="text-sm font-medium">
            You have an active subscription with unlimited user stories!
          </span>
        ) : remainingOneTimeCredits > 0 ? (
          <span className="text-sm font-medium">
            You have {remainingOneTimeCredits} one-time credits remaining.
          </span>
        ) : (
          <span className="text-sm font-medium">
            {hasReachedFreeLimit 
              ? "You've reached your limit of 5 free user stories this month." 
              : `You've used ${usageCount} of 5 free user stories this month.`}
          </span>
        )}
      </div>
      
      {(hasReachedFreeLimit || (!hasActiveSubscription && remainingOneTimeCredits <= 0)) && (
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          asChild
        >
          <Link to="/subscription">
            Upgrade
          </Link>
        </Button>
      )}
    </div>
  );
};

export default SubscriptionStatus;
