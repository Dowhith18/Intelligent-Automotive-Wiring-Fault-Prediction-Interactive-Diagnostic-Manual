
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_VEHICLES, MOCK_SESSIONS } from '../constants';
import { Wrench, Plus } from '../components/icons';
import { SessionStatus } from '../types';

const VehicleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const vehicle = MOCK_VEHICLES.find(v => v.id === id);
    const vehicleSessions = MOCK_SESSIONS.filter(s => s.vehicleId === id);

    if (!vehicle) {
        return <div>Vehicle not found.</div>;
    }

    const getStatusColor = (status: SessionStatus) => {
        switch (status) {
            case SessionStatus.COMPLETE: return 'text-green-400';
            case SessionStatus.IN_PROGRESS: return 'text-blue-400';
            case SessionStatus.PENDING: return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };
    
    return (
        <div>
            <div className="md:flex md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-dark-text-primary tracking-tight">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
                    <p className="mt-1 text-md text-dark-text-secondary">{vehicle.vin}</p>
                </div>
                 <div className="mt-4 flex md:mt-0 md:ml-4">
                    <button
                        onClick={() => navigate('/app/diagnostics/new')}
                        type="button"
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-800 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-primary-500"
                    >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        New Diagnostic Session
                    </button>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-dark-surface rounded-lg shadow overflow-hidden">
                        <img className="w-full h-56 object-cover" src={vehicle.imageUrl} alt="" />
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-dark-text-primary">Vehicle Details</h3>
                            <dl className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between"><dt className="text-dark-text-secondary">Engine:</dt><dd className="text-dark-text-primary font-semibold">{vehicle.engine}</dd></div>
                                <div className="flex justify-between"><dt className="text-dark-text-secondary">Last Service:</dt><dd className="text-dark-text-primary font-semibold">{vehicle.lastService}</dd></div>
                                <div className="flex justify-between"><dt className="text-dark-text-secondary">Status:</dt><dd className="text-dark-text-primary font-semibold">{vehicle.status}</dd></div>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold text-dark-text-primary">Diagnostic Sessions</h2>
                    <div className="mt-4 bg-dark-surface shadow overflow-hidden sm:rounded-md">
                        <ul role="list" className="divide-y divide-dark-border">
                            {vehicleSessions.length > 0 ? vehicleSessions.map(session => (
                                <li key={session.id}>
                                    <div className="px-4 py-4 sm:px-6 hover:bg-dark-border cursor-pointer">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-primary-400 truncate">Session {session.id}</p>
                                            <p className={`text-sm font-semibold ${getStatusColor(session.status)}`}>{session.status}</p>
                                        </div>
                                        <div className="mt-2 text-sm text-dark-text-secondary">
                                            <p>DTCs: {session.dtcs.join(', ')}</p>
                                            <p className="mt-1">Symptoms: {session.symptoms.join(', ')}</p>
                                        </div>
                                        <p className="text-xs text-dark-text-secondary mt-2">Started: {session.startDate}</p>
                                    </div>
                                </li>
                            )) : (
                                <li className="px-4 py-4 sm:px-6 text-center text-dark-text-secondary">
                                    No diagnostic sessions found for this vehicle.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetail;
