
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCompanyProfile } from './hooks/useCompanyProfile';
import { Loader2 } from 'lucide-react';

interface RequireCompanyProfileProps {
  children: React.ReactNode;
}

export const RequireCompanyProfile: React.FC<RequireCompanyProfileProps> = ({ children }) => {
  const { profile, isLoading } = useCompanyProfile();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium">Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (!profile || !profile.isComplete) {
    return (
      <Navigate 
        to="/supplier/company-profile" 
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default RequireCompanyProfile;
