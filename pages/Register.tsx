import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, User } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/app/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            await register(email, password, name);
            setMessage("Registration successful! Please check your email to verify your account.");
            // In a real app with email verification, you wouldn't navigate immediately.
            // For this demo, we'll let the onAuthStateChange handle redirection if auto-login occurs.
        } catch (err: any) {
             setError(err.message || "Failed to create account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Wrench className="mx-auto h-12 w-auto text-primary-400" />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-dark-text-primary">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-dark-text-secondary">
          Or{' '}
          <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-dark-surface py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-center text-sm text-red-500 bg-red-500/10 p-2 rounded-md">{error}</p>}
            {message && <p className="text-center text-sm text-green-500 bg-green-500/10 p-2 rounded-md">{message}</p>}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-text-secondary">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-dark-border bg-dark-bg px-3 py-2 placeholder-dark-text-secondary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-text-secondary">
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
                  className="block w-full appearance-none rounded-md border border-dark-border bg-dark-bg px-3 py-2 placeholder-dark-text-secondary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-text-secondary">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-dark-border bg-dark-bg px-3 py-2 placeholder-dark-text-secondary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !!message}
                className="flex w-full justify-center rounded-md border border-transparent bg-accent-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-dark-surface disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : (
                    <>
                        <User className="w-5 h-5 mr-2 -ml-1" />
                        Create Account
                    </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;