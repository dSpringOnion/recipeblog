'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface InstructionsStepsProps {
  instructions: string;
}

export function InstructionsSteps({ instructions }: InstructionsStepsProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Extract steps from markdown (assuming numbered list format)
  const steps = instructions
    .split(/\n\d+\.\s/)
    .filter(step => step.trim().length > 0)
    .map((step, index) => ({
      id: index,
      content: step.trim(),
      hasTimer: /\d+\s*(?:minutes?|mins?|seconds?|secs?)/i.test(step)
    }));

  const toggleStep = (stepId: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const startTimer = (minutes: number, stepId: number) => {
    setActiveTimer(stepId);
    setTimeLeft(minutes * 60);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setActiveTimer(null);
          // You could add notification here
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Instructions
          <Badge variant="outline">
            {completedSteps.size} / {steps.length} completed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isActiveTimer = activeTimer === step.id;
            
            return (
              <div
                key={step.id}
                className={`p-4 rounded-lg border transition-colors ${
                  isCompleted 
                    ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                    : 'bg-background border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStep(step.id)}
                    className={`mt-1 h-6 w-6 p-0 ${
                      isCompleted ? 'text-green-600' : 'text-muted-foreground'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">Step {index + 1}</span>
                      {step.hasTimer && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Timer
                        </Badge>
                      )}
                    </div>
                    
                    <div className={`prose prose-sm max-w-none ${
                      isCompleted ? 'line-through text-muted-foreground' : ''
                    }`}>
                      <ReactMarkdown>{step.content}</ReactMarkdown>
                    </div>
                    
                    {step.hasTimer && (
                      <div className="mt-3 flex items-center gap-2">
                        {isActiveTimer ? (
                          <div className="flex items-center gap-2">
                            <div className="text-lg font-mono font-bold text-blue-600">
                              {formatTime(timeLeft)}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActiveTimer(null);
                                setTimeLeft(0);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Extract time from step content (basic implementation)
                              const timeMatch = step.content.match(/(\d+)\s*(?:minutes?|mins?)/i);
                              if (timeMatch) {
                                startTimer(parseInt(timeMatch[1]), step.id);
                              }
                            }}
                            className="text-xs"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Start Timer
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {completedSteps.size === steps.length && steps.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
              🎉 Recipe Complete!
            </h3>
            <p className="text-green-700 dark:text-green-300">
              Great job! Your dish should be ready to enjoy.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}