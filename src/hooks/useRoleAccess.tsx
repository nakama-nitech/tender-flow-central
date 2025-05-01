
import { useEffect, useState } from 'react';

export const useRoleAccess = (userRole: string | null, requiredRole?: 'admin' | 'supplier') => {
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(false);

  useEffect(() => {
    console.log("Role checking: User role:", userRole, "Required role:", requiredRole);
    if (!requiredRole) {
      // No specific role required
      console.log("No role provided for checking");
      setHasRequiredRole(true);
      return;
    }

    if (!userRole) {
      // No user role available
      console.log("User has no role, setting access to false");
      setHasRequiredRole(false);
      return;
    }

    // Special case: admins can access supplier pages
    if (requiredRole === 'supplier' && userRole === 'admin') {
      console.log("Admin accessing supplier resources - allowed");
      setHasRequiredRole(true);
      return;
    }

    // Standard role check
    const match = userRole === requiredRole;
    console.log("Updating hasRequiredRole to", match);
    setHasRequiredRole(match);
  }, [userRole, requiredRole]);

  const checkRequiredRole = (role?: 'admin' | 'supplier'): boolean => {
    if (!role) return true;
    if (!userRole) return false;
    
    // Special case: admins can access supplier routes
    if (role === 'supplier' && userRole === 'admin') {
      return true;
    }
    
    return userRole === role;
  };

  const checkRole = (role: string): boolean => {
    return userRole === role;
  };

  const isAdmin = (): boolean => {
    return userRole === 'admin';
  };

  return {
    checkRequiredRole,
    checkRole,
    hasRequiredRole,
    isAdmin,
  };
};
