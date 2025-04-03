
import { Button } from "@/components/ui/button";
import { BookText, LogIn } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/PageLayout";

const PublicIndex = () => {
  const { user } = useAuth();
  
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
          <div className="w-full max-w-2xl p-6 glass-panel animate-fade-in tech-border">
            <div className="text-center space-y-8">
              <h2 className="text-2xl font-bold">Create Perfect User Stories with AI</h2>
              <p className="text-foreground/80">
                Our AI-powered tool helps you generate well-structured user stories for your Agile development team. Sign in to create your first user story.
              </p>
              <div className="flex flex-col gap-4">
                <Link to="/auth" className="w-full">
                  <Button
                    className="w-full py-6 hover-lift transition-all duration-300 font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In to Generate User Stories
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground">
                  Sign up for free and get 5 free user story generations per month
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageLayout>
  );
};

export default PublicIndex;

