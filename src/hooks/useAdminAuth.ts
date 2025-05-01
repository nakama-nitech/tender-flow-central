import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useAdminAuth = () => {
  const { isLoading, error, isAdmin } = useAuth('admin');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this page',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [isLoading, isAdmin, navigate, toast]);

  return {
    isLoading,
    error,
    isAdmin,
  };
}; 