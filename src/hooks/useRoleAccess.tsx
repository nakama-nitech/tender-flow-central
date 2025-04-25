
import { useAdminEmailCheck } from './useAdminEmailCheck';
import { useRoleChecker } from './useRoleChecker';
import { useRequiredRoleValidation } from './useRequiredRoleValidation';

export const useRoleAccess = (userRole: string | null, requiredRole?: 'admin' | 'supplier') => {
  const { checkAdminByEmail } = useAdminEmailCheck();
  const { checkRole, isAdmin } = useRoleChecker(userRole);
  const { checkRequiredRole, hasRequiredRole } = useRequiredRoleValidation(userRole, requiredRole);

  return {
    checkRequiredRole,
    checkRole,
    hasRequiredRole,
    isAdmin,
    checkAdminByEmail
  };
};
