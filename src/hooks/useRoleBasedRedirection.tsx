
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseRoleBasedRedirectionProps {
  user: any;
  userRole: string | null;
  requiredRole?: 'admin' | 'supplier';
  authLoading: boolean;
  profileLoaded: boolean;
  loadingAttempts: number;
  canAccessCurrentPath: boolean;
  setError: (error: string) => void;
}

export const useRoleBasedRedirection = ({
  user,
  userRole,
  requiredRole,
  authLoading,
  profileLoaded,
  loadingAttempts,
  canAccessCurrentPath,
  setError
}: UseRoleBasedRedirectionProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Only perform redirects if auth is complete and we've attempted to load the profile
    const shouldCheckAccess = !authLoading && (profileLoaded || loadingAttempts >= 5);
    const currentPath = window.location.pathname;
    const isAuthPage = currentPath === '/auth' || currentPath === '/login' || currentPath === '/signup';
    const isRedirectPage = currentPath === '/redirect';
    const isSupplierPath = currentPath.startsWith('/supplier');
    const isAdminPath = currentPath.startsWith('/admin');
    
    // Skip redirections if we're on the redirect handler page
    if (isRedirectPage) {
      return;
    }
    
    if (shouldCheckAccess && !isAuthPage) {
      // Explicitly handle the case when a user is accessing a path they don't have permission for
      if (user && userRole && requiredRole && !canAccessCurrentPath) {
        console.log(`Access denied: Required role: ${requiredRole}, User role: ${userRole}`);
        setError(`You need ${requiredRole} permissions to access this area.`);
        navigate('/redirect');
        return;
      }
      
      // Only redirect to auth if not already on an auth page and we need authentication
      if (!user && requiredRole) {
        navigate('/auth');
        return;
      }
      
      // Fix for admin and supplier view switching - don't redirect when explicitly navigating
      // This allows admins to view the supplier dashboard without redirection
      if (user && userRole === 'admin' && isSupplierPath) {
        // Let admins access supplier paths without redirection
        return;
      }
      
      if (user && userRole === 'supplier' && isAdminPath) {
        // Suppliers should not be able to access admin paths
        console.log("Supplier attempting to access admin path, redirecting to supplier dashboard");
        navigate('/supplier/dashboard');
        return;
      }
    }
  }, [
    authLoading,
    profileLoaded,
    loadingAttempts,
    user,
    userRole,
    requiredRole,
    canAccessCurrentPath,
    navigate,
    setError
  ]);
};
