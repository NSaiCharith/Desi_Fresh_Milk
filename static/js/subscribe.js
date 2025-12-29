// Subscribe Form Validation and Handling

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('subscribeForm');
    const planOptions = document.querySelectorAll('.plan-option');
    const subscriptionPlanSelect = document.getElementById('subscriptionPlan');

    // Plan selection from sidebar
    if (planOptions.length > 0 && subscriptionPlanSelect) {
        planOptions.forEach(option => {
            option.addEventListener('click', function() {
                planOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                const planName = this.dataset.plan;
                subscriptionPlanSelect.value = planName;
                validateField(subscriptionPlanSelect);
            });
        });
    }

    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
            validateCardNumber(e.target);
        });
    }

    // Expiry date formatting
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
            validateExpiryDate(e.target);
        });
    }

    // CVV formatting (numbers only)
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
            validateCVV(e.target);
        });
    }

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            if (value.length > 0) {
                if (value.length <= 3) {
                    formattedValue = '(' + value;
                } else if (value.length <= 6) {
                    formattedValue = '(' + value.substring(0, 3) + ') ' + value.substring(3);
                } else {
                    formattedValue = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10);
                }
            }
            e.target.value = formattedValue;
            validatePhone(e.target);
        });
    }

    // ZIP code formatting (numbers only)
    const zipCodeInput = document.getElementById('zipCode');
    if (zipCodeInput) {
        zipCodeInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 5);
            validateField(e.target);
        });
    }

    // Real-time validation on blur
    if (form) {
        const allInputs = form.querySelectorAll('input, select');
        allInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }

    // Form submission
    if (!form) {
        return; // Exit if form doesn't exist
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Save subscription data
                const formData = {
                    fullName: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    zipCode: document.getElementById('zipCode').value,
                    cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
                    expiryDate: document.getElementById('expiryDate').value,
                    cvv: document.getElementById('cvv').value,
                    cardName: document.getElementById('cardName').value,
                    subscriptionPlan: document.getElementById('subscriptionPlan').value,
                    timestamp: new Date().toISOString()
                };

                localStorage.setItem('subscriptionData', JSON.stringify(formData));
                
                // Show success message
                showNotification('Subscription successful! Redirecting...', 'success');
                
                // Redirect to success page or home
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }, 1500);
        } else {
            showNotification('Please fix the errors in the form', 'error');
            // Scroll to first error
            const firstError = form.querySelector('.error-message:not(:empty)');
            if (firstError) {
                firstError.closest('.form-group').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Validation Functions
    function validateForm() {
        let isValid = true;
        
        // Validate all fields
        isValid = validateField(document.getElementById('fullName')) && isValid;
        isValid = validateEmail(document.getElementById('email')) && isValid;
        isValid = validatePhone(document.getElementById('phone')) && isValid;
        isValid = validateField(document.getElementById('address')) && isValid;
        isValid = validateField(document.getElementById('city')) && isValid;
        isValid = validateField(document.getElementById('state')) && isValid;
        isValid = validateField(document.getElementById('zipCode')) && isValid;
        isValid = validateCardNumber(document.getElementById('cardNumber')) && isValid;
        isValid = validateExpiryDate(document.getElementById('expiryDate')) && isValid;
        isValid = validateCVV(document.getElementById('cvv')) && isValid;
        isValid = validateField(document.getElementById('cardName')) && isValid;
        isValid = validateField(document.getElementById('subscriptionPlan')) && isValid;
        
        // Validate terms checkbox
        const termsCheckbox = document.getElementById('terms');
        const termsError = document.getElementById('termsError');
        if (!termsCheckbox.checked) {
            termsError.textContent = 'You must agree to the terms and conditions';
            isValid = false;
        } else {
            termsError.textContent = '';
        }
        
        return isValid;
    }

    function validateField(field) {
        const errorElement = document.getElementById(field.id + 'Error');
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            errorElement.textContent = 'This field is required';
            field.classList.add('error');
            return false;
        } else {
            errorElement.textContent = '';
            field.classList.remove('error');
            return true;
        }
    }

    function validateEmail(field) {
        const errorElement = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!field.value.trim()) {
            errorElement.textContent = 'Email is required';
            field.classList.add('error');
            return false;
        } else if (!emailRegex.test(field.value)) {
            errorElement.textContent = 'Please enter a valid email address';
            field.classList.add('error');
            return false;
        } else {
            errorElement.textContent = '';
            field.classList.remove('error');
            return true;
        }
    }

    function validatePhone(field) {
        const errorElement = document.getElementById('phoneError');
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        const digitsOnly = field.value.replace(/\D/g, '');
        
        if (!field.value.trim()) {
            errorElement.textContent = 'Phone number is required';
            field.classList.add('error');
            return false;
        } else if (digitsOnly.length !== 10) {
            errorElement.textContent = 'Please enter a valid 10-digit phone number';
            field.classList.add('error');
            return false;
        } else {
            errorElement.textContent = '';
            field.classList.remove('error');
            return true;
        }
    }

    function validateCardNumber(field) {
        const errorElement = document.getElementById('cardNumberError');
        const cardNumber = field.value.replace(/\s/g, '');
        const cardRegex = /^\d{13,19}$/;
        
        if (!field.value.trim()) {
            errorElement.textContent = 'Card number is required';
            field.classList.add('error');
            return false;
        } else if (!cardRegex.test(cardNumber)) {
            errorElement.textContent = 'Please enter a valid card number (13-19 digits)';
            field.classList.add('error');
            return false;
        } else if (!luhnCheck(cardNumber)) {
            errorElement.textContent = 'Invalid card number';
            field.classList.add('error');
            return false;
        } else {
            errorElement.textContent = '';
            field.classList.remove('error');
            return true;
        }
    }

    function validateExpiryDate(field) {
        const errorElement = document.getElementById('expiryDateError');
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        
        if (!field.value.trim()) {
            errorElement.textContent = 'Expiry date is required';
            field.classList.add('error');
            return false;
        } else if (!expiryRegex.test(field.value)) {
            errorElement.textContent = 'Please enter a valid expiry date (MM/YY)';
            field.classList.add('error');
            return false;
        } else {
            const [month, year] = field.value.split('/');
            const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
            const today = new Date();
            
            if (expiryDate < today) {
                errorElement.textContent = 'Card has expired';
                field.classList.add('error');
                return false;
            } else {
                errorElement.textContent = '';
                field.classList.remove('error');
                return true;
            }
        }
    }

    function validateCVV(field) {
        const errorElement = document.getElementById('cvvError');
        const cvvRegex = /^\d{3,4}$/;
        
        if (!field.value.trim()) {
            errorElement.textContent = 'CVV is required';
            field.classList.add('error');
            return false;
        } else if (!cvvRegex.test(field.value)) {
            errorElement.textContent = 'Please enter a valid CVV (3-4 digits)';
            field.classList.add('error');
            return false;
        } else {
            errorElement.textContent = '';
            field.classList.remove('error');
            return true;
        }
    }

    // Luhn algorithm for card validation
    function luhnCheck(cardNumber) {
        let sum = 0;
        let isEven = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }

    // Notification function
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#06D6A0' : '#FF6B35'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});

