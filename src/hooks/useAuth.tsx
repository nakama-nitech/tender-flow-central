import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

const ADMIN_EMAILS = ['jeffmnjogu@gmail.com', 'astropeter42@yahoo.com'];

export function useAuth(requiredRole?: UserRole) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

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
        if (fetchError.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const newProfile = {
            id: userId,
            role: 'supplier' as UserRole,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const { data, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();

          if (createError) throw createError;
          return data;
        }
        throw fetchError;
      }

      return profile;
    } catch (err: any) {
      console.error("Error in fetchUserProfile:", err);
      return null;
    }
  };

  // Determine user role based on multiple factors
  const determineUserRole = async (user: any, profile: any): Promise<UserRole> => {
    // Check if user is in admin emails list
    if (user?.email && ADMIN_EMAILS.includes(user.email)) {
      // Update profile to admin if not already
      if (profile?.role !== 'admin') {
        await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', user.id);
      }
      return 'admin';
    }

    // Return role from profile if exists
    if (profile?.role) {
      return profile.role;
    }

    // Default to supplier
    return 'supplier';
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
            // Determine user role
            const role = await determineUserRole(currentSession.user, profile);
            console.log('Setting user role:', role);
            setUserRole(role);
          } else {
            console.error('No profile returned for user');
            setError('Failed to load user profile. Please try logging in again.');
          }
        }
      } catch (err: any) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          const errorMessage = err.message || "Failed to initialize authentication";
          console.error('Setting error state:', errorMessage);
          setError(errorMessage);
          toast({
            title: "Authentication Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
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
          const role = await determineUserRole(newSession.user, profile);
          console.log('Setting user role from auth state change:', role);
          setUserRole(role);
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
    isSupplier: userRole === 'supplier',
    isInitialized
  };
}