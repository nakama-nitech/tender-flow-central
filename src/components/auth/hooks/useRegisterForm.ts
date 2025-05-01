
import { useState } from 'react';
import { RegisterFormState, RegisterFormErrors } from '../types/formTypes';
import { useEmailCheck } from './useEmailCheck';
import { useFormValidation } from './useFormValidation';
import { useRegisterSubmit } from './useRegisterSubmit';

const initialFormState: RegisterFormState = {
  email: '',
  password: '',
  confirmPassword: '',
  companyType: '',
  companyName: '',
  location: '',
  country: 'Kenya',
  contactName: '',
  phoneNumber: '',
  kraPin: '',
  physicalAddress: '',
  websiteUrl: '',
  categoriesOfInterest: [],
  supplyLocations: [],
  agreeToTerms: false,
  currentStep: 1  // Start at step 1
};

export const useRegisterForm = (
  setSearchParams: React.Dispatch<React.SetStateAction<URLSearchParams>>,
  navigate?: any // Make navigate optional
) => {
  const [registerForm, setRegisterForm] = useState<RegisterFormState>(initialFormState);
  const [loginForm, setLoginForm] = useState<{ email: string; password: string }>({ email: '', password: '' });
  
  // Get email check functionality from our custom hook
  const { 
    emailAlreadyExists, 
    setEmailAlreadyExists, 
    checkEmailExists, 
    isChecking 
  } = useEmailCheck();
  
  const { registerFormErrors, setRegisterFormErrors, validateRegisterForm } = useFormValidation();
  
  const { isSubmitting, handleRegisterSubmit } = useRegisterSubmit(
    setSearchParams,
    setLoginForm,
    setRegisterFormErrors,
    registerFormErrors
  );
  
  // Create a wrapper for checkEmailExists to ensure it's always a function
  const safeCheckEmailExists = async (email: string): Promise<boolean> => {
    console.log("[useRegisterForm] safeCheckEmailExists called with:", email);
    if (typeof checkEmailExists === 'function') {
      try {
        return await checkEmailExists(email);
      } catch (error) {
        console.error("[useRegisterForm] Error in safeCheckEmailExists:", error);
        return false;
      }
    } else {
      console.error("[useRegisterForm] checkEmailExists is not a function!");
      return false;
    }
  };
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug check - ensure the function exists
    console.log("[useRegisterForm] onSubmit: checkEmailExists available:", typeof checkEmailExists);
    
    // Only check email if we have one
    if (registerForm.email && typeof checkEmailExists === 'function') {
      try {
        const emailExists = await checkEmailExists(registerForm.email);
        
        // If email exists, don't proceed with form validation and submission
        if (emailExists) {
          console.log("[useRegisterForm] Email exists, stopping submission");
          setRegisterFormErrors({
            ...registerFormErrors,
            email: 'Email is already registered'
          });
          return;
        }
      } catch (error) {
        console.error("[useRegisterForm] Error checking email:", error);
        // Continue with form submission even if email check fails
      }
    }
    
    if (!validateRegisterForm(registerForm)) {
      return;
    }
    
    // Store the form state in window for access in the submit handler
    window.registerFormState = registerForm;
    
    await handleRegisterSubmit(e);
  };

  return {
    registerForm,
    setRegisterForm,
    registerFormErrors,
    setRegisterFormErrors,
    emailAlreadyExists,
    setEmailAlreadyExists,
    isSubmitting,
    checkEmailExists: safeCheckEmailExists, // Return the safe wrapper instead
    isChecking,
    loginForm,
    setLoginForm,
    handleRegisterSubmit: onSubmit
  };
};

// Add type declaration for the window object to include registerFormState
declare global {
  interface Window {
    registerFormState?: RegisterFormState;
  }
}
