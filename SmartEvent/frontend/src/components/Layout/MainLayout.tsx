import React, { ReactNode } from 'react';
import AdminNavigation from './AdminNavigation';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      {/* Admin Navigation - only shows if user is admin */}
      <AdminNavigation />
      
      {/* Main Content */}
      {children}
    </>
  );
};

export default MainLayout;
