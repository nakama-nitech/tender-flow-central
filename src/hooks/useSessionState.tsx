import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface UseSessionStateProps {
  checkOnLoad?: boolean;
}

export const useSessionState = ({ checkOnLoad = true }: UseSessionStateProps = {}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Setup auth listener
  useEffect(() => {
    // Avoid checking session if not required immediately
    if (!checkOnLoad) {
      setIsLoading(false);
      return;
    }
    
    let mounted = true;
    
    const checkSession = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Checking session...");
        
        // Get current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (mounted) {
          if (data?.session) {
            console.log("Session found:", data.session);
            setSession(data.session);
            setUser(data.session.user);
          } else {
            console.log("No active session found");
            setSession(null);
            setUser(null);
          }
        }
      } catch (err: any) {
        console.error("Error checking session:", err);
        if (mounted) {
          setError(err.message || "Failed to check authentication status");
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Initial check
    checkSession();
    
    // Setup auth changes listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state changed:", event);
      
      if (mounted) {
        if (newSession) {
          console.log("New session established");
          setSession(newSession);
          setUser(newSession.user);
        } else {
          console.log("Session ended");
          setSession(null);
          setUser(null);
        }
        
        // Don't set loading to false on auth change events
        // This prevents flickering when auth state changes rapidly
      }
    });
    
    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [checkOnLoad]);

  return {
    isLoading,
    error,
    session,
    user
  };
};