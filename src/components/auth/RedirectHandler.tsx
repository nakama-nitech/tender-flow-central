
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export const RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    isLoading, 
    error, 
    user, 
    userRole, 
    isAdmin, 
    isSupplier, 
    isInitialized,
    handleSignOut 
  } = useAuth();
  const { toast } = useToast();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasRetried, setHasRetried] = useState(false);
  const redirectAttempted = useRef(false);

  const handleRetry = () => {
    setHasRetried(true);
    toast({
      title: "Retrying...",
      description: "Attempting to load your profile again",
    });
    
    // Force page refresh to restart the auth flow
    window.location.reload();
  };
  
  const handleSignOutAndRedirect = async () => {
    await handleSignOut();
    navigate('/auth', { replace: true });
  };

  useEffect(() => {
    // Reset retry flag when component mounts
    setHasRetried(false);
    
    // Don't proceed if we're still loading or already redirecting
    if (isRedirecting || isLoading || !isInitialized || redirectAttempted.current) {
      return;
    }

    // If we have a user but no role, try to get it from user metadata
    if (user && !userRole && !isLoading && !error) {
      const metadata = user?.user_metadata || {};
      if (metadata.role === 'admin') {
        navigate('/admin', { replace: true });
        toast({
          title: "Welcome back, Admin",
          description: "Using role from your account metadata",
        });
        return;
      } else if (metadata.role === 'supplier') {
        navigate('/supplier/dashboard', { replace: true });
        toast({
          title: "Welcome back",
          description: "Using role from your account metadata",
        });
        return;
      }
    }

    // Handle errors
    if (error) {
      console.error('Auth error:', error);
      return; // Don't redirect, show error UI with retry button
    }

    // If no user, redirect to auth
    if (!user) {
      console.log('No user found, redirecting to auth page');
      navigate('/auth', { replace: true });
      return;
    }

    // If we have a user but no role, show error
    if (!userRole) {
      console.log('User has no role, showing error');
      return; // Don't redirect, show error UI with retry button
    }

    // Mark that we've attempted a redirect
    redirectAttempted.current = true;
    setIsRedirecting(true);

    // Determine the appropriate dashboard based on role
    let targetPath = '/supplier/dashboard';
    
    if (isAdmin) {
      console.log('User is admin, redirecting to admin dashboard');
      targetPath = '/admin';
    } else if (isSupplier) {
      console.log('User is supplier, redirecting to supplier dashboard');
      targetPath = '/supplier/dashboard';
    }
    
    // Only redirect if we're not already on the target path
    if (location.pathname !== targetPath) {
      console.log(`Redirecting to ${targetPath}`);
      navigate(targetPath, { replace: true });
      toast({
        title: isAdmin ? "Welcome back, Admin" : "Welcome back",
        description: isAdmin 
          ? "You have been redirected to the admin dashboard"
          : "You have been redirected to your dashboard",
      });
    }
  }, [isLoading, error, user, userRole, isAdmin, isSupplier, navigate, toast, isRedirecting, isInitialized, location.pathname, hasRetried]);

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-gray-700 animate-pulse">Preparing your dashboard...</p>
      </div>
    );
  }

  if (error || (user && !userRole && !isLoading)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Alert variant="destructive" className="max-w-md mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="mt-2">
            {error || "Failed to load user profile. Please try logging in again."}
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button 
            onClick={handleRetry} 
            variant="outline" 
            className="gap-2"
            disabled={hasRetried} // Prevent multiple retries in quick succession
          >
            <RefreshCcw className="h-4 w-4" />
            {hasRetried ? "Retrying..." : "Retry"}
          </Button>
          
          <Button 
            onClick={handleSignOutAndRedirect} 
            variant="default" 
            className="gap-2"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-gray-700 animate-pulse">Redirecting you to your dashboard...</p>
    </div>
  );
};
