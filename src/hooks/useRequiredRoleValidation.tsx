
import { useCallback, useEffect, useState } from 'react';

export const useRequiredRoleValidation = (
  userRole: string | null, 
  requiredRole?: 'admin' | 'supplier'
) => {
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(false);

  const checkRequiredRole = useCallback((profileRole: string | null) => {
    if (!profileRole) {
      console.log("No role provided for checking");
      return false;
    }
    
    if (profileRole === 'admin' || (requiredRole && profileRole === requiredRole)) {
      return true;
    }
    
    if (requiredRole === 'supplier' && profileRole === 'admin') {
      return true;
    }
    
    console.log(`Role mismatch: Required ${requiredRole}, User has ${profileRole}`);
    return false;
  }, [requiredRole]);

  useEffect(() => {
    const result = checkRequiredRole(userRole);
    console.log(`Updating hasRequiredRole to ${result}`);
    setHasRequiredRole(result);
  }, [userRole, checkRequiredRole]);

  return {
    checkRequiredRole,
    hasRequiredRole
  };
};
