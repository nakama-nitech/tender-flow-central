
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailCheck = () => {
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  // Define checkEmailExists without referencing its own state in logic
  const checkEmailExists = useCallback(async (email: string): Promise<boolean> => {
    console.log("[useEmailCheck] checkEmailExists called with email:", email);
    
    if (!email || !email.trim()) {
      console.log("[useEmailCheck] Email empty, returning false");
      return false;
    }
    
    // If already checking, just return without doing another check
    if (isChecking) {
      console.log("[useEmailCheck] Already checking, skipping duplicate check");
      return false; // Return false instead of current state to break circular reference
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
        setEmailAlreadyExists(false); // Reset state on error
        return false;
      }
      
      const exists = !!data;
      console.log("[useEmailCheck] Email exists check result:", exists);
      setEmailAlreadyExists(exists);
      return exists;
    } catch (err) {
      console.error("[useEmailCheck] Error checking email:", err);
      setEmailAlreadyExists(false); // Reset state on error
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [isChecking]); // Only depend on isChecking, not on state that would create circular reference

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
