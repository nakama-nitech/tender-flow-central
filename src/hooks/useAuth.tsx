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

  const getRoleFromUserMetadata = useCallback((user: any): UserRole | null => {
    if (!user?.user_metadata) return null;
    
    // Check if user is in admin list
    if (ADMIN_EMAILS.includes(user.email)) {
      return 'admin';
    }
    
    // Get role from metadata
    return user.user_metadata.role || 'supplier';
  }, []);

  const ensureUserProfile = useCallback(async (userId: string, email: string): Promise<UserRole> => {
    try {
      // First try to get the user role directly
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_profile_role', { user_id: userId });
      
      if (roleError) {
        console.error("Error fetching user role:", roleError);
        throw roleError;
      }
      
      if (roleData) {
        return roleData as UserRole;
      }
      
      // If no role found, create a default profile
      const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'supplier';
      
      const { error: createError } = await supabase
        .rpc('upsert_profile', {
          user_id: userId,
          user_role: role,
          first_name: '',
          last_name: ''
        });

      if (createError) {
        console.error("Error creating profile:", createError);
        throw createError;
      }
      
      return role;
    } catch (err) {
      console.error("Error in ensureUserProfile:", err);
      throw err;
    }
  }, []);

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
        setIsLoading(true);
        setError(null);

        // Get current session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);

          try {
            // First try to get role from user metadata for immediate UI response
            const initialRole = getRoleFromUserMetadata(currentSession.user);
            if (initialRole) {
              setUserRole(initialRole);
            }
            
            // Then ensure profile exists and get final role
            const finalRole = await ensureUserProfile(
              currentSession.user.id,
              currentSession.user.email
            );
            
            if (mounted) {
              setUserRole(finalRole);
            }
          } catch (profileErr: any) {
            console.error('Profile loading error:', profileErr);
            // If we failed to load the profile, but we have a role from metadata, we can still function
            if (!userRole) {
              const fallbackRole = getRoleFromUserMetadata(currentSession.user);
              setUserRole(fallbackRole);
              
              if (!fallbackRole) {
                setError('Failed to determine your role. Please try logging in again.');
              }
            }
          }
        }
      } catch (err: any) {
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
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener
    authListener = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      setSession(newSession);

      if (event === 'SIGNED_IN' && newSession?.user) {
        setUser(newSession.user);
        
        // First set role from metadata for immediate UI update
        const initialRole = getRoleFromUserMetadata(newSession.user);
        if (initialRole) {
          setUserRole(initialRole);
        }
        
        // Then ensure profile exists and get final role
        try {
          const finalRole = await ensureUserProfile(
            newSession.user.id,
            newSession.user.email
          );
          
          if (mounted) {
            setUserRole(finalRole);
          }
        } catch (profileErr) {
          console.error('Error loading profile after sign in:', profileErr);
          // Keep using role from metadata
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
  }, [toast, getRoleFromUserMetadata, ensureUserProfile]);

  // Check if user has required role
  const hasRequiredRole = useCallback(() => {
    if (!requiredRole) return true;
    
    // Special case: admins can access supplier pages
    if (requiredRole === 'supplier' && userRole === 'admin') {
      return true;
    }
    
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
