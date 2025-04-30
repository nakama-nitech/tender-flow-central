import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

export function useAuth(requiredRole?: UserRole) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Consolidated function to fetch or create user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Try to fetch existing profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.log('Profile fetch error:', fetchError);
        
        if (fetchError.code === 'PGRST116') {
          console.log('Profile not found, creating new one');
          // Profile doesn't exist, create one
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{ 
              id: userId, 
              role: 'supplier',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
            .select()
            .single();

          if (createError) {
            console.error('Profile creation error:', createError);
            throw createError;
          }
          
          console.log('New profile created:', newProfile);
          return newProfile;
        }
        throw fetchError;
      }

      console.log('Existing profile found:', profile);
      return profile;
    } catch (err) {
      console.error("Error in fetchUserProfile:", err);
      return null;
    }
  };

  // Handle sign out
  const handleSignOut = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setUserRole(null);
      setSession(null);
      setError(null);
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account",
      });
      
      navigate('/auth');
    } catch (err: any) {
      setError(err.message || "Failed to sign out");
      toast({
        title: "Sign out failed",
        description: err.message || "Failed to sign out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    let authListener: { data: { subscription: { unsubscribe: () => void } } } | null = null;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        setIsLoading(true);
        setError(null);

        // Get current session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        console.log('Current session:', currentSession);

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);

          // Fetch or create profile
          const profile = await fetchUserProfile(currentSession.user.id);
          if (profile) {
            console.log('Setting user role:', profile.role);
            setUserRole(profile.role);
          } else {
            console.error('No profile returned for user');
            setError('Failed to load user profile');
          }
        }
      } catch (err: any) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          setError(err.message || "Failed to initialize authentication");
          toast({
            title: "Authentication Error",
            description: err.message || "Failed to authenticate user",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener
    authListener = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      console.log('Auth state changed:', event, newSession);
      setSession(newSession);

      if (event === 'SIGNED_IN' && newSession?.user) {
        setUser(newSession.user);
        const profile = await fetchUserProfile(newSession.user.id);
        if (profile) {
          console.log('Setting user role from auth state change:', profile.role);
          setUserRole(profile.role);
        } else {
          console.error('No profile returned after sign in');
          setError('Failed to load user profile after sign in');
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserRole(null);
      }
    });

    return () => {
      mounted = false;
      if (authListener?.data.subscription) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, [toast]);

  // Check if user has required role
  const hasRequiredRole = useCallback(() => {
    if (!requiredRole) return true;
    return userRole === requiredRole;
  }, [requiredRole, userRole]);

  return {
    user,
    userRole,
    session,
    isLoading,
    error,
    hasRequiredRole,
    handleSignOut,
    isAdmin: userRole === 'admin',
    isSupplier: userRole === 'supplier'
  };
}