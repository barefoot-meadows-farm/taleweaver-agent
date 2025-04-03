
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import PublicIndex from "./pages/PublicIndex";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { AuthGuard, PublicRouteGuard } from "./components/AuthGuard";
import Subscription from "./pages/Subscription";
import ProfileSettings from "./pages/ProfileSettings";
import History from "./pages/History";
import About from "./pages/About";
import Contact from "./pages/Contact";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create a wrapper component to handle TooltipProvider correctly
const AppContent = () => (
  <TooltipProvider>
    <Routes>
      {/* Dashboard - accessible to all but has different UI for logged in/out users */}
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Index />} />
      
      {/* Protected routes - require authentication */}
      <Route element={<AuthGuard />}>
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/history" element={<History />} />
      </Route>
      
      {/* Public routes - only for non-authenticated users */}
      <Route element={<PublicRouteGuard />}>
        <Route path="/auth" element={<Auth />} />
      </Route>
      
      {/* Subscription page - accessible to all but has different UI for logged in/out users */}
      <Route path="/subscription" element={<Subscription />} />
      
      {/* Public pages - accessible to all */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
