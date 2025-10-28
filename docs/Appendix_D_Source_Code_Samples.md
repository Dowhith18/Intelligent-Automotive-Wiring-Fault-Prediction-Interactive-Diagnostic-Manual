# APPENDIX D
# SOURCE CODE SAMPLES

---

## D.1 Authentication Module

**User Authentication Implementation**

```python
# app.py - User authentication and session management

from flask import Flask, render_template, request, redirect, url_for, session, flash
from functools import wraps

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this-in-production'

# In-memory user database (replace with proper database in production)
users = {
    'admin': {'password': 'admin123', 'role': 'Admin'},
    'technician': {'password': 'tech123', 'role': 'Technician'},
    'viewer': {'password': 'view123', 'role': 'Viewer'}
}

def login_required(f):
    """Decorator to require login for protected routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'username' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def role_required(allowed_roles):
    """Decorator to require specific role for route access"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'username' not in session:
                flash('Please log in to access this page.', 'warning')
                return redirect(url_for('login'))
            
            user_role = session.get('role')
            if user_role not in allowed_roles:
                flash('You do not have permission to access this page.', 'danger')
                return redirect(url_for('index'))
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Handle user login"""
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Validate credentials
        if username in users and users[username]['password'] == password:
            session['username'] = username
            session['role'] = users[username]['role']
            flash(f'Welcome, {username}!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid username or password.', 'danger')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    """Handle user logout"""
    username = session.get('username')
    session.clear()
    flash(f'Goodbye, {username}!', 'info')
    return redirect(url_for('login'))
```

## D.2 Data Processing Module

**CSV Trip Data Processing**

```python
# app.py - Trip data analysis and processing

import pandas as pd
import numpy as np
from datetime import datetime

def process_trip_data(csv_file):
    """Process uploaded CSV trip data and calculate statistics"""
    try:
        # Read CSV file into DataFrame
        df = pd.read_csv(csv_file)
        
        # Validate required columns
        required_columns = ['timestamp', 'rpm', 'speed', 'throttle']
        if not all(col in df.columns for col in required_columns):
            raise ValueError('Missing required columns in CSV file')
        
        # Clean and transform data
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
        df = df.dropna()
        
        # Calculate trip statistics
        stats = {
            'total_distance': calculate_distance(df),
            'trip_duration': calculate_duration(df),
            'avg_speed': df['speed'].mean(),
            'max_speed': df['speed'].max(),
            'avg_rpm': df['rpm'].mean(),
            'max_rpm': df['rpm'].max(),
            'fuel_efficiency': estimate_fuel_efficiency(df)
        }
        
        return df, stats
    
    except Exception as e:
        raise ValueError(f'Error processing trip data: {str(e)}')

def calculate_distance(df):
    """Calculate total distance traveled in kilometers"""
    # Convert speed from km/h to km per time interval
    time_diff = df['timestamp'].diff().dt.total_seconds() / 3600  # hours
    distance = (df['speed'] * time_diff).sum()
    return round(distance, 2)

def calculate_duration(df):
    """Calculate trip duration in minutes"""
    duration = (df['timestamp'].max() - df['timestamp'].min()).total_seconds() / 60
    return round(duration, 2)

def estimate_fuel_efficiency(df):
    """Estimate fuel efficiency based on speed and throttle"""
    # Simplified fuel efficiency calculation
    avg_throttle = df['throttle'].mean()
    avg_speed = df['speed'].mean()
    
    # Basic estimation formula (adjust based on vehicle characteristics)
    if avg_speed > 0:
        efficiency = (avg_speed / (avg_throttle + 1)) * 10
        return round(efficiency, 2)
    return 0.0

def calculate_acceleration(df):
    """Calculate acceleration from speed data"""
    # Calculate speed difference and time difference
    speed_diff = df['speed'].diff()
    time_diff = df['timestamp'].diff().dt.total_seconds()
    
    # Acceleration = change in speed / change in time
    acceleration = speed_diff / time_diff
    df['acceleration'] = acceleration.fillna(0)
    
    return df
```

## D.3 Machine Learning Model

**Fault Prediction Logic**

```python
# static/js/diagnostic_app.js - Fault prediction implementation

class FaultPredictor {
    constructor() {
        this.thresholds = {
            fuelPumpVoltage: { min: 11.5, max: 14.5 },
            injectorResistance: { min: 11.0, max: 16.0 },
            sensorVoltage: { min: 0.5, max: 4.5 },
            batteryVoltage: { min: 12.0, max: 14.8 }
        };
    }
    
    predictFaults(sensorData) {
        const faults = [];
        
        // Fuel Pump Relay Circuit Analysis
        if (sensorData.fuelPumpVoltage < this.thresholds.fuelPumpVoltage.min) {
            faults.push({
                dtcCode: 'P062700',
                component: 'Fuel Pump Relay Control Circuit',
                faultType: 'Open Circuit',
                severity: 'High',
                confidence: this.calculateConfidence(sensorData.fuelPumpVoltage, 
                    this.thresholds.fuelPumpVoltage.min),
                impact: 'Engine will not start or will stall',
                recommendation: 'Check relay connections and wiring harness'
            });
        }
        
        // Fuel Injector Circuit Analysis
        if (sensorData.injectorResistance < this.thresholds.injectorResistance.min) {
            faults.push({
                dtcCode: 'P026100',
                component: 'Fuel Injector 1 Control Circuit',
                faultType: 'Short to Ground',
                severity: 'High',
                confidence: this.calculateConfidence(sensorData.injectorResistance,
                    this.thresholds.injectorResistance.min),
                impact: 'Cylinder 1 misfire, rough idle, reduced power',
                recommendation: 'Inspect injector wiring for damage or shorts'
            });
        }
        
        return faults;
    }
    
    calculateConfidence(value, threshold) {
        // Calculate confidence score based on deviation from threshold
        const deviation = Math.abs(value - threshold);
        const maxDeviation = threshold * 0.5;
        const confidence = Math.max(0, Math.min(100, 
            (1 - deviation / maxDeviation) * 100));
        return Math.round(confidence);
    }
    
    classifyFaultType(voltage, resistance) {
        if (voltage < 0.5) return 'Open Circuit';
        if (voltage > 4.5) return 'Short to Power';
        if (resistance < 1.0) return 'Short to Ground';
        if (resistance > 100) return 'Open Circuit';
        return 'Intermittent Fault';
    }
}

// Initialize fault predictor
const predictor = new FaultPredictor();

// Simulate sensor data (replace with actual OBD-II data in production)
function getSensorData() {
    return {
        fuelPumpVoltage: 10.2,  // Below threshold - indicates open circuit
        injectorResistance: 8.5, // Below threshold - indicates short to ground
        sensorVoltage: 2.5,
        batteryVoltage: 13.8
    };
}

// Update fault predictions
function updateFaultPredictions() {
    const sensorData = getSensorData();
    const faults = predictor.predictFaults(sensorData);
    displayFaults(faults);
}

function displayFaults(faults) {
    const container = document.getElementById('fault-predictions');
    container.innerHTML = '';
    
    faults.forEach(fault => {
        const faultCard = createFaultCard(fault);
        container.appendChild(faultCard);
    });
}

function createFaultCard(fault) {
    const card = document.createElement('div');
    card.className = `fault-card severity-${fault.severity.toLowerCase()}`;
    card.innerHTML = `
        <div class="fault-header">
            <span class="dtc-code">${fault.dtcCode}</span>
            <span class="severity-badge">${fault.severity}</span>
        </div>
        <div class="fault-body">
            <h4>${fault.component}</h4>
            <p><strong>Fault Type:</strong> ${fault.faultType}</p>
            <p><strong>Confidence:</strong> ${fault.confidence}%</p>
            <p><strong>Impact:</strong> ${fault.impact}</p>
            <p><strong>Recommendation:</strong> ${fault.recommendation}</p>
        </div>
    `;
    return card;
}
```

## D.4 Flask API Endpoints

**RESTful Route Handlers**

```python
# app.py - Flask route definitions

@app.route('/')
@login_required
def index():
    """Dashboard home page with fault predictions"""
    return render_template('index.html', 
                         username=session.get('username'),
                         role=session.get('role'))

@app.route('/vehicle-selection', methods=['GET', 'POST'])
@login_required
def vehicle_selection():
    """Vehicle information capture"""
    if request.method == 'POST':
        vin = request.form.get('vin')
        make = request.form.get('make')
        model = request.form.get('model')
        year = request.form.get('year')
        
        # Store vehicle info in session
        session['vehicle'] = {
            'vin': vin,
            'make': make,
            'model': model,
            'year': year
        }
        
        flash('Vehicle information saved successfully.', 'success')
        return redirect(url_for('index'))
    
    return render_template('vehicle_selection.html')

@app.route('/dtc-lookup')
@login_required
def dtc_lookup():
    """DTC database lookup page"""
    # Load DTC data from JSON file
    with open('dtc_data.json', 'r') as f:
        dtc_data = json.load(f)
    
    # Apply filters if provided
    search_query = request.args.get('search', '')
    system_filter = request.args.get('system', '')
    severity_filter = request.args.get('severity', '')
    
    filtered_data = filter_dtc_data(dtc_data, search_query, 
                                   system_filter, severity_filter)
    
    return render_template('dtc_lookup.html', 
                         dtc_codes=filtered_data,
                         search_query=search_query)

@app.route('/dtc/<code>')
@login_required
def dtc_detail(code):
    """Individual DTC detail page"""
    with open('dtc_data.json', 'r') as f:
        dtc_data = json.load(f)
    
    # Find specific DTC code
    dtc_info = next((item for item in dtc_data if item['code'] == code), None)
    
    if dtc_info is None:
        flash('DTC code not found.', 'warning')
        return redirect(url_for('dtc_lookup'))
    
    return render_template('dtc_detail.html', dtc=dtc_info)

@app.route('/analysis', methods=['GET', 'POST'])
@login_required
def analysis():
    """Trip data analysis page"""
    if request.method == 'POST':
        if 'csv_file' not in request.files:
            flash('No file uploaded.', 'danger')
            return redirect(request.url)
        
        file = request.files['csv_file']
        
        if file.filename == '':
            flash('No file selected.', 'danger')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            try:
                df, stats = process_trip_data(file)
                charts = generate_charts(df)
                
                return render_template('trip_dashboard.html',
                                     stats=stats,
                                     charts=charts)
            except Exception as e:
                flash(f'Error processing file: {str(e)}', 'danger')
                return redirect(request.url)
    
    return render_template('analysis.html')

def filter_dtc_data(data, search, system, severity):
    """Filter DTC data based on search criteria"""
    filtered = data
    
    if search:
        search_lower = search.lower()
        filtered = [item for item in filtered 
                   if search_lower in item['code'].lower() 
                   or search_lower in item['description'].lower()]
    
    if system:
        filtered = [item for item in filtered 
                   if item.get('system') == system]
    
    if severity:
        filtered = [item for item in filtered 
                   if item.get('severity') == severity]
    
    return filtered

def allowed_file(filename):
    """Check if uploaded file has allowed extension"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() == 'csv'
```

## D.5 Frontend Components

**Responsive Dashboard Layout**

```html
<!-- templates/base.html - Base template with navigation -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}IAWFPIDM{% endblock %}</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
    {% block extra_css %}{% endblock %}
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">
            <img src="{{ url_for('static', filename='logo.png') }}" alt="Logo">
            <span>IAWFPIDM</span>
        </div>
        
        <ul class="nav-menu">
            <li><a href="{{ url_for('index') }}">Dashboard</a></li>
            <li><a href="{{ url_for('dtc_lookup') }}">DTC Lookup</a></li>
            <li><a href="{{ url_for('analysis') }}">Trip Analysis</a></li>
            <li><a href="{{ url_for('vehicle_selection') }}">Vehicle Info</a></li>
        </ul>
        
        <div class="nav-user">
            <span>{{ session.username }} ({{ session.role }})</span>
            <a href="{{ url_for('logout') }}" class="btn-logout">Logout</a>
        </div>
    </nav>
    
    <main class="container">
        {% with messages = get_flashed_messages(with_categories=true) %}
            {% if messages %}
                {% for category, message in messages %}
                    <div class="alert alert-{{ category }}">{{ message }}</div>
                {% endfor %}
            {% endif %}
        {% endwith %}
        
        {% block content %}{% endblock %}
    </main>
    
    <footer>
        <p>&copy; 2024 IAWFPIDM. All rights reserved.</p>
    </footer>
    
    <script src="{{ url_for('static', filename='js/diagnostic_app.js') }}"></script>
    {% block extra_js %}{% endblock %}
</body>
</html>
```

## D.6 Database Operations

**DTC Data Management**

```python
# scraper.py - Web scraping utility for DTC data collection

import requests
from bs4 import BeautifulSoup
import json
import time

class DTCScraper:
    def __init__(self):
        self.base_url = 'https://example-dtc-database.com'
        self.dtc_data = []
    
    def scrape_dtc_codes(self):
        """Scrape DTC codes from online database"""
        code_prefixes = ['P0', 'P1', 'P2', 'P3', 'C0', 'C1', 'B0', 'B1', 'U0', 'U1']
        
        for prefix in code_prefixes:
            print(f'Scraping codes starting with {prefix}...')
            self.scrape_prefix(prefix)
            time.sleep(1)  # Rate limiting
        
        self.save_to_json()
    
    def scrape_prefix(self, prefix):
        """Scrape all codes with given prefix"""
        url = f'{self.base_url}/codes/{prefix}'
        
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            code_elements = soup.find_all('div', class_='dtc-code')
            
            for element in code_elements:
                code_data = self.extract_code_data(element)
                if code_data:
                    self.dtc_data.append(code_data)
        
        except Exception as e:
            print(f'Error scraping {prefix}: {str(e)}')
    
    def extract_code_data(self, element):
        """Extract DTC code information from HTML element"""
        try:
            code = element.find('span', class_='code').text.strip()
            description = element.find('p', class_='description').text.strip()
            system = element.find('span', class_='system').text.strip()
            severity = element.find('span', class_='severity').text.strip()
            
            return {
                'code': code,
                'description': description,
                'system': system,
                'severity': severity
            }
        except Exception as e:
            print(f'Error extracting code data: {str(e)}')
            return None
    
    def save_to_json(self):
        """Save scraped data to JSON file"""
        with open('dtc_data.json', 'w') as f:
            json.dump(self.dtc_data, f, indent=2)
        
        print(f'Saved {len(self.dtc_data)} DTC codes to dtc_data.json')

if __name__ == '__main__':
    scraper = DTCScraper()
    scraper.scrape_dtc_codes()
```

---

**End of Appendix D**
