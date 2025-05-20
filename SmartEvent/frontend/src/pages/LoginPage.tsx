import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Calendar className="h-12 w-12 text-orange-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-black">
          Sign in to SmartEvent
        </h2>
        <p className="mt-2 text-center text-sm text-black">
          Or{' '}
          <Link to="/" className="font-medium text-orange-500 hover:text-orange-600 underline">
            explore events as a guest
          </Link>
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border-2 border-black">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
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
                  className={`appearance-none block w-full px-3 py-2 border-2 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 sm:text-sm ${error || authError ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : 'border-black focus:border-orange-500'}`}
                />
              </div>
              
              {/* Error messages */}
              {(error || authError) && (
                <p className="mt-2 text-sm text-orange-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error || authError}
                </p>
              )}
              
              {/* Demo accounts help text */}
              <div className="mt-4 text-sm text-black space-y-1 bg-orange-50 p-3 rounded-md border border-orange-200">
                <p className="font-medium">For demo purposes, use one of these emails:</p>
                <ul className="ml-4 list-disc text-xs space-y-1">
                  <li><code className="bg-white px-1 py-0.5 rounded border border-orange-200">admin@smartevent.com</code> - Admin user</li>
                </ul>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign in'}
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-black">
                    Don't have an account?
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link 
                  to="/register" 
                  className="w-full flex justify-center py-2 px-4 border-2 border-black rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-black hover:text-white transition-colors"
                >
                  Register here
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;