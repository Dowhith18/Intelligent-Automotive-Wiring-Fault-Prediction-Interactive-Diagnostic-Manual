import React from 'react';
import type { ECUModule } from '../types';
import { Wrench } from './icons';

interface ECUGridProps {
    ecus: ECUModule[];
}

const ECUGrid: React.FC<ECUGridProps> = ({ ecus }) => {
    
    const getStatusClasses = (status: ECUModule['status']) => {
        switch (status) {
            case 'SUCCESS':
                return 'bg-mida-accent-green-dark border-mida-accent-green';
            case 'DTC_FOUND':
                return 'bg-mida-accent-red-dark border-mida-accent-red';
            case 'NO_RESPONSE':
                return 'bg-mida-border border-mida-text-secondary';
        }
    };
    
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ecus.map((ecu) => (
                <div 
                    key={ecu.id} 
                    className={`p-3 rounded-lg border-2 text-white cursor-pointer transition-all hover:scale-105 ${getStatusClasses(ecu.status)}`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs">{ecu.status.replace('_', ' ')}</p>
                            <h3 className="font-bold">{ecu.shortName}</h3>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${ecu.status === 'SUCCESS' ? 'bg-mida-accent-green' : 'bg-mida-accent-red'}`}>
                          {ecu.status === 'SUCCESS' ? '✓' : '!'}
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <Wrench className="w-5 h-5 text-gray-300" />
                        <span className="text-xl font-bold">{ecu.dtcCount}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ECUGrid;
