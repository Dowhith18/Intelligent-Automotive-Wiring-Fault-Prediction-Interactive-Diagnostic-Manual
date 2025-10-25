from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import json
import os
from werkzeug.utils import secure_filename
from analysis import generate_dashboard
import uuid

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this-in-production'  # Change this to a random secret key

# Upload configuration
UPLOAD_FOLDER = 'uploads'
DEMO_FOLDER = os.path.join('instance', 'demo')
ALLOWED_EXTENSIONS = {'csv'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create upload and demo folders if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(DEMO_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Load the DTC data from the JSON file
with open('dtc_data.json', 'r', encoding='utf-8') as f:
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

@app.route('/analysis')
def analysis():
    """Renders the analysis and statistics page."""
    if 'user' not in session:
        return redirect(url_for('login'))
    
    # Calculate statistics for analysis page
    total_dtcs = len(dtc_data)
    
    # Count DTCs by system
    system_counts = {
        'Fuel System': 0,
        'Air Intake': 0,
        'Ignition': 0,
        'Emissions': 0,
        'Chassis/ABS': 0,
        'Body Control': 0,
        'Network': 0,
        'Other': 0
    }
    
    severity_counts = {'High': 0, 'Medium': 0, 'Low': 0}
    
    for code in dtc_data.keys():
        # Categorize by system
        if code.startswith('P00') or code.startswith('P01') or code.startswith('P06'):
            system_counts['Fuel System'] += 1
        elif code.startswith('P02'):
            system_counts['Air Intake'] += 1
        elif code.startswith('P03'):
            system_counts['Ignition'] += 1
        elif code.startswith('P04'):
            system_counts['Emissions'] += 1
        elif code.startswith('C'):
            system_counts['Chassis/ABS'] += 1
        elif code.startswith('B'):
            system_counts['Body Control'] += 1
        elif code.startswith('U'):
            system_counts['Network'] += 1
        else:
            system_counts['Other'] += 1
        
        # Assign severity (simplified logic)
        data_str = str(dtc_data[code])
        if any(word in data_str.upper() for word in ['CRITICAL', 'SEVERE', 'CATALYST']):
            severity_counts['High'] += 1
        elif any(word in data_str.upper() for word in ['SENSOR', 'SIGNAL', 'CIRCUIT']):
            severity_counts['Medium'] += 1
        else:
            severity_counts['Low'] += 1
    
    stats = {
        'total_dtcs': total_dtcs,
        'system_counts': system_counts,
        'severity_counts': severity_counts
    }
    
    return render_template('analysis.html', stats=stats, dtc_codes=all_dtc_codes, user=session.get('user'), role=session.get('role'))

@app.route('/upload-diagnostic-data', methods=['POST'])
def upload_diagnostic_data():
    """Handles CSV file uploads for diagnostic data analysis."""
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    if 'csv_files' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    files = request.files.getlist('csv_files')
    uploaded_files = []
    trip_data = None
    
    for file in files:
        if file and file.filename and allowed_file(file.filename):
            # Generate unique filename
            unique_id = str(uuid.uuid4())
            filename = f"{unique_id}_{secure_filename(file.filename)}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            uploaded_files.append(filename)
            
            # Try to analyze the first file for trip data
            if trip_data is None:
                try:
                    trip_data = generate_dashboard(filepath)
                except Exception as e:
                    print(f"Error analyzing trip data: {e}")
    
    if not uploaded_files:
        return jsonify({'error': 'No valid CSV files uploaded'}), 400
    
    response = {
        'success': True,
        'message': f'Successfully uploaded {len(uploaded_files)} file(s)',
        'files': uploaded_files
    }
    
    if trip_data:
        response['trip_data'] = trip_data
    
    return jsonify(response)

@app.route('/load-demo-data/<demo_type>')
def load_demo_data(demo_type):
    """Loads demo diagnostic data for analysis."""
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    demo_files = {
        'highway': 'phoenix-to-tempe.csv',
        'city': 'grocery-run.csv',
        'idling': 'idling-20.csv'
    }
    
    demo_file = demo_files.get(demo_type)
    if not demo_file:
        return jsonify({'error': 'Invalid demo type'}), 400
    
    demo_path = os.path.join(DEMO_FOLDER, demo_file)
    
    if not os.path.exists(demo_path):
        return jsonify({'error': f'Demo file not found: {demo_file}'}), 404
    
    try:
        trip_data = generate_dashboard(demo_path)
        return jsonify({
            'success': True, 
            'data': {
                'name': demo_type.capitalize() + ' Demo',
                'trip_info': trip_data['trip_info'],
                'has_charts': True
            }
        })
    except Exception as e:
        return jsonify({'error': f'Failed to analyze demo data: {str(e)}'}), 500

@app.route('/trip-dashboard/<trip_id>')
def trip_dashboard(trip_id):
    """Renders the OBD-II trip analysis dashboard."""
    if 'user' not in session:
        return redirect(url_for('login'))
    
    # Check for demo files first
    demo_files = {
        'highway': 'phoenix-to-tempe.csv',
        'city': 'grocery-run.csv',
        'idling': 'idling-20.csv'
    }
    
    if trip_id in demo_files:
        csv_path = os.path.join(DEMO_FOLDER, demo_files[trip_id])
    else:
        csv_path = os.path.join(app.config['UPLOAD_FOLDER'], trip_id)
    
    if not os.path.exists(csv_path):
        return "Trip data not found", 404
    
    try:
        trip_data = generate_dashboard(csv_path)
        return render_template('trip_dashboard.html', 
                             trip_data=trip_data, 
                             dtc_codes=all_dtc_codes, 
                             user=session.get('user'), 
                             role=session.get('role'))
    except Exception as e:
        return f"Error generating dashboard: {str(e)}", 500

# Local development server
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)