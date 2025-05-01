
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useRegisterForm } from './hooks/useRegisterForm';
import { CompanyType, Category, CountryLocations } from './RegisterFormTypes';
import { RegistrationStepIndicator } from './registration-steps/RegistrationStepIndicator';
import { RegistrationStepTitle } from './registration-steps/RegistrationStepTitle';
import { RegistrationStep1 } from './registration-steps/RegistrationStep1';
import { RegistrationStep2 } from './registration-steps/RegistrationStep2';
import { RegistrationStep3 } from './registration-steps/RegistrationStep3';
import { RegistrationFormNavigation } from './registration-steps/RegistrationFormNavigation';

interface RegistrationFormProps {
  companyTypes: CompanyType[];
  categories: Category[];
  availableLocations: string[];
  countryLocations: CountryLocations;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  companyTypes, 
  categories, 
  availableLocations,
  countryLocations
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const {
    registerForm,
    setRegisterForm,
    registerFormErrors,
    setRegisterFormErrors,
    emailAlreadyExists,
    setEmailAlreadyExists,
    isSubmitting,
    handleRegisterSubmit,
    checkEmailExists,
    loginForm,
    setLoginForm
  } = useRegisterForm(setSearchParams, navigate);

  // Check if checkEmailExists is defined
  console.log("[RegistrationForm] checkEmailExists available:", typeof checkEmailExists);

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};
    
    if (step === 1) {
      // Email validation
      if (!registerForm.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      // Password validation
      if (!registerForm.password) {
        errors.password = 'Password is required';
      } else if (registerForm.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
      }
      
      // Confirm password
      if (!registerForm.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (registerForm.password !== registerForm.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 2) {
      // Company type validation
      if (!registerForm.companyType) {
        errors.companyType = 'Please select a company type';
      }
      
      // Company name validation
      if (!registerForm.companyName) {
        errors.companyName = 'Company name is required';
      }
      
      // Location validation
      if (!registerForm.location) {
        errors.location = 'Location is required';
      }
      
      // KRA PIN validation
      if (!registerForm.kraPin) {
        errors.kraPin = 'KRA PIN is required';
      }
    } else if (step === 3) {
      // Contact name validation
      if (!registerForm.contactName) {
        errors.contactName = 'Contact name is required';
      }
      
      // Phone number validation
      if (!registerForm.phoneNumber) {
        errors.phoneNumber = 'Phone number is required';
      } else if (!/^\d+$/.test(registerForm.phoneNumber)) {
        errors.phoneNumber = 'Phone number must contain only digits';
      }
      
      // Categories validation
      if (registerForm.categoriesOfInterest.length === 0) {
        errors.categoriesOfInterest = 'Please select at least one category';
      }
      
      // Terms validation
      if (!registerForm.agreeToTerms) {
        errors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }
    
    setRegisterFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      // Check if email exists before proceeding to next step
      if (typeof checkEmailExists === 'function' && registerForm.email) {
        try {
          const emailExists = await checkEmailExists(registerForm.email);
          if (emailExists) {
            return; // Don't proceed if email exists
          }
        } catch (error) {
          console.error("[RegistrationForm] Error checking email:", error);
        }
      } else {
        console.warn("[RegistrationForm] checkEmailExists not available or email empty when attempting to check");
      }
    }
    
    const isValid = validateStep(currentStep);
    if (isValid) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateStep(currentStep);
    if (isValid) {
      handleRegisterSubmit(e);
    }
  };

  const renderCurrentStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <RegistrationStep1
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            registerFormErrors={registerFormErrors}
            setRegisterFormErrors={setRegisterFormErrors}
            emailAlreadyExists={emailAlreadyExists}
            setEmailAlreadyExists={setEmailAlreadyExists}
            checkEmailExists={checkEmailExists}
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            setSearchParams={setSearchParams}
          />
        );
      case 2:
        return (
          <RegistrationStep2
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            registerFormErrors={registerFormErrors}
            setRegisterFormErrors={setRegisterFormErrors}
            companyTypes={companyTypes}
            countryLocations={countryLocations}
          />
        );
      case 3:
        return (
          <RegistrationStep3
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            registerFormErrors={registerFormErrors}
            setRegisterFormErrors={setRegisterFormErrors}
            categories={categories}
            availableLocations={availableLocations}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={submitForm}>
      <RegistrationStepIndicator currentStep={currentStep} />
      <RegistrationStepTitle currentStep={currentStep} />
      {renderCurrentStep()}
      <RegistrationFormNavigation 
        currentStep={currentStep}
        handlePreviousStep={handlePreviousStep}
        handleNextStep={handleNextStep}
        isSubmitting={isSubmitting}
        emailAlreadyExists={emailAlreadyExists}
        setSearchParams={setSearchParams}
      />
    </form>
  );
};
