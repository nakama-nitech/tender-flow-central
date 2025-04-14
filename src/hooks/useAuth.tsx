
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

  // Fetch profile data separately to avoid Supabase client deadlocks
  const fetchProfileData = useCallback(async (userId: string) => {
    try {
      console.log("Fetching profile for user", userId);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, role, first_name, last_name')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setError("Failed to load your profile data. Please try again.");
        return null;
      }
      
      if (!profileData) {
        console.log("No profile found, creating one...");
        
        // Handle profile creation via RPC function to avoid RLS issues
        const { error: upsertError } = await supabase.rpc('upsert_profile', {
          user_id: userId,
          user_role: 'supplier', // Default role is supplier
          first_name: '',
          last_name: ''
        });
        
        if (upsertError) {
          console.error("Profile creation error:", upsertError);
          setError("Failed to create your profile. Please try again or contact support.");
          return null;
        }
        
        toast({
          title: "Profile created",
          description: "Your profile has been set up successfully",
        });
        
        return { role: 'supplier' };
      }
      
      console.log("Profile loaded successfully:", profileData);
      return profileData;
    } catch (e) {
      console.error("Profile fetch error:", e);
      setError("Error loading profile data");
      return null;
    }
  }, [toast]);

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
      async (event, sessionData) => {
        console.log("Auth state changed:", event);
        setSession(sessionData);
        
        if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setUser(null);
          setUserRole(null);
          // Don't navigate here to avoid circular redirects
        } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && sessionData) {
          console.log("User signed in or token refreshed");
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
            }
          }, 0);
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
