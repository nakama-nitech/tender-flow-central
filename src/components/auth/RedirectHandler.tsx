import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, user, userRole, isAdmin, isSupplier, isInitialized } = useAuth();
  const { toast } = useToast();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const redirectAttempted = useRef(false);

  useEffect(() => {
    // Don't proceed if we're still loading or already redirecting
    if (isRedirecting || isLoading || !isInitialized || redirectAttempted.current) {
      return;
    }

    // Handle errors
    if (error) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error,
        variant: "destructive",
      });
      navigate('/auth', { replace: true });
      return;
    }

    // If no user, redirect to auth
    if (!user) {
      navigate('/auth', { replace: true });
      return;
    }

    // If we have a user but no role, show error
    if (!userRole) {
      toast({
        title: "Authentication Error",
        description: "Unable to determine your role. Please try logging in again or contact support if the issue persists.",
        variant: "destructive",
      });
      navigate('/auth', { replace: true });
      return;
    }

    // Mark that we've attempted a redirect
    redirectAttempted.current = true;
    setIsRedirecting(true);

    // Determine the appropriate dashboard based on role
    const targetPath = isAdmin ? '/admin' : '/supplier/dashboard';
    
    // Only redirect if we're not already on the target path
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
      toast({
        title: isAdmin ? "Welcome back, Admin" : "Welcome back",
        description: isAdmin 
          ? "You have been redirected to the admin dashboard"
          : "You have been redirected to your dashboard",
      });
    }
  }, [isLoading, error, user, userRole, isAdmin, isSupplier, navigate, toast, isRedirecting, isInitialized, location.pathname]);

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-gray-700 animate-pulse">Preparing your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="mt-2">{error}</AlertDescription>
        </Alert>
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