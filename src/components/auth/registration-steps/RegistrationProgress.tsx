
import React from 'react';

interface RegistrationProgressProps {
  currentStep: number;
  progressPercentage: number;
}

export const RegistrationProgress: React.FC<RegistrationProgressProps> = ({ 
  currentStep, 
  progressPercentage 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-500">
        <div className={`${currentStep >= 1 ? 'font-medium text-primary' : ''}`}>Account Details</div>
        <div className={`${currentStep >= 2 ? 'font-medium text-primary' : ''}`}>Company Info</div>
        <div className={`${currentStep >= 3 ? 'font-medium text-primary' : ''}`}>Categories</div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-primary to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};
