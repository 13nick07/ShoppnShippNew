# Shoppnshipp - Global Shopping & Shipping Platform

## 🌍 Overview

Shoppnshipp is a complete global personal shopping and international forwarding platform built with Next.js and MongoDB. The platform allows users to shop from any country and ship to any country using virtual addresses in multiple locations worldwide.

## ✨ Features

### Core Features
- **Virtual Addresses**: Get addresses in 7+ countries (USA, UK, India, UAE, China, Germany, Japan)
- **Package Management**: Track incoming packages with real-time status updates
- **Package Consolidation**: Combine multiple packages into one shipment to save costs
- **Shipping Calculator**: Calculate shipping costs for any route with multiple carrier options
- **Global Shipping**: Ship from any country to any country with DHL, FedEx, UPS, Aramex
- **Membership Plans**: Free, Basic, Pro, and Business tiers with different benefits
- **Admin Panel**: Complete admin interface for managing users, packages, shipments, and warehouses

### Landing Pages
- Home page with hero section and features
- How It Works
- Pricing with 4 membership tiers
- Countries supported
- For Businesses
- FAQ
- Contact Us

### User Dashboard
- Virtual addresses management
- Package tracking
- Shipment history
- Shipping cost calculator
- Profile settings

### Admin Panel
- Dashboard with statistics
- User management
- Package management with status updates
- Shipment tracking and updates
- Warehouse management
- Revenue tracking

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** for styling
- **ShadCN UI** components
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Next.js API Routes**
- **MongoDB** for database
- **JWT** for authentication
- **bcryptjs** for password hashing

### Authentication
- Email/password authentication
- JWT-based sessions
- Role-based access (User/Admin/Staff)

## 📦 Project Structure

```
/app/
├── app/
│   ├── api/[[...path]]/route.js   # All API endpoints
│   ├── page.js                     # Home page
│   ├── layout.js                   # Root layout
│   ├── login/page.js               # Login page
│   ├── register/page.js            # Registration page
│   ├── dashboard/page.js           # User dashboard
│   ├── admin/page.js               # Admin panel
│   ├── how-it-works/page.js        # How it works page
│   ├── pricing/page.js             # Pricing page
│   ├── countries/page.js           # Countries page
│   ├── for-businesses/page.js      # For businesses page
│   ├── faq/page.js                 # FAQ page
│   └── contact/page.js             # Contact page
├── components/
│   ├── navbar.js                   # Navigation bar
│   ├── footer.js                   # Footer
│   └── ui/                         # ShadCN components
├── lib/
│   ├── mongodb.js                  # MongoDB connection
│   ├── auth.js                     # Auth utilities
│   └── seed.js                     # Database seeding
└── .env                            # Environment variables
```

## 🗄️ Database Schema

### Collections

#### users
- `id` (UUID)
- `email` (unique)
- `password` (hashed)
- `name`
- `role` (user/admin/staff)
- `membershipPlan` (Free/Basic/Pro/Business)
- `createdAt`

#### warehouses
- `id`
- `country` (country code)
- `city`
- `address`
- `code` (unique warehouse code)
- `isActive`

#### virtualAddresses
- `id`
- `userId`
- `warehouseCode`
- `addressLine`
- `userCode`
- `createdAt`

#### packages
- `id`
- `userId`
- `warehouseCode`
- `trackingNumber`
- `status` (received/in_storage/ready_to_ship/shipped/delivered)
- `weight`
- `dimensions`
- `value`
- `arrivalDate`
- `createdAt`

#### shipments
- `id`
- `userId`
- `packageIds` (array)
- `fromCountry`
- `toCountry`
- `carrier` (DHL/FedEx/UPS/Aramex)
- `weight`
- `cost`
- `status` (pending/processing/shipped/delivered)
- `trackingNumber`
- `toAddress`
- `estimatedDelivery`
- `createdAt`

#### payments
- `id`
- `userId`
- `amount`
- `type` (membership/shipping/storage)
- `status` (completed/pending/failed)
- `reference`
- `stripePaymentId` (mock)
- `createdAt`

#### countries
- `name`
- `code` (ISO country code)
- `flag` (emoji)
- `isActive`

#### shippingRates
- `fromCountry`
- `toCountry`
- `carrier`
- `baseRate`
- `perKgRate`
- `estimatedDays`

#### membershipPlans
- `name`
- `price`
- `features` (array)
- `storageLimit` (days)
- `consolidationFree` (boolean)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running on localhost:27017
- Yarn package manager

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Set up environment variables (already configured):
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=shoppnshipp
JWT_SECRET=shoppnshipp_secret_key_2025_global_shipping_platform
STRIPE_PUBLISHABLE_KEY=pk_test_mock_key
STRIPE_SECRET_KEY=sk_test_mock_key
```

3. Seed the database:
```bash
curl http://localhost:3000/api/seed
```

4. Start the development server:
```bash
yarn dev
```

The app will be available at `http://localhost:3000`

## 👤 Demo Accounts

### Admin Account
- **Email**: admin@shoppnshipp.com
- **Password**: admin123
- **Access**: Full admin panel access

### Regular User
- **Email**: user@demo.com
- **Password**: demo123
- **Access**: User dashboard with demo packages

Or create your own account via the registration page.

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### User Endpoints
- `GET /api/addresses` - Get user's virtual addresses
- `POST /api/addresses` - Create new virtual address
- `GET /api/packages` - Get user's packages
- `GET /api/shipments` - Get user's shipments
- `POST /api/shipments` - Create new shipment
- `GET /api/shipping/calculate` - Calculate shipping costs
- `POST /api/payments` - Process payment (mock)

### Admin Endpoints
- `GET /api/admin/dashboard` - Get stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `GET /api/admin/packages` - Get all packages
- `POST /api/admin/packages` - Create package
- `PUT /api/admin/packages/:id` - Update package status
- `GET /api/admin/shipments` - Get all shipments
- `PUT /api/admin/shipments/:id` - Update shipment status
- `GET /api/admin/warehouses` - Get all warehouses
- `POST /api/admin/warehouses` - Create warehouse

### Public Endpoints
- `GET /api/countries` - Get supported countries
- `GET /api/membership-plans` - Get membership plans
- `GET /api/seed` - Seed database (development only)

## 💳 Payment Integration

Currently using **mock Stripe integration**. The payment UI is fully built but uses simulated transactions. To integrate with real Stripe:

1. Get Stripe API keys from Stripe Dashboard
2. Update `.env` with real keys
3. Implement Stripe webhook handlers
4. Update payment processing logic in API routes

## 🌐 Supported Countries

Current warehouses in:
- 🇺🇸 United States (New York)
- 🇬🇧 United Kingdom (London)
- 🇮🇳 India (Mumbai)
- 🇦🇪 UAE (Dubai)
- 🇨🇳 China (Shanghai)
- 🇩🇪 Germany (Berlin)
- 🇯🇵 Japan (Tokyo)

## 📊 Membership Plans

| Plan | Price | Addresses | Storage | Features |
|------|-------|-----------|---------|----------|
| **Free** | $0 | 1 | 30 days | Basic features |
| **Basic** | $9.99/mo | 3 | 60 days | Priority support, 1 free consolidation |
| **Pro** | $29.99/mo | 7 | 90 days | 24/7 support, unlimited consolidations |
| **Business** | $99.99/mo | Unlimited | 180 days | API access, bulk shipping, dedicated support |

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected routes with middleware
- Role-based access control
- CORS configuration
- Input validation

## 🚢 Shipping Carriers

Integration-ready for:
- DHL Express
- FedEx International
- UPS Worldwide
- Aramex

Mock rates are currently used. To integrate real carrier APIs:
1. Sign up for carrier developer accounts
2. Implement carrier API clients
3. Update rate calculation logic
4. Add real-time tracking integration

## 📱 Responsive Design

Fully responsive design with:
- Mobile-first approach
- Tailwind CSS breakpoints
- Adaptive navigation
- Touch-friendly interfaces

## 🎨 Design System

Uses ShadCN UI components with:
- Consistent color scheme
- Dark mode support (via next-themes)
- Accessible components
- Modern SaaS-style UI

## 🔄 Hot Reload

Development server has hot reload enabled. Only restart when:
- Installing new dependencies
- Changing environment variables
- Modifying server configuration

## 🧪 Testing

To test the platform:

1. **Frontend Testing**: Visit pages and interact with UI
2. **API Testing**: Use curl or Postman to test endpoints
3. **Auth Testing**: Login with demo accounts
4. **Admin Testing**: Use admin account to manage platform

Example curl test:
```bash
# Get countries
curl http://localhost:3000/api/countries

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shoppnshipp.com","password":"admin123"}'
```

## 📈 Future Enhancements

- Google OAuth integration
- Real Stripe payment processing
- Real carrier API integrations
- Email notifications
- SMS notifications
- Multi-language support
- Mobile apps (React Native)
- Package photos
- Customs form generator
- Return handling
- Package insurance
- Repackaging service
- API for businesses

## 🛠️ Maintenance

### Database Backup
```bash
mongodump --db shoppnshipp --out /backup/
```

### View Logs
```bash
# Next.js logs
tail -f /var/log/supervisor/nextjs.out.log

# MongoDB logs
tail -f /var/log/mongodb/mongodb.log
```

### Restart Services
```bash
sudo supervisorctl restart nextjs
```

## 📝 License

This is a proprietary MVP for a startup. All rights reserved.

## 👥 Support

For issues or questions:
- Email: support@shoppnshipp.com
- Phone: +1 (555) 123-4567


