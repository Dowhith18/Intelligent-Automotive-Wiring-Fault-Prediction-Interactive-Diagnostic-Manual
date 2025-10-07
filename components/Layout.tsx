import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import StatusBar from './StatusBar';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-mida-bg text-mida-text-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
        <StatusBar />
      </div>
    </div>
  );
};

export default Layout;