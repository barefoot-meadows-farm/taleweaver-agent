
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
import ManageSubscription from "@/components/ManageSubscription";
import AccountSettings from "@/components/AccountSettings";
import UserStoryList from "@/components/UserStoryList";
import { UserStoryResponse } from "@/types";

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

const ProfileSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("subscription");

  // Fetch subscription status
  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscriptionStatus'],
    queryFn: getSubscriptionStatus,
    enabled: !!user,
  });

  // Fetch user stories
  const { data: userStories, isLoading: isLoadingStories } = useQuery({
    queryKey: ['userStories'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_stories')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching user stories:", error);
        throw error;
      }
      
      return data as UserStory[];
    },
    enabled: !!user,
  });

  return (
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileSettings;
