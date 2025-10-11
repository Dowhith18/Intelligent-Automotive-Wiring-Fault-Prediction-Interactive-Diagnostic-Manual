import json
from bs4 import BeautifulSoup

def clean_text(text):
    """
    Cleans up extracted text by removing extra blank lines and stripping whitespace.
    """
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    return '\n'.join(chunk for chunk in chunks if chunk)

def extract_dtc_data(html_file):
    """
    Parses the HTML file, preserving HTML structure for complex sections.
    """
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')
    dtc_data = {}

    dtc_sections = soup.find_all('div', class_='x-procedure-3-0')

    for section in dtc_sections:
        dtc_code_span = section.find('span', class_='x-b-1-0')
        if dtc_code_span:
            dtc_code = dtc_code_span.text.strip().split('—')[0].strip()
            dtc_data[dtc_code] = {}

            # This part remains mostly the same, grabbing the main table
            dtc_info_table = section.find('table')
            if dtc_info_table:
                # Store the whole initial info table as HTML
                title = "DTC Information & Probable Causes"
                dtc_data[dtc_code][title] = {'type': 'html', 'content': str(dtc_info_table)}

            # Extract other sections
            sub_procedures = section.find_all('div', class_='x-procedure-2-0') + section.find_all('div', class_='x-procedure-1-0')
            for sub_proc in sub_procedures:
                title_div = sub_proc.find(['div', 'span'], class_=['x-title-2-0', 'x--inherit-background-color x-title-1-0'])
                if title_div:
                    title = clean_text(title_div.text.strip().split('\xa0')[-1])
                    content_div = sub_proc.find(['div', 'span'], class_=['x-procbody-1-0','x--inherit-background-color x-procbody-1-0'])
                    if content_div:
                        # Check if content has tables or is an SVG image
                        has_table = content_div.find('table')
                        img_tag = content_div.find('img')
                        
                        if img_tag and img_tag.get('src') and img_tag['src'].endswith('.svg'):
                            image_path = img_tag['src'].lstrip('/')
                            dtc_data[dtc_code][title] = {'type': 'image', 'content': image_path}
                        elif has_table:
                            # If it has a table, save the raw HTML
                            dtc_data[dtc_code][title] = {'type': 'html', 'content': str(content_div)}
                        else:
                            # Otherwise, save cleaned text
                            cleaned_content = clean_text(content_div.get_text())
                            if cleaned_content:
                                dtc_data[dtc_code][title] = {'type': 'text', 'content': cleaned_content}
    return dtc_data

if __name__ == '__main__':
    data = extract_dtc_data('combined_ems_ecu_documentation.html')
    with open('dtc_data.json', 'w') as f:
        json.dump(data, f, indent=4)
    print("Data extraction complete! JSON updated with HTML content.")