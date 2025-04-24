
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '@/hooks/useAuthState';
import { useProfile } from '@/hooks/useProfile';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuth = (requiredRole?: 'admin' | 'supplier') => {
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
    hasRequiredRole,
    isAdmin,
    checkAdminByEmail
  } = useRoleAccess(userRole, requiredRole);

  // Special case for admins - they can access supplier paths
  const canAccessCurrentPath = isAdmin() || hasRequiredRole;

  // Display helpful toast when profile loading begins
  useEffect(() => {
    if (user && !profileLoaded && !isProfileLoading && loadingAttempts === 0) {
      toast({
        title: "Loading your profile",
        description: "Please wait while we retrieve your account information",
      });
    }
  }, [user, profileLoaded, isProfileLoading, loadingAttempts, toast]);

  // Attempt to load profile if not loaded yet
  useEffect(() => {
    const loadProfile = async () => {
      // Skip if we're still loading auth, or if we don't have a user, 
      // or if profile is already loaded, or if we're currently loading the profile
      if (authLoading || !user || profileLoaded || isProfileLoading) return;
      
      console.log(`Profile loading attempt ${loadingAttempts + 1}...`);
      
      try {
        // Check if user should be admin by email
        const isAdminByEmail = await checkAdminByEmail();
        
        // Load the user profile
        const profile = await loadUserProfile();
        
        // If user should be admin but profile doesn't have admin role, update it
        if (isAdminByEmail && profile && profile.role !== 'admin') {
          console.log("User should be admin but has role:", profile.role);
          try {
            // Direct update instead of using the previous method that might cause recursion
            const { error } = await supabase.rpc('upsert_profile', {
              user_id: user.id,
              user_role: 'admin',
              first_name: profile.first_name || '',
              last_name: profile.last_name || ''
            });
            
            if (error) {
              console.error("Error updating to admin role:", error);
            } else {
              console.log("Updated user to admin role");
              // Force reload to get updated role
              window.location.reload();
              return;
            }
          } catch (error) {
            console.error("Error in admin role update:", error);
          }
        }
        
        if (profile) {
          console.log("Profile loaded successfully:", profile);
          setProfileLoaded(true);
          
          // Show success toast on successful profile load
          toast({
            title: "Profile loaded",
            description: `Welcome ${profile.role === 'admin' ? 'Administrator' : 'Supplier'}!`,
            variant: "default"
          });
          
          // If user is on the auth page, redirect to appropriate dashboard
          if (window.location.pathname === '/auth') {
            navigate(profile.role === 'admin' ? '/admin' : '/supplier/dashboard');
          }
        } else {
          // If profile loading failed, try again after a delay (max 5 attempts)
          if (loadingAttempts < 5) {
            console.log("Profile loading failed, retrying...");
            setTimeout(() => {
              setLoadingAttempts(prev => prev + 1);
            }, 1000);
          } else {
            console.error("Failed to load profile after multiple attempts");
            setError("Failed to load your profile. Please try logging in again.");
            // Add fallback redirection
            navigate('/auth');
          }
        }
      } catch (error: any) {
        console.error("Error loading profile:", error);
        if (loadingAttempts < 5) {
          setTimeout(() => {
            setLoadingAttempts(prev => prev + 1);
          }, 1000);
        } else {
          setError(error.message || "Failed to load your profile due to an error. Please try logging in again.");
          // Add fallback redirection
          navigate('/auth');
        }
      }
    };

    loadProfile();
  }, [authLoading, user, profileLoaded, isProfileLoading, loadingAttempts, loadUserProfile, setError, checkAdminByEmail, toast, navigate]);

  // Handle profile errors
  useEffect(() => {
    if (profileError) {
      setError(profileError);
      // Add default redirect
      if (loadingAttempts >= 5) {
        navigate('/auth');
      }
    }
  }, [profileError, setError, loadingAttempts, navigate]);

  // Handle redirections based on role requirements
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

  // Combine and expose all error states
  const error = authError || profileError;
  
  // Calculate the final loading state (either auth is loading or profile is loading)
  const isLoading = authLoading || (user && !profileLoaded && loadingAttempts < 5);

  return { 
    isLoading, 
    error, 
    user,
    session,
    userRole, 
    handleRetry, 
    handleSignOut, 
    checkRole,
    isAdmin: isAdmin
  };
};
