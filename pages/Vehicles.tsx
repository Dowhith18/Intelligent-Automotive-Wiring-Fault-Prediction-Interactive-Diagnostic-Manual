
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_VEHICLES } from '../constants';
import type { Vehicle } from '../types';
import { Plus, ChevronRight } from '../components/icons';

const VehicleCard: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
    const getStatusIndicator = (status: Vehicle['status']) => {
        switch (status) {
            case 'Operational': return 'bg-green-500';
            case 'Needs Attention': return 'bg-yellow-500';
            case 'In Service': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <li className="col-span-1 flex flex-col text-center bg-dark-surface rounded-lg shadow divide-y divide-dark-border">
            <div className="flex-1 flex flex-col p-8">
                <img className="w-32 h-32 flex-shrink-0 mx-auto rounded-lg object-cover" src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} />
                <h3 className="mt-6 text-dark-text-primary text-sm font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                <dl className="mt-1 flex-grow flex flex-col justify-between">
                    <dt className="sr-only">VIN</dt>
                    <dd className="text-dark-text-secondary text-xs">{vehicle.vin}</dd>
                    <dt className="sr-only">Status</dt>
                    <dd className="mt-3">
                        <span className={`px-2 py-1 text-white text-xs font-medium rounded-full ${getStatusIndicator(vehicle.status)}`}>
                            {vehicle.status}
                        </span>
                    </dd>
                </dl>
            </div>
            <div>
                <div className="-mt-px flex divide-x divide-dark-border">
                    <div className="w-0 flex-1 flex">
                        <Link
                            to={`/app/vehicles/${vehicle.id}`}
                            className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-dark-text-secondary font-medium border border-transparent rounded-bl-lg hover:text-dark-text-primary"
                        >
                            <span>View Details</span>
                            <ChevronRight className="w-5 h-5 ml-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </li>
    );
};


const Vehicles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredVehicles = MOCK_VEHICLES.filter(v => 
      `${v.make} ${v.model} ${v.year} ${v.vin}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
        <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-dark-text-primary tracking-tight">Vehicle Management</h1>
                <p className="mt-1 text-md text-dark-text-secondary">View, manage, and track all vehicles in your workshop.</p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
                <button
                    type="button"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-800 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-dark-bg"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Add Vehicle
                </button>
            </div>
        </div>
        
        <div className="mt-8">
             <input
                type="text"
                placeholder="Search by make, model, year, or VIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-dark-surface border border-dark-border focus:ring-primary-500 focus:border-primary-500 text-dark-text-primary"
            />
        </div>
        
        <ul role="list" className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
        </ul>
    </div>
  );
};

export default Vehicles;
