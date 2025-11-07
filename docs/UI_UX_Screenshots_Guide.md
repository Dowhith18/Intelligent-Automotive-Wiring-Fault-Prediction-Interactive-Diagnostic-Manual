# UI/UX SCREENSHOTS GUIDE
# INTELLIGENT AUTOMOTIVE WIRING FAULT PREDICTION & INTERACTIVE DIAGNOSTIC MANUAL

---

## Screenshot Capture Instructions

This document provides detailed descriptions of all UI/UX screenshots required for the project report. Capture screenshots at 1920x1080 resolution with browser zoom at 100%.

---

## SECTION 1: AUTHENTICATION FLOW

### Fig. 9.1 Login Screen with Validation

**Screenshot Location:** `http://127.0.0.1:5000/login`

**Description:** Login page with authentication form

**Visual Elements:**
- Application logo (50x50px) centered at top
- Application title "IAWFPIDM" below logo
- Username input field with placeholder "Enter username"
- Password input field with placeholder "Enter password" (masked)
- "Login" button (blue, centered)
- Error message area (red text) for invalid credentials
- Clean white background with subtle shadow on form container

**Capture Instructions:**
1. Navigate to login page
2. Leave fields empty to show placeholders
3. Capture full browser window
4. Save as: `Fig_9_1_Login_Screen.png`

**Alternative Capture (with error):**
1. Enter invalid credentials (username: "test", password: "wrong")
2. Click Login button
3. Capture error message display
4. Save as: `Fig_9_1_Login_Error.png`

---

### Fig. 9.2 Dashboard Overview with Analytics

**Screenshot Location:** `http://127.0.0.1:5000/` (after login)

**Description:** Main dashboard showing vehicle metrics and fault predictions

**Visual Elements:**
- Top navigation bar with logo, menu items, and user profile
- Six metric cards in 2x3 grid:
  - Odometer: 45,678 km
  - Battery Voltage: 13.8 V
  - Engine RPM: 850
  - Vehicle Speed: 0 km/h
  - Engine State: Running (green indicator)
  - Electrical Health: 95% (green progress bar)
- Fault Predictions section below metrics
- Two fault cards displayed with severity indicators

**Capture Instructions:**
1. Login as admin user
2. Wait for dashboard to fully load
3. Ensure all six metrics are visible
4. Scroll to show fault predictions
5. Capture full page (may require scrolling screenshot)
6. Save as: `Fig_9_2_Dashboard_Overview.png`

---

## SECTION 2: FAULT PREDICTION INTERFACE

### Fig. 9.3 Fault Prediction Interface with Input Form

**Screenshot Location:** `http://127.0.0.1:5000/` (dashboard fault section)

**Description:** Fault prediction cards showing detected issues

**Visual Elements:**
- Fault Card 1 (Red border - High severity):
  - DTC Code: P062700
  - Component: Fuel Pump Relay Control Circuit
  - Fault Type: Open Circuit
  - Severity Badge: High (red)
  - Confidence: 92%
- Fault Card 2 (Red border - High severity):
  - DTC Code: P026100
  - Component: Fuel Injector 1 Control Circuit
  - Fault Type: Short to Ground
  - Severity Badge: High (red)
  - Confidence: 89%

**Capture Instructions:**
1. Scroll to "Current Fault Predictions" section on dashboard
2. Ensure both fault cards are fully visible
3. Capture the fault prediction area
4. Save as: `Fig_9_3_Fault_Prediction_Interface.png`

---

### Fig. 9.4 Prediction Results with Confidence Scores

**Screenshot Location:** Click on any fault card for details

**Description:** Detailed fault information modal or page

**Visual Elements:**
- Fault header with DTC code and severity
- Component name and description
- Fault type classification
- Confidence score with percentage bar
- Immediate Impact section (red text)
- Potential Consequences section (orange text)
- Recommended Actions section (green text with checkboxes)
- "Close" or "Back to Dashboard" button

**Capture Instructions:**
1. Click on P062700 fault card
2. Wait for detail view to load
3. Capture full detail screen
4. Save as: `Fig_9_4_Prediction_Results.png`

---

## SECTION 3: DTC LOOKUP SYSTEM

### Fig. 9.5 Interactive Diagnostic Manual Viewer

**Screenshot Location:** `http://127.0.0.1:5000/dtc-lookup`

**Description:** DTC database table with search and filter options

**Visual Elements:**
- Search bar at top with magnifying glass icon
- Filter dropdowns: System (All/Engine/Chassis/Body/Network), Severity (All/High/Medium/Low)
- Data table with columns: Code, Description, System, Severity
- Multiple rows showing various DTC codes (P0300, P0420, C0035, B1234, U0100, etc.)
- Pagination controls at bottom (Previous, 1, 2, 3, Next)
- Row hover effect (light blue background)

**Capture Instructions:**
1. Navigate to DTC Lookup page
2. Ensure table shows at least 10 rows
3. Hover over one row to show hover effect
4. Capture full page
5. Save as: `Fig_9_5_DTC_Lookup_Table.png`

---

### Fig. 9.6 Wiring Diagram Viewer with Zoom

**Screenshot Location:** `http://127.0.0.1:5000/dtc/P0300` (detail page)

**Description:** Individual DTC code detail page

**Visual Elements:**
- DTC code header (large, bold): P0300
- Description: "Random/Multiple Cylinder Misfire Detected"
- System badge: Engine (blue)
- Severity badge: High (red)
- Tabs: Overview, Symptoms, Causes, Diagnostic Steps, Related Codes
- Symptoms list with bullet points
- Causes list with bullet points
- Diagnostic procedure with numbered steps
- Wiring diagram placeholder or image
- "Back to Lookup" button

**Capture Instructions:**
1. Click on any DTC code from lookup table
2. Ensure all tabs are visible
3. Capture full detail page
4. Save as: `Fig_9_6_DTC_Detail_Page.png`

---

### Fig. 9.7 Search Results Page

**Screenshot Location:** `http://127.0.0.1:5000/dtc-lookup?search=misfire`

**Description:** Filtered search results

**Visual Elements:**
- Search bar with "misfire" entered
- Results count: "Showing 8 results for 'misfire'"
- Filtered table showing only misfire-related codes
- Highlighted search term in results (yellow background)
- Clear search button (X icon)

**Capture Instructions:**
1. Enter "misfire" in search box
2. Press Enter or click search
3. Wait for filtered results
4. Capture results page
5. Save as: `Fig_9_7_Search_Results.png`

---

## SECTION 4: TRIP ANALYSIS & REPORTING

### Fig. 9.8 Analytics Dashboard with Charts

**Screenshot Location:** `http://127.0.0.1:5000/analysis`

**Description:** Trip data upload and analysis page

**Visual Elements:**
- Page title: "OBD-II Trip Analysis"
- File upload section with drag-drop area
- "Choose CSV File" button
- Sample CSV format link
- Instructions text
- Upload button (disabled until file selected)

**Capture Instructions:**
1. Navigate to Analysis page
2. Show empty upload state
3. Capture full page
4. Save as: `Fig_9_8_Analysis_Upload.png`

---

### Fig. 9.9 Report Generation Interface

**Screenshot Location:** `http://127.0.0.1:5000/trip-dashboard` (after CSV upload)

**Description:** Trip analysis results with charts

**Visual Elements:**
- Trip Statistics cards at top:
  - Total Distance: 45.6 km
  - Trip Duration: 38.5 min
  - Average Speed: 65.2 km/h
  - Max Speed: 110.0 km/h
  - Fuel Efficiency: 12.5 km/l
- Four charts in 2x2 grid:
  - RPM Over Time (line chart, blue)
  - Speed Over Time (line chart, green)
  - Acceleration Analysis (line chart, orange)
  - RPM vs Throttle Position (hexbin chart, red-yellow gradient)
- Each chart has fullscreen icon in corner
- "Download Report" button at bottom

**Capture Instructions:**
1. Upload sample CSV file
2. Wait for charts to generate
3. Capture full dashboard with all charts visible
4. Save as: `Fig_9_9_Trip_Dashboard.png`

---

### Fig. 9.10 Generated PDF Report Sample

**Screenshot Location:** PDF export from trip dashboard

**Description:** PDF report layout

**Visual Elements:**
- Report header with logo and title
- Vehicle information section
- Trip statistics table
- All four charts embedded
- Footer with page number and date

**Capture Instructions:**
1. Click "Download Report" button
2. Open generated PDF
3. Capture first page of PDF
4. Save as: `Fig_9_10_PDF_Report.png`

---

## SECTION 5: ADMINISTRATIVE FEATURES

### Fig. 9.11 User Management Screen (Admin)

**Screenshot Location:** `http://127.0.0.1:5000/admin/users` (admin only)

**Description:** User management interface

**Visual Elements:**
- "User Management" page title
- "Add New User" button (top right, green)
- User table with columns: Username, Role, Email, Created Date, Last Login, Actions
- Three user rows: admin, technician, viewer
- Action buttons for each user: Edit (blue), Delete (red)
- Role badges with colors: Admin (purple), Technician (blue), Viewer (gray)

**Capture Instructions:**
1. Login as admin user
2. Navigate to User Management (if implemented)
3. Capture user table
4. Save as: `Fig_9_11_User_Management.png`

**Note:** If not implemented, create mockup showing expected layout

---

### Fig. 9.12 Settings and Configuration Page

**Screenshot Location:** `http://127.0.0.1:5000/settings`

**Description:** System settings interface

**Visual Elements:**
- Settings sidebar with categories:
  - General
  - Notifications
  - Diagnostic Parameters
  - Data Retention
  - Integration
- Main content area showing selected category settings
- Toggle switches for boolean settings
- Input fields for numeric parameters
- "Save Changes" button (blue, bottom right)
- "Reset to Defaults" button (gray, bottom left)

**Capture Instructions:**
1. Navigate to Settings page
2. Show General settings tab
3. Capture full settings interface
4. Save as: `Fig_9_12_Settings_Page.png`

**Note:** If not implemented, create mockup showing expected layout

---

## SECTION 6: RESPONSIVE DESIGN LAYOUTS

### Fig. 9.13 Desktop Responsive UI Layout

**Screenshot Location:** Any page at 1920x1080 resolution

**Description:** Full desktop layout

**Visual Elements:**
- Full navigation bar with all menu items visible
- Three-column layout where applicable
- Sidebar navigation (if present)
- Wide content area
- All features accessible without scrolling horizontally

**Capture Instructions:**
1. Set browser to 1920x1080
2. Capture dashboard page
3. Save as: `Fig_9_13_Desktop_Layout.png`

---

### Fig. 9.14 Tablet View Layout

**Screenshot Location:** Any page at 768x1024 resolution

**Description:** Tablet-optimized layout

**Visual Elements:**
- Collapsed navigation (hamburger menu)
- Two-column layout for metric cards
- Stacked charts (one per row)
- Touch-friendly button sizes
- Responsive table with horizontal scroll

**Capture Instructions:**
1. Set browser to 768px width (use DevTools)
2. Capture dashboard page
3. Save as: `Fig_9_14_Tablet_Layout.png`

---

### Fig. 9.15 Mobile View Layout

**Screenshot Location:** Any page at 375x667 resolution

**Description:** Mobile-optimized layout

**Visual Elements:**
- Hamburger menu icon
- Single-column layout
- Stacked metric cards (one per row)
- Full-width charts
- Bottom navigation bar (if implemented)
- Large touch targets

**Capture Instructions:**
1. Set browser to 375px width (use DevTools)
2. Capture dashboard page
3. Save as: `Fig_9_15_Mobile_Layout.png`

---

### Fig. 9.16 Navigation Flow Diagram

**Description:** Visual flowchart showing user navigation paths

**Visual Elements:**
- Flowchart boxes for each page
- Arrows showing navigation paths
- Decision diamonds for conditional navigation
- Color coding: Blue (main pages), Green (success paths), Red (error paths)

**Creation Instructions:**
1. Create flowchart using draw.io or similar tool
2. Include all major pages: Login → Dashboard → DTC Lookup → Detail → Trip Analysis
3. Show alternative paths and back navigation
4. Export as PNG
5. Save as: `Fig_9_16_Navigation_Flow.png`

---

## SECTION 7: ADDITIONAL SCREENSHOTS

### Vehicle Selection Screen

**Screenshot Location:** `http://127.0.0.1:5000/vehicle-selection`

**Description:** Vehicle information capture form

**Visual Elements:**
- Form title: "Vehicle Information"
- Input fields: VIN, Make, Model, Year
- "Save and Continue" button
- "Skip for Now" link

**Capture Instructions:**
1. Navigate to vehicle selection page
2. Show empty form
3. Capture full form
4. Save as: `Vehicle_Selection_Form.png`

---

### Error Page (404)

**Screenshot Location:** `http://127.0.0.1:5000/nonexistent-page`

**Description:** 404 error page

**Visual Elements:**
- Large "404" text
- "Page Not Found" message
- "Return to Dashboard" button
- Friendly error illustration or icon

**Capture Instructions:**
1. Navigate to non-existent URL
2. Capture error page
3. Save as: `Error_404_Page.png`

---

## SCREENSHOT ORGANIZATION

Save all screenshots in the following directory structure:

```
docs/
└── screenshots/
    ├── chapter_9_results/
    │   ├── Fig_9_1_Login_Screen.png
    │   ├── Fig_9_2_Dashboard_Overview.png
    │   ├── Fig_9_3_Fault_Prediction_Interface.png
    │   ├── Fig_9_4_Prediction_Results.png
    │   ├── Fig_9_5_DTC_Lookup_Table.png
    │   ├── Fig_9_6_DTC_Detail_Page.png
    │   ├── Fig_9_7_Search_Results.png
    │   ├── Fig_9_8_Analysis_Upload.png
    │   ├── Fig_9_9_Trip_Dashboard.png
    │   ├── Fig_9_10_PDF_Report.png
    │   ├── Fig_9_11_User_Management.png
    │   └── Fig_9_12_Settings_Page.png
    ├── responsive_layouts/
    │   ├── Fig_9_13_Desktop_Layout.png
    │   ├── Fig_9_14_Tablet_Layout.png
    │   └── Fig_9_15_Mobile_Layout.png
    ├── navigation/
    │   └── Fig_9_16_Navigation_Flow.png
    └── additional/
        ├── Vehicle_Selection_Form.png
        └── Error_404_Page.png
```

---

## SCREENSHOT SPECIFICATIONS

**Technical Requirements:**
- Resolution: 1920x1080 (desktop), 768x1024 (tablet), 375x667 (mobile)
- Format: PNG with transparency where applicable
- Color depth: 24-bit RGB
- Compression: Lossless
- File size: < 2MB per image

**Quality Guidelines:**
- Clear, sharp text (no blur)
- Proper contrast and brightness
- No personal information visible
- Consistent browser chrome (use same browser for all)
- No browser extensions visible in screenshots
- Clean, professional appearance

**Annotation Guidelines:**
- Add red arrows or boxes to highlight key features (optional)
- Use consistent annotation style across all screenshots
- Keep annotations minimal and clear
- Use tools like Snagit, Greenshot, or built-in OS tools

---

## MOCKUP CREATION (If Features Not Implemented)

For features not yet implemented (User Management, Settings), create mockups using:

**Tools:**
- Figma (recommended)
- Adobe XD
- Sketch
- Balsamiq
- Draw.io

**Mockup Guidelines:**
- Match existing application design style
- Use same color scheme and typography
- Maintain consistent spacing and layout
- Show realistic data (not Lorem Ipsum)
- Export at same resolution as screenshots

---

**End of UI/UX Screenshots Guide**
