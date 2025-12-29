// Cart Management System
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        // Initialize delivery option if not set
        if (!localStorage.getItem('deliveryOption')) {
            localStorage.setItem('deliveryOption', 'free');
        }
        this.updateCartUI();
    }

    loadCart() {
        const cartData = localStorage.getItem('desiFreshMilkCart');
        return cartData ? JSON.parse(cartData) : [];
    }

    saveCart() {
        localStorage.setItem('desiFreshMilkCart', JSON.stringify(this.cart));
        this.updateCartUI();
    }

    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice || product.price,
                discount: product.discount || 0,
                image: product.image,
                unit: product.unit,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.showNotification('Product added to cart!', 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.showNotification('Item removed from cart', 'success');
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    getCartCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    getDeliveryOption() {
        const deliveryOption = localStorage.getItem('deliveryOption') || 'standard';
        return deliveryOption;
    }

    setDeliveryOption(option) {
        localStorage.setItem('deliveryOption', option);
        this.updateCartUI();
    }

    getDeliveryCharge() {
        const option = this.getDeliveryOption();
        const charges = {
            'free': 0,
            'standard': 2.99,
            'express': 9.99  // 1-day delivery
        };
        return charges[option] || charges['standard'];
    }

    getCartTotal() {
        // Calculate subtotal with product discounts already applied
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const originalSubtotal = this.cart.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
        const productDiscountAmount = originalSubtotal - subtotal;
        
        // Calculate additional discount based on order value (tiered discounts)
        let orderDiscountPercent = 0;
        let orderDiscountAmount = 0;
        if (subtotal >= 150) {
            orderDiscountPercent = 10; // 10% discount for orders $150+
        } else if (subtotal >= 100) {
            orderDiscountPercent = 8;  // 8% discount for orders $100+
        } else if (subtotal >= 50) {
            orderDiscountPercent = 5;  // 5% discount for orders $50+
        }
        
        orderDiscountAmount = subtotal * (orderDiscountPercent / 100);
        const discountedSubtotal = subtotal - orderDiscountAmount;
        const totalDiscountAmount = productDiscountAmount + orderDiscountAmount;
        
        // Get delivery charge
        const deliveryCharge = this.getDeliveryCharge();
        
        // Calculate various taxes (on discounted subtotal + delivery)
        const taxableAmount = discountedSubtotal + deliveryCharge;
        const serviceTax = taxableAmount * 0.025;  // 2.5% Service Tax
        const deliveryTax = taxableAmount * 0.015; // 1.5% Delivery Tax
        const gst = taxableAmount * 0.06;         // 6% GST
        
        const totalTax = serviceTax + deliveryTax + gst;
        const total = discountedSubtotal + deliveryCharge + totalTax;
        
        return {
            originalSubtotal: Math.round(originalSubtotal * 100) / 100,
            subtotal: Math.round(subtotal * 100) / 100,
            productDiscountAmount: Math.round(productDiscountAmount * 100) / 100,
            orderDiscountPercent: orderDiscountPercent,
            orderDiscountAmount: Math.round(orderDiscountAmount * 100) / 100,
            totalDiscountAmount: Math.round(totalDiscountAmount * 100) / 100,
            discountedSubtotal: Math.round(discountedSubtotal * 100) / 100,
            deliveryOption: this.getDeliveryOption(),
            deliveryCharge: Math.round(deliveryCharge * 100) / 100,
            serviceTax: Math.round(serviceTax * 100) / 100,
            deliveryTax: Math.round(deliveryTax * 100) / 100,
            gst: Math.round(gst * 100) / 100,
            totalTax: Math.round(totalTax * 100) / 100,
            total: Math.round(total * 100) / 100
        };
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    updateCartUI() {
        try {
            // Update cart count in navigation
            const cartCountElements = document.querySelectorAll('.cart-count');
            const count = this.getCartCount();
            cartCountElements.forEach(el => {
                if (el) {
                    el.textContent = count;
                    el.style.display = count > 0 ? 'inline-block' : 'none';
                }
            });

            // Update cart page if on cart page
            if (document.getElementById('cartItemsList')) {
                this.renderCartPage();
            }

            // Update checkout page if on checkout page
            if (document.getElementById('checkoutItems')) {
                this.renderCheckoutPage();
            }
        } catch (error) {
            console.error('Error updating cart UI:', error);
        }
    }

    renderCartPage() {
        const cartItemsList = document.getElementById('cartItemsList');
        const emptyCart = document.getElementById('emptyCart');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        if (!cartItemsList || !emptyCart) {
            console.error('Cart page elements not found');
            return;
        }
        
        if (this.cart.length === 0) {
            if (cartItemsList) cartItemsList.style.display = 'none';
            if (emptyCart) emptyCart.style.display = 'block';
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        if (cartItemsList) cartItemsList.style.display = 'block';
        if (emptyCart) emptyCart.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = false;

        const fallbackImage = 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop';
        cartItemsList.innerHTML = this.cart.map(item => {
            const hasDiscount = item.originalPrice && item.originalPrice > item.price;
            return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image || fallbackImage}" alt="${item.name}" onerror="this.onerror=null; this.src='${fallbackImage}';">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-unit">${item.unit}</p>
                    <div class="cart-item-price">
                        ${hasDiscount ? `<span class="original-price-small">$${item.originalPrice.toFixed(2)}</span>` : ''}
                        <span class="current-price">$${item.price.toFixed(2)}</span>
                        ${hasDiscount ? `<span class="item-discount-badge">${item.discount}% OFF</span>` : ''}
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" value="${item.quantity}" min="1" 
                           onchange="cartManager.updateQuantity(${item.id}, parseInt(this.value))">
                    <button class="qty-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cart-item-total">
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <button class="cart-item-remove" onclick="cartManager.removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        }).join('');

        const totals = this.getCartTotal();
        document.getElementById('subtotal').textContent = `$${totals.subtotal.toFixed(2)}`;
        
        // Update product discounts
        const productDiscountRow = document.getElementById('productDiscountRow');
        if (totals.productDiscountAmount > 0 && productDiscountRow) {
            productDiscountRow.style.display = 'flex';
            document.getElementById('productDiscountAmount').textContent = `-$${totals.productDiscountAmount.toFixed(2)}`;
        } else if (productDiscountRow) {
            productDiscountRow.style.display = 'none';
        }
        
        // Update order discount if exists
        const discountRow = document.getElementById('discountRow');
        if (totals.orderDiscountPercent > 0) {
            if (discountRow) {
                discountRow.style.display = 'flex';
                document.getElementById('discountAmount').textContent = `-$${totals.orderDiscountAmount.toFixed(2)} (${totals.orderDiscountPercent}% OFF)`;
            }
        } else {
            if (discountRow) discountRow.style.display = 'none';
        }
        
        // Update delivery charge
        document.getElementById('deliveryCharge').textContent = totals.deliveryCharge > 0 ? `$${totals.deliveryCharge.toFixed(2)}` : 'FREE';
        
        // Update delivery option radio buttons
        const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
        if (deliveryRadios.length > 0) {
            deliveryRadios.forEach(radio => {
                radio.checked = (radio.value === totals.deliveryOption);
            });
        }
        
        // Update detailed taxes
        document.getElementById('serviceTax').textContent = `$${totals.serviceTax.toFixed(2)}`;
        document.getElementById('deliveryTax').textContent = `$${totals.deliveryTax.toFixed(2)}`;
        document.getElementById('gst').textContent = `$${totals.gst.toFixed(2)}`;
        document.getElementById('totalTax').textContent = `$${totals.totalTax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${totals.total.toFixed(2)}`;
        
        // Show savings badge if discount exists
        const savingsBadge = document.getElementById('savingsBadge');
        if (totals.totalDiscountAmount > 0 && savingsBadge) {
            savingsBadge.style.display = 'block';
            document.getElementById('savingsAmount').textContent = `$${totals.totalDiscountAmount.toFixed(2)}`;
        } else if (savingsBadge) {
            savingsBadge.style.display = 'none';
        }
    }

    renderCheckoutPage() {
        const checkoutItems = document.getElementById('checkoutItems');
        
        if (this.cart.length === 0) {
            checkoutItems.innerHTML = '<p style="padding: 2rem; text-align: center;">Your cart is empty. <a href="/products">Add items</a></p>';
            return;
        }

        checkoutItems.innerHTML = this.cart.map(item => `
            <div class="checkout-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="checkout-item-info">
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity} × $${item.price.toFixed(2)}</p>
                </div>
                <span class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');

        const totals = this.getCartTotal();
        document.getElementById('checkoutSubtotal').textContent = `$${totals.subtotal.toFixed(2)}`;
        
        // Update product discounts
        const checkoutProductDiscountRow = document.getElementById('checkoutProductDiscountRow');
        if (totals.productDiscountAmount > 0 && checkoutProductDiscountRow) {
            checkoutProductDiscountRow.style.display = 'flex';
            document.getElementById('checkoutProductDiscountAmount').textContent = `-$${totals.productDiscountAmount.toFixed(2)}`;
        } else if (checkoutProductDiscountRow) {
            checkoutProductDiscountRow.style.display = 'none';
        }
        
        // Update order discount if exists
        const checkoutDiscountRow = document.getElementById('checkoutDiscountRow');
        if (totals.orderDiscountPercent > 0) {
            if (checkoutDiscountRow) {
                checkoutDiscountRow.style.display = 'flex';
                document.getElementById('checkoutDiscountAmount').textContent = `-$${totals.orderDiscountAmount.toFixed(2)} (${totals.orderDiscountPercent}% OFF)`;
            }
        } else {
            if (checkoutDiscountRow) checkoutDiscountRow.style.display = 'none';
        }
        
        // Update delivery charge
        document.getElementById('checkoutDeliveryCharge').textContent = totals.deliveryCharge > 0 ? `$${totals.deliveryCharge.toFixed(2)}` : 'FREE';
        
        // Update delivery option radio buttons
        const checkoutDeliveryRadios = document.querySelectorAll('input[name="checkoutDelivery"]');
        checkoutDeliveryRadios.forEach(radio => {
            if (radio.value === totals.deliveryOption) {
                radio.checked = true;
            }
        });
        
        // Update detailed taxes
        document.getElementById('checkoutServiceTax').textContent = `$${totals.serviceTax.toFixed(2)}`;
        document.getElementById('checkoutDeliveryTax').textContent = `$${totals.deliveryTax.toFixed(2)}`;
        document.getElementById('checkoutGST').textContent = `$${totals.gst.toFixed(2)}`;
        document.getElementById('checkoutTotalTax').textContent = `$${totals.totalTax.toFixed(2)}`;
        document.getElementById('checkoutTotal').textContent = `$${totals.total.toFixed(2)}`;
        
        // Show savings badge if discount exists
        const checkoutSavingsBadge = document.getElementById('checkoutSavingsBadge');
        if (totals.totalDiscountAmount > 0 && checkoutSavingsBadge) {
            checkoutSavingsBadge.style.display = 'block';
            document.getElementById('checkoutSavingsAmount').textContent = `$${totals.totalDiscountAmount.toFixed(2)}`;
        } else if (checkoutSavingsBadge) {
            checkoutSavingsBadge.style.display = 'none';
        }
    }

    showNotification(message, type = 'success') {
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
}

// Initialize cart manager
let cartManager;

// Initialize when DOM is ready
function initCartManager() {
    if (!cartManager) {
        cartManager = new CartManager();
    }
    return cartManager;
}

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initCartManager();
    });
} else {
    // DOM is already ready, initialize immediately
    initCartManager();
}

// Also initialize on window load as backup
window.addEventListener('load', () => {
    if (!cartManager) {
        initCartManager();
    }
});

// Global addToCart function for product pages
function addToCart(productId) {
    // Force initialization if not already done
    if (!cartManager) {
        cartManager = new CartManager();
    }
    
    // Try to use productData from the page if available
    if (typeof productData !== 'undefined' && productData && Array.isArray(productData)) {
        const product = productData.find(p => p.id === productId);
        if (product) {
            cartManager.addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice || product.price,
                discount: product.discount || 0,
                image: product.image,
                unit: product.unit
            });
            return;
        }
    }
    
    // Fallback: fetch from server
    fetch('/api/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success && cartManager && data.product) {
            cartManager.addToCart({
                id: data.product.id,
                name: data.product.name,
                price: data.product.price,
                originalPrice: data.product.originalPrice || data.product.price,
                discount: data.product.discount || 0,
                image: data.product.image,
                unit: data.product.unit
            });
        } else {
            if (cartManager) {
                cartManager.showNotification('Failed to add product to cart', 'error');
            }
        }
    })
    .catch(error => {
        console.error('Error adding to cart:', error);
        if (cartManager) {
            cartManager.showNotification('Error adding product to cart. Please try again.', 'error');
        } else {
            alert('Error: Unable to add product. Please refresh the page.');
        }
    });
}

// Make addToCart available globally
window.addToCart = addToCart;

// Checkout button handler
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartManager.cart.length > 0) {
                window.location.href = '/checkout';
            }
        });
    }
});

