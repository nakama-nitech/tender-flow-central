import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAuth(requiredRole?: 'admin' | 'supplier') {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Define a function to fetch user role from the profiles table
  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching user role for user:", userId);
      
      // Assuming you have a profiles table with a role field
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user role:", error);
        throw error;
      }
      
      if (data) {
        console.log("User role data:", data);
        return data.role;
      } else {
        console.warn("No role found for user:", userId);
        return null;
      }
    } catch (err) {
      console.error("Error in fetchUserRole:", err);
      return null;
    }
  };

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get the current session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          
          // Fetch the user's role
          const role = await fetchUserRole(currentSession.user.id);
          setUserRole(role);
          console.log("Initial auth state:", { user: !!currentSession.user, role });
        } else {
          setUser(null);
          setUserRole(null);
        }
      } catch (err: any) {
        console.error("Auth initialization error:", err);
        setError(err.message || "Failed to initialize authentication");
        toast({
          title: "Authentication Error",
          description: err.message || "Failed to authenticate user",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();
    
    // Set up the auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event, "Session exists:", !!newSession);
      
      setSession(newSession);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        setUser(newSession.user);
        setIsLoading(true);
        
        try {
          // Fetch the user's role when they sign in
          const role = await fetchUserRole(newSession.user.id);
          setUserRole(role);
          console.log("User signed in, role:", role);
        } catch (err) {
          console.error("Error fetching user role on sign-in:", err);
        } finally {
          setIsLoading(false);
        }
      }
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserRole(null);
        console.log("User signed out");
      }
    });

    return () => {
      // Clean up the auth listener
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [toast]);

  // Function to check if the user has the required role
  const hasRequiredRole = () => {
    if (!requiredRole) return true;
    return userRole === requiredRole;
  };

  // Function to manually refresh the user's role
  const refreshRole = async () => {
    if (user) {
      try {
        setIsLoading(true);
        const role = await fetchUserRole(user.id);
        setUserRole(role);
        return role;
      } catch (err) {
        console.error("Error refreshing user role:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    }
    return null;
  };

  return {
    user,
    userRole,
    session,
    isLoading,
    error,
    hasRequiredRole,
    refreshRole
  };
}