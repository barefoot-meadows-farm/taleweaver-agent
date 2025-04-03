
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import UserStoryList from "@/components/UserStoryList";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 5;

const History = () => {
  const [userStories, setUserStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStories, setTotalStories] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserStories() {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // First get the total count for pagination
          const { count, error: countError } = await supabase
            .from('user_stories')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user.id);
            
          if (countError) {
            console.error("Error fetching story count:", countError);
          } else {
            setTotalStories(count || 0);
          }
          
          // Then fetch the paginated data
          const from = (currentPage - 1) * ITEMS_PER_PAGE;
          const to = from + ITEMS_PER_PAGE - 1;
          
          const { data, error } = await supabase
            .from('user_stories')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .range(from, to);
            
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
  }, [currentPage]);

  const totalPages = Math.ceil(totalStories / ITEMS_PER_PAGE);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <PageLayout>
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
          </div>
        </main>
      </div>
    </PageLayout>
  );
};

export default History;
