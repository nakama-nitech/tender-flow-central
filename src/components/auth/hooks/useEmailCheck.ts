import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EmailCheckState {
  emailAlreadyExists: boolean;
  isChecking: boolean;
}

export const useEmailCheck = () => {
  const [state, setState] = useState<EmailCheckState>({
    emailAlreadyExists: false,
    isChecking: false
  });
  
  const checkEmailExists = useCallback(async (email: string): Promise<boolean> => {
    console.log("useEmailCheck: checkEmailExists called with email:", email);
    
    if (!email || !email.trim() || state.isChecking) {
      console.log("useEmailCheck: email empty or already checking, returning current state:", state.emailAlreadyExists);
      return state.emailAlreadyExists;
    }
    
    try {
      setState(prev => ({ ...prev, isChecking: true }));
      
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: `temp-${Date.now()}${Math.random()}`,
        options: {
          data: { checkOnly: true }
        }
      });
      
      console.log("useEmailCheck: Email check response:", data, error);
      
      const emailExists = error && (
        error.message.includes("already been registered") ||
        error.message.includes("Email already registered")
      );
      
      setState(prev => ({
        ...prev,
        emailAlreadyExists: emailExists,
        isChecking: false
      }));
      
      return emailExists;
    } catch (err) {
      console.error("useEmailCheck: Error checking email:", err);
      setState(prev => ({ ...prev, isChecking: false }));
      return state.emailAlreadyExists;
    }
  }, [state.emailAlreadyExists, state.isChecking]);

  return {
    emailAlreadyExists: state.emailAlreadyExists,
    isChecking: state.isChecking,
    checkEmailExists
  };
};
