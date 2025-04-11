
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SupplierSidebar from '@/components/SupplierSidebar';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Profile = Database['public']['Tables']['profiles']['Row'];

const SupplierLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set active page based on current path
    const path = location.pathname;
    if (path.includes('dashboard')) setActivePage('dashboard');
    else if (path.includes('tenders')) setActivePage('tenders');
    else if (path.includes('my-bids')) setActivePage('my-bids');
    else if (path.includes('bid-status')) setActivePage('bid-status');
    else if (path.includes('notifications')) setActivePage('notifications');
    else if (path.includes('settings')) setActivePage('settings');
  }, [location]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2">{error}</AlertDescription>
          </Alert>
          <div className="flex justify-between mt-4">
            <Button 
              onClick={handleSignOut}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Back to login
            </Button>
            <Button 
              onClick={handleRetry}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-indigo-100">
      <SupplierSidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activePage={activePage}
        setActivePage={setActivePage}
      />
      
      <main 
        className={cn(
          "flex-1 p-6 md:p-8 transition-all duration-300 overflow-auto",
          sidebarOpen ? "md:ml-0" : "md:ml-0"
        )}
      >
        <div className="w-full mx-auto max-w-7xl bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-white/50 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
  
  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen);
  }
};

export default SupplierLayout;
