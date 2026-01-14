class QuantumDonationForm {
  constructor() {
    this.form = document.getElementById("donationForm");
    this.submitBtn = document.getElementById("submitBtn");
    this.progressBar = document.getElementById("progressBar");
    this.notification = document.getElementById("notification");
    this.particlesContainer = document.getElementById("particles");

    this.init();
  }

  init() {
    this.createParticles();
    this.setupFormValidation();
    this.setupProgressTracking();
    this.setupInputAnimations();
  }

  createParticles() {
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 15 + "s";
      particle.style.animationDuration = 15 + Math.random() * 10 + "s";
      this.particlesContainer.appendChild(particle);
    }
  }

  setupFormValidation() {
    const inputs = this.form.querySelectorAll(".form-input");

    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearFieldError(input));
    });

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;

    if (field.hasAttribute("required") && !value) {
      isValid = false;
      this.showFieldError(field, "This field is required");
    } else if (type === "email" && value && !this.isValidEmail(value)) {
      isValid = false;
      this.showFieldError(field, "Please enter a valid email address");
    } else if (type === "number" && value && parseFloat(value) <= 0) {
      isValid = false;
      this.showFieldError(field, "Please enter a positive amount");
    }

    if (isValid) {
      field.style.borderColor = "var(--primary-glow)";
    }

    return isValid;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showFieldError(field, message) {
    field.style.borderColor = "var(--accent-glow)";
    this.showNotification(message, "error");
  }

  clearFieldError(field) {
    field.style.borderColor = "rgba(0, 255, 136, 0.3)";
  }

  setupProgressTracking() {
    const inputs = this.form.querySelectorAll(".form-input");
    const totalInputs = inputs.length;

    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        const filledInputs = Array.from(inputs).filter((input) =>
          input.value.trim()
        ).length;
        const progress = (filledInputs / totalInputs) * 100;
        this.updateProgressBar(progress);
      });
    });
  }

  updateProgressBar(progress) {
    this.progressBar.style.width = progress + "%";
  }

  setupInputAnimations() {
    const inputs = this.form.querySelectorAll(".form-input");

    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        input.parentElement.classList.add("focused");
      });

      input.addEventListener("blur", () => {
        input.parentElement.classList.remove("focused");
      });
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    const isValid = this.validateForm();
    if (!isValid) {
      this.showNotification("Please fix the errors before submitting", "error");
      return;
    }

    this.submitBtn.classList.add("loading");
    this.submitBtn.disabled = true;

    // Simulate quantum processing
    await this.simulateQuantumTransfer();

    // Get form data
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    // Simulate API call
    try {
      await this.submitDonation(data);
      this.showNotification(
        "Quantum transfer successful! Thank you for your donation.",
        "success"
      );
      this.form.reset();
      this.updateProgressBar(0);
    } catch (error) {
      this.showNotification(
        "Quantum transfer failed. Please try again.",
        "error"
      );
    } finally {
      this.submitBtn.classList.remove("loading");
      this.submitBtn.disabled = false;
    }
  }

  validateForm() {
    const inputs = this.form.querySelectorAll(".form-input[required]");
    let isValid = true;

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  async simulateQuantumTransfer() {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        this.updateProgressBar(progress);
      }, 200);
    });
  }

  async submitDonation(data) {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve({ success: true, data });
        } else {
          reject(new Error("Network error"));
        }
      }, 2000);
    });
  }

  showNotification(message, type) {
    this.notification.textContent = message;
    this.notification.className = `notification show ${type}`;

    setTimeout(() => {
      this.notification.classList.remove("show");
    }, 5000);
  }
}

// Initialize the form when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new QuantumDonationForm();
});

// Add some extra visual effects
document.addEventListener("mousemove", (e) => {
  const cursor = document.querySelector(".cursor");
  if (!cursor) {
    const newCursor = document.createElement("div");
    newCursor.className = "cursor";
    newCursor.style.cssText = `
                    position: fixed;
                    width: 20px;
                    height: 20px;
                    background: radial-gradient(circle, var(--primary-glow), transparent);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    transition: transform 0.1s ease;
                    mix-blend-mode: screen;
                `;
    document.body.appendChild(newCursor);
  }

  const cursor_element = document.querySelector(".cursor");
  cursor_element.style.left = e.clientX - 10 + "px";
  cursor_element.style.top = e.clientY - 10 + "px";
});
