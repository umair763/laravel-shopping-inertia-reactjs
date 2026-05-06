# E-Commerce Website - Setup & Architecture Guide

## 📋 Project Overview

This is a complete e-commerce prototype built with **Laravel 11**, **React**, and **Inertia.js** with role-based access control (User vs Admin).

### Key Features

- ✅ User authentication with role-based access
- ✅ Product catalog with filtering and search
- ✅ Order management for users
- ✅ Admin dashboard with statistics
- ✅ Admin product CRUD operations
- ✅ Order status management
- ✅ API endpoints for both user and admin actions
- ✅ Security via middleware authentication and authorization

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 2. Setup Environment

```bash
# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate
```

### 3. Database Setup

```bash
# Run migrations
php artisan migrate

# Seed dummy data (creates user, admin, and 15 products)
php artisan db:seed
```

### 4. Build Assets

```bash
# Development
npm run dev

# Production
npm run build
```

### 5. Start Development Server

```bash
# In one terminal
php artisan serve

# In another terminal (if not using npm run dev)
npm run dev
```

### 6. Access the Application

- **User Home**: http://localhost:8000
- **Login**: Use credentials from seeder:
    - **User Account**
        - Email: `user@example.com`
        - Password: `password`
    - **Admin Account**
        - Email: `admin@example.com`
        - Password: `password`

---

## 🏗️ Project Architecture

### Directory Structure

```
resources/js/
├── layout/
│   ├── app.layout.jsx          # Main layout wrapper
│   ├── user.layout.jsx         # User area layout
│   └── admin.layout.jsx        # Admin area layout
├── features/
│   ├── user/
│   │   ├── pages/              # User pages
│   │   │   ├── products.jsx    # Product listing (default home)
│   │   │   ├── viewproduct.jsx # Product detail
│   │   │   ├── orders.jsx      # User orders list
│   │   │   └── orderdetail.jsx # Order detail
│   │   ├── components/         # User components
│   │   │   └── ProductCard.jsx # Product card component
│   │   └── services/           # User services
│   └── admin/
│       ├── pages/              # Admin pages
│       │   ├── dashboard.jsx   # Admin dashboard
│       │   ├── products.jsx    # Product management
│       │   ├── addproduct.jsx  # Create product
│       │   ├── updateproduct.jsx # Edit product
│       │   ├── orders.jsx      # Orders management
│       │   └── orderdetail.jsx # Order detail & status update
│       ├── components/         # Admin components
│       │   └── StatCard.jsx    # Statistics card
│       └── services/           # Admin services
└── app.jsx                     # Inertia app configuration

app/Http/
├── Controllers/
│   ├── ProductController.php        # User product views & API
│   ├── OrderController.php          # User order management
│   ├── AdminProductController.php   # Admin product CRUD
│   └── AdminDashboardController.php # Admin dashboard & orders
├── Middleware/
│   └── IsAdmin.php                  # Admin authorization middleware
└── Policies/
    └── OrderPolicy.php              # Order authorization policy

app/Models/
├── User.php          # User model with role enum
├── Product.php       # Product model
├── Order.php         # Order model
└── OrderItem.php     # Order items model

routes/
└── web.php           # All routes (web + API)

database/
├── migrations/       # Database schema
└── seeders/
    ├── DatabaseSeeder.php   # Main seeder
    └── ProductSeeder.php    # Product seeder
```

---

## 🔐 Security & Conventions

### 1. Authentication & Authorization

**User Types**:

- **User Role** (`role = 'user'`): Regular customers
- **Admin Role** (`role = 'admin'`): Store administrators

**Middleware Protection**:

```php
// User routes - requires authentication
Route::middleware(['auth'])->group(function () { ... });

// Admin routes - requires authentication AND admin role
Route::middleware(['auth', 'is_admin'])->group(function () { ... });
```

### 2. Role Checking

**Backend (PHP)**:

```php
// Check if user is admin
if (auth()->user()->isAdmin()) {
    // Admin actions
}

// Using middleware
auth()->user()->role === 'admin'
```

**Frontend (React)**:

```jsx
// Check user role from props (passed by Laravel)
if (auth.user.role === "admin") {
    // Show admin UI
}
```

### 3. API Endpoints

**Public API**:

- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get single product

**User API** (Authenticated):

- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders

**Admin API** (Admin Only):

- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/dashboard/stats` - Dashboard statistics

---

## 📄 Database Schema

### Users Table

```sql
id, name, email, password, role (enum: user/admin), remember_token, timestamps
```

### Products Table

```sql
id, name, description, price, quantity, image_url, sku (unique),
category, is_active, timestamps
```

### Orders Table

```sql
id, user_id (foreign), total_amount, status (enum: pending/processing/completed/cancelled),
shipping_address, timestamps
```

### Order Items Table

```sql
id, order_id (foreign), product_id (foreign), quantity,
unit_price, total_price, timestamps
```

---

## 🔑 Key Models & Methods

### User Model

```php
$user->isAdmin()           // Check if user is admin
$user->orders()            // Get user's orders
$user->role               // Get user role (user/admin)
```

### Product Model

```php
$product->isInStock()      // Check if product is in stock
$product->orderItems()     // Get order items for this product
```

### Order Model

```php
$order->user              // Get order's user
$order->items()           // Get order items
$order->calculateTotal()  // Calculate total from items
```

---

## 🎨 Frontend Architecture

### Component Hierarchy

```
AppLayout (main wrapper)
├── Navbar
├── Sidebar (with navigation)
└── Content Area
    ├── UserLayout extends AppLayout
    │   └── User Pages
    └── AdminLayout extends AppLayout
        └── Admin Pages
```

### State Management

- Uses Inertia.js to pass data from Laravel to React
- Component state for local form handling
- URL query parameters for filters

### Styling

- **Tailwind CSS** for utility-first styling
- Responsive design (mobile-first)
- Dark text on light backgrounds for good contrast

---

## 📱 Page Routes

### User Routes

- `/` - Product listing (home page)
- `/products` - Products page (same as home)
- `/products/{id}` - Product detail
- `/orders` - User's orders
- `/orders/{id}` - Order detail

### Admin Routes

- `/admin/dashboard` - Admin dashboard with stats
- `/admin/products` - Product management
- `/admin/products/create` - Create new product
- `/admin/products/{id}/edit` - Edit product
- `/admin/orders` - Orders management
- `/admin/orders/{id}` - Order detail with status update

---

## 🛠️ Development Workflow

### Adding a New Product

1. Go to `/admin/products/create`
2. Fill in product details (name, price, quantity, category, etc.)
3. Product is saved and visible to users immediately (if active)

### Managing Orders

1. **As User**: Go to `/orders` to view personal orders
2. **As Admin**: Go to `/admin/orders` to view all orders
3. **Admin can**: Update order status (pending → processing → completed)

### Creating Products

- Admin only feature
- Form validation on both frontend and backend
- Image URL support for product images
- Category filtering for better organization

---

## 🔍 Dummy Data

**Seeded Users**:

- User: `user@example.com` / `password`
- Admin: `admin@example.com` / `password`

**Seeded Products** (15 total):

- Electronics (4): Headphones, Keyboard, Webcam, Smartwatch
- Fashion (3): T-shirt, Jeans, Leather Jacket
- Sports (3): Running Shoes, Yoga Mat, Dumbbells
- Books (2): Clean Code, Design Patterns
- Home (3): Coffee Mugs, Desk Lamp, Wall Clock

---

## 🚨 Important Notes

1. **First Time Setup**: Always run migrations and seeders
2. **Default Homepage**: Set to `/` which shows the user products page
3. **Role-Based Routing**: Routes automatically block unauthorized access
4. **Asset Building**: Run `npm run dev` during development
5. **Database**: Uses SQLite by default (configured in `.env`)

---

## 📚 Technology Stack

- **Backend**: Laravel 11
- **Frontend**: React 18
- **Routing**: Inertia.js
- **Styling**: Tailwind CSS
- **Database**: SQLite (configurable)
- **Build Tool**: Vite
- **Package Manager**: NPM

---

## 🐛 Troubleshooting

### Pages not loading?

- Ensure `npm run dev` is running
- Check browser console for errors
- Verify migrations are run: `php artisan migrate`

### Authorization errors?

- Verify user role in database: `SELECT id, email, role FROM users;`
- Check middleware in `app/Http/Middleware/IsAdmin.php`

### Products not showing?

- Ensure products are active: `is_active = 1`
- Check category field is set
- Verify in Admin > Products page

### Order creation failing?

- Check product quantity is > 0
- Verify user is authenticated
- Check form validation messages

---

## 📞 Support

For issues or questions about the setup, refer to:

- [Laravel Documentation](https://laravel.com)
- [Inertia.js Documentation](https://inertiajs.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
