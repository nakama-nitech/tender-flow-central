
import React from 'react';
import { Button } from '@/components/ui/button';

interface RegistrationNavigationProps {
  currentStep: number;
  prevStep: () => void;
  nextStep: () => Promise<void> | void;
  isSubmitting: boolean;
  isChecking: boolean;
  emailAlreadyExists: boolean;
  setSearchParams: React.Dispatch<React.SetStateAction<URLSearchParams>>;
}

export const RegistrationNavigation: React.FC<RegistrationNavigationProps> = ({
  currentStep,
  prevStep,
  nextStep,
  isSubmitting,
  isChecking,
  emailAlreadyExists,
  setSearchParams
}) => {
  return (
    <div className="flex items-center justify-between mt-8">
      <div className="flex items-center">
        {currentStep > 1 && (
          <Button type="button" variant="outline" onClick={prevStep}>
            Previous
          </Button>
        )}
        {currentStep === 1 && (
          <div className="flex items-center">
            <span className="text-sm">Already have an account?</span>
            <Button variant="link" className="p-0 ml-1" type="button" onClick={() => {
              setSearchParams(params => {
                const newParams = new URLSearchParams(params);
                newParams.set('tab', 'login');
                return newParams;
              });
            }}>
              Sign In
            </Button>
          </div>
        )}
      </div>
      
      {currentStep < 3 ? (
        <Button 
          type="button" 
          onClick={nextStep}
          disabled={isSubmitting || isChecking || emailAlreadyExists}
        >
          {isChecking ? "Checking..." : "Next"}
        </Button>
      ) : (
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700"
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Creating account...
            </>
          ) : "Sign Up"}
        </Button>
      )}
    </div>
  );
};
