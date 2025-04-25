
import React from 'react';
import TenderForm from '@/components/TenderForm';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminTenderCreate: React.FC = () => {
  const navigate = useNavigate();
  const { tenderId } = useParams<{ tenderId?: string }>();
  useAdminAuth(); // This ensures only admins can access this page

  const handleCancel = () => {
    navigate('/admin/tenders');
  };

  return (
    <TenderForm 
      onCancel={handleCancel} 
      tenderId={tenderId}
    />
  );
};

export default AdminTenderCreate;
