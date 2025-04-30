import { useEffect, useState } from 'react';
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
  const [retryCount, setRetryCount] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Main redirection effect
  useEffect(() => {
    // Guard against running this effect while already redirecting
    if (isRedirecting) return;

    // Only try to redirect when we have enough information
    if (!isLoading) {
      // Debug logs
      console.log("RedirectHandler: Auth state -", { 
        user: !!user, 
        userRole, 
        isLoading, 
        retryCount 
      });

      // Handle the authenticated user case
      if (user) {
        // If we have a user but no role and haven't retried too many times, wait
        if (!userRole && retryCount < 5) {
          console.log(`Role not yet available, retry attempt ${retryCount + 1}...`);
          
          // Set a timer to retry with exponential backoff
          const retryTimer = setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, Math.min(500 * Math.pow(1.5, retryCount), 3000));
          
          return () => clearTimeout(retryTimer);
        }
        
        // We have a user, proceed with redirection based on role
        console.log("Redirecting authenticated user with role:", userRole);
        setIsRedirecting(true);
        
        if (userRole === 'admin') {
          navigate('/admin', { replace: true });
          toast({
            title: "Welcome back, Admin",
            description: "You have been redirected to the admin dashboard",
          });
        } else if (userRole === 'supplier') {
          navigate('/supplier/dashboard', { replace: true });
          toast({
            title: "Welcome back, Supplier",
            description: "You have been redirected to the supplier dashboard",
          });
        } else {
          // Default case - we have a user but role is still unknown or not supported
          console.warn("Unknown/missing user role:", userRole, "defaulting to supplier dashboard");
          navigate('/supplier/dashboard', { replace: true });
          toast({
            title: "Welcome",
            description: "You have been logged in successfully",
          });
        }
      } else {
        // No authenticated user found, redirect to auth page
        console.log("No authenticated user, redirecting to login");
        setIsRedirecting(true);
        navigate('/auth', { replace: true });
      }
    }
  }, [isLoading, user, userRole, navigate, toast, retryCount, isRedirecting]);

  // Display loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-gray-700 animate-pulse">Preparing your dashboard...</p>
      </div>
    );
  }

  // Display error state if there's an authentication error
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

  // Default loading view while we redirect
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-gray-700 animate-pulse">
        {retryCount > 0 ? `Finalizing your profile... (attempt ${retryCount})` : "Redirecting to your dashboard..."}
      </p>
    </div>
  );
};