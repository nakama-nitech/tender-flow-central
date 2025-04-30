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

  useEffect(() => {
    if (isRedirecting || isLoading) return;

    if (error) {
      toast({
        title: "Authentication Error",
        description: error,
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!user) {
      navigate('/auth');
      return;
    }

    setIsRedirecting(true);

    // Determine the appropriate dashboard based on role
    if (isAdmin) {
      navigate('/admin', { replace: true });
      toast({
        title: "Welcome back, Admin",
        description: "You have been redirected to the admin dashboard",
      });
    } else if (isSupplier) {
      navigate('/supplier/dashboard', { replace: true });
      toast({
        title: "Welcome back",
        description: "You have been redirected to your dashboard",
      });
    } else {
      // Default to supplier dashboard if role is not set
      navigate('/supplier/dashboard', { replace: true });
      toast({
        title: "Welcome",
        description: "You have been redirected to your dashboard",
      });
    }
  }, [isLoading, error, user, isAdmin, isSupplier, navigate, toast, isRedirecting]);

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