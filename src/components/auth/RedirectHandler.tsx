
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, user, userRole, session } = useAuth();
  const { toast } = useToast();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState<number | null>(null);

  // Create a memoized redirect function to prevent unnecessary rerenders
  const redirectUser = useCallback(() => {
    // Only attempt redirection if we have all the information needed and haven't already redirected
    if (!isLoading && !hasRedirected) {
      console.log("RedirectHandler: Redirection check - User:", !!user, "Role:", userRole);
      
      // Clear any existing timers
      if (redirectTimer !== null) {
        window.clearTimeout(redirectTimer);
      }

      if (user) {
        // We have a user, redirect based on role
        console.log("RedirectHandler: Redirecting authenticated user with role:", userRole);
        
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
          } else if (user && !userRole) {
            // If we have a user but no role yet, wait a moment longer
            console.log("User found but role not yet determined, waiting...");
            setHasRedirected(false); // Reset to allow another attempt
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
      } else if (!isLoading && !user && !error && location.pathname === '/redirect' && !hasRedirected) {
        // No user found, redirect to auth
        console.log("RedirectHandler: No user found, redirecting to auth page");
        setHasRedirected(true);
        navigate('/auth', { replace: true });
      }
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

  // Add a second effect for role-specific handling
  useEffect(() => {
    // If we have a user but the role is not set yet, wait and then try again
    if (!isLoading && user && !userRole && !hasRedirected) {
      console.log("User found but role not determined yet, setting timeout");
      const roleCheckTimer = window.setTimeout(() => {
        console.log("Checking role again");
        setHasRedirected(false); // Reset so redirectUser can try again
      }, 500);
      
      return () => window.clearTimeout(roleCheckTimer);
    }
  }, [isLoading, user, userRole, hasRedirected]);

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
