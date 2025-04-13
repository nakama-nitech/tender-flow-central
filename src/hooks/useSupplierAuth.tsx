
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useSupplierAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        setError(null);
        
        // First, check if user is authenticated
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          navigate('/auth');
          toast({
            title: "Authentication error",
            description: error.message || "Please log in to continue",
            variant: "destructive",
          });
          return;
        }
        
        if (!data.session) {
          console.log("No active session found");
          navigate('/auth');
          toast({
            title: "Authentication required",
            description: "Please log in to access the supplier dashboard",
            variant: "destructive",
          });
          return;
        }
        
        console.log("User authenticated, checking profile...");
        
        // Check if profile exists by using direct GET instead of creating
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, role, first_name, last_name')
          .eq('id', data.session.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error("Error checking profile:", profileError);
          setError("Failed to load your profile. Please try again.");
          setIsLoading(false);
          return;
        }
        
        if (!profileData) {
          console.log("Profile not found, creating one...");
          
          // Handle profile creation via RPC function to avoid RLS issues
          const { error: upsertError } = await supabase.rpc('upsert_profile', {
            user_id: data.session.user.id,
            user_role: 'supplier',
            first_name: data.session.user.user_metadata?.first_name || '',
            last_name: data.session.user.user_metadata?.last_name || ''
          });
          
          if (upsertError) {
            console.error("Profile creation error:", upsertError);
            setError("Failed to create your profile. Please try again or contact support.");
            setIsLoading(false);
            return;
          }
          
          toast({
            title: "Profile created",
            description: "Your supplier profile has been set up successfully",
          });
        } else {
          console.log("Profile exists:", profileData);
        }
        
        setIsLoading(false);
        
      } catch (error) {
        console.error("Auth check error:", error);
        setError("Authentication error. Please try logging in again.");
        setIsLoading(false);
      }
    };
    
    // Add delay before checking auth to ensure session is fully established
    const timer = setTimeout(() => {
      checkAuth();
    }, 500);
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
        } else if (event === 'SIGNED_IN') {
          console.log("User signed in, checking profile...");
          setIsLoading(true);
          setRetryCount(0);
          // Wait a moment for auth to complete, then check profile
          setTimeout(() => {
            checkAuth();
          }, 1000);
        }
      }
    );
    
    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [navigate, toast, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setError(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return { isLoading, error, handleRetry, handleSignOut };
};
