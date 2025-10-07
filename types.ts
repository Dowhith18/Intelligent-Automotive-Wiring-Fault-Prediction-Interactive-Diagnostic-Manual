
export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  lastService: string;
  status: 'Operational' | 'Needs Attention' | 'In Service';
  imageUrl: string;
}

export enum SessionStatus {
  PENDING = 'Pending Analysis',
  ANALYZING = 'Analyzing',
  COMPLETE = 'Completed',
  IN_PROGRESS = 'In Progress',
}

export interface DiagnosticSession {
  id: string;
  vehicleId: string;
  vehicleName: string;
  technician: string;
  startDate: string;
  status: SessionStatus;
  symptoms: string[];
  dtcs: string[];
}

export interface PredictedFault {
    fault: string;
    description: string;
    confidence: number;
    recommendedActions: string[];
}
