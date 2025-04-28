
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailCheck = () => {
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  
  const checkEmailExists = useCallback(async (email: string): Promise<boolean> => {
    if (!email || !email.trim()) {
      return false;
    }
    
    try {
      // Use OTP method with shouldCreateUser: false to check if email exists
      // If "user not found" error is returned, the email doesn't exist
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false }
      });
      
      // Debug: Log the exact error for troubleshooting
      console.log("Email check response:", error?.message);
      
      // If there's an error saying "user not found", the email doesn't exist in the system
      if (error && error.message.includes("user not found")) {
        console.log("Email doesn't exist in the system");
        setEmailAlreadyExists(false);
        return false;
      } else {
        // No "user not found" error means the email exists
        console.log("Email already exists in the system");
        setEmailAlreadyExists(true);
        return true;
      }
    } catch (err) {
      console.error("Error checking email:", err);
      // On error, assume email doesn't exist to allow registration attempt
      return false;
    }
  }, []);

  return {
    emailAlreadyExists,
    setEmailAlreadyExists,
    checkEmailExists
  };
};
