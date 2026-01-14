// DonationFormValidator.java

import java.util.*;
import java.util.regex.*;

public class DonationFormValidator {
    private List<String> formErrors;
    
    public DonationFormValidator() {
        this.formErrors = new ArrayList<>();
    }
    
    public List<String> validateFormStructure(String htmlContent) {
        """Validate HTML form structure for accessibility and syntax errors""";
        List<String> errors = new ArrayList<>();
        
        // Check for </input> closing tags
        if (htmlContent.contains("</input>")) {
            errors.add("Found </input> closing tags - input elements are void elements");
        }
        
        // Check for proper label-input associations
        Pattern labelPattern = Pattern.compile("<label for=\"([^\"]+)\">");
        Pattern inputIdPattern = Pattern.compile("<input[^>]+id=\"([^\"]+)\"");
        
        Matcher labelMatcher = labelPattern.matcher(htmlContent);
        Matcher inputIdMatcher = inputIdPattern.matcher(htmlContent);
        
        Set<String> labelIds = new HashSet<>();
        Set<String> inputIds = new HashSet<>();
        
        while (labelMatcher.find()) {
            labelIds.add(labelMatcher.group(1));
        }
        
        while (inputIdMatcher.find()) {
            inputIds.add(inputIdMatcher.group(1));
        }
        
        for (String labelId : labelIds) {
            if (!inputIds.contains(labelId)) {
                errors.add("Label with for=\"" + labelId + "\" has no corresponding input with matching id");
            }
        }
        
        // Check for required attributes on text, email, and number inputs
        Pattern requiredInputPattern = Pattern.compile("<input[^>]+(type=\"text\"|type=\"email\"|type=\"number\")[^>]*>");
        Matcher requiredInputMatcher = requiredInputPattern.matcher(htmlContent);
        
        while (requiredInputMatcher.find()) {
            String inputTag = requiredInputMatcher.group();
            if (!inputTag.contains("required")) {
                Pattern typePattern = Pattern.compile("type=\"([^\"]+)\"");
                Matcher typeMatcher = typePattern.matcher(inputTag);
                if (typeMatcher.find()) {
                    errors.add("Input with type " + typeMatcher.group(1) + " should have required attribute");
                }
            }
        }
        
        // Check email input type
        if (!htmlContent.contains("type=\"email\"")) {
            errors.add("Email input should have type=\"email\" instead of type=\"text\"");
        }
        
        return errors;
    }
    
    public String generateCorrectedHTML() {
        """Generate corrected HTML form with all accessibility fixes""";
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
</html>""";
    }
    
    public Map<String, Boolean> validateAllRequirements(String htmlContent) {
        """Validate all specific requirements from user stories""";
        Map<String, Boolean> tests = new HashMap<>();
        
        tests.put("no_input_closing_tags", !htmlContent.contains("</input>"));
        
        Pattern inputPattern = Pattern.compile("<input[^>]*>");
        Matcher inputMatcher = inputPattern.matcher(htmlContent);
        int inputCount = 0;
        while (inputMatcher.find()) {
            inputCount++;
        }
        tests.put("five_input_elements", inputCount == 5);
        
        Pattern labelPattern = Pattern.compile("<label[^>]*>");
        Matcher labelMatcher = labelPattern.matcher(htmlContent);
        int labelCount = 0;
        while (labelMatcher.find()) {
            labelCount++;
        }
        tests.put("four_label_elements", labelCount == 4);
        
        tests.put("first_label_text", htmlContent.contains("<label for=\"fullName\">Full Name:</label>"));
        tests.put("first_input_required", htmlContent.contains("<input type=\"text\" id=\"fullName\" name=\"name\" required>"));
        tests.put("second_label_text", htmlContent.contains("<label for=\"emailAddress\">Email Address:</label>"));
        tests.put("second_input_required", htmlContent.contains("<input type=\"email\" id=\"emailAddress\" name=\"email\" required>"));
        tests.put("third_label_text", htmlContent.contains("<label for=\"donationAmount\">Donation Amount ($):</label>"));
        tests.put("third_input_required", htmlContent.contains("<input type=\"number\" id=\"donationAmount\" name=\"amount\" required>"));
        tests.put("fourth_label_text", htmlContent.contains("<label for=\"subscribe\">Subscribe</label>"));
        tests.put("label_input_association", checkLabelInputAssociation(htmlContent));
        tests.put("email_input_type", htmlContent.contains("type=\"email\""));
        
        Pattern checkboxRequiredPattern = Pattern.compile("<input type=\"checkbox\"[^>]*required[^>]*>");
        tests.put("checkbox_not_required", !checkboxRequiredPattern.matcher(htmlContent).find());
        
        Pattern submitRequiredPattern = Pattern.compile("<input type=\"submit\"[^>]*required[^>]*>");
        tests.put("submit_not_required", !submitRequiredPattern.matcher(htmlContent).find());
        
        return tests;
    }
    
    private boolean checkLabelInputAssociation(String htmlContent) {
        """Check if all labels have corresponding input elements""";
        Pattern labelForPattern = Pattern.compile("<label for=\"([^\"]+)\"");
        Pattern inputIdPattern = Pattern.compile("<input[^>]+id=\"([^\"]+)\"");
        
        Matcher labelMatcher = labelForPattern.matcher(htmlContent);
        Matcher inputIdMatcher = inputIdPattern.matcher(htmlContent);
        
        Set<String> labelFors = new HashSet<>();
        Set<String> inputIds = new HashSet<>();
        
        while (labelMatcher.find()) {
            labelFors.add(labelMatcher.group(1));
        }
        
        while (inputIdMatcher.find()) {
            inputIds.add(inputIdMatcher.group(1));
        }
        
        return inputIds.containsAll(labelFors);
    }
    
    public String fixFormHTML(String originalHTML) {
        """Automatically fix common issues in donation form HTML""";
        String fixedHTML = originalHTML;
        
        // Remove </input> closing tags
        fixedHTML = fixedHTML.replaceAll("</input>", "");
        
        // Fix email input type
        fixedHTML = fixedHTML.replaceAll("<input type=\"text\" name=\"email\">", 
                                         "<input type=\"email\" id=\"emailAddress\" name=\"email\" required>");
        
        // Add labels and associations for existing inputs
        String[] replacements = {
            "Full Name:\\s*<input type=\"text\" name=\"name\">",
            "<label for=\"fullName\">Full Name:</label>\\n    <input type=\"text\" id=\"fullName\" name=\"name\" required>",
            
            "Donation Amount \\(\\$\\):\\s*<input type=\"number\" name=\"amount\">",
            "<label for=\"donationAmount\">Donation Amount ($):</label>\\n    <input type=\"number\" id=\"donationAmount\" name=\"amount\" required>",
            
            "<input type=\"checkbox\" name=\"newsletter\">\\s*Subscribe",
            "<label for=\"subscribe\">Subscribe</label>\\n    <input type=\"checkbox\" id=\"subscribe\" name=\"newsletter\">"
        };
        
        for (int i = 0; i < replacements.length; i += 2) {
            fixedHTML = fixedHTML.replaceAll(replacements[i], replacements[i + 1]);
        }
        
        return fixedHTML;
    }
    
    public static void main(String[] args) {
        DonationFormValidator validator = new DonationFormValidator();
        
        String originalHTML = """<!DOCTYPE html>
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
</html>""";
        
        System.out.println("Validation Results: " + validator.validateAllRequirements(originalHTML));
        System.out.println("\nFixed HTML: " + validator.fixFormHTML(originalHTML));
        System.out.println("\nCorrected HTML: " + validator.generateCorrectedHTML());
    }
}
