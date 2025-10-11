from flask import Flask, render_template
import json

app = Flask(__name__)

# Load the DTC data from the JSON file
with open('dtc_data.json', 'r') as f:
    dtc_data = json.load(f)
    # Also get a sorted list of all codes for the sidebar
    all_dtc_codes = sorted(list(dtc_data.keys()))

@app.route('/')
def index():
    """Renders the home page."""
    return render_template('index.html', dtc_codes=all_dtc_codes)

@app.route('/dtc/<code>')
def dtc_detail(code):
    """Renders the details for a specific DTC code."""
    data = dtc_data.get(code, {})
    # We pass the list of all codes here too, so the sidebar works
    return render_template('dtc_detail.html', code=code, data=data, dtc_codes=all_dtc_codes)

if __name__ == '__main__':
    app.run(debug=True)