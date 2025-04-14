
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useProfile = (userId: string | undefined, session: any) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch profile data using RPC function to bypass RLS issues
  const fetchProfileData = useCallback(async (userId: string) => {
    if (!userId) return null;
    
    try {
      console.log("Fetching profile for user", userId);
      
      // Get role from user metadata as a fallback
      const { data: userData } = await supabase.auth.getUser();
      const metadataRole = userData?.user?.user_metadata?.role;
      
      // First try direct query with a timeout
      const fetchPromise = new Promise<any>(async (resolve, reject) => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, role, first_name, last_name')
            .eq('id', userId)
            .maybeSingle();
          
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        } catch (e) {
          reject(e);
        }
      });
      
      // Set a timeout to prevent hanging
      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 2000);
      });
      
      // Use Promise.race to handle potential deadlocks
      const profileData = await Promise.race([fetchPromise, timeoutPromise]);
      
      // If profile data was retrieved successfully
      if (profileData) {
        console.log("Profile loaded successfully:", profileData);
        return profileData;
      }
      
      // If we couldn't get the profile data from the table, use the fallback
      if (metadataRole) {
        console.log("Using metadata role as fallback:", metadataRole);
        return { 
          id: userId, 
          role: metadataRole
        };
      }
      
      // Create a profile if none exists
      console.log("No profile found, creating one...");
      // Use a simple fetch to avoid Supabase client deadlocks
      const response = await fetch(`https://llguuxqvggwpqjhupnjm.supabase.co/rest/v1/rpc/upsert_profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsZ3V1eHF2Z2d3cHFqaHVwbmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTQyNTQsImV4cCI6MjA1OTc3MDI1NH0.7YJkRFBdhsRt8u-sXWgEFNbRFyhQWKsQHcF656WGHcg',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          user_id: userId,
          user_role: 'supplier', // Default role is supplier
          first_name: '',
          last_name: ''
        })
      });
      
      if (!response.ok) {
        console.error("Profile creation failed", await response.json());
        return null;
      }
      
      toast({
        title: "Profile created",
        description: "Your profile has been set up successfully",
      });
      
      return { 
        id: userId, 
        role: 'supplier'
      };
    } catch (e) {
      console.error("Profile fetch error:", e);
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

  return {
    userRole,
    setUserRole,
    loadUserProfile
  };
};
