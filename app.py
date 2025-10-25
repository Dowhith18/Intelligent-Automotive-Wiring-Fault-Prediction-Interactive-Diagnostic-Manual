from flask import Flask, render_template, request, redirect, url_for, session
import json

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this-in-production'  # Change this to a random secret key

# Load the DTC data from the JSON file
with open('dtc_data.json', 'r') as f:
    dtc_data = json.load(f)
    # Also get a sorted list of all codes for the sidebar
    all_dtc_codes = sorted(list(dtc_data.keys()))

# Simple user database (in production, use a real database)
USERS = {
    'admin': {'password': 'admin123', 'role': 'admin'},
    'technician': {'password': 'tech123', 'role': 'technician'},
    'viewer': {'password': 'view123', 'role': 'viewer'}
}

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Handles user login."""
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        role = request.form.get('role')
        
        # Check credentials
        if username in USERS and USERS[username]['password'] == password:
            session['user'] = username
            session['role'] = USERS[username]['role']
            session['vehicle_selected'] = False  # Reset vehicle selection on new login
            return redirect(url_for('vehicle_selection'))
        else:
            return render_template('login.html', error='Invalid username or password')
    
    # If already logged in, redirect to vehicle selection
    if 'user' in session:
        return redirect(url_for('vehicle_selection'))
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    """Handles user logout."""
    session.pop('user', None)
    session.pop('role', None)
    session.pop('vehicle_selected', None)
    return redirect(url_for('login'))

@app.route('/')
def index():
    """Renders the home page with dashboard."""
    # Check if user is logged in
    if 'user' not in session:
        return redirect(url_for('login'))
    
    return render_template('index.html', dtc_codes=all_dtc_codes, user=session.get('user'), role=session.get('role'))

@app.route('/vehicle')
def vehicle_selection():
    """Renders the vehicle selection page."""
    if 'user' not in session:
        return redirect(url_for('login'))
    
    return render_template('vehicle_selection.html', dtc_codes=all_dtc_codes, user=session.get('user'), role=session.get('role'))

@app.route('/start-diagnostic', methods=['POST'])
def start_diagnostic():
    """Handles starting diagnostic after vehicle selection."""
    if 'user' not in session:
        return redirect(url_for('login'))
    
    # Mark vehicle as selected
    session['vehicle_selected'] = True
    
    # Optionally store vehicle info
    vehicle_info = request.get_json()
    if vehicle_info:
        session['vehicle_vin'] = vehicle_info.get('vin')
        session['vehicle_model'] = vehicle_info.get('model')
    
    return {'success': True, 'redirect': url_for('index')}

@app.route('/dtc-lookup')
def dtc_lookup():
    """Renders the DTC Lookup Database page."""
    if 'user' not in session:
        return redirect(url_for('login'))
    
    # Prepare DTC data for the lookup table
    dtc_list = []
    for code, data in dtc_data.items():
        # Extract description from section titles
        description = "Diagnostic Trouble Code"
        for key in data.keys():
            if any(word in key.upper() for word in ['MAF', 'TEMPERATURE', 'SIGNAL', 'SENSOR', 'PUMP', 'RELAY', 'VALVE', 'ENGINE', 'FUEL', 'CATALYST', 'INTAKE', 'EXHAUST']):
                description = key
                break
        
        # Determine system based on DTC code prefix
        system = "Engine Management"
        if code.startswith('P0'):
            system = "Fuel System" if code[2] in ['1', '2'] else "Air Intake System" if code[2] in ['0'] else "Emissions"
        elif code.startswith('P01'):
            system = "Fuel System"
        elif code.startswith('P02'):
            system = "Air Intake System"
        elif code.startswith('P03'):
            system = "Ignition System"
        elif code.startswith('P04'):
            system = "Emissions"
        elif code.startswith('P06'):
            system = "Fuel System"
        elif code.startswith('C'):
            system = "Chassis/ABS"
        elif code.startswith('B'):
            system = "Body Control"
        elif code.startswith('U'):
            system = "Network/Communication"
        
        # Assign severity based on code patterns
        severity = "Medium"
        if any(word in str(data).upper() for word in ['CRITICAL', 'SEVERE', 'ENGINE SHUTDOWN', 'CATALYST']):
            severity = "High"
        elif any(word in str(data).upper() for word in ['SENSOR', 'SIGNAL', 'CIRCUIT', 'RANGE']):
            severity = "Medium"
        else:
            severity = "Low"
        
        dtc_list.append({
            'code': code,
            'description': description,
            'system': system,
            'severity': severity
        })
    
    # Sort by code
    dtc_list.sort(key=lambda x: x['code'])
    
    return render_template('dtc_lookup.html', dtc_list=dtc_list, dtc_codes=all_dtc_codes, user=session.get('user'), role=session.get('role'))

@app.route('/dtc/<code>')
def dtc_detail(code):
    """Renders the details for a specific DTC code."""
    if 'user' not in session:
        return redirect(url_for('login'))
    
    data = dtc_data.get(code, {})
    # We pass the list of all codes here too, so the sidebar works
    return render_template('dtc_detail.html', code=code, data=data, dtc_codes=all_dtc_codes, user=session.get('user'), role=session.get('role'))

# Local development server
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)