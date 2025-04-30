
import React from 'react';

interface RegistrationStepIndicatorProps {
  currentStep: number;
}

export const RegistrationStepIndicator: React.FC<RegistrationStepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-2">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center
                ${currentStep === step 
                  ? 'bg-primary text-white' 
                  : currentStep > step 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'}`}
            >
              {currentStep > step ? '✓' : step}
            </div>
            {step < 3 && (
              <div className={`w-20 h-1 ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
