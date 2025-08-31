/* Pet Haven Form Handling */
/* Client-side form validation and enhancement */

document.addEventListener('DOMContentLoaded', function() {
    initializeForms();
    setupFormValidation();
    setupProgressTracking();
});

function initializeForms() {
    console.log('Pet Haven form system initialized');
    
    // Get all forms
    const forms = document.querySelectorAll('form');
    
    // Add event listeners to forms
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Add real-time validation to form fields
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    });
}

function setupFormValidation() {
    // Custom validation rules
    const validationRules = {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            pattern: /^[\+]?[\d\s\-\(\)]{8,}$/,
            message: 'Please enter a valid phone number'
        },
        required: {
            message: 'This field is required'
        }
    };
    
    // Store validation rules globally
    window.petHavenValidation = validationRules;
}

function setupProgressTracking() {
    // 4-step adoption process tracking
    const progressSteps = document.querySelectorAll('.progress-step');
    const currentStep = getCurrentStep();
    
    // Update progress indicators
    updateProgressIndicators(currentStep);
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const isValid = validateForm(form);
    
    if (isValid) {
        showLoadingState(form);
        submitForm(form);
    } else {
        showFormErrors(form);
        scrollToFirstError(form);
    }
}

function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input, textarea, select');
    
    // Clear previous errors
    clearAllErrors(form);
    
    fields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldType = field.type;
    const isRequired = field.hasAttribute('required');
    
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (isRequired && !value) {
        isValid = false;
        errorMessage = window.petHavenValidation.required.message;
    }
    
    // Validate specific field types
    if (value && fieldType === 'email') {
        if (!window.petHavenValidation.email.pattern.test(value)) {
            isValid = false;
            errorMessage = window.petHavenValidation.email.message;
        }
    }
    
    if (value && fieldType === 'tel') {
        if (!window.petHavenValidation.phone.pattern.test(value)) {
            isValid = false;
            errorMessage = window.petHavenValidation.phone.message;
        }
    }
    
    // Custom validation for specific fields
    if (field.name === 'age' && value) {
        const age = parseInt(value);
        if (age < 18 || age > 100) {
            isValid = false;
            errorMessage = 'Age must be between 18 and 100';
        }
    }
    
    // Show/hide error
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    // Add error class to field
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    // Insert error message after field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
    
    // Add error styling
    field.style.borderColor = '#ef4444';
    field.style.backgroundColor = '#fef2f2';
}

function clearFieldError(field) {
    if (typeof field === 'object' && field.target) {
        field = field.target;
    }
    
    // Remove error class
    field.classList.remove('error');
    
    // Remove error message
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    
    // Reset field styling
    field.style.borderColor = '';
    field.style.backgroundColor = '';
}

function clearAllErrors(form) {
    const errorElements = form.querySelectorAll('.field-error');
    errorElements.forEach(error => error.remove());
    
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
        field.style.borderColor = '';
        field.style.backgroundColor = '';
    });
}

function showFormErrors(form) {
    const errorCount = form.querySelectorAll('.field-error').length;
    
    // Show general error message
    showNotification(`Please correct ${errorCount} error${errorCount > 1 ? 's' : ''} below`, 'error');
}

function scrollToFirstError(form) {
    const firstError = form.querySelector('.field-error');
    if (firstError) {
        firstError.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
}

function showLoadingState(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '⏳ Processing...';
        submitButton.style.opacity = '0.7';
    }
}

function hideLoadingState(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = submitButton.getAttribute('data-original-text') || 'Submit';
        submitButton.style.opacity = '1';
    }
}

function submitForm(form) {
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Form data:', data);
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        hideLoadingState(form);
        
        if (form.classList.contains('adoption-form')) {
            handleAdoptionFormSuccess(data);
        } else {
            handleContactFormSuccess(data);
        }
    }, 2000);
}

function handleAdoptionFormSuccess(data) {
    showNotification('🎉 Adoption application submitted successfully! We\'ll contact you within 24 hours.', 'success');
    
    // Redirect to thank you page or show next steps
    setTimeout(() => {
        // window.location.href = 'adoption-success.html';
        console.log('Would redirect to success page');
    }, 3000);
}

function handleContactFormSuccess(data) {
    showNotification('✅ Message sent successfully! We\'ll get back to you soon.', 'success');
    
    // Clear form
    const form = document.querySelector('form');
    if (form) {
        form.reset();
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 400px;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: #10b981; color: white;' : ''}
        ${type === 'error' ? 'background: #ef4444; color: white;' : ''}
        ${type === 'info' ? 'background: #3b82f6; color: white;' : ''}
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function getCurrentStep() {
    // Determine current step based on URL or page content
    const url = window.location.pathname;
    
    if (url.includes('application')) return 1;
    if (url.includes('interview')) return 2;
    if (url.includes('meet-greet')) return 3;
    if (url.includes('adoption')) return 4;
    
    return 1; // Default to step 1
}

function updateProgressIndicators(currentStep) {
    const steps = document.querySelectorAll('.progress-step');
    
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        
        if (stepNumber < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active', 'pending');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed', 'pending');
        } else {
            step.classList.add('pending');
            step.classList.remove('completed', 'active');
        }
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .field-error {
        color: #ef4444;
        font-size: 14px;
        margin-top: 4px;
        font-weight: 500;
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        opacity: 0.8;
    }
    
    .notification-close:hover {
        opacity: 1;
        background: rgba(255,255,255,0.2);
    }
`;
document.head.appendChild(style);

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        validateForm,
        showNotification,
        getCurrentStep,
        updateProgressIndicators
    };
}
