import React, { useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import Login from './Login';
import Dashboard from './Dashboard';

const Admin: React.FC = () => {
  const { isAuthenticated } = useAdmin();
  
  useEffect(() => {
    console.log('Admin component loaded. isAuthenticated:', isAuthenticated);
  }, [isAuthenticated]);

  return isAuthenticated ? <Dashboard /> : <Login />;
};

export default Admin;
