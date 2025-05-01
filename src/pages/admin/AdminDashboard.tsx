
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTenderList } from '../../hooks/useTenderList';

const AdminDashboard: React.FC = () => {
  const { isAdmin, isLoading } = useAuth('admin');
  const navigate = useNavigate();
  const { tenders, isLoading: tendersLoading } = useTenderList();
  
  useEffect(() => {
    // Redirect to admin/tenders when accessing the root admin path
    if (!isLoading && isAdmin) {
      navigate('/admin/tenders');
    }
  }, [isLoading, isAdmin, navigate]);

  if (isLoading || tendersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // This will rarely be shown as we redirect
  return (
    <div className="text-center py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600">Redirecting to admin tenders...</p>
    </div>
  );
};

export default AdminDashboard;
