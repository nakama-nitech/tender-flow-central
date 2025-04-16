
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
      
      // First, check if the profile already exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, role, first_name, last_name')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileError) {
        console.error("Profile query error:", profileError);
        throw profileError;
      }
      
      // If profile exists, return it
      if (existingProfile) {
        console.log("Existing profile found:", existingProfile);
        setIsProfileLoading(false);
        return existingProfile;
      }
      
      // If no profile exists, get role from user metadata
      const { data: userData } = await supabase.auth.getUser();
      const metadataRole = userData?.user?.user_metadata?.role || 'supplier'; // Default to supplier
      
      console.log("Creating new profile with role:", metadataRole);
      
      // Create a new profile with direct insert
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          role: metadataRole,
          first_name: '',
          last_name: ''
        }])
        .select()
        .single();
      
      if (insertError) {
        console.error("Profile creation error:", insertError);
        throw insertError;
      }
      
      console.log("New profile created:", newProfile);
      toast({
        title: "Profile created",
        description: "Your profile has been set up successfully",
      });
      
      setIsProfileLoading(false);
      return newProfile;
    } catch (e: any) {
      console.error("Profile fetch/create error:", e);
      setProfileError(e.message || "Error with profile data");
      setIsProfileLoading(false);
      
      // Try again with a direct approach if there's an RLS error
      if (e.message && e.message.includes("recursion")) {
        try {
          console.log("Attempting alternate profile creation due to RLS error");
          
          // Use a direct insert approach to avoid recursion issues
          const { data: directProfile, error: directError } = await supabase
            .from('profiles')
            .insert([{
              id: userId,
              role: 'supplier', // Default role
              first_name: '',
              last_name: ''
            }])
            .select()
            .single();
            
          if (!directError && directProfile) {
            console.log("Created profile using direct approach:", directProfile);
            setIsProfileLoading(false);
            return directProfile;
          }
        } catch (directErr) {
          console.error("Even direct profile creation failed:", directErr);
        }
      }
      
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
