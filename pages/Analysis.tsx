import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_ECUS, MOCK_LIVE_DATA, MOCK_DTCS } from '../constants';
import { BarChart2, RefreshCw } from '../components/icons';
import type { DTC } from '../types';
import ECUGrid from '../components/ECUGrid';
import DTCList from '../components/DTCList';
import LiveDataSidebar from '../components/LiveDataSidebar';
import FreezeFramePanel from '../components/FreezeFramePanel';

type ViewMode = 'grid' | 'list';

const Analysis: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const [view, setView] = useState<ViewMode>('grid');
    const [selectedDTC, setSelectedDTC] = useState<DTC | null>(null);

    const vin = `MA1NS2NVPR2D${sessionId}`;
    const model = 'AS22XPNV5TP103D002Y';
    const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    return (
        <div className="flex flex-col h-full">
            {/* Top Info Bar */}
            <div className="bg-mida-surface p-2 rounded-md flex justify-between items-center text-sm font-semibold">
                <div className="flex space-x-4">
                    <span>{vin}</span>
                    <span>{model}</span>
                </div>
                <div className="flex space-x-4 items-center">
                    <span>{time}</span>
                    <span>{date}</span>
                    <div className="flex bg-black rounded-md p-1 space-x-1">
                        <button 
                            onClick={() => setView('list')}
                            className={`px-3 py-1 rounded ${view === 'list' ? 'bg-mida-accent-red' : ''}`}
                        >
                            DTC
                        </button>
                        <button 
                            className="px-3 py-1 rounded"
                        >
                           <BarChart2 className="w-4 h-4" />
                        </button>
                         <button 
                            onClick={() => setView('grid')}
                            className={`px-3 py-1 rounded ${view === 'grid' ? 'bg-mida-accent-red' : ''}`}
                        >
                           Analysis
                        </button>
                    </div>
                    <button>
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <h2 className="text-xl font-bold my-4">Diagnostics</h2>
            
            <div className="flex-1 flex gap-6 overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-2">
                   {view === 'grid' ? <ECUGrid ecus={MOCK_ECUS} /> : <DTCList dtcs={MOCK_DTCS} onSelectDTC={setSelectedDTC} />}
                </div>
                
                <LiveDataSidebar data={MOCK_LIVE_DATA} />
            </div>

            <FreezeFramePanel dtc={selectedDTC} onClose={() => setSelectedDTC(null)} />
        </div>
    );
};

export default Analysis;