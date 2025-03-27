
import { Loader, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface UserStoryFormSubmitProps {
  isSubmitting: boolean;
  hasReachedFreeLimit: boolean;
  hasActiveSubscription: boolean;
  hasOneTimeCredits: boolean;
}

const UserStoryFormSubmit = ({
  isSubmitting,
  hasReachedFreeLimit,
  hasActiveSubscription,
  hasOneTimeCredits
}: UserStoryFormSubmitProps) => {
  return (
    <>
      <Button
        type="submit"
        className="w-full py-6 hover-lift transition-all duration-300 font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        disabled={isSubmitting || (hasReachedFreeLimit && !hasActiveSubscription && !hasOneTimeCredits)}
      >
        {isSubmitting ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Generating User Story...
          </>
        ) : hasReachedFreeLimit && !hasActiveSubscription && !hasOneTimeCredits ? (
          <>
            <BrainCircuit className="mr-2 h-5 w-5" />
            Upgrade to Generate More Stories
          </>
        ) : (
          <>
            <BrainCircuit className="mr-2 h-5 w-5" />
            Generate User Story
          </>
        )}
      </Button>
      
      {hasReachedFreeLimit && !hasActiveSubscription && !hasOneTimeCredits && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          You've used all 5 free generations this month. 
          <Link to="/subscription" className="text-primary ml-1 hover:underline">
            Upgrade to continue
          </Link>.
        </p>
      )}
    </>
  );
};

export default UserStoryFormSubmit;
