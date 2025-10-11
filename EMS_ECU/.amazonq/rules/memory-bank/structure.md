# Project Structure

## Directory Organization

### Core HTML Files
- **default.htm**: Main entry point with frameset structure
- **banner.html**: Top navigation banner with prev/next controls
- **frame_main.html**: Primary content frameset (navigation + content)
- **frame_nav.html**: Left navigation panel frame
- **frame_tabs.html**: Tab-based interface frame
- **frame_views.html**: View selection frame
- **views.html**: Main views container

### Content Sections
- **file3D0000629305-sect[1-11].html**: Main diagnostic content sections
- **null_*.html**: Specific diagnostic procedures and fault codes organized by:
  - **C-codes**: Component-related diagnostic trouble codes
  - **P-codes**: Powertrain diagnostic trouble codes  
  - **U-codes**: Network/communication diagnostic trouble codes
  - **Procedure files**: Step-by-step diagnostic and repair procedures

### Static Assets
- **css/**: Stylesheets for visual presentation
  - `dmc.css`: Main styling
  - `styler.css`: Additional styling rules
- **images/**: Navigation icons and UI elements
  - Navigation controls (prev.gif, next.gif)
  - Document type icons (html_doc.gif, pdf_doc.gif)
  - Tree navigation icons (toc_*.gif)
- **graphics/**: Technical diagrams and warning graphics
  - `gentext/`: Warning icons (Caution.png, Notice.png)
  - `xwc*.svg/png`: Technical diagrams and schematics

### JavaScript Components
- **javascript/**: Interactive functionality modules
  - `utils.js`: Core utility functions
  - `tree.js`: Navigation tree functionality
  - `profile.js`: User profile and settings
  - `indexterm.js`: Search and indexing
  - `tab.js`: Tab interface management

## Architectural Patterns

### Frame-Based Architecture
- **Hierarchical Framesets**: Nested frame structure for modular content organization
- **Separation of Concerns**: Navigation, content, and controls in separate frames
- **Cross-Frame Communication**: JavaScript-based frame interaction and synchronization

### Content Organization
- **Modular Sections**: Content divided into logical diagnostic sections
- **Procedure-Based Structure**: Individual HTML files for specific diagnostic procedures
- **Asset Separation**: Clear separation of content, styling, scripts, and media assets

### Navigation System
- **Tree-Based Navigation**: Hierarchical content organization with expandable sections
- **Multi-View Interface**: Different viewing modes (TOC, index, profile)
- **Search Integration**: Built-in search functionality across diagnostic content