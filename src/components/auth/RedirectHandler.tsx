
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

export const RedirectHandler = () => {
  const navigate = useNavigate();
  const { isLoading, error, user, userRole } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // If user is authenticated, redirect based on role
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'supplier') {
          // Ensure supplier is redirected to the supplier dashboard
          navigate('/supplier/dashboard');
        }
      } else if (!user && !error) {
        // If no user and no error, redirect to auth page
        navigate('/auth');
      }
    }
  }, [isLoading, user, userRole, navigate, error]);

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
