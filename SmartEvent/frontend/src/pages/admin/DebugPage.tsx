import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/UI/Button';
import EventCreationTest from '../../components/Debug/EventCreationTest';
import { useAuth } from '../../contexts/AuthContext';

const DebugPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  // Redirect non-admin users
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);
  
  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold gradient-text">
            Debug Tools
          </h1>
        </div>
        
        <div className="space-y-6">
          <EventCreationTest />
        </div>
      </div>
    </Layout>
  );
};

export default DebugPage;
