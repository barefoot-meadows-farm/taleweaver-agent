
import { useState } from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Book, Eye, Loader } from "lucide-react";
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserStoryResponse } from '@/types';

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
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => setSelectedStory(story)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">User Story Details</DialogTitle>
                    </DialogHeader>
                    
                    {selectedStory && (
                      <ScrollArea className="h-[70vh] mt-4 pr-4">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Requirement</h3>
                            <p className="bg-muted p-3 rounded-md">{selectedStory.requirement}</p>
                          </div>
                          
                          {selectedStory.context && (
                            <div>
                              <h3 className="text-lg font-semibold mb-2">Context</h3>
                              <p className="bg-muted p-3 rounded-md">{selectedStory.context}</p>
                            </div>
                          )}
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Generated Story</h3>
                            <Card>
                              <CardHeader>
                                <CardTitle>User Story</CardTitle>
                                <CardDescription>Generated user story based on your requirements</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-1">Story</h4>
                                  <p className="text-sm whitespace-pre-wrap">{selectedStory.result.story}</p>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-1">Value Statement</h4>
                                  <p className="text-sm whitespace-pre-wrap">{selectedStory.result.value_statement}</p>
                                </div>
                                
                                <Accordion type="single" collapsible className="w-full">
                                  <AccordionItem value="acceptance-criteria">
                                    <AccordionTrigger>Acceptance Criteria</AccordionTrigger>
                                    <AccordionContent>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {selectedStory.result.acceptance_criteria.map((criteria, index) => (
                                          <li key={index} className="text-sm">{criteria}</li>
                                        ))}
                                      </ul>
                                    </AccordionContent>
                                  </AccordionItem>
                                  
                                  <AccordionItem value="functional-requirements">
                                    <AccordionTrigger>Functional Requirements</AccordionTrigger>
                                    <AccordionContent>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {selectedStory.result.functional_requirements.map((req, index) => (
                                          <li key={index} className="text-sm">{req}</li>
                                        ))}
                                      </ul>
                                    </AccordionContent>
                                  </AccordionItem>
                                  
                                  <AccordionItem value="non-functional-requirements">
                                    <AccordionTrigger>Non-Functional Requirements</AccordionTrigger>
                                    <AccordionContent>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {selectedStory.result.non_functional_requirements.map((req, index) => (
                                          <li key={index} className="text-sm">{req}</li>
                                        ))}
                                      </ul>
                                    </AccordionContent>
                                  </AccordionItem>
                                  
                                  <AccordionItem value="error-scenarios">
                                    <AccordionTrigger>Error Scenarios</AccordionTrigger>
                                    <AccordionContent>
                                      {selectedStory.result.error_scenarios.map((scenario, index) => (
                                        <div key={index} className="mb-2">
                                          <h5 className="font-medium text-sm">{scenario.scenario}</h5>
                                          <p className="text-xs text-muted-foreground">{scenario.message}</p>
                                        </div>
                                      ))}
                                    </AccordionContent>
                                  </AccordionItem>
                                  
                                  {selectedStory.result.technical_considerations.length > 0 && (
                                    <AccordionItem value="technical-considerations">
                                      <AccordionTrigger>Technical Considerations</AccordionTrigger>
                                      <AccordionContent>
                                        <ul className="list-disc pl-5 space-y-1">
                                          {selectedStory.result.technical_considerations.map((consideration, index) => (
                                            <li key={index} className="text-sm">{consideration}</li>
                                          ))}
                                        </ul>
                                      </AccordionContent>
                                    </AccordionItem>
                                  )}
                                </Accordion>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </ScrollArea>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserStoryList;
