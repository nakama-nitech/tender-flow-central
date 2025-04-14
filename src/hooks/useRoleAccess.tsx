
import { useCallback } from 'react';

export const useRoleAccess = (userRole: string | null, requiredRole?: 'admin' | 'supplier') => {
  // Check if user has required role
  const checkRequiredRole = useCallback((profileRole: string | null) => {
    if (requiredRole && profileRole !== requiredRole) {
      console.log(`Required role: ${requiredRole}, User role: ${profileRole}`);
      return false;
    }
    return true;
  }, [requiredRole]);

  const checkRole = useCallback((role: string) => userRole === role, [userRole]);

  return {
    checkRequiredRole,
    checkRole,
    hasRequiredRole: checkRequiredRole(userRole)
  };
};
