
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const PageLayout = ({ children, showNavigation = true }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavigation && (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container h-14">
            <Navigation />
          </div>
        </header>
      )}
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default PageLayout;
