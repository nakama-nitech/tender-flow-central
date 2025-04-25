
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
      const isAdminByEmail = await checkAdminByEmail();
      
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_profile_role', { user_id: user.id });

      if (roleError) throw roleError;
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) throw profileError;
      
      if (profileData) {
        const profile = {
          ...profileData,
          role: roleData,
          id: user.id
        };
        
        if (isAdminByEmail && profile.role !== 'admin') {
          console.log("User should be admin but has role:", profile.role);
          window.location.reload();
          return null;
        }
        
        setProfileLoaded(true);
        setUserRole(profile.role);
        
        toast({
          title: "Profile loaded",
          description: `Welcome ${profile.role === 'admin' ? 'Administrator' : 'Supplier'}!`,
        });
        
        return profile;
      }
      
      return null;
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
