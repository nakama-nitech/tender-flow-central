import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminReports: React.FC = () => {
  const { isLoading: authLoading, error: authError, isAdmin } = useAuth('admin');
  const navigate = useNavigate();
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      setReportsLoading(false);
    }
    if (authError) {
      setReportsError(authError);
    }

    if (!isAdmin) {
      navigate('/auth');
    }
  }, [authLoading, authError, isAdmin, navigate]);

  return (
    <div>Admin Reports</div>
  );
};

export default AdminReports;
