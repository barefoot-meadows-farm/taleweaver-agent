
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { AuthGuard, PublicRouteGuard } from "./components/AuthGuard";
import Subscription from "./pages/Subscription";
import ProfileSettings from "./pages/ProfileSettings";
import History from "./pages/History";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/history" element={<History />} />
            </Route>
            
            {/* Public routes */}
            <Route element={<PublicRouteGuard />}>
              <Route path="/auth" element={<Auth />} />
            </Route>
            
            {/* Subscription page - accessible to all but has different UI for logged in/out users */}
            <Route path="/subscription" element={<Subscription />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
