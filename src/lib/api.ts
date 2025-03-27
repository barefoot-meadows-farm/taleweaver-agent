
import { UserStoryRequest, UserStoryResponse } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export async function generateUserStory(
  data: UserStoryRequest
): Promise<UserStoryResponse | null> {
  try {
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("You must be logged in to generate user stories");
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
