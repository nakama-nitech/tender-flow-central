
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailCheck = () => {
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  
  const checkEmailExists = useCallback(async (email: string): Promise<boolean> => {
    if (!email || !email.trim()) {
      return false;
    }
    
    try {
      // A more reliable way to check if an email exists 
      // is by trying to get the user by email
      const { data, error } = await supabase.auth.admin.getUserByEmail(email);
      
      console.log("Email check response:", data, error);
      
      // If the API returns a user, the email exists
      if (data?.user) {
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
