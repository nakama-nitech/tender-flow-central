
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const RedirectHandler = () => {
  const navigate = useNavigate();
  const { isLoading, error, user, userRole } = useAuth();

  useEffect(() => {
    console.log("Auth state in redirect:", { isLoading, error, user, userRole });
    
    if (!isLoading) {
      if (user) {
        if (userRole === 'admin') {
          console.log('Redirecting to admin dashboard');
          navigate('/admin');
        } else if (userRole === 'supplier') {
          console.log('Redirecting to supplier dashboard');
          navigate('/supplier/dashboard');
        } else {
          // Edge case: user exists but no role assigned yet
          console.log('User exists but no role, waiting for profile load');
          // We'll wait for the profile to load in this case
        }
      } else if (!user && !error) {
        // No authenticated user, redirect to auth
        console.log("No authenticated user, redirecting to login");
        navigate('/auth');
      }
    }
  }, [isLoading, user, userRole, navigate, error]);

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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show a loading state while we figure out where to redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-lg text-gray-700">Preparing your dashboard...</p>
      </div>
    </div>
  );
};
