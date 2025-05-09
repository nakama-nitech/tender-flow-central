import { useState, useCallback } from 'react';
import { RegisterFormState, RegisterFormErrors } from '../types/formTypes';
import { useEmailCheck } from './useEmailCheck';
import { useFormValidation } from './useFormValidation';
import { useRegisterSubmit } from './useRegisterSubmit';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phoneNumber: string;
}

const initialFormState: RegisterFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  companyName: '',
  phoneNumber: ''
};

export const useRegisterForm = (
  setSearchParams?: (params: URLSearchParams) => void,
  navigate?: (path: string) => void
) => {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { checkEmailExists, isChecking } = useEmailCheck();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  }, []);

  const validateForm = useCallback(() => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  }, [formData]);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Check if email exists
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        setError('Email already registered. Please use a different email or try logging in.');
        return;
      }

      // Proceed with registration
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company_name: formData.companyName,
            phone_number: formData.phoneNumber
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      toast.success('Registration successful! Please check your email to verify your account.');
      setFormData(initialFormState);

      // Navigate to login page if navigation is available
      if (navigate) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, checkEmailExists, navigate]);

  return {
    formData,
    handleChange,
    onSubmit,
    isLoading,
    error,
    isChecking
  };
};

// Add type declaration for the window object to include registerFormState
declare global {
  interface Window {
    registerFormState?: RegisterFormState;
  }
}
