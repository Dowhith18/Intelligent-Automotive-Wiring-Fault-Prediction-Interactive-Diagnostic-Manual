import type { ECUModule, DTC, LiveData } from './types';
import { DTCStatus } from './types';

export const MOCK_ECUS: ECUModule[] = [
    { id: 'ems', name: 'Engine Management System', shortName: 'EMS', status: 'SUCCESS', dtcCount: 0 },
    { id: 'ism_artc', name: 'Intelligent Shift Module', shortName: 'IS_SM ARTC', status: 'DTC_FOUND', dtcCount: 8 },
    { id: 'tcu', name: 'Transmission Control Unit', shortName: 'TCU', status: 'DTC_FOUND', dtcCount: 5 },
    { id: 'esp', name: 'Electronic Stability Program', shortName: 'ESP', status: 'DTC_FOUND', dtcCount: 4 },
    { id: 'pke', name: 'Passive Keyless Entry', shortName: 'PKE', status: 'DTC_FOUND', dtcCount: 6 },
    { id: 'escl', name: 'Electronic Steering Column Lock', shortName: 'ESCL', status: 'DTC_FOUND', dtcCount: 1 },
    { id: 'srs', name: 'Supplemental Restraint System', shortName: 'SRS', status: 'DTC_FOUND', dtcCount: 10 },
    { id: 'mbfm', name: 'Multi-Function Body Module', shortName: 'MBFM', status: 'DTC_FOUND', dtcCount: 10 },
    { id: 'fcm', name: 'Front Control Module', shortName: 'FCM', status: 'DTC_FOUND', dtcCount: 8 },
    { id: 'frm', name: 'Footwell Module', shortName: 'FRM', status: 'DTC_FOUND', dtcCount: 7 },
    { id: 'svs', name: 'Surround View System', shortName: 'SVS', status: 'DTC_FOUND', dtcCount: 7 },
    { id: 'eps', name: 'Electric Power Steering', shortName: 'EPS', status: 'DTC_FOUND', dtcCount: 1 },
    { id: 'wlc', name: 'Wireless Charging', shortName: 'WLC', status: 'DTC_FOUND', dtcCount: 7 },
    { id: 'mgm', name: 'Media Gateway Module', shortName: 'MGM', status: 'DTC_FOUND', dtcCount: 2 },
    { id: 'datc', name: 'Digital Auto Temp Control', shortName: 'DATC', status: 'DTC_FOUND', dtcCount: 11 },
];

export const MOCK_LIVE_DATA: LiveData = {
    odometer: 85,
    batteryVoltage: 13.7,
    vehicleSpeed: 0,
    engineSpeed: 867,
    ignitionCounter: 276
};

export const MOCK_DTCS: DTC[] = [
    {
        id: '1',
        ecu: 'SMARTCORE',
        category: 'Communication',
        code: 'U130100',
        description: 'IS VIN Mismatch',
        status: DTCStatus.CURRENT,
        freezeFrame: [
            { parameter: 'Vehicle Speed', value: 0, unit: 'Kmph' },
            { parameter: 'Battery voltage', value: 13.3, unit: 'V' },
            { parameter: 'Engine state', value: 'Engine Running', unit: '' },
        ]
    },
    {
        id: '2',
        ecu: 'SMARTCORE',
        category: 'Body',
        code: 'B102100',
        description: 'MIC communication failure',
        status: DTCStatus.CURRENT,
        freezeFrame: [
            { parameter: 'Vehicle Speed', value: 0, unit: 'Kmph' },
            { parameter: 'Battery voltage', value: 13.3, unit: 'V' },
        ]
    },
    {
        id: '3',
        ecu: 'TCU',
        category: 'Communication',
        code: 'U110100',
        description: 'CAN EMS Node Absent',
        status: DTCStatus.HEALED,
        freezeFrame: [
            { parameter: 'Frequency Counter', value: 1, unit: 'Count' },
            { parameter: 'Global real time', value: 0, unit: '' },
        ]
    },
    {
        id: '4',
        ecu: 'ESP',
        category: 'Chassis',
        code: 'C001900',
        description: 'IIS Sensor Calibration Error (Integrated Yaw rate sensor)',
        status: DTCStatus.PENDING,
        freezeFrame: [
            { parameter: 'Frequency Counter', value: 2, unit: 'Count' },
            { parameter: 'Vehicle speed', value: 0, unit: 'Kmph' },
            { parameter: 'Battery voltage', value: 13.6, unit: 'V' },
            { parameter: 'Odometer', value: 85, unit: 'Km' },
        ]
    },
    {
        id: '5',
        ecu: 'FCM',
        category: 'Communication',
        code: 'U272000',
        description: 'IEB1_FD_10(tx13B) Message Content Failure',
        status: DTCStatus.HISTORY,
        freezeFrame: [
            { parameter: 'Operational Cycle Counter', value: 1, unit: 'Count' },
            { parameter: 'Ignition Cycle Counter', value: 1, unit: 'Count' },
        ]
    }
];
