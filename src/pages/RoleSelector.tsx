
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Store, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const RoleSelector = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading, error, user, userRole, checkRole } = useAuth();

  useEffect(() => {
    // Check if we have a user session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.log("No active session, redirecting to auth");
        navigate('/auth');
      }
    };
    
    if (!isLoading && !user) {
      console.log("No user found after loading, checking session");
      checkSession();
    }
  }, [isLoading, user, navigate]);

  const selectRole = async (role: 'admin' | 'supplier') => {
    try {
      // If user already has the role, simply navigate
      if (role === userRole) {
        navigate(role === 'admin' ? '/admin' : '/supplier/dashboard');
        return;
      }

      // Only allow selection of roles the user has
      if (role === 'admin' && !checkRole('admin')) {
        toast({
          title: "Access Denied",
          description: "You don't have administrator privileges.",
          variant: "destructive",
        });
        return;
      }

      navigate(role === 'admin' ? '/admin' : '/supplier/dashboard');
    } catch (error) {
      console.error("Role selection error:", error);
      toast({
        title: "Navigation Error",
        description: "Could not access the selected dashboard. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="py-4 px-6 md:px-10 flex justify-between items-center bg-white shadow-sm">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <Card className="border-none shadow-xl backdrop-blur-sm bg-white/95">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Select Your Role</CardTitle>
              <CardDescription>
                Choose which view you would like to access
              </CardDescription>
            </CardHeader>
            
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <Button
                variant="outline"
                className={`h-auto p-6 flex flex-col items-center gap-4 border-2 ${
                  checkRole('admin') ? 'border-primary hover:border-primary hover:bg-primary/5' : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => selectRole('admin')}
                disabled={!checkRole('admin')}
              >
                <Shield className="h-12 w-12 text-primary" />
                <div className="text-center">
                  <h3 className="text-lg font-medium">Administrator</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage tenders, users, and system settings
                  </p>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-6 flex flex-col items-center gap-4 border-2 border-primary hover:border-primary hover:bg-primary/5"
                onClick={() => selectRole('supplier')}
              >
                <Store className="h-12 w-12 text-primary" />
                <div className="text-center">
                  <h3 className="text-lg font-medium">Supplier</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Discover and bid on available tenders
                  </p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
