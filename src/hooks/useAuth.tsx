
import { useEffect } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { useProfileManagement } from '@/hooks/useProfileManagement';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useRoleBasedRedirection } from '@/hooks/useRoleBasedRedirection';
import { useToast } from '@/hooks/use-toast';

export const useAuth = (requiredRole?: 'admin' | 'supplier') => {
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
  // This is key for allowing admins to view supplier dashboard
  const canAccessCurrentPath = isAdmin() || hasRequiredRole || 
    (userRole === 'admin' && requiredRole === 'supplier');

  // Use the role-based redirection hook with the fixed access check
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
    if (user && userRole && !authLoading && profileLoaded && window.location.pathname === '/redirect') {
      const welcomeMessage = `Welcome back${user.email ? `, ${user.email}` : ''}!`;
      
      toast({
        title: "Login Successful",
        description: welcomeMessage,
      });
    }
  }, [user, userRole, authLoading, profileLoaded, toast]);

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
