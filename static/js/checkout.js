// Generate tracking number (format: DFM-XXXXXX)
function generateTrackingNumber() {
    const prefix = 'DFM';
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${randomNum}`;
}

// Generate order number (format: ORD-YYYYMMDD-XXXX)
function generateOrderNumber() {
    const prefix = 'ORD';
    const date = new Date();
    const dateStr = date.getFullYear().toString() + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${dateStr}-${randomNum}`;
}

// Checkout Form Handling
document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkoutForm');
    const cardNumberInput = document.querySelector('input[name="cardNumber"]');
    const expiryInput = document.querySelector('input[name="expiry"]');
    const cvvInput = document.querySelector('input[name="cvv"]');

    // Format card number (add spaces every 4 digits)
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (formattedValue.length <= 19) {
                e.target.value = formattedValue;
            }
        });
    }

    // Format expiry date (MM/YY)
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // Only allow numbers for CVV
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // Form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!cartManager || !cartManager.cart || cartManager.cart.length === 0) {
                alert('Your cart is empty!');
                window.location.href = '/products';
                return;
            }

            // Validate form
            const formData = new FormData(checkoutForm);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.firstName || !data.lastName || !data.email || !data.phone || 
                !data.address || !data.city || !data.state || !data.zip) {
                alert('Please fill in all shipping information fields.');
                return;
            }

            if (!data.cardNumber || !data.expiry || !data.cvv || !data.cardholderName) {
                alert('Please fill in all payment information fields.');
                return;
            }

            // Show loading state
            const submitBtn = checkoutForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            // Simulate payment processing
            setTimeout(() => {
                // Generate order details
                const orderNumber = generateOrderNumber();
                const trackingNumber = generateTrackingNumber();
                const orderDate = new Date();
                
                // Get cart totals with detailed breakdown
                const totals = cartManager ? cartManager.getCartTotal() : { 
                    subtotal: 0, 
                    discountPercent: 0,
                    discountAmount: 0,
                    discountedSubtotal: 0,
                    serviceTax: 0,
                    deliveryTax: 0,
                    gst: 0,
                    totalTax: 0,
                    total: 0 
                };
                
                // Create order object
                const order = {
                    orderNumber: orderNumber,
                    trackingNumber: trackingNumber,
                    orderDate: orderDate.toISOString(),
                    shipping: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phone: data.phone,
                        address: data.address,
                        city: data.city,
                        state: data.state,
                        zip: data.zip
                    },
                    items: cartManager ? cartManager.cart.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                        unit: item.unit
                    })) : [],
                    summary: {
                        originalSubtotal: totals.originalSubtotal,
                        subtotal: totals.subtotal,
                        productDiscountAmount: totals.productDiscountAmount,
                        orderDiscountPercent: totals.orderDiscountPercent,
                        orderDiscountAmount: totals.orderDiscountAmount,
                        totalDiscountAmount: totals.totalDiscountAmount,
                        discountedSubtotal: totals.discountedSubtotal,
                        deliveryOption: totals.deliveryOption,
                        deliveryCharge: totals.deliveryCharge,
                        serviceTax: totals.serviceTax,
                        deliveryTax: totals.deliveryTax,
                        gst: totals.gst,
                        totalTax: totals.totalTax,
                        total: totals.total
                    }
                };
                
                // Save order to localStorage
                localStorage.setItem('lastOrder', JSON.stringify(order));
                
                // Clear cart
                if (cartManager) {
                    cartManager.clearCart();
                }
                
                // Redirect to receipt page
                window.location.href = '/receipt';
            }, 2000);
        });
    }

    // Redirect to products if cart is empty when page loads
    setTimeout(() => {
        if (typeof cartManager !== 'undefined' && cartManager && cartManager.cart && cartManager.cart.length === 0 && window.location.pathname === '/checkout') {
            alert('Your cart is empty. Redirecting to products...');
            window.location.href = '/products';
        }
    }, 1000);
});

