
import type { Vehicle, DiagnosticSession } from './types';
import { SessionStatus } from './types';

export const MOCK_VEHICLES: Vehicle[] = [
  { id: '1', vin: '1GKS19EU2F1234567', make: 'Ford', model: 'F-150', year: 2022, engine: '3.5L V6 EcoBoost', lastService: '2023-10-15', status: 'Operational', imageUrl: 'https://picsum.photos/seed/f150/400/300' },
  { id: '2', vin: '2GKS19EU2F1234568', make: 'Chevrolet', model: 'Silverado', year: 2021, engine: '5.3L V8', lastService: '2023-09-20', status: 'Needs Attention', imageUrl: 'https://picsum.photos/seed/silverado/400/300' },
  { id: '3', vin: '3GKS19EU2F1234569', make: 'RAM', model: '1500', year: 2023, engine: '5.7L V8 HEMI', lastService: '2023-11-01', status: 'In Service', imageUrl: 'https://picsum.photos/seed/ram1500/400/300' },
  { id: '4', vin: '4GKS19EU2F1234560', make: 'Toyota', model: 'Tacoma', year: 2020, engine: '3.5L V6', lastService: '2023-08-12', status: 'Operational', imageUrl: 'https://picsum.photos/seed/tacoma/400/300' },
  { id: '5', vin: '5GKS19EU2F1234561', make: 'GMC', model: 'Sierra', year: 2022, engine: '6.2L V8', lastService: '2023-10-25', status: 'Needs Attention', imageUrl: 'https://picsum.photos/seed/sierra/400/300' },
];

export const MOCK_SESSIONS: DiagnosticSession[] = [
  { id: 'SESS001', vehicleId: '3', vehicleName: '2023 RAM 1500', technician: 'John Doe', startDate: '2023-11-05', status: SessionStatus.IN_PROGRESS, symptoms: ['Rough Idle', 'Check Engine Light'], dtcs: ['P0300', 'P0171'] },
  { id: 'SESS002', vehicleId: '2', vehicleName: '2021 Chevrolet Silverado', technician: 'Jane Smith', startDate: '2023-11-04', status: SessionStatus.PENDING, symptoms: ['No Start', 'Electrical Smell'], dtcs: ['U0100'] },
  { id: 'SESS003', vehicleId: '5', vehicleName: '2022 GMC Sierra', technician: 'Mike Ross', startDate: '2023-11-02', status: SessionStatus.COMPLETE, symptoms: ['Transmission Slipping'], dtcs: ['P0700', 'P0730'] },
];
