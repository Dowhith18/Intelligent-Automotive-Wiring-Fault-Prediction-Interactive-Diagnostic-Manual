import json
import os
import re
from pathlib import Path
from collections import defaultdict
import shutil

# Load the DTC data
with open('dtc_data.json', 'r', encoding='utf-8') as f:
    dtc_data = json.load(f)

# Dictionary to store SVG filename mappings
svg_mappings = defaultdict(list)

# Function to sanitize filename
def sanitize_filename(name):
    """Convert a name to a safe filename"""
    # Remove special characters and replace spaces with underscores
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    name = name.replace(' ', '_')
    name = name.replace('&', 'and')
    # Remove multiple underscores
    name = re.sub(r'_+', '_', name)
    return name.strip('_')

# Analyze dtc_data.json to find xwc SVG files and their contexts
print("Analyzing DTC data for XWC SVG file references...")

for dtc_code, dtc_info in dtc_data.items():
    for section_name, section_data in dtc_info.items():
        if isinstance(section_data, dict) and section_data.get('type') == 'image':
            svg_path = section_data['content']
            svg_filename = os.path.basename(svg_path)
            
            # Only process xwc files
            if svg_filename.startswith('xwc'):
                svg_mappings[svg_filename].append({
                    'dtc': dtc_code,
                    'section': section_name
                })

# Generate new names for SVG files
print(f"\nFound {len(svg_mappings)} unique XWC SVG files\n")

# Create renaming plan
rename_plan = {}
for svg_filename, usages in svg_mappings.items():
    # Use the first usage context to create the name
    first_usage = usages[0]
    dtc_code = first_usage['dtc']
    section_name = first_usage['section']
    
    # Clean up section name
    clean_section = sanitize_filename(section_name)
    
    # Create a descriptive filename
    new_name = f"{dtc_code}_{clean_section}.svg"
    
    rename_plan[svg_filename] = {
        'new_name': new_name,
        'usages': usages
    }

# Print summary
print("Proposed XWC SVG file renamings:")
print("=" * 120)

for old_name, plan_info in sorted(rename_plan.items())[:20]:  # Show first 20
    print(f"\nOld name: {old_name}")
    print(f"New name: {plan_info['new_name']}")
    print(f"Used in {len(plan_info['usages'])} location(s):")
    
    # Show first few occurrences
    for i, usage in enumerate(plan_info['usages'][:3]):
        print(f"  - DTC {usage['dtc']}: {usage['section']}")
    
    if len(plan_info['usages']) > 3:
        print(f"  ... and {len(plan_info['usages']) - 3} more")
    print("-" * 120)

if len(rename_plan) > 20:
    print(f"\n... and {len(rename_plan) - 20} more files")

# Ask for confirmation
print("\n" + "=" * 120)
response = input("\nDo you want to proceed with renaming these XWC files? (yes/no): ").strip().lower()

if response == 'yes':
    # Create a backup of dtc_data.json
    backup_file = 'dtc_data.json.xwc_backup'
    shutil.copy('dtc_data.json', backup_file)
    print(f"\nCreated backup: {backup_file}")
    
    # Track statistics
    renamed_count = 0
    updated_references = 0
    skipped_count = 0
    
    # Rename physical SVG files
    graphics_dir = Path('static/EMS_ECU/graphics')
    
    # Track final names to avoid duplicates
    final_names = {}
    
    for old_name, plan_info in rename_plan.items():
        old_path = graphics_dir / old_name
        new_name = plan_info['new_name']
        
        # Handle duplicate new names by adding counter
        new_path = graphics_dir / new_name
        counter = 1
        base_name, ext = os.path.splitext(new_name)
        while new_path.exists() and new_path != old_path:
            new_name = f"{base_name}_{counter}{ext}"
            new_path = graphics_dir / new_name
            counter += 1
        
        final_names[old_name] = new_name
        
        if old_path.exists():
            try:
                os.rename(old_path, new_path)
                print(f"✓ Renamed: {old_name} -> {new_name}")
                renamed_count += 1
            except Exception as e:
                print(f"✗ Error renaming {old_name}: {e}")
                skipped_count += 1
        else:
            print(f"✗ File not found: {old_name}")
            skipped_count += 1
    
    # Update references in dtc_data.json
    for dtc_code, dtc_info in dtc_data.items():
        for section_name, section_data in dtc_info.items():
            if isinstance(section_data, dict) and section_data.get('type') == 'image':
                svg_path = section_data['content']
                svg_filename = os.path.basename(svg_path)
                
                if svg_filename in final_names:
                    new_filename = final_names[svg_filename]
                    new_path = f"EMS_ECU/graphics/{new_filename}"
                    dtc_data[dtc_code][section_name]['content'] = new_path
                    updated_references += 1
    
    # Save updated dtc_data.json
    with open('dtc_data.json', 'w', encoding='utf-8') as f:
        json.dump(dtc_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*120}")
    print(f"✓ Renaming complete!")
    print(f"  - Renamed {renamed_count} files")
    print(f"  - Skipped {skipped_count} files")
    print(f"  - Updated {updated_references} references in dtc_data.json")
    print(f"  - Backup saved as: {backup_file}")
    print(f"{'='*120}")
    
    # Create a mapping file for reference
    with open('xwc_svg_rename_mapping.txt', 'w', encoding='utf-8') as f:
        f.write("XWC SVG File Rename Mapping\n")
        f.write("=" * 120 + "\n\n")
        for old_name, new_name in sorted(final_names.items()):
            plan_info = rename_plan[old_name]
            f.write(f"{old_name} -> {new_name}\n")
            if plan_info['usages']:
                f.write(f"  Primary usage: DTC {plan_info['usages'][0]['dtc']} - {plan_info['usages'][0]['section']}\n")
                f.write(f"  Total occurrences: {len(plan_info['usages'])}\n")
            f.write("-" * 120 + "\n")
    
    print("\n✓ Created mapping file: xwc_svg_rename_mapping.txt")
    
else:
    print("\nRenaming cancelled. No files were modified.")
