// Receipt Page Handler
document.addEventListener('DOMContentLoaded', () => {
    // Get order data from localStorage
    const orderData = localStorage.getItem('lastOrder');
    
    if (!orderData) {
        // If no order data, redirect to home
        alert('No order found. Redirecting to home...');
        window.location.href = '/';
        return;
    }

    try {
        const order = JSON.parse(orderData);
        displayReceipt(order);
    } catch (error) {
        console.error('Error parsing order data:', error);
        alert('Error loading order details. Redirecting to home...');
        window.location.href = '/';
    }
});

function displayReceipt(order) {
    // Display order number
    document.getElementById('orderNumber').textContent = order.orderNumber;
    
    // Display tracking number
    document.getElementById('trackingNumber').textContent = order.trackingNumber;
    
    // Display order date
    const orderDate = new Date(order.orderDate);
    document.getElementById('orderDate').textContent = orderDate.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Display shipping information
    const shippingInfo = document.getElementById('shippingInfo');
    shippingInfo.innerHTML = `
        <div class="shipping-details">
            <p><strong>${order.shipping.firstName} ${order.shipping.lastName}</strong></p>
            <p>${order.shipping.address}</p>
            <p>${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}</p>
            <p><i class="fas fa-phone"></i> ${order.shipping.phone}</p>
            <p><i class="fas fa-envelope"></i> ${order.shipping.email}</p>
        </div>
    `;

    // Display order items
    const orderItems = document.getElementById('orderItems');
    orderItems.innerHTML = order.items.map(item => `
        <div class="receipt-item">
            <div class="receipt-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="receipt-item-details">
                <h4>${item.name}</h4>
                <p class="receipt-item-unit">${item.unit}</p>
                <p class="receipt-item-quantity">Quantity: ${item.quantity}</p>
            </div>
            <div class="receipt-item-price">
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        </div>
    `).join('');

    // Display order summary with detailed breakdown
    document.getElementById('receiptSubtotal').textContent = `$${order.summary.subtotal.toFixed(2)}`;
    
    // Display product discounts if exists
    if (order.summary.productDiscountAmount > 0) {
        const productDiscountRow = document.getElementById('receiptProductDiscountRow');
        if (productDiscountRow) {
            productDiscountRow.style.display = 'flex';
            document.getElementById('receiptProductDiscountAmount').textContent = `-$${order.summary.productDiscountAmount.toFixed(2)}`;
        }
    }
    
    // Display order discount if exists
    if (order.summary.orderDiscountPercent > 0) {
        const discountRow = document.getElementById('receiptDiscountRow');
        if (discountRow) {
            discountRow.style.display = 'flex';
            document.getElementById('receiptDiscountAmount').textContent = `-$${order.summary.orderDiscountAmount.toFixed(2)} (${order.summary.orderDiscountPercent}% OFF)`;
        }
    }
    
    // Display delivery option
    const deliveryOptionNames = {
        'free': 'Free Delivery (5-7 business days)',
        'standard': 'Standard Delivery (3-5 business days) - $2.99',
        'express': 'Express Delivery (1-Day) - $9.99'
    };
    const deliveryInfo = document.getElementById('receiptDeliveryInfo');
    if (deliveryInfo) {
        deliveryInfo.innerHTML = `<strong>Delivery:</strong> ${deliveryOptionNames[order.summary.deliveryOption] || 'Standard'}`;
        if (order.summary.deliveryCharge > 0) {
            deliveryInfo.innerHTML += ` <span class="delivery-charge">$${order.summary.deliveryCharge.toFixed(2)}</span>`;
        }
    }
    
    // Display detailed taxes
    document.getElementById('receiptServiceTax').textContent = `$${order.summary.serviceTax.toFixed(2)}`;
    document.getElementById('receiptDeliveryTax').textContent = `$${order.summary.deliveryTax.toFixed(2)}`;
    document.getElementById('receiptGST').textContent = `$${order.summary.gst.toFixed(2)}`;
    document.getElementById('receiptTotalTax').textContent = `$${order.summary.totalTax.toFixed(2)}`;
    document.getElementById('receiptTotal').textContent = `$${order.summary.total.toFixed(2)}`;
    
    // Show savings badge if discount exists
    if (order.summary.totalDiscountAmount > 0) {
        const savingsBadge = document.getElementById('receiptSavingsBadge');
        if (savingsBadge) {
            savingsBadge.style.display = 'block';
            document.getElementById('receiptSavingsAmount').textContent = `$${order.summary.totalDiscountAmount.toFixed(2)}`;
        }
    }

    // Display estimated delivery date (3-5 business days)
    const deliveryDate = new Date(order.orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 4); // Add 4 days for delivery
    document.getElementById('deliveryDate').textContent = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

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

// Make functions available globally
window.generateTrackingNumber = generateTrackingNumber;
window.generateOrderNumber = generateOrderNumber;

