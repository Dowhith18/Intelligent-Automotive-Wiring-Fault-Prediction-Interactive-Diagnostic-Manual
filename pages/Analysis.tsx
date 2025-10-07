
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { PredictedFault } from '../types';
import { getFaultPrediction } from '../services/geminiService';

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center text-center">
        <svg className="animate-spin -ml-1 mr-3 h-12 w-12 text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h2 className="mt-4 text-xl font-semibold text-dark-text-primary">Analyzing Diagnostic Data...</h2>
        <p className="mt-2 text-md text-dark-text-secondary">Our AI is processing symptoms, DTCs, and vehicle parameters to predict the most likely faults.</p>
    </div>
);

const Analysis: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<PredictedFault[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { state: sessionData } = location;

    useEffect(() => {
        if (!sessionData) {
            // If no session data, redirect to start a new session
            navigate('/app/diagnostics/new');
            return;
        }

        const runAnalysis = async () => {
            try {
                setLoading(true);
                const prediction = await getFaultPrediction(sessionData.symptoms, sessionData.dtcs);
                setResults(prediction);
            } catch (err) {
                setError("Failed to get analysis results. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        runAnalysis();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionData, navigate]);

    const getConfidenceColor = (confidence: number) => {
        if (confidence > 0.8) return 'text-green-400';
        if (confidence > 0.5) return 'text-yellow-400';
        return 'text-red-400';
    }

    if (loading) {
        return <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>;
    }
    
    if (error) {
        return <div className="text-center text-accent-500">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark-text-primary tracking-tight">AI Fault Analysis Results</h1>
            <p className="mt-1 text-md text-dark-text-secondary">Based on the provided data, here are the most likely faults.</p>

            <div className="mt-8 flow-root">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-dark-border sm:rounded-lg">
                            <table className="min-w-full divide-y divide-dark-border">
                                <thead className="bg-dark-surface">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Predicted Fault</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">Confidence</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-dark-surface divide-y divide-dark-border">
                                    {results.map((fault, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-dark-text-primary">{fault.fault}</div>
                                                <div className="text-sm text-dark-text-secondary">{fault.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-lg font-bold ${getConfidenceColor(fault.confidence)}`}>{(fault.confidence * 100).toFixed(1)}%</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-primary-400 hover:text-primary-300">View Interactive Manual</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-dark-surface p-6 rounded-lg shadow">
                 <h3 className="text-lg font-medium text-dark-text-primary">Next Steps</h3>
                 <p className="mt-2 text-sm text-dark-text-secondary">
                    Select a predicted fault to begin the step-by-step guided repair procedure using the interactive manual.
                 </p>
            </div>
        </div>
    );
};

export default Analysis;
