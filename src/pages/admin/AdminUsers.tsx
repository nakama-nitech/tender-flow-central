import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminUsers: React.FC = () => {
  const { isLoading: authLoading, error: authError, isAdmin } = useAuth('admin');
  const navigate = useNavigate();
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  return (
    <div>Admin Users</div>
  );
};

export default AdminUsers;
