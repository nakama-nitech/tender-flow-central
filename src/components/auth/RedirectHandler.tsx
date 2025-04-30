import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RedirectHandler = () => {
  const navigate = useNavigate();
  const { isLoading, error, user, userRole, isAdmin, isSupplier } = useAuth();
  const { toast } = useToast();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectAttempts, setRedirectAttempts] = useState(0);

  useEffect(() => {
    console.log('RedirectHandler state:', {
      isLoading,
      error,
      user,
      userRole,
      isAdmin,
      isSupplier,
      redirectAttempts
    });

    // Don't proceed if we're still loading or already redirecting
    if (isRedirecting || isLoading) {
      console.log('Waiting for loading to complete or redirect to finish');
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
      navigate('/auth');
      return;
    }

    // If no user, redirect to auth
    if (!user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth');
      return;
    }

    // If we have a user but no role yet, wait a bit and try again
    if (!userRole && redirectAttempts < 5) {
      console.log(`Waiting for role (attempt ${redirectAttempts + 1}/5)`);
      const timer = setTimeout(() => {
        setRedirectAttempts(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // If we still don't have a role after multiple attempts, show error
    if (!userRole) {
      console.error('Failed to determine role after multiple attempts');
      toast({
        title: "Authentication Error",
        description: "Unable to determine your role. Please try logging in again or contact support if the issue persists.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setIsRedirecting(true);
    console.log('Redirecting based on role:', userRole);

    // Determine the appropriate dashboard based on role
    if (isAdmin) {
      console.log('Redirecting to admin dashboard');
      navigate('/admin', { replace: true });
      toast({
        title: "Welcome back, Admin",
        description: "You have been redirected to the admin dashboard",
      });
    } else if (isSupplier) {
      console.log('Redirecting to supplier dashboard');
      navigate('/supplier/dashboard', { replace: true });
      toast({
        title: "Welcome back",
        description: "You have been redirected to your dashboard",
      });
    } else {
      console.log('No specific role found, defaulting to supplier dashboard');
      navigate('/supplier/dashboard', { replace: true });
      toast({
        title: "Welcome",
        description: "You have been redirected to your dashboard",
      });
    }
  }, [isLoading, error, user, userRole, isAdmin, isSupplier, navigate, toast, isRedirecting, redirectAttempts]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-gray-700 animate-pulse">Preparing your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-gray-700 animate-pulse">Redirecting to your dashboard...</p>
    </div>
  );
};