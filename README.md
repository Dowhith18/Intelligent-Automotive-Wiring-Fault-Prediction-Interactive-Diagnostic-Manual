# Intelligent Automotive Wiring Fault Prediction & Interactive Diagnostic Manual

A comprehensive Flask-based web application for automotive diagnostics, featuring an interactive diagnostic trouble code (DTC) lookup system and intelligent fault prediction capabilities.

## 🚗 Features

- **Interactive DTC Lookup Database**: Search and browse thousands of diagnostic trouble codes
- **Detailed Diagnostic Information**: Step-by-step troubleshooting guides for each DTC
- **Vehicle Selection Interface**: Record vehicle information before starting diagnostics
- **User Authentication**: Role-based access control (Admin, Technician, Viewer)
- **Responsive Design**: Modern, user-friendly interface
- **Real-time Search**: Quick filtering and navigation through DTC codes
- **Comprehensive Coverage**: Supports multiple automotive systems:
  - Engine Management (P-codes)
  - Chassis/ABS (C-codes)
  - Body Control (B-codes)
  - Network/Communication (U-codes)

## 📋 Prerequisites

- Python 3.7 or higher
- pip (Python package installer)
- Virtual environment (recommended)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Dowhith18/Intelligent-Automotive-Wiring-Fault-Prediction-Interactive-Diagnostic-Manual.git
cd Intelligent-Automotive-Wiring-Fault-Prediction-Interactive-Diagnostic-Manual
```

### 2. Create and activate a virtual environment

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

## 🚀 Running the Application

### Local Development

1. Activate your virtual environment (if not already activated)
2. Run the Flask application:

```bash
python app.py
```

3. Open your web browser and navigate to:
```
http://127.0.0.1:5000
```

### Default Login Credentials

The application comes with three pre-configured users:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| technician | tech123 | Technician |
| viewer | view123 | Viewer |

**⚠️ Important**: Change these default credentials before deploying to production!

## 📁 Project Structure

```
├── app.py                              # Main Flask application
├── scraper.py                          # Web scraping utility for DTC data
├── requirements.txt                    # Python dependencies
├── dtc_data.json                       # DTC database (6000+ codes)
├── .flaskenv                           # Flask environment configuration
├── vercel.json                         # Vercel deployment configuration
├── static/                             # Static assets
│   ├── css/
│   │   ├── diagnostic_app.css         # Application styles
│   │   └── style.css                  # Additional styles
│   └── js/                            # JavaScript files
├── templates/                          # HTML templates
│   ├── index.html                     # Dashboard/home page
│   ├── login.html                     # Login page
│   ├── vehicle_selection.html         # Vehicle info capture
│   ├── dtc_lookup.html                # DTC database table
│   └── dtc_detail.html                # Individual DTC details
├── EMS_ECU/                            # EMS/ECU documentation files
└── combined_ems_ecu_documentation.html # Combined documentation
```

## 🔧 Configuration

### Flask Configuration

Edit `.flaskenv` to customize Flask settings:

```
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=1
```

### Secret Key

Update the secret key in `app.py` for production:

```python
app.secret_key = 'your-secret-key-change-this-in-production'
```

Generate a secure secret key:

```python
import secrets
print(secrets.token_hex(16))
```

## 📊 Features in Detail

### DTC Lookup Database

- **6000+ Diagnostic Codes**: Comprehensive coverage of automotive DTCs
- **Advanced Filtering**: Search by code, description, system, or severity
- **System Categories**: Organized by automotive system (Fuel, Ignition, Emissions, etc.)
- **Severity Ratings**: High, Medium, Low priority classification

### Diagnostic Workflow

1. **Login**: Authenticate with role-based credentials
2. **Vehicle Selection**: Enter VIN and vehicle details
3. **Dashboard**: Access quick search and navigation
4. **DTC Lookup**: Browse or search the complete DTC database
5. **Detailed Diagnostics**: View step-by-step troubleshooting guides

## 🌐 Deployment

### Vercel Deployment

This application is configured for Vercel deployment:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Production Considerations

- **Security**: Update secret keys and user credentials
- **Database**: Replace in-memory user dict with proper database
- **HTTPS**: Ensure SSL/TLS encryption
- **Environment Variables**: Use environment variables for sensitive data
- **Session Management**: Configure secure session cookies

## 🛡️ Security Notes

- Change default user credentials before production deployment
- Use environment variables for sensitive configuration
- Implement proper password hashing (currently using plain text)
- Add CSRF protection for forms
- Enable HTTPS in production
- Consider implementing session timeout

## 📦 Dependencies

- **Flask 3.1.2**: Web framework
- **beautifulsoup4 4.14.2**: HTML parsing for scraping
- **Jinja2 3.1.6**: Template engine
- **Werkzeug 3.1.3**: WSGI utility library

See `requirements.txt` for complete dependency list.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Dowhith18**
- GitHub: [@Dowhith18](https://github.com/Dowhith18)

## 🙏 Acknowledgments

- DTC data sourced from automotive diagnostic specifications
- Built with Flask and modern web technologies

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Note**: This is a development/educational project. For production automotive diagnostics, always refer to official manufacturer documentation and specifications.
