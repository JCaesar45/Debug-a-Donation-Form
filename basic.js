// donationFormValidator.js

class DonationFormValidator {
    constructor() {
        this.formErrors = [];
    }

    // Method to validate HTML structure
    validateFormStructure(htmlContent) {
        const errors = [];
        
        // Check for </input> closing tags
        if (htmlContent.includes('</input>')) {
            errors.push('Found </input> closing tags - input elements are void elements');
        }
        
        // Check for proper label-input associations
        const labelMatches = htmlContent.match(/<label for="([^"]+)">/g);
        const inputIdMatches = htmlContent.match(/<input[^>]+id="([^"]+)"/g);
        
        if (labelMatches && inputIdMatches) {
            const labelIds = labelMatches.map(match => match.match(/for="([^"]+)"/)[1]);
            const inputIds = inputIdMatches.map(match => match.match(/id="([^"]+)"/)[1]);
            
            labelIds.forEach(id => {
                if (!inputIds.includes(id)) {
                    errors.push(`Label with for="${id}" has no corresponding input with matching id`);
                }
            });
        }
        
        // Check for required attributes on text, email, and number inputs
        const requiredInputs = htmlContent.match(/<input[^>]+(type="text"|type="email"|type="number")[^>]*>/g);
        if (requiredInputs) {
            requiredInputs.forEach(input => {
                if (!input.includes('required')) {
                    errors.push(`Input with type ${input.match(/type="([^"]+)"/)[1]} should have required attribute`);
                }
            });
        }
        
        // Check email input type
        if (!htmlContent.includes('type="email"')) {
            errors.push('Email input should have type="email" instead of type="text"');
        }
        
        return errors;
    }

    // Method to generate corrected HTML
    generateCorrectedHTML() {
        return `<!DOCTYPE html>
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
</html>`;
    }

    // Method to validate all requirements
    validateAllRequirements(htmlContent) {
        const tests = {
            noInputClosingTags: !htmlContent.includes('</input>'),
            fiveInputElements: (htmlContent.match(/<input[^>]*>/g) || []).length === 5,
            fourLabelElements: (htmlContent.match(/<label[^>]*>/g) || []).length === 4,
            firstLabelText: htmlContent.includes('<label for="fullName">Full Name:</label>'),
            firstInputRequired: htmlContent.includes('<input type="text" id="fullName" name="name" required>'),
            secondLabelText: htmlContent.includes('<label for="emailAddress">Email Address:</label>'),
            secondInputRequired: htmlContent.includes('<input type="email" id="emailAddress" name="email" required>'),
            thirdLabelText: htmlContent.includes('<label for="donationAmount">Donation Amount ($):</label>'),
            thirdInputRequired: htmlContent.includes('<input type="number" id="donationAmount" name="amount" required>'),
            fourthLabelText: htmlContent.includes('<label for="subscribe">Subscribe</label>'),
            labelInputAssociation: this.checkLabelInputAssociation(htmlContent),
            emailInputType: htmlContent.includes('type="email"'),
            checkboxNotRequired: !htmlContent.includes('<input type="checkbox" id="subscribe" name="newsletter" required>'),
            submitNotRequired: !htmlContent.includes('<input type="submit" value="Send" required>')
        };

        return tests;
    }

    checkLabelInputAssociation(htmlContent) {
        const labelForMatches = htmlContent.match(/<label for="([^"]+)"/g) || [];
        const inputIdMatches = htmlContent.match(/<input[^>]+id="([^"]+)"/g) || [];
        
        const labelFors = labelForMatches.map(match => match.match(/for="([^"]+)"/)[1]);
        const inputIds = inputIdMatches.map(match => match.match(/id="([^"]+)"/)[1]);
        
        return labelFors.every(forValue => inputIds.includes(forValue));
    }
}

// Usage example
const validator = new DonationFormValidator();
const originalHTML = `<!DOCTYPE html>
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
</html>`;

console.log('Validation Results:', validator.validateAllRequirements(originalHTML));
console.log('Corrected HTML:', validator.generateCorrectedHTML());
