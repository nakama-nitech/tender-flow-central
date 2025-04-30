import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useTenderDetails } from '../../hooks/useTenderDetails';

const AdminTenderDetails: React.FC = () => {
  const { isLoading: authLoading, error: authError, isAdmin } = useAuth('admin');
  const navigate = useNavigate();
  const { tenderId } = useParams<{ tenderId: string }>();
  const { tender, isLoading, error, updateTenderStatus } = useTenderDetails(tenderId!);

  // ... rest of the component code ...

  return (
    // ... render component code ...
  );
};

export default AdminTenderDetails; 