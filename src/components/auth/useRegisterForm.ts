import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterFormState, RegisterFormErrors } from './RegisterFormTypes';

export const useRegisterForm = (setSearchParams: any) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  
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

  const validateForm = () => {
    const errors: RegisterFormErrors = {};
    
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
    
    // KRA PIN validation
    if (!registerForm.kraPin) {
      errors.kraPin = 'KRA PIN is required';
    }
    
    // Categories validation
    if (registerForm.categoriesOfInterest.length === 0) {
      errors.categoriesOfInterest = 'Please select at least one category';
    }
    
    // Terms validation
    if (!registerForm.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setRegisterFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email exists before proceeding with validation
    const emailExists = await checkEmailExists(registerForm.email);
    
    // If email exists, don't proceed with form validation and submission
    if (emailExists) {
      return;
    }
    
    const isValid = validateForm();
    
    if (!isValid) {
      // Scroll to the first error
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form and navigate to success page or dashboard
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
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      // Handle API errors
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if email already exists in the system
  const checkEmailExists = async (email: string) => {
    if (!email) return false;
    
    try {
      // Simulate API call to check if email exists
      // For demo purposes, let's assume these emails are already registered
      const existingEmails = ['test@example.com', 'user@domain.com', 'admin@company.com'];
      
      // Wait for a brief moment to simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const exists = existingEmails.includes(email.toLowerCase());
      setEmailAlreadyExists(exists);
      
      return exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
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