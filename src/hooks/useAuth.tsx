
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '@/hooks/useAuthState';
import { useProfile } from '@/hooks/useProfile';
import { useRoleAccess } from '@/hooks/useRoleAccess';

export const useAuth = (requiredRole?: 'admin' | 'supplier') => {
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(0);
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
    loadUserProfile,
    isProfileLoading,
    profileError
  } = useProfile(user?.id, session);

  // Use the role access hook
  const {
    checkRequiredRole,
    checkRole,
    hasRequiredRole
  } = useRoleAccess(userRole, requiredRole);

  // Attempt to load profile if not loaded yet
  useEffect(() => {
    const loadProfile = async () => {
      // Skip if we're still loading auth, or if we don't have a user, 
      // or if profile is already loaded, or if we're currently loading the profile
      if (authLoading || !user || profileLoaded || isProfileLoading) return;
      
      console.log(`Profile loading attempt ${loadingAttempts + 1}...`);
      
      // Load the user profile
      const profile = await loadUserProfile();
      if (profile) {
        console.log("Profile loaded successfully:", profile);
        setProfileLoaded(true);
      } else {
        // If profile loading failed, try again after a delay (max 3 attempts)
        if (loadingAttempts < 3) {
          console.log("Profile loading failed, retrying...");
          setTimeout(() => {
            setLoadingAttempts(prev => prev + 1);
          }, 1000);
        } else {
          console.error("Failed to load profile after multiple attempts");
          setError("Failed to load your profile. Please try logging in again.");
        }
      }
    };

    loadProfile();
  }, [authLoading, user, profileLoaded, isProfileLoading, loadingAttempts, loadUserProfile, setError]);

  // Handle profile errors
  useEffect(() => {
    if (profileError) {
      setError(profileError);
    }
  }, [profileError, setError]);

  // Handle redirections based on role requirements
  useEffect(() => {
    // Only perform redirects if auth is complete and we've attempted to load the profile
    const shouldCheckAccess = !authLoading && (profileLoaded || loadingAttempts >= 3);
    
    if (shouldCheckAccess) {
      // If a specific role is required but the user doesn't have it
      if (user && userRole && requiredRole && !hasRequiredRole) {
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
    hasRequiredRole, 
    navigate, 
    setError
  ]);

  // Combine and expose all error states
  const error = authError || profileError;
  
  // Calculate the final loading state (either auth is loading or profile is loading)
  const isLoading = authLoading || (user && !profileLoaded && loadingAttempts < 3);

  return { 
    isLoading, 
    error, 
    user,
    session,
    userRole, 
    handleRetry, 
    handleSignOut, 
    checkRole 
  };
};
