
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { useTenderDetails } from '../../hooks/useTenderDetails';

const AdminTenderDetails: React.FC = () => {
  const { isLoading: authLoading, error: authError, isAdmin } = useAuth('admin');
  const navigate = useNavigate();
  const { tenderId } = useParams<{ tenderId: string }>();
  const { 
    tender, 
    isLoading: tenderLoading, 
    error: tenderError, 
    updateTenderStatus 
  } = useTenderDetails(tenderId!);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/auth');
    }
  }, [authLoading, isAdmin, navigate]);

  return (
    <div>Admin Tender Details</div>
  );
};

export default AdminTenderDetails;
