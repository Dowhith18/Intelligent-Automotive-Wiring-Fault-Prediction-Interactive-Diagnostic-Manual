import React from 'react';
import { Link } from 'react-router-dom';
import type { Vehicle } from '../types';
import { Wrench } from './icons';

interface VehicleGridProps {
    vehicles: Vehicle[];
}

const getStatusBadgeColor = (status: Vehicle['status']) => {
    switch (status) {
        case 'Operational': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'Needs Attention': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'In Service': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

const VehicleGrid: React.FC<VehicleGridProps> = ({ vehicles }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
                <Link
                    key={vehicle.id}
                    to={`/app/vehicles/${vehicle.id}`}
                    className="bg-dark-surface rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300"
                >
                    <img className="h-48 w-full object-cover" src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} />
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                             <h3 className="text-lg font-bold text-dark-text-primary group-hover:text-primary-400 transition-colors">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </h3>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(vehicle.status)}`}>
                                {vehicle.status}
                            </span>
                        </div>
                        <p className="text-sm text-dark-text-secondary mt-1">{vehicle.engine}</p>
                        <p className="text-xs text-dark-text-secondary font-mono mt-4">{vehicle.vin}</p>
                        <div className="border-t border-dark-border mt-4 pt-3 flex justify-between items-center text-xs text-dark-text-secondary">
                            <span className="flex items-center"><Wrench className="w-4 h-4 mr-1.5" /> Last Service</span>
                            <span>{vehicle.lastService}</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default VehicleGrid;