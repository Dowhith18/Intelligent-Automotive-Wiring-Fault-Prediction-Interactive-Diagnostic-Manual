import React, { useState, useEffect, FormEvent } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { decodeVin } from '../services/vinDecoderService';
import type { Vehicle } from '../types';
import Modal from './Modal';
import { Loader } from './icons';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleAdded: (vehicle: Omit<Vehicle, 'id' | 'status' | 'imageUrl' | 'lastService'>) => void;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose, onVehicleAdded }) => {
  const [vin, setVin] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [engine, setEngine] = useState('');
  
  const debouncedVin = useDebounce(vin, 500);
  
  const [isDecoding, setIsDecoding] = useState(false);
  const [vinError, setVinError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');

  const clearForm = () => {
    setVin('');
    setMake('');
    setModel('');
    setYear('');
    setEngine('');
    setVinError('');
    setSubmitSuccess('');
  };

  useEffect(() => {
    if (!isOpen) {
        // Clear form when modal is closed
        setTimeout(clearForm, 300); // Delay to allow for closing animation
    }
  }, [isOpen]);

  useEffect(() => {
    const handleVinDecode = async () => {
      if (debouncedVin.length !== 17) {
        setVinError(debouncedVin.length > 0 ? 'VIN must be 17 characters.' : '');
        return;
      }
      setIsDecoding(true);
      setVinError('');
      try {
        const details = await decodeVin(debouncedVin);
        setMake(details.make);
        setModel(details.model);
        setYear(details.year);
        setEngine(details.engine);
      } catch (error: any) {
        setVinError(error.message || 'Failed to decode VIN.');
      } finally {
        setIsDecoding(false);
      }
    };
    handleVinDecode();
  }, [debouncedVin]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (vin.length !== 17 || vinError) {
        setVinError('Please enter a valid 17-character VIN.');
        return;
    }
    setIsSubmitting(true);
    setSubmitSuccess('');
    
    // Simulate API call to save the vehicle
    setTimeout(() => {
        onVehicleAdded({ vin, make, model, year: Number(year), engine });
        setSubmitSuccess('Vehicle added successfully!');
        setIsSubmitting(false);
        setTimeout(() => {
             onClose();
        }, 1000);
    }, 500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Vehicle">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="vin" className="block text-sm font-medium text-dark-text-secondary">
            VIN (Vehicle Identification Number)
          </label>
          <div className="relative mt-1">
            <input
              id="vin"
              name="vin"
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              maxLength={17}
              required
              className="block w-full appearance-none rounded-md border border-dark-border bg-dark-bg px-3 py-2 placeholder-dark-text-secondary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm font-mono tracking-widest"
              placeholder="Enter 17-character VIN"
            />
             {isDecoding && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><Loader className="h-5 w-5 text-dark-text-secondary" /></div>}
          </div>
          {vinError && <p className="mt-2 text-sm text-red-500">{vinError}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label htmlFor="make" className="block text-sm font-medium text-dark-text-secondary">Make</label>
                <input id="make" type="text" value={make} onChange={e => setMake(e.target.value)} required className="mt-1 block w-full appearance-none rounded-md border border-dark-border bg-dark-bg px-3 py-2 placeholder-dark-text-secondary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm" />
            </div>
             <div>
                <label htmlFor="model" className="block text-sm font-medium text-dark-text-secondary">Model</label>
                <input id="model" type="text" value={model} onChange={e => setModel(e.target.value)} required className="mt-1 block w-full appearance-none rounded-md border border-dark-border bg-dark-bg px-3 py-2 placeholder-dark-text-secondary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm" />
            </div>
             <div>
                <label htmlFor="year" className="block text-sm font-medium text-dark-text-secondary">Year</label>
                <input id="year" type="number" value={year} onChange={e => setYear(parseInt(e.target.value) || '')} required className="mt-1 block w-full appearance-none rounded-md border border-dark-border bg-dark-bg px-3 py-2 placeholder-dark-text-secondary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm" />
            </div>
             <div>
                <label htmlFor="engine" className="block text-sm font-medium text-dark-text-secondary">Engine</label>
                <input id="engine" type="text" value={engine} onChange={e => setEngine(e.target.value)} required className="mt-1 block w-full appearance-none rounded-md border border-dark-border bg-dark-bg px-3 py-2 placeholder-dark-text-secondary shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm" />
            </div>
        </div>
        
        {submitSuccess && <p className="text-sm text-green-500 bg-green-500/10 p-2 rounded-md text-center">{submitSuccess}</p>}

        <div className="pt-4 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="bg-dark-surface py-2 px-4 border border-dark-border rounded-md shadow-sm text-sm font-medium text-dark-text-primary hover:bg-dark-border focus:outline-none">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isDecoding || !!vinError || vin.length !== 17}
            className="inline-flex justify-center rounded-md border border-transparent bg-primary-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-surface disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddVehicleModal;