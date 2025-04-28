
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterFormState, RegisterFormErrors } from '@/components/auth/RegisterFormTypes';

/**
 * Custom hook for managing registration form state and validation
 */
export const useRegistrationForm = (setSearchParams: any) => {
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

  /**
   * Handle form submission
   */
  const handleRegisterSubmit = async (e: React.FormEvent, form: RegisterFormState) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to auth page for login after successful registration
      navigate('/auth?tab=login');
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
    isSubmitting,
    handleRegisterSubmit,
    loginForm,
    setLoginForm
  };
};

export default useRegistrationForm;
