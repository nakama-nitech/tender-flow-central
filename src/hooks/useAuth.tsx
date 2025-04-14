
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useAuth = (requiredRole?: 'admin' | 'supplier') => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
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
            description: "Please log in to access this area",
            variant: "destructive",
          });
          return;
        }
        
        console.log("User authenticated, checking profile...");
        
        // Check if profile exists by using direct GET
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
            user_role: 'supplier', // Default role is supplier
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
            description: "Your profile has been set up successfully",
          });
          
          setUserRole('supplier'); // Default role
        } else {
          console.log("Profile exists:", profileData);
          setUserRole(profileData.role);
          
          // Check if the user has the required role to access this area
          if (requiredRole && profileData.role !== requiredRole) {
            console.error("User does not have the required role");
            setError(`You need ${requiredRole} permissions to access this area.`);
            setIsLoading(false);
            return;
          }
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
  }, [navigate, toast, retryCount, requiredRole]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setError(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const checkRole = (role: string) => userRole === role;

  return { isLoading, error, userRole, handleRetry, handleSignOut, checkRole };
};
