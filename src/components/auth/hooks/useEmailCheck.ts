
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailCheck = () => {
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  // Completely restructure checkEmailExists to avoid any circular references
  const checkEmailExists = useCallback(async (email: string): Promise<boolean> => {
    console.log("[useEmailCheck] checkEmailExists called with email:", email);
    
    if (!email || !email.trim()) {
      console.log("[useEmailCheck] Email empty, returning false");
      return false;
    }
    
    // Don't depend on state in function logic
    setIsChecking(true);
    
    try {
      console.log("[useEmailCheck] Checking if email exists in database");
      
      // Use a safer approach to check if email exists
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      if (error) {
        console.error("[useEmailCheck] Error checking email existence:", error);
        setEmailAlreadyExists(false);
        return false;
      }
      
      const exists = !!data;
      console.log("[useEmailCheck] Email exists check result:", exists);
      setEmailAlreadyExists(exists);
      return exists;
    } catch (err) {
      console.error("[useEmailCheck] Error checking email:", err);
      setEmailAlreadyExists(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []); // Empty dependency array to avoid circular references
  
  // Reset function for clearing email check state
  const resetEmailCheck = useCallback(() => {
    setEmailAlreadyExists(false);
  }, []);

  return {
    emailAlreadyExists,
    setEmailAlreadyExists,
    checkEmailExists,
    resetEmailCheck,
    isChecking
  };
};
