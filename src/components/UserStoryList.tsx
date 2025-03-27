
import { useState } from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Book, Eye, Loader } from "lucide-react";
import { UserStoryResponse } from '@/types';
import { useNavigate } from 'react-router-dom';

interface UserStory {
  id: string;
  created_at: string;
  requirement: string;
  result: UserStoryResponse;
  context?: string;
  stakeholders?: string[];
  api_required?: boolean;
  additional_details?: string;
}

interface UserStoryListProps {
  userStories: UserStory[];
  isLoading: boolean;
}

const UserStoryList = ({ userStories, isLoading }: UserStoryListProps) => {
  const navigate = useNavigate();
  
  const viewStory = (story: UserStory) => {
    // Store the story in localStorage so we can retrieve it on the main page
    localStorage.setItem('viewUserStory', JSON.stringify(story.result));
    // Navigate to the main page
    navigate('/');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (userStories.length === 0) {
    return (
      <div className="text-center py-8">
        <Book className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
        <h3 className="text-lg font-medium">No user stories yet</h3>
        <p className="text-muted-foreground mt-1">
          Generate your first user story to see it here.
        </p>
        <Button className="mt-4" asChild>
          <a href="/">Create New User Story</a>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50%]">Requirement</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userStories.map((story) => (
            <TableRow key={story.id}>
              <TableCell className="font-medium">
                {format(new Date(story.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {story.requirement}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => viewStory(story)}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">View</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserStoryList;
