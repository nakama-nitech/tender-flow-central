
import { useAuth } from '@/hooks/useAuth';

export const useAdminAuth = () => {
  // Use the generic auth hook with 'admin' as the required role
  return useAuth('admin');
};
