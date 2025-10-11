import os
from pathlib import Path

def combine_html_files(folder_path, output_file='combined_ems_ecu.html'):
    """
    Combines all HTML files from the EMS ECU folder into a single HTML file.
    
    :param folder_path: Path to the folder containing .html files (e.g., 'EMS ECU')
    :param output_file: Path to the output combined HTML file (default: 'combined_ems_ecu.html')
    """
    # Convert to Path object for better path handling
    folder = Path(folder_path)
    
    # Get all HTML files (including .htm)
    html_files = sorted(list(folder.glob('*.html')) + list(folder.glob('*.htm')))
    
    if not html_files:
        print(f"No HTML files found in {folder_path}")
        return
    
    print(f"Found {len(html_files)} HTML files to combine")
    
    # Create combined HTML structure
    with open(output_file, 'w', encoding='utf-8') as out_f:
        # Write HTML header
        out_f.write('<!DOCTYPE html>\n')
        out_f.write('<html>\n<head>\n')
        out_f.write('<meta charset="UTF-8">\n')
        out_f.write('<title>Combined EMS ECU Documentation</title>\n')
        out_f.write('<style>\n')
        out_f.write('  .file-section { border-top: 3px solid #333; margin: 20px 0; padding-top: 10px; }\n')
        out_f.write('  .file-header { background-color: #f0f0f0; padding: 10px; font-weight: bold; }\n')
        out_f.write('</style>\n')
        out_f.write('</head>\n<body>\n\n')
        
        # Process each HTML file
        for idx, file_path in enumerate(html_files, 1):
            print(f"Processing {idx}/{len(html_files)}: {file_path.name}")
            
            # Add section divider
            out_f.write(f'<div class="file-section">\n')
            out_f.write(f'<div class="file-header">File: {file_path.name}</div>\n')
            
            # Read and append file content
            try:
                with open(file_path, 'r', encoding='utf-8') as in_f:
                    content = in_f.read()
                    # Remove DOCTYPE, html, head, and body tags to avoid conflicts
                    # Keep only the body content
                    if '<body' in content.lower():
                        start = content.lower().find('<body')
                        start = content.find('>', start) + 1
                        end = content.lower().rfind('</body>')
                        if end > start:
                            content = content[start:end]
                    
                    out_f.write(content)
                    out_f.write('\n')
            except Exception as e:
                out_f.write(f'<p>Error reading file: {e}</p>\n')
                print(f"  Error reading {file_path.name}: {e}")
            
            out_f.write('</div>\n\n')
        
        # Close HTML structure
        out_f.write('</body>\n</html>')
    
    print(f"\nSuccessfully combined {len(html_files)} files into {output_file}")

# Example usage:
if __name__ == '__main__':
    combine_html_files('EMS ECU', 'combined_ems_ecu_documentation.html')
