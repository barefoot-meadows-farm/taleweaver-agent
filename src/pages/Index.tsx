
import { useState } from "react";
import UserStoryForm from "@/components/UserStoryForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import { UserStoryResponse } from "@/types";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [userStory, setUserStory] = useState<UserStoryResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = (result: UserStoryResponse) => {
    setUserStory(result);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setUserStory(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 sm:py-20 bg-gradient-to-b from-background to-accent/30">
      <header className="max-w-3xl w-full text-center mb-12 animate-slide-down">
        <div className="inline-block px-4 py-1 bg-accent text-foreground/70 rounded-full text-sm font-medium mb-4">
          AI-Powered User Story Generator
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
          Craft Perfect User Stories
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Transform requirements into well-structured user stories with our
          AI tool. Simply describe what you need, and let AI do the rest.
        </p>
      </header>

      <main className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10 mb-20">
        {userStory ? (
          <ResultsDisplay userStory={userStory} onReset={resetForm} />
        ) : (
          <UserStoryForm 
            onSuccess={handleSuccess} 
            isSubmitting={isSubmitting}
            setSubmitting={setIsSubmitting}
          />
        )}
      </main>

      <footer className="w-full max-w-4xl mx-auto text-center text-foreground/60 text-sm">
        <p>User Story Generator &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
