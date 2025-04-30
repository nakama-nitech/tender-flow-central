import React, { createContext, useContext, useEffect, useState } from 'react';
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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          const newProfile: ProfileInsert = {
            id: userId,
            role: 'supplier',
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
    } catch (err) {
      console.error("Error in fetchUserProfile:", err);
      return null;
    }
  };

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

          const profile = await fetchUserProfile(currentSession.user.id);
          if (profile) {
            setUserRole(profile.role);
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

    authListener = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      setSession(newSession);

      if (event === 'SIGNED_IN' && newSession?.user) {
        setUser(newSession.user);
        const profile = await fetchUserProfile(newSession.user.id);
        if (profile) {
          setUserRole(profile.role);
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