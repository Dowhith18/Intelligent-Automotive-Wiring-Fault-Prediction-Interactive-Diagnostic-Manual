# CHAPTER 5 (Continued)
# SYSTEM DESIGN

---

**Fig. 5.5 Level 2 DFD - Authentication Module**

```
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ Username, Password
     │
     ▼
┌─────────────────┐
│  Process 1.1    │
│  Validate       │
│  Input Format   │
└────────┬────────┘
         │
         │ Validated Credentials
         │
         ▼
┌─────────────────┐         ┌──────────────┐
│  Process 1.2    │────────▶│ Data Store   │
│  Query User     │         │ User Database│
│  Database       │◀────────│              │
└────────┬────────┘         └──────────────┘
         │
         │ User Record
         │
         ▼
┌─────────────────┐
│  Process 1.3    │
│  Verify         │
│  Password       │
└────────┬────────┘
         │
         │ Authentication Result
         │
         ▼
    [Decision]
    Valid?
     │   │
  Yes│   │No
     │   │
     │   └──────────────────────┐
     │                          │
     ▼                          ▼
┌─────────────────┐    ┌─────────────────┐
│  Process 1.4    │    │  Process 1.5    │
│  Create         │    │  Return         │
│  Session        │    │  Error          │
└────────┬────────┘    └────────┬────────┘
         │                      │
         │ Session Token        │ Error Message
         │                      │
         ▼                      │
┌──────────────┐                │
│ Data Store   │                │
│User Sessions │                │
└──────────────┘                │
         │                      │
         │ Success              │
         └──────────┬───────────┘
                    │
                    ▼
               ┌────────┐
               │  User  │
               └────────┘
```

**Fig. 5.6 Level 2 DFD - Fault Prediction Module**

```
┌──────────────┐
│ Data         │
│ Acquisition  │
│ Module       │
└──────┬───────┘
       │
       │ Sensor Data
       │
       ▼
┌─────────────────┐
│  Process 3.1    │
│  Validate       │
│  Sensor         │
│  Readings       │
└────────┬────────┘
         │
         │ Valid Sensor Data
         │
         ▼
┌─────────────────┐
│  Process 3.2    │
│  Apply          │
│  Threshold      │
│  Checks         │
└────────┬────────┘
         │
         │ Threshold Results
         │
         ▼
┌─────────────────┐
│  Process 3.3    │
│  Perform        │
│  Temporal       │
│  Analysis       │
└────────┬────────┘
         │
         │ Trend Data
         │
         ▼
┌─────────────────┐
│  Process 3.4    │
│  Correlate      │
│  Multiple       │
│  Sensors        │
└────────┬────────┘
         │
         │ Correlation Results
         │
         ▼
┌─────────────────┐         ┌──────────────┐
│  Process 3.5    │────────▶│ Data Store   │
│  Classify       │         │ DTC Database │
│  Fault Type     │◀────────│              │
└────────┬────────┘         └──────────────┘
         │                   DTC Information
         │
         │ Fault Classification
         │
         ▼
┌─────────────────┐
│  Process 3.6    │
│  Calculate      │
│  Confidence     │
│  Score          │
└────────┬────────┘
         │
         │ Confidence Score
         │
         ▼
┌─────────────────┐
│  Process 3.7    │
│  Generate       │
│  Recommendations│
└────────┬────────┘
         │
         │ Fault Prediction Report
         │
         ▼
┌──────────────┐
│  Display     │
│  Module      │
└──────────────┘
```

**Fig. 5.7 Level 2 DFD - Reporting Module**

```
┌──────────────┐
│    User      │
└──────┬───────┘
       │
       │ CSV File Upload
       │
       ▼
┌─────────────────┐
│  Process 5.1    │
│  Parse CSV      │
│  File           │
└────────┬────────┘
         │
         │ Raw DataFrame
         │
         ▼
┌─────────────────┐
│  Process 5.2    │
│  Clean and      │
│  Transform      │
│  Data           │
└────────┬────────┘
         │
         │ Cleaned DataFrame
         │
         ▼
┌─────────────────┐
│  Process 5.3    │
│  Calculate      │
│  Trip           │
│  Statistics     │
└────────┬────────┘
         │
         │ Statistics Dict
         │
         ▼
┌─────────────────┐
│  Process 5.4    │
│  Generate       │
│  RPM Chart      │
└────────┬────────┘
         │
         │ RPM Chart Image
         │
         ▼
┌─────────────────┐
│  Process 5.5    │
│  Generate       │
│  Speed Chart    │
└────────┬────────┘
         │
         │ Speed Chart Image
         │
         ▼
┌─────────────────┐
│  Process 5.6    │
│  Generate       │
│  Acceleration   │
│  Chart          │
└────────┬────────┘
         │
         │ Acceleration Chart
         │
         ▼
┌─────────────────┐
│  Process 5.7    │
│  Generate       │
│  RPM-Throttle   │
│  Hexbin         │
└────────┬────────┘
         │
         │ Hexbin Chart
         │
         ▼
┌─────────────────┐
│  Process 5.8    │
│  Compile        │
│  Analysis       │
│  Report         │
└────────┬────────┘
         │
         │ Complete Report
         │
         ▼
┌──────────────┐
│    User      │
└──────────────┘
```

## 5.3 UML Diagrams

     Unified Modeling Language (UML) diagrams provide standardized visual representations of system structure, behavior, and interactions. The following comprehensive set of UML diagrams documents all aspects of the IAWFPIDM system from multiple perspectives.

### 5.3.1 Class Diagrams

     Class diagrams show the static structure of the system including classes, attributes, methods, and relationships between classes.

**Fig. 5.8 Class Diagram - User Management**

```
┌─────────────────────────────────┐
│           User                  │
├─────────────────────────────────┤
│ - username: String              │
│ - password: String              │
│ - role: String                  │
│ - email: String                 │
│ - created_date: DateTime        │
│ - last_login: DateTime          │
├─────────────────────────────────┤
│ + authenticate(): Boolean       │
│ + hasPermission(action): Boolean│
│ + updateLastLogin(): void       │
│ + changePassword(new): Boolean  │
└─────────────────────────────────┘
              △
              │
              │ inherits
              │
    ┌─────────┴─────────┬─────────────┐
    │                   │             │
┌───┴──────────┐  ┌─────┴────────┐  ┌┴──────────┐
│Administrator │  │  Technician  │  │  Viewer   │
├──────────────┤  ├──────────────┤  ├───────────┤
│              │  │              │  │           │
├──────────────┤  ├──────────────┤  ├───────────┤
│+manageUsers()│  │+performDiag()│  │+viewOnly()│
│+configSystem()│  │+uploadData() │  │           │
└──────────────┘  └──────────────┘  └───────────┘
```

**Fig. 5.9 Class Diagram - Diagnostic Module**

```
┌─────────────────────────────────┐
│          Vehicle                │
├─────────────────────────────────┤
│ - vin: String                   │
│ - make: String                  │
│ - model: String                 │
│ - year: Integer                 │
├─────────────────────────────────┤
│ + getInfo(): Dict               │
│ + validate(): Boolean           │
└─────────────────────────────────┘
              │
              │ 1
              │
              │ has
              │
              │ *
              ▼
┌─────────────────────────────────┐
│      DiagnosticSession          │
├─────────────────────────────────┤
│ - session_id: String            │
│ - user_id: String               │
│ - vehicle_id: String            │
│ - session_date: DateTime        │
│ - detected_faults: List         │
├─────────────────────────────────┤
│ + startSession(): void          │
│ + addFault(fault): void         │
│ + endSession(): void            │
│ + generateReport(): Report      │
└─────────────────────────────────┘
              │
              │ contains
              │
              │ *
              ▼
┌─────────────────────────────────┐
│           Fault                 │
├─────────────────────────────────┤
│ - fault_id: String              │
│ - dtc_code: String              │
│ - fault_type: String            │
│ - severity: String              │
│ - confidence: Float             │
│ - timestamp: DateTime           │
├─────────────────────────────────┤
│ + classify(): String            │
│ + getRecommendations(): List    │
│ + calculateImpact(): String     │
└─────────────────────────────────┘
              │
              │ references
              │
              │ 1
              ▼
┌─────────────────────────────────┐
│           DTCCode               │
├─────────────────────────────────┤
│ - code: String                  │
│ - description: String           │
│ - system: String                │
│ - severity: String              │
│ - symptoms: List                │
│ - causes: List                  │
├─────────────────────────────────┤
│ + getDetails(): Dict            │
│ + getDiagnosticSteps(): List    │
└─────────────────────────────────┘
```

**Fig. 5.10 Complete System Class Diagram**

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│     User     │      │   Vehicle    │      │  DTCCode     │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                     │
       │ creates             │ has                 │ references
       │                     │                     │
       ▼                     ▼                     ▼
┌──────────────────────────────────────────────────────────┐
│              DiagnosticSession                           │
└──────────────────────────────────────────────────────────┘
       │
       │ contains
       │
       ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│    Fault     │──────│ SensorData   │──────│  TripData    │
└──────────────┘      └──────────────┘      └──────────────┘
       │                     │                     │
       │ analyzed by         │ processed by        │ generates
       │                     │                     │
       ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│FaultPredictor│      │DataProcessor │      │AnalyticsEng  │
└──────────────┘      └──────────────┘      └──────────────┘
       │                     │                     │
       │                     │                     │
       └─────────────────────┴─────────────────────┘
                             │
                             │ produces
                             ▼
                      ┌──────────────┐
                      │    Report    │
                      └──────────────┘
```

### 5.3.2 Sequence Diagrams

     Sequence diagrams show interactions between objects over time, illustrating the order of message exchanges.

**Fig. 5.11 Sequence Diagram - User Authentication Flow**

```
User        LoginPage    AuthController   UserDatabase   SessionManager
 │              │              │               │               │
 │──Enter────▶│              │               │               │
 │ Credentials │              │               │               │
 │              │              │               │               │
 │              │──Submit────▶│               │               │
 │              │  Form        │               │               │
 │              │              │               │               │
 │              │              │──Query User──▶│               │
 │              │              │               │               │
 │              │              │◀──User Record─│               │
 │              │              │               │               │
 │              │              │──Verify────────────────────────┐
 │              │              │  Password                      │
 │              │              │◀───────────────────────────────┘
 │              │              │               │               │
 │              │              │──Create Session──────────────▶│
 │              │              │               │               │
 │              │              │◀──Session Token──────────────│
 │              │              │               │               │
 │              │◀──Redirect───│               │               │
 │              │  to Dashboard│               │               │
 │              │              │               │               │
 │◀─Dashboard──│              │               │               │
 │  Page        │              │               │               │
 │              │              │               │               │
```

**Fig. 5.12 Sequence Diagram - Fault Prediction Process**

```
Dashboard  FaultPredictor  SensorData  DTCDatabase  DisplayModule
    │            │             │            │            │
    │──Request───▶│             │            │            │
    │ Prediction  │             │            │            │
    │            │             │            │            │
    │            │──Get Data──▶│            │            │
    │            │             │            │            │
    │            │◀──Sensor────│            │            │
    │            │  Readings   │            │            │
    │            │             │            │            │
    │            │──Validate────────────────┐            │
    │            │  Readings                │            │
    │            │◀─────────────────────────┘            │
    │            │             │            │            │
    │            │──Apply Thresholds────────┐            │
    │            │◀─────────────────────────┘            │
    │            │             │            │            │
    │            │──Classify Fault──────────┐            │
    │            │◀─────────────────────────┘            │
    │            │             │            │            │
    │            │──Lookup DTC─────────────▶│            │
    │            │             │            │            │
    │            │◀──DTC Info──────────────│            │
    │            │             │            │            │
    │            │──Generate Recommendations┐            │
    │            │◀─────────────────────────┘            │
    │            │             │            │            │
    │◀──Fault────│             │            │            │
    │  Prediction│             │            │            │
    │            │             │            │            │
    │──Display──────────────────────────────────────────▶│
    │  Results   │             │            │            │
    │            │             │            │            │
```

**Fig. 5.13 Sequence Diagram - Report Generation**

```
User    UploadPage  DataProcessor  AnalyticsEngine  ChartGenerator  ReportPage
 │          │            │               │                │            │
 │──Upload──▶│            │               │                │            │
 │ CSV File │            │               │                │            │
 │          │            │               │                │            │
 │          │──Parse────▶│               │                │            │
 │          │  CSV       │               │                │            │
 │          │            │               │                │            │
 │          │            │──Clean Data───┐                │            │
 │          │            │◀──────────────┘                │            │
 │          │            │               │                │            │
 │          │            │──Calculate────▶│                │            │
 │          │            │  Statistics   │                │            │
 │          │            │               │                │            │
 │          │            │◀──Stats Dict──│                │            │
 │          │            │               │                │            │
 │          │            │──Generate Charts──────────────▶│            │
 │          │            │               │                │            │
 │          │            │◀──Chart Images────────────────│            │
 │          │            │               │                │            │
 │          │◀──Report───│               │                │            │
 │          │  Data      │               │                │            │
 │          │            │               │                │            │
 │          │──Render────────────────────────────────────────────────▶│
 │          │  Template  │               │                │            │
 │          │            │               │                │            │
 │◀─Display─│            │               │                │            │
 │  Report  │            │               │                │            │
 │          │            │               │                │            │
```
