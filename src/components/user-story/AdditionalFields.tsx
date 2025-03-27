
import { BrainCircuit, Database, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import StakeholderInput from "./StakeholderInput";

interface AdditionalFieldsProps {
  context: string;
  setContext: (context: string) => void;
  stakeholders: string[];
  setStakeholders: (stakeholders: string[]) => void;
  apiRequired: boolean;
  setApiRequired: (apiRequired: boolean) => void;
  additionalDetails: string;
  setAdditionalDetails: (additionalDetails: string) => void;
  isSubmitting: boolean;
}

const AdditionalFields = ({
  context,
  setContext,
  stakeholders,
  setStakeholders,
  apiRequired,
  setApiRequired,
  additionalDetails,
  setAdditionalDetails,
  isSubmitting
}: AdditionalFieldsProps) => {
  return (
    <div className="space-y-4">
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

      <StakeholderInput 
        stakeholders={stakeholders}
        setStakeholders={setStakeholders}
        disabled={isSubmitting}
      />

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
    </div>
  );
};

export default AdditionalFields;
