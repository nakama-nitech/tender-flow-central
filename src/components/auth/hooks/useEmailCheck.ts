
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailCheck = () => {
  const [emailAlreadyExists, setEmailAlreadyExists] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastCheckedEmail, setLastCheckedEmail] = useState<string>('');
  const [errorOccurred, setErrorOccurred] = useState<boolean>(false);
  
  const checkEmailExists = useCallback(async (email: string): Promise<boolean> => {
    console.log("[useEmailCheck] checkEmailExists called with email:", email);
    
    // Return cached result if we've already checked this email and no error occurred
    if (email === lastCheckedEmail && !errorOccurred) {
      console.log("[useEmailCheck] Using cached result for email:", emailAlreadyExists);
      return emailAlreadyExists;
    }
    
    if (!email || !email.trim()) {
      console.log("[useEmailCheck] Email empty, returning false");
      setEmailAlreadyExists(false);
      return false;
    }
    
    // Don't check if we're already checking
    if (isChecking) {
      console.log("[useEmailCheck] Already checking, returning current state:", emailAlreadyExists);
      return emailAlreadyExists;
    }
    
    try {
      setIsChecking(true);
      setErrorOccurred(false);
      setLastCheckedEmail(email);
      
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
      console.error("[useEmailCheck] Error checking email:", err);
      setErrorOccurred(true);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [emailAlreadyExists, isChecking, lastCheckedEmail, errorOccurred]);

  return {
    emailAlreadyExists,
    setEmailAlreadyExists,
    checkEmailExists,
    isChecking
  };
};
