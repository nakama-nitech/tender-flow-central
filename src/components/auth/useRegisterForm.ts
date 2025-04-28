
import { useState } from 'react';
import { RegisterFormState, LoginFormState } from './types/formTypes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useEmailCheck } from './hooks/useEmailCheck';
import { useFormValidation } from './hooks/useFormValidation';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use our custom hooks
  const { emailAlreadyExists, setEmailAlreadyExists, checkEmailExists } = useEmailCheck();
  const { registerFormErrors, setRegisterFormErrors, validateRegisterForm } = useFormValidation();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm(registerForm)) {
      toast({
        title: "Form validation failed",
        description: "Please check the form for errors and try again",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if email exists
      const emailExists = await checkEmailExists(registerForm.email);
      
      if (emailExists) {
        // Email exists, switch to login tab
        setLoginForm({...loginForm, email: registerForm.email});
        setSearchParams((params) => {
          const newParams = new URLSearchParams(params);
          newParams.set('tab', 'login');
          return newParams;
        });
        setIsSubmitting(false);
        return;
      }
      
      // Email doesn't exist, proceed with registration
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
          },
          emailRedirectTo: window.location.origin
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) throw new Error("User registration failed");
      
      console.log("User registered successfully:", authData.user.id);
      
      // Create supplier info
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
      
      // Add categories
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
      
      // Handle the error appropriately
      if (error.code === "user_already_exists" || error.message?.includes("already been registered")) {
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
