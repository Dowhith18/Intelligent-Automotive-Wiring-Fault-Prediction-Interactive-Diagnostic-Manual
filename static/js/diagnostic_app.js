// Application Data
const AppData = {
  dtc_lookup_database: [],
  vehicle_data: {
    vin: "MA1NS2NVPR2D51667",
    model_code: "AS22XPNV5TP03D00ZY",
    model_description: "XUV300 HIGH_OPT_AXYLPRO_G_AT_ESP_TECHPACK_TGDI",
    odometer: 85,
    battery_voltage: 13.7,
    vehicle_speed: 0,
    engine_rpm: 867,
    engine_state: "Running",
    electrical_health_score: 73,
    ai_confidence: 0.89
  },
  ecu_modules: [
    {name: "EMSG12TGDI", status: "SUCCESS", fault_count: 0, ai_risk_score: 12},
    {name: "SMARTCORE", status: "DTC_FOUND", fault_count: 8, ai_risk_score: 76},
    {name: "TCU", status: "DTC_FOUND", fault_count: 5, ai_risk_score: 58},
    {name: "ESP", status: "DTC_FOUND", fault_count: 4, ai_risk_score: 72},
    {name: "SRS", status: "DTC_FOUND", fault_count: 10, ai_risk_score: 83}
  ],
  fault_predictions: [
    {
      fault_type: "Short Circuit",
      location: "Headlight Wiring Harness",
      probability: 0.78,
      severity: "High",
      estimated_time_to_failure: "2-3 weeks"
    },
    {
      fault_type: "Open Circuit",
      location: "Door Lock Actuator Circuit",
      probability: 0.65,
      severity: "Medium",
      estimated_time_to_failure: "1-2 months"
    }
  ]
};

// Application State
const AppState = {
  currentUser: null,
  currentPage: 'dashboard-page',
  currentVehicle: null,
  charts: {},
  updateInterval: null
};

// Application Controller
class DiagnosticApp {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateDashboard();
    this.startDataUpdates();
  }

  bindEvents() {
    // Vehicle page events
    const ocrBtn = document.getElementById('ocr-scan-btn');
    if (ocrBtn) ocrBtn.addEventListener('click', () => this.simulateOCRScan());
    
    const detectBtn = document.getElementById('detect-vehicle-btn');
    if (detectBtn) detectBtn.addEventListener('click', () => this.detectVehicle());
    
    const startBtn = document.getElementById('start-diagnostic-btn');
    if (startBtn) startBtn.addEventListener('click', () => this.startDiagnostic());

    // Dashboard events
    const refreshBtn = document.getElementById('refresh-data-btn');
    if (refreshBtn) refreshBtn.addEventListener('click', () => this.refreshData());
    
    const exportBtn = document.getElementById('export-report-btn');
    if (exportBtn) exportBtn.addEventListener('click', () => this.exportReport());
  }

  simulateOCRScan() {
    const vinInput = document.getElementById('vin-input');
    if (!vinInput) return;
    
    vinInput.value = 'Scanning...';
    vinInput.disabled = true;
    
    setTimeout(() => {
      vinInput.value = AppData.vehicle_data.vin;
      vinInput.disabled = false;
    }, 2000);
  }

  detectVehicle() {
    const vinInput = document.getElementById('vin-input');
    if (!vinInput) return;
    
    const vin = vinInput.value;
    if (!vin || vin.length !== 17) {
      alert('Please enter a valid 17-character VIN');
      return;
    }

    const modelEl = document.getElementById('vehicle-model');
    const vinEl = document.getElementById('vehicle-vin');
    const confidenceEl = document.getElementById('ai-confidence');
    const vehicleInfo = document.getElementById('vehicle-info');
    
    if (modelEl) modelEl.textContent = AppData.vehicle_data.model_description;
    if (vinEl) vinEl.textContent = vin;
    if (confidenceEl) confidenceEl.textContent = `${Math.round(AppData.vehicle_data.ai_confidence * 100)}%`;
    if (vehicleInfo) vehicleInfo.classList.remove('hidden');
    
    AppState.currentVehicle = { ...AppData.vehicle_data, vin };
  }

  startDiagnostic() {
    window.location.href = '/';
  }

  updateDashboard() {
    const elements = {
      'odometer-value': `${AppData.vehicle_data.odometer} km`,
      'battery-voltage': `${AppData.vehicle_data.battery_voltage}V`,
      'engine-rpm': AppData.vehicle_data.engine_rpm,
      'vehicle-speed': `${AppData.vehicle_data.vehicle_speed} km/h`,
      'engine-state': AppData.vehicle_data.engine_state,
      'electrical-health': `${AppData.vehicle_data.electrical_health_score}%`
    };

    Object.entries(elements).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });

    this.updateECUGrid();
    this.updatePredictions();
  }

  updateECUGrid() {
    const ecuGrid = document.getElementById('ecu-grid');
    if (!ecuGrid) return;
    
    ecuGrid.innerHTML = '';

    AppData.ecu_modules.forEach(ecu => {
      const ecuCard = document.createElement('div');
      ecuCard.className = `ecu-status-card ${this.getECUStatusClass(ecu.status)}`;
      ecuCard.innerHTML = `
        <h4>${ecu.name}</h4>
        <p>DTCs: ${ecu.fault_count}</p>
        <p>Risk: ${ecu.ai_risk_score}%</p>
      `;
      ecuGrid.appendChild(ecuCard);
    });
  }

  getECUStatusClass(status) {
    switch(status) {
      case 'SUCCESS': return 'status-success';
      case 'DTC_FOUND': return 'status-warning';
      default: return 'status-error';
    }
  }

  updatePredictions() {
    const predictionsList = document.getElementById('predictions-list');
    if (!predictionsList) return;
    
    predictionsList.innerHTML = '';

    AppData.fault_predictions.forEach(prediction => {
      const predCard = document.createElement('div');
      predCard.className = 'prediction-card';
      predCard.innerHTML = `
        <h4>${prediction.fault_type}</h4>
        <p><strong>Location:</strong> ${prediction.location}</p>
        <p><strong>Probability:</strong> ${Math.round(prediction.probability * 100)}%</p>
        <p><strong>Severity:</strong> <span class="severity-${prediction.severity.toLowerCase()}">${prediction.severity}</span></p>
        <p><strong>Time to Failure:</strong> ${prediction.estimated_time_to_failure}</p>
      `;
      predictionsList.appendChild(predCard);
    });
  }

  startDataUpdates() {
    AppState.updateInterval = setInterval(() => {
      this.simulateDataUpdates();
      this.updateDashboard();
    }, 3000);
  }

  stopDataUpdates() {
    if (AppState.updateInterval) {
      clearInterval(AppState.updateInterval);
      AppState.updateInterval = null;
    }
  }

  simulateDataUpdates() {
    AppData.vehicle_data.engine_rpm = 867 + Math.floor(Math.random() * 100 - 50);
    AppData.vehicle_data.battery_voltage = Math.round((13.7 + (Math.random() * 0.4 - 0.2)) * 10) / 10;
    AppData.vehicle_data.electrical_health_score = Math.max(70, Math.min(80, 73 + Math.floor(Math.random() * 10 - 5)));
  }

  refreshData() {
    const btn = document.getElementById('refresh-data-btn');
    if (!btn) return;
    
    btn.textContent = 'Refreshing...';
    btn.disabled = true;

    setTimeout(() => {
      this.updateDashboard();
      btn.textContent = 'Refresh Data';
      btn.disabled = false;
    }, 1500);
  }

  exportReport() {
    alert('Diagnostic report exported successfully!');
  }
}

// Global function for clearing DTCs
function clearDTCs() {
  if (confirm('Are you sure you want to clear all DTCs?')) {
    alert('DTCs cleared successfully!');
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.diagnosticApp = new DiagnosticApp();
});
