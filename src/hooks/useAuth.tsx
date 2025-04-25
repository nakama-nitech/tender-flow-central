
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionState } from '@/hooks/useSessionState';
import { useProfileManagement } from '@/hooks/useProfileManagement';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useRoleBasedRedirection } from '@/hooks/useRoleBasedRedirection';

export const useAuth = (requiredRole?: 'admin' | 'supplier') => {
  const navigate = useNavigate();
  
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
