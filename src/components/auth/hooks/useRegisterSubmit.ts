
import { useState } from 'react';
import { RegisterFormErrors } from '../types/formTypes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRegisterSubmit = (
  setSearchParams: React.Dispatch<React.SetStateAction<URLSearchParams>>,
  setLoginForm: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>,
  setRegisterFormErrors: React.Dispatch<React.SetStateAction<RegisterFormErrors>>,
  registerFormErrors: RegisterFormErrors
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Attempting registration with form data:", window.registerFormState);
      
      if (!window.registerFormState) {
        throw new Error("Registration form data not found");
      }

      const { 
        email, 
        password, 
        companyName, 
        companyType, 
        location, 
        country, 
        contactName, 
        phoneNumber,
        kraPin,
        physicalAddress,
        websiteUrl,
        categoriesOfInterest,
        supplyLocations
      } = window.registerFormState;

      // Attempt to create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: companyName,
            contact_name: contactName,
            phone_number: phoneNumber,
            role: 'supplier', // Default role
            first_name: contactName.split(' ')[0] || '',
            last_name: contactName.split(' ').slice(1).join(' ') || ''
          }
        }
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("User account could not be created");
      }

      console.log("User created successfully:", authData.user);

      // Create a profile in the supplier table
      try {
        const { error: supplierError } = await supabase
          .from('suppliers')
          .insert({
            id: authData.user.id,
            company_name: companyName,
            company_type_id: parseInt(companyType) || null,
            location,
            country,
            phone_number: phoneNumber,
            kra_pin: kraPin,
            physical_address: physicalAddress,
            website_url: websiteUrl
          });

        if (supplierError) {
          console.error("Error creating supplier profile:", supplierError);
          toast({
            title: "Registration issue",
            description: "Account created but profile details couldn't be saved. Please update your profile later.",
            variant: "destructive"
          });
        }

        // Add categories
        if (categoriesOfInterest.length > 0) {
          const categoryMappings = categoriesOfInterest.map(catId => ({
            supplier_id: authData.user!.id,
            category_id: parseInt(catId.toString())
          }));
          
          const { error: categoriesError } = await supabase
            .from('supplier_categories')
            .insert(categoryMappings);

          if (categoriesError) {
            console.error("Error adding categories:", categoriesError);
          }
        }

        // Add locations
        if (supplyLocations.length > 0) {
          const locationMappings = supplyLocations.map(locId => ({
            supplier_id: authData.user!.id,
            location_id: parseInt(locId.toString())
          }));
          
          const { error: locationsError } = await supabase
            .from('supplier_locations')
            .insert(locationMappings);

          if (locationsError) {
            console.error("Error adding locations:", locationsError);
          }
        }

      } catch (profileError) {
        console.error("Error in profile creation:", profileError);
        toast({
          title: "Registration issue",
          description: "Account created but profile couldn't be completed. You can update your profile later.",
          variant: "destructive"
        });
      }

      // Sign out the user after registration (since we want them to verify their email if required)
      await supabase.auth.signOut();

      // Set the login form with the registered email to make it easier for the user
      setLoginForm({ email, password });
      
      // Registration success message
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please sign in with your credentials.",
      });
      
      // Redirect to login tab
      setSearchParams(new URLSearchParams({ tab: 'login' }));
      
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle specific error cases
      if (error.message.includes('already registered')) {
        setRegisterFormErrors({
          ...registerFormErrors,
          email: 'This email is already registered'
        });
      } else {
        toast({
          title: "Registration failed",
          description: error.message || "There was a problem with your registration",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
      
      // Clear form data from window after submission
      delete window.registerFormState;
    }
  };

  return { isSubmitting, handleRegisterSubmit };
};
