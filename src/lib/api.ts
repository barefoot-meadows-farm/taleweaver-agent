
import { UserStoryRequest, UserStoryResponse } from "@/types";
import { toast } from "sonner";

export async function generateUserStory(
  data: UserStoryRequest
): Promise<UserStoryResponse | null> {
  try {
    const response = await fetch("http://localhost:8000/generate-user-story", {
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

    return await response.json();
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
