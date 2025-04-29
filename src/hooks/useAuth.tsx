
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSessionState } from '@/hooks/useSessionState';
import { useAuthState } from '@/hooks/useAuthState';
import { useRoleAccess } from '@/hooks/useRoleAccess';

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
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setAuthError] = useState<string | null>(authError);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(0);

  // Check user role from database when user is available
  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setIsLoading(false);
        setAuthChecked(true);
        setProfileLoaded(true);
        return;
      }

      try {
        setLoadingAttempts(prev => prev + 1);
        // First, check user metadata for role
        const metadataRole = user.user_metadata?.role;
        
        if (metadataRole) {
          console.log("Found role in user metadata:", metadataRole);
          setUserRole(metadataRole);
          setIsLoading(false);
          setAuthChecked(true);
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
          } else {
            // We can't directly query the 'admins' table, as it doesn't exist in the schema
            // Instead, we will check a flag in the user's metadata or just default to supplier
            const isAdminUser = user.user_metadata?.is_admin === true;
            
            if (isAdminUser) {
              console.log("User marked as admin in metadata");
              setUserRole('admin');
            } else {
              console.warn("User not found in role tables, defaulting to supplier");
              setUserRole('supplier');
            }
            setProfileLoaded(true);
          }
        }
      } catch (error: any) {
        console.error("Error determining user role:", error);
        setAuthError(error.message || "Failed to determine user role");
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };

    if (!authLoading) {
      if (!authChecked) {
        checkUserRole();
      }
    } else {
      setIsLoading(true);
    }
  }, [user, authLoading, authChecked]);

  // Use the role access hook to check permissions
  const roleAccess = useRoleAccess(userRole, requiredRole);

  // Check if user has required role
  const hasRequiredRole = (): boolean => {
    if (!requiredRole) return true;
    if (!userRole) return false;
    
    // Special case: admins can access supplier routes
    if (requiredRole === 'supplier' && userRole === 'admin') {
      return true;
    }
    
    return userRole === requiredRole;
  };

  // Add isAdmin function for components that need it
  const isAdmin = (): boolean => {
    return userRole === 'admin';
  };

  // Merge all the errors
  useEffect(() => {
    if (authError) {
      setAuthError(authError);
    }
  }, [authError]);

  return {
    isLoading: isLoading || authLoading,
    error: error || authError,
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
