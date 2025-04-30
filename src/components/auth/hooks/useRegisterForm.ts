
import { useState, useCallback } from 'react';
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

  // Create a stable wrapper around checkEmailExists to prevent unnecessary rerenders
  // and ensure we're always passing a function even if something goes wrong
  const safeCheckEmailExists = useCallback(async (email: string): Promise<boolean> => {
    console.log("safeCheckEmailExists called with:", email);
    if (!checkEmailExists) {
      console.error("checkEmailExists is not available! Using fallback");
      return false; // Fallback behavior
    }
    
    try {
      // Call the actual function from useEmailCheck
      return await checkEmailExists(email);
    } catch (error) {
      console.error("Error in safeCheckEmailExists:", error);
      return false;
    }
  }, [checkEmailExists]);

  // Wrap the onSubmit function in useCallback to prevent unnecessary rerenders
  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure the email check function exists
    console.log("onSubmit: checkEmailExists available:", !!safeCheckEmailExists);
    
    // Use our safe wrapper function
    if (registerForm.email && safeCheckEmailExists) {
      try {
        const emailExists = await safeCheckEmailExists(registerForm.email);
        
        // If email exists, don't proceed with form validation and submission
        if (emailExists) {
          return;
        }
      } catch (error) {
        console.error("Error checking if email exists:", error);
        // Continue with form submission even if email check fails
      }
    } else {
      console.warn("Cannot check if email exists - function not available or email empty");
    }
    
    if (!validateRegisterForm(registerForm)) {
      return;
    }
    
    // Store the form state in window for access in the submit handler
    window.registerFormState = registerForm;
    
    await handleRegisterSubmit(e);
  }, [registerForm, safeCheckEmailExists, validateRegisterForm, handleRegisterSubmit]);

  console.log("useRegisterForm hook initialized with checkEmailExists:", !!checkEmailExists);

  return {
    registerForm,
    setRegisterForm,
    registerFormErrors,
    setRegisterFormErrors,
    emailAlreadyExists,
    setEmailAlreadyExists,
    isSubmitting,
    checkEmailExists: safeCheckEmailExists, // Return our safe wrapper
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
