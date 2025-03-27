
import { FC } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { BrainCircuit } from "lucide-react";

interface LoadingAnimationProps {
  className?: string;
}

const LoadingAnimation: FC<LoadingAnimationProps> = ({ className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center w-full", className)}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <BrainCircuit className="h-10 w-10 text-primary animate-pulse z-10" />
        </div>
        <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
      
      <div className="mt-6 space-y-3 w-full max-w-xs">
        <Skeleton className="w-full h-4 bg-primary/10" />
        <div className="space-y-2">
          <Skeleton className="w-3/4 h-2.5 bg-primary/5" />
          <Skeleton className="w-5/6 h-2.5 bg-primary/5" />
          <Skeleton className="w-4/5 h-2.5 bg-primary/5" />
        </div>
        
        <div className="mt-4 space-y-2">
          <Progress value={45} className="h-1.5 bg-primary/10" />
          <div className="text-xs text-foreground/60 font-medium mt-1">
            Generating your user story...
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
