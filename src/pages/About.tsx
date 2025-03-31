
import React from "react";
import { BookText, Cpu, Users, Code, LucideIcon, Zap, User, Bug, Bot, Laptop } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type AgentProps = {
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
};

const Agent = ({ name, description, icon: Icon, color }: AgentProps) => {
  return (
    <Card className="border border-primary/10 hover:border-primary/30 transition-all">
      <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-start">
        <div className={`p-2 rounded-lg ${color} text-white`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">{name}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const About = () => {
  const agents = [
    {
      name: "Business Analyst",
      icon: Laptop,
      color: "bg-blue-500",
      description: "Analyzes your requirements and ensures the user story aligns with business objectives and stakeholder needs."
    },
    {
      name: "Product Owner",
      icon: User,
      color: "bg-purple-500",
      description: "Prioritizes features and ensures the user story accurately represents user value and business goals."
    },
    {
      name: "QA Engineer",
      icon: Bug,
      color: "bg-green-500",
      description: "Crafts clear acceptance criteria and test scenarios to validate that the story meets quality standards."
    },
    {
      name: "Technical Architect",
      icon: Code,
      color: "bg-amber-500", 
      description: "Evaluates technical feasibility and identifies potential challenges in implementing the user story."
    }
  ];

  return (
    <div className="min-h-screen px-4 py-12 sm:py-20 bg-gradient-to-br from-background via-accent/20 to-background/90">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16 animate-slide-down">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <BookText className="h-3.5 w-3.5" />
            About Story Gen
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight ai-text-gradient">
            Transforming Requirements into User Stories
          </h1>
          
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
            Story Gen uses advanced AI to turn ideas and requirements into comprehensive, 
            ready-to-implement user stories for Agile development teams.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">
                <Zap className="mr-1" />
                Try It Now
              </Link>
            </Button>
          </div>
        </header>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="glass-panel p-6 mb-12">
            <div className="grid gap-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="rounded-full bg-primary/10 p-3 text-primary shrink-0">
                  <Cpu size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI-Powered User Story Generation</h3>
                  <p className="text-foreground/80">
                    Story Gen employs a sophisticated AI system that simulates an entire Agile team workflow.
                    By analyzing your requirements, our AI generates comprehensive user stories that include
                    all necessary components for successful development.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="rounded-full bg-primary/10 p-3 text-primary shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Multiple AI Agents Collaboration</h3>
                  <p className="text-foreground/80">
                    Each user story is crafted through the collaboration of four specialized AI agents,
                    each bringing unique expertise to ensure your stories are comprehensive and ready for implementation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our AI Agents</h2>
          <div className="grid gap-6">
            {agents.map((agent) => (
              <Agent 
                key={agent.name}
                name={agent.name}
                description={agent.description}
                icon={agent.icon}
                color={agent.color}
              />
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary/10">
              <CardContent className="p-6 h-full">
                <h3 className="font-semibold text-lg mb-3">Time Savings</h3>
                <p className="text-muted-foreground">
                  Create comprehensive user stories in seconds rather than hours of meetings and discussions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/10">
              <CardContent className="p-6 h-full">
                <h3 className="font-semibold text-lg mb-3">Consistency</h3>
                <p className="text-muted-foreground">
                  Ensure all user stories follow the same format and include all necessary details.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/10">
              <CardContent className="p-6 h-full">
                <h3 className="font-semibold text-lg mb-3">Quality Assurance</h3>
                <p className="text-muted-foreground">
                  Every story includes carefully crafted acceptance criteria for proper testing and validation.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/10">
              <CardContent className="p-6 h-full">
                <h3 className="font-semibold text-lg mb-3">Team Alignment</h3>
                <p className="text-muted-foreground">
                  Provide developers, testers, and stakeholders with a clear, shared understanding of requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <div className="text-center">
          <Button asChild size="lg">
            <Link to="/">
              <Bot className="mr-1" />
              Generate Your First Story
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
