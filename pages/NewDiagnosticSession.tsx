import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info } from '../components/icons';

const NewDiagnosticSession: React.FC = () => {
  const navigate = useNavigate();
  const [vin, setVin] = useState('');
  const [model, setModel] = useState('');
  const [lastRunDate, setLastRunDate] = useState('');
  const [lastRunStatus, setLastRunStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchFromECU = () => {
    // Simulate fetching data from ECU
    setIsLoading(true);
    setTimeout(() => {
        setVin('MA1NS2NVPR2D51667');
        setModel('AS22XPNV5TP103D002Y');
        setLastRunDate('08-08-2024 05:03:28');
        setLastRunStatus('Failed');
        setIsLoading(false);
    }, 1000);
  };

  const handleStart = () => {
    if (!vin || !model) return;
    const sessionId = vin.slice(-6);
    navigate(`/app/diagnostics/${sessionId}/analysis`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-mida-text-primary">
        <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="vin" className="text-sm text-mida-text-secondary mb-1 block">VIN NUMBER</label>
                        <input
                            id="vin"
                            type="text"
                            value={vin}
                            onChange={(e) => setVin(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-mida-border focus:border-mida-accent-red focus:outline-none py-2 text-lg"
                        />
                    </div>
                     <div>
                        <label htmlFor="model" className="text-sm text-mida-text-secondary mb-1 block">MODEL NUMBER</label>
                        <input
                            id="model"
                            type="text"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-mida-border focus:border-mida-accent-red focus:outline-none py-2 text-lg"
                        />
                    </div>
                </div>
                <button
                    onClick={handleFetchFromECU}
                    disabled={isLoading}
                    className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors h-12 w-48 disabled:opacity-50"
                >
                    {isLoading ? 'Fetching...' : 'Fetch From ECU'}
                </button>
            </div>

            <div className="my-16">
                <button
                    onClick={handleStart}
                    disabled={!vin || !model}
                    className="relative w-40 h-40 rounded-full bg-gray-200 border-8 border-gray-300 flex items-center justify-center text-gray-700 font-bold text-2xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white glowing-circle"
                >
                    Start
                    <div className="absolute inset-0 rounded-full border-4 border-gray-400 animate-pulse"></div>
                </button>
            </div>
            
            <div className="w-full max-w-2xl flex justify-between items-center border-t border-mida-border pt-4">
                <div className="text-center">
                    <p className="text-sm text-mida-text-secondary">Last Run DateTime</p>
                    <p className="font-semibold mt-1">{lastRunDate || 'N/A'}</p>
                </div>
                 <div className="text-center">
                    <p className="text-sm text-mida-text-secondary">Last Run Status</p>
                    <p className={`font-semibold mt-1 ${lastRunStatus === 'Failed' ? 'text-mida-accent-red' : ''}`}>{lastRunStatus || 'N/A'}</p>
                </div>
                <button>
                    <Info className="w-8 h-8 p-1 bg-black rounded-full text-white"/>
                </button>
            </div>
        </div>
    </div>
  );
};

export default NewDiagnosticSession;