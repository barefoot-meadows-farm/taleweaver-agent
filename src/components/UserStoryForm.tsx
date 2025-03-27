import { useState } from "react";
import { UserStoryRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X, Plus, BrainCircuit, Settings, Users, Database, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { generateUserStory } from "@/lib/api";
import LoadingAnimation from "./LoadingAnimation";

interface UserStoryFormProps {
  onSuccess: (userStory: any) => void;
  isSubmitting: boolean;
  setSubmitting: (isSubmitting: boolean) => void;
}

const UserStoryForm = ({ 
  onSuccess, 
  isSubmitting, 
  setSubmitting 
}: UserStoryFormProps) => {
  const [requirement, setRequirement] = useState("");
  const [context, setContext] = useState("");
  const [stakeholderInput, setStakeholderInput] = useState("");
  const [stakeholders, setStakeholders] = useState<string[]>([]);
  const [apiRequired, setApiRequired] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  const addStakeholder = () => {
    if (!stakeholderInput.trim()) return;
    
    setStakeholders((prev) => [...prev, stakeholderInput.trim()]);
    setStakeholderInput("");
  };

  const removeStakeholder = (index: number) => {
    setStakeholders((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStakeholderKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addStakeholder();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!requirement.trim()) {
      newErrors.requirement = "Requirement is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    const data: UserStoryRequest = {
      requirement,
      context: context || undefined,
      stakeholders: stakeholders.length > 0 ? stakeholders : undefined,
      api_required: apiRequired || undefined,
      additional_details: additionalDetails || undefined,
    };
    
    const result = await generateUserStory(data);
    setSubmitting(false);
    
    if (result) {
      onSuccess(result);
    }
  };

  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
  };

  if (isSubmitting) {
    return (
      <Card className="w-full max-w-2xl p-8 glass-panel animate-fade-in tech-border flex flex-col items-center justify-center min-h-[500px]">
        <LoadingAnimation />
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl p-6 glass-panel animate-fade-in tech-border">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="requirement" className="input-label flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-destructive">*</span> Requirement
          </Label>
          <Textarea
            id="requirement"
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Describe what you want to accomplish..."
            className={`min-h-24 transition-all duration-200 focus:border-primary/50 focus:ring-primary/30 ${
              errors.requirement ? "border-destructive ring-destructive" : ""
            }`}
            disabled={isSubmitting}
          />
          {errors.requirement && (
            <p className="text-sm text-destructive mt-1 animate-slide-up">
              {errors.requirement}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="show-more"
            checked={showAdditionalFields}
            onCheckedChange={toggleAdditionalFields}
            disabled={isSubmitting}
          />
          <Label
            htmlFor="show-more"
            className="input-label !mb-0 cursor-pointer flex items-center gap-1.5"
          >
            <Settings className="h-4 w-4 text-primary" />
            {showAdditionalFields ? 
              "Hide additional fields" : 
              "Show additional fields"}
          </Label>
        </div>

        <Collapsible open={showAdditionalFields} className="space-y-4">
          <CollapsibleContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="context" className="input-label flex items-center gap-1.5">
                <BrainCircuit className="h-4 w-4 text-primary" />
                Context
              </Label>
              <Textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Provide background information or context..."
                className="min-h-20 transition-all duration-200 focus:border-primary/50 focus:ring-primary/30"
                disabled={isSubmitting}
              />
            </div>

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
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addStakeholder}
                  disabled={!stakeholderInput.trim() || isSubmitting}
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
                        disabled={isSubmitting}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="api-required"
                checked={apiRequired}
                onCheckedChange={setApiRequired}
                disabled={isSubmitting}
              />
              <Label
                htmlFor="api-required"
                className="input-label !mb-0 cursor-pointer flex items-center gap-1.5"
              >
                <Database className="h-4 w-4 text-primary" />
                API Required
              </Label>
            </div>

            <div className="space-y-1">
              <Label htmlFor="additional-details" className="input-label flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" />
                Additional Details
              </Label>
              <Textarea
                id="additional-details"
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="Any other details you'd like to include..."
                className="min-h-20 transition-all duration-200 focus:border-primary/50 focus:ring-primary/30"
                disabled={isSubmitting}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Button
          type="submit"
          className="w-full py-6 hover-lift transition-all duration-300 font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating User Story...
            </>
          ) : (
            <>
              <BrainCircuit className="mr-2 h-5 w-5" />
              Generate User Story
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default UserStoryForm;
