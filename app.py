from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.secret_key = 'desi-fresh-milk-secret-key-2024'  # Secret key for sessions

# Milk delivery company data
company_data = {
    "name": "Desi Fresh Milk",
    "tagline": "Pure, Fresh, Delivered Daily to Your Doorstep",
    "owner": "VINEETH REDDY",
    "phone": "+1 (123) 456-7890",
    "email": "info@desifreshmilk.com",
    "address": "888 Renner Rd, Richardson, TX 75080",
    "hours": "Monday - Sunday: 6:00 AM - 8:00 PM",
    
    "products": [
        {
            "id": 1,
            "name": "Whole Milk",
            "description": "Pure, creamy whole milk straight from our farm",
            "price": 4.99,
            "originalPrice": 5.99,
            "discount": 17,
            "unit": "per gallon",
            "image": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
            "features": ["100% Natural", "No Preservatives", "Rich in Calcium"]
        },
        {
            "id": 2,
            "name": "2% Reduced Fat Milk",
            "description": "Lower fat content, same great taste",
            "price": 4.49,
            "originalPrice": 5.49,
            "discount": 18,
            "unit": "per gallon",
            "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop",
            "features": ["Lower Fat", "High Protein", "Fresh Daily"]
        },
        {
            "id": 3,
            "name": "Skim Milk",
            "description": "Fat-free milk, perfect for health-conscious families",
            "price": 4.29,
            "originalPrice": 4.99,
            "discount": 14,
            "unit": "per gallon",
            "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop",
            "features": ["Fat-Free", "High Calcium", "Low Calories"]
        },
        {
            "id": 4,
            "name": "Organic Whole Milk",
            "description": "Certified organic, hormone-free milk",
            "price": 6.99,
            "originalPrice": 7.99,
            "discount": 13,
            "unit": "per gallon",
            "image": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
            "features": ["Certified Organic", "Hormone-Free", "Premium Quality"]
        },
        {
            "id": 5,
            "name": "Chocolate Milk",
            "description": "Delicious chocolate-flavored milk for kids",
            "price": 5.49,
            "originalPrice": 6.49,
            "discount": 15,
            "unit": "per half gallon",
            "image": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
            "features": ["Kid-Friendly", "Rich Flavor", "Fresh Daily"]
        },
        {
            "id": 6,
            "name": "Almond Milk",
            "description": "Plant-based alternative, lactose-free",
            "price": 5.99,
            "originalPrice": 6.99,
            "discount": 14,
            "unit": "per half gallon",
            "image": "https://images.unsplash.com/photo-1600565193348-f74bd3c7bbdf?w=400&h=300&fit=crop",
            "features": ["Lactose-Free", "Plant-Based", "Nutritious"]
        },
        {
            "id": 7,
            "name": "Butter",
            "description": "Fresh, creamy butter made from our premium milk",
            "price": 6.99,
            "originalPrice": 7.99,
            "discount": 13,
            "unit": "per pound",
            "image": "https://images.unsplash.com/photo-1618164436266-4465e0e4d71b?w=400&h=300&fit=crop",
            "features": ["Fresh Churned", "Creamy Texture", "Natural"]
        },
        {
            "id": 8,
            "name": "Yogurt",
            "description": "Probiotic-rich yogurt for a healthy gut",
            "price": 4.99,
            "originalPrice": 5.99,
            "discount": 17,
            "unit": "per 32oz container",
            "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
            "features": ["Probiotic", "High Protein", "Multiple Flavors"]
        }
    ],
    
    "subscription_plans": [
        {
            "name": "Weekly Plan",
            "description": "Get fresh milk delivered every week",
            "discount": "5%",
            "price": "$19.96/week",
            "subscriptionPrice": 19.96,
            "frequency": "Weekly"
        },
        {
            "name": "Bi-Weekly Plan",
            "description": "Fresh milk delivered twice a week",
            "discount": "10%",
            "price": "$35.92/bi-weekly",
            "subscriptionPrice": 35.92,
            "frequency": "Bi-Weekly"
        },
        {
            "name": "Daily Plan",
            "description": "Daily fresh milk delivery",
            "discount": "15%",
            "price": "$29.68/week",
            "subscriptionPrice": 29.68,
            "frequency": "Daily"
        }
    ],
    
    "features": [
        "Same-Day Delivery Available",
        "100% Money-Back Guarantee",
        "Flexible Subscription Plans",
        "Eco-Friendly Packaging",
        "24/7 Customer Support",
        "Fresh from Local Farms"
    ],
    
    "testimonials": [
        {
            "name": "Sarah Johnson",
            "location": "San Francisco, CA",
            "text": "Best milk delivery service! The milk is always fresh and the delivery is prompt. Highly recommend!",
            "rating": 5
        },
        {
            "name": "Michael Chen",
            "location": "Oakland, CA",
            "text": "Love the organic options. My family has been customers for over 2 years. Excellent service!",
            "rating": 5
        },
        {
            "name": "Emily Rodriguez",
            "location": "Berkeley, CA",
            "text": "The subscription plan saves me time and money. The milk quality is outstanding!",
            "rating": 5
        }
    ]
}

@app.route('/')
def index():
    return render_template('index.html', data=company_data)

@app.route('/products')
def products():
    return render_template('products.html', data=company_data)

@app.route('/about')
def about():
    return render_template('about.html', data=company_data)

@app.route('/contact')
def contact():
    return render_template('contact.html', data=company_data)

@app.route('/cart')
def cart():
    return render_template('cart.html', data=company_data)

@app.route('/checkout')
def checkout():
    return render_template('checkout.html', data=company_data)

@app.route('/receipt')
def receipt():
    return render_template('receipt.html', data=company_data)

@app.route('/subscribe')
def subscribe():
    return render_template('subscribe.html', data=company_data)

@app.route('/api/add-to-cart', methods=['POST'])
def add_to_cart():
    data = request.json
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    # Find product
    product = next((p for p in company_data['products'] if p['id'] == product_id), None)
    
    if product:
        return jsonify({
            'success': True,
            'product': {
                'id': product['id'],
                'name': product['name'],
                'price': product['price'],
                'originalPrice': product.get('originalPrice', product['price']),
                'discount': product.get('discount', 0),
                'image': product['image'],
                'unit': product['unit']
            }
        })
    return jsonify({'success': False}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)

