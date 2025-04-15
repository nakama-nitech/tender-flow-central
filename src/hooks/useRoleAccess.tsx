
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRoleAccess = (userRole: string | null, requiredRole?: 'admin' | 'supplier') => {
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(false);
  const [isAdminChecking, setIsAdminChecking] = useState<boolean>(false);
  const [adminEmailList] = useState<string[]>(['jeffmnjogu@gmail.com', 'astropeter42@yahoo.com']);

  // Check if user has required role
  const checkRequiredRole = useCallback((profileRole: string | null) => {
    if (!profileRole) {
      console.log("No role provided for checking");
      return false;
    }
    
    // If this is an admin user or required role matches user role
    if (profileRole === 'admin' || (requiredRole && profileRole === requiredRole)) {
      return true;
    }
    
    // Special case: admin can access supplier paths
    if (requiredRole === 'supplier' && profileRole === 'admin') {
      return true;
    }
    
    console.log(`Role mismatch: Required ${requiredRole}, User has ${profileRole}`);
    return false;
  }, [requiredRole]);

  // Simple role checker
  const checkRole = useCallback((role: string) => {
    if (!userRole) {
      console.log("No user role available to check against");
      return false;
    }
    
    // Match both exact role and special case for admin (admin can access everything)
    const result = userRole === role || (userRole === 'admin');
    console.log(`Checking for role ${role}: ${result ? 'Yes' : 'No'}`);
    return result;
  }, [userRole]);

  // Update hasRequiredRole whenever userRole changes
  useEffect(() => {
    const result = checkRequiredRole(userRole);
    console.log(`Updating hasRequiredRole to ${result}`);
    setHasRequiredRole(result);
  }, [userRole, checkRequiredRole]);

  // Special check for admin - admin can access any protected resources
  const isAdmin = useCallback(() => {
    return userRole === 'admin';
  }, [userRole]);

  // Check if email is in admin list
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
    checkRequiredRole,
    checkRole,
    hasRequiredRole,
    isAdmin,
    checkAdminByEmail
  };
};
