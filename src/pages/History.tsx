
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import UserStoryList from "@/components/UserStoryList";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const History = () => {
  const [userStories, setUserStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserStories() {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data, error } = await supabase
            .from('user_stories')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });
            
          if (error) {
            console.error("Error fetching user stories:", error);
          } else {
            setUserStories(data || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user stories:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserStories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col px-4 py-12 bg-gradient-to-br from-background via-accent/20 to-background/90">
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Story History</h1>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-4xl mx-auto">
        <div className="glass-panel p-6">
          <UserStoryList 
            userStories={userStories} 
            isLoading={isLoading} 
          />
        </div>
      </main>
    </div>
  );
};

export default History;
