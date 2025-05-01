
import React from 'react';
import { Shield, Store } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RoleSelectorHeader from '@/components/role-selector/RoleSelectorHeader';
import RoleCard from '@/components/role-selector/RoleCard';
import LoadingState from '@/components/role-selector/LoadingState';
import ErrorState from '@/components/role-selector/ErrorState';
import { useRoleSelector } from '@/hooks/useRoleSelector';

const RoleSelector = () => {
  const { isLoading, updatingRole, error, hasAdminPermission, selectRole } = useRoleSelector();

  if (isLoading || updatingRole) {
    return (
      <LoadingState 
        message={updatingRole ? "Updating your role..." : "Loading your profile..."}
      />
    );
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <RoleSelectorHeader />
      
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
              <RoleCard
                icon={Shield}
                title="Administrator"
                description="Manage tenders, users, and system settings"
                onClick={() => selectRole('admin')}
                disabled={!hasAdminPermission}
              />
              
              <RoleCard
                icon={Store}
                title="Supplier"
                description="Discover and bid on available tenders"
                onClick={() => selectRole('supplier')}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
