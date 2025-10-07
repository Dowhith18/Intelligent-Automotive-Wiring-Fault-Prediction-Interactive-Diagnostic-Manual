
export interface ECUModule {
  id: string;
  name: string;
  shortName: string;
  status: 'SUCCESS' | 'DTC_FOUND' | 'NO_RESPONSE';
  dtcCount: number;
}

export enum DTCStatus {
    CURRENT = 'Current',
    HEALED = 'Healed',
    HISTORY = 'History',
    PENDING = 'Pending',
}

export interface FreezeFrameData {
    parameter: string;
    value: string | number;
    unit: string;
}

export interface DTC {
    id: string;
    ecu: string;
    category: string;
    code: string;
    description: string;
    status: DTCStatus;
    freezeFrame: FreezeFrameData[];
}

export interface LiveData {
    odometer: number;
    batteryVoltage: number;
    vehicleSpeed: number;
    engineSpeed: number;
    ignitionCounter: number;
}
