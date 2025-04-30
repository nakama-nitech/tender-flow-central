
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
  
  console.log("[useRegisterForm] Initialized with checkEmailExists function:", !!checkEmailExists, typeof checkEmailExists);
  
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
    console.log("[useRegisterForm] safeCheckEmailExists called with:", email);
    
    // Check if checkEmailExists is available
    if (typeof checkEmailExists !== 'function') {
      console.error("[useRegisterForm] checkEmailExists is not a function! Using fallback");
      return false; // Fallback behavior
    }
    
    try {
      // Call the actual function from useEmailCheck
      return await checkEmailExists(email);
    } catch (error) {
      console.error("[useRegisterForm] Error in safeCheckEmailExists:", error);
      return false;
    }
  }, [checkEmailExists]);

  // Wrap the onSubmit function in useCallback to prevent unnecessary rerenders
  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug check - ensure the function exists
    console.log("[useRegisterForm] onSubmit: checkEmailExists available:", !!safeCheckEmailExists);
    
    // Only check email if we have one and the check function exists
    if (registerForm.email && safeCheckEmailExists) {
      try {
        const emailExists = await safeCheckEmailExists(registerForm.email);
        
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
  }, [registerForm, safeCheckEmailExists, validateRegisterForm, handleRegisterSubmit]);

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
