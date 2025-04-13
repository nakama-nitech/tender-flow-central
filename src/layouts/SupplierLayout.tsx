
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SupplierSidebar from '@/components/SupplierSidebar';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupplierAuth } from '@/hooks/useSupplierAuth';

const SupplierLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const location = useLocation();
  const { isLoading, error, handleRetry, handleSignOut } = useSupplierAuth();

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
