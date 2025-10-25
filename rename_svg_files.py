import json
import os
import re
from pathlib import Path

# Load the DTC data
with open('dtc_data.json', 'r', encoding='utf-8') as f:
    dtc_data = json.load(f)

# Dictionary to store SVG filename mappings
svg_mappings = {}

# Function to sanitize filename
def sanitize_filename(name):
    """Convert a name to a safe filename"""
    # Remove special characters and replace spaces with underscores
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    name = name.replace(' ', '_')
    # Remove multiple underscores
    name = re.sub(r'_+', '_', name)
    return name.strip('_')

# Analyze dtc_data.json to find SVG files and their contexts
print("Analyzing DTC data for SVG file references...")

for dtc_code, dtc_info in dtc_data.items():
    for section_name, section_data in dtc_info.items():
        if isinstance(section_data, dict) and section_data.get('type') == 'image':
            svg_path = section_data['content']
            svg_filename = os.path.basename(svg_path)
            
            # Generate a descriptive name based on the section and DTC code
            # Clean up section name
            clean_section = sanitize_filename(section_name)
            
            # Create a descriptive filename
            if svg_filename not in svg_mappings:
                svg_mappings[svg_filename] = {
                    'new_name': f"{dtc_code}_{clean_section}.svg",
                    'dtc_code': dtc_code,
                    'section': section_name,
                    'occurrences': []
                }
            
            svg_mappings[svg_filename]['occurrences'].append({
                'dtc': dtc_code,
                'section': section_name
            })

# Print summary
print(f"\nFound {len(svg_mappings)} unique SVG files to rename\n")

# Display the mappings
print("Proposed SVG file renamings:")
print("=" * 100)

for old_name, mapping_info in sorted(svg_mappings.items()):
    print(f"\nOld name: {old_name}")
    print(f"New name: {mapping_info['new_name']}")
    print(f"Used in {len(mapping_info['occurrences'])} location(s):")
    
    # Show first few occurrences
    for i, occ in enumerate(mapping_info['occurrences'][:3]):
        print(f"  - DTC {occ['dtc']}: {occ['section']}")
    
    if len(mapping_info['occurrences']) > 3:
        print(f"  ... and {len(mapping_info['occurrences']) - 3} more")
    print("-" * 100)

# Ask for confirmation
print("\n" + "=" * 100)
response = input("\nDo you want to proceed with renaming these files? (yes/no): ").strip().lower()

if response == 'yes':
    # Create a backup of dtc_data.json
    import shutil
    backup_file = 'dtc_data.json.backup'
    shutil.copy('dtc_data.json', backup_file)
    print(f"\nCreated backup: {backup_file}")
    
    # Track statistics
    renamed_count = 0
    updated_references = 0
    
    # Rename physical SVG files
    graphics_dir = Path('static/EMS_ECU/graphics')
    
    for old_name, mapping_info in svg_mappings.items():
        old_path = graphics_dir / old_name
        new_name = mapping_info['new_name']
        
        # Handle duplicate new names by adding counter
        new_path = graphics_dir / new_name
        counter = 1
        base_name, ext = os.path.splitext(new_name)
        while new_path.exists() and new_path != old_path:
            new_name = f"{base_name}_{counter}{ext}"
            new_path = graphics_dir / new_name
            counter += 1
        
        mapping_info['final_name'] = new_name
        
        if old_path.exists():
            os.rename(old_path, new_path)
            print(f"✓ Renamed: {old_name} -> {new_name}")
            renamed_count += 1
        else:
            print(f"✗ File not found: {old_name}")
    
    # Update references in dtc_data.json
    for dtc_code, dtc_info in dtc_data.items():
        for section_name, section_data in dtc_info.items():
            if isinstance(section_data, dict) and section_data.get('type') == 'image':
                svg_path = section_data['content']
                svg_filename = os.path.basename(svg_path)
                
                if svg_filename in svg_mappings:
                    new_filename = svg_mappings[svg_filename]['final_name']
                    new_path = f"EMS_ECU/graphics/{new_filename}"
                    dtc_data[dtc_code][section_name]['content'] = new_path
                    updated_references += 1
    
    # Save updated dtc_data.json
    with open('dtc_data.json', 'w', encoding='utf-8') as f:
        json.dump(dtc_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*100}")
    print(f"✓ Renaming complete!")
    print(f"  - Renamed {renamed_count} files")
    print(f"  - Updated {updated_references} references in dtc_data.json")
    print(f"  - Backup saved as: {backup_file}")
    print(f"{'='*100}")
    
    # Create a mapping file for reference
    with open('svg_rename_mapping.txt', 'w', encoding='utf-8') as f:
        f.write("SVG File Rename Mapping\n")
        f.write("=" * 100 + "\n\n")
        for old_name, mapping_info in sorted(svg_mappings.items()):
            f.write(f"{old_name} -> {mapping_info['final_name']}\n")
            f.write(f"  Used in DTC: {mapping_info['dtc_code']} - {mapping_info['section']}\n")
            f.write(f"  Total occurrences: {len(mapping_info['occurrences'])}\n")
            f.write("-" * 100 + "\n")
    
    print("\n✓ Created mapping file: svg_rename_mapping.txt")
    
else:
    print("\nRenaming cancelled. No files were modified.")
