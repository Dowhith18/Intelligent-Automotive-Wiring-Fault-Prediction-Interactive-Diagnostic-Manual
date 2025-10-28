# CHAPTER 6 (Continued)
# DATABASE DESIGN

---

**Table 6.6 DTC Codes Table Schema**

| Column Name | Data Type | Key | Constraints | Description |
|-------------|-----------|-----|-------------|-------------|
| dtc_id | INT | PRIMARY KEY | AUTO_INCREMENT | Unique DTC identifier |
| code | VARCHAR(10) | UNIQUE | NOT NULL | DTC code (e.g., P062700) |
| description | VARCHAR(255) | | NOT NULL | Short code description |
| system | VARCHAR(50) | | NOT NULL | Affected system |
| severity | ENUM('low','medium','high') | | NOT NULL | Code severity |
| symptoms | JSON | | NULL | Array of symptoms |
| causes | JSON | | NULL | Array of potential causes |
| diagnostic_procedures | TEXT | | NULL | Step-by-step procedures |
| created_at | TIMESTAMP | | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**SQL CREATE Statement:**
```sql
CREATE TABLE DTC_Codes (
    dtc_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    system VARCHAR(50) NOT NULL,
    severity ENUM('low', 'medium', 'high') NOT NULL,
    symptoms JSON,
    causes JSON,
    diagnostic_procedures TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_system (system),
    INDEX idx_severity (severity),
    FULLTEXT idx_description (description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Table 6.7 Trip Data Table Schema**

| Column Name | Data Type | Key | Constraints | Description |
|-------------|-----------|-----|-------------|-------------|
| trip_id | INT | PRIMARY KEY | AUTO_INCREMENT | Unique trip identifier |
| vehicle_id | INT | FOREIGN KEY | REFERENCES Vehicle(vehicle_id) | Associated vehicle |
| trip_date | DATE | | NOT NULL | Trip date |
| distance_km | DECIMAL(10,2) | | CHECK (distance_km >= 0) | Distance in kilometers |
| duration_minutes | INT | | CHECK (duration_minutes >= 0) | Trip duration |
| avg_fuel_kmpl | DECIMAL(5,2) | | CHECK (avg_fuel_kmpl >= 0) | Average fuel efficiency |
| avg_speed_kmh | DECIMAL(5,2) | | CHECK (avg_speed_kmh >= 0) | Average speed |
| fuel_consumed_liters | DECIMAL(8,2) | | CHECK (fuel_consumed_liters >= 0) | Fuel consumed |
| raw_data_json | JSON | | NULL | Complete trip data |
| created_at | TIMESTAMP | | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**SQL CREATE Statement:**
```sql
CREATE TABLE Trip_Data (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    trip_date DATE NOT NULL,
    distance_km DECIMAL(10,2) CHECK (distance_km >= 0),
    duration_minutes INT CHECK (duration_minutes >= 0),
    avg_fuel_kmpl DECIMAL(5,2) CHECK (avg_fuel_kmpl >= 0),
    avg_speed_kmh DECIMAL(5,2) CHECK (avg_speed_kmh >= 0),
    fuel_consumed_liters DECIMAL(8,2) CHECK (fuel_consumed_liters >= 0),
    raw_data_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES Vehicle(vehicle_id) ON DELETE CASCADE,
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_trip_date (trip_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Table 6.8 Audit Log Table Schema**

| Column Name | Data Type | Key | Constraints | Description |
|-------------|-----------|-----|-------------|-------------|
| log_id | BIGINT | PRIMARY KEY | AUTO_INCREMENT | Unique log identifier |
| user_id | INT | FOREIGN KEY | REFERENCES User(user_id) | User who performed action |
| action | VARCHAR(50) | | NOT NULL | Action performed |
| table_name | VARCHAR(50) | | NOT NULL | Affected table |
| record_id | INT | | NULL | Affected record ID |
| old_value | JSON | | NULL | Previous value |
| new_value | JSON | | NULL | New value |
| timestamp | TIMESTAMP | | DEFAULT CURRENT_TIMESTAMP | Action timestamp |
| ip_address | VARCHAR(45) | | NULL | User IP address |

**SQL CREATE Statement:**
```sql
CREATE TABLE Audit_Log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT,
    old_value JSON,
    new_value JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_table (table_name),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 6.3 Functional Dependencies

     Functional dependencies define relationships between attributes where one set of attributes uniquely determines another set. Understanding functional dependencies is essential for database normalization and ensuring data integrity.

**Functional Dependencies by Table**

**User Table:**
- user_id → username, email, password_hash, role, is_active, created_at, updated_at, last_login
- username → user_id, email, password_hash, role, is_active, created_at, updated_at, last_login
- email → user_id, username, password_hash, role, is_active, created_at, updated_at, last_login

**Vehicle Table:**
- vehicle_id → vin, make, model, year, engine_type, fuel_type, created_at
- vin → vehicle_id, make, model, year, engine_type, fuel_type, created_at

**Diagnostic Sessions Table:**
- session_id → user_id, vehicle_id, start_time, end_time, status, notes
- (user_id, vehicle_id, start_time) → session_id (candidate key for uniqueness)

**Fault Records Table:**
- fault_id → session_id, vehicle_id, dtc_code, fault_type, severity, confidence, description, timestamp
- (session_id, dtc_code, timestamp) → fault_id (composite candidate key)

**DTC Codes Table:**
- dtc_id → code, description, system, severity, symptoms, causes, diagnostic_procedures, created_at
- code → dtc_id, description, system, severity, symptoms, causes, diagnostic_procedures, created_at

**Trip Data Table:**
- trip_id → vehicle_id, trip_date, distance_km, duration_minutes, avg_fuel_kmpl, avg_speed_kmh, fuel_consumed_liters, raw_data_json, created_at
- (vehicle_id, trip_date, created_at) → trip_id (composite candidate key)

**Normalization Process**

**First Normal Form (1NF) - Eliminate Repeating Groups**

     Initial unnormalized design had repeating groups that violated 1NF. For example, the User table initially stored multiple roles as comma-separated values in a single column.

Before 1NF:
```
User (user_id, username, email, password, roles)
Example: (1, 'john', 'john@email.com', 'hash', 'admin,technician')
```

After 1NF:
```
User (user_id, username, email, password, role)
Example: (1, 'john', 'john@email.com', 'hash', 'admin')
```

     The DTC Codes table initially stored symptoms and causes as comma-separated text. This was normalized by using JSON arrays, which maintain atomicity while allowing multiple values.

Before 1NF:
```
DTC_Codes (dtc_id, code, symptoms)
Example: (1, 'P062700', 'Engine won't start, Fuel pump not running')
```

After 1NF:
```
DTC_Codes (dtc_id, code, symptoms)
Example: (1, 'P062700', '["Engine won't start", "Fuel pump not running"]')
```

**Second Normal Form (2NF) - Eliminate Partial Dependencies**

     2NF requires that all non-key attributes are fully functionally dependent on the entire primary key. This applies to tables with composite primary keys.

Before 2NF (Fault Records with composite key):
```
Fault_Records (session_id, dtc_code, timestamp, vehicle_id, severity, description)
Primary Key: (session_id, dtc_code, timestamp)
Partial Dependency: vehicle_id depends only on session_id, not the full key
```

After 2NF:
```
Fault_Records (fault_id, session_id, vehicle_id, dtc_code, fault_type, severity, timestamp, description)
Primary Key: fault_id
vehicle_id is now fully dependent on fault_id
```

     The Diagnostic Sessions table was analyzed for partial dependencies. Initially, vehicle information (make, model, year) was stored directly in the sessions table.

Before 2NF:
```
Diagnostic_Sessions (session_id, user_id, vehicle_id, vin, make, model, year, start_time)
Partial Dependency: make, model, year depend on vehicle_id, not session_id
```

After 2NF:
```
Diagnostic_Sessions (session_id, user_id, vehicle_id, start_time, end_time, status)
Vehicle (vehicle_id, vin, make, model, year, engine_type)
```

**Third Normal Form (3NF) - Eliminate Transitive Dependencies**

     3NF requires that no non-key attribute depends on another non-key attribute (transitive dependency).

Before 3NF (Vehicle table with transitive dependency):
```
Vehicle (vehicle_id, vin, make, model, year, manufacturer_country, manufacturer_hq)
Transitive Dependency: manufacturer_country → manufacturer_hq
```

After 3NF:
```
Vehicle (vehicle_id, vin, make, model, year, manufacturer_id)
Manufacturer (manufacturer_id, name, country, headquarters)
```

     The Fault Records table was analyzed for transitive dependencies. Initially, DTC description and severity were stored in the fault record.

Before 3NF:
```
Fault_Records (fault_id, dtc_code, dtc_description, dtc_severity, fault_severity)
Transitive Dependency: dtc_code → dtc_description, dtc_severity
```

After 3NF:
```
Fault_Records (fault_id, dtc_code, fault_type, severity, confidence)
DTC_Codes (dtc_id, code, description, system, severity)
```

**Boyce-Codd Normal Form (BCNF) - Every Determinant is a Candidate Key**

     BCNF is a stricter version of 3NF where every determinant must be a candidate key. All tables in the IAWFPIDM database meet BCNF requirements.

Verification for User table:
- Determinants: user_id, username, email
- All determinants are candidate keys (unique constraints)
- BCNF satisfied

Verification for Vehicle table:
- Determinants: vehicle_id, vin
- Both are candidate keys (primary and unique)
- BCNF satisfied

Verification for DTC_Codes table:
- Determinants: dtc_id, code
- Both are candidate keys
- BCNF satisfied

**Denormalization Decisions**

     While the database is normalized to BCNF, strategic denormalization was applied in specific cases for performance optimization:

1. **Trip Data raw_data_json**: Stores complete trip data in JSON format alongside calculated statistics. This denormalization enables quick access to raw data without complex joins while maintaining calculated summaries for fast queries.

2. **DTC Codes symptoms and causes**: Stored as JSON arrays rather than separate tables. This denormalization reduces join complexity for the common use case of displaying complete DTC information.

3. **Audit Log old_value and new_value**: Stores complete record snapshots as JSON. This denormalization enables complete audit trail without complex reconstruction from multiple tables.

## 6.4 Stored Procedures

     Stored procedures encapsulate complex database operations, improve performance through precompilation, and enforce business logic at the database level.

**Stored Procedure 1: sp_AuthenticateUser**

Purpose: Authenticates user credentials and updates last login timestamp.

```sql
DELIMITER //

CREATE PROCEDURE sp_AuthenticateUser(
    IN p_username VARCHAR(50),
    IN p_password_hash VARCHAR(255),
    OUT p_user_id INT,
    OUT p_role VARCHAR(20),
    OUT p_is_active BOOLEAN,
    OUT p_auth_result VARCHAR(50)
)
BEGIN
    DECLARE v_stored_hash VARCHAR(255);
    DECLARE v_user_count INT;
    
    -- Check if user exists
    SELECT COUNT(*) INTO v_user_count
    FROM User
    WHERE username = p_username;
    
    IF v_user_count = 0 THEN
        SET p_auth_result = 'USER_NOT_FOUND';
        SET p_user_id = NULL;
        SET p_role = NULL;
        SET p_is_active = FALSE;
    ELSE
        -- Get user details
        SELECT user_id, password_hash, role, is_active
        INTO p_user_id, v_stored_hash, p_role, p_is_active
        FROM User
        WHERE username = p_username;
        
        -- Check if account is active
        IF p_is_active = FALSE THEN
            SET p_auth_result = 'ACCOUNT_INACTIVE';
        -- Verify password
        ELSEIF v_stored_hash = p_password_hash THEN
            SET p_auth_result = 'SUCCESS';
            -- Update last login
            UPDATE User
            SET last_login = CURRENT_TIMESTAMP
            WHERE user_id = p_user_id;
        ELSE
            SET p_auth_result = 'INVALID_PASSWORD';
            SET p_user_id = NULL;
            SET p_role = NULL;
        END IF;
    END IF;
END //

DELIMITER ;
```

**Stored Procedure 2: sp_CreateDiagnosticSession**

Purpose: Creates a new diagnostic session and returns session ID.

```sql
DELIMITER //

CREATE PROCEDURE sp_CreateDiagnosticSession(
    IN p_user_id INT,
    IN p_vehicle_id INT,
    IN p_notes TEXT,
    OUT p_session_id INT,
    OUT p_result VARCHAR(50)
)
BEGIN
    DECLARE v_user_exists INT;
    DECLARE v_vehicle_exists INT;
    
    -- Validate user exists
    SELECT COUNT(*) INTO v_user_exists
    FROM User
    WHERE user_id = p_user_id AND is_active = TRUE;
    
    -- Validate vehicle exists
    SELECT COUNT(*) INTO v_vehicle_exists
    FROM Vehicle
    WHERE vehicle_id = p_vehicle_id;
    
    IF v_user_exists = 0 THEN
        SET p_result = 'INVALID_USER';
        SET p_session_id = NULL;
    ELSEIF v_vehicle_exists = 0 THEN
        SET p_result = 'INVALID_VEHICLE';
        SET p_session_id = NULL;
    ELSE
        -- Create session
        INSERT INTO Diagnostic_Sessions (user_id, vehicle_id, start_time, status, notes)
        VALUES (p_user_id, p_vehicle_id, CURRENT_TIMESTAMP, 'active', p_notes);
        
        SET p_session_id = LAST_INSERT_ID();
        SET p_result = 'SUCCESS';
    END IF;
END //

DELIMITER ;
```

**Stored Procedure 3: sp_InsertFaultRecord**

Purpose: Inserts fault record with validation and returns fault ID.

```sql
DELIMITER //

CREATE PROCEDURE sp_InsertFaultRecord(
    IN p_session_id INT,
    IN p_vehicle_id INT,
    IN p_dtc_code VARCHAR(10),
    IN p_fault_type VARCHAR(50),
    IN p_severity VARCHAR(20),
    IN p_confidence DECIMAL(3,2),
    IN p_description TEXT,
    OUT p_fault_id INT,
    OUT p_result VARCHAR(50)
)
BEGIN
    DECLARE v_session_exists INT;
    DECLARE v_dtc_exists INT;
    
    -- Validate session exists and is active
    SELECT COUNT(*) INTO v_session_exists
    FROM Diagnostic_Sessions
    WHERE session_id = p_session_id AND status = 'active';
    
    -- Validate DTC code exists
    SELECT COUNT(*) INTO v_dtc_exists
    FROM DTC_Codes
    WHERE code = p_dtc_code;
    
    IF v_session_exists = 0 THEN
        SET p_result = 'INVALID_SESSION';
        SET p_fault_id = NULL;
    ELSEIF v_dtc_exists = 0 THEN
        SET p_result = 'INVALID_DTC_CODE';
        SET p_fault_id = NULL;
    ELSEIF p_confidence < 0 OR p_confidence > 1 THEN
        SET p_result = 'INVALID_CONFIDENCE';
        SET p_fault_id = NULL;
    ELSE
        -- Insert fault record
        INSERT INTO Fault_Records (
            session_id, vehicle_id, dtc_code, fault_type, 
            severity, confidence, description, timestamp
        )
        VALUES (
            p_session_id, p_vehicle_id, p_dtc_code, p_fault_type,
            p_severity, p_confidence, p_description, CURRENT_TIMESTAMP
        );
        
        SET p_fault_id = LAST_INSERT_ID();
        SET p_result = 'SUCCESS';
    END IF;
END //

DELIMITER ;
```

**Stored Procedure 4: sp_EndDiagnosticSession**

Purpose: Closes diagnostic session and updates status.

```sql
DELIMITER //

CREATE PROCEDURE sp_EndDiagnosticSession(
    IN p_session_id INT,
    IN p_final_notes TEXT,
    OUT p_result VARCHAR(50)
)
BEGIN
    DECLARE v_session_exists INT;
    DECLARE v_fault_count INT;
    
    -- Validate session exists
    SELECT COUNT(*) INTO v_session_exists
    FROM Diagnostic_Sessions
    WHERE session_id = p_session_id;
    
    IF v_session_exists = 0 THEN
        SET p_result = 'SESSION_NOT_FOUND';
    ELSE
        -- Count faults in session
        SELECT COUNT(*) INTO v_fault_count
        FROM Fault_Records
        WHERE session_id = p_session_id;
        
        -- Update session
        UPDATE Diagnostic_Sessions
        SET end_time = CURRENT_TIMESTAMP,
            status = 'completed',
            notes = CONCAT(COALESCE(notes, ''), '\n', COALESCE(p_final_notes, ''))
        WHERE session_id = p_session_id;
        
        SET p_result = CONCAT('SUCCESS: ', v_fault_count, ' faults recorded');
    END IF;
END //

DELIMITER ;
```

**Stored Procedure 5: sp_GetVehicleFaultHistory**

Purpose: Retrieves complete fault history for a vehicle.

```sql
DELIMITER //

CREATE PROCEDURE sp_GetVehicleFaultHistory(
    IN p_vehicle_id INT,
    IN p_limit INT
)
BEGIN
    SELECT 
        fr.fault_id,
        fr.dtc_code,
        dtc.description AS dtc_description,
        fr.fault_type,
        fr.severity,
        fr.confidence,
        fr.timestamp,
        ds.session_id,
        ds.start_time AS session_start,
        u.username AS technician
    FROM Fault_Records fr
    JOIN DTC_Codes dtc ON fr.dtc_code = dtc.code
    JOIN Diagnostic_Sessions ds ON fr.session_id = ds.session_id
    JOIN User u ON ds.user_id = u.user_id
    WHERE fr.vehicle_id = p_vehicle_id
    ORDER BY fr.timestamp DESC
    LIMIT p_limit;
END //

DELIMITER ;
```
