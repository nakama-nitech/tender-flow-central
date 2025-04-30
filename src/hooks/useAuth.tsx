import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';

export const useAuth = (requiredRole?: 'admin' | 'supplier') => {
  // Use the core auth state for session management
  const { 
    isLoading: authLoading, 
    error: authError, 
    user, 
    session, 
    handleRetry, 
    handleSignOut,
    setError 
  } = useAuthState();
  
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(0);
  const [lastCheckTimestamp, setLastCheckTimestamp] = useState(0);

  // Debounce profile checks to prevent excessive database calls
  useEffect(() => {
    if (!user) {
      setUserRole(null);
      setProfileLoaded(false);
      return;
    }

    if (profileLoaded) return;
    
    // Skip duplicate profile checks within a short time window
    const now = Date.now();
    if (now - lastCheckTimestamp < 2000) return;
    
    setLastCheckTimestamp(now);
    
    const checkUserRole = async () => {
      try {
        setLoadingAttempts(prev => prev + 1);
        console.log("Attempt", loadingAttempts + 1, "to determine role for user", user.id);
        
        // First, check user metadata for role
        const metadataRole = user.user_metadata?.role;
        
        if (metadataRole) {
          console.log("Found role in user metadata:", metadataRole);
          setUserRole(metadataRole);
          setProfileLoaded(true);
          return;
        }
        
        // If no role in metadata, check profiles table
        console.log("Checking profiles table for user ID:", user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile data:", profileError);
          throw profileError;
        }
        
        if (profileData && profileData.role) {
          console.log("User found in profiles table with role:", profileData.role);
          setUserRole(profileData.role);
          setProfileLoaded(true);
          
          // Update metadata to cache the role
          try {
            await supabase.auth.updateUser({
              data: { role: profileData.role }
            });
          } catch (e) {
            console.warn("Could not update metadata with role:", e);
          }
        } else {
          // Check if user is in suppliers table
          console.log("Checking suppliers table");
          const { data: supplierData, error: supplierError } = await supabase
            .from('suppliers')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (supplierError && supplierError.code !== 'PGRST116') {
            console.error("Error fetching supplier data:", supplierError);
            throw supplierError;
          }
          
          if (supplierData) {
            console.log("User found in suppliers table");
            setUserRole('supplier');
            setProfileLoaded(true);
            
            // Update metadata to cache the role
            try {
              await supabase.auth.updateUser({
                data: { role: 'supplier' }
              });
            } catch (e) {
              console.warn("Could not update metadata with role:", e);
            }
          } else {
            // Default to supplier role if not found
            console.log("User not found in role tables, defaulting to supplier");
            setUserRole('supplier');
            setProfileLoaded(true);
            
            // Try to create a profile entry
            try {
              await supabase.rpc('upsert_profile', {
                user_id: user.id,
                user_role: 'supplier',
                first_name: '',
                last_name: ''
              });
              
              // Update metadata to cache the role
              await supabase.auth.updateUser({
                data: { role: 'supplier' }
              });
            } catch (e) {
              console.warn("Could not create profile or update metadata:", e);
            }
          }
        }
      } catch (error: any) {
        console.error("Error determining user role:", error);
        if (loadingAttempts >= 3) {
          setError(error.message || "Failed to determine user role");
        }
      }
    };

    checkUserRole();
  }, [user, loadingAttempts, lastCheckTimestamp, profileLoaded, setError]);

  // Memoize role checking functions to prevent unnecessary re-renders
  const hasRequiredRole = useCallback((): boolean => {
    if (!requiredRole) return true;
    if (!userRole) return false;
    
    // Special case: admins can access supplier routes
    if (requiredRole === 'supplier' && userRole === 'admin') {
      return true;
    }
    
    return userRole === requiredRole;
  }, [requiredRole, userRole]);

  // Add isAdmin function for components that need it
  const isAdmin = useCallback((): boolean => {
    return userRole === 'admin';
  }, [userRole]);

  // Calculate final loading state - only done loading when auth AND profile are loaded
  const isLoading = useMemo(() => {
    // If auth is still loading, we're loading
    if (authLoading) return true;
    
    // If auth finished loading and there's no user, we're done loading
    if (!user) return false;
    
    // If we have a user but no profile and haven't reached max attempts, we're still loading
    if (user && !profileLoaded && loadingAttempts < 5) return true;
    
    // Otherwise we're done loading
    return false;
  }, [authLoading, user, profileLoaded, loadingAttempts]);

  // Consolidated error handling
  const error = useMemo(() => {
    return authError;
  }, [authError]);

  return {
    isLoading,
    error,
    user,
    session,
    userRole,
    hasRequiredRole,
    handleRetry,
    handleSignOut,
    setError,
    isAdmin
  };
};
