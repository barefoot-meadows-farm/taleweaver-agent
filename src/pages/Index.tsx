
import { useState, useEffect } from "react";
import UserStoryForm from "@/components/UserStoryForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import { UserStoryResponse, UserStoryRequest } from "@/types";
import { BookText, CircuitBoard, Zap } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import PreviousStoriesLink from "@/components/PreviousStoriesLink";
import Navigation from "@/components/Navigation";

const Index = () => {
  const [userStory, setUserStory] = useState<UserStoryResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<Partial<UserStoryRequest> | null>(null);

  // Check if there's a story to display from localStorage when the component mounts
  useEffect(() => {
    const storedStory = localStorage.getItem('viewUserStory');
    const storedRequest = localStorage.getItem('viewUserStoryRequest');
    
    if (storedStory) {
      try {
        const parsedStory = JSON.parse(storedStory) as UserStoryResponse;
        setUserStory(parsedStory);
        
        // Set form values if they exist
        if (storedRequest) {
          const parsedRequest = JSON.parse(storedRequest) as Partial<UserStoryRequest>;
          setFormValues(parsedRequest);
        }
        
        // Clear the stored story to prevent it from showing up again on refresh
        localStorage.removeItem('viewUserStory');
        localStorage.removeItem('viewUserStoryRequest');
      } catch (error) {
        console.error('Error parsing stored user story:', error);
      }
    }
  }, []);

  const handleSuccess = (result: UserStoryResponse, values: Partial<UserStoryRequest>) => {
    setUserStory(result);
    setFormValues(values); // Store the form values for potential redo
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setUserStory(null);
    setFormValues(null);
  };

  const handleRedo = () => {
    setUserStory(null);
    // Form values are already stored and will be used to prepopulate the form
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 sm:py-20 bg-gradient-to-br from-background via-accent/20 to-background/90">
      <header className="max-w-3xl w-full flex justify-between items-start mb-12 animate-slide-down">
        <div className="text-center flex-1">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <BookText className="h-3.5 w-3.5" />
            AI-Powered Story Generator
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight ai-text-gradient">
            Story Gen
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Transform requirements into well-structured user stories with our
            AI tool. Simply describe what you need, and let AI do the rest.
          </p>
          
          <div className="mt-6">
            <Navigation />
          </div>
        </div>
        
        <div className="absolute top-4 right-4">
          <UserMenu />
        </div>
        
        <div className="absolute top-16 left-10 opacity-20 text-primary hidden lg:block">
          <CircuitBoard size={180} />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10 text-primary/80 hidden lg:block">
          <CircuitBoard size={240} />
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10 mb-20 relative z-10">
        {userStory ? (
          <ResultsDisplay 
            userStory={userStory} 
            onReset={resetForm} 
            onRedo={handleRedo}
          />
        ) : (
          <>
            <UserStoryForm 
              onSuccess={handleSuccess} 
              isSubmitting={isSubmitting}
              setSubmitting={setIsSubmitting}
              initialValues={formValues}
            />
            <PreviousStoriesLink />
          </>
        )}
      </main>

      <footer className="w-full max-w-4xl mx-auto text-center text-foreground/60 text-sm">
        <div className="flex items-center justify-center gap-1">
          <p>Powered by</p>
          <a 
            href="https://binarybloom.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center"
          >
            Binary Bloom
          </a>
          <Zap className="h-3.5 w-3.5 text-primary" />
          <p>Story Gen &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
