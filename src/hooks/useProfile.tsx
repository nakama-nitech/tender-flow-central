
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useProfile = (userId: string | undefined, session: any) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const { toast } = useToast();

  // Fetch profile data
  const fetchProfileData = useCallback(async (userId: string) => {
    if (!userId) return null;
    
    try {
      console.log("Fetching profile for user", userId);
      setIsProfileLoading(true);
      setProfileError(null);
      
      // Use the RPC function to get user role to avoid recursion
      const { data: userRoleData, error: roleError } = await supabase
        .rpc('get_profile_role', { user_id: userId });
        
      if (roleError) {
        console.error("Role query error:", roleError);
        throw roleError;
      }
      
      // If we got a role, we have a profile
      if (userRoleData) {
        console.log("User role retrieved:", userRoleData);
        
        // Fetch basic profile info
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('id', userId)
          .maybeSingle();
          
        if (profileError) {
          console.warn("Profile fetch warning:", profileError);
          // Continue anyway, as we already have the role
        }
        
        const profile = {
          ...(profileData || { first_name: '', last_name: '' }),
          id: userId,
          role: userRoleData
        };
        
        console.log("Profile data:", profile);
        return profile;
      }
      
      // If no role/profile found, create one
      console.log("No profile found, creating default profile");
      
      // Get role from user metadata if available
      const { data: userData } = await supabase.auth.getUser();
      const metadataRole = userData?.user?.user_metadata?.role || 'supplier'; 
      
      // Create a new profile with direct insert, avoiding RLS issues
      const { error: insertError } = await supabase.rpc('upsert_profile', {
        user_id: userId,
        user_role: metadataRole,
        first_name: '',
        last_name: ''
      });
      
      if (insertError) {
        console.error("Profile creation error:", insertError);
        throw insertError;
      }
      
      console.log("New profile created with role:", metadataRole);
      
      // Return the new profile
      const profile = {
        id: userId,
        first_name: '',
        last_name: '',
        role: metadataRole
      };
      
      toast({
        title: "Profile created",
        description: "Your profile has been set up successfully",
      });
      
      return profile;
    } catch (e: any) {
      console.error("Profile fetch/create error:", e);
      setProfileError(e.message || "Error with profile data");
      
      // Only increment load attempts if there was a real error
      if (loadAttempts < 3) {
        setLoadAttempts(prev => prev + 1);
      } else {
        toast({
          title: "Profile Error",
          description: "Could not load your profile. Please try again.",
          variant: "destructive",
        });
      }
      
      // Create a fallback profile object
      return {
        id: userId,
        role: 'supplier', // Default role
        first_name: '',
        last_name: ''
      };
    } finally {
      setIsProfileLoading(false);
    }
  }, [toast, loadAttempts]);

  const loadUserProfile = useCallback(async () => {
    if (!userId) return null;
    
    const profile = await fetchProfileData(userId);
    if (profile) {
      setUserRole(profile.role);
    }
    return profile;
  }, [userId, fetchProfileData]);

  // Auto-load profile when userId changes
  useEffect(() => {
    if (userId && !userRole && !isProfileLoading) {
      loadUserProfile();
    }
  }, [userId, userRole, isProfileLoading, loadUserProfile]);

  return {
    userRole,
    setUserRole,
    loadUserProfile,
    isProfileLoading,
    profileError,
    loadAttempts,
    retryLoading: () => {
      setLoadAttempts(0);
      setProfileError(null);
      return loadUserProfile();
    }
  };
};
