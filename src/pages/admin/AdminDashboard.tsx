
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTenderList } from '../../hooks/useTenderList';

const AdminDashboard: React.FC = () => {
  const { isLoading: authLoading, error: authError, isAdmin } = useAuth('admin');
  const navigate = useNavigate();
  const { tenders, isLoading: tendersLoading, error: tendersError } = useTenderList();
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      setDashboardLoading(false);
    }
    if (authError) {
      setDashboardError(authError);
    }
    
    // Redirect if not admin
    if (!isAdmin) {
      navigate('/auth');
    }
  }, [authLoading, authError, isAdmin, navigate]);

  return (
    <div>Admin Dashboard</div>
  );
};

export default AdminDashboard;
