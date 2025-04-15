
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

  // Fetch profile data using RPC function to bypass RLS issues
  const fetchProfileData = useCallback(async (userId: string) => {
    if (!userId) return null;
    
    try {
      console.log("Fetching profile for user", userId);
      setIsProfileLoading(true);
      setProfileError(null);
      
      // Get role from user metadata as a fallback
      const { data: userData } = await supabase.auth.getUser();
      const metadataRole = userData?.user?.user_metadata?.role;
      console.log("User metadata role:", metadataRole);
      
      // First try direct query
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, first_name, last_name')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error("Profile query error:", error);
        throw error;
      }
      
      // If profile data was retrieved successfully
      if (data) {
        console.log("Profile loaded successfully:", data);
        setIsProfileLoading(false);
        return data;
      }
      
      // If we couldn't get the profile data from the table, use the fallback
      if (metadataRole) {
        console.log("Using metadata role as fallback:", metadataRole);
        setIsProfileLoading(false);
        return { 
          id: userId, 
          role: metadataRole
        };
      }
      
      // Create a profile if none exists
      console.log("No profile found, creating one...");
      const { data: newProfile, error: createError } = await supabase.rpc('upsert_profile', {
        user_id: userId,
        user_role: metadataRole || 'supplier', // Use metadata role if available, otherwise default to supplier
        first_name: '',
        last_name: ''
      });
      
      if (createError) {
        console.error("Profile creation failed:", createError);
        throw createError;
      }
      
      // Fetch the newly created profile
      const { data: createdProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, role, first_name, last_name')
        .eq('id', userId)
        .maybeSingle();
        
      if (fetchError) {
        console.error("Fetch after creation error:", fetchError);
        throw fetchError;
      }
      
      if (createdProfile) {
        toast({
          title: "Profile created",
          description: "Your profile has been set up successfully",
        });
        
        console.log("Created new profile:", createdProfile);
        setIsProfileLoading(false);
        return createdProfile;
      }
      
      throw new Error("Failed to create and fetch profile");
    } catch (e) {
      console.error("Profile fetch/create error:", e);
      setProfileError("Error with profile data");
      setIsProfileLoading(false);
      return null;
    }
  }, [session, toast]);

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
