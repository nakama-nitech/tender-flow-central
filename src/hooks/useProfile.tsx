
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
      
      // Use direct RPC call instead of querying the profiles table directly
      // This bypasses RLS and avoids recursion issues
      const { data, error } = await supabase.rpc('get_profile', {
        p_user_id: userId
      });
      
      if (error) {
        console.error("Profile RPC error:", error);
        
        // Fallback: Try a simpler query with admin auth bypassing
        const { data: directData, error: directError } = await supabase
          .from('profiles')
          .select('id, role, first_name, last_name')
          .eq('id', userId)
          .maybeSingle();
        
        if (directError) {
          console.error("Direct profile query error:", directError);
          throw directError;
        }
        
        if (directData) {
          console.log("Profile loaded through direct query:", directData);
          setIsProfileLoading(false);
          return directData;
        }
        
        throw error;
      }
      
      // If profile data was retrieved successfully
      if (data) {
        console.log("Profile loaded successfully via RPC:", data);
        setIsProfileLoading(false);
        return data;
      }
      
      // If we couldn't get the profile data from RPC, use the fallback
      if (metadataRole) {
        console.log("Using metadata role as fallback:", metadataRole);
        
        // Use a simpler, direct insert that avoids potential RLS issues
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            role: metadataRole,
            first_name: '',
            last_name: ''
          })
          .select()
          .single();
        
        if (insertError) {
          console.error("Profile creation error:", insertError);
          // Last fallback - just return the metadata
          setIsProfileLoading(false);
          return { 
            id: userId, 
            role: metadataRole,
            first_name: '',
            last_name: ''
          };
        }
        
        toast({
          title: "Profile created",
          description: "Your profile has been set up successfully",
        });
        
        setIsProfileLoading(false);
        return { 
          id: userId, 
          role: metadataRole,
          first_name: '',
          last_name: ''
        };
      }
      
      // Create a default profile if nothing else worked
      console.log("No profile found, creating default one...");
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          role: 'supplier', // Default role
          first_name: '',
          last_name: ''
        })
        .select()
        .single();
      
      if (createError) {
        console.error("Default profile creation failed:", createError);
        throw createError;
      }
      
      toast({
        title: "Profile created",
        description: "Your profile has been set up successfully",
      });
      
      setIsProfileLoading(false);
      return {
        id: userId,
        role: 'supplier',
        first_name: '',
        last_name: ''
      };
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
