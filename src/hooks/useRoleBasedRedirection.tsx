
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
    
    if (shouldCheckAccess) {
      // If a specific role is required but the user doesn't have it
      if (user && userRole && requiredRole && !canAccessCurrentPath) {
        console.log(`Required role: ${requiredRole}, User role: ${userRole}`);
        setError(`You need ${requiredRole} permissions to access this area.`);
        navigate('/select-role');
      }
      
      // If authentication fails and we have a required role, redirect to auth
      if (!user && requiredRole) {
        navigate('/auth');
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
