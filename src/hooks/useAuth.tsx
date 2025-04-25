
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSessionState } from '@/hooks/useSessionState';
import { useProfileManagement } from '@/hooks/useProfileManagement';
import { useToast } from '@/hooks/use-toast';

export const useAuth = (requiredRole?: 'admin' | 'supplier') => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  
  const { 
    isLoading: authLoading, 
    error, 
    user, 
    session,
    setError,
    handleRetry, 
    handleSignOut 
  } = useSessionState();

  const {
    userRole,
    loadUserProfile,
    isProfileLoading,
    profileLoaded,
    loadingAttempts,
    checkAdminByEmail
  } = useProfileManagement(user, setError);

  // Determine if user meets the role requirements
  const hasRequiredRole = !requiredRole || userRole === requiredRole;
  
  // Special case for admins - they can access supplier paths
  const isAdmin = () => userRole === 'admin';
  const canAccessCurrentPath = isAdmin() || hasRequiredRole;
  
  // Check if user is on an auth page
  const isOnAuthPage = location.pathname === '/auth' || location.pathname === '/select-role';
  
  // Profile loading in progress
  const isLoadingProfile = user && !profileLoaded && loadingAttempts < 5;
  
  // Overall loading state
  const isLoading = authLoading || isProfileLoading || isLoadingProfile || isCheckingAccess;

  useEffect(() => {
    let mounted = true;
    
    const checkAuthAndRedirect = async () => {
      // Skip any redirection while loading
      if (authLoading || isProfileLoading) return;
      
      // If there's a user but profile isn't loaded yet, try to load it
      if (user && !profileLoaded && !isProfileLoading && loadingAttempts < 5) {
        await loadUserProfile();
        return;
      }
      
      // Once loading is done, we can make routing decisions
      if (mounted) {
        setIsCheckingAccess(false);
        
        // If no user is logged in and we're not on the auth page
        if (!user && !isOnAuthPage) {
          navigate('/auth', { replace: true });
          return;
        }
        
        // If user is logged in but no role is set
        if (user && !userRole && profileLoaded) {
          if (!location.pathname.startsWith('/select-role')) {
            navigate('/select-role', { replace: true });
          }
          return;
        }
        
        // If user is logged in and has a role, but is on the wrong path or auth page
        if (user && userRole) {
          if (isOnAuthPage) {
            // Redirect from auth pages to appropriate dashboard
            if (userRole === 'admin') {
              navigate('/admin', { replace: true });
            } else {
              navigate('/supplier/dashboard', { replace: true });
            }
            return;
          } else if (!canAccessCurrentPath) {
            // Redirect from inaccessible routes based on role
            if (userRole === 'admin') {
              navigate('/admin', { replace: true });
            } else {
              navigate('/supplier/dashboard', { replace: true });
            }
            return;
          }
        }
      }
    };
    
    checkAuthAndRedirect();
    
    return () => {
      mounted = false;
    };
  }, [
    user, 
    userRole, 
    authLoading, 
    isProfileLoading, 
    profileLoaded, 
    canAccessCurrentPath, 
    navigate, 
    location.pathname, 
    isOnAuthPage,
    loadingAttempts,
    loadUserProfile
  ]);

  return { 
    isLoading, 
    error, 
    user,
    session,
    userRole, 
    handleRetry, 
    handleSignOut, 
    isAdmin,
    canAccessCurrentPath
  };
};
