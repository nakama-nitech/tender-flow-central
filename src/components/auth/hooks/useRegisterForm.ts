
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterFormState, RegisterFormErrors } from '../types/formTypes';
import { useRegisterSubmit } from './useRegisterSubmit';
import { useFormValidation } from './useFormValidation';

export const useRegisterForm = (setSearchParams: any) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initial form state
  const [registerForm, setRegisterForm] = useState<RegisterFormState>({
    email: '',
    password: '',
    confirmPassword: '',
    companyType: '',
    companyName: '',
    location: '',
    country: 'Kenya', // Default country
    contactName: '',
    phoneNumber: '',
    kraPin: '',
    physicalAddress: '',
    websiteUrl: '',
    categoriesOfInterest: [],
    supplyLocations: [],
    agreeToTerms: false
  });

  // Initial login form for seamless transfer to login tab
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Form validation errors
  const [registerFormErrors, setRegisterFormErrors] = useState<RegisterFormErrors>({});
  
  // Import form validation hook
  const { validateRegisterForm } = useFormValidation();
  
  // Import register submit hook
  const { handleRegisterSubmit: submitRegistration } = useRegisterSubmit(
    setSearchParams,
    setLoginForm,
    setRegisterFormErrors,
    registerFormErrors
  );

  const handleRegisterSubmit = async (e: React.FormEvent, form: RegisterFormState) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateRegisterForm(form)) {
      // Find the first error field
      const firstErrorField = Object.keys(registerFormErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitRegistration(e, form);
    } catch (error) {
      console.error('Registration submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    registerForm,
    setRegisterForm,
    registerFormErrors,
    setRegisterFormErrors,
    isSubmitting,
    handleRegisterSubmit,
    loginForm,
    setLoginForm
  };
};

export default useRegisterForm;
