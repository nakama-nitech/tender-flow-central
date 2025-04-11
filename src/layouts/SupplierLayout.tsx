
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SupplierSidebar from '@/components/SupplierSidebar';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

const SupplierLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
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
        
        // Check if user is a supplier
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          
          // Check if it's a not found error
          if (profileError.code === 'PGRST116') {
            console.log("Profile not found, attempting to create one...");
            
            // Try to create a profile for the user
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: data.session.user.id,
                  role: 'supplier',
                  first_name: data.session.user.user_metadata.first_name || '',
                  last_name: data.session.user.user_metadata.last_name || ''
                }
              ]);
              
            if (insertError) {
              console.error("Error creating profile:", insertError);
              navigate('/auth');
              toast({
                title: "Profile creation failed",
                description: "There was an error setting up your profile. Please try again.",
                variant: "destructive",
              });
              return;
            }
            
            // Profile created successfully
            setIsLoading(false);
            return;
          }
          
          // For other errors, redirect to auth
          navigate('/auth');
          toast({
            title: "Profile error",
            description: "There was an error loading your profile. Please try logging in again.",
            variant: "destructive",
          });
          return;
        }
        
        console.log("Profile fetched:", profileData);
        
        if (!profileData) {
          console.log("Profile not found");
          navigate('/auth');
          toast({
            title: "Profile not found",
            description: "Your user profile could not be found. Please contact support.",
            variant: "destructive",
          });
          return;
        }
        
        if (profileData.role !== 'supplier') {
          console.log("User is not a supplier:", profileData.role);
          navigate('/auth');
          toast({
            title: "Access denied",
            description: "You do not have permission to access the supplier dashboard",
            variant: "destructive",
          });
          return;
        }
        
        // All checks passed
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        navigate('/auth');
        toast({
          title: "Authentication error",
          description: "An unexpected error occurred. Please try logging in again.",
          variant: "destructive",
        });
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Reload the page to ensure fresh profile data
          checkAuth();
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
