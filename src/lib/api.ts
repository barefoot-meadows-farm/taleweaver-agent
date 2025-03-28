
import { UserStoryRequest, UserStoryResponse, SubscriptionStatus } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Check if user has reached their monthly limit
async function hasReachedMonthlyLimit(userId: string): Promise<boolean> {
  // First check if user has an active subscription
  try {
    const { data, error } = await supabase.functions.invoke('check-subscription-status');
    
    if (error) {
      console.error("Error checking subscription status:", error);
      return false; // Fail open in case of errors
    }
    
    // If user has an active subscription, they have no limit
    if (data?.hasActiveSubscription) {
      return false;
    }
    
    // If user has one-time credits, they can use those
    if (data?.remainingOneTimeCredits > 0) {
      return false;
    }
  } catch (error) {
    console.error("Error checking subscription:", error);
    // Continue with free tier check in case of errors
  }
  
  // Get the first day of current month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Query for stories created this month
  const { count, error } = await supabase
    .from('user_stories')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', firstDayOfMonth.toISOString());
  
  if (error) {
    console.error("Error checking monthly limit:", error);
    return false; // Default to not limiting on error
  }
  
  // Return true if count is 5 or more (reached the free limit)
  return (count ?? 0) >= 5;
}

export async function getSubscriptionStatus(): Promise<SubscriptionStatus | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return null;
    }
    
    const { data, error } = await supabase.functions.invoke('check-subscription-status');
    
    if (error) {
      throw error;
    }
    
    return data as SubscriptionStatus;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    toast.error("Failed to check subscription status");
    return null;
  }
}

export async function generateUserStory(
  data: UserStoryRequest
): Promise<UserStoryResponse | null> {
  try {
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("You must be logged in to generate user stories");
    }

    // Check if user has reached monthly limit
    const hasReachedLimit = await hasReachedMonthlyLimit(session.user.id);
    
    if (hasReachedLimit) {
      toast.error("You've reached your limit of 5 free user stories this month. Please upgrade to continue.");
      return null;
    }

    // Make the API call to the new endpoint
    const response = await fetch("https://story-agent.fly.dev/generate-user-story", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error:", errorText);
      throw new Error(
        `Failed to generate user story: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    
    // Store the user story in Supabase using the custom RPC function
    const { error } = await supabase.rpc(
      'save_user_story', 
      {
        p_user_id: session.user.id,
        p_requirement: data.requirement,
        p_context: data.context || null,
        p_stakeholders: data.stakeholders || [],
        p_api_required: data.api_required || false,
        p_additional_details: data.additional_details || null,
        p_result: result
      } as any // Type assertion is necessary since the RPC function isn't in the generated types
    );
    
    if (error) {
      console.error("Error saving user story:", error);
      toast.error("Your story was generated but could not be saved to the database.");
      // Still return the result even if saving failed
    }

    return result;
  } catch (error) {
    console.error("API request failed:", error);
    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to connect to API. Please ensure the API server is running."
    );
    return null;
  }
}
