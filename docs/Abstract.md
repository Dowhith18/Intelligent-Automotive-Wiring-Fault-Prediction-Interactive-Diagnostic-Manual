# ABSTRACT

**Page Number: v**

---

This project presents the development of an Intelligent Automotive Wiring Fault Prediction and Interactive Diagnostic Manual (IAWFPIDM), a comprehensive Flask-based web application designed to revolutionize automotive diagnostics through intelligent fault prediction and interactive troubleshooting capabilities. The primary objective was to create an integrated platform that combines real-time wiring fault detection, diagnostic trouble code (DTC) lookup functionality, and OBD-II trip analysis to assist automotive technicians and vehicle owners in identifying and resolving electrical and engine-related issues efficiently.

The methodology involved designing a multi-layered architecture comprising a Flask backend server, a comprehensive DTC database containing over 6000 diagnostic codes, and an intelligent fault prediction engine. The system was implemented using Python 3.7+ with key dependencies including pandas for data manipulation, matplotlib for visualization, and BeautifulSoup for web scraping DTC specifications. The application features role-based authentication with three user levels (Admin, Technician, Viewer), a vehicle selection interface for recording diagnostic sessions, and a responsive dashboard displaying six critical real-time metrics including odometer reading, battery voltage, engine RPM, vehicle speed, engine state, and electrical health percentage.

My personal contributions to this project encompassed the complete system architecture design, implementation of the intelligent fault prediction algorithm capable of detecting open circuits, short circuits, and ground faults in critical components such as fuel pump relays (P062700) and fuel injectors (P026100), development of the interactive trip analysis module with four fullscreen-capable visualization charts, creation of the comprehensive DTC lookup system with advanced filtering by code, description, system category, and severity level, and integration of the vehicle dashboard with real-time sensor monitoring. Additionally, I implemented the data wrangling pipeline for OBD-II CSV data processing, converting measurements to Indian standards (kilometers, km/l, liters), and developed the web scraping utility to populate the diagnostic database from automotive specifications.

The key contributions of this project include providing immediate fault impact assessment with actionable repair recommendations, enabling technicians to diagnose complex wiring issues without extensive manual testing, offering comprehensive trip data analysis for understanding driving behavior and vehicle performance patterns, and creating an accessible web-based platform that eliminates the need for expensive proprietary diagnostic equipment. The system successfully demonstrates the integration of machine learning principles with automotive diagnostics, achieving high accuracy in fault prediction while maintaining a user-friendly interface suitable for both professional technicians and vehicle enthusiasts. This project establishes a foundation for future enhancements including predictive maintenance scheduling, integration with vehicle telematics systems, and expansion to support additional automotive systems beyond engine management, chassis, body control, and network communication modules.

---

**Formatting Specifications:**
- Font: Times New Roman, 12pt
- Line Spacing: 1.5 or Double
- Margins: Left 4cm, Right 2cm, Top 3cm, Bottom 3cm
- Page Number: v (Roman numeral, bottom-middle)
- Maximum Length: 1 page
