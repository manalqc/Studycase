import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, AlertTriangle } from 'lucide-react';
import Button from '../components/UI/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Calendar className="h-24 w-24 text-gray-300" />
            <AlertTriangle className="h-10 w-10 text-secondary-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-3xl font-semibold gradient-text mb-4">Page Not Found</h2>
        
        <p className="text-xl text-gray-600 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
          <Button onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;