# APPENDIX B
# INSTALLATION INSTRUCTIONS

---

## B.1 System Requirements

     The IAWFPIDM system requires specific hardware and software prerequisites for optimal performance. Ensure your system meets or exceeds these requirements before installation.

**Hardware Requirements**

     Minimum configuration includes processor with 2 cores at 2.0 GHz or higher, 4 GB RAM (8 GB recommended), 10 GB available disk space, and network interface card for internet connectivity. Recommended configuration includes processor with 4 cores at 2.5 GHz or higher, 8 GB RAM or more, 20 GB available disk space, and high-speed internet connection.

**Software Requirements**

     Operating system must be Windows 10/11, macOS 10.14 or later, or Linux (Ubuntu 18.04 or later). Python 3.7 or higher is required. Web browser must be Chrome 90+, Firefox 88+, Edge 90+, or Safari 14+. Additional requirements include pip package manager and virtual environment support.

**Network Requirements**

     Internet connection with minimum 5 Mbps download speed. Port 5000 must be available for Flask development server. Firewall configured to allow HTTP/HTTPS traffic.

## B.2 Prerequisites Installation

**Installing Python**

     Download Python installer from official website (python.org). For Windows, run installer executable and check "Add Python to PATH" option during installation. For macOS, use Homebrew package manager with command `brew install python3`. For Linux, use system package manager with command `sudo apt-get install python3 python3-pip`.

     Verify Python installation by opening terminal or command prompt and executing `python --version` or `python3 --version`. Output should display Python 3.7 or higher.

**Installing pip**

     pip typically installs automatically with Python. Verify pip installation with command `pip --version` or `pip3 --version`. If pip is not installed, download get-pip.py from pip.pypa.io and execute `python get-pip.py`.

**Installing Git**

     Download Git installer from git-scm.com. Run installer with default options. Verify installation with command `git --version`. Configure Git with your name and email using commands `git config --global user.name "Your Name"` and `git config --global user.email "your.email@example.com"`.

## B.3 Database Setup and Configuration

     The IAWFPIDM system uses JSON file-based storage for DTC codes and in-memory storage for user sessions. No external database installation is required for basic deployment.

     The DTC database file (dtc_data.json) contains over 6000 diagnostic codes. This file must be present in the application root directory. If the file is missing, run the scraper utility to regenerate the database.

     For production deployment with persistent user management, consider implementing MySQL or PostgreSQL database. Create database schema with tables for users, vehicles, diagnostic sessions, and faults. Update database connection configuration in application settings.

## B.4 Backend Installation Steps

**Step 1: Clone Repository**

     Open terminal or command prompt. Navigate to desired installation directory. Execute command `git clone https://github.com/Dowhith18/Intelligent-Automotive-Wiring-Fault-Prediction-Interactive-Diagnostic-Manual.git`. Navigate into cloned directory with `cd Intelligent-Automotive-Wiring-Fault-Prediction-Interactive-Diagnostic-Manual`.

**Step 2: Create Virtual Environment**

     For Windows PowerShell, execute `python -m venv venv` to create virtual environment. Activate with `.\venv\Scripts\activate`. For macOS/Linux, execute `python3 -m venv venv` to create virtual environment. Activate with `source venv/bin/activate`.

     Virtual environment activation changes command prompt to show (venv) prefix indicating active environment.

**Step 3: Install Dependencies**

     With virtual environment activated, execute `pip install -r requirements.txt` to install all required Python packages. Installation includes Flask 3.1.2, pandas 2.2.3, matplotlib 3.9.3, numpy 2.0.2, beautifulsoup4 4.14.2, and supporting libraries.

     For Windows users experiencing build failures with binary packages, use Conda environment instead. Execute `conda env create -f environment-windows.yml` followed by `conda activate iawfpidm`.

**Step 4: Verify Installation**

     Verify all packages installed correctly with command `pip list`. Check for Flask, pandas, matplotlib, numpy, and beautifulsoup4 in output list. If any packages are missing, install individually with `pip install package-name`.

## B.5 Frontend Installation Steps

     The IAWFPIDM system uses server-side rendering with Jinja2 templates. No separate frontend build process is required. Static assets (CSS, JavaScript, images) are served directly from the static directory.

     Verify static files are present in correct locations. CSS files should be in static/css/ directory. JavaScript files should be in static/js/ directory. Images and logos should be in static/ directory.

     For custom styling, modify CSS files in static/css/ directory. For custom functionality, modify JavaScript files in static/js/ directory. Changes take effect immediately without build process.

## B.6 Environment Variables Configuration

     Create configuration file named .flaskenv in application root directory. Add the following configuration variables:

     FLASK_APP=app.py specifies main application file. FLASK_ENV=development enables development mode with debug features. FLASK_DEBUG=1 enables debug mode with automatic reloading.

     For production deployment, change FLASK_ENV to production and set FLASK_DEBUG to 0. Configure secret key in app.py by replacing default value with secure random string. Generate secure key with Python command `import secrets; print(secrets.token_hex(16))`.

     Additional configuration options include SESSION_COOKIE_SECURE for HTTPS-only cookies, SESSION_COOKIE_HTTPONLY to prevent JavaScript access, and PERMANENT_SESSION_LIFETIME for session timeout duration.

## B.7 Running the Application

**Development Server**

     With virtual environment activated and in application root directory, execute `python app.py` to start Flask development server. Server starts on default port 5000. Console output displays startup messages and server URL.

     Open web browser and navigate to http://127.0.0.1:5000 or http://localhost:5000. Login page should display. Use default credentials to authenticate (admin/admin123, technician/tech123, or viewer/view123).

     Development server includes automatic reloading when code changes are detected. Save file modifications and server restarts automatically. Console displays reload messages.

     To stop server, press Ctrl+C in terminal window. Server shuts down gracefully and releases port 5000.

**Testing Installation**

     After starting server, verify all features function correctly. Test login with each user role. Navigate through all menu items. Upload sample CSV file for trip analysis. Search DTC database. View fault predictions on dashboard.

     Check console output for error messages. Address any warnings or errors before proceeding to production deployment.

## B.8 Deployment to Production Server

**Preparing for Production**

     Update secret key in app.py with secure random value. Change default user passwords or implement proper user database. Set FLASK_ENV to production in .flaskenv. Disable debug mode by setting FLASK_DEBUG to 0.

     Configure HTTPS with SSL/TLS certificates. Update session cookie settings for security. Implement CSRF protection for forms. Add rate limiting to prevent abuse.

**Deployment Options**

     For Vercel deployment, install Vercel CLI with `npm install -g vercel`. Execute `vercel` command in application root directory. Follow prompts to configure deployment. Vercel automatically detects Flask application and configures serverless deployment.

     For traditional server deployment, use production WSGI server such as Gunicorn or uWSGI. Install Gunicorn with `pip install gunicorn`. Run application with `gunicorn -w 4 -b 0.0.0.0:5000 app:app` where -w 4 specifies 4 worker processes.

     Configure reverse proxy with Nginx or Apache to handle HTTPS termination and static file serving. Set up process manager like systemd or supervisor to ensure application restarts after server reboot.

**Post-Deployment Verification**

     Access application via production URL. Verify HTTPS connection with valid certificate. Test all functionality in production environment. Monitor server logs for errors. Set up automated backups for data files. Configure monitoring and alerting for system health.

---

**End of Appendix B**
