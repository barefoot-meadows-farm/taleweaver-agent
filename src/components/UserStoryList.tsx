import { useState } from "react";
import { UserStory, UserStoryResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ChevronRight, Calendar } from "lucide-react";
import { format } from "date-fns";

interface UserStoryListProps {
  userStories: UserStory[];
  isLoading: boolean;
}

const UserStoryList = ({ userStories, isLoading }: UserStoryListProps) => {
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);
  
  const handleStoryClick = (story: UserStory) => {
    // Store both the result and original request values
    localStorage.setItem('viewUserStory', JSON.stringify(story.result));
    localStorage.setItem('viewUserStoryRequest', JSON.stringify({
      requirement: story.requirement,
      context: story.context || undefined,
      stakeholders: story.stakeholders || undefined,
      api_required: story.api_required || undefined,
      additional_details: story.additional_details || undefined
    }));
    
    // Navigate to the home page to view the story
    window.location.href = '/';
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }
  
  if (userStories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No user stories found. Generate your first one!</p>
        <Button 
          variant="default" 
          onClick={() => window.location.href = '/'}
          className="mt-4"
        >
          Create New Story
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {userStories.map((story) => (
        <Card 
          key={story.id} 
          className={`p-4 cursor-pointer hover:border-primary/50 transition-all ${
            expandedStoryId === story.id ? 'border-primary/50' : ''
          }`}
          onClick={() => setExpandedStoryId(expandedStoryId === story.id ? null : story.id)}
        >
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm line-clamp-1">{story.requirement}</h3>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(story.created_at), 'MMM d, yyyy')}
              </div>
            </div>
            
            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${
              expandedStoryId === story.id ? 'rotate-90' : ''
            }`} />
          </div>
          
          {expandedStoryId === story.id && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm mb-2 line-clamp-3">{story.result.value_statement}</p>
              
              <Button 
                variant="default" 
                size="sm" 
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStoryClick(story);
                }}
              >
                View Details
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default UserStoryList;
