# Desi Fresh Milk - Milk Delivery Company Website

A beautiful, colorful, and user-friendly website for a milk delivery company with product listings, pricing, subscription plans, and contact information.

## Features

- 🎨 **Colorful & Modern Design** - Vibrant gradients and attractive color scheme
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices
- 🛍️ **Product Showcase** - Display all products with images, prices, and features
- 💰 **Pricing Information** - Clear pricing table and subscription plans
- 📝 **Multiple Pages** - Home, Products, About, and Contact pages
- 🎯 **Smooth Navigation** - Easy navigation with smooth scrolling
- 🖼️ **Attractive Images** - High-quality product images from Unsplash
- ⚡ **Interactive Elements** - Hover effects, animations, and dynamic content
- 📧 **Contact Form** - Easy way for customers to get in touch
- ⭐ **Customer Testimonials** - Build trust with customer reviews

## Installation

1. Make sure you have Python 3.7+ installed
2. Install Flask:
```bash
pip install -r requirements.txt
```

## Running the Application

1. Navigate to the project directory:
```bash
cd Desi_Fresh_Milk
```

2. Run the Flask application:
```bash
python app.py
```

3. Open your browser and visit:
```
http://localhost:5002
```

## Project Structure

```
Desi_Fresh_Milk/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── templates/            # HTML templates
│   ├── index.html        # Home page
│   ├── products.html     # Products page
│   ├── about.html        # About page
│   └── contact.html      # Contact page
├── static/
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   └── js/
│       └── script.js     # JavaScript for interactivity
└── README.md             # This file
```

## Pages & Sections

### Home Page (`/`)
- Hero section with call-to-action buttons
- Features section
- Products preview (4 featured products)
- Subscription plans
- About section
- Customer testimonials
- Contact information

### Products Page (`/products`)
- All products with detailed information
- Pricing comparison table
- Add to cart functionality
- Subscribe options

### About Page (`/about`)
- Company story
- Core values
- Statistics and achievements

### Contact Page (`/contact`)
- Contact information
- Contact form
- Map location placeholder
- Social media links

## Customization

### Changing Colors
Edit the CSS variables in `static/css/style.css`:
```css
:root {
    --primary-color: #FF6B35;
    --secondary-color: #4ECDC4;
    --accent-color: #FFE66D;
    /* ... */
}
```

### Adding Products
Edit the `products` array in `app.py`:
```python
"products": [
    {
        "id": 1,
        "name": "Your Product",
        "description": "Product description",
        "price": 4.99,
        "unit": "per gallon",
        "image": "image-url",
        "features": ["Feature 1", "Feature 2"]
    }
]
```

### Changing Company Information
Edit the `company_data` dictionary in `app.py`:
```python
company_data = {
    "name": "Your Company Name",
    "tagline": "Your tagline",
    "phone": "Your phone",
    "email": "Your email",
    # ...
}
```

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins)
- **Images**: Unsplash (placeholder images - replace with your own)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The images are currently using Unsplash placeholder URLs. Replace them with your actual product images.
- The contact form is set up but doesn't send emails. You'll need to integrate with an email service for production.
- The map section is a placeholder. Integrate Google Maps or another mapping service for production.

## License

This project is open source and available for use.

## Support

For questions or support, please contact: info@desifreshmilk.com

