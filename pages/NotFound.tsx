
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <h1 className="text-6xl font-extrabold text-primary-500">404</h1>
      <h2 className="mt-2 text-3xl font-bold text-dark-text-primary tracking-tight sm:text-4xl">Page Not Found</h2>
      <p className="mt-4 text-base text-dark-text-secondary">Sorry, we couldn’t find the page you’re looking for.</p>
      <Link to="/app/dashboard" className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-dark-bg">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
