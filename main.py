# donation_form_validator.py

import re
from typing import Dict, List, Tuple

class DonationFormValidator:
    def __init__(self):
        self.form_errors = []
    
    def validate_form_structure(self, html_content: str) -> List[str]:
        """Validate HTML form structure for accessibility and syntax errors"""
        errors = []
        
        # Check for </input> closing tags
        if '</input>' in html_content:
            errors.append('Found </input> closing tags - input elements are void elements')
        
        # Check for proper label-input associations
        label_matches = re.findall(r'<label for="([^"]+)">', html_content)
        input_id_matches = re.findall(r'<input[^>]+id="([^"]+)"', html_content)
        
        for label_id in label_matches:
            if label_id not in input_id_matches:
                errors.append(f'Label with for="{label_id}" has no corresponding input with matching id')
        
        # Check for required attributes on text, email, and number inputs
        required_inputs = re.findall(r'<input[^>]+(type="text"|type="email"|type="number")[^>]*>', html_content)
        for input_tag in required_inputs:
            if 'required' not in input_tag:
                input_type = re.search(r'type="([^"]+)"', input_tag).group(1)
                errors.append(f'Input with type {input_type} should have required attribute')
        
        # Check email input type
        if 'type="email"' not in html_content:
            errors.append('Email input should have type="email" instead of type="text"')
        
        return errors
    
    def generate_corrected_html(self) -> str:
        """Generate corrected HTML form with all accessibility fixes"""
        return """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Donation Form</title>
</head>
<body>
  <h1>Donation Form</h1>
  <form>
    <label for="fullName">Full Name:</label>
    <input type="text" id="fullName" name="name" required>
    
    <label for="emailAddress">Email Address:</label>
    <input type="email" id="emailAddress" name="email" required>
    
    <label for="donationAmount">Donation Amount ($):</label>
    <input type="number" id="donationAmount" name="amount" required>
    
    <label for="subscribe">Subscribe</label>
    <input type="checkbox" id="subscribe" name="newsletter">
    
    <input type="submit" value="Send">
  </form>
</body>
</html>"""
    
    def validate_all_requirements(self, html_content: str) -> Dict[str, bool]:
        """Validate all specific requirements from user stories"""
        tests = {
            'no_input_closing_tags': '</input>' not in html_content,
            'five_input_elements': len(re.findall(r'<input[^>]*>', html_content)) == 5,
            'four_label_elements': len(re.findall(r'<label[^>]*>', html_content)) == 4,
            'first_label_text': '<label for="fullName">Full Name:</label>' in html_content,
            'first_input_required': '<input type="text" id="fullName" name="name" required>' in html_content,
            'second_label_text': '<label for="emailAddress">Email Address:</label>' in html_content,
            'second_input_required': '<input type="email" id="emailAddress" name="email" required>' in html_content,
            'third_label_text': '<label for="donationAmount">Donation Amount ($):</label>' in html_content,
            'third_input_required': '<input type="number" id="donationAmount" name="amount" required>' in html_content,
            'fourth_label_text': '<label for="subscribe">Subscribe</label>' in html_content,
            'label_input_association': self._check_label_input_association(html_content),
            'email_input_type': 'type="email"' in html_content,
            'checkbox_not_required': not re.search(r'<input type="checkbox"[^>]*required[^>]*>', html_content),
            'submit_not_required': not re.search(r'<input type="submit"[^>]*required[^>]*>', html_content)
        }
        
        return tests
    
    def _check_label_input_association(self, html_content: str) -> bool:
        """Check if all labels have corresponding input elements"""
        label_fors = re.findall(r'<label for="([^"]+)"', html_content)
        input_ids = re.findall(r'<input[^>]+id="([^"]+)"', html_content)
        
        return all(for_value in input_ids for for_value in label_fors)
    
    def fix_form_html(self, original_html: str) -> str:
        """Automatically fix common issues in donation form HTML"""
        # Remove </input> closing tags
        fixed_html = re.sub(r'</input>', '', original_html)
        
        # Fix email input type
        fixed_html = re.sub(r'<input type="text" name="email">', 
                           '<input type="email" id="emailAddress" name="email" required>', 
                           fixed_html)
        
        # Add labels and associations for existing inputs
        replacements = [
            (r'Full Name:\s*<input type="text" name="name">',
             '<label for="fullName">Full Name:</label>\n    <input type="text" id="fullName" name="name" required>'),
            (r'Donation Amount \(\$\):\s*<input type="number" name="amount">',
             '<label for="donationAmount">Donation Amount ($):</label>\n    <input type="number" id="donationAmount" name="amount" required>'),
            (r'<input type="checkbox" name="newsletter">\s*Subscribe',
             '<label for="subscribe">Subscribe</label>\n    <input type="checkbox" id="subscribe" name="newsletter">')
        ]
        
        for pattern, replacement in replacements:
            fixed_html = re.sub(pattern, replacement, fixed_html, flags=re.IGNORECASE)
        
        return fixed_html

# Usage example
if __name__ == "__main__":
    validator = DonationFormValidator()
    
    original_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Donation Form</title>
</head>
<body>
  <h1>Donation Form</h1>
  <form>
    
    Full Name:
    <input type="text" name="name"></input>

    Email Address:
    <input type="text" name="email">

    Donation Amount ($):
    <input type="number" name="amount"></input>

    <input type="checkbox" name="newsletter"></input>
    Subscribe

    <input type="submit" value="Send"></input>
  </form>
</body>
</html>"""
    
    print("Validation Results:", validator.validate_all_requirements(original_html))
    print("\nFixed HTML:", validator.fix_form_html(original_html))
    print("\nCorrected HTML:", validator.generate_corrected_html())
