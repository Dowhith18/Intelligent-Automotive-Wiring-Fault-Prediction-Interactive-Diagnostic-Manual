# CHAPTER 6 (Continued)
# DATABASE DESIGN

---

**Trigger 1: trg_audit_user_changes**

Purpose: Automatically logs all changes to User table for security auditing.

```sql
DELIMITER //

CREATE TRIGGER trg_audit_user_changes
AFTER UPDATE ON User
FOR EACH ROW
BEGIN
    INSERT INTO Audit_Log (
        user_id, action, table_name, record_id, 
        old_value, new_value, timestamp
    )
    VALUES (
        NEW.user_id,
        'UPDATE',
        'User',
        NEW.user_id,
        JSON_OBJECT(
            'username', OLD.username,
            'email', OLD.email,
            'role', OLD.role,
            'is_active', OLD.is_active
        ),
        JSON_OBJECT(
            'username', NEW.username,
            'email', NEW.email,
            'role', NEW.role,
            'is_active', NEW.is_active
        ),
        CURRENT_TIMESTAMP
    );
END //

DELIMITER ;
```

**Trigger 2: trg_update_session_status**

Purpose: Automatically updates session status when end_time is set.

```sql
DELIMITER //

CREATE TRIGGER trg_update_session_status
BEFORE UPDATE ON Diagnostic_Sessions
FOR EACH ROW
BEGIN
    IF NEW.end_time IS NOT NULL AND OLD.end_time IS NULL THEN
        SET NEW.status = 'completed';
    END IF;
END //

DELIMITER ;
```

**Trigger 3: trg_validate_vin**

Purpose: Validates VIN format before inserting vehicle record.

```sql
DELIMITER //

CREATE TRIGGER trg_validate_vin
BEFORE INSERT ON Vehicle
FOR EACH ROW
BEGIN
    DECLARE vin_length INT;
    
    SET vin_length = CHAR_LENGTH(NEW.vin);
    
    IF vin_length != 17 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'VIN must be exactly 17 characters';
    END IF;
    
    IF NEW.vin REGEXP '[^A-HJ-NPR-Z0-9]' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'VIN contains invalid characters';
    END IF;
END //

DELIMITER ;
```

**Function 1: fn_CalculateSessionDuration**

Purpose: Calculates duration of diagnostic session in minutes.

```sql
DELIMITER //

CREATE FUNCTION fn_CalculateSessionDuration(
    p_session_id INT
)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_duration INT;
    DECLARE v_start TIMESTAMP;
    DECLARE v_end TIMESTAMP;
    
    SELECT start_time, end_time
    INTO v_start, v_end
    FROM Diagnostic_Sessions
    WHERE session_id = p_session_id;
    
    IF v_end IS NULL THEN
        SET v_duration = TIMESTAMPDIFF(MINUTE, v_start, CURRENT_TIMESTAMP);
    ELSE
        SET v_duration = TIMESTAMPDIFF(MINUTE, v_start, v_end);
    END IF;
    
    RETURN v_duration;
END //

DELIMITER ;
```

**Function 2: fn_GetVehicleFaultCount**

Purpose: Returns total number of faults recorded for a vehicle.

```sql
DELIMITER //

CREATE FUNCTION fn_GetVehicleFaultCount(
    p_vehicle_id INT
)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_count INT;
    
    SELECT COUNT(*)
    INTO v_count
    FROM Fault_Records
    WHERE vehicle_id = p_vehicle_id;
    
    RETURN v_count;
END //

DELIMITER ;
```

**Cursor Example: Process All Active Sessions**

Purpose: Demonstrates cursor usage for batch processing.

```sql
DELIMITER //

CREATE PROCEDURE sp_ProcessActiveSessions()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_session_id INT;
    DECLARE v_start_time TIMESTAMP;
    DECLARE v_duration INT;
    
    DECLARE session_cursor CURSOR FOR
        SELECT session_id, start_time
        FROM Diagnostic_Sessions
        WHERE status = 'active';
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN session_cursor;
    
    read_loop: LOOP
        FETCH session_cursor INTO v_session_id, v_start_time;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Calculate duration
        SET v_duration = TIMESTAMPDIFF(MINUTE, v_start_time, CURRENT_TIMESTAMP);
        
        -- Auto-close sessions older than 24 hours
        IF v_duration > 1440 THEN
            UPDATE Diagnostic_Sessions
            SET end_time = CURRENT_TIMESTAMP,
                status = 'auto_closed',
                notes = CONCAT(COALESCE(notes, ''), '\nAuto-closed after 24 hours')
            WHERE session_id = v_session_id;
        END IF;
    END LOOP;
    
    CLOSE session_cursor;
END //

DELIMITER ;
```

## 6.5 Database Indexes

     Indexes improve query performance by creating data structures that enable fast data retrieval. Strategic index design balances query performance against insert/update overhead and storage requirements.

**Primary Key Indexes**

     All tables have primary key indexes automatically created by the database engine. These clustered indexes determine physical data storage order and provide fastest access by primary key.

- User(user_id) - Clustered index
- Vehicle(vehicle_id) - Clustered index
- Diagnostic_Sessions(session_id) - Clustered index
- Fault_Records(fault_id) - Clustered index
- DTC_Codes(dtc_id) - Clustered index
- Trip_Data(trip_id) - Clustered index
- Wiring_Diagrams(diagram_id) - Clustered index
- Audit_Log(log_id) - Clustered index

**Unique Indexes**

     Unique indexes enforce uniqueness constraints while providing fast lookup capabilities.

```sql
-- User table unique indexes
CREATE UNIQUE INDEX idx_user_username ON User(username);
CREATE UNIQUE INDEX idx_user_email ON User(email);

-- Vehicle table unique index
CREATE UNIQUE INDEX idx_vehicle_vin ON Vehicle(vin);

-- DTC_Codes table unique index
CREATE UNIQUE INDEX idx_dtc_code ON DTC_Codes(code);
```

**Foreign Key Indexes**

     Foreign key columns are indexed to optimize join operations and maintain referential integrity efficiently.

```sql
-- Diagnostic_Sessions foreign key indexes
CREATE INDEX idx_session_user ON Diagnostic_Sessions(user_id);
CREATE INDEX idx_session_vehicle ON Diagnostic_Sessions(vehicle_id);

-- Fault_Records foreign key indexes
CREATE INDEX idx_fault_session ON Fault_Records(session_id);
CREATE INDEX idx_fault_vehicle ON Fault_Records(vehicle_id);
CREATE INDEX idx_fault_dtc ON Fault_Records(dtc_code);

-- Trip_Data foreign key index
CREATE INDEX idx_trip_vehicle ON Trip_Data(vehicle_id);

-- Wiring_Diagrams foreign key index
CREATE INDEX idx_diagram_vehicle ON Wiring_Diagrams(vehicle_id);

-- Audit_Log foreign key index
CREATE INDEX idx_audit_user ON Audit_Log(user_id);
```

**Composite Indexes**

     Composite indexes optimize queries filtering on multiple columns.

```sql
-- Vehicle search by make and model
CREATE INDEX idx_vehicle_make_model ON Vehicle(make, model);

-- Session search by user and date
CREATE INDEX idx_session_user_date ON Diagnostic_Sessions(user_id, start_time);

-- Fault search by vehicle and severity
CREATE INDEX idx_fault_vehicle_severity ON Fault_Records(vehicle_id, severity);

-- Fault search by vehicle and timestamp
CREATE INDEX idx_fault_vehicle_time ON Fault_Records(vehicle_id, timestamp DESC);

-- Trip data by vehicle and date
CREATE INDEX idx_trip_vehicle_date ON Trip_Data(vehicle_id, trip_date DESC);
```

**Covering Indexes**

     Covering indexes include all columns needed by specific queries, eliminating table lookups.

```sql
-- Cover common user lookup query
CREATE INDEX idx_user_auth_cover ON User(username, password_hash, role, is_active);

-- Cover DTC lookup query
CREATE INDEX idx_dtc_lookup_cover ON DTC_Codes(code, description, system, severity);

-- Cover session summary query
CREATE INDEX idx_session_summary_cover ON Diagnostic_Sessions(
    vehicle_id, start_time, end_time, status
);
```

**Full-Text Indexes**

     Full-text indexes enable efficient text searching in large text columns.

```sql
-- Full-text search on DTC descriptions
CREATE FULLTEXT INDEX idx_dtc_description_fulltext ON DTC_Codes(description);

-- Full-text search on diagnostic procedures
CREATE FULLTEXT INDEX idx_dtc_procedures_fulltext ON DTC_Codes(diagnostic_procedures);

-- Full-text search on session notes
CREATE FULLTEXT INDEX idx_session_notes_fulltext ON Diagnostic_Sessions(notes);
```

**Index Usage Examples**

Query 1: Find user by username (uses idx_user_username)
```sql
SELECT user_id, role, is_active
FROM User
WHERE username = 'tech_john';
```

Query 2: Get vehicle fault history (uses idx_fault_vehicle_time)
```sql
SELECT fault_id, dtc_code, severity, timestamp
FROM Fault_Records
WHERE vehicle_id = 123
ORDER BY timestamp DESC
LIMIT 10;
```

Query 3: Search DTC by description (uses idx_dtc_description_fulltext)
```sql
SELECT code, description, severity
FROM DTC_Codes
WHERE MATCH(description) AGAINST('fuel pump' IN NATURAL LANGUAGE MODE);
```

**Index Maintenance**

     Regular index maintenance ensures optimal performance.

```sql
-- Analyze table statistics
ANALYZE TABLE User, Vehicle, Diagnostic_Sessions, Fault_Records, DTC_Codes;

-- Optimize tables to reclaim space and rebuild indexes
OPTIMIZE TABLE User, Vehicle, Diagnostic_Sessions, Fault_Records;

-- Check index usage statistics
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    SEQ_IN_INDEX,
    COLUMN_NAME,
    CARDINALITY
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'iawfpidm'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;
```

## 6.6 Database Security

     Database security encompasses access control, encryption, backup strategies, and security measures to protect sensitive diagnostic data and user information.

**Access Control and User Privileges**

     Database access is controlled through role-based privileges with principle of least privilege.

**Application User (Limited Privileges)**
```sql
-- Create application database user
CREATE USER 'iawfpidm_app'@'localhost' IDENTIFIED BY 'secure_password_here';

-- Grant necessary privileges
GRANT SELECT, INSERT, UPDATE ON iawfpidm.User TO 'iawfpidm_app'@'localhost';
GRANT SELECT, INSERT, UPDATE ON iawfpidm.Vehicle TO 'iawfpidm_app'@'localhost';
GRANT SELECT, INSERT, UPDATE ON iawfpidm.Diagnostic_Sessions TO 'iawfpidm_app'@'localhost';
GRANT SELECT, INSERT ON iawfpidm.Fault_Records TO 'iawfpidm_app'@'localhost';
GRANT SELECT ON iawfpidm.DTC_Codes TO 'iawfpidm_app'@'localhost';
GRANT SELECT, INSERT ON iawfpidm.Trip_Data TO 'iawfpidm_app'@'localhost';
GRANT SELECT ON iawfpidm.Wiring_Diagrams TO 'iawfpidm_app'@'localhost';
GRANT INSERT ON iawfpidm.Audit_Log TO 'iawfpidm_app'@'localhost';

-- Grant execute on stored procedures
GRANT EXECUTE ON PROCEDURE iawfpidm.sp_AuthenticateUser TO 'iawfpidm_app'@'localhost';
GRANT EXECUTE ON PROCEDURE iawfpidm.sp_CreateDiagnosticSession TO 'iawfpidm_app'@'localhost';
GRANT EXECUTE ON PROCEDURE iawfpidm.sp_InsertFaultRecord TO 'iawfpidm_app'@'localhost';

FLUSH PRIVILEGES;
```

**Admin User (Full Privileges)**
```sql
-- Create admin database user
CREATE USER 'iawfpidm_admin'@'localhost' IDENTIFIED BY 'admin_secure_password';

-- Grant all privileges
GRANT ALL PRIVILEGES ON iawfpidm.* TO 'iawfpidm_admin'@'localhost';

FLUSH PRIVILEGES;
```

**Read-Only User (Reporting)**
```sql
-- Create read-only user for reporting
CREATE USER 'iawfpidm_readonly'@'localhost' IDENTIFIED BY 'readonly_password';

-- Grant select only
GRANT SELECT ON iawfpidm.* TO 'iawfpidm_readonly'@'localhost';

FLUSH PRIVILEGES;
```

**Data Encryption**

**Encryption at Rest**

     MySQL 8.0 supports transparent data encryption (TDE) for tablespace encryption.

```sql
-- Enable encryption for sensitive tables
ALTER TABLE User ENCRYPTION='Y';
ALTER TABLE Diagnostic_Sessions ENCRYPTION='Y';
ALTER TABLE Fault_Records ENCRYPTION='Y';
ALTER TABLE Audit_Log ENCRYPTION='Y';
```

**Encryption in Transit**

     SSL/TLS encryption for client-server communication.

```sql
-- Require SSL for application user
ALTER USER 'iawfpidm_app'@'localhost' REQUIRE SSL;

-- Verify SSL status
SHOW STATUS LIKE 'Ssl_cipher';
```

**Password Hashing**

     User passwords are hashed using bcrypt before storage.

```python
# Python implementation using bcrypt
import bcrypt

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
```

**Backup Strategies**

**Full Backup (Daily)**

```bash
#!/bin/bash
# Daily full backup script

BACKUP_DIR="/var/backups/mysql/iawfpidm"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/full_backup_$DATE.sql.gz"

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Perform full backup with compression
mysqldump --user=iawfpidm_admin \
          --password=admin_secure_password \
          --single-transaction \
          --routines \
          --triggers \
          --events \
          --databases iawfpidm \
          | gzip > $BACKUP_FILE

# Verify backup
if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_FILE"
    # Delete backups older than 30 days
    find $BACKUP_DIR -name "full_backup_*.sql.gz" -mtime +30 -delete
else
    echo "Backup failed!"
    exit 1
fi
```

**Incremental Backup (Hourly)**

```bash
#!/bin/bash
# Hourly incremental backup using binary logs

BACKUP_DIR="/var/backups/mysql/iawfpidm/incremental"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Flush logs and backup binary logs
mysql --user=iawfpidm_admin \
      --password=admin_secure_password \
      --execute="FLUSH LOGS"

# Copy binary logs to backup directory
cp /var/lib/mysql/mysql-bin.* $BACKUP_DIR/

# Delete incremental backups older than 7 days
find $BACKUP_DIR -name "mysql-bin.*" -mtime +7 -delete
```

**Backup Restoration**

```bash
#!/bin/bash
# Restore from full backup

BACKUP_FILE="/var/backups/mysql/iawfpidm/full_backup_20240115_020000.sql.gz"

# Decompress and restore
gunzip < $BACKUP_FILE | mysql --user=iawfpidm_admin \
                              --password=admin_secure_password \
                              iawfpidm

echo "Database restored from $BACKUP_FILE"
```

**Security Measures**

**SQL Injection Prevention**

     Use parameterized queries and prepared statements.

```python
# Python example using parameterized queries
import mysql.connector

def get_user_by_username(username: str):
    conn = mysql.connector.connect(
        host='localhost',
        user='iawfpidm_app',
        password='secure_password',
        database='iawfpidm'
    )
    cursor = conn.cursor(dictionary=True)
    
    # Parameterized query prevents SQL injection
    query = "SELECT user_id, username, role FROM User WHERE username = %s"
    cursor.execute(query, (username,))
    
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    
    return result
```

**Audit Logging**

     All sensitive operations are logged in Audit_Log table.

```sql
-- Query audit log for security analysis
SELECT 
    al.log_id,
    u.username,
    al.action,
    al.table_name,
    al.timestamp,
    al.ip_address
FROM Audit_Log al
LEFT JOIN User u ON al.user_id = u.user_id
WHERE al.timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY al.timestamp DESC;
```

**Database Firewall Rules**

     Restrict database access to application servers only.

```sql
-- Allow connections only from application server
CREATE USER 'iawfpidm_app'@'192.168.1.100' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE ON iawfpidm.* TO 'iawfpidm_app'@'192.168.1.100';

-- Deny all other connections
REVOKE ALL PRIVILEGES ON *.* FROM 'iawfpidm_app'@'%';
```

**Regular Security Audits**

```sql
-- Check for users without passwords
SELECT User, Host FROM mysql.user WHERE authentication_string = '';

-- Check for users with excessive privileges
SELECT User, Host FROM mysql.user WHERE Super_priv = 'Y';

-- Review failed login attempts
SELECT * FROM mysql.general_log 
WHERE command_type = 'Connect' 
AND argument LIKE '%Access denied%'
ORDER BY event_time DESC
LIMIT 100;
```

---

**Formatting Specifications:**
- Font: Times New Roman, 12pt (Body), 14pt (Headings), 13pt (Subheadings)
- Line Spacing: 1.5 or Double
- Paragraph Indent: 5 spaces
- Margins: Left 4cm, Right 2cm, Top 3cm, Bottom 3cm
- Page Numbering: Arabic numerals continuing from previous chapters, bottom-middle
- Headings: Bold, no underline, no colons
- Section Numbering: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
- Tables: Table 6.1 through Table 6.8
- Figures: Fig. 6.1, Fig. 6.2, Fig. 6.3
