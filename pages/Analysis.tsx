import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { PredictedFault } from '../types';
import { getFaultPrediction } from '../services/geminiService';
import { ChevronDown, CheckCircle } from '../components/icons';

const loadingMessages = [
    "Processing vehicle symptoms...",
    "Cross-referencing DTC database...",
    "Analyzing historical repair data...",
    "Simulating fault scenarios...",
    "Compiling potential causes...",
    "Finalizing confidence scores...",
];

const LoadingSpinner: React.FC = () => {
    const [message, setMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % loadingMessages.length;
            setMessage(loadingMessages[index]);
        }, 1200);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <svg className="animate-spin -ml-1 mr-3 h-12 w-12 text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-dark-text-primary">Running AI Analysis...</h2>
            <p className="mt-2 text-md text-dark-text-secondary w-full max-w-md transition-opacity duration-300">{message}</p>
        </div>
    );
};


const Analysis: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<PredictedFault[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
    const { state: sessionData } = location;

    useEffect(() => {
        if (!sessionData) {
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
    }, [sessionData, navigate]);

    const handleToggle = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence > 0.8) return 'text-green-400';
        if (confidence > 0.5) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getConfidenceBgColor = (confidence: number) => {
        if (confidence > 0.8) return 'bg-green-500';
        if (confidence > 0.5) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>;
    }
    
    if (error) {
        return <div className="text-center text-accent-500">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark-text-primary tracking-tight">AI Fault Analysis Results</h1>
            <p className="mt-1 text-md text-dark-text-secondary">Based on the provided data, here are the most likely faults. The top result is expanded by default.</p>

            <div className="mt-8 space-y-4">
                {results.map((fault, index) => (
                    <div key={index} className="bg-dark-surface rounded-lg shadow overflow-hidden transition-all duration-300">
                        <button
                            className="w-full p-6 text-left flex justify-between items-center hover:bg-dark-border/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                            onClick={() => handleToggle(index)}
                            aria-expanded={expandedIndex === index}
                            aria-controls={`fault-details-${index}`}
                        >
                            <div className="flex-1 pr-4">
                                <h3 className="text-lg font-medium text-dark-text-primary">{fault.fault}</h3>
                                <div className="flex items-center mt-2">
                                    <span className={`text-sm font-bold w-24 ${getConfidenceColor(fault.confidence)}`}>
                                        {(fault.confidence * 100).toFixed(1)}% Conf.
                                    </span>
                                    <div className="w-40 h-2 bg-dark-border rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${getConfidenceBgColor(fault.confidence)} transition-all duration-500`}
                                            style={{ width: `${fault.confidence * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <ChevronDown className={`w-6 h-6 text-dark-text-secondary transition-transform duration-300 ${expandedIndex === index ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <div
                            id={`fault-details-${index}`}
                            className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedIndex === index ? 'max-h-96' : 'max-h-0'}`}
                        >
                            <div className="px-6 pb-6 border-t border-dark-border">
                                <p className="mt-4 text-sm text-dark-text-secondary">{fault.description}</p>
                                <h4 className="mt-6 text-md font-semibold text-dark-text-primary">Recommended Actions</h4>
                                <ul className="mt-2 space-y-2">
                                    {fault.recommendedActions.map((action, actionIndex) => (
                                        <li key={actionIndex} className="flex items-start text-sm text-dark-text-secondary">
                                            <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                                            <span>{action}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6">
                                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-700 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-dark-surface">
                                        Open Interactive Manual
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Analysis;