
import React from 'react';
import { Briefcase } from 'lucide-react';

const AccountDetailsHeader: React.FC = () => {
  return (
    <div className="text-lg font-medium flex items-center text-primary-700">
      <Briefcase className="h-5 w-5 mr-2 text-primary" />
      <span>Account Details</span>
    </div>
  );
};

export default AccountDetailsHeader;
