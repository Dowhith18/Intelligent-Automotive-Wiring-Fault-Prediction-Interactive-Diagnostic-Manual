# CHAPTER 6
# DATABASE DESIGN

---

## 6.1 ER Diagrams

     Entity-Relationship diagrams provide a conceptual representation of the database structure, showing entities, attributes, relationships, and constraints. The IAWFPIDM system employs a relational database design that supports user management, vehicle information, diagnostic sessions, fault records, and DTC code storage.

**Fig. 6.1 Conceptual ER Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONCEPTUAL ER DIAGRAM                         │
└─────────────────────────────────────────────────────────────────┘

        ┌──────────────┐
        │     USER     │
        ├──────────────┤
        │ *user_id     │
        │  username    │
        │  password    │
        │  email       │
        │  role        │
        │  created_at  │
        └──────┬───────┘
               │
               │ 1
               │
               │ creates
               │
               │ M
               ▼
        ┌──────────────┐         M        ┌──────────────┐
        │  DIAGNOSTIC  │─────────────────▶│   VEHICLE    │
        │   SESSION    │    involves      ├──────────────┤
        ├──────────────┤         1        │ *vehicle_id  │
        │*session_id   │                  │  vin         │
        │ user_id (FK) │                  │  make        │
        │ vehicle_id(FK)│                 │  model       │
        │ start_time   │                  │  year        │
        │ end_time     │                  │  engine_type │
        │ status       │                  └──────┬───────┘
        └──────┬───────┘                         │
               │                                 │
               │ 1                               │ 1
               │                                 │
               │ contains                        │ has
               │                                 │
               │ M                               │ M
               ▼                                 ▼
        ┌──────────────┐         M        ┌──────────────┐
        │    FAULT     │─────────────────▶│   DTC CODE   │
        │   RECORD     │   references     ├──────────────┤
        ├──────────────┤         1        │ *dtc_id      │
        │ *fault_id    │                  │  code        │
        │ session_id(FK)│                 │  description │
        │ vehicle_id(FK)│                 │  system      │
        │ dtc_code(FK) │                  │  severity    │
        │ severity     │                  │  symptoms    │
        │ confidence   │                  │  causes      │
        │ timestamp    │                  │  procedures  │
        └──────────────┘                  └──────────────┘

        ┌──────────────┐         1        ┌──────────────┐
        │   VEHICLE    │─────────────────▶│   WIRING     │
        │              │    has           │   DIAGRAM    │
        │              │         M        ├──────────────┤
        │              │                  │*diagram_id   │
        │              │                  │ vehicle_id(FK)│
        │              │                  │ system_name  │
        │              │                  │ diagram_path │
        │              │                  │ metadata     │
        └──────────────┘                  └──────────────┘

        ┌──────────────┐         M        ┌──────────────┐
        │   VEHICLE    │─────────────────▶│  TRIP DATA   │
        │              │    generates     ├──────────────┤
        │              │         1        │ *trip_id     │
        │              │                  │ vehicle_id(FK)│
        │              │                  │ trip_date    │
        │              │                  │ distance_km  │
        │              │                  │ duration_min │
        │              │                  │ avg_fuel_kmpl│
        │              │                  │ raw_data_json│
        └──────────────┘                  └──────────────┘

Legend:
  * = Primary Key
  (FK) = Foreign Key
  1 = One
  M = Many
  ─── = Relationship
```

**Cardinality and Participation Constraints**

     User to Diagnostic Session: One user can create many diagnostic sessions (1:M). Participation is partial for User (not all users must create sessions) and total for Diagnostic Session (every session must be created by a user).

     Diagnostic Session to Vehicle: One vehicle can be involved in many diagnostic sessions (1:M). Participation is partial for Vehicle (not all vehicles must have sessions) and total for Diagnostic Session (every session must involve a vehicle).

     Diagnostic Session to Fault Record: One diagnostic session can contain many fault records (1:M). Participation is partial for Diagnostic Session (sessions may have zero faults) and total for Fault Record (every fault must belong to a session).

     Fault Record to DTC Code: Many fault records can reference one DTC code (M:1). Participation is total for Fault Record (every fault must reference a DTC) and partial for DTC Code (not all codes must be referenced).

     Vehicle to Wiring Diagram: One vehicle can have many wiring diagrams (1:M). Participation is partial for both entities (not all vehicles have diagrams, not all diagrams must be assigned).

     Vehicle to Trip Data: One vehicle can generate many trip data records (1:M). Participation is partial for both entities.

**Fig. 6.2 Extended ER Diagram with Specialization**

```
┌─────────────────────────────────────────────────────────────────┐
│              EXTENDED ER DIAGRAM WITH SPECIALIZATION             │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │     USER     │
                    ├──────────────┤
                    │ *user_id     │
                    │  username    │
                    │  password    │
                    │  email       │
                    │  created_at  │
                    │  is_active   │
                    └──────┬───────┘
                           │
                           │ ISA (Disjoint, Total)
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ADMINISTRATOR │ │  TECHNICIAN  │ │    VIEWER    │
    ├──────────────┤ ├──────────────┤ ├──────────────┤
    │ admin_level  │ │certification │ │ access_level │
    │ permissions  │ │ specialization│ │ view_only    │
    └──────────────┘ └──────────────┘ └──────────────┘

                    ┌──────────────┐
                    │   VEHICLE    │
                    ├──────────────┤
                    │ *vehicle_id  │
                    │  vin         │
                    │  make        │
                    │  model       │
                    │  year        │
                    └──────┬───────┘
                           │
                           │ ISA (Overlapping, Partial)
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │   GASOLINE   │ │    DIESEL    │ │   ELECTRIC   │
    │   VEHICLE    │ │   VEHICLE    │ │   VEHICLE    │
    ├──────────────┤ ├──────────────┤ ├──────────────┤
    │ fuel_type    │ │ turbo_type   │ │ battery_cap  │
    │ octane_rating│ │ injection_sys│ │ motor_type   │
    └──────────────┘ └──────────────┘ └──────────────┘

                    ┌──────────────┐
                    │  FAULT TYPE  │
                    ├──────────────┤
                    │ *fault_type_id│
                    │  type_name   │
                    │  category    │
                    └──────┬───────┘
                           │
                           │ ISA (Disjoint, Total)
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │OPEN CIRCUIT  │ │SHORT TO GND  │ │SHORT TO PWR  │
    ├──────────────┤ ├──────────────┤ ├──────────────┤
    │ resistance   │ │ ground_point │ │ voltage_level│
    │ continuity   │ │ leakage_curr │ │ current_spike│
    └──────────────┘ └──────────────┘ └──────────────┘

Specialization Constraints:
  - User specialization: Disjoint (user can be only one type), Total (every user must be one type)
  - Vehicle specialization: Overlapping (hybrid vehicles), Partial (base vehicle info sufficient)
  - Fault Type specialization: Disjoint (fault is one type), Total (every fault has specific type)
```

**Fig. 6.3 Logical ER Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                      LOGICAL ER DIAGRAM                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│      User        │
├──────────────────┤
│ PK: user_id      │
│     username     │
│     password_hash│
│     email        │
│     role         │
│     is_active    │
│     created_at   │
│     updated_at   │
└────────┬─────────┘
         │
         │ 1:M
         │
         ▼
┌──────────────────┐         ┌──────────────────┐
│DiagnosticSession │    M:1  │     Vehicle      │
├──────────────────┤◀────────├──────────────────┤
│PK: session_id    │         │ PK: vehicle_id   │
│FK: user_id       │         │     vin          │
│FK: vehicle_id    │         │     make         │
│    start_time    │         │     model        │
│    end_time      │         │     year         │
│    status        │         │     engine_type  │
│    notes         │         │     created_at   │
└────────┬─────────┘         └────────┬─────────┘
         │                            │
         │ 1:M                        │ 1:M
         │                            │
         ▼                            ▼
┌──────────────────┐         ┌──────────────────┐
│   FaultRecord    │    M:1  │   WiringDiagram  │
├──────────────────┤────────▶├──────────────────┤
│PK: fault_id      │         │PK: diagram_id    │
│FK: session_id    │         │FK: vehicle_id    │
│FK: vehicle_id    │         │   system_name    │
│FK: dtc_code      │         │   diagram_path   │
│    fault_type    │         │   metadata_json  │
│    severity      │         │   created_at     │
│    confidence    │         └──────────────────┘
│    timestamp     │
│    description   │
└────────┬─────────┘
         │
         │ M:1
         │
         ▼
┌──────────────────┐
│     DTCCode      │
├──────────────────┤
│ PK: dtc_id       │
│ UK: code         │
│     description  │
│     system       │
│     severity     │
│     symptoms_json│
│     causes_json  │
│     procedures   │
│     created_at   │
└──────────────────┘

┌──────────────────┐
│    TripData      │
├──────────────────┤
│ PK: trip_id      │
│ FK: vehicle_id   │
│     trip_date    │
│     distance_km  │
│     duration_min │
│     avg_fuel_kmpl│
│     avg_speed_kmh│
│     fuel_liters  │
│     raw_data_json│
│     created_at   │
└──────────────────┘

┌──────────────────┐
│   AuditLog       │
├──────────────────┤
│ PK: log_id       │
│ FK: user_id      │
│     action       │
│     table_name   │
│     record_id    │
│     old_value    │
│     new_value    │
│     timestamp    │
│     ip_address   │
└──────────────────┘

Notation:
  PK = Primary Key
  FK = Foreign Key
  UK = Unique Key
  1:M = One-to-Many relationship
  M:1 = Many-to-One relationship
```

## 6.2 Database Schema

     The database schema defines the complete structure of all tables including column names, data types, constraints, and relationships. The schema is designed for MySQL 8.0 with support for JSON data types and modern SQL features.

**Table 6.1 User Table Schema**

| Column Name | Data Type | Key | Constraints | Description |
|-------------|-----------|-----|-------------|-------------|
| user_id | INT | PRIMARY KEY | AUTO_INCREMENT | Unique user identifier |
| username | VARCHAR(50) | UNIQUE | NOT NULL | User login name |
| email | VARCHAR(100) | UNIQUE | NOT NULL | User email address |
| password_hash | VARCHAR(255) | | NOT NULL | Bcrypt hashed password |
| role | ENUM('admin','technician','viewer') | | NOT NULL | User role for access control |
| is_active | BOOLEAN | | DEFAULT TRUE | Account active status |
| created_at | TIMESTAMP | | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | | ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |
| last_login | TIMESTAMP | | NULL | Last successful login |

**SQL CREATE Statement:**
```sql
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'technician', 'viewer') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Table 6.2 Vehicle Table Schema**

| Column Name | Data Type | Key | Constraints | Description |
|-------------|-----------|-----|-------------|-------------|
| vehicle_id | INT | PRIMARY KEY | AUTO_INCREMENT | Unique vehicle identifier |
| vin | VARCHAR(17) | UNIQUE | NOT NULL | Vehicle Identification Number |
| make | VARCHAR(50) | | NOT NULL | Vehicle manufacturer |
| model | VARCHAR(50) | | NOT NULL | Vehicle model name |
| year | INT | | NOT NULL, CHECK (year >= 1900 AND year <= 2100) | Manufacturing year |
| engine_type | VARCHAR(50) | | NULL | Engine type description |
| fuel_type | ENUM('gasoline','diesel','electric','hybrid') | | NULL | Fuel type |
| created_at | TIMESTAMP | | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**SQL CREATE Statement:**
```sql
CREATE TABLE Vehicle (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    vin VARCHAR(17) UNIQUE NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL CHECK (year >= 1900 AND year <= 2100),
    engine_type VARCHAR(50),
    fuel_type ENUM('gasoline', 'diesel', 'electric', 'hybrid'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_vin (vin),
    INDEX idx_make_model (make, model),
    INDEX idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Table 6.3 Fault Records Table Schema**

| Column Name | Data Type | Key | Constraints | Description |
|-------------|-----------|-----|-------------|-------------|
| fault_id | INT | PRIMARY KEY | AUTO_INCREMENT | Unique fault identifier |
| session_id | INT | FOREIGN KEY | REFERENCES DiagnosticSession(session_id) | Associated session |
| vehicle_id | INT | FOREIGN KEY | REFERENCES Vehicle(vehicle_id) | Associated vehicle |
| dtc_code | VARCHAR(10) | FOREIGN KEY | REFERENCES DTCCode(code) | Diagnostic trouble code |
| fault_type | ENUM('open_circuit','short_to_ground','short_to_power','intermittent') | | NOT NULL | Type of fault detected |
| severity | ENUM('low','medium','high','critical') | | NOT NULL | Fault severity level |
| confidence | DECIMAL(3,2) | | CHECK (confidence >= 0 AND confidence <= 1) | Prediction confidence 0-1 |
| description | TEXT | | NULL | Detailed fault description |
| timestamp | TIMESTAMP | | DEFAULT CURRENT_TIMESTAMP | Fault detection time |

**SQL CREATE Statement:**
```sql
CREATE TABLE Fault_Records (
    fault_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT,
    vehicle_id INT NOT NULL,
    dtc_code VARCHAR(10),
    fault_type ENUM('open_circuit', 'short_to_ground', 'short_to_power', 'intermittent') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES Diagnostic_Sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicle(vehicle_id) ON DELETE CASCADE,
    FOREIGN KEY (dtc_code) REFERENCES DTC_Codes(code) ON DELETE SET NULL,
    INDEX idx_session (session_id),
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_dtc (dtc_code),
    INDEX idx_severity (severity),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Table 6.4 Diagnostic Sessions Table Schema**

| Column Name | Data Type | Key | Constraints | Description |
|-------------|-----------|-----|-------------|-------------|
| session_id | INT | PRIMARY KEY | AUTO_INCREMENT | Unique session identifier |
| user_id | INT | FOREIGN KEY | REFERENCES User(user_id) | User who created session |
| vehicle_id | INT | FOREIGN KEY | REFERENCES Vehicle(vehicle_id) | Vehicle being diagnosed |
| start_time | TIMESTAMP | | NOT NULL | Session start timestamp |
| end_time | TIMESTAMP | | NULL | Session end timestamp |
| status | VARCHAR(20) | | DEFAULT 'active' | Session status |
| notes | TEXT | | NULL | Session notes |

**SQL CREATE Statement:**
```sql
CREATE TABLE Diagnostic_Sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    status VARCHAR(20) DEFAULT 'active',
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicle(vehicle_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_status (status),
    INDEX idx_start_time (start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Table 6.5 Wiring Diagrams Table Schema**

| Column Name | Data Type | Key | Constraints | Description |
|-------------|-----------|-----|-------------|-------------|
| diagram_id | INT | PRIMARY KEY | AUTO_INCREMENT | Unique diagram identifier |
| vehicle_id | INT | FOREIGN KEY | REFERENCES Vehicle(vehicle_id) | Associated vehicle |
| system_name | VARCHAR(100) | | NOT NULL | System name (Fuel, Ignition, etc) |
| diagram_path | VARCHAR(255) | | NOT NULL | File path to diagram image |
| metadata | JSON | | NULL | Additional diagram metadata |
| created_at | TIMESTAMP | | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**SQL CREATE Statement:**
```sql
CREATE TABLE Wiring_Diagrams (
    diagram_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    system_name VARCHAR(100) NOT NULL,
    diagram_path VARCHAR(255) NOT NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicle(vehicle_id) ON DELETE CASCADE,
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_system (system_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
