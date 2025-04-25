import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import SupplierSidebar from '@/components/SupplierSidebar';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupplierAuth } from '@/hooks/useSupplierAuth';

const SupplierLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const { isLoading, error, userRole, handleRetry, handleSignOut } = useSupplierAuth();

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

  // If user is not a supplier, don't render supplier content
  if (userRole && userRole !== 'supplier') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-r from-gray-50 to-slate-100">
      <SupplierSidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        activePage={activePage}
        setActivePage={setActivePage}
      />
      
      <main 
        className={cn(
          "flex-1 p-6 md:p-8 transition-all duration-300 overflow-auto",
          sidebarOpen ? "md:ml-0" : "md:ml-0"
        )}
      >
        <div className="w-full mx-auto max-w-7xl bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-end mb-4">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="gap-2"
            >
              Sign Out
            </Button>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SupplierLayout;
