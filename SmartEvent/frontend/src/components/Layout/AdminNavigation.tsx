import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminNavigation: React.FC = () => {
  const { isAdmin } = useAuth();

  // Only render admin navigation if user is an admin
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-blue-800 text-white py-2 px-4">
      <div className="container mx-auto flex items-center">
        <span className="font-semibold mr-4">Admin Controls:</span>
        <div className="flex space-x-4">
          <Link 
            to="/admin" 
            className="text-white hover:text-blue-200 transition"
          >
            Manage Events
          </Link>
          <Link 
            to="/admin/events/new" 
            className="text-white hover:text-blue-200 transition"
          >
            Create Event
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigation;
