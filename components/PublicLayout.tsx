
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Wrench } from './icons';

const PublicHeader: React.FC = () => (
  <header className="bg-dark-surface/80 backdrop-blur-md sticky top-0 z-40 border-b border-dark-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <Link to="/" className="flex items-center">
          <Wrench className="h-8 w-auto text-primary-400" />
          <span className="ml-3 text-xl font-bold text-dark-text-primary">IAWFPIDM</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-sm font-medium text-dark-text-secondary hover:text-dark-text-primary transition-colors">
            Log in
          </Link>
          <Link to="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-700 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-dark-bg transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  </header>
);

const PublicFooter: React.FC = () => (
  <footer className="bg-dark-surface border-t border-dark-border">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-dark-text-secondary text-sm">
      &copy; {new Date().getFullYear()} IAWFPIDM. All rights reserved.
    </div>
  </footer>
);

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg font-sans">
      <PublicHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
