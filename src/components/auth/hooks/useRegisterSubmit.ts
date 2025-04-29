
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get the form state from the component's state
    const registerForm = window.registerFormState;
    
    if (!registerForm) {
      console.error("Form data is missing");
      toast({
        title: "Registration failed",
        description: "Form data is missing",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Extract name parts for user metadata
      const nameParts = registerForm.contactName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Determine the current origin for redirect URL
      const currentOrigin = window.location.origin;
      const redirectPath = '/auth';
      const redirectUrl = `${currentOrigin}${redirectPath}`;
      
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
          emailRedirectTo: redirectUrl
        }
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error("User registration failed");
      
      // Create supplier profile - The issue is with this function call
      // Instead of using rpc, let's use a direct insert into the suppliers table
      const { error: supplierError } = await supabase
        .from('suppliers')
        .insert({
          id: authData.user.id,
          company_type_id: parseInt(registerForm.companyType),
          company_name: registerForm.companyName,
          location: registerForm.location,
          country: registerForm.country,
          phone_number: registerForm.phoneNumber,
          kra_pin: registerForm.kraPin,
          physical_address: registerForm.physicalAddress || null,
          website_url: registerForm.websiteUrl || null
        });
      
      if (supplierError) throw supplierError;
      
      // Add supplier categories
      if (registerForm.categoriesOfInterest.length > 0) {
        const categoriesToInsert = registerForm.categoriesOfInterest.map(categoryId => ({
          supplier_id: authData.user.id,
          category_id: parseInt(categoryId)
        }));
        
        const { error: categoryError } = await supabase
          .from('supplier_categories')
          .insert(categoriesToInsert);
        
        if (categoryError) {
          console.error("Category error:", categoryError);
        }
      }
      
      // Add supplier locations if needed
      if (registerForm.supplyLocations.length > 0) {
        // Get location IDs from location names
        const { data: locationData } = await supabase
          .from('locations')
          .select('id, name')
          .in('name', registerForm.supplyLocations);
        
        if (locationData && locationData.length > 0) {
          const locationsToInsert = locationData.map(location => ({
            supplier_id: authData.user.id,
            location_id: location.id
          }));
          
          const { error: locationError } = await supabase
            .from('supplier_locations')
            .insert(locationsToInsert);
          
          if (locationError) {
            console.error("Location error:", locationError);
          }
        }
      }
      
      toast({
        title: "Registration successful",
        description: "Please log in with your new account credentials.",
      });
      
      // Pre-populate the login form with the user's email to make login easier
      setLoginForm({ email: registerForm.email, password: '' });
      
      // Switch to login tab after successful registration
      setSearchParams((params) => {
        const newParams = new URLSearchParams(params);
        newParams.set('tab', 'login');
        return newParams;
      });
      
      // Redirect to auth page with login tab selected
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
