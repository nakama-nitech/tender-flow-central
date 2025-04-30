
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailCheck = () => {
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  // Define checkEmailExists using useCallback but avoid the circular reference
  const checkEmailExists = useCallback(async (email: string): Promise<boolean> => {
    console.log("[useEmailCheck] checkEmailExists called with email:", email);
    
    if (!email || !email.trim()) {
      console.log("[useEmailCheck] Email empty, returning false");
      return false;
    }
    
    if (isChecking) {
      console.log("[useEmailCheck] Already checking, returning current state:", emailAlreadyExists);
      return emailAlreadyExists;
    }
    
    try {
      setIsChecking(true);
      
      // Use a safer approach to check if email exists
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      if (error) {
        console.error("[useEmailCheck] Error checking email existence:", error);
        return false;
      }
      
      const exists = !!data;
      console.log("[useEmailCheck] Email exists check result:", exists);
      setEmailAlreadyExists(exists);
      return exists;
    } catch (err) {
      console.error("[useEmailCheck] Error checking email:", err);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [isChecking]); // Remove emailAlreadyExists from dependencies to avoid circular reference

  return {
    emailAlreadyExists,
    setEmailAlreadyExists,
    checkEmailExists,
    isChecking
  };
};
