
import { UserStoryRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FileText, Settings } from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import LoadingAnimation from "./LoadingAnimation";
import SubscriptionStatus from "./user-story/SubscriptionStatus";
import AdditionalFields from "./user-story/AdditionalFields";
import UserStoryFormSubmit from "./user-story/UserStoryFormSubmit";
import { useUserStoryForm } from "@/hooks/useUserStoryForm";

interface UserStoryFormProps {
  onSuccess: (userStory: any) => void;
  isSubmitting: boolean;
  setSubmitting: (isSubmitting: boolean) => void;
}

const UserStoryForm = ({ 
  onSuccess, 
  isSubmitting, 
  setSubmitting 
}: UserStoryFormProps) => {
  const {
    requirement,
    setRequirement,
    context,
    setContext,
    stakeholders,
    setStakeholders,
    apiRequired,
    setApiRequired,
    additionalDetails,
    setAdditionalDetails,
    showAdditionalFields,
    setShowAdditionalFields,
    errors,
    usageCount,
    isLoading,
    hasReachedFreeLimit,
    hasActiveSubscription,
    remainingOneTimeCredits,
    handleSubmit
  } = useUserStoryForm(onSuccess, setSubmitting);

  if (isSubmitting) {
    return (
      <Card className="w-full max-w-2xl p-8 glass-panel animate-fade-in tech-border flex flex-col items-center justify-center min-h-[500px]">
        <LoadingAnimation />
      </Card>
    );
  }

  const hasOneTimeCredits = remainingOneTimeCredits > 0;

  return (
    <Card className="w-full max-w-2xl p-6 glass-panel animate-fade-in tech-border">
      {!isLoading && (
        <SubscriptionStatus
          isLoading={isLoading}
          hasActiveSubscription={hasActiveSubscription}
          remainingOneTimeCredits={remainingOneTimeCredits}
          usageCount={usageCount}
        />
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="requirement" className="input-label flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-destructive">*</span> Requirement
          </Label>
          <Textarea
            id="requirement"
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Describe what you want to accomplish..."
            className={`min-h-24 transition-all duration-200 focus:border-primary/50 focus:ring-primary/30 ${
              errors.requirement ? "border-destructive ring-destructive" : ""
            }`}
            disabled={isSubmitting || hasReachedFreeLimit && !hasActiveSubscription && !hasOneTimeCredits}
          />
          {errors.requirement && (
            <p className="text-sm text-destructive mt-1 animate-slide-up">
              {errors.requirement}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="show-more"
            checked={showAdditionalFields}
            onCheckedChange={setShowAdditionalFields}
            disabled={isSubmitting || hasReachedFreeLimit && !hasActiveSubscription && !hasOneTimeCredits}
          />
          <Label
            htmlFor="show-more"
            className="input-label !mb-0 cursor-pointer flex items-center gap-1.5"
          >
            <Settings className="h-4 w-4 text-primary" />
            {showAdditionalFields ? 
              "Hide additional fields" : 
              "Show additional fields"}
          </Label>
        </div>

        <Collapsible open={showAdditionalFields} className="space-y-4">
          <CollapsibleContent className="space-y-4">
            <AdditionalFields
              context={context}
              setContext={setContext}
              stakeholders={stakeholders}
              setStakeholders={setStakeholders}
              apiRequired={apiRequired}
              setApiRequired={setApiRequired}
              additionalDetails={additionalDetails}
              setAdditionalDetails={setAdditionalDetails}
              isSubmitting={isSubmitting}
            />
          </CollapsibleContent>
        </Collapsible>

        <UserStoryFormSubmit
          isSubmitting={isSubmitting}
          hasReachedFreeLimit={hasReachedFreeLimit}
          hasActiveSubscription={hasActiveSubscription}
          hasOneTimeCredits={hasOneTimeCredits}
        />
      </form>
    </Card>
  );
};

export default UserStoryForm;
