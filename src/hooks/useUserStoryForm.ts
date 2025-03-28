
import { useState, useEffect } from "react";
import { UserStoryRequest, SubscriptionStatus } from "@/types";
import { getSubscriptionStatus, generateUserStory } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";

interface UseUserStoryFormResult {
  requirement: string;
  setRequirement: (requirement: string) => void;
  context: string;
  setContext: (context: string) => void;
  stakeholders: string[];
  setStakeholders: (stakeholders: string[]) => void;
  apiRequired: boolean;
  setApiRequired: (apiRequired: boolean) => void;
  additionalDetails: string;
  setAdditionalDetails: (additionalDetails: string) => void;
  showAdditionalFields: boolean;
  setShowAdditionalFields: (showAdditionalFields: boolean) => void;
  errors: Record<string, string>;
  usageCount: number | null;
  isLoading: boolean;
  subscriptionStatus: SubscriptionStatus | null;
  hasReachedFreeLimit: boolean;
  hasActiveSubscription: boolean;
  remainingOneTimeCredits: number;
  validateForm: () => boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useUserStoryForm = (
  onSuccess: (userStory: any, formValues: Partial<UserStoryRequest>) => void,
  setSubmitting: (isSubmitting: boolean) => void,
  initialValues: Partial<UserStoryRequest> | null = null
): UseUserStoryFormResult => {
  const [requirement, setRequirement] = useState(initialValues?.requirement || "");
  const [context, setContext] = useState(initialValues?.context || "");
  const [stakeholders, setStakeholders] = useState<string[]>(initialValues?.stakeholders || []);
  const [apiRequired, setApiRequired] = useState(initialValues?.api_required || false);
  const [additionalDetails, setAdditionalDetails] = useState(initialValues?.additional_details || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdditionalFields, setShowAdditionalFields] = useState(
    initialValues ? 
      !!(initialValues.context || initialValues.stakeholders?.length || initialValues.api_required || initialValues.additional_details) : 
      false
  );
  const [usageCount, setUsageCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Get the first day of current month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Check subscription status
          const status = await getSubscriptionStatus();
          setSubscriptionStatus(status);
          
          // Count monthly usage for free tier (even if they have a subscription or one-time credits)
          // This is just for display purposes
          const { count, error } = await supabase
            .from('user_stories')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user.id)
            .gte('created_at', firstDayOfMonth.toISOString());
              
          if (error) {
            console.error("Error fetching usage count:", error);
          } else {
            setUsageCount(count || 0);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!requirement.trim()) {
      newErrors.requirement = "Requirement is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    const formValues: UserStoryRequest = {
      requirement,
      context: context || undefined,
      stakeholders: stakeholders.length > 0 ? stakeholders : undefined,
      api_required: apiRequired || undefined,
      additional_details: additionalDetails || undefined,
    };
    
    const result = await generateUserStory(formValues);
    setSubmitting(false);
    
    if (result) {
      // Update usage count after successful generation
      setUsageCount(prev => prev !== null ? prev + 1 : 1);
      onSuccess(result, formValues);
    }
  };

  const hasActiveSubscription = subscriptionStatus?.hasActiveSubscription || false;
  const remainingOneTimeCredits = subscriptionStatus?.remainingOneTimeCredits || 0;
  
  // Calculate whether user has reached the free limit
  // They've reached the limit if they:
  // 1. Don't have an active subscription AND
  // 2. Have no remaining one-time credits AND
  // 3. Have used all 5 free generations this month
  const remainingFreeStories = usageCount !== null ? Math.max(0, 5 - usageCount) : null;
  const hasReachedFreeLimit = !hasActiveSubscription && 
    remainingOneTimeCredits <= 0 && 
    remainingFreeStories !== null && 
    remainingFreeStories <= 0;

  return {
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
    subscriptionStatus,
    hasReachedFreeLimit,
    hasActiveSubscription,
    remainingOneTimeCredits,
    validateForm,
    handleSubmit
  };
};
