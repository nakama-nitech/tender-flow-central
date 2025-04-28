
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterFormState, RegisterFormErrors } from './RegisterFormTypes';
import { useEmailCheck } from './hooks/useEmailCheck';

export const useRegisterForm = (setSearchParams: any) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { emailAlreadyExists, setEmailAlreadyExists, checkEmailExists } = useEmailCheck();
  
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

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerFormErrors, setRegisterFormErrors] = useState<RegisterFormErrors>({});

  const validateForm = () => {
    const errors: RegisterFormErrors = {};
    
    if (!registerForm.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!registerForm.password) {
      errors.password = 'Password is required';
    } else if (registerForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    if (!registerForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!registerForm.companyType) {
      errors.companyType = 'Please select a company type';
    }
    
    if (!registerForm.companyName) {
      errors.companyName = 'Company name is required';
    }
    
    if (!registerForm.location) {
      errors.location = 'Location is required';
    }
    
    if (!registerForm.contactName) {
      errors.contactName = 'Contact name is required';
    }
    
    if (!registerForm.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d+$/.test(registerForm.phoneNumber)) {
      errors.phoneNumber = 'Phone number must contain only digits';
    }
    
    if (!registerForm.kraPin) {
      errors.kraPin = 'KRA PIN is required';
    }
    
    if (registerForm.categoriesOfInterest.length === 0) {
      errors.categoriesOfInterest = 'Please select at least one category';
    }
    
    if (!registerForm.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setRegisterFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailExists = await checkEmailExists(registerForm.email);
    
    if (emailExists) {
      return;
    }
    
    const isValid = validateForm();
    
    if (!isValid) {
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRegisterForm({
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
      });
      
      setLoginForm({ ...loginForm, email: registerForm.email });
      setSearchParams(params => {
        params.set('tab', 'login');
        return params;
      });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};
