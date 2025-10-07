import React from 'react';
import type { DTC } from '../types';
import { X, CheckCircle } from './icons';

interface FreezeFramePanelProps {
    dtc: DTC | null;
    onClose: () => void;
}

const FreezeFramePanel: React.FC<FreezeFramePanelProps> = ({ dtc, onClose }) => {
    return (
        <div className={`fixed top-0 right-0 h-full bg-gray-100 text-gray-800 shadow-2xl transition-transform duration-300 ease-in-out ${dtc ? 'translate-x-0' : 'translate-x-full'}`} style={{width: '450px'}}>
            <div className="flex flex-col h-full">
                <header className="p-4 bg-white border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold">Freeze Frame</h2>
                    <button onClick={onClose} className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600">
                        <X className="w-5 h-5"/>
                    </button>
                </header>
                
                {dtc && (
                    <div className="p-4 flex-1 overflow-y-auto">
                        <div className="mb-4">
                            <h3 className="font-semibold">{dtc.code} - {dtc.description}</h3>
                            <p className="text-sm text-gray-500">{dtc.ecu} | {dtc.category}</p>
                        </div>
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-2 text-left">Parameter Name</th>
                                    <th className="p-2 text-left">Value</th>
                                    <th className="p-2 text-left">Unit</th>
                                    <th className="p-2 text-left">Result</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y">
                                {dtc.freezeFrame.map(param => (
                                    <tr key={param.parameter}>
                                        <td className="p-2">{param.parameter}</td>
                                        <td className="p-2">{param.value}</td>
                                        <td className="p-2">{param.unit}</td>
                                        <td className="p-2">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FreezeFramePanel;
