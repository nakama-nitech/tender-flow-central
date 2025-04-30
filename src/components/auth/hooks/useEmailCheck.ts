
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailCheck = () => {
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  // Define checkEmailExists using useCallback to maintain reference stability
  const checkEmailExists = useCallback(async (email: string): Promise<boolean> => {
    console.log("[useEmailCheck] checkEmailExists called with email:", email);
    
    if (!email || !email.trim()) {
      console.log("[useEmailCheck] Email empty, returning current state:", emailAlreadyExists);
      return emailAlreadyExists;
    }
    
    if (isChecking) {
      console.log("[useEmailCheck] Already checking, returning current state:", emailAlreadyExists);
      return emailAlreadyExists;
    }
    
    try {
      setIsChecking(true);
      // A different approach to check if email exists since signInWithOtp is causing issues
      // Check if we can get an auth error when trying to sign up directly
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
      // If we get an error, log it but assume the email doesn't exist
      // to let the registration attempt go through
      console.error("[useEmailCheck] Error checking email:", err);
      return emailAlreadyExists;
    } finally {
      setIsChecking(false);
    }
  }, [emailAlreadyExists, isChecking]);

  console.log("[useEmailCheck] Hook initialized with checkEmailExists function:", !!checkEmailExists);

  return {
    emailAlreadyExists,
    setEmailAlreadyExists,
    checkEmailExists, // Export the function so it can be used by other components
    isChecking
  };
};
