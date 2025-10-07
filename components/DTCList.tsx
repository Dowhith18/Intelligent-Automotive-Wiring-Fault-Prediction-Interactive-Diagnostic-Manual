import React, { useState } from 'react';
import type { DTC } from '../types';
import { DTCStatus } from '../types';

interface DTCListProps {
    dtcs: DTC[];
    onSelectDTC: (dtc: DTC) => void;
}

const tabs = [DTCStatus.CURRENT, DTCStatus.HEALED, DTCStatus.HISTORY, DTCStatus.PENDING];

const DTCList: React.FC<DTCListProps> = ({ dtcs, onSelectDTC }) => {
    const [activeTab, setActiveTab] = useState<DTCStatus>(DTCStatus.CURRENT);

    const filteredDtcs = dtcs.filter(dtc => dtc.status === activeTab);

    const getStatusIndicator = (status: DTCStatus) => {
        switch (status) {
            case DTCStatus.CURRENT: return <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-300" title="Current"></div>;
            case DTCStatus.HEALED: return <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-300" title="Healed"></div>;
            case DTCStatus.HISTORY: return <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-yellow-300" title="History"></div>;
            case DTCStatus.PENDING: return <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-300" title="Pending"></div>;
            default: return null;
        }
    }

    return (
        <div className="bg-mida-surface rounded-lg overflow-hidden">
            {/* Filter Tabs */}
            <div className="p-2 bg-black/20 flex space-x-2">
                {tabs.map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-mida-accent-blue text-white' : 'bg-gray-600/50 hover:bg-gray-500/50'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-black/30">
                        <tr>
                            <th className="p-3 text-left w-12"></th>
                            <th className="p-3 text-left">ECU</th>
                            <th className="p-3 text-left">Category</th>
                            <th className="p-3 text-left">DTC</th>
                            <th className="p-3 text-left">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-mida-border">
                        {filteredDtcs.map(dtc => (
                            <tr key={dtc.id} onClick={() => onSelectDTC(dtc)} className="hover:bg-mida-border/50 cursor-pointer">
                                <td className="p-3 flex items-center justify-center">{getStatusIndicator(dtc.status)}</td>
                                <td className="p-3">{dtc.ecu}</td>
                                <td className="p-3">
                                    <span className="bg-mida-accent-blue/50 text-mida-text-primary px-2 py-1 rounded-md text-xs">{dtc.category}</span>
                                </td>
                                <td className="p-3">{dtc.code}</td>
                                <td className="p-3">{dtc.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredDtcs.length === 0 && (
                    <div className="text-center p-8 text-mida-text-secondary">
                        No {activeTab} DTCs found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DTCList;
