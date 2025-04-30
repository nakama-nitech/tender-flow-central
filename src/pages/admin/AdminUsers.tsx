
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AdminUsers: React.FC = () => {
  const { isLoading: authLoading, error: authError, isAdmin } = useAuth('admin');
  const navigate = useNavigate();
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      setUsersLoading(false);
    }
    if (authError) {
      setUsersError(authError);
    }
    
    if (!isAdmin) {
      navigate('/auth');
    }
  }, [authLoading, authError, isAdmin, navigate]);

  return (
    <div>Admin Users</div>
  );
};

export default AdminUsers;
