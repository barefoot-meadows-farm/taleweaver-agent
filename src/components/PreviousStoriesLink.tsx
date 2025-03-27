
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const PreviousStoriesLink = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full max-w-xl mx-auto mt-2 mb-6 flex justify-center">
      <Button
        variant="secondary"
        size="sm"
        className="text-xs text-muted-foreground"
        asChild
      >
        <Link to="/history">
          <History className="h-3.5 w-3.5 mr-1.5" />
          {isMobile ? "Previous stories" : "View your previously generated stories"}
        </Link>
      </Button>
    </div>
  );
};

export default PreviousStoriesLink;
