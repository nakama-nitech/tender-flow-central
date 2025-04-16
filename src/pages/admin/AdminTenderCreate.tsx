
import React from 'react';
import TenderForm from '@/components/TenderForm';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminTenderCreate: React.FC = () => {
  const navigate = useNavigate();
  useAdminAuth(); // This ensures only admins can access this page

  const handleCancel = () => {
    navigate('/admin/tenders');
  };

  return (
    <TenderForm onCancel={handleCancel} />
  );
};

export default AdminTenderCreate;
