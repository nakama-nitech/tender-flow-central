
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

  // Add debug logging to verify the function exists
  console.log("useRegisterForm: checkEmailExists function exists:", !!checkEmailExists, typeof checkEmailExists);

  // Create a stable wrapper around checkEmailExists to prevent unnecessary rerenders
  // and ensure we're always passing a function even if something goes wrong
  const safeCheckEmailExists = useCallback(async (email: string): Promise<boolean> => {
    console.log("safeCheckEmailExists called with:", email);
    if (typeof checkEmailExists !== 'function') {
      console.error("checkEmailExists is not available in useRegisterForm!", checkEmailExists);
      return false;
    }
    
    try {
      return await checkEmailExists(email);
    } catch (error) {
      console.error("Error in safeCheckEmailExists:", error);
      return false;
    }
  }, [checkEmailExists]);

  // Wrap the onSubmit function in useCallback to prevent unnecessary rerenders
  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use our safe wrapper function instead
    if (registerForm.email) {
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
    }
    
    if (!validateRegisterForm(registerForm)) {
      return;
    }
    
    // Store the form state in window for access in the submit handler
    // This works around the TypeScript argument mismatch error
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
    checkEmailExists: safeCheckEmailExists, // Return our safe wrapper instead of the original
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
