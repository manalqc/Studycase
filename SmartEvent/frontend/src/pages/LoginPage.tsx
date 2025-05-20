import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';

const LoginPage: React.FC = () => {
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, you would validate the email format here
    // For this mock version, we're just checking if it's not empty
    
    try {
      const success = await login(email);
      
      if (success) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Calendar className="h-12 w-12 text-primary-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold gradient-text">
          Sign in to SmartEvent
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/" className="font-medium text-primary-600 hover:text-primary-500">
            explore events as a guest
          </Link>
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-input ${error || authError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
              </div>
              
              {/* Error messages */}
              {(error || authError) && (
                <p className="mt-2 text-sm text-red-600">
                  {error || authError}
                </p>
              )}
              
              {/* Demo accounts help text */}
              <div className="mt-4 text-sm text-gray-500 space-y-1">
                <p>For demo purposes, use one of these emails:</p>
                <ul className="ml-4 list-disc text-xs space-y-1">
                  <li><code>admin@smartevent.com</code> - Admin user</li>
                  <li><code>john@example.com</code> - Regular user</li>
                  <li><code>jane@example.com</code> - Regular user</li>
                </ul>
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                Sign in
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;