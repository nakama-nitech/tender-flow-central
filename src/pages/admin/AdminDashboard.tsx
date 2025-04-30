import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTenderList } from '../../contexts/TenderListContext';

const AdminDashboard: React.FC = () => {
  const { isLoading: authLoading, error: authError, isAdmin } = useAuth('admin');
  const navigate = useNavigate();
  const { tenders, isLoading: tendersLoading, error: tendersError } = useTenderList();
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  return (
    <div>Admin Dashboard</div>
  );
};

export default AdminDashboard;
