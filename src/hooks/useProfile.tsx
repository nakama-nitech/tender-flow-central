
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useProfile = (userId: string | undefined, session: any) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
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
      
      // Fetch only the profile data we need, avoiding fields that might trigger recursive policies
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('id', userId)
        .maybeSingle();
        
      if (profileError) {
        console.error("Profile query error:", profileError);
        throw profileError;
      }
      
      // If profile exists, combine it with the role
      if (profileData) {
        const profile = {
          ...profileData,
          role: userRoleData
        };
        
        console.log("Existing profile found:", profile);
        setIsProfileLoading(false);
        return profile;
      }
      
      // If no profile exists, get role from user metadata
      const { data: userData } = await supabase.auth.getUser();
      const metadataRole = userData?.user?.user_metadata?.role || 'supplier'; // Default to supplier
      
      console.log("Creating new profile with role:", metadataRole);
      
      // Create a new profile with direct insert, avoiding RLS issues
      const { data: newProfile, error: insertError } = await supabase.rpc('upsert_profile', {
        user_id: userId,
        user_role: metadataRole,
        first_name: '',
        last_name: ''
      });
      
      if (insertError) {
        console.error("Profile creation error:", insertError);
        throw insertError;
      }
      
      // Use a safe query to fetch profile data
      const { data: createdProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('id', userId)
        .maybeSingle();
        
      if (fetchError) {
        console.error("Error fetching created profile:", fetchError);
        throw fetchError;
      }
      
      // Combine with role from previous RPC call
      const fullProfile = {
        ...createdProfile,
        role: metadataRole
      };
      
      console.log("New profile created:", fullProfile);
      toast({
        title: "Profile created",
        description: "Your profile has been set up successfully",
      });
      
      setIsProfileLoading(false);
      return fullProfile;
    } catch (e: any) {
      console.error("Profile fetch/create error:", e);
      setProfileError(e.message || "Error with profile data");
      setIsProfileLoading(false);
      
      // Create a fallback profile object
      return {
        id: userId,
        role: 'supplier', // Default role
        first_name: '',
        last_name: ''
      };
    }
  }, [toast]);

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
    profileError
  };
};
