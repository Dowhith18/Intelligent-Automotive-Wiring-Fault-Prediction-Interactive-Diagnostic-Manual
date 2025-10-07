import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { DiagnosticSession } from '../types';
import { MOCK_SESSIONS, MOCK_VEHICLES } from '../constants';
import { SessionStatus } from '../types';
import { Plus, Car, Wrench } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const getStatusColor = (status: SessionStatus) => {
        switch (status) {
            case SessionStatus.COMPLETE: return 'bg-green-500';
            case SessionStatus.IN_PROGRESS: return 'bg-blue-500';
            case SessionStatus.PENDING: return 'bg-yellow-500';
            case SessionStatus.ANALYZING: return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    const totalVehicles = MOCK_VEHICLES.length;
    const activeSessions = MOCK_SESSIONS.filter(s => s.status === SessionStatus.IN_PROGRESS).length;
    const needsAttention = MOCK_VEHICLES.filter(v => v.status === 'Needs Attention').length;


  return (
    <div>
        <h1 className="text-3xl font-bold text-dark-text-primary tracking-tight">Dashboard</h1>
        <p className="mt-1 text-md text-dark-text-secondary">Welcome back, {user?.user_metadata?.name || 'Technician'}. Here's what's happening today.</p>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-dark-surface overflow-hidden shadow rounded-lg">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Car className="h-6 w-6 text-dark-text-secondary" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-dark-text-secondary truncate">Total Vehicles</dt>
                                <dd className="text-3xl font-semibold text-dark-text-primary">{totalVehicles}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
             <div className="bg-dark-surface overflow-hidden shadow rounded-lg">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Wrench className="h-6 w-6 text-dark-text-secondary" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-dark-text-secondary truncate">Active Sessions</dt>
                                <dd className="text-3xl font-semibold text-dark-text-primary">{activeSessions}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-dark-surface overflow-hidden shadow rounded-lg">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="h-6 w-6 text-accent-500 font-bold text-xl flex items-center justify-center">!</div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-dark-text-secondary truncate">Needs Attention</dt>
                                <dd className="text-3xl font-semibold text-accent-500">{needsAttention}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
            <button 
                onClick={() => navigate('/app/diagnostics/new')}
                className="bg-primary-800 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 h-full">
                <Plus className="h-6 w-6 mr-2" />
                New Diagnostic Session
            </button>
        </div>

        {/* Recent Sessions */}
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-dark-text-primary">Recent Diagnostic Sessions</h2>
            <div className="mt-4 bg-dark-surface shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-dark-border">
                    {MOCK_SESSIONS.map((session: DiagnosticSession) => (
                        <li key={session.id}>
                            <a href="#" className="block hover:bg-dark-border">
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-primary-400 truncate">{session.vehicleName}</p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(session.status)} text-white`}>
                                                {session.status}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-dark-text-secondary">
                                                <Wrench className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                {session.dtcs.join(', ')}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-dark-text-secondary sm:mt-0">
                                            <p>{session.startDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;