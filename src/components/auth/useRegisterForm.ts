
import { useState, useCallback } from 'react';
import { RegisterFormState, RegisterFormErrors } from './RegisterFormTypes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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

interface LoginFormState {
  email: string;
  password: string;
}

export const useRegisterForm = (setSearchParams: React.Dispatch<React.SetStateAction<URLSearchParams>>) => {
  const [registerForm, setRegisterForm] = useState<RegisterFormState>(initialFormState);
  const [loginForm, setLoginForm] = useState<LoginFormState>({ email: '', password: '' });
  const [registerFormErrors, setRegisterFormErrors] = useState<RegisterFormErrors>({});
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateRegisterForm = () => {
    const errors: RegisterFormErrors = {};
    
    if (!registerForm.email) errors.email = "Email is required";
    if (!registerForm.password) errors.password = "Password is required";
    if (registerForm.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (!registerForm.confirmPassword) errors.confirmPassword = "Please confirm your password";
    if (registerForm.password !== registerForm.confirmPassword) errors.confirmPassword = "Passwords don't match";
    if (!registerForm.companyType) errors.companyType = "Company type is required";
    if (!registerForm.companyName) errors.companyName = "Company name is required";
    if (!registerForm.location) errors.location = "Location is required";
    if (!registerForm.contactName) errors.contactName = "Contact name is required";
    if (!registerForm.phoneNumber) errors.phoneNumber = "Phone number is required";
    if (!registerForm.kraPin) errors.kraPin = "Tax PIN is required";
    if (registerForm.categoriesOfInterest.length === 0) errors.categoriesOfInterest = "Please select at least one category";
    if (!registerForm.agreeToTerms) errors.agreeToTerms = "You must agree to the terms and conditions";
    
    setRegisterFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkEmailExists = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false
        }
      });
      
      if (!error || error.status !== 400) {
        setEmailAlreadyExists(true);
        setRegisterFormErrors({
          ...registerFormErrors,
          email: "This email is already registered. Please log in instead."
        });
        return true;
      }
      
      setEmailAlreadyExists(false);
      return false;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      toast({
        title: "Form validation failed",
        description: "Please check the form for errors and try again",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const emailExists = await checkEmailExists(registerForm.email);
      if (emailExists) {
        setLoginForm({...loginForm, email: registerForm.email});
        setSearchParams((params) => {
          const newParams = new URLSearchParams(params);
          newParams.set('tab', 'login');
          return newParams;
        });
        setIsSubmitting(false);
        toast({
          title: "Account already exists",
          description: "Please login with your existing account",
          variant: "default",
        });
        return;
      }
      
      const nameParts = registerForm.contactName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          data: {
            role: 'supplier',
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) throw new Error("User registration failed");
      
      console.log("User registered successfully:", authData.user.id);
      
      const { error: supplierError } = await supabase.rpc('create_supplier', {
        supplier_id: authData.user.id,
        company_type_id_input: parseInt(registerForm.companyType),
        company_name_input: registerForm.companyName,
        location_input: registerForm.location,
        country_input: registerForm.country,
        phone_number_input: registerForm.phoneNumber,
        kra_pin_input: registerForm.kraPin,
        physical_address_input: registerForm.physicalAddress || null,
        website_url_input: registerForm.websiteUrl || null
      });
      
      if (supplierError) {
        console.error("Supplier creation error:", supplierError);
        throw supplierError;
      }
      
      if (registerForm.categoriesOfInterest.length > 0) {
        for (const categoryId of registerForm.categoriesOfInterest) {
          const { error: categoryError } = await supabase.rpc('add_supplier_category', {
            supplier_id_input: authData.user.id,
            category_id_input: parseInt(categoryId)
          });
          
          if (categoryError) {
            console.error("Category error:", categoryError);
          }
        }
      }
      
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now log in.",
      });
      
      setIsSubmitting(false);
      setSearchParams((params) => {
        const newParams = new URLSearchParams(params);
        newParams.set('tab', 'login');
        return newParams;
      });
      
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.code === "user_already_exists") {
        setEmailAlreadyExists(true);
        setRegisterFormErrors({
          ...registerFormErrors,
          email: "This email is already registered. Please log in instead."
        });
        
        setLoginForm({...loginForm, email: registerForm.email});
        setSearchParams((params) => {
          const newParams = new URLSearchParams(params);
          newParams.set('tab', 'login');
          return newParams;
        });
        
        toast({
          title: "Account already exists",
          description: "Please login with your existing account",
          variant: "default",
        });
      } else {
        toast({
          title: "Registration failed",
          description: error.message || "There was an error creating your account",
          variant: "destructive",
        });
      }
      
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
