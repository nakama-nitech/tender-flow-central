
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionState } from '@/hooks/useSessionState';
import { useProfileManagement } from '@/hooks/useProfileManagement';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useRoleBasedRedirection } from '@/hooks/useRoleBasedRedirection';
import { useToast } from '@/hooks/use-toast';

export const useAuth = (requiredRole?: 'admin' | 'supplier') => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use the session state hook
  const { 
    isLoading: authLoading, 
    error, 
    user, 
    session,
    setError,
    handleRetry, 
    handleSignOut 
  } = useSessionState();

  // Use the profile management hook
  const {
    userRole,
    loadUserProfile,
    isProfileLoading,
    profileLoaded,
    loadingAttempts,
    checkAdminByEmail
  } = useProfileManagement(user, setError);

  // Use the role access hook
  const {
    checkRequiredRole,
    checkRole,
    hasRequiredRole,
    isAdmin,
  } = useRoleAccess(userRole, requiredRole);

  // Special case for admins - they can access supplier paths
  const canAccessCurrentPath = isAdmin() || hasRequiredRole;

  // Use the role-based redirection hook
  useRoleBasedRedirection({
    user,
    userRole,
    requiredRole,
    authLoading,
    profileLoaded,
    loadingAttempts,
    canAccessCurrentPath,
    setError
  });

  // Load profile when user changes
  useEffect(() => {
    if (user && !profileLoaded && !isProfileLoading && loadingAttempts < 5) {
      loadUserProfile();
    }
  }, [user, profileLoaded, isProfileLoading, loadingAttempts, loadUserProfile]);

  // Handle successful login notification
  useEffect(() => {
    if (user && userRole && !authLoading && profileLoaded) {
      const welcomeMessage = isAdmin() 
        ? 'Welcome back, Administrator!' 
        : 'Welcome to your supplier dashboard!';
      
      toast({
        title: "Login Successful",
        description: `${welcomeMessage} (${user.email})`,
      });

      // Redirect to the handler component
      navigate('/redirect');
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
