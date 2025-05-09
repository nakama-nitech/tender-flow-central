
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, description }) => {
  const { isAdmin, userRole, setUserRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = (checked: boolean) => {
    if (checked) {
      setUserRole('admin');
      navigate('/admin');
    } else {
      setUserRole('supplier');
      navigate('/supplier/dashboard');
    }
  };

  const handleAdminRedirect = () => {
    setUserRole('admin');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {isAdmin && (
          <div className="flex items-center justify-end space-x-2 bg-white p-4 rounded-lg shadow-sm mb-4">
            <Label htmlFor="role-switch" className="text-sm font-medium text-gray-700">
              {userRole === 'admin' ? 'Admin View' : 'Supplier View'}
            </Label>
            <Switch
              id="role-switch"
              checked={userRole === 'admin'}
              onCheckedChange={handleRoleSwitch}
            />
          </div>
        )}
        <Card className="w-full">
          <CardHeader className="space-y-1 px-6 py-4">
            <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
            <CardDescription className="text-center">{description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </Card>
        {isAdmin && userRole !== 'admin' && (
          <div className="mt-4 flex justify-center">
            <Button 
              variant="secondary" 
              className="flex items-center gap-2 bg-amber-600 text-white hover:bg-amber-700"
              onClick={handleAdminRedirect}
            >
              <Shield className="h-4 w-4" />
              <span>Switch to Admin Dashboard</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
