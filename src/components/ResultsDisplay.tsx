
import { UserStoryResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ClipboardCopy,
  X,
  Check,
  RefreshCw,
  FileText,
  ListChecks,
  FileQuestion,
} from "lucide-react";
import { useState } from "react";

interface ResultsDisplayProps {
  userStory: UserStoryResponse;
  onReset: () => void;
}

const ResultsDisplay = ({ userStory, onReset }: ResultsDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Card className="w-full max-w-2xl p-6 glass-panel animate-fade-in space-y-6 tech-border">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Generated User Story
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(userStory.userStory)}
            className="hover-lift"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <ClipboardCopy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            className="hover-lift"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 bg-accent/50 rounded-md whitespace-pre-wrap text-foreground border border-primary/10">
        {userStory.userStory}
      </div>

      {userStory.acceptanceCriteria && userStory.acceptanceCriteria.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            Acceptance Criteria
          </h3>
          <ul className="list-disc list-inside pl-2 space-y-1">
            {userStory.acceptanceCriteria.map((criteria, index) => (
              <li key={index} className="text-foreground/90">
                {criteria}
              </li>
            ))}
          </ul>
        </div>
      )}

      {userStory.notes && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-primary" />
            Notes
          </h3>
          <p className="text-foreground/90 whitespace-pre-wrap">{userStory.notes}</p>
        </div>
      )}

      <Button
        onClick={onReset}
        variant="outline"
        className="w-full hover-lift transition-all duration-300 bg-gradient-to-r from-accent/80 to-primary/20 hover:from-primary/30 hover:to-accent/50 border-primary/20"
      >
        Generate New User Story
      </Button>
    </Card>
  );
};

export default ResultsDisplay;
