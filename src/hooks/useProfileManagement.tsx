
import { useState, useCallback, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useProfileManagement = (
  user: User | null,
  setError: (error: string | null) => void
) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(0);
  const { toast } = useToast();

  const checkAdminByEmail = useCallback(async () => {
    if (!user?.email) return false;
    
    const adminEmails = ['jeffmnjogu@gmail.com', 'astropeter42@yahoo.com'];
    const isAdmin = adminEmails.includes(user.email);
    
    if (isAdmin) {
      console.log("User email is in admin list");
      try {
        await supabase.auth.updateUser({
          data: { role: 'admin' }
        });
        
        await supabase.rpc('upsert_profile', {
          user_id: user.id,
          user_role: 'admin',
          first_name: '',
          last_name: ''
        });
        
        return true;
      } catch (error) {
        console.error("Error updating to admin:", error);
      }
    }
    
    return false;
  }, [user]);

  const loadUserProfile = useCallback(async () => {
    if (!user?.id || isProfileLoading) return null;
    
    console.log(`Profile loading attempt ${loadingAttempts + 1}...`);
    setIsProfileLoading(true);
    
    try {
      // Check if user should be admin by email
      const isAdminByEmail = await checkAdminByEmail();

      // Get role using the RPC function instead of direct query
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_profile_role', { user_id: user.id });

      if (roleError) {
        console.error("Role query error:", roleError);
        throw roleError;
      }
      
      // If we have a role, we can consider the profile loaded
      if (roleData) {
        console.log("User role from database:", roleData);
        
        // We'll still attempt to create/update the profile if it doesn't exist or is incomplete
        try {
          const { error: upsertError } = await supabase.rpc('upsert_profile', {
            user_id: user.id,
            user_role: isAdminByEmail ? 'admin' : roleData,
            first_name: '',
            last_name: ''
          });
          
          if (upsertError) {
            console.warn("Error ensuring profile exists:", upsertError);
          }
        } catch (e) {
          console.warn("Error in profile upsert:", e);
          // Non-critical error, continue
        }
        
        setProfileLoaded(true);
        setUserRole(isAdminByEmail ? 'admin' : roleData);
        
        toast({
          title: "Profile loaded",
          description: `Welcome ${roleData === 'admin' ? 'Administrator' : 'Supplier'}!`,
        });
        
        return {
          id: user.id,
          role: isAdminByEmail ? 'admin' : roleData, 
          first_name: '',
          last_name: ''
        };
      } else {
        // No role found, try to create a default profile
        const defaultRole = isAdminByEmail ? 'admin' : 'supplier';
        console.log("Creating default profile with role:", defaultRole);
        
        const { error: createError } = await supabase.rpc('upsert_profile', {
          user_id: user.id,
          user_role: defaultRole,
          first_name: '',
          last_name: ''
        });
        
        if (createError) {
          console.error("Error creating profile:", createError);
          throw createError;
        }
        
        setProfileLoaded(true);
        setUserRole(defaultRole);
        
        toast({
          title: "Profile created",
          description: `Welcome ${defaultRole === 'admin' ? 'Administrator' : 'Supplier'}!`,
        });
        
        return {
          id: user.id,
          role: defaultRole,
          first_name: '',
          last_name: ''
        };
      }
    } catch (error: any) {
      console.error("Error loading profile:", error);
      if (loadingAttempts < 5) {
        setLoadingAttempts(prev => prev + 1);
      } else {
        setError(error.message || "Failed to load your profile. Please try logging in again.");
      }
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  }, [user, loadingAttempts, isProfileLoading, checkAdminByEmail, setError, toast]);

  useEffect(() => {
    if (user && !profileLoaded && !isProfileLoading && loadingAttempts === 0) {
      toast({
        title: "Loading your profile",
        description: "Please wait while we retrieve your account information",
      });
    }
  }, [user, profileLoaded, isProfileLoading, loadingAttempts, toast]);

  return {
    userRole,
    loadUserProfile,
    isProfileLoading,
    profileLoaded,
    loadingAttempts,
    checkAdminByEmail
  };
};
