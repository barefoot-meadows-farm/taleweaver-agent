
import { useState } from "react";
import { X, Plus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface StakeholderInputProps {
  stakeholders: string[];
  setStakeholders: (stakeholders: string[]) => void;
  disabled: boolean;
}

const StakeholderInput = ({
  stakeholders,
  setStakeholders,
  disabled
}: StakeholderInputProps) => {
  const [stakeholderInput, setStakeholderInput] = useState("");

  const addStakeholder = () => {
    if (!stakeholderInput.trim()) return;
    
    setStakeholders([...stakeholders, stakeholderInput.trim()]);
    setStakeholderInput("");
  };

  const removeStakeholder = (index: number) => {
    setStakeholders(stakeholders.filter((_, i) => i !== index));
  };

  const handleStakeholderKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addStakeholder();
    }
  };

  return (
    <div className="space-y-1">
      <Label htmlFor="stakeholders" className="input-label flex items-center gap-1.5">
        <Users className="h-4 w-4 text-primary" />
        Stakeholders
      </Label>
      <div className="flex items-center gap-2">
        <Input
          id="stakeholders"
          value={stakeholderInput}
          onChange={(e) => setStakeholderInput(e.target.value)}
          onKeyDown={handleStakeholderKeyDown}
          placeholder="Add stakeholder"
          className="transition-all duration-200 focus:border-primary/50 focus:ring-primary/30"
          disabled={disabled}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={addStakeholder}
          disabled={!stakeholderInput.trim() || disabled}
          className="flex-shrink-0 hover-lift"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {stakeholders.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {stakeholders.map((stakeholder, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="pl-3 pr-2 py-1.5 flex items-center gap-1 hover:bg-secondary/80 animate-fade-in bg-primary/10 text-primary"
            >
              {stakeholder}
              <button
                type="button"
                onClick={() => removeStakeholder(index)}
                className="ml-1 h-4 w-4 rounded-full flex items-center justify-center hover:bg-background/50 transition-colors"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default StakeholderInput;
