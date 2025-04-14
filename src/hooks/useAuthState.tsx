
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Auth state hook initializing...");
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
        } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && sessionData) {
          console.log("User signed in or token refreshed");
          setSession(sessionData);
          setUser(sessionData.user);
          setIsLoading(false);
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
          return;
        }
        
        console.log("Active session found");
        setSession(sessionData.session);
        setUser(sessionData.session.user);
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
  }, [retryCount]);

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
  };

  return { 
    isLoading, 
    error, 
    user,
    session,
    setError,
    handleRetry, 
    handleSignOut
  };
};
