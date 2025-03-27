
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
  onSuccess: (userStory: any) => void,
  setSubmitting: (isSubmitting: boolean) => void
): UseUserStoryFormResult => {
  const [requirement, setRequirement] = useState("");
  const [context, setContext] = useState("");
  const [stakeholders, setStakeholders] = useState<string[]>([]);
  const [apiRequired, setApiRequired] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
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
          
          // If user has an active subscription or one-time credits, we don't need to count monthly usage
          if (status?.hasActiveSubscription || (status?.remainingOneTimeCredits && status.remainingOneTimeCredits > 0)) {
            setUsageCount(0); // Just to show they haven't hit the limit
          } else {
            // Count monthly usage for free tier
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
    
    const data: UserStoryRequest = {
      requirement,
      context: context || undefined,
      stakeholders: stakeholders.length > 0 ? stakeholders : undefined,
      api_required: apiRequired || undefined,
      additional_details: additionalDetails || undefined,
    };
    
    const result = await generateUserStory(data);
    setSubmitting(false);
    
    if (result) {
      // Update usage count after successful generation
      setUsageCount(prev => prev !== null ? prev + 1 : 1);
      onSuccess(result);
    }
  };

  const hasActiveSubscription = subscriptionStatus?.hasActiveSubscription || false;
  const remainingOneTimeCredits = subscriptionStatus?.remainingOneTimeCredits || 0;
  
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
