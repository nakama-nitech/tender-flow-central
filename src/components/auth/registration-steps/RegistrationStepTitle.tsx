
import React from 'react';
import { Building, User, Briefcase } from 'lucide-react';

interface RegistrationStepTitleProps {
  currentStep: number;
}

export const RegistrationStepTitle: React.FC<RegistrationStepTitleProps> = ({ currentStep }) => {
  switch(currentStep) {
    case 1:
      return (
        <div className="text-lg font-medium flex items-center mb-6">
          <User className="h-5 w-5 mr-2 text-primary" />
          <span>Account Details</span>
        </div>
      );
    case 2:
      return (
        <div className="text-lg font-medium flex items-center mb-6">
          <Building className="h-5 w-5 mr-2 text-primary" />
          <span>Company Details</span>
        </div>
      );
    case 3:
      return (
        <div className="text-lg font-medium flex items-center mb-6">
          <Briefcase className="h-5 w-5 mr-2 text-primary" />
          <span>Preferences & Contact</span>
        </div>
      );
    default:
      return null;
  }
};
