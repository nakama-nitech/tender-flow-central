
import { useState } from 'react';
import { RegisterFormState } from '../types/formTypes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useRegisterSubmit = (
  setSearchParams: React.Dispatch<React.SetStateAction<URLSearchParams>>,
  setLoginForm: (form: { email: string; password: string }) => void,
  setRegisterFormErrors: (errors: { [key: string]: string }) => void,
  registerFormErrors: { [key: string]: string }
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e: React.FormEvent, registerForm: RegisterFormState) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Extract name parts for user metadata
      const nameParts = registerForm.contactName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Attempt user registration
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
      
      // Create supplier profile
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
      
      if (supplierError) throw supplierError;
      
      // Add supplier categories
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
      
      // Set login form with the email for convenience
      setLoginForm({ email: registerForm.email, password: '' });
      
      // Switch to login tab after successful registration
      setSearchParams((params) => {
        const newParams = new URLSearchParams(params);
        newParams.set('tab', 'login');
        return newParams;
      });
      
      // Redirect user to auth page with login tab selected
      navigate('/auth?tab=login');
      
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.code === "user_already_exists" || error.message?.includes("already been registered")) {
        setRegisterFormErrors({
          ...registerFormErrors,
          email: "This email is already registered. Please log in instead."
        });
        
        setLoginForm({ email: registerForm.email, password: '' });
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleRegisterSubmit
  };
};
