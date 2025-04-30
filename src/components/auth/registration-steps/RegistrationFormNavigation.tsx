
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RegistrationFormNavigationProps {
  currentStep: number;
  handlePreviousStep: () => void;
  handleNextStep: () => Promise<void> | void;
  isSubmitting: boolean;
  emailAlreadyExists: boolean;
  setSearchParams: React.Dispatch<React.SetStateAction<URLSearchParams>>;
}

export const RegistrationFormNavigation: React.FC<RegistrationFormNavigationProps> = ({
  currentStep,
  handlePreviousStep,
  handleNextStep,
  isSubmitting,
  emailAlreadyExists,
  setSearchParams
}) => {
  return (
    <div className="flex items-center justify-between mt-8">
      <div>
        {currentStep > 1 && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handlePreviousStep}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
        )}
      </div>
      <div className="flex items-center">
        <span className="text-sm mr-4">
          {currentStep < 3 ? (
            <>You have an account? <Button variant="link" className="p-0" type="button" onClick={() => {
              setSearchParams(params => {
                const newParams = new URLSearchParams(params);
                newParams.set('tab', 'login');
                return newParams;
              });
            }}>Sign In</Button></>
          ) : null}
        </span>
        {currentStep < 3 ? (
          <Button 
            type="button" 
            onClick={handleNextStep}
            disabled={isSubmitting || emailAlreadyExists}
            className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 flex items-center"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
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
            ) : "Complete Registration"}
          </Button>
        )}
      </div>
    </div>
  );
};
