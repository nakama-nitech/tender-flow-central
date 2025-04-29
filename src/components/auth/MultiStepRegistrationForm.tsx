
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useRegisterForm } from './hooks/useRegisterForm';
import { CompanyType, Category, CountryLocations } from './RegisterFormTypes';
import { Step1AccountDetails } from './registration-steps/Step1AccountDetails';
import { Step2CompanyInfo } from './registration-steps/Step2CompanyInfo';
import { Step3ContactCategories } from './registration-steps/Step3ContactCategories';
import { Progress } from '@/components/ui/progress';

interface MultiStepRegistrationFormProps {
  companyTypes: CompanyType[];
  categories: Category[];
  availableLocations: string[];
  countryLocations: CountryLocations;
}

export const MultiStepRegistrationForm: React.FC<MultiStepRegistrationFormProps> = ({
  companyTypes,
  categories,
  availableLocations,
  countryLocations
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const {
    registerForm,
    setRegisterForm,
    registerFormErrors,
    setRegisterFormErrors,
    emailAlreadyExists,
    isSubmitting,
    handleRegisterSubmit,
    checkEmailExists,  // Make sure this is properly extracted
    loginForm,
    setLoginForm
  } = useRegisterForm(setSearchParams);
  
  // Calculate progress percentage
  const progressPercentage = ((registerForm.currentStep) / 3) * 100;
  
  const nextStep = () => {
    let canProceed = true;
    
    // Validate current step before proceeding
    if (registerForm.currentStep === 1) {
      const errors: {[key: string]: string} = {};
      
      if (!registerForm.email) errors.email = 'Email is required';
      if (!registerForm.password) errors.password = 'Password is required';
      if (registerForm.password.length < 6) errors.password = 'Password must be at least 6 characters';
      if (registerForm.password !== registerForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';
      
      setRegisterFormErrors(errors);
      canProceed = Object.keys(errors).length === 0 && !emailAlreadyExists;
    }
    
    if (registerForm.currentStep === 2) {
      const errors: {[key: string]: string} = {};
      
      if (!registerForm.companyType) errors.companyType = 'Company type is required';
      if (!registerForm.companyName) errors.companyName = 'Company name is required';
      if (!registerForm.location) errors.location = 'Location is required';
      
      setRegisterFormErrors(errors);
      canProceed = Object.keys(errors).length === 0;
    }
    
    if (canProceed) {
      setRegisterForm({
        ...registerForm,
        currentStep: Math.min(registerForm.currentStep + 1, 3)
      });
    }
  };
  
  const prevStep = () => {
    setRegisterForm({
      ...registerForm,
      currentStep: Math.max(registerForm.currentStep - 1, 1)
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation for the last step
    if (registerForm.currentStep === 3) {
      const errors: {[key: string]: string} = {};
      
      if (!registerForm.contactName) errors.contactName = 'Contact name is required';
      if (!registerForm.phoneNumber) errors.phoneNumber = 'Phone number is required';
      if (!registerForm.kraPin) errors.kraPin = 'KRA PIN is required';
      if (registerForm.categoriesOfInterest.length === 0) errors.categoriesOfInterest = 'Please select at least one category';
      if (!registerForm.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms and conditions';
      
      setRegisterFormErrors(errors);
      
      if (Object.keys(errors).length === 0) {
        // Submit the form
        handleRegisterSubmit(e);
      }
    }
  };
  
  // Add debug logging to verify function presence
  console.log("checkEmailExists is defined in MultiStepRegistrationForm:", !!checkEmailExists, typeof checkEmailExists);
  
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-2">Step {registerForm.currentStep} of 3</h3>
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      <form onSubmit={handleSubmit}>
        {registerForm.currentStep === 1 && (
          <Step1AccountDetails 
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            registerFormErrors={registerFormErrors}
            setRegisterFormErrors={setRegisterFormErrors}
            emailAlreadyExists={emailAlreadyExists}
            checkEmailExists={checkEmailExists} // Ensure we're passing the function
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            setSearchParams={setSearchParams}
          />
        )}
        
        {registerForm.currentStep === 2 && (
          <Step2CompanyInfo 
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            registerFormErrors={registerFormErrors}
            setRegisterFormErrors={setRegisterFormErrors}
            companyTypes={companyTypes}
            countryLocations={countryLocations}
          />
        )}
        
        {registerForm.currentStep === 3 && (
          <Step3ContactCategories 
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            registerFormErrors={registerFormErrors}
            setRegisterFormErrors={setRegisterFormErrors}
            categories={categories}
            availableLocations={availableLocations}
          />
        )}
        
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center">
            {registerForm.currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            {registerForm.currentStep === 1 && (
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
          
          {registerForm.currentStep < 3 ? (
            <Button type="button" onClick={nextStep}>
              Next
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
      </form>
    </div>
  );
};
