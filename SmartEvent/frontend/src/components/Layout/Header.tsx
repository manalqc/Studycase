import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, LogOut, Menu, User, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from './Logo';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const handleLogout = async () => {
    await logout();
    closeMenu();
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  isActive('/') 
                    ? 'border-orange-500 text-black' 
                    : 'border-transparent text-gray-600 hover:text-black hover:border-gray-300'
                }`}
              >
                Events
              </Link>
              
              {isAuthenticated && (
                <Link
                  to="/my-events"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    isActive('/my-events') 
                      ? 'border-orange-500 text-black' 
                      : 'border-transparent text-gray-600 hover:text-black hover:border-gray-300'
                  }`}
                >
                  My Events
                </Link>
              )}
              
              {isAuthenticated && user?.isAdmin && (
                <Link
                  to="/admin"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    location.pathname.startsWith('/admin') 
                      ? 'border-orange-500 text-black' 
                      : 'border-transparent text-gray-600 hover:text-black hover:border-gray-300'
                  }`}
                >
                  Manage Events
                </Link>
              )}
            </nav>
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-orange-500 text-white flex items-center text-sm px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-fade-in">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={closeMenu}
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                isActive('/') 
                  ? 'bg-orange-50 border-l-4 border-orange-500 text-orange-700' 
                  : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-black'
              }`}
            >
              Events
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/my-events"
                onClick={closeMenu}
                className={`block pl-3 pr-4 py-2 text-base font-medium ${
                  isActive('/my-events') 
                    ? 'bg-orange-50 border-l-4 border-orange-500 text-orange-700' 
                    : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-black'
                }`}
              >
                My Events
              </Link>
            )}
            
            {isAuthenticated && user?.isAdmin && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className={`block pl-3 pr-4 py-2 text-base font-medium ${
                  location.pathname.startsWith('/admin') 
                    ? 'bg-orange-50 border-l-4 border-orange-500 text-orange-700' 
                    : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-black'
                }`}
              >
                Admin
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user?.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4 py-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="bg-orange-500 text-white w-full justify-center flex items-center py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;