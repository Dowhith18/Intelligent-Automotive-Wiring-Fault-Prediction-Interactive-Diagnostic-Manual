# CHAPTER 5
# SYSTEM DESIGN

---

## 5.1 Architectural Design

     The Intelligent Automotive Wiring Fault Prediction and Interactive Diagnostic Manual employs a layered architectural pattern that separates concerns across distinct tiers, ensuring modularity, maintainability, and scalability. The architecture follows the Model-View-Controller (MVC) design pattern adapted for web applications, combined with a service-oriented approach that enables independent development and testing of system components.

**Architectural Pattern - Layered MVC Architecture**

     The system implements a three-tier layered architecture consisting of the Presentation Layer (View), Application Layer (Controller), and Data Layer (Model). This separation ensures that changes to one layer have minimal impact on other layers, facilitating independent evolution of user interface, business logic, and data storage mechanisms.

     The Presentation Layer handles all user interactions through web-based interfaces rendered using Jinja2 templates, HTML5, CSS3, and JavaScript. This layer is responsible for displaying diagnostic information, accepting user inputs, and providing visual feedback. The layer communicates exclusively with the Application Layer through HTTP requests, maintaining a clean separation between presentation and business logic.

     The Application Layer contains the core business logic implemented in Flask route handlers and service modules. This layer processes user requests, orchestrates interactions between different system components, executes fault prediction algorithms, performs data analysis, and generates responses. The Application Layer acts as the controller in the MVC pattern, mediating between the Presentation Layer and Data Layer without allowing direct communication between them.

     The Data Layer manages all data persistence operations including DTC database storage, user authentication data, vehicle information, and diagnostic session logs. This layer abstracts the underlying storage mechanisms (JSON files, future SQL databases) behind a consistent interface, enabling storage technology changes without affecting upper layers.

**Justification for Architectural Choices**

     The layered MVC architecture was selected for several compelling reasons. Separation of concerns enables different team members to work on presentation, business logic, and data layers independently without conflicts. Maintainability is enhanced as bugs and enhancements can be isolated to specific layers, reducing the risk of unintended side effects. Testability improves through the ability to test each layer independently using mock objects for dependencies. Scalability is facilitated as individual layers can be scaled horizontally by adding more instances behind load balancers.

     Alternative architectures considered included Microservices Architecture (rejected due to excessive complexity for current scale and team size), Monolithic Architecture (rejected due to poor separation of concerns and testing difficulties), and Event-Driven Architecture (rejected as unnecessary for current synchronous request-response patterns).

**Fig. 5.1 High-Level System Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Web Browser │  │    Mobile    │  │   Tablet     │          │
│  │   (Chrome,   │  │   Browser    │  │   Browser    │          │
│  │   Firefox)   │  │              │  │              │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         └─────────────────┴─────────────────┘                   │
│                           │                                      │
│                    HTTPS/HTTP                                    │
└───────────────────────────┼──────────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│  ┌─────────────────────────┴─────────────────────────┐          │
│  │           Flask Web Server (WSGI)                  │          │
│  │  ┌──────────────────────────────────────────────┐ │          │
│  │  │         Route Handlers (Controllers)         │ │          │
│  │  │  • Authentication  • Dashboard  • DTC Lookup │ │          │
│  │  │  • Trip Analysis   • Reports    • Admin      │ │          │
│  │  └────────────┬─────────────────────────────────┘ │          │
│  └───────────────┼────────────────────────────────────┘          │
│                  │                                                │
│  ┌───────────────┴────────────────────────────────────┐          │
│  │          Business Logic Services                    │          │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │          │
│  │  │ Fault        │  │ Data         │  │ Analytics│ │          │
│  │  │ Prediction   │  │ Processing   │  │ Engine   │ │          │
│  │  │ Engine       │  │ Service      │  │          │ │          │
│  │  └──────────────┘  └──────────────┘  └──────────┘ │          │
│  └────────────────────────────────────────────────────┘          │
└───────────────────────────┼──────────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────────┐
│                       DATA LAYER                                 │
│  ┌─────────────────────────┴─────────────────────────┐          │
│  │          Data Access Layer (DAL)                   │          │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │          │
│  │  │ User         │  │ DTC          │  │ Session  │ │          │
│  │  │ Repository   │  │ Repository   │  │ Manager  │ │          │
│  │  └──────┬───────┘  └──────┬───────┘  └────┬─────┘ │          │
│  └─────────┼──────────────────┼───────────────┼───────┘          │
│            │                  │               │                  │
│  ┌─────────┴──────────────────┴───────────────┴───────┐          │
│  │              Storage Layer                          │          │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │          │
│  │  │   JSON       │  │   MySQL      │  │ MongoDB  │ │          │
│  │  │   Files      │  │   Database   │  │ Database │ │          │
│  │  │ (Current)    │  │  (Planned)   │  │ (Planned)│ │          │
│  │  └──────────────┘  └──────────────┘  └──────────┘ │          │
│  └─────────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

**Fig. 5.2 Component Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND COMPONENTS                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Login      │  │   Dashboard  │  │  DTC Lookup  │          │
│  │   Page       │  │   Interface  │  │  Interface   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐          │
│  │   Vehicle    │  │     Trip     │  │   Analysis   │          │
│  │  Selection   │  │   Analysis   │  │  Statistics  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└───────────────────────────┼──────────────────────────────────────┘
                            │ HTTP Requests
┌───────────────────────────┼──────────────────────────────────────┐
│                    BACKEND COMPONENTS                            │
│  ┌─────────────────────────┴─────────────────────────┐          │
│  │         Authentication Module                      │          │
│  │  • User Login/Logout  • Session Management         │          │
│  │  • Role-Based Access  • Security Validation        │          │
│  └────────────────────────────────────────────────────┘          │
│                                                                   │
│  ┌────────────────────────────────────────────────────┐          │
│  │         Data Acquisition Module                    │          │
│  │  • CSV Import  • Web Scraping  • Data Validation   │          │
│  │  • Data Cleaning  • Unit Conversion                │          │
│  └────────────────────────────────────────────────────┘          │
│                                                                   │
│  ┌────────────────────────────────────────────────────┐          │
│  │         Fault Prediction Module                    │          │
│  │  • Pattern Recognition  • Threshold Analysis       │          │
│  │  • Fault Classification  • Confidence Scoring      │          │
│  └────────────────────────────────────────────────────┘          │
│                                                                   │
│  ┌────────────────────────────────────────────────────┐          │
│  │         Interactive Interface Module               │          │
│  │  • Template Rendering  • Search/Filter             │          │
│  │  • Real-time Updates  • Chart Display              │          │
│  └────────────────────────────────────────────────────┘          │
│                                                                   │
│  ┌────────────────────────────────────────────────────┐          │
│  │         Analytics & Reporting Module               │          │
│  │  • Trip Statistics  • Chart Generation             │          │
│  │  • Report Creation  • Data Export                  │          │
│  └────────────────────────────────────────────────────┘          │
│                                                                   │
│  ┌────────────────────────────────────────────────────┐          │
│  │         Database Management Module                 │          │
│  │  • CRUD Operations  • Query Optimization           │          │
│  │  • Data Integrity  • Backup/Recovery               │          │
│  └────────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

**Component Interactions and Communication**

     Components communicate through well-defined interfaces using standardized protocols. The Frontend Components send HTTP GET and POST requests to Backend Components through Flask routes. Backend Components interact with each other through function calls and shared data structures. The Database Management Module provides a consistent interface for data operations, abstracting storage details from other components.

     The Authentication Module acts as a gatekeeper, validating all requests before allowing access to protected resources. The Data Acquisition Module feeds processed data to both the Fault Prediction Module and Analytics Module. The Fault Prediction Module retrieves DTC information from the Database Module to provide detailed diagnostic recommendations. The Interactive Interface Module orchestrates interactions between all components to deliver cohesive user experiences.

## 5.2 Data Flow Diagrams

     Data Flow Diagrams (DFDs) provide a graphical representation of data movement through the system, showing how data is processed, transformed, and stored at different levels of abstraction. The DFD hierarchy begins with a context diagram showing the system boundary, then decomposes into progressively more detailed levels revealing internal processes.

**Fig. 5.3 Context Level DFD (Level 0)**

```
                    ┌─────────────────┐
                    │  Administrator  │
                    └────────┬────────┘
                             │
                    User Credentials
                    System Config
                             │
                             ▼
    ┌──────────┐    ┌────────────────┐    ┌──────────┐
    │Technician│───▶│   IAWFPIDM     │◀───│  Viewer  │
    └──────────┘    │    System      │    └──────────┘
         │          └────────────────┘          │
         │                  │                   │
    Vehicle Info       Diagnostic           View-Only
    Trip Data          Results              Access
    DTC Queries        Reports
         │                  │                   │
         ▼                  ▼                   ▼
    Fault Predictions  Analysis Charts    DTC Information
    DTC Details        Trip Statistics    Reports
    Reports            Recommendations
```

**Context Level Description**

     The context diagram shows the IAWFPIDM system as a single process interacting with three external entities: Administrator, Technician, and Viewer. Administrators provide user credentials and system configuration, receiving system status and audit logs. Technicians input vehicle information, trip data, and DTC queries, receiving fault predictions, DTC details, and diagnostic reports. Viewers have read-only access to DTC information and reports for educational or consultation purposes.

**Fig. 5.4 Level 1 DFD - Major Processes**

```
┌──────────┐                                           ┌──────────┐
│  Users   │                                           │ External │
│(Admin,   │                                           │   DTC    │
│Tech,View)│                                           │ Sources  │
└────┬─────┘                                           └────┬─────┘
     │                                                      │
     │ Login Credentials                          DTC Data │
     │                                                      │
     ▼                                                      ▼
┌─────────────────┐                              ┌─────────────────┐
│   Process 1     │                              │   Process 2     │
│ Authenticate    │                              │  Acquire and    │
│     User        │                              │  Preprocess     │
│                 │                              │     Data        │
└────────┬────────┘                              └────────┬────────┘
         │                                                │
         │ Session Token                        Cleaned Data
         │                                                │
         ▼                                                ▼
┌─────────────────┐         ┌──────────────┐    ┌─────────────────┐
│   Data Store    │◀────────│  Process 3   │───▶│   Data Store    │
│  User Sessions  │         │   Predict    │    │   DTC Database  │
└─────────────────┘         │   Faults     │    └─────────────────┘
                            │              │
                            └──────┬───────┘
                                   │
                          Fault Predictions
                                   │
                                   ▼
         ┌─────────────────────────┴─────────────────────────┐
         │                                                    │
         ▼                                                    ▼
┌─────────────────┐                              ┌─────────────────┐
│   Process 4     │                              │   Process 5     │
│   Generate      │                              │    Display      │
│   Interactive   │                              │   Diagnostic    │
│   Interface     │                              │    Results      │
└────────┬────────┘                              └────────┬────────┘
         │                                                │
         │ HTML Pages                          Dashboard Display
         │                                                │
         ▼                                                ▼
    ┌────────┐         Trip Data                    ┌────────┐
    │ Users  │◀────────────────────────────────────▶│ Users  │
    └────────┘                                       └────────┘
         │                                                │
         │ CSV Upload                                     │
         │                                                │
         ▼                                                │
┌─────────────────┐                                      │
│   Process 6     │                                      │
│   Analyze       │                                      │
│   Trip Data     │                                      │
│                 │                                      │
└────────┬────────┘                                      │
         │                                                │
         │ Charts & Statistics                           │
         └────────────────────────────────────────────────┘
```

**Level 1 Process Descriptions**

**Process 1 - Authenticate User**
- Input: Login credentials (username, password)
- Processing: Validate credentials against user database, create session token, assign role-based permissions
- Output: Session token stored in User Sessions data store, authentication status
- Data Stores: User Sessions (write), User Database (read)

**Process 2 - Acquire and Preprocess Data**
- Input: DTC data from external sources, CSV trip data from users
- Processing: Web scraping for DTC codes, CSV parsing, data validation, cleaning, unit conversion
- Output: Cleaned and structured data
- Data Stores: DTC Database (write), Trip Data Store (write)

**Process 3 - Predict Faults**
- Input: Real-time sensor data, vehicle information
- Processing: Pattern recognition, threshold analysis, fault classification, confidence scoring
- Output: Fault predictions with severity, impact assessment, recommendations
- Data Stores: DTC Database (read for code lookup)

**Process 4 - Generate Interactive Interface**
- Input: User requests, session information
- Processing: Template rendering, search/filter operations, real-time updates
- Output: HTML pages with dynamic content
- Data Stores: User Sessions (read), DTC Database (read)

**Process 5 - Display Diagnostic Results**
- Input: Fault predictions, DTC information, vehicle metrics
- Processing: Format data for display, apply styling, generate visualizations
- Output: Dashboard display with metrics, fault alerts, recommendations
- Data Stores: None (display only)

**Process 6 - Analyze Trip Data**
- Input: CSV trip data files
- Processing: Statistical calculations, chart generation, performance analysis
- Output: Trip statistics, four visualization charts, insights
- Data Stores: Trip Data Store (read)
