import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireAdmin = false,
  redirectPath = '/login',
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // If auth is still loading, show nothing
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check if admin is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/events" replace />;
  }

  // User is authenticated (and is admin if required)
  return <Outlet />;
};

export default ProtectedRoute;
