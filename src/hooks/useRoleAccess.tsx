
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
    
    const result = userRole === role;
    console.log(`Checking for role ${role}: ${result ? 'Yes' : 'No'}`);
    return result;
  }, [userRole]);

  // Update hasRequiredRole whenever userRole changes
  useEffect(() => {
    const result = checkRequiredRole(userRole);
    console.log(`Updating hasRequiredRole to ${result}`);
    setHasRequiredRole(result);
  }, [userRole, checkRequiredRole]);

  return {
    checkRequiredRole,
    checkRole,
    hasRequiredRole
  };
};
