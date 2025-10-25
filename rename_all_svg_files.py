import json
import os
import re
from pathlib import Path
from collections import defaultdict
import shutil

# Load the DTC data
with open('dtc_data.json', 'r', encoding='utf-8') as f:
    dtc_data = json.load(f)

# Load combined HTML to find additional references
with open('combined_ems_ecu_documentation.html', 'r', encoding='utf-8') as f:
    combined_html = f.read()

# Dictionary to store all SVG filename mappings
svg_mappings = {}
graphics_dir = Path('static/EMS_ECU/graphics')

# Function to sanitize filename
def sanitize_filename(name):
    """Convert a name to a safe filename"""
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    name = name.replace(' ', '_')
    name = name.replace('&', 'and')
    name = re.sub(r'_+', '_', name)
    return name.strip('_')

# Get all SVG files
all_svg_files = list(graphics_dir.glob('*.svg'))
print(f"Found {len(all_svg_files)} total SVG files in graphics directory")

# Step 1: Map files already referenced in dtc_data.json
print("\n1. Analyzing dtc_data.json references...")
dtc_references = defaultdict(list)

for dtc_code, dtc_info in dtc_data.items():
    for section_name, section_data in dtc_info.items():
        if isinstance(section_data, dict) and section_data.get('type') == 'image':
            svg_path = section_data['content']
            svg_filename = os.path.basename(svg_path)
            
            dtc_references[svg_filename].append({
                'dtc': dtc_code,
                'section': section_name
            })

# Step 2: Find XWC files and create descriptive names
print("2. Processing XWC files...")
xwc_files = [f for f in all_svg_files if f.name.startswith('xwc')]
print(f"   Found {len(xwc_files)} XWC files to rename")

for svg_file in xwc_files:
    svg_filename = svg_file.name
    
    # Check if referenced in dtc_data
    if svg_filename in dtc_references:
        refs = dtc_references[svg_filename]
        first_ref = refs[0]
        dtc_code = first_ref['dtc']
        section_name = sanitize_filename(first_ref['section'])
        new_name = f"{dtc_code}_{section_name}.svg"
        
        svg_mappings[svg_filename] = {
            'new_name': new_name,
            'reason': f"Referenced in DTC {dtc_code} - {first_ref['section']}",
            'ref_count': len(refs)
        }
    else:
        # Check if referenced in combined HTML
        if svg_filename in combined_html:
            # Try to extract context from HTML
            pattern = rf'<h[123][^>]*>([^<]+)</h[123]>[^<]*<[^>]*{re.escape(svg_filename)}'
            match = re.search(pattern, combined_html, re.IGNORECASE | re.DOTALL)
            
            if match:
                context = sanitize_filename(match.group(1))
                new_name = f"HTML_{context}_{svg_filename[:10]}.svg"
            else:
                # Generic rename based on file hash
                new_name = f"Diagram_{svg_filename[3:13]}.svg"
            
            svg_mappings[svg_filename] = {
                'new_name': new_name,
                'reason': 'Referenced in combined HTML',
                'ref_count': combined_html.count(svg_filename)
            }
        else:
            # File not referenced anywhere - keep with prefix
            new_name = f"Unused_{svg_filename}"
            svg_mappings[svg_filename] = {
                'new_name': new_name,
                'reason': 'Not referenced in any file',
                'ref_count': 0
            }

# Print summary
print(f"\n{'='*120}")
print(f"RENAMING PLAN FOR {len(svg_mappings)} XWC FILES")
print(f"{'='*120}\n")

# Show first 30 examples
for i, (old_name, info) in enumerate(list(svg_mappings.items())[:30], 1):
    print(f"{i}. {old_name}")
    print(f"   → {info['new_name']}")
    print(f"   Reason: {info['reason']}")
    print(f"   Referenced: {info['ref_count']} times")
    print()

if len(svg_mappings) > 30:
    print(f"... and {len(svg_mappings) - 30} more files\n")

# Ask for confirmation
print(f"{'='*120}")
response = input(f"\nRename {len(svg_mappings)} XWC files? (yes/no): ").strip().lower()

if response == 'yes':
    # Create backups
    print("\nCreating backups...")
    shutil.copy('dtc_data.json', 'dtc_data.json.backup_all')
    shutil.copy('combined_ems_ecu_documentation.html', 'combined_ems_ecu_documentation.html.backup')
    
    renamed_count = 0
    skipped_count = 0
    final_mappings = {}
    
    # Rename files
    print("\nRenaming files...")
    for old_name, info in svg_mappings.items():
        old_path = graphics_dir / old_name
        new_name = info['new_name']
        new_path = graphics_dir / new_name
        
        # Handle duplicates
        counter = 1
        base_name, ext = os.path.splitext(new_name)
        while new_path.exists() and old_path != new_path:
            new_name = f"{base_name}_{counter}{ext}"
            new_path = graphics_dir / new_name
            counter += 1
        
        final_mappings[old_name] = new_name
        
        if old_path.exists():
            try:
                os.rename(old_path, new_path)
                print(f"✓ {old_name} → {new_name}")
                renamed_count += 1
            except Exception as e:
                print(f"✗ Error: {old_name} - {e}")
                skipped_count += 1
        else:
            skipped_count += 1
    
    # Update dtc_data.json
    print("\nUpdating dtc_data.json...")
    updated_dtc_refs = 0
    for dtc_code, dtc_info in dtc_data.items():
        for section_name, section_data in dtc_info.items():
            if isinstance(section_data, dict) and section_data.get('type') == 'image':
                svg_path = section_data['content']
                svg_filename = os.path.basename(svg_path)
                
                if svg_filename in final_mappings:
                    new_filename = final_mappings[svg_filename]
                    new_path = f"EMS_ECU/graphics/{new_filename}"
                    dtc_data[dtc_code][section_name]['content'] = new_path
                    updated_dtc_refs += 1
    
    with open('dtc_data.json', 'w', encoding='utf-8') as f:
        json.dump(dtc_data, f, indent=2, ensure_ascii=False)
    
    # Update combined_ems_ecu_documentation.html
    print("Updating combined_ems_ecu_documentation.html...")
    updated_html_refs = 0
    for old_name, new_name in final_mappings.items():
        if old_name in combined_html:
            combined_html = combined_html.replace(old_name, new_name)
            updated_html_refs += combined_html.count(new_name)
    
    with open('combined_ems_ecu_documentation.html', 'w', encoding='utf-8') as f:
        f.write(combined_html)
    
    # Create mapping file
    with open('complete_svg_rename_mapping.txt', 'w', encoding='utf-8') as f:
        f.write("COMPLETE SVG FILE RENAME MAPPING\n")
        f.write("="*120 + "\n\n")
        for old_name, new_name in sorted(final_mappings.items()):
            info = svg_mappings[old_name]
            f.write(f"{old_name} → {new_name}\n")
            f.write(f"  {info['reason']}\n")
            f.write(f"  Referenced {info['ref_count']} times\n")
            f.write("-"*120 + "\n")
    
    print(f"\n{'='*120}")
    print("✓ RENAMING COMPLETE!")
    print(f"  • Renamed: {renamed_count} files")
    print(f"  • Skipped: {skipped_count} files")
    print(f"  • Updated dtc_data.json: {updated_dtc_refs} references")
    print(f"  • Updated combined HTML: {updated_html_refs} references")
    print(f"  • Backups: dtc_data.json.backup_all, combined_ems_ecu_documentation.html.backup")
    print(f"  • Mapping: complete_svg_rename_mapping.txt")
    print(f"{'='*120}\n")
    
else:
    print("\nRenaming cancelled.")
