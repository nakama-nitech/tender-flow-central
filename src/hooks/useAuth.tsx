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
  const [loadAttempts, setLoadAttempts] = useState(0);

  // Get role directly from user metadata if available
  const getRoleFromUserMetadata = (user: any): UserRole | null => {
    if (user?.email && ADMIN_EMAILS.includes(user.email)) {
      return 'admin';
    }
    
    // Check user_metadata first
    const metadataRole = user?.user_metadata?.role;
    if (metadataRole) {
      return metadataRole as UserRole;
    }
    
    return null; // Return null instead of default role to trigger proper handling
  };

  // Fetch user profile with fallback to user metadata
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      console.log('Attempting to get role using RPC function');
      
      // Try to get role using the RPC function as it's more reliable
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_profile_role', { user_id: userId });
      
      if (roleError) {
        console.warn("RPC function error:", roleError);
        throw roleError;
      }
      
      if (roleData) {
        console.log("Role obtained from RPC:", roleData);
        return {
          id: userId,
          role: roleData as UserRole,
        };
      }
      
      throw new Error("Role not found via RPC");
    } catch (err) {
      console.warn("Error fetching profile with RPC:", err);
      
      // Fallback to user metadata
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const role = getRoleFromUserMetadata(userData.user);
        console.log("Using role from metadata:", role);
        
        // If no role from metadata, default to supplier
        const finalRole = role || 'supplier';
        
        // Try to create profile if it doesn't exist
        try {
          await supabase.rpc('upsert_profile', {
            user_id: userId,
            user_role: finalRole,
            first_name: userData.user.user_metadata?.first_name || '',
            last_name: userData.user.user_metadata?.last_name || ''
          });
          console.log("Profile created/updated via RPC");
        } catch (createErr) {
          console.error("Error creating profile via RPC:", createErr);
          if (loadAttempts < 2) {
            setLoadAttempts(prev => prev + 1);
          }
        }
        
        return {
          id: userId,
          role: finalRole as UserRole,
        };
      }
      
      // Last resort fallback
      return {
        id: userId,
        role: 'supplier' as UserRole,
      };
    }
  }, [loadAttempts]);

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

        // Set up auth listener FIRST (to avoid race conditions)
        authListener = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mounted) return;

          console.log('Auth state changed:', event, !!newSession);
          setSession(newSession);

          if (event === 'SIGNED_IN' && newSession?.user) {
            setUser(newSession.user);
            
            // First try to get role from user metadata for immediate UI response
            const initialRole = getRoleFromUserMetadata(newSession.user);
            if (initialRole) {
              setUserRole(initialRole);
            }
            
            // Then try to fetch or create profile in background
            setTimeout(async () => {
              try {
                if (mounted) {
                  const profile = await fetchUserProfile(newSession.user.id);
                  if (profile && profile.role && mounted) {
                    console.log('Setting user role from auth state change:', profile.role);
                    setUserRole(profile.role);
                  }
                }
              } catch (profileErr) {
                console.error('Error loading profile after sign in:', profileErr);
                // Keep using role from metadata
              }
            }, 0);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setUserRole(null);
          }
        });

        // Get current session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        console.log('Current session:', !!currentSession);

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);

          try {
            // First try to get role from user metadata for immediate UI response
            const initialRole = getRoleFromUserMetadata(currentSession.user);
            if (initialRole) {
              setUserRole(initialRole);
            }
            
            // Then try to fetch or create profile
            const profile = await fetchUserProfile(currentSession.user.id);
            if (profile && profile.role && mounted) {
              console.log("Setting final user role:", profile.role);
              setUserRole(profile.role);
            }
          } catch (profileErr: any) {
            console.error('Profile loading error:', profileErr);
            // If we failed to load the profile, but we have a role from metadata, we can still function
            if (!userRole) {
              const fallbackRole = getRoleFromUserMetadata(currentSession.user) || 'supplier';
              setUserRole(fallbackRole);
              
              if (!fallbackRole) {
                setError('Failed to determine your role. Please try logging in again.');
              }
            }
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

    return () => {
      mounted = false;
      if (authListener?.data.subscription) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, [toast, fetchUserProfile, userRole]);

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
    isInitialized,
    loadAttempts
  };
}
