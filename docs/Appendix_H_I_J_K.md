# APPENDIX H
# DETAILED DESIGN MODELS

---

## H.1 Additional UML Diagrams

**Fig. H.1 Sequence Diagram - User Authentication Flow**

```
User          LoginPage       AuthController    UserDatabase      SessionManager
 |                |                  |                |                 |
 |--Enter Credentials-->             |                |                 |
 |                |                  |                |                 |
 |                |--Submit Form---->|                |                 |
 |                |                  |                |                 |
 |                |                  |--Query User--->|                 |
 |                |                  |                |                 |
 |                |                  |<--User Record--|                 |
 |                |                  |                |                 |
 |                |                  |--Verify Password                 |
 |                |                  |                |                 |
 |                |                  |--Create Session--------------->  |
 |                |                  |                |                 |
 |                |                  |<--Session Token----------------|  |
 |                |                  |                |                 |
 |                |<--Redirect to Dashboard           |                 |
 |                |                  |                |                 |
 |<--Dashboard----|                  |                |                 |
```

**Fig. H.2 Activity Diagram - Fault Prediction Process**

```
                    [Start]
                       |
                       v
            [Acquire Sensor Data]
                       |
                       v
            [Validate Data Format]
                       |
                       v
                  <Data Valid?>
                   /         \
                 No           Yes
                 |             |
                 v             v
        [Return Error]  [Apply Thresholds]
                               |
                               v
                    [Analyze Deviations]
                               |
                               v
                    [Correlate Sensors]
                               |
                               v
                    [Classify Fault Type]
                               |
                               v
                 [Calculate Confidence Score]
                               |
                               v
                    <Confidence > 70%?>
                       /            \
                     Yes             No
                      |               |
                      v               v
            [Generate Report]  [Flag for Review]
                      |               |
                      v               v
                [Display Results]     |
                      |               |
                      +-------+-------+
                              |
                              v
                          [End]
```

**Fig. H.3 State Diagram - Diagnostic Session States**

```
                    [Initial]
                        |
                        | Start Session
                        v
                  [Active Session]
                        |
            +-----------+-----------+
            |           |           |
    Detect Fault   Add Data    End Session
            |           |           |
            v           v           v
      [Fault Detected] [Data Updated] [Generating Report]
            |           |           |
            +-----+-----+           |
                  |                 |
                  v                 v
            [Active Session]   [Report Ready]
                                    |
                                    | Save/Export
                                    v
                              [Session Closed]
```

## H.2 Enhanced Data Flow Diagrams

**Fig. H.4 Context Diagram - Complete System**

```
                        ┌─────────────────┐
                        │   Technician    │
                        └────────┬────────┘
                                 |
                    Login/Query/Upload
                                 |
                                 v
        ┌────────────────────────────────────────┐
        │                                        │
        │    IAWFPIDM System                    │
        │                                        │
        │  - Authentication                     │
        │  - DTC Lookup                         │
        │  - Fault Prediction                   │
        │  - Trip Analysis                      │
        │  - Reporting                          │
        │                                        │
        └────┬──────────────────────┬───────────┘
             |                      |
    Diagnostic Results      Vehicle Data
             |                      |
             v                      v
     ┌──────────────┐      ┌──────────────┐
     │   Reports    │      │  OBD-II Port │
     │   Database   │      │   Vehicle    │
     └──────────────┘      └──────────────┘
```

**Fig. H.5 Component Diagram - System Architecture**

```
┌─────────────────────────────────────────────────────┐
│                  Presentation Layer                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Login   │  │Dashboard │  │   DTC    │          │
│  │   UI     │  │    UI    │  │ Lookup UI│          │
│  └──────────┘  └──────────┘  └──────────┘          │
└────────────────────┬────────────────────────────────┘
                     |
                     | HTTP/HTTPS
                     |
┌────────────────────┴────────────────────────────────┐
│              Application Layer (Flask)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Auth    │  │  Fault   │  │   Trip   │          │
│  │Controller│  │Prediction│  │ Analysis │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└────────────────────┬────────────────────────────────┘
                     |
                     | Data Access
                     |
┌────────────────────┴────────────────────────────────┐
│                  Data Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │   User   │  │   DTC    │  │  Session │          │
│  │   Data   │  │ Database │  │  Storage │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
```

## H.3 Database Schema Diagrams

**Fig. H.6 Entity-Relationship Diagram**

```
┌─────────────────┐         ┌─────────────────┐
│      User       │         │    Vehicle      │
├─────────────────┤         ├─────────────────┤
│ PK: user_id     │         │ PK: vehicle_id  │
│    username     │         │    vin          │
│    password     │         │    make         │
│    role         │         │    model        │
│    email        │         │    year         │
│    created_date │         │    owner_id     │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │ 1                         │ 1
         │                           │
         │ performs                  │ has
         │                           │
         │ *                         │ *
         │                           │
         └──────────┬────────────────┘
                    │
                    v
         ┌─────────────────────┐
         │ DiagnosticSession   │
         ├─────────────────────┤
         │ PK: session_id      │
         │ FK: user_id         │
         │ FK: vehicle_id      │
         │    session_date     │
         │    duration         │
         │    status           │
         └──────────┬──────────┘
                    │
                    │ 1
                    │
                    │ contains
                    │
                    │ *
                    v
         ┌─────────────────────┐
         │       Fault         │
         ├─────────────────────┤
         │ PK: fault_id        │
         │ FK: session_id      │
         │ FK: dtc_code        │
         │    fault_type       │
         │    severity         │
         │    confidence       │
         │    timestamp        │
         └──────────┬──────────┘
                    │
                    │ references
                    │
                    │ *:1
                    v
         ┌─────────────────────┐
         │      DTCCode        │
         ├─────────────────────┤
         │ PK: code            │
         │    description      │
         │    system           │
         │    severity         │
         │    symptoms         │
         │    causes           │
         └─────────────────────┘
```

---

# APPENDIX I
# TEST DOCUMENTATION

---

## I.1 Test Plan Overview

     Comprehensive testing strategy ensures system reliability, functionality, and performance meet specified requirements. Testing phases include unit testing, integration testing, system testing, and user acceptance testing.

## I.2 Unit Test Cases

**Table I.1 Authentication Module Test Cases**

| Test ID | Test Case | Input | Expected Output | Status |
|---------|-----------|-------|-----------------|--------|
| UT-AUTH-001 | Valid login | username: admin, password: admin123 | Login success, redirect to dashboard | Pass |
| UT-AUTH-002 | Invalid username | username: invalid, password: admin123 | Login failure, error message | Pass |
| UT-AUTH-003 | Invalid password | username: admin, password: wrong | Login failure, error message | Pass |
| UT-AUTH-004 | Empty credentials | username: "", password: "" | Validation error | Pass |
| UT-AUTH-005 | Session creation | Valid login | Session token created | Pass |
| UT-AUTH-006 | Logout | Active session | Session cleared, redirect to login | Pass |
| UT-AUTH-007 | Role verification | Admin user | Role = Admin | Pass |
| UT-AUTH-008 | Protected route access | No session | Redirect to login | Pass |

## I.3 Integration Test Cases

**Table I.2 System Integration Test Cases**

| Test ID | Test Case | Components | Expected Result | Status |
|---------|-----------|------------|-----------------|--------|
| IT-001 | Login to Dashboard | Auth + Dashboard | Successful navigation | Pass |
| IT-002 | DTC Lookup Query | Search + Database | Correct results returned | Pass |
| IT-003 | CSV Upload Processing | Upload + Analysis | Charts generated | Pass |
| IT-004 | Fault Prediction Display | Prediction + UI | Faults displayed correctly | Pass |
| IT-005 | Vehicle Info Save | Form + Session | Data persisted in session | Pass |
| IT-006 | Report Generation | Analysis + Export | PDF created successfully | Pass |

## I.4 Functional Test Cases

**Table I.3 DTC Lookup Functional Tests**

| Test ID | Functionality | Test Steps | Expected Result | Actual Result | Status |
|---------|---------------|------------|-----------------|---------------|--------|
| FT-DTC-001 | Search by code | Enter "P0300", click search | Display P0300 details | As expected | Pass |
| FT-DTC-002 | Search by keyword | Enter "misfire", click search | Display all misfire codes | As expected | Pass |
| FT-DTC-003 | Filter by system | Select "Engine", apply filter | Show only P-codes | As expected | Pass |
| FT-DTC-004 | Filter by severity | Select "High", apply filter | Show high severity codes | As expected | Pass |
| FT-DTC-005 | View code details | Click DTC code row | Display detail page | As expected | Pass |
| FT-DTC-006 | Empty search | Enter "", click search | Display all codes | As expected | Pass |

## I.5 Performance Test Results

**Table I.4 Load Testing Results**

| Test Scenario | Concurrent Users | Avg Response Time | Max Response Time | Error Rate | Throughput (req/s) |
|---------------|------------------|-------------------|-------------------|------------|-------------------|
| Light Load | 10 | 95ms | 180ms | 0% | 45 |
| Medium Load | 50 | 125ms | 280ms | 0.1% | 180 |
| Heavy Load | 100 | 165ms | 420ms | 0.3% | 320 |
| Peak Load | 250 | 220ms | 650ms | 0.8% | 580 |
| Stress Test | 500 | 380ms | 1,200ms | 2.5% | 750 |

## I.6 Security Test Cases

**Table I.5 Security Testing Results**

| Test ID | Security Test | Method | Result | Status |
|---------|---------------|--------|--------|--------|
| ST-001 | SQL Injection | Inject SQL in login form | No vulnerability | Pass |
| ST-002 | XSS Attack | Inject script in search | Input sanitized | Pass |
| ST-003 | Session Hijacking | Steal session token | Token encrypted | Pass |
| ST-004 | CSRF Attack | Submit forged request | Request rejected | Pass |
| ST-005 | Password Exposure | View page source | Password masked | Pass |
| ST-006 | Unauthorized Access | Access admin without role | Access denied | Pass |

## I.7 User Acceptance Test Results

**Table I.6 UAT Summary**

| Feature | Test Participants | Success Rate | Avg Completion Time | User Rating |
|---------|------------------|--------------|---------------------|-------------|
| Login | 7 | 100% | 15 seconds | 4.5/5.0 |
| DTC Lookup | 7 | 100% | 45 seconds | 4.6/5.0 |
| Fault Prediction | 7 | 100% | 2 minutes | 4.3/5.0 |
| Trip Analysis | 5 | 100% | 3 minutes | 4.1/5.0 |
| Report Generation | 5 | 100% | 1.5 minutes | 4.2/5.0 |

---

# APPENDIX J
# API DOCUMENTATION

---

## J.1 API Overview

     The IAWFPIDM system currently uses server-side rendering with form-based interactions. This appendix documents proposed RESTful API endpoints for future mobile app integration and third-party system connectivity.

## J.2 Authentication Endpoints

**POST /api/auth/login**

Description: Authenticate user and receive access token

Request Body:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "role": "Admin",
    "email": "admin@example.com"
  }
}
```

Response (401 Unauthorized):
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**POST /api/auth/logout**

Description: Invalidate current session token

Headers: Authorization: Bearer {token}

Response (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## J.3 DTC Lookup Endpoints

**GET /api/dtc/{code}**

Description: Retrieve diagnostic code details

Parameters: code (path parameter) - DTC code identifier

Response (200 OK):
```json
{
  "code": "P0300",
  "description": "Random/Multiple Cylinder Misfire Detected",
  "system": "Engine",
  "severity": "High",
  "symptoms": [
    "Check engine light illuminated",
    "Rough idle",
    "Loss of power"
  ],
  "causes": [
    "Faulty spark plugs",
    "Vacuum leak",
    "Low fuel pressure"
  ],
  "diagnostic_steps": [
    "Check spark plugs and wires",
    "Inspect fuel system pressure",
    "Test ignition coils"
  ]
}
```

**GET /api/dtc/search**

Description: Search DTC database

Query Parameters:
- query (string) - Search term
- system (string) - Filter by system
- severity (string) - Filter by severity
- page (integer) - Page number
- limit (integer) - Results per page

Response (200 OK):
```json
{
  "total": 156,
  "page": 1,
  "limit": 20,
  "results": [
    {
      "code": "P0300",
      "description": "Random/Multiple Cylinder Misfire Detected",
      "system": "Engine",
      "severity": "High"
    }
  ]
}
```

## J.4 Fault Prediction Endpoints

**GET /api/faults/current**

Description: Retrieve current fault predictions

Headers: Authorization: Bearer {token}

Response (200 OK):
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "faults": [
    {
      "dtc_code": "P062700",
      "component": "Fuel Pump Relay Control Circuit",
      "fault_type": "Open Circuit",
      "severity": "High",
      "confidence": 92,
      "impact": "Engine will not start or will stall",
      "recommendation": "Check relay connections and wiring harness"
    }
  ]
}
```

**POST /api/faults/predict**

Description: Analyze sensor data and predict faults

Request Body:
```json
{
  "sensor_data": {
    "fuel_pump_voltage": 10.2,
    "injector_resistance": 8.5,
    "battery_voltage": 13.8,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

Response (200 OK):
```json
{
  "predictions": [
    {
      "dtc_code": "P062700",
      "confidence": 92,
      "severity": "High"
    }
  ]
}
```

## J.5 Trip Analysis Endpoints

**POST /api/trip/analyze**

Description: Upload and analyze trip data

Request: multipart/form-data with CSV file

Response (200 OK):
```json
{
  "statistics": {
    "total_distance": 45.6,
    "trip_duration": 38.5,
    "avg_speed": 65.2,
    "max_speed": 110.0,
    "fuel_efficiency": 12.5
  },
  "charts": {
    "rpm_chart": "/static/charts/rpm_12345.png",
    "speed_chart": "/static/charts/speed_12345.png"
  }
}
```

---

# APPENDIX K
# PROJECT TIMELINE

---

## K.1 Project Schedule Overview

     The IAWFPIDM project was completed over a 16-week period from September 2024 to December 2024. The project followed an iterative development approach with regular milestones and deliverables.

**Fig. K.1 Gantt Chart - Project Timeline**

```
Task                        Week: 1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
─────────────────────────────────────────────────────────────────────────────────
Project Planning            ████
Requirements Analysis       ████ ██
Literature Survey              ████ ██
System Design                    ████ ████
Database Design                     ████ ██
UI/UX Design                           ████ ██
Backend Development                       ████ ████ ██
Frontend Development                         ████ ████ ██
Integration                                        ████ ██
Testing                                               ████ ████
Documentation                                            ████ ████ ██
Deployment                                                     ████
Final Review                                                        ████
```

## K.2 Milestone Schedule

**Table K.1 Project Milestones**

| Milestone | Description | Planned Date | Actual Date | Status |
|-----------|-------------|--------------|-------------|--------|
| M1 | Project Kickoff | Week 1 | Week 1 | Complete |
| M2 | Requirements Finalized | Week 3 | Week 3 | Complete |
| M3 | Design Approval | Week 6 | Week 6 | Complete |
| M4 | Database Implementation | Week 8 | Week 8 | Complete |
| M5 | Backend Complete | Week 10 | Week 10 | Complete |
| M6 | Frontend Complete | Week 12 | Week 12 | Complete |
| M7 | Integration Complete | Week 13 | Week 13 | Complete |
| M8 | Testing Complete | Week 15 | Week 15 | Complete |
| M9 | Project Delivery | Week 16 | Week 16 | Complete |

## K.3 Deliverables Schedule

**Table K.2 Project Deliverables**

| Deliverable | Due Date | Delivery Date | Status |
|-------------|----------|---------------|--------|
| Project Proposal | Week 2 | Week 2 | Delivered |
| Requirements Document | Week 3 | Week 3 | Delivered |
| System Design Document | Week 6 | Week 6 | Delivered |
| Database Schema | Week 7 | Week 7 | Delivered |
| Working Prototype | Week 10 | Week 10 | Delivered |
| Complete Application | Week 13 | Week 13 | Delivered |
| Test Report | Week 15 | Week 15 | Delivered |
| Final Documentation | Week 16 | Week 16 | Delivered |
| Project Presentation | Week 16 | Week 16 | Delivered |

## K.4 Resource Allocation

**Table K.3 Team Member Time Allocation**

| Phase | Member 1 (hrs) | Member 2 (hrs) | Member 3 (hrs) | Total (hrs) |
|-------|----------------|----------------|----------------|-------------|
| Planning | 15 | 15 | 15 | 45 |
| Requirements | 12 | 12 | 12 | 36 |
| Design | 20 | 20 | 25 | 65 |
| Development | 40 | 45 | 35 | 120 |
| Testing | 15 | 15 | 20 | 50 |
| Documentation | 18 | 18 | 26 | 62 |
| **Total** | **120** | **125** | **133** | **378** |

---

**End of Appendices H, I, J, and K**
