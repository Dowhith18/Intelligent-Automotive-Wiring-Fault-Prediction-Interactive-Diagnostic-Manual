# CHAPTER 5 (Continued)
# SYSTEM DESIGN

---

### 5.3.3 Collaboration Diagrams

     Collaboration diagrams show object interactions with emphasis on structural organization and message numbering.

**Fig. 5.14 Collaboration Diagram - Diagnostic Process**

```
                    1: requestDiagnostic()
        ┌──────────────────────────────────────────┐
        │                                          │
        ▼                                          │
   ┌─────────┐                              ┌──────────┐
   │  User   │                              │Dashboard │
   └─────────┘                              └──────────┘
        │                                          │
        │ 2: getSensorData()                       │
        │                                          │
        ▼                                          │
   ┌──────────────┐                               │
   │  SensorData  │                               │
   └──────────────┘                               │
        │                                          │
        │ 3: analyzeFault(data)                    │
        │                                          │
        ▼                                          │
   ┌──────────────┐  4: lookupDTC()  ┌──────────┐ │
   │FaultPredictor│─────────────────▶│DTCDatabase│ │
   └──────────────┘                  └──────────┘ │
        │                                  │       │
        │ 5: getDTCInfo()                  │       │
        │◀─────────────────────────────────┘       │
        │                                          │
        │ 6: returnPrediction()                    │
        └──────────────────────────────────────────┘
```

**Fig. 5.15 Collaboration Diagram - Data Processing**

```
                    1: uploadCSV()
        ┌──────────────────────────────────────────┐
        │                                          │
        ▼                                          │
   ┌─────────┐                              ┌──────────┐
   │  User   │                              │UploadPage│
   └─────────┘                              └──────────┘
        │                                          │
        │ 2: parseFile(csv)                        │
        │                                          │
        ▼                                          │
   ┌──────────────┐                               │
   │DataProcessor │                               │
   └──────────────┘                               │
        │                                          │
        │ 3: cleanData()                           │
        │                                          │
        ▼                                          │
   ┌──────────────┐  4: calculate()  ┌──────────┐ │
   │AnalyticsEng  │─────────────────▶│Statistics│ │
   └──────────────┘                  └──────────┘ │
        │                                  │       │
        │ 5: generateCharts()              │       │
        │                                  │       │
        ▼                                  │       │
   ┌──────────────┐                       │       │
   │ChartGenerator│                       │       │
   └──────────────┘                       │       │
        │                                  │       │
        │ 6: returnReport(stats, charts)   │       │
        └──────────────────────────────────────────┘
```

### 5.3.4 Object Diagrams

     Object diagrams show instances of classes at a specific point in time during system execution.

**Fig. 5.16 Object Diagram - Runtime Instances**

```
┌─────────────────────────┐
│ user1: Technician       │
├─────────────────────────┤
│ username = "tech_john"  │
│ role = "Technician"     │
│ last_login = 2024-01-15 │
└─────────────────────────┘
            │
            │ creates
            ▼
┌─────────────────────────┐
│ session1: Session       │
├─────────────────────────┤
│ session_id = "abc123"   │
│ user_id = "tech_john"   │
│ vehicle_id = "vin001"   │
│ session_date = today    │
└─────────────────────────┘
            │
            │ contains
            ▼
┌─────────────────────────┐
│ fault1: Fault           │
├─────────────────────────┤
│ fault_id = "f001"       │
│ dtc_code = "P062700"    │
│ fault_type = "Open"     │
│ severity = "High"       │
│ confidence = 0.95       │
└─────────────────────────┘
            │
            │ references
            ▼
┌─────────────────────────┐
│ dtc1: DTCCode           │
├─────────────────────────┤
│ code = "P062700"        │
│ description = "Fuel     │
│   Pump Relay Control"   │
│ system = "Fuel System"  │
│ severity = "High"       │
└─────────────────────────┘
```

### 5.3.5 Use Case Diagrams

     Use case diagrams show system functionality from the user's perspective.

**Fig. 5.17 Detailed Use Case Diagram - All Actors**

```
                    IAWFPIDM System
    ┌────────────────────────────────────────────────┐
    │                                                │
    │  ┌──────────────┐      ┌──────────────┐      │
    │  │   Login      │      │   Logout     │      │
    │  └──────────────┘      └──────────────┘      │
    │                                                │
    │  ┌──────────────┐      ┌──────────────┐      │
    │  │   Select     │      │   View       │      │
    │  │   Vehicle    │      │   Dashboard  │      │
    │  └──────────────┘      └──────────────┘      │
    │                                                │
    │  ┌──────────────┐      ┌──────────────┐      │
    │  │   Search     │      │   View DTC   │      │
    │  │   DTC Codes  │      │   Details    │      │
    │  └──────────────┘      └──────────────┘      │
    │                                                │
    │  ┌──────────────┐      ┌──────────────┐      │
    │  │   Upload     │      │   Analyze    │      │
    │  │   Trip Data  │      │   Trip Data  │      │
    │  └──────────────┘      └──────────────┘      │
    │                                                │
    │  ┌──────────────┐      ┌──────────────┐      │
    │  │   Predict    │      │   Generate   │      │
    │  │   Faults     │      │   Reports    │      │
    │  └──────────────┘      └──────────────┘      │
    │                                                │
    │  ┌──────────────┐      ┌──────────────┐      │
    │  │   Manage     │      │   Configure  │      │
    │  │   Users      │      │   System     │      │
    │  └──────────────┘      └──────────────┘      │
    │                                                │
    └────────────────────────────────────────────────┘
         │         │         │
         │         │         │
    ┌────┴───┐ ┌──┴────┐ ┌──┴────┐
    │ Admin  │ │ Tech  │ │Viewer │
    └────────┘ └───────┘ └───────┘
```

**Fig. 5.18 Use Case Diagram - Administrator**

```
    Administrator
         │
         │
         ├──────────▶ Login
         │
         ├──────────▶ Manage Users
         │              │
         │              ├──▶ Create User
         │              ├──▶ Edit User
         │              ├──▶ Delete User
         │              └──▶ View User List
         │
         ├──────────▶ Configure System
         │              │
         │              ├──▶ Set Parameters
         │              ├──▶ Update DTC Database
         │              └──▶ View System Logs
         │
         ├──────────▶ View All Reports
         │
         ├──────────▶ Access All Features
         │              (inherits Technician capabilities)
         │
         └──────────▶ Logout
```

**Fig. 5.19 Use Case Diagram - Technician**

```
    Technician
         │
         │
         ├──────────▶ Login
         │
         ├──────────▶ Select Vehicle
         │              │
         │              └──▶ Enter VIN, Make, Model, Year
         │
         ├──────────▶ View Dashboard
         │              │
         │              ├──▶ Monitor Metrics
         │              └──▶ View Fault Predictions
         │
         ├──────────▶ Search DTC Database
         │              │
         │              ├──▶ Search by Code
         │              ├──▶ Filter by System
         │              └──▶ View DTC Details
         │
         ├──────────▶ Upload Trip Data
         │              │
         │              └──▶ Select CSV File
         │
         ├──────────▶ Analyze Trip Data
         │              │
         │              ├──▶ View Statistics
         │              ├──▶ View Charts
         │              └──▶ Export Report
         │
         ├──────────▶ Perform Diagnostics
         │              │
         │              ├──▶ Run Fault Prediction
         │              └──▶ View Recommendations
         │
         └──────────▶ Logout
```

### 5.3.6 State Chart Diagrams

     State chart diagrams show the lifecycle and state transitions of system entities.

**Fig. 5.20 State Chart Diagram - Diagnostic Session**

```
                    [Start]
                       │
                       ▼
              ┌────────────────┐
              │   Initialized  │
              └────────┬───────┘
                       │
                       │ user selects vehicle
                       ▼
              ┌────────────────┐
              │ Vehicle Selected│
              └────────┬───────┘
                       │
                       │ start monitoring
                       ▼
              ┌────────────────┐
              │   Monitoring   │◀──────┐
              └────────┬───────┘       │
                       │               │
                       │ fault detected│ continue monitoring
                       ▼               │
              ┌────────────────┐       │
              │ Fault Detected │───────┘
              └────────┬───────┘
                       │
                       │ analyze fault
                       ▼
              ┌────────────────┐
              │   Analyzing    │
              └────────┬───────┘
                       │
                       │ analysis complete
                       ▼
              ┌────────────────┐
              │ Results Ready  │
              └────────┬───────┘
                       │
                       │ user reviews
                       ▼
              ┌────────────────┐
              │   Reviewed     │
              └────────┬───────┘
                       │
                       │ end session
                       ▼
              ┌────────────────┐
              │   Completed    │
              └────────────────┘
                       │
                       ▼
                     [End]
```

**Fig. 5.21 State Chart Diagram - Fault Status**

```
                    [Detected]
                       │
                       ▼
              ┌────────────────┐
              │   Unconfirmed  │
              └────────┬───────┘
                       │
                       │ confidence > 0.8
                       ▼
              ┌────────────────┐
              │   Confirmed    │
              └────────┬───────┘
                       │
                       ├──────────────────┐
                       │                  │
            severity = High        severity = Low
                       │                  │
                       ▼                  ▼
              ┌────────────────┐  ┌────────────────┐
              │    Critical    │  │   Advisory     │
              └────────┬───────┘  └────────┬───────┘
                       │                  │
                       │                  │
                       └────────┬─────────┘
                                │
                                │ technician action
                                ▼
                       ┌────────────────┐
                       │ Under Repair   │
                       └────────┬───────┘
                                │
                                │ repair complete
                                ▼
                       ┌────────────────┐
                       │    Resolved    │
                       └────────────────┘
                                │
                                ▼
                              [End]
```

### 5.3.7 Activity Diagrams

     Activity diagrams model workflows and business processes with decision points and parallel activities.

**Fig. 5.22 Activity Diagram - Complete Diagnostic Workflow**

```
                    [Start]
                       │
                       ▼
              ┌────────────────┐
              │  User Login    │
              └────────┬───────┘
                       │
                       ▼
                  ◇ Valid?
                 /         \
              No/           \Yes
               /             \
              ▼               ▼
    ┌────────────────┐  ┌────────────────┐
    │ Show Error     │  │ Select Vehicle │
    └────────┬───────┘  └────────┬───────┘
             │                   │
             │                   ▼
             │          ┌────────────────┐
             │          │ View Dashboard │
             │          └────────┬───────┘
             │                   │
             │                   ▼
             │              ◇ Action?
             │             /    |    \
             │            /     |     \
             │           /      |      \
             │          ▼       ▼       ▼
             │    ┌─────────┐ ┌─────┐ ┌─────────┐
             │    │ Search  │ │Trip │ │ Predict │
             │    │  DTC    │ │Data │ │ Faults  │
             │    └────┬────┘ └──┬──┘ └────┬────┘
             │         │         │         │
             │         ▼         ▼         ▼
             │    ┌─────────┐ ┌─────┐ ┌─────────┐
             │    │  View   │ │Anal-│ │  View   │
             │    │ Details │ │yze  │ │ Results │
             │    └────┬────┘ └──┬──┘ └────┬────┘
             │         │         │         │
             │         └─────────┴─────────┘
             │                   │
             │                   ▼
             │          ┌────────────────┐
             │          │ Generate Report│
             │          └────────┬───────┘
             │                   │
             │                   ▼
             │              ◇ Continue?
             │             /         \
             │          Yes/           \No
             │           /               \
             │          ▼                 ▼
             │    [Return to         ┌────────────┐
             │     Dashboard]        │   Logout   │
             │          │            └─────┬──────┘
             │          │                  │
             └──────────┘                  ▼
                                        [End]
```

### 5.3.8 Component Diagrams

     Component diagrams show the physical architecture and dependencies between software components.

**Fig. 5.23 Component Diagram - System Modules**

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Components                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Templates  │  │     CSS      │  │  JavaScript  │      │
│  │   (Jinja2)   │  │   Styles     │  │   Scripts    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                           │                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │ HTTP
┌───────────────────────────┼─────────────────────────────────┐
│                    Backend Components                        │
│  ┌─────────────────────────┴─────────────────────────┐      │
│  │              Flask Application                     │      │
│  │  ┌──────────────────────────────────────────────┐ │      │
│  │  │            app.py (Main)                     │ │      │
│  │  └──────────────────────────────────────────────┘ │      │
│  └─────────────────────────────────────────────────────┘      │
│         │                 │                 │                │
│         ▼                 ▼                 ▼                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  analysis.py │  │ scraper.py   │  │  auth.py     │      │
│  │  (Analytics) │  │ (Data Acq)   │  │ (Security)   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                           │                                 │
│                           │ depends on                      │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────┐       │
│  │           External Libraries                     │       │
│  │  pandas | numpy | matplotlib | BeautifulSoup    │       │
│  └─────────────────────────────────────────────────┘       │
└───────────────────────────┼─────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                    Data Components                           │
│  ┌─────────────────────────┴─────────────────────────┐      │
│  │              Data Storage                          │      │
│  │  ┌──────────────┐  ┌──────────────┐              │      │
│  │  │ dtc_data.json│  │ user_data.py │              │      │
│  │  └──────────────┘  └──────────────┘              │      │
│  └─────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 5.3.9 Deployment Diagrams

     Deployment diagrams show the physical deployment of software artifacts on hardware nodes.

**Fig. 5.24 Deployment Diagram - Production Environment**

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Devices                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Desktop    │  │    Tablet    │  │    Mobile    │      │
│  │   Browser    │  │   Browser    │  │   Browser    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                           │                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │ HTTPS
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                    Cloud Platform (Vercel)                   │
│  ┌─────────────────────────┴─────────────────────────┐      │
│  │              Load Balancer                         │      │
│  └─────────────────────────┬─────────────────────────┘      │
│                            │                                │
│         ┌──────────────────┼──────────────────┐             │
│         │                  │                  │             │
│         ▼                  ▼                  ▼             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ App Instance │  │ App Instance │  │ App Instance │      │
│  │      1       │  │      2       │  │      3       │      │
│  │              │  │              │  │              │      │
│  │ Flask App    │  │ Flask App    │  │ Flask App    │      │
│  │ Python 3.10  │  │ Python 3.10  │  │ Python 3.10  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                           │                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                    Database Server (AWS RDS)                 │
│  ┌─────────────────────────┴─────────────────────────┐      │
│  │              MySQL Database                        │      │
│  │  • User Data  • Vehicle Data  • Session Data      │      │
│  └─────────────────────────────────────────────────────┘      │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐      │
│  │              MongoDB Database                       │      │
│  │  • Trip Data  • Diagnostic Logs  • Analytics       │      │
│  └─────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```
