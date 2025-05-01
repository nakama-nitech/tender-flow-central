
import { useCallback } from 'react';

export const useRoleChecker = (userRole: string | null) => {
  const checkRole = useCallback((role: string) => {
    if (!userRole) {
      console.log("No user role available to check against");
      return false;
    }
    
    const result = userRole === role || (userRole === 'admin');
    console.log(`Checking for role ${role}: ${result ? 'Yes' : 'No'}`);
    return result;
  }, [userRole]);

  const isAdmin = useCallback(() => {
    return userRole === 'admin';
  }, [userRole]);

  return {
    checkRole,
    isAdmin
  };
};
