
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SupplierSidebar from '@/components/SupplierSidebar';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type Profile = Database['public']['Tables']['profiles']['Row'];

const SupplierLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        console.log("User ID:", data.session.user.id);
        console.log("User metadata:", data.session.user.user_metadata);
        
        // Attempt to create profile if it doesn't exist
        try {
          // First attempt to get the profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
          if (profileError) {
            console.error("Profile fetch error:", profileError);
            
            // If profile not found, create one
            if (profileError.code === 'PGRST116') {
              console.log("Profile not found, creating one...");
              
              // Create profile with explicit role cast
              const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert([
                  { 
                    id: data.session.user.id,
                    role: 'supplier',
                    first_name: data.session.user.user_metadata?.first_name || '',
                    last_name: data.session.user.user_metadata?.last_name || ''
                  }
                ])
                .select()
                .single();
                
              if (insertError) {
                console.error("Profile creation error:", insertError);
                setError("Failed to create your profile. Please try again or contact support.");
                toast({
                  title: "Profile creation failed",
                  description: insertError.message || "There was an error setting up your profile",
                  variant: "destructive",
                });
                setIsLoading(false);
                return;
              }
              
              console.log("Profile created successfully:", newProfile);
              toast({
                title: "Profile created",
                description: "Your supplier profile has been set up successfully",
              });
              setIsLoading(false);
              return;
            }
            
            // For other profile errors
            setError("Error loading your profile. Please try again or contact support.");
            toast({
              title: "Profile error",
              description: profileError.message || "There was an error loading your profile",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
          
          console.log("Profile loaded successfully:", profileData);
          
          if (profileData.role !== 'supplier') {
            console.log("User is not a supplier:", profileData.role);
            setError("You do not have supplier access. Please contact support if you believe this is an error.");
            toast({
              title: "Access denied",
              description: "You do not have permission to access the supplier dashboard",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
          
          // All checks passed
          setIsLoading(false);
          
        } catch (profileCheckError) {
          console.error("Profile check error:", profileCheckError);
          setError("An unexpected error occurred while checking your profile. Please try again.");
          setIsLoading(false);
        }
        
      } catch (error) {
        console.error("Auth check error:", error);
        setError("Authentication error. Please try logging in again.");
        toast({
          title: "Authentication error",
          description: "An unexpected error occurred. Please try logging in again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
        } else if (event === 'SIGNED_IN') {
          console.log("User signed in, checking profile...");
          setIsLoading(true);
          // Wait a moment for auth to complete, then check profile
          setTimeout(() => {
            checkAuth();
          }, 500);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
            <button 
              onClick={() => navigate('/auth')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Back to login
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
            >
              Retry
            </button>
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
};

export default SupplierLayout;
