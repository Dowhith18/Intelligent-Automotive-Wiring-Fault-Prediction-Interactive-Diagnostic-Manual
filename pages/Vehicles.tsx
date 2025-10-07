import React, { useState } from 'react';
import { MOCK_VEHICLES } from '../constants';
import type { Vehicle } from '../types';
import { Plus, Grid, List } from '../components/icons';
import VehicleGrid from '../components/VehicleGrid';
import VehicleTable from '../components/VehicleTable';
import AddVehicleModal from '../components/AddVehicleModal';

type ViewMode = 'grid' | 'table';

const Vehicles: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddVehicle = (newVehicleData: Omit<Vehicle, 'id' | 'status' | 'imageUrl' | 'lastService'>) => {
        const newVehicle: Vehicle = {
            ...newVehicleData,
            id: `VEH${vehicles.length + 1}`,
            status: 'Operational',
            imageUrl: `https://picsum.photos/seed/${newVehicleData.vin}/400/300`,
            lastService: new Date().toISOString().split('T')[0],
        };
        setVehicles(prevVehicles => [newVehicle, ...prevVehicles]);
    };

    return (
        <div>
            <div className="md:flex md:items-center md:justify-between mb-8">
                <h1 className="text-3xl font-bold text-dark-text-primary tracking-tight">Vehicles</h1>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    {/* View Toggler */}
                    <div className="bg-dark-surface p-1 rounded-lg flex items-center">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary-700 text-white' : 'text-dark-text-secondary hover:bg-dark-border'}`}
                            aria-pressed={viewMode === 'grid'}
                        >
                           <Grid className="w-5 h-5" />
                        </button>
                         <button 
                            onClick={() => setViewMode('table')}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'table' ? 'bg-primary-700 text-white' : 'text-dark-text-secondary hover:bg-dark-border'}`}
                            aria-pressed={viewMode === 'table'}
                        >
                           <List className="w-5 h-5" />
                        </button>
                    </div>
                    {/* Add Vehicle Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-800 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-primary-500"
                    >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        Add Vehicle
                    </button>
                </div>
            </div>

            {viewMode === 'grid' ? <VehicleGrid vehicles={vehicles} /> : <VehicleTable vehicles={vehicles} />}

            <AddVehicleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onVehicleAdded={handleAddVehicle}
            />
        </div>
    );
};

export default Vehicles;