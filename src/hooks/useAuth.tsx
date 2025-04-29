
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSessionState } from '@/hooks/useSessionState';

export const useAuth = (requiredRole?: 'admin' | 'supplier') => {
  const { isLoading: sessionLoading, error: sessionError, user, session } = useSessionState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(sessionError);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Check user role from database when user is available
  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setIsLoading(false);
        setAuthChecked(true);
        return;
      }

      try {
        // First, check user metadata for role
        const metadataRole = user.user_metadata?.role;
        
        if (metadataRole) {
          console.log("Found role in user metadata:", metadataRole);
          setUserRole(metadataRole);
          setIsLoading(false);
          setAuthChecked(true);
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
          } else {
            // Check if user is an admin
            const { data: adminData, error: adminError } = await supabase
              .from('admins')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();
            
            if (adminError && adminError.code !== 'PGRST116') {
              console.error("Error fetching admin data:", adminError);
              throw adminError;
            }
            
            if (adminData) {
              console.log("User found in admins table");
              setUserRole('admin');
            } else {
              console.warn("User not found in role tables, defaulting to supplier");
              setUserRole('supplier');
            }
          }
        }
      } catch (error: any) {
        console.error("Error determining user role:", error);
        setError(error.message || "Failed to determine user role");
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };

    if (!sessionLoading) {
      if (!authChecked) {
        checkUserRole();
      }
    } else {
      setIsLoading(true);
    }
  }, [user, sessionLoading, authChecked]);

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

  return {
    isLoading,
    error: error || sessionError,
    user,
    session,
    userRole,
    hasRequiredRole
  };
};
