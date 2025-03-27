
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "lucide-react";

const AccountSettings = () => {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  if (!user) {
    return <div>Please log in to access account settings.</div>;
  }

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      toast.success("Successfully signed out");
    } catch (error) {
      toast.error("Failed to sign out");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Delete all user stories first
      const { error: deleteStoriesError } = await supabase
        .from('user_stories')
        .delete()
        .eq('user_id', user.id);
        
      if (deleteStoriesError) {
        toast.error("Failed to delete user stories");
        console.error(deleteStoriesError);
        return;
      }
      
      // Sign out and delete the user
      await signOut();
      toast.success("Your account has been deleted successfully");
      
    } catch (error) {
      toast.error("Failed to delete account");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div>
          <h3 className="text-lg font-medium">Account Information</h3>
          <div className="mt-3 space-y-2">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Member Since</span>
              <span className="font-medium">
                {new Date(user.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium">Account Actions</h3>
          <div className="mt-3 space-y-4">
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign Out
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
