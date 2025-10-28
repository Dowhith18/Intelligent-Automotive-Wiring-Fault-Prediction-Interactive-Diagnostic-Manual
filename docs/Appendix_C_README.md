# APPENDIX C
# README

---

## C.1 Project Overview

     The Intelligent Automotive Wiring Fault Prediction & Interactive Diagnostic Manual (IAWFPIDM) is a comprehensive Flask-based web application designed for automotive diagnostics. The system combines traditional diagnostic trouble code lookup with intelligent fault prediction capabilities to assist automotive technicians in identifying and resolving vehicle electrical and wiring issues.

     The application provides real-time analysis of engine sensors and wiring faults, interactive diagnostic manual with over 6000 DTC codes, vehicle dashboard with six key metrics, OBD-II trip analysis with data visualization, and role-based user authentication system.

     Primary objectives include reducing diagnostic time through intelligent fault prediction, providing comprehensive troubleshooting guidance, enabling data-driven maintenance decisions, and improving diagnostic accuracy through machine learning techniques.

## C.2 Technology Stack

**Backend Technologies**

     Flask 3.1.2 serves as the web framework providing routing, request handling, and template rendering. Python 3.7+ is the core programming language. Jinja2 3.1.6 handles server-side template rendering. Werkzeug 3.1.3 provides WSGI utilities and security functions.

**Data Processing Libraries**

     pandas 2.2.3 enables data manipulation and analysis for trip data processing. numpy 2.0.2 provides numerical computing capabilities for statistical calculations. matplotlib 3.9.3 generates charts and visualizations for trip analysis reports.

**Web Scraping Tools**

     beautifulsoup4 4.14.2 parses HTML for DTC data extraction. requests library handles HTTP requests for web scraping operations.

**Frontend Technologies**

     HTML5 provides semantic markup structure. CSS3 enables responsive styling and animations. JavaScript handles client-side interactivity and dynamic content updates. Bootstrap framework (optional) provides responsive grid system and UI components.

**Data Storage**

     JSON file format stores DTC database (dtc_data.json). In-memory Python dictionaries manage user sessions. File system storage handles uploaded CSV files and generated charts.

## C.3 Directory Structure

```
Intelligent-Automotive-Wiring-Fault-Prediction-Interactive-Diagnostic-Manual/
│
├── app.py                              # Main Flask application entry point
├── scraper.py                          # Web scraping utility for DTC data
├── requirements.txt                    # Python package dependencies
├── environment-windows.yml             # Conda environment for Windows
├── dtc_data.json                       # DTC database (6000+ codes)
├── .flaskenv                           # Flask environment configuration
├── vercel.json                         # Vercel deployment configuration
├── README.md                           # Project documentation
├── LICENSE                             # MIT License file
│
├── static/                             # Static assets directory
│   ├── css/                           # Stylesheets
│   │   ├── style.css                  # Main application styles
│   │   └── diagnostic_app.css         # Diagnostic module styles
│   ├── js/                            # JavaScript files
│   │   └── diagnostic_app.js          # Frontend logic and fault predictions
│   ├── logo.png                       # Application logo (50x50px)
│   └── EMS_ECU/                       # EMS/ECU documentation assets
│
├── templates/                          # Jinja2 HTML templates
│   ├── base.html                      # Base template with navigation
│   ├── index.html                     # Dashboard with fault predictions
│   ├── login.html                     # User authentication page
│   ├── vehicle_selection.html         # Vehicle information capture
│   ├── analysis.html                  # Analysis and statistics page
│   ├── trip_dashboard.html            # OBD-II trip analysis with charts
│   ├── dtc_lookup.html                # DTC database table view
│   └── dtc_detail.html                # Individual DTC detail page
│
├── EMS_ECU/                            # EMS/ECU documentation files
│   └── combined_ems_ecu_documentation.html
│
└── docs/                               # Project documentation
    ├── Chapter_1_Introduction.md
    ├── Chapter_2_Literature_Survey.md
    ├── Chapter_5_System_Design.md
    └── Chapter_9_Results.md
```

## C.4 Installation Guide

**Quick Start**

     Clone repository with `git clone https://github.com/Dowhith18/Intelligent-Automotive-Wiring-Fault-Prediction-Interactive-Diagnostic-Manual.git`. Navigate to project directory. Create virtual environment with `python -m venv venv`. Activate virtual environment (Windows: `.\venv\Scripts\activate`, macOS/Linux: `source venv/bin/activate`). Install dependencies with `pip install -r requirements.txt`. Run application with `python app.py`. Access at http://127.0.0.1:5000.

**Windows Installation (Conda)**

     For Windows users, Conda environment avoids binary package build issues. Execute `conda env create -f environment-windows.yml`. Activate with `conda activate iawfpidm`. Install remaining packages with `pip install -r requirements.txt`. Run application with `python app.py`.

**Default Login Credentials**

     Administrator: username admin, password admin123. Technician: username technician, password tech123. Viewer: username viewer, password view123. Change these credentials before production deployment.

## C.5 Running Tests

     The application includes manual testing procedures for validating functionality. Automated test suite implementation is recommended for production deployment.

**Manual Testing Checklist**

     Authentication testing: Verify login with valid credentials succeeds. Verify login with invalid credentials fails. Verify role-based access control restricts features appropriately. Verify logout clears session correctly.

     Dashboard testing: Verify six vehicle metrics display correctly. Verify fault predictions load and display. Verify navigation menu functions properly. Verify responsive design adapts to different screen sizes.

     DTC Lookup testing: Verify search functionality filters codes correctly. Verify code detail pages display complete information. Verify system and severity filters work properly. Verify pagination handles large result sets.

     Trip Analysis testing: Verify CSV upload accepts valid files. Verify CSV upload rejects invalid files with appropriate error messages. Verify charts generate correctly from uploaded data. Verify statistics calculate accurately. Verify fullscreen mode functions for all charts.

     Fault Prediction testing: Verify fault predictions display with correct severity levels. Verify confidence scores calculate appropriately. Verify recommendations provide actionable guidance. Verify fault details include impact assessment.

**Automated Testing Implementation**

     For automated testing, implement unit tests with pytest framework. Create test files in tests/ directory. Test authentication functions, data processing logic, chart generation, and API endpoints. Execute tests with `pytest` command. Configure continuous integration to run tests automatically on code commits.

## C.6 API Documentation

     The IAWFPIDM system uses server-side rendering with form-based interactions. RESTful API endpoints are not currently implemented but can be added for mobile app integration or third-party system connectivity.

**Proposed API Endpoints**

     POST /api/auth/login - Authenticate user and return session token. GET /api/dtc/{code} - Retrieve diagnostic code details. GET /api/dtc/search?query={term} - Search DTC database. POST /api/trip/analyze - Upload trip data and receive analysis results. GET /api/faults/current - Retrieve current fault predictions. GET /api/vehicle/{vin} - Retrieve vehicle information.

     API implementation should include JSON request/response format, JWT token authentication, rate limiting, error handling with appropriate HTTP status codes, and comprehensive documentation with request/response examples.

## C.7 Contributing Guidelines

     Contributions to the IAWFPIDM project are welcome. Follow these guidelines to ensure smooth collaboration.

**Getting Started**

     Fork the repository on GitHub. Clone your fork locally. Create feature branch with descriptive name (feature/add-new-chart, fix/login-bug). Make changes following project coding standards. Test changes thoroughly. Commit with clear, descriptive messages. Push to your fork. Submit pull request with detailed description.

**Coding Standards**

     Follow PEP 8 style guide for Python code. Use meaningful variable and function names. Add docstrings to functions and classes. Keep functions focused on single responsibility. Limit line length to 100 characters. Use type hints where appropriate.

     For JavaScript, follow Airbnb JavaScript Style Guide. Use ES6+ syntax. Add comments for complex logic. Maintain consistent indentation (2 spaces). Use semicolons consistently.

     For HTML/CSS, use semantic HTML5 elements. Maintain consistent indentation (2 spaces). Use BEM naming convention for CSS classes. Ensure accessibility compliance (WCAG 2.1 Level AA).

**Pull Request Process**

     Ensure code passes all existing tests. Add new tests for new features. Update documentation to reflect changes. Describe changes clearly in pull request description. Reference related issues using #issue-number. Respond to code review feedback promptly. Squash commits before merging if requested.

**Reporting Issues**

     Use GitHub Issues for bug reports and feature requests. Search existing issues before creating new one. Provide clear, descriptive title. Include steps to reproduce for bugs. Specify expected vs actual behavior. Include system information (OS, Python version, browser). Attach screenshots if relevant.

## C.8 License Information

     The Intelligent Automotive Wiring Fault Prediction & Interactive Diagnostic Manual is open source software released under the MIT License.

**MIT License**

     Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

     The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**Third-Party Licenses**

     This project uses third-party libraries with their own licenses. Flask is licensed under BSD-3-Clause License. pandas is licensed under BSD-3-Clause License. matplotlib is licensed under PSF License. numpy is licensed under BSD License. beautifulsoup4 is licensed under MIT License.

     Users must comply with all applicable third-party licenses when using or distributing this software.

**Disclaimer**

     This is a development and educational project. For production automotive diagnostics, always refer to official manufacturer documentation and specifications. The authors and contributors are not liable for any damages or issues arising from use of this software in professional or commercial settings.

---

**End of Appendix C**
