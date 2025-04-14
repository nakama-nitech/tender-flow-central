import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useAuth = (requiredRole?: 'admin' | 'supplier') => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch profile data using RPC function to bypass RLS issues
  const fetchProfileData = useCallback(async (userId: string) => {
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
          user_role: requiredRole || 'supplier', // Default role is supplier
          first_name: '',
          last_name: ''
        })
      });
      
      if (!response.ok) {
        console.error("Profile creation failed", await response.json());
        setError("Failed to create your profile. Please try again or contact support.");
        return null;
      }
      
      toast({
        title: "Profile created",
        description: "Your profile has been set up successfully",
      });
      
      return { 
        id: userId, 
        role: requiredRole || 'supplier'
      };
    } catch (e) {
      console.error("Profile fetch error:", e);
      setError("Error loading profile data. Please try again.");
      return null;
    }
  }, [session, toast, requiredRole]);

  // Check if user has required role
  const checkRequiredRole = useCallback((profileRole: string | null) => {
    if (requiredRole && profileRole !== requiredRole) {
      console.log(`Required role: ${requiredRole}, User role: ${profileRole}`);
      setError(`You need ${requiredRole} permissions to access this area.`);
      return false;
    }
    return true;
  }, [requiredRole]);

  useEffect(() => {
    console.log("Auth hook initializing...");
    setIsLoading(true);
    setError(null);
    
    // First, set up the auth state listener to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, sessionData) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setSession(null);
          setUser(null);
          setUserRole(null);
        } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && sessionData) {
          console.log("User signed in or token refreshed");
          setSession(sessionData);
          setUser(sessionData.user);
          
          // Use setTimeout to avoid Supabase client deadlocks
          setTimeout(async () => {
            const profile = await fetchProfileData(sessionData.user.id);
            if (profile) {
              setUserRole(profile.role);
              
              if (!checkRequiredRole(profile.role)) {
                // If user doesn't have required role, redirect them
                navigate('/select-role');
              }
              
              setIsLoading(false);
            }
          }, 100);
        }
      }
    );
    
    // Then, check for existing session
    const checkSession = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError("Authentication session error. Please log in again.");
          setIsLoading(false);
          return;
        }
        
        if (!sessionData.session) {
          console.log("No active session");
          setIsLoading(false);
          if (requiredRole) {
            navigate('/auth');
          }
          return;
        }
        
        console.log("Active session found");
        setSession(sessionData.session);
        setUser(sessionData.session.user);
        
        // Get role from user metadata as a fallback
        const metadataRole = sessionData.session.user?.user_metadata?.role;
        
        // If we have a role in metadata and it matches required role, use it directly
        if (metadataRole && (!requiredRole || metadataRole === requiredRole)) {
          console.log("Using role from metadata:", metadataRole);
          setUserRole(metadataRole);
          setIsLoading(false);
          return;
        }
        
        // Otherwise try fetching from profile
        const profile = await fetchProfileData(sessionData.session.user.id);
        if (profile) {
          setUserRole(profile.role);
          
          if (requiredRole && !checkRequiredRole(profile.role)) {
            navigate('/select-role');
          }
        }
        
        setIsLoading(false);
      } catch (e) {
        console.error("Auth check error:", e);
        setError("Authentication error. Please try logging in again.");
        setIsLoading(false);
      }
    };
    
    // Add delay before checking auth to ensure session is fully established
    const timer = setTimeout(() => {
      checkSession();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [navigate, fetchProfileData, checkRequiredRole, requiredRole, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setError(null);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    setUser(null);
    setSession(null);
    setUserRole(null);
    navigate('/auth');
  };

  const checkRole = (role: string) => userRole === role;

  return { 
    isLoading, 
    error, 
    user,
    session,
    userRole, 
    handleRetry, 
    handleSignOut, 
    checkRole 
  };
};
