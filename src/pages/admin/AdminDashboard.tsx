
import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTenderList } from '../../hooks/useTenderList';

const AdminDashboard: React.FC = () => {
  const { isLoading: authLoading, error: authError, isAdmin } = useAuth('admin');
  const navigate = useNavigate();
  const { tenders, isLoading: tendersLoading, error: tendersError } = useTenderList();

  useEffect(() => {
    if (!authLoading) {
      // Redirect if not admin
      if (!isAdmin) {
        navigate('/auth');
        return;
      }

      // Redirect to tenders list (as this is just an empty route handler)
      navigate('/admin/tenders');
    }
  }, [authLoading, isAdmin, navigate]);

  // Render loading state while we redirect
  return (
    <div className="flex items-center justify-center h-full">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );
};

export default AdminDashboard;
