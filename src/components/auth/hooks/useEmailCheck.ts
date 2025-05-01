
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EmailCheckState {
  emailAlreadyExists: boolean;
  isChecking: boolean;
}

export const useEmailCheck = () => {
  const [emailAlreadyExists, setEmailAlreadyExists] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  
  // Define checkEmailExists as a regular function instead of useCallback
  // to avoid circular dependency issues with TypeScript
  const checkEmailExists = async (email: string): Promise<boolean> => {
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
      
      // Check if email exists by attempting a signup
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: `temp-${Date.now()}${Math.random()}`,
        options: {
          data: { checkOnly: true }
        }
      });
      
      console.log("[useEmailCheck] Email check response:", data, error);
      
      // If we get an error about email already registered, the email exists
      if (error && (
        error.message.includes("already been registered") ||
        error.message.includes("Email already registered")
      )) {
        console.log("[useEmailCheck] Email already exists in the system");
        setEmailAlreadyExists(true);
        return true;
      } else {
        console.log("[useEmailCheck] Email doesn't exist in the system");
        setEmailAlreadyExists(false);
        return false;
      }
    } catch (err) {
      // Log error but assume email doesn't exist
      console.error("[useEmailCheck] Error checking email:", err);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    emailAlreadyExists,
    setEmailAlreadyExists,
    checkEmailExists,
    isChecking
  };
};
