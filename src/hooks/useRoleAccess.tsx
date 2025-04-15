
import { useCallback, useEffect, useState } from 'react';

export const useRoleAccess = (userRole: string | null, requiredRole?: 'admin' | 'supplier') => {
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(false);

  // Check if user has required role
  const checkRequiredRole = useCallback((profileRole: string | null) => {
    if (!profileRole) {
      console.log("No role provided for checking");
      return false;
    }
    
    if (requiredRole && profileRole !== requiredRole) {
      console.log(`Role mismatch: Required ${requiredRole}, User has ${profileRole}`);
      return false;
    }
    
    return true;
  }, [requiredRole]);

  // Simple role checker
  const checkRole = useCallback((role: string) => {
    if (!userRole) {
      console.log("No user role available to check against");
      return false;
    }
    
    // Match both exact role and special case for admin (admin can access everything)
    const result = userRole === role || (userRole === 'admin' && role === 'supplier');
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

  return {
    checkRequiredRole,
    checkRole,
    hasRequiredRole,
    isAdmin
  };
};
