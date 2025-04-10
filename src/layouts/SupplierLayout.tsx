
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SupplierSidebar from '@/components/SupplierSidebar';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        navigate('/auth');
        toast({
          title: "Authentication required",
          description: "Please log in to access the supplier dashboard",
          variant: "destructive",
        });
        return;
      }
      
      // Check if user is a supplier
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single();
        
      if (profileError || (profileData && profileData.role !== 'supplier')) {
        navigate('/auth');
        toast({
          title: "Access denied",
          description: "You do not have permission to access the supplier dashboard",
          variant: "destructive",
        });
        return;
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
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
        <div className="w-full mx-auto max-w-7xl bg-background rounded-lg shadow-sm border border-border p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SupplierLayout;
