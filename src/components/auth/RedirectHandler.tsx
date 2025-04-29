
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, user, userRole } = useAuth();
  const { toast } = useToast();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState<number | null>(null);

  // Create a memoized redirect function to prevent unnecessary rerenders
  const redirectUser = useCallback(() => {
    // Prevent redirect loops by tracking if we've already redirected
    if (!isLoading && !hasRedirected && user) {
      // Log redirection attempt for debugging
      console.log("RedirectHandler: Redirecting authenticated user with role:", userRole);
      
      // Clear any existing timers
      if (redirectTimer !== null) {
        window.clearTimeout(redirectTimer);
      }
      
      // Use a slight delay before redirecting to ensure all auth states are settled
      const timer = window.setTimeout(() => {
        setHasRedirected(true);
        
        if (userRole === 'admin') {
          navigate('/admin', { replace: true });
          toast({
            title: "Welcome back, Admin",
            description: "You have been redirected to the admin dashboard",
          });
        } else if (userRole === 'supplier') {
          // Always redirect supplier to the supplier dashboard
          console.log("Redirecting supplier to dashboard");
          navigate('/supplier/dashboard', { replace: true });
          toast({
            title: "Welcome back, Supplier",
            description: "You have been redirected to the supplier dashboard",
          });
        } else {
          // If role is not recognized, default to supplier dashboard
          console.warn("Unknown user role:", userRole, "defaulting to supplier dashboard");
          navigate('/supplier/dashboard', { replace: true });
          toast({
            title: "Welcome",
            description: "You have been logged in successfully",
          });
        }
      }, 100);
      
      setRedirectTimer(timer);
      
      // Cleanup function
      return () => {
        if (timer) window.clearTimeout(timer);
      };
    } else if (!isLoading && !user && !error && location.pathname === '/redirect' && !hasRedirected) {
      // Only redirect to auth if we're on the redirect page and have no user
      console.log("RedirectHandler: No user found, redirecting to auth page");
      setHasRedirected(true);
      navigate('/auth', { replace: true });
    }
  }, [isLoading, user, userRole, navigate, error, toast, location.pathname, hasRedirected, redirectTimer]);

  useEffect(() => {
    redirectUser();
    
    // Cleanup function
    return () => {
      if (redirectTimer !== null) {
        window.clearTimeout(redirectTimer);
      }
    };
  }, [redirectUser, redirectTimer]);

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
      <p className="text-lg text-gray-700 animate-pulse">Redirecting you to your dashboard...</p>
    </div>
  );
};
