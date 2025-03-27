
import { UserStoryResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ClipboardCopy,
  Check,
  RefreshCw,
  FileText,
  ListChecks,
  FileQuestion,
  Star,
  AlertCircle,
  Activity,
  Code,
  Lightbulb,
  TestTube,
  BarChart,
  Layers,
  PenTool,
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ResultsDisplayProps {
  userStory: UserStoryResponse;
  onReset: () => void;
}

const ResultsDisplay = ({ userStory, onReset }: ResultsDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("story");

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
    <Card className="w-full max-w-3xl p-6 glass-panel animate-fade-in space-y-6 tech-border">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Generated User Story
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(userStory.story)}
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

      <Tabs defaultValue="story" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="criteria">Criteria</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="story" className="space-y-4">
          <div className="p-4 bg-accent/50 rounded-md whitespace-pre-wrap text-foreground border border-primary/10">
            {userStory.story}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <PenTool className="h-5 w-5 text-primary" />
              Value Statement
            </h3>
            <p className="text-foreground/90 whitespace-pre-wrap">{userStory.value_statement}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Use Case Examples
            </h3>
            <ul className="list-disc list-inside pl-2 space-y-3">
              {userStory.use_case_examples.map((example, index) => (
                <li key={index} className="text-foreground/90">
                  {example}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Priority: {userStory.priority}
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Effort: {userStory.effort_estimate}
            </Badge>
          </div>
        </TabsContent>

        <TabsContent value="criteria" className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Acceptance Criteria
            </h3>
            <ul className="list-disc list-inside pl-2 space-y-1">
              {userStory.acceptance_criteria.map((criteria, index) => (
                <li key={index} className="text-foreground/90">
                  {criteria}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Functional Requirements
            </h3>
            <ul className="list-disc list-inside pl-2 space-y-1">
              {userStory.functional_requirements.map((req, index) => (
                <li key={index} className="text-foreground/90">
                  {req}
                </li>
              ))}
            </ul>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Non-Functional Requirements
            </h3>
            <ul className="list-disc list-inside pl-2 space-y-1">
              {userStory.non_functional_requirements.map((req, index) => (
                <li key={index} className="text-foreground/90">
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Technical Considerations
            </h3>
            <ul className="list-disc list-inside pl-2 space-y-1">
              {userStory.technical_considerations.map((consideration, index) => (
                <li key={index} className="text-foreground/90">
                  {consideration}
                </li>
              ))}
            </ul>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Error Scenarios
            </h3>
            <div className="space-y-3">
              {userStory.error_scenarios.map((scenario, index) => (
                <div key={index} className="p-3 bg-destructive/10 rounded-md">
                  <p className="font-medium">{scenario.scenario}</p>
                  <p className="text-sm text-destructive">{scenario.message}</p>
                </div>
              ))}
            </div>
          </div>
          
          {userStory.api_specs?.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  API Specifications
                </h3>
                <div className="space-y-3">
                  {userStory.api_specs.map((spec, index) => (
                    <div key={index} className="p-3 bg-accent/30 rounded-md">
                      <p className="font-medium">{spec.method} {spec.endpoint}</p>
                      <p className="text-sm">{spec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <TestTube className="h-5 w-5 text-primary" />
              Test Cases
            </h3>
            <div className="space-y-4">
              {userStory.test_cases.map((testCase, index) => (
                <div key={index} className="p-3 bg-accent/30 rounded-md space-y-2">
                  <p className="font-medium">{testCase.title}</p>
                  <p className="text-sm italic">{testCase.scenario}</p>
                  
                  <div className="space-y-1 mt-2">
                    <p className="text-xs font-medium text-foreground/70">Given:</p>
                    <ul className="list-disc list-inside pl-2 text-sm">
                      {testCase.given.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground/70">When:</p>
                    <ul className="list-disc list-inside pl-2 text-sm">
                      {testCase.when.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground/70">Then:</p>
                    <ul className="list-disc list-inside pl-2 text-sm">
                      {testCase.then.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

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
