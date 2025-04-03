
import { useState, useEffect } from "react";
import UserStoryForm from "@/components/UserStoryForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import { UserStoryResponse, UserStoryRequest } from "@/types";
import { BookText } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PreviousStoriesLink from "@/components/PreviousStoriesLink";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const [userStory, setUserStory] = useState<UserStoryResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<Partial<UserStoryRequest> | null>(null);

  useEffect(() => {
    const storedStory = localStorage.getItem('viewUserStory');
    const storedRequest = localStorage.getItem('viewUserStoryRequest');
    
    if (storedStory) {
      try {
        const parsedStory = JSON.parse(storedStory) as UserStoryResponse;
        setUserStory(parsedStory);
        
        if (storedRequest) {
          const parsedRequest = JSON.parse(storedRequest) as Partial<UserStoryRequest>;
          setFormValues(parsedRequest);
        }
        
        localStorage.removeItem('viewUserStory');
        localStorage.removeItem('viewUserStoryRequest');
      } catch (error) {
        console.error('Error parsing stored user story:', error);
      }
    }
  }, []);

  const handleSuccess = (result: UserStoryResponse, values: Partial<UserStoryRequest>) => {
    setUserStory(result);
    setFormValues(values);
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setUserStory(null);
    setFormValues(null);
  };

  const handleRedo = () => {
    setUserStory(null);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Story Gen",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "AI-powered user story generator for Agile development teams"
  };

  return (
    <PageLayout>
      <Helmet>
        <title>Story Gen - AI-Powered User Story Generator for Agile Teams</title>
        <meta name="description" content="Transform your requirements into well-structured user stories for Agile development with our AI-powered story generator." />
        <meta name="keywords" content="user story generator, agile story, AI story generator, product backlog, sprint planning" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="flex flex-col items-center px-4 py-12 sm:py-20 bg-gradient-to-br from-background via-accent/20 to-background/90">
        <header className="max-w-3xl w-full mb-12 animate-slide-down text-center">
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
      </div>
    </PageLayout>
  );
};

export default Index;
