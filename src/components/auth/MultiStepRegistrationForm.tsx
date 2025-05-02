
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useRegisterForm } from './hooks/useRegisterForm';
import { CompanyType, Category, CountryLocations } from './RegisterFormTypes';
import { Step1AccountDetails } from './registration-steps/Step1AccountDetails';
import { Step2CompanyInfo } from './registration-steps/Step2CompanyInfo';
import { Step3ContactCategories } from './registration-steps/Step3ContactCategories';
import { RegistrationProgress } from './registration-steps/RegistrationProgress';
import { RegistrationNavigation } from './registration-steps/RegistrationNavigation';

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
    checkEmailExists,
    isChecking,
    loginForm,
    setLoginForm
  } = useRegisterForm(setSearchParams);
  
  // Debug log to confirm checkEmailExists is available
  console.log("[MultiStepRegistrationForm] checkEmailExists function exists:", 
              !!checkEmailExists, typeof checkEmailExists);
  
  // Calculate progress percentage
  const progressPercentage = ((registerForm.currentStep) / 3) * 100;
  
  const nextStep = async () => {
    let canProceed = true;
    
    // Validate current step before proceeding
    if (registerForm.currentStep === 1) {
      const errors: {[key: string]: string} = {};
      
      if (!registerForm.email) errors.email = 'Email is required';
      if (!registerForm.password) errors.password = 'Password is required';
      if (registerForm.password.length < 6) errors.password = 'Password must be at least 6 characters';
      if (registerForm.password !== registerForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';
      
      setRegisterFormErrors(errors);
      
      // Check if email exists before proceeding
      if (registerForm.email && !errors.email && typeof checkEmailExists === 'function') {
        try {
          console.log("[MultiStepRegistrationForm] About to check email existence");
          const exists = await checkEmailExists(registerForm.email);
          if (exists) {
            console.log("[MultiStepRegistrationForm] Email exists, preventing next step");
            canProceed = false;
          }
        } catch (error) {
          console.error("[MultiStepRegistrationForm] Error checking email in nextStep:", error);
          // Continue even if email check fails
        }
      }
      
      canProceed = canProceed && Object.keys(errors).length === 0 && !emailAlreadyExists;
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
  
  return (
    <div className="space-y-6">
      <RegistrationProgress currentStep={registerForm.currentStep} progressPercentage={progressPercentage} />
      
      <form onSubmit={handleSubmit}>
        {registerForm.currentStep === 1 && (
          <Step1AccountDetails 
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            registerFormErrors={registerFormErrors}
            setRegisterFormErrors={setRegisterFormErrors}
            emailAlreadyExists={emailAlreadyExists}
            checkEmailExists={checkEmailExists}
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
        
        <RegistrationNavigation 
          currentStep={registerForm.currentStep}
          prevStep={prevStep}
          nextStep={nextStep}
          isSubmitting={isSubmitting}
          isChecking={isChecking}
          emailAlreadyExists={emailAlreadyExists}
          setSearchParams={setSearchParams}
        />
      </form>
    </div>
  );
};
