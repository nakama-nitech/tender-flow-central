
import { useState } from 'react';
import { RegisterFormState, LoginFormState } from '../types/formTypes';
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
  agreeToTerms: false
};

export const useRegisterForm = (setSearchParams: React.Dispatch<React.SetStateAction<URLSearchParams>>) => {
  const [registerForm, setRegisterForm] = useState<RegisterFormState>(initialFormState);
  const [loginForm, setLoginForm] = useState<LoginFormState>({ email: '', password: '' });
  
  // Use our custom hooks
  const { emailAlreadyExists, setEmailAlreadyExists, checkEmailExists } = useEmailCheck();
  const { registerFormErrors, setRegisterFormErrors, validateRegisterForm } = useFormValidation();
  const { isSubmitting, handleRegisterSubmit } = useRegisterSubmit(
    setSearchParams,
    setLoginForm,
    setRegisterFormErrors,
    registerFormErrors
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email exists before proceeding with validation
    if (registerForm.email) {
      const emailExists = await checkEmailExists(registerForm.email);
      
      // If email exists, don't proceed with form validation and submission
      if (emailExists) {
        return;
      }
    }
    
    if (!validateRegisterForm(registerForm)) {
      return;
    }
    
    await handleRegisterSubmit(e, registerForm);
  };

  return {
    registerForm,
    setRegisterForm,
    registerFormErrors,
    setRegisterFormErrors,
    emailAlreadyExists,
    setEmailAlreadyExists,
    isSubmitting,
    checkEmailExists,
    loginForm,
    setLoginForm,
    handleRegisterSubmit: onSubmit
  };
};
