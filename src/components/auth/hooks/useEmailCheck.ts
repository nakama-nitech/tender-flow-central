
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailCheck = () => {
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  
  const checkEmailExists = useCallback(async (email: string): Promise<boolean> => {
    if (!email || !email.trim()) {
      return false;
    }
    
    try {
      // A different approach to check if email exists since signInWithOtp is causing issues
      // Check if we can get an auth error when trying to sign up directly
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: `temp-${Date.now()}${Math.random()}`,
        options: {
          data: { checkOnly: true }
        }
      });
      
      console.log("Email check response:", data, error);
      
      // If we get an error about email already registered, the email exists
      if (error && (
        error.message.includes("already been registered") ||
        error.message.includes("Email already registered")
      )) {
        console.log("Email already exists in the system");
        setEmailAlreadyExists(true);
        return true;
      } else {
        console.log("Email doesn't exist in the system");
        setEmailAlreadyExists(false);
        return false;
      }
    } catch (err) {
      // If we get an error, log it but assume the email doesn't exist
      // to let the registration attempt go through
      console.error("Error checking email:", err);
      setEmailAlreadyExists(false);
      return false;
    }
  }, []);

  return {
    emailAlreadyExists,
    setEmailAlreadyExists,
    checkEmailExists
  };
};
