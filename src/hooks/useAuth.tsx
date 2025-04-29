import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSessionState } from '@/hooks/useSessionState';

export const useAuth = () => {
  const { isLoading: sessionLoading, error: sessionError, user } = useSessionState();
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
        return;
      }

      try {
        // First, check user metadata for role
        const metadataRole = user.user_metadata?.role;
        
        if (metadataRole) {
          console.log("Found role in user metadata:", metadataRole);
          setUserRole(metadataRole);
          setIsLoading(false);
          return;
        }
        
        // If no role in metadata, check suppliers table
        console.log("Checking suppliers table for user ID:", user.id);
        const { data: supplierData, error: supplierError } = await supabase
          .from('suppliers')
          .select('*')
          .eq('id', user.id)
          .single();
        
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
            .single();
          
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
      } catch (error: any) {
        console.error("Error determining user role:", error);
        setError(error.message || "Failed to determine user role");
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };

    if (!sessionLoading) {
      // Don't check role again if we've already checked it
      if (!authChecked) {
        checkUserRole();
      }
    } else {
      setIsLoading(true);
    }
  }, [user, sessionLoading, authChecked]);

  // Debounce loading state to prevent rapid changes causing UI flicker
  useEffect(() => {
    // If no user is found after session check, quickly update loading state
    if (!sessionLoading && !user) {
      setIsLoading(false);
      return;
    }
    
    // But if user is found, add a small delay to prevent flicker
    let timer: ReturnType<typeof setTimeout> | null = null;
    
    if (!sessionLoading) {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [sessionLoading, user]);

  return {
    isLoading,
    error: error || sessionError,
    user,
    userRole,
    authChecked
  };
};