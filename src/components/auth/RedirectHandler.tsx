
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const RedirectHandler = () => {
  const navigate = useNavigate();
  const { user, userRole, isAdmin, isLoading, handleSignOut } = useAuth();
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading your profile...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    
    try {
      // If no user is logged in, redirect to auth page
      if (!user) {
        console.log("No user found, redirecting to auth page");
        navigate('/auth', { replace: true });
        return;
      }
      
      // Check for admin users
      if (isAdmin) {
        console.log("Admin user detected, redirecting to admin dashboard");
        navigate('/admin', { replace: true });
        return;
      }
      
      // Regular suppliers go to the supplier dashboard
      if (userRole === 'supplier') {
        console.log("Supplier user detected, redirecting to supplier dashboard");
        navigate('/supplier/dashboard', { replace: true });
        return;
      }
      
      // If user has no role, show role selector for 3 seconds
      setShowRoleSelector(true);
      setLoadingText('Determining your access level...');
      
      // After a delay, just redirect to supplier dashboard as default
      const timeout = setTimeout(() => {
        navigate('/supplier/dashboard', { replace: true });
      }, 3000);
      
      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("Error in redirect handler:", error);
      setError("There was a problem determining where to take you. Please try logging in again.");
    }
  }, [isLoading, user, userRole, isAdmin, navigate]);
  
  const goToAdmin = () => {
    navigate('/admin', { replace: true });
  };
  
  const goToSupplier = () => {
    navigate('/supplier/dashboard', { replace: true });
  };
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md border-red-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-600">Something went wrong</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => {
              handleSignOut();
              navigate('/auth');
            }}>
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isLoading || !showRoleSelector) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-primary font-medium">{loadingText}</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md border-none shadow-xl backdrop-blur-sm bg-white/95">
        <CardHeader>
          <CardTitle>Welcome to SupplierPro</CardTitle>
          <CardDescription>Please select which interface you'd like to use:</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {isAdmin && (
            <Button 
              onClick={goToAdmin} 
              className="flex items-center justify-center gap-2 h-20 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600"
            >
              <Shield className="h-6 w-6" />
              <div className="text-left">
                <div className="font-medium">Administrator Dashboard</div>
                <div className="text-sm opacity-90">Manage tenders and suppliers</div>
              </div>
            </Button>
          )}
          
          <Button 
            onClick={goToSupplier} 
            className="flex items-center justify-center gap-2 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Store className="h-6 w-6" />
            <div className="text-left">
              <div className="font-medium">Supplier Dashboard</div>
              <div className="text-sm opacity-90">Discover and bid on tenders</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
