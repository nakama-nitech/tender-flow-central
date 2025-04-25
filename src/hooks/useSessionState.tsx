import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Add options parameter with default value
export const useSessionState = (options = { checkOnLoad: true }) => {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRetry = () => {
    setError(null);
    setAuthLoading(true);
    checkSession();
  };

  const handleSignOut = async () => {
    try {
      setAuthLoading(true);
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error("Sign out error:", signOutError);
        toast({
          title: "Sign out failed",
          description: signOutError.message,
          variant: "destructive",
        });
        return;
      }
      
      setUser(null);
      setSession(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out"
      });
    } catch (e: any) {
      console.error("Sign out exception:", e);
      toast({
        title: "Sign out failed",
        description: e.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        setError("Authentication session error. Please log in again.");
        return;
      }
      
      if (!sessionData.session) {
        console.log("No active session");
        return;
      }
      
      console.log("Active session found");
      setSession(sessionData.session);
      setUser(sessionData.session.user);
    } catch (e) {
      console.error("Auth check error:", e);
      setError("Authentication error. Please try logging in again.");
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    console.log("Session state hook initializing...");
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setSession(null);
          setUser(null);
        } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && newSession) {
          console.log("User signed in or token refreshed");
          setSession(newSession);
          setUser(newSession.user);
        }
        setAuthLoading(false);
      }
    );
    
    // Only check session if options.checkOnLoad is true
    if (options.checkOnLoad) {
      // Add delay before checking auth to ensure session is fully established
      const timer = setTimeout(() => {
        checkSession();
      }, 300);
      
      return () => {
        clearTimeout(timer);
        subscription.unsubscribe();
      };
    } else {
      // Skip automatic session check (useful for login/signup pages)
      setAuthLoading(false);
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [options.checkOnLoad]);

  return {
    isLoading: authLoading,
    error,
    user,
    session,
    setError,
    handleRetry,
    handleSignOut
  };
};