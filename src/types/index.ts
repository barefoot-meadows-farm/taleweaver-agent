
export interface UserStoryRequest {
  requirement: string;
  context?: string;
  stakeholders?: string[];
  api_required?: boolean;
  additional_details?: string;
}

export interface UserStoryResponse {
  userStory: string;
  acceptanceCriteria?: string[];
  notes?: string;
}
