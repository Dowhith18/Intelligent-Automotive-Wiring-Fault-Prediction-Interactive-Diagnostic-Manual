import React from 'react';
import type { LiveData } from '../types';

interface LiveDataSidebarProps {
    data: LiveData;
}

const LiveDataSidebar: React.FC<LiveDataSidebarProps> = ({ data }) => {
    return (
        <aside className="w-64 flex-shrink-0 space-y-4">
            {/* Live Data */}
            <div className="bg-mida-surface rounded-lg p-4 space-y-3">
                <DataItem label="Odometer" value={data.odometer} unit="kms" />
                <DataItem label="Battery Voltage" value={data.batteryVoltage} unit="V" />
                <DataItem label="Vehicle Speed" value={data.vehicleSpeed} unit="Kmph" />
                <DataItem label="Engine Speed" value={data.engineSpeed} unit="rpm" />
                <DataItem label="Ignition Counter" value={data.ignitionCounter} unit="(s)" />
            </div>

            {/* DTC Status */}
            <div className="bg-mida-surface rounded-lg p-4 text-center">
                <p className="text-sm text-mida-text-secondary">DTC Status</p>
                <p className="text-3xl font-bold mt-1">87</p>
                <p className="text-xs text-mida-text-secondary">Total DTCs in Vehicle</p>
            </div>
            
            {/* ECU Status */}
            <div className="bg-mida-surface rounded-lg p-4 text-center">
                <p className="text-sm text-mida-text-secondary">ECU Status</p>
                <div className="flex justify-center items-baseline space-x-2 mt-1">
                    <p className="text-3xl font-bold">14/15</p>
                </div>
                <p className="text-xs text-mida-text-secondary">ECUs with DTCs</p>
            </div>
        </aside>
    );
};

const DataItem: React.FC<{ label: string; value: string | number; unit: string }> = ({ label, value, unit }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-mida-text-secondary">{label}</span>
        <span className="font-semibold">{value} <span className="text-xs text-mida-text-secondary">{unit}</span></span>
    </div>
);

export default LiveDataSidebar;
