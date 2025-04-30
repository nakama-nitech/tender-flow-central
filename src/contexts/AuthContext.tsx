
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type UserRole = Database['public']['Enums']['user_role'];

interface AuthContextType {
  user: any;
  userRole: UserRole | null;
  session: any;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  isSupplier: boolean;
  handleSignOut: () => Promise<void>;
  hasRequiredRole: (role?: UserRole) => boolean;
  handleRetry: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      console.log("Fetching profile for user", userId);
      
      // First try to get the user role directly
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_profile_role', { user_id: userId });
      
      if (roleError) {
        console.error("Error fetching user role:", roleError);
        throw roleError;
      }
      
      if (roleData) {
        console.log("User role fetched successfully:", roleData);
        setUserRole(roleData as UserRole);
        return true;
      }
      
      // If no role found, fallback to creating a default profile
      const newProfile: ProfileInsert = {
        id: userId,
        role: 'supplier',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Use RPC function to safely create profile
      const { error: createError } = await supabase
        .rpc('upsert_profile', {
          user_id: userId,
          user_role: 'supplier',
          first_name: '',
          last_name: ''
        });

      if (createError) {
        console.error("Error creating profile:", createError);
        throw createError;
      }
      
      setUserRole('supplier');
      return true;
    } catch (err: any) {
      console.error("Error in fetchUserProfile:", err);
      if (loadAttempts < 3) {
        setLoadAttempts(prev => prev + 1);
      } else {
        setError("Failed to load your profile. Please try again.");
        toast({
          title: "Profile Error",
          description: "Failed to load your profile. Please try again.",
          variant: "destructive",
        });
      }
      return false;
    }
  }, [toast, loadAttempts]);

  const handleRetry = useCallback(async () => {
    if (!user?.id) return;
    
    setError(null);
    setIsLoading(true);
    
    try {
      const success = await fetchUserProfile(user.id);
      if (!success) {
        throw new Error("Failed to load profile");
      }
    } catch (error: any) {
      setError("Failed to load profile after retry");
      toast({
        title: "Retry Failed",
        description: "Please sign out and sign in again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, fetchUserProfile, toast]);

  const handleSignOut = async () => {
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
  };

  useEffect(() => {
    let mounted = true;
    let authListener: { data: { subscription: { unsubscribe: () => void } } } | null = null;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);

          // Process user profile outside the auth state change callback
          try {
            await fetchUserProfile(currentSession.user.id);
          } catch (profileError) {
            console.error("Profile loading error:", profileError);
            // Handle profile loading error but don't break auth
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
        }
      }
    };

    initializeAuth();

    // Set up auth listener FIRST before doing any operations
    authListener = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;

      console.log("Auth state changed:", event);
      setSession(newSession);

      if (event === 'SIGNED_IN' && newSession?.user) {
        setUser(newSession.user);
        
        // Use setTimeout to avoid any potential deadlock with the auth listener
        setTimeout(() => {
          if (mounted) {
            fetchUserProfile(newSession.user.id);
          }
        }, 0);
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
  }, [toast, fetchUserProfile]);

  const hasRequiredRole = (role?: UserRole) => {
    if (!role) return true;
    return userRole === role;
  };

  const value = {
    user,
    userRole,
    session,
    isLoading,
    error,
    isAdmin: userRole === 'admin',
    isSupplier: userRole === 'supplier',
    handleSignOut,
    hasRequiredRole,
    handleRetry,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (requiredRole?: UserRole) => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { hasRequiredRole, ...rest } = context;
  return {
    ...rest,
    hasRequiredRole: () => hasRequiredRole(requiredRole),
  };
};
