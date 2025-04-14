
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '@/hooks/useAuthState';
import { useProfile } from '@/hooks/useProfile';
import { useRoleAccess } from '@/hooks/useRoleAccess';

export const useAuth = (requiredRole?: 'admin' | 'supplier') => {
  const [profileLoaded, setProfileLoaded] = useState(false);
  const navigate = useNavigate();
  
  // Use the base auth state hook
  const { 
    isLoading: authLoading, 
    error: authError, 
    user, 
    session,
    setError,
    handleRetry, 
    handleSignOut 
  } = useAuthState();

  // Use the profile hook
  const {
    userRole,
    loadUserProfile
  } = useProfile(user?.id, session);

  // Use the role access hook
  const {
    checkRequiredRole,
    checkRole,
    hasRequiredRole
  } = useRoleAccess(userRole, requiredRole);

  useEffect(() => {
    const loadProfile = async () => {
      // Skip if we're still loading auth, or if we don't have a user, 
      // or if profile is already loaded
      if (authLoading || !user || profileLoaded) return;
      
      // Load the user profile
      await loadUserProfile();
      setProfileLoaded(true);
    };

    loadProfile();
  }, [authLoading, user, profileLoaded, loadUserProfile]);

  useEffect(() => {
    // If we have completed loading the profile, check required roles
    if (!authLoading && profileLoaded && userRole) {
      if (requiredRole && !hasRequiredRole) {
        setError(`You need ${requiredRole} permissions to access this area.`);
        navigate('/select-role');
      }
    }
    
    // If authentication fails and we have a required role, redirect to auth
    if (!authLoading && !user && requiredRole) {
      navigate('/auth');
    }
  }, [authLoading, profileLoaded, userRole, requiredRole, hasRequiredRole, navigate, setError]);

  // Calculate the final loading state (either auth is loading or profile is loading)
  const isLoading = authLoading || (user && !profileLoaded);

  return { 
    isLoading, 
    error: authError, 
    user,
    session,
    userRole, 
    handleRetry, 
    handleSignOut, 
    checkRole 
  };
};
