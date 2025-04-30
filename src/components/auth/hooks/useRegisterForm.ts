
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
    checkEmailExists: originalCheckEmailExists, 
    isChecking 
  } = useEmailCheck();
  
  console.log("[useRegisterForm] Initialized with checkEmailExists function:", !!originalCheckEmailExists, typeof originalCheckEmailExists);
  
  const { registerFormErrors, setRegisterFormErrors, validateRegisterForm } = useFormValidation();
  
  const { isSubmitting, handleRegisterSubmit } = useRegisterSubmit(
    setSearchParams,
    setLoginForm,
    setRegisterFormErrors,
    registerFormErrors
  );

  // Create a stable wrapper around checkEmailExists to prevent unnecessary rerenders
  // and ensure we're always passing a function even if something goes wrong
  const checkEmailExists = useCallback(async (email: string): Promise<boolean> => {
    console.log("[useRegisterForm] checkEmailExists called with:", email);
    
    // Check if originalCheckEmailExists is available
    if (typeof originalCheckEmailExists !== 'function') {
      console.error("[useRegisterForm] originalCheckEmailExists is not a function! Using fallback");
      return false; // Fallback behavior
    }
    
    try {
      // Call the actual function from useEmailCheck
      return await originalCheckEmailExists(email);
    } catch (error) {
      console.error("[useRegisterForm] Error in checkEmailExists:", error);
      return false;
    }
  }, [originalCheckEmailExists]);

  // Wrap the onSubmit function in useCallback to prevent unnecessary rerenders
  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug check - ensure the function exists
    console.log("[useRegisterForm] onSubmit: checkEmailExists available:", !!checkEmailExists);
    
    // Only check email if we have one and the check function exists
    if (registerForm.email && checkEmailExists) {
      try {
        const emailExists = await checkEmailExists(registerForm.email);
        
        // If email exists, don't proceed with form validation and submission
        if (emailExists) {
          console.log("[useRegisterForm] Email exists, stopping submission");
          return;
        }
      } catch (error) {
        console.error("[useRegisterForm] Error checking if email exists:", error);
        // Continue with form submission even if email check fails
      }
    } else {
      console.warn("[useRegisterForm] Cannot check if email exists - function not available or email empty");
    }
    
    if (!validateRegisterForm(registerForm)) {
      return;
    }
    
    // Store the form state in window for access in the submit handler
    window.registerFormState = registerForm;
    
    await handleRegisterSubmit(e);
  }, [registerForm, checkEmailExists, validateRegisterForm, handleRegisterSubmit]);

  return {
    registerForm,
    setRegisterForm,
    registerFormErrors,
    setRegisterFormErrors,
    emailAlreadyExists,
    setEmailAlreadyExists,
    isSubmitting,
    checkEmailExists, // Return our wrapper function
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
