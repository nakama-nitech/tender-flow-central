
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface RegistrationProgressProps {
  currentStep: number;
  progressPercentage: number;
}

export const RegistrationProgress: React.FC<RegistrationProgressProps> = ({ 
  currentStep, 
  progressPercentage 
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-medium mb-2">Step {currentStep} of 3</h3>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};
