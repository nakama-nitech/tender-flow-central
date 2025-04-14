
import { useAuth } from '@/hooks/useAuth';

export const useSupplierAuth = () => {
  // Use the generic auth hook with 'supplier' as the required role
  return useAuth('supplier');
};
