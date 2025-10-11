# Intelligent Automotive Wiring Fault Prediction Interactive Diagnostic Manual

This repository contains diagnostic manuals for automotive systems, along with tools to manage and combine documentation.

## HTML Combiner Scripts

Two Python scripts are provided to combine all HTML documentation files from the EMS ECU directory into a single unified HTML document:

### Features

- **Combines all HTML/HTM files** from the EMS_ECU directory
- **Preserves content** while removing duplicate HTML structure elements (DOCTYPE, html, head, body tags)
- **Adds visual separators** between files with clear section headers
- **Error handling** for problematic files
- **Progress feedback** during processing
- **Alphabetically sorted** files for consistent output

### Usage

Run either script from the repository root:

```bash
python combine_html_files.py
```

or

```bash
python combine_advanced.py
```

Both scripts will:
1. Read all HTML/HTM files from the `EMS_ECU` directory
2. Combine them into a single file named `combined_ems_ecu_documentation.html`
3. Display progress as each file is processed

### Benefits

- **Easier searching** across all documentation
- **Single file** for offline reference
- **Simplified** documentation distribution
- **Consistent structure** with visual separation between sections

### Output

The generated `combined_ems_ecu_documentation.html` file includes:
- Clean HTML structure with UTF-8 encoding
- CSS styling for visual separators
- File headers identifying the source of each section
- All content from individual HTML files without duplicate structure tags

### Requirements

- Python 3.6 or higher
- No external dependencies (uses only standard library)

### Example Output Structure

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Combined EMS ECU Documentation</title>
  <style>
    .file-section { border-top: 3px solid #333; margin: 20px 0; padding-top: 10px; }
    .file-header { background-color: #f0f0f0; padding: 10px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="file-section">
    <div class="file-header">File: example.html</div>
    <!-- File content here -->
  </div>
  <!-- More file sections... -->
</body>
</html>
```
