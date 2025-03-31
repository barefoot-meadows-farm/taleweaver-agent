
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookText, CircuitBoard, Zap, LogIn } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import Navigation from "@/components/Navigation";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

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
    <>
      <Helmet>
        <title>Story Gen - AI-Powered User Story Generator for Agile Teams</title>
        <meta name="description" content="Transform your requirements into well-structured user stories for Agile development with our AI-powered story generator." />
        <meta name="keywords" content="user story generator, agile story, AI story generator, product backlog, sprint planning" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
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
            {user ? (
              <UserMenu />
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="flex gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          
          <div className="absolute top-16 left-10 opacity-20 text-primary hidden lg:block">
            <CircuitBoard size={180} />
          </div>
          <div className="absolute bottom-20 right-10 opacity-10 text-primary/80 hidden lg:block">
            <CircuitBoard size={240} />
          </div>
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
    </>
  );
};

export default PublicIndex;
