
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';
import CompanyDetailsStep from './CompanyDetailsStep';
import ContactDetailsStep from './ContactDetailsStep';
import AccountDetailsStep from './AccountDetailsStep';
import { CompanyType, Category, CountryLocations } from '../RegisterFormTypes';

interface RegistrationStepsProps {
  registerForm: any;
  setRegisterForm: (form: any) => void;
  registerFormErrors: any;
  setRegisterFormErrors: (errors: any) => void;
  emailAlreadyExists: boolean;
  setEmailAlreadyExists: (exists: boolean) => void;
  checkEmailExists: (email: string) => Promise<boolean>;
  isSubmitting: boolean;
  handleRegisterSubmit: (e: React.FormEvent) => void;
  setLoginForm: (form: { email: string; password: string }) => void;
  setSearchParams: any;
  companyTypes: CompanyType[];
  categories: Category[];
  availableLocations: string[];
  countryLocations: CountryLocations;
}

const STEPS = [
  { name: 'Company Details', description: 'Enter your company information' },
  { name: 'Contact Details', description: 'Provide contact information' },
  { name: 'Account Setup', description: 'Create your login credentials' }
];

const RegistrationSteps: React.FC<RegistrationStepsProps> = ({
  registerForm,
  setRegisterForm,
  registerFormErrors,
  setRegisterFormErrors,
  emailAlreadyExists,
  setEmailAlreadyExists,
  checkEmailExists,
  isSubmitting,
  handleRegisterSubmit,
  setLoginForm,
  setSearchParams,
  companyTypes,
  categories,
  availableLocations,
  countryLocations
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [validatedSteps, setValidatedSteps] = useState<number[]>([]);
  
  // Update available locations when country changes
  useEffect(() => {
    if (registerForm.country && countryLocations[registerForm.country]) {
      // Do something if needed
    }
  }, [registerForm.country, countryLocations]);

  const validateStep = (step: number) => {
    const errors: { [key: string]: string } = {};
    
    if (step === 0) {
      // Validate company details
      if (!registerForm.companyType) errors.companyType = 'Please select a company type';
      if (!registerForm.companyName) errors.companyName = 'Company name is required';
      if (!registerForm.location) errors.location = 'Location is required';
    }
    
    else if (step === 1) {
      // Validate contact details
      if (!registerForm.contactName) errors.contactName = 'Contact name is required';
      if (!registerForm.phoneNumber) errors.phoneNumber = 'Phone number is required';
      else if (!/^\d+$/.test(registerForm.phoneNumber)) errors.phoneNumber = 'Phone number must contain only digits';
      if (!registerForm.kraPin) errors.kraPin = 'KRA PIN is required';
    }
    
    else if (step === 2) {
      // Validate account details
      if (!registerForm.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
        errors.email = 'Please enter a valid email address';
      } else if (emailAlreadyExists) {
        errors.email = 'This email is already registered';
      }
      
      if (!registerForm.password) {
        errors.password = 'Password is required';
      } else if (registerForm.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
      }
      
      if (!registerForm.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (registerForm.password !== registerForm.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      if (registerForm.categoriesOfInterest.length === 0) {
        errors.categoriesOfInterest = 'Please select at least one category';
      }
      
      if (!registerForm.agreeToTerms) {
        errors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }
    
    setRegisterFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    const isValid = validateStep(currentStep);
    
    if (isValid) {
      if (!validatedSteps.includes(currentStep)) {
        setValidatedSteps([...validatedSteps, currentStep]);
      }
      
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateStep(currentStep);
    if (isValid) {
      if (!validatedSteps.includes(currentStep)) {
        setValidatedSteps([...validatedSteps, currentStep]);
      }
      
      handleRegisterSubmit(e);
    }
  };

  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <form onSubmit={handleSubmitForm} className="space-y-6">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Step {currentStep + 1} of {STEPS.length}</span>
          <span>{STEPS[currentStep].name}</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>
      
      {/* Current step content */}
      <div className="py-4">
        {currentStep === 0 && (
          <CompanyDetailsStep
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            registerFormErrors={registerFormErrors}
            setRegisterFormErrors={setRegisterFormErrors}
            companyTypes={companyTypes}
          />
        )}
        
        {currentStep === 1 && (
          <ContactDetailsStep
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            registerFormErrors={registerFormErrors}
            setRegisterFormErrors={setRegisterFormErrors}
          />
        )}
        
        {currentStep === 2 && (
          <AccountDetailsStep
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            registerFormErrors={registerFormErrors}
            setRegisterFormErrors={setRegisterFormErrors}
            emailAlreadyExists={emailAlreadyExists}
            setEmailAlreadyExists={setEmailAlreadyExists}
            checkEmailExists={checkEmailExists}
            categories={categories}
            availableLocations={availableLocations}
            setLoginForm={setLoginForm}
            setSearchParams={setSearchParams}
          />
        )}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center">
          <span className="text-sm">You have an account?</span>
          <Button variant="link" className="p-0 ml-1" type="button" onClick={() => {
            const searchParams = new URLSearchParams();
            searchParams.set('tab', 'login');
            setSearchParams(searchParams);
          }}>
            Sign In
          </Button>
        </div>
        
        <div className="flex space-x-2">
          {currentStep > 0 && (
            <Button 
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          )}
          
          {currentStep < STEPS.length - 1 ? (
            <Button 
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Complete Registration
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default RegistrationSteps;
