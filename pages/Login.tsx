import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';
import StatusBar from '../components/StatusBar';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();
    const [username, setUsername] = useState('11aab0000');
    const [password, setPassword] = useState('••••••••');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/app';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Using username as email for Supabase mock
            await login(username + '@example.com', password);
        } catch (err: any) {
            setError(err.message || "Failed to sign in. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="h-screen w-screen flex flex-col">
        <div className="absolute top-0 right-0 p-2 flex space-x-2">
            <button className="h-6 w-6 bg-gray-600 hover:bg-gray-700 rounded-sm">-</button>
            <button className="h-6 w-6 bg-gray-600 hover:bg-gray-700 rounded-sm">☐</button>
            <button className="h-6 w-6 bg-mida-accent-red hover:bg-mida-accent-red-dark rounded-sm">X</button>
        </div>
        <p className="text-center py-2 text-sm text-mida-text-secondary">Mahindra Intelligent Diagnostic Assistant - 1.0.8983.11 [Prod]</p>
        
        <h1 className="text-2xl font-semibold text-center my-6 text-mida-text-primary">Mahindra Intelligent Diagnostic Assistant</h1>

        <div className="flex-1 flex items-center justify-center relative">
            <h2 className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-2xl font-semibold tracking-wider text-mida-text-primary whitespace-nowrap">
                Mahindra Intelligent Diagnostic Assistant
            </h2>
            
            <div className="w-full max-w-sm">
                <div className="relative mb-8 flex justify-center">
                    <img src="https://i.imgur.com/rL6p3TL.png" alt="Mida Logo" className="h-20 w-auto"/>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-white rounded-lg p-8 shadow-2xl space-y-6">
                        <h3 className="text-center font-bold text-gray-700 text-xl">Authentication</h3>
                        <div>
                            <label className="text-sm font-medium text-gray-600">User Name</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="mt-1 w-full border-b-2 border-gray-300 focus:border-black focus:outline-none text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="mt-1 w-full border-b-2 border-gray-300 focus:border-black focus:outline-none text-gray-800"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                             <div className="flex items-center">
                                <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black" defaultChecked />
                                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">Remember me</label>
                            </div>
                            <a href="#" className="text-sm text-mida-accent-red hover:underline">License Ok</a>
                        </div>
                         {error && <p className="text-center text-sm text-red-500">{error}</p>}
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
        
       <StatusBar />
    </div>
  );
};

export default Login;