
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminEmailCheck = () => {
  const [isAdminChecking, setIsAdminChecking] = useState<boolean>(false);
  const [adminEmailList] = useState<string[]>(['jeffmnjogu@gmail.com', 'astropeter42@yahoo.com']);

  const checkAdminByEmail = useCallback(async () => {
    if (isAdminChecking) return false;
    
    try {
      setIsAdminChecking(true);
      const { data } = await supabase.auth.getUser();
      const userEmail = data?.user?.email;
      
      if (userEmail && adminEmailList.includes(userEmail)) {
        console.log("User email is in admin list:", userEmail);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error checking admin by email:", error);
      return false;
    } finally {
      setIsAdminChecking(false);
    }
  }, [adminEmailList, isAdminChecking]);

  return {
    checkAdminByEmail,
    isAdminChecking
  };
};
