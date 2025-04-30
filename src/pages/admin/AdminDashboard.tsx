import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTenderList } from '../../contexts/TenderListContext';

const AdminDashboard: React.FC = () => {
  const { isLoading: authLoading, error: authError, isAdmin } = useAuth('admin');
  const navigate = useNavigate();
  const { tenders, isLoading, error } = useTenderList();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ... rest of the component code ...

  return (
    // ... render code ...
  );
};

export default AdminDashboard; 