
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, BookText, List, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getSubscriptionStatus } from "@/lib/api";
import PageLayout from "@/components/PageLayout";
import ManageSubscription from "@/components/ManageSubscription";
import AccountSettings from "@/components/AccountSettings";
import UserStoryList from "@/components/UserStoryList";
import { UserStory, UserStoryResponse } from "@/types";
import { Json } from "@/integrations/supabase/types";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

// Interface representing the raw data from Supabase
interface RawUserStory {
  id: string;
  created_at: string;
  requirement: string;
  result: Json;
  context?: string | null;
  stakeholders?: string[] | null;
  api_required?: boolean | null;
  additional_details?: string | null;
  user_id: string;
}

const ITEMS_PER_PAGE = 5;

const ProfileSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("subscription");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStories, setTotalStories] = useState(0);

  // Fetch subscription status
  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscriptionStatus'],
    queryFn: getSubscriptionStatus,
    enabled: !!user,
  });

  // Fetch user stories count for pagination
  useQuery({
    queryKey: ['userStoriesCount'],
    queryFn: async () => {
      if (!user) return 0;
      
      const { count, error } = await supabase
        .from('user_stories')
        .select('*', { count: 'exact', head: true });
        
      if (error) {
        console.error("Error fetching user stories count:", error);
        throw error;
      }
      
      setTotalStories(count || 0);
      return count;
    },
    enabled: !!user && activeTab === "stories",
  });

  // Fetch paginated user stories
  const { data: userStories, isLoading: isLoadingStories } = useQuery({
    queryKey: ['userStories', currentPage],
    queryFn: async () => {
      if (!user) return [];
      
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      const { data, error } = await supabase
        .from('user_stories')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);
        
      if (error) {
        console.error("Error fetching user stories:", error);
        throw error;
      }
      
      // Transform the raw data to match our UserStory interface
      return (data as RawUserStory[]).map(story => ({
        id: story.id,
        created_at: story.created_at,
        requirement: story.requirement,
        context: story.context,
        stakeholders: story.stakeholders,
        api_required: story.api_required,
        additional_details: story.additional_details,
        result: story.result as unknown as UserStoryResponse
      })) as UserStory[];
    },
    enabled: !!user && activeTab === "stories",
  });

  const totalPages = Math.ceil(totalStories / ITEMS_PER_PAGE);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  return (
    <PageLayout>
      <div className="min-h-screen flex flex-col items-center px-4 py-12 bg-gradient-to-br from-background via-accent/20 to-background/90">
        <div className="w-full max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-1.5 px-4 py-1 bg-background/80 text-foreground rounded-full text-sm font-medium mb-6 hover:bg-background transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Story Gen
          </Link>
          
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account, subscription, and view your stories
            </p>
          </header>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="subscription" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Subscription</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="stories" className="flex items-center gap-2">
                <BookText className="h-4 w-4" />
                <span className="hidden sm:inline">My Stories</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="subscription" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Status</CardTitle>
                  <CardDescription>
                    Manage your subscription plan and payment method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ManageSubscription />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AccountSettings />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stories" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>My User Stories</CardTitle>
                  <CardDescription>
                    View and manage your previously generated user stories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserStoryList 
                    userStories={userStories || []} 
                    isLoading={isLoadingStories} 
                  />
                  
                  {totalStories > ITEMS_PER_PAGE && (
                    <div className="mt-6">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handlePageChange(currentPage - 1)}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: totalPages }).map((_, index) => (
                            <PaginationItem key={index}>
                              <PaginationLink
                                onClick={() => handlePageChange(index + 1)}
                                isActive={currentPage === index + 1}
                                className="cursor-pointer"
                              >
                                {index + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handlePageChange(currentPage + 1)}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfileSettings;
