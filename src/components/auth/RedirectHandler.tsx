
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const RedirectHandler = () => {
  const navigate = useNavigate();
  const { isLoading, error, userRole } = useAuth();

  useEffect(() => {
    console.log("Auth state in redirect:", { isLoading, error, userRole });
    
    if (!isLoading) {
      if (userRole) {
        console.log(`Redirecting to ${userRole === 'admin' ? '/admin' : '/supplier/dashboard'}`);
        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/supplier/dashboard');
        }
      } else {
        // Add fallback to prevent being stuck
        console.log("No user role found, redirecting to login");
        navigate('/login');
      }
    }
  }, [isLoading, userRole, navigate, error]);

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

  return null;
};
