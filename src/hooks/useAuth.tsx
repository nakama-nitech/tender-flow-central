import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSessionState } from '@/hooks/useSessionState';
import { useProfileManagement } from '@/hooks/useProfileManagement';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useRoleBasedRedirection } from '@/hooks/useRoleBasedRedirection';
import { useToast } from '@/hooks/use-toast';

export const useAuth = (requiredRole?: 'admin' | 'supplier') => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
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

  const {
    checkRequiredRole,
    checkRole,
    hasRequiredRole,
    isAdmin,
  } = useRoleAccess(userRole, requiredRole);

  // Special case for admins - they can access supplier paths
  const canAccessCurrentPath = isAdmin() || hasRequiredRole;

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (!authLoading && !isProfileLoading) {
        // If no user is logged in and we're not on the auth page
        if (!user && !location.pathname.startsWith('/auth')) {
          navigate('/auth');
          return;
        }

        // If user is logged in but no role is set
        if (user && !userRole && profileLoaded) {
          navigate('/select-role');
          return;
        }

        // If user is logged in and has a role, but is on the wrong path
        if (user && userRole && !canAccessCurrentPath) {
          if (userRole === 'admin') {
            navigate('/admin');
          } else {
            navigate('/supplier/dashboard');
          }
          return;
        }
      }
    };

    checkAuthAndRedirect();
  }, [user, userRole, authLoading, isProfileLoading, profileLoaded, location.pathname, navigate, canAccessCurrentPath]);

  useEffect(() => {
    if (user && !profileLoaded && !isProfileLoading && loadingAttempts < 5) {
      loadUserProfile();
    }
  }, [user, profileLoaded, isProfileLoading, loadingAttempts, loadUserProfile]);

  useEffect(() => {
    if (user && userRole && !authLoading && profileLoaded) {
      const welcomeMessage = isAdmin() 
        ? 'Welcome back, Administrator!' 
        : 'Welcome to your supplier dashboard!';
      
      toast({
        title: "Login Successful",
        description: `${welcomeMessage} (${user.email})`,
      });
    }
  }, [user, userRole, authLoading, profileLoaded]);

  return { 
    isLoading: authLoading || (user && !profileLoaded && loadingAttempts < 5), 
    error, 
    user,
    session,
    userRole, 
    handleRetry, 
    handleSignOut, 
    checkRole,
    isAdmin
  };
};
