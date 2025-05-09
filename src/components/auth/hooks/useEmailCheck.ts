import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailCheck = () => {
  const [emailAlreadyExists, setEmailAlreadyExists] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  
  const checkEmailExists = useCallback(async (email: string): Promise<boolean> => {
    if (!email || !email.trim()) {
      setEmailAlreadyExists(false);
      return false;
    }
    
    // Don't check if we're already checking
    if (isChecking) {
      return emailAlreadyExists;
    }
    
    try {
      setIsChecking(true);
      
      // Try to sign up with the email to check if it exists
      const { error } = await supabase.auth.signUp({
        email: email,
        password: `temp-${Date.now()}${Math.random()}`,
        options: {
          data: { checkOnly: true }
        }
      });
      
      // If we get an error about email already registered, the email exists
      if (error && (
        error.message.includes("already been registered") ||
        error.message.includes("Email already registered")
      )) {
        setEmailAlreadyExists(true);
        return true;
      }
      
      setEmailAlreadyExists(false);
      return false;
    } catch (err) {
      console.error("[useEmailCheck] Error checking email:", err);
      // On error, assume email doesn't exist to allow registration
      setEmailAlreadyExists(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [isChecking, emailAlreadyExists]);

  return {
    emailAlreadyExists,
    setEmailAlreadyExists,
    checkEmailExists,
    isChecking
  };
};
