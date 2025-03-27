
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Loader2, CircuitBoard, LogIn, UserPlus, AlertCircle, BookText } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const { signIn, signUp, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await signIn(email, password);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to sign in");
      toast.error("Failed to sign in", {
        description: error.message || "Please check your credentials and try again"
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await signUp(email, password);
      toast.success("Account created successfully", {
        description: "Please verify your email address if required"
      });
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to sign up");
      toast.error("Failed to create account", {
        description: error.message || "Please try again with a different email"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-accent/20 to-background/90">
      <div className="absolute top-16 left-10 opacity-20 text-primary hidden lg:block">
        <CircuitBoard size={180} />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10 text-primary/80 hidden lg:block">
        <CircuitBoard size={240} />
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <BookText className="h-3.5 w-3.5" />
            AI-Powered Story Generator
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight ai-text-gradient">
            Story Gen
          </h1>
          <p className="text-foreground/70">
            Sign in or create an account to craft perfect user stories
          </p>
        </div>
        
        <Card className="w-full glass-panel tech-border">
          <Tabs defaultValue="signin">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin" className="data-[state=active]:bg-primary/20">
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary/20">
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input
                      id="password-signup"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
            <CardFooter className="text-xs text-center text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </CardFooter>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
