
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RegisterFormErrors } from '../types/formTypes';

export const useRegisterSubmit = (
  setSearchParams: React.Dispatch<React.SetStateAction<URLSearchParams>>,
  setLoginForm: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>,
  setRegisterFormErrors: React.Dispatch<React.SetStateAction<RegisterFormErrors>>,
  registerFormErrors: RegisterFormErrors
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!window.registerFormState) {
      console.error('Register form state not found');
      return;
    }
    
    const formData = window.registerFormState;
    
    try {
      setIsSubmitting(true);
      
      // Create Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'supplier',
            first_name: formData.contactName?.split(' ')[0] || '',
            last_name: formData.contactName?.split(' ').slice(1).join(' ') || ''
          },
        },
      });
      
      if (authError) {
        throw authError;
      }
      
      // If auth user creation was successful, create the supplier record
      if (authData?.user) {
        const { error: supplierError } = await supabase
          .from('suppliers')
          .insert({
            id: authData.user.id,
            company_name: formData.companyName,
            location: formData.location,
            country: formData.country,
            phone_number: formData.phoneNumber,
            kra_pin: formData.kraPin || null,
            physical_address: formData.physicalAddress || null,
            website_url: formData.websiteUrl || null,
            company_type_id: formData.companyType ? parseInt(formData.companyType) : null,
          });
        
        if (supplierError) {
          throw supplierError;
        }
        
        // Add supplier categories if any were selected
        if (formData.categoriesOfInterest && formData.categoriesOfInterest.length > 0) {
          const supplierCategories = formData.categoriesOfInterest.map((categoryId) => ({
            supplier_id: authData.user!.id,
            category_id: parseInt(categoryId),
          }));
          
          const { error: categoriesError } = await supabase
            .from('supplier_categories')
            .insert(supplierCategories);
            
          if (categoriesError) {
            console.error('Error adding supplier categories:', categoriesError);
          }
        }
        
        // Add supplier locations if any were selected
        if (formData.supplyLocations && formData.supplyLocations.length > 0) {
          const supplierLocations = formData.supplyLocations.map((locationId) => ({
            supplier_id: authData.user!.id,
            location_id: parseInt(locationId),
          }));
          
          const { error: locationsError } = await supabase
            .from('supplier_locations')
            .insert(supplierLocations);
            
          if (locationsError) {
            console.error('Error adding supplier locations:', locationsError);
          }
        }
        
        // Pre-populate the login form with the registration email and password
        setLoginForm({
          email: formData.email,
          password: formData.password,
        });
        
        // Switch to login tab and show success message
        setSearchParams((params) => {
          const newParams = new URLSearchParams(params);
          newParams.set('tab', 'login');
          newParams.set('registered', 'true');
          return newParams;
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setRegisterFormErrors({
        ...registerFormErrors,
        general: error.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
      // Clear the form state from window for security
      delete window.registerFormState;
    }
  };

  return {
    isSubmitting,
    handleRegisterSubmit
  };
};
