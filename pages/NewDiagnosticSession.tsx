
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_VEHICLES } from '../constants';

const NewDiagnosticSession: React.FC = () => {
  const navigate = useNavigate();
  const [vehicleId, setVehicleId] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [dtcs, setDtcs] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save this session data
    // and then navigate to the analysis page with the new session ID.
    // For this demo, we'll navigate with the submitted data.
    const sessionId = `SESS${Math.floor(Math.random() * 900) + 100}`;
    const sessionData = { vehicleId, symptoms, dtcs };
    navigate(`/app/diagnostics/${sessionId}/analysis`, { state: sessionData });
  };

  return (
    <div>
        <h1 className="text-3xl font-bold text-dark-text-primary tracking-tight">New Diagnostic Session</h1>
        <p className="mt-1 text-md text-dark-text-secondary">Start by providing preliminary information about the vehicle and its issues.</p>
        
        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl">
            <div className="space-y-8">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-dark-text-primary">1. Vehicle Information</h3>
                    <div className="mt-2">
                        <label htmlFor="vehicle" className="block text-sm font-medium text-dark-text-secondary">
                            Select Vehicle
                        </label>
                        <select
                            id="vehicle"
                            name="vehicle"
                            value={vehicleId}
                            onChange={(e) => setVehicleId(e.target.value)}
                            required
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-dark-surface border-dark-border focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                            <option value="" disabled>Select a vehicle</option>
                            {MOCK_VEHICLES.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.year} {v.make} {v.model} - ({v.vin.slice(-6)})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg leading-6 font-medium text-dark-text-primary">2. Describe Issues</h3>
                    <div className="mt-2">
                        <label htmlFor="symptoms" className="block text-sm font-medium text-dark-text-secondary">
                            Customer Complaints / Observed Symptoms
                        </label>
                        <textarea
                            id="symptoms"
                            name="symptoms"
                            rows={3}
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            required
                            placeholder="e.g., Rough idle, check engine light on, grinding noise on braking"
                            className="mt-1 block w-full shadow-sm sm:text-sm bg-dark-surface border-dark-border rounded-md focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="dtcs" className="block text-sm font-medium text-dark-text-secondary">
                            Diagnostic Trouble Codes (DTCs)
                        </label>
                        <input
                            type="text"
                            id="dtcs"
                            name="dtcs"
                            value={dtcs}
                            onChange={(e) => setDtcs(e.target.value)}
                            required
                            placeholder="e.g., P0300, P0171, U0100"
                            className="mt-1 block w-full shadow-sm sm:text-sm bg-dark-surface border-dark-border rounded-md focus:ring-primary-500 focus:border-primary-500"
                        />
                         <p className="mt-2 text-xs text-dark-text-secondary">Separate multiple codes with a comma.</p>
                    </div>
                </div>
                
                 <div>
                    <h3 className="text-lg leading-6 font-medium text-dark-text-primary">3. Upload Data</h3>
                     <p className="mt-1 text-sm text-dark-text-secondary">
                        (Optional) Upload diagnostic data files like OBD logs, oscilloscope readings, etc.
                    </p>
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dark-border border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-dark-text-secondary" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-dark-surface rounded-md font-medium text-primary-400 hover:text-primary-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                </label>
                                <p className="pl-1 text-dark-text-secondary">or drag and drop</p>
                            </div>
                            <p className="text-xs text-dark-text-secondary">LOG, CSV, PNG, JPG up to 10MB</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-5">
                <div className="flex justify-end">
                    <button type="button" className="bg-dark-surface py-2 px-4 border border-dark-border rounded-md shadow-sm text-sm font-medium text-dark-text-primary hover:bg-dark-border focus:outline-none">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 focus:ring-offset-dark-bg"
                    >
                        Begin AI Analysis
                    </button>
                </div>
            </div>
        </form>
    </div>
  );
};

export default NewDiagnosticSession;
