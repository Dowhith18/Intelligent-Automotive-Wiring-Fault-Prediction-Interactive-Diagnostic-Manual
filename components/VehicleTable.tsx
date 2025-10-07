import React from 'react';
import { Link } from 'react-router-dom';
import type { Vehicle } from '../types';

interface VehicleTableProps {
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

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles }) => {
    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-dark-border sm:rounded-lg">
                        <table className="min-w-full divide-y divide-dark-border">
                            <thead className="bg-dark-surface">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Vehicle</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">VIN</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Last Service</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-dark-surface divide-y divide-dark-border">
                                {vehicles.map((vehicle) => (
                                    <tr key={vehicle.id} className="hover:bg-dark-border/30">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-full object-cover" src={vehicle.imageUrl} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-dark-text-primary">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                                                    <div className="text-sm text-dark-text-secondary">{vehicle.engine}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text-secondary font-mono">{vehicle.vin}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(vehicle.status)}`}>
                                                {vehicle.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text-secondary">{vehicle.lastService}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/app/vehicles/${vehicle.id}`} className="text-primary-400 hover:text-primary-300">View</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleTable;