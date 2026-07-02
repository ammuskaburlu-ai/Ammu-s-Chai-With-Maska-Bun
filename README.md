# Ammu's Chai With Maska Bun — Online Food Ordering Platform

A complete, production-ready food ordering website for a **single restaurant/shop**. Customers browse the menu, place orders, pay online or choose Cash on Delivery, and track order status. You manage everything from a built-in admin panel — no developer needed for daily operations.

---

## Table of Contents

1. [What You Are Buying](#what-you-are-buying)
2. [Pre-Configured Business Details](#pre-configured-business-details)
3. [Customer Features](#customer-features)
4. [Admin Panel Features](#admin-panel-features)
5. [Payment System](#payment-system)
6. [Notifications](#notifications)
7. [Loyalty & Coupons](#loyalty--coupons)
8. [SEO & PWA](#seo--pwa)
9. [Security](#security)
10. [Technology Stack](#technology-stack)
11. [Project Structure](#project-structure)
12. [Database Overview](#database-overview)
13. [Pages & Routes](#pages--routes)
14. [API Endpoints](#api-endpoints)
15. [Local Setup (Developer)](#local-setup-developer)
16. [Deployment to Production](#deployment-to-production)
17. [Environment Variables](#environment-variables)
18. [Admin Setup Guide](#admin-setup-guide)
19. [Daily Operations Guide](#daily-operations-guide)
20. [Included Seed Data](#included-seed-data)
21. [Third-Party Services Required](#third-party-services-required)
22. [Ongoing Costs (Estimate)](#ongoing-costs-estimate)
23. [Troubleshooting](#troubleshooting)
24. [Future Upgrade Path](#future-upgrade-path)

---

## What You Are Buying

- A **full-stack web application** — not a template or demo
- **Customer-facing storefront** (mobile-first, works like Swiggy/Zomato for one shop)
- **Admin dashboard** to manage menu, orders, customers, coupons, and settings
- **Online payments** via Razorpay (UPI, cards, net banking, wallets)
- **Cash on Delivery (COD)** option
- **Order tracking** with real-time status updates
- **Email + Telegram notifications** for you and your customers
- **Loyalty points system** for repeat customers
- **Coupon/discount system**
- **Reviews & favorites**
- **PWA support** — customers can install the site as an app on their phone
- **SEO-ready** — sitemap, robots.txt, meta tags, structured data
- **PostgreSQL database** with security policies (Supabase)
- **Production deployment config** for Vercel

---

## Pre-Configured Business Details

The platform ships configured for:

| Detail | Value |
|--------|-------|
| **Business Name** | Ammu's Chai With Maska Bun |
| **Phone** | 8121805929 |
| **Address** | Mini Bypass Road, near 1947 Restaurant, opposite DSR Guest Inn, Magunta Layout, Nellore, Andhra Pradesh 524003 |
| **Location** | Located in: DSR Guest Inn |
| **Plus Code** | CXHF+Q9 Nellore, Andhra Pradesh |
| **Google Maps** | https://maps.app.goo.gl/DR6a7BL2Px58JnKo7 |
| **WhatsApp** | +918121805929 |

All of the above can be changed anytime from **Admin → Settings** without touching code.

---

## Customer Features

### Homepage (`/`)
- Hero banner with business name and tagline
- Category shortcuts (Snacks, Fast Food, Tiffins, Beverages, Special Items)
- Today's Special section
- Popular Items section
- Recommended / Featured Items section
- Active coupons and offers display
- Customer reviews showcase

### Menu (`/menu`)
- Browse all menu items
- Filter by category
- Search by name or description
- Sort by: default, popular, price (low/high), rating
- Mobile-friendly grid layout

### Product Detail (`/menu/[item-slug]`)
- Product image, description, price
- Compare-at (strikethrough) price for offers
- Star rating and review count
- Quantity selector
- Add to Cart button
- Save to Favorites (logged-in users)
- Availability status (available / unavailable)
- SEO structured data (JSON-LD) for Google

### Shopping Cart (`/cart`)
- View all items in cart
- Increase / decrease quantity
- Remove items
- Apply coupon codes
- Price breakdown: subtotal, discount, delivery fee, total
- Proceed to Checkout

### Checkout (`/checkout`)
- Collect: name, phone, delivery address, order notes
- Payment options:
  - **Pay Online** — Razorpay (UPI, GPay, PhonePe, cards, net banking)
  - **Cash on Delivery (COD)**
- Loyalty points redemption (if customer has points)
- Minimum order value enforcement
- Order confirmation and redirect to tracking page

### Order Tracking (`/orders/[id]`)
- Visual step-by-step order tracker
- Statuses: Order Received → Payment Confirmed → Accepted → Preparing → Ready → Out For Delivery → Delivered
- Cancelled orders shown clearly
- Order items list with prices
- Delivery details and payment summary
- Reorder shortcut

### User Account (`/account`)
- **Profile** — update name and phone
- **My Orders** — full order history
- **Addresses** — save multiple delivery addresses
- **Favorites** — saved menu items
- **Loyalty Points** — balance displayed on account page
- Register (`/register`) and Login (`/login`) with email + password

### Static Pages
- **About** (`/about`) — business story and opening hours
- **Contact** (`/contact`) — phone, address, Google Maps link, WhatsApp

---

## Admin Panel Features

Access at `/admin` (admin login required).

### Dashboard (`/admin`)
- Total revenue (all time)
- Today's revenue
- Total orders count
- Pending orders count
- Completed orders count
- Total customer count
- Best selling items ranking

### Product Management (`/admin/products`)
- Add new menu items
- Edit existing items (name, description, price, category, image URL)
- Set compare-at price for offers
- Toggle: Available / Unavailable
- Toggle: Featured / Special / Popular flags
- Set sort order for menu display
- Delete products

### Category Management (`/admin/categories`)
- Add, edit, delete categories
- Set display order
- Active/inactive status

### Order Management (`/admin/orders`)
- View all orders with status and payment info
- Open order detail page
- Update order status (Accepted, Preparing, Ready, Out For Delivery, Delivered, Cancelled)
- Customer automatically notified on every status change

### Customer Management (`/admin/customers`)
- View all registered customers
- See loyalty points balance
- Block / unblock abusive users

### Coupon Management (`/admin/coupons`)
- Create discount coupons
- Percentage or flat (₹) discount
- Set minimum order value
- Set maximum discount cap
- Set expiry date
- Usage limit tracking
- Activate / deactivate coupons

### Settings (`/admin/settings`)
- Business name, phone, email, address
- About text
- Delivery fee amount
- Minimum order value
- Loyalty points earn rate
- Admin notification email
- Telegram chat ID for order alerts

---

## Payment System

- **Provider:** Razorpay (India)
- **Supported methods:** UPI, Google Pay, PhonePe, Credit/Debit Cards, Net Banking
- **Cash on Delivery:** Available as alternative
- **Security:**
  - Payment signature verification on every transaction
  - Razorpay webhook with HMAC signature validation
  - Payment status double-checked server-side
  - Failed payments handled gracefully
- **Webhook URL:** `https://yourdomain.com/api/razorpay/webhook`
- **Webhook events handled:** `payment.captured`, `payment.failed`, `refund.created`

---

## Notifications

### Customer receives (email + in-app):
- Order placed
- Payment success
- Order accepted
- Preparing
- Ready for pickup/delivery
- Out for delivery
- Delivered
- Cancelled

### Admin receives (email + Telegram):
- New order placed
- Payment received
- Order status changes
- Refund events

### Configuration:
- **Email:** via Resend (`RESEND_API_KEY` + `EMAIL_FROM`)
- **Telegram:** via bot token (`TELEGRAM_BOT_TOKEN`) + chat ID (set in Admin → Settings)

---

## Loyalty & Coupons

### Loyalty Points
- Customers earn points on every paid order
- Default rate: **10 points per ₹100 spent**
- 10 points = ₹1 discount at checkout
- Points balance visible on account page
- Redeem points during checkout
- Full transaction history stored in database

### Coupons
- Percentage discounts (e.g. 10% off)
- Flat discounts (e.g. ₹50 off)
- Minimum order value requirement
- Maximum discount cap
- Expiry dates
- Usage limits
- Pre-loaded coupons: `WELCOME10`, `FLAT50`, `FOOD20`

---

## SEO & PWA

### SEO
- Unique meta title and description per page
- Open Graph tags for social sharing
- Twitter card tags
- Auto-generated `sitemap.xml` (includes all products and categories)
- `robots.txt` configured
- JSON-LD structured data on product pages
- Google Analytics support (`NEXT_PUBLIC_GA_ID`)

### PWA (Progressive Web App)
- `manifest.json` configured with business name and icon
- Service worker with offline caching (Serwist)
- Installable on Android and iOS home screen
- No Play Store or App Store required
- Theme color: `#FF6B35` (brand orange)

---

## Security

- **Authentication:** Supabase Auth with JWT in secure HTTP-only cookies
- **Authorization:** Role-based access control (customer vs admin)
- **Database:** Row Level Security (RLS) on every table — users can only access their own data
- **Admin routes:** Protected by middleware — non-admins redirected to homepage
- **Payments:** Razorpay signature verification + webhook HMAC validation
- **HTTP Headers:** CSP, XSS Protection, X-Frame-Options, nosniff configured in `next.config.ts`
- **Passwords:** Hashed and salted by Supabase (never stored in plain text)
- **Service role key:** Server-side only, never exposed to browser

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI components | ShadCN UI (Radix primitives) |
| State management | Zustand (cart, persisted to localStorage) |
| Forms & validation | React Hook Form + Zod |
| Backend / BaaS | Supabase |
| Database | PostgreSQL (via Supabase) |
| Authentication | Supabase Auth |
| File storage | Supabase Storage (product images bucket) |
| Payments | Razorpay |
| Email | Resend |
| Notifications | Telegram Bot API |
| PWA | Serwist |
| Charts (admin) | Recharts |
| Hosting | Vercel |
| Analytics | Google Analytics (optional) |

---

## Project Structure

```
food-order-platform/
├── src/
│   ├── app/                  # All pages and API routes
│   │   ├── page.tsx          # Homepage
│   │   ├── menu/             # Menu listing + product detail
│   │   ├── cart/             # Shopping cart
│   │   ├── checkout/         # Checkout flow
│   │   ├── orders/           # Order tracking
│   │   ├── account/          # Customer account pages
│   │   ├── login/ register/  # Auth pages
│   │   ├── about/ contact/   # Static pages
│   │   ├── admin/            # Admin panel (all CRUD)
│   │   └── api/              # Backend API routes
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── layout/           # Header, footer
│   │   ├── products/         # Product card, grid
│   │   └── orders/           # Order tracker
│   ├── lib/
│   │   ├── supabase/         # Database clients
│   │   ├── notifications/    # Email + Telegram
│   │   ├── razorpay.ts       # Payment utilities
│   │   └── settings.ts       # Business settings loader
│   ├── store/
│   │   └── cart.ts           # Cart state (Zustand)
│   └── types/
│       └── database.ts       # TypeScript types
├── supabase/
│   └── migrations/           # Database SQL files (run in order)
│       ├── 001_initial_schema.sql
│       ├── 002_rls_policies.sql
│       ├── 003_seed_data.sql
│       ├── 004_storage.sql
│       └── 005_update_business_details.sql
├── public/
│   ├── manifest.json         # PWA manifest
│   └── icons/                # App icons
├── .env.example              # Environment variable template
├── DEPLOYMENT.md             # Deployment checklist
├── ARCHITECTURE.md           # Technical architecture reference
└── vercel.json               # Vercel deployment config
```

---

## Database Overview

15 tables, all with Row Level Security:

| Table | What it stores |
|-------|---------------|
| `profiles` | User accounts (name, phone, role, loyalty points) |
| `admins` | Admin user records |
| `addresses` | Customer saved delivery addresses |
| `categories` | Menu categories |
| `products` | Menu items |
| `product_images` | Additional product photos |
| `cart_items` | Server-side cart (optional) |
| `orders` | All orders with status and payment info |
| `order_items` | Line items per order |
| `payments` | Razorpay payment records |
| `coupons` | Discount coupons |
| `reviews` | Product reviews and ratings |
| `favorites` | Customer saved items |
| `loyalty_points` | Points earn/redeem history |
| `notifications` | In-app notification records |
| `settings` | Business configuration (name, fees, etc.) |

---

## Pages & Routes

### Customer Routes
| URL | Page |
|-----|------|
| `/` | Homepage |
| `/menu` | Full menu with filters |
| `/menu/[slug]` | Product detail |
| `/cart` | Shopping cart |
| `/checkout` | Checkout (login required) |
| `/orders/[id]` | Order tracking |
| `/account` | Account dashboard |
| `/account/orders` | Order history |
| `/account/profile` | Edit profile |
| `/account/addresses` | Saved addresses |
| `/account/favorites` | Favorite items |
| `/login` | Sign in |
| `/register` | Create account |
| `/about` | About the business |
| `/contact` | Contact info + map |

### Admin Routes (admin login required)
| URL | Page |
|-----|------|
| `/admin` | Dashboard |
| `/admin/products` | Product list |
| `/admin/products/new` | Add product |
| `/admin/products/[id]` | Edit product |
| `/admin/categories` | Manage categories |
| `/admin/orders` | Order list |
| `/admin/orders/[id]` | Order detail + status update |
| `/admin/customers` | Customer list |
| `/admin/coupons` | Coupon management |
| `/admin/settings` | Business settings |

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/orders/create` | POST | Create order + Razorpay payment order |
| `/api/razorpay/verify` | POST | Verify payment after checkout |
| `/api/razorpay/webhook` | POST | Razorpay server webhook |
| `/api/coupons/validate` | POST | Validate coupon at checkout |
| `/api/user/loyalty` | GET | Get logged-in user's loyalty points |
| `/api/admin/orders/[id]/status` | PATCH | Admin updates order status |
| `/auth/callback` | GET | Supabase auth redirect handler |

---

## Local Setup (Developer)

### Prerequisites
- Node.js 18 or higher
- npm
- A Supabase account (free tier works)
- A Razorpay account (test mode for development)

### Steps

1. **Clone / copy the project folder**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```
   Fill in all values (see [Environment Variables](#environment-variables) below).

4. **Set up Supabase database**
   - Create a project at [supabase.com](https://supabase.com)
   - Open SQL Editor
   - Run each migration file in order:
     - `supabase/migrations/001_initial_schema.sql`
     - `supabase/migrations/002_rls_policies.sql`
     - `supabase/migrations/003_seed_data.sql`
     - `supabase/migrations/004_storage.sql`
     - `supabase/migrations/005_update_business_details.sql`

5. **Configure Supabase Auth**
   - Authentication → Providers → Email → Enable
   - Authentication → URL Configuration:
     - Site URL: `http://localhost:3000`
     - Redirect URLs: `http://localhost:3000/auth/callback`

6. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

7. **Create admin account**
   - Register at `/register`
   - In Supabase SQL Editor, run:
     ```sql
     UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
     INSERT INTO public.admins (user_id)
     SELECT id FROM public.profiles WHERE email = 'your@email.com';
     ```
   - Log in and visit `/admin`

---

## Deployment to Production

Full checklist in `DEPLOYMENT.md`. Summary:

1. **Push code to GitHub**

2. **Deploy on Vercel**
   - Import GitHub repository
   - Set all environment variables from `.env.example`
   - Deploy (region: Mumbai `bom1` recommended)

3. **Update Supabase Auth URLs**
   - Site URL: `https://yourdomain.com`
   - Redirect: `https://yourdomain.com/auth/callback`

4. **Configure Razorpay webhook**
   - URL: `https://yourdomain.com/api/razorpay/webhook`
   - Events: `payment.captured`, `payment.failed`, `refund.created`

5. **Switch Razorpay to live keys** (replace test keys in Vercel env vars)

6. **Post-deployment checks**
   - Homepage loads with menu items
   - Registration and login work
   - Add to cart and checkout (test payment)
   - COD order flow works
   - Admin panel accessible
   - Email notification received
   - PWA installable on mobile
   - Submit sitemap to Google Search Console: `https://yourdomain.com/sitemap.xml`

---

## Environment Variables

Copy `.env.example` to `.env.local` (local) or set in Vercel dashboard (production).

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Yes | Your site URL (e.g. `https://yourdomain.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server only, keep secret) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Yes | Razorpay public key ID |
| `RAZORPAY_KEY_ID` | Yes | Razorpay key ID (server) |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay secret key (keep secret) |
| `RAZORPAY_WEBHOOK_SECRET` | Yes | Razorpay webhook signing secret |
| `RESEND_API_KEY` | Yes | Resend email API key |
| `EMAIL_FROM` | Yes | Sender email (e.g. `Ammu's Chai <orders@yourdomain.com>`) |
| `TELEGRAM_BOT_TOKEN` | Optional | Telegram bot token for admin alerts |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics measurement ID |

> **Never commit `.env` or `.env.local` to Git. Never expose service role or Razorpay secret keys in the browser.**

---

## Admin Setup Guide

### First-time setup (one time only)

1. Register your account at `/register`
2. Promote yourself to admin via Supabase SQL (see Local Setup step 7)
3. Log in and go to `/admin`
4. Open **Settings** and configure:
   - Business name, phone, address
   - Delivery fee (default: ₹40)
   - Minimum order value (default: ₹99)
   - Admin email for order notifications
   - Telegram chat ID (optional — for instant mobile alerts)
5. Go to **Products** and update/add your real menu items
6. Go to **Categories** and adjust if needed
7. Go to **Coupons** and create your own offers

### Managing a new order

1. You receive an email and/or Telegram alert
2. Go to `/admin/orders`
3. Click the order number
4. Update status as you progress:
   - **Accepted** — order confirmed
   - **Preparing** — kitchen is working on it
   - **Ready** — ready for pickup or dispatch
   - **Out For Delivery** — on the way
   - **Delivered** — complete
5. Customer is automatically notified at each step

### Adding a new menu item

1. `/admin/products` → **Add Product**
2. Fill in: name, description, price, category
3. Paste image URL (upload to Supabase Storage or any image host)
4. Toggle Featured / Special / Popular as needed
5. Save — item appears on menu immediately

---

## Daily Operations Guide

| Task | Where | Time needed |
|------|-------|-------------|
| Check new orders | `/admin/orders` | Instant |
| Update order status | `/admin/orders/[id]` | 10 seconds |
| Add today's special | `/admin/products` → edit item → toggle Special | 30 seconds |
| Mark item unavailable | `/admin/products` → edit → toggle Available off | 15 seconds |
| Create a coupon | `/admin/coupons` | 1 minute |
| Block a customer | `/admin/customers` | 10 seconds |
| Change delivery fee | `/admin/settings` | 30 seconds |
| View sales report | `/admin` dashboard | Instant |

**No developer needed for any of the above.**

---

## Included Seed Data

The database ships pre-loaded with:

### Categories (5)
- Snacks
- Fast Food
- Tiffins
- Beverages
- Special Items

### Sample Products (14)
- Samosa, Veg Spring Roll, French Fries
- Veg Burger, Margherita Pizza, Paneer Wrap
- Masala Dosa, Veg Thali, Idli Sambar
- Masala Chai, Cold Coffee, Fresh Lime Soda
- Chef Special Biryani, Weekend Combo

### Coupons (3)
- `WELCOME10` — 10% off, min ₹150
- `FLAT50` — ₹50 flat off, min ₹300
- `FOOD20` — 20% off, min ₹500

### Business Settings
- Pre-configured with Ammu's Chai With Maska Bun details (Nellore address, phone, maps link)

Replace all sample menu items with your real menu after setup.

---

## Third-Party Services Required

| Service | Purpose | Free tier? | Sign up |
|---------|---------|-----------|---------|
| **Supabase** | Database, auth, storage | Yes (generous free tier) | [supabase.com](https://supabase.com) |
| **Vercel** | Website hosting | Yes (hobby plan) | [vercel.com](https://vercel.com) |
| **Razorpay** | Payment processing | Test mode free; live has transaction fees | [razorpay.com](https://razorpay.com) |
| **Resend** | Transactional email | Yes (3,000 emails/month free) | [resend.com](https://resend.com) |
| **Telegram Bot** | Admin order alerts | Free | [@BotFather](https://t.me/BotFather) on Telegram |
| **Google Analytics** | Traffic analytics | Free | [analytics.google.com](https://analytics.google.com) |

---

## Ongoing Costs (Estimate)

| Service | Cost |
|---------|------|
| Vercel hosting | Free (hobby) or ~$20/month (pro) |
| Supabase | Free up to 500MB DB; $25/month pro |
| Razorpay | 2% + GST per transaction (standard India rate) |
| Resend email | Free up to 3,000/month |
| Domain name | ~₹500–1,000/year |
| Telegram | Free |

**Estimated monthly cost for a small shop: ₹0–2,000/month** (excluding payment transaction fees).

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Homepage shows no menu items | Run database migrations; check Supabase connection in `.env.local` |
| Cannot log in | Check Supabase Auth is enabled; verify Site URL in Supabase dashboard |
| Admin panel redirects to home | Run admin promotion SQL; ensure `role = 'admin'` in profiles table |
| Payment fails at checkout | Verify Razorpay keys; use test card `4111 1111 1111 1111` in test mode |
| Webhook not firing | Check webhook URL in Razorpay dashboard; verify `RAZORPAY_WEBHOOK_SECRET` |
| Emails not sending | Check `RESEND_API_KEY` and `EMAIL_FROM`; verify domain in Resend |
| Telegram alerts not working | Set `TELEGRAM_BOT_TOKEN` in env; add chat ID in Admin → Settings |
| Cart count hydration warning | Already fixed with mounted-state pattern in header |
| Business name still shows old name | Run `005_update_business_details.sql` in Supabase SQL Editor |
| Build fails | Run `npm install` then `npm run build`; check all env vars are set |

---

## Future Upgrade Path

The following are **not included** in this version but the architecture supports adding them:

- Delivery partner app
- WhatsApp ordering integration
- AI-based menu recommendations
- Inventory / stock management
- GST invoice generation
- Multi-language support (Hindi, Telugu)
- Multiple branch / franchise support
- Native Android and iOS apps
- Customer referral program

---

## Quick Command Reference

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Start production server locally
npm start

# Run linter
npm run lint
```

---

## Support Files

| File | Purpose |
|------|---------|
| `README.md` | This file — full buyer and developer guide |
| `DEPLOYMENT.md` | Step-by-step production deployment checklist |
| `ARCHITECTURE.md` | Technical architecture for developers |
| `.env.example` | Environment variable template |
| `supabase/migrations/` | Database setup SQL files |

---

**Ammu's Chai With Maska Bun** — Nellore, Andhra Pradesh  
Phone: 8121805929 | [Google Maps](https://maps.app.goo.gl/DR6a7BL2Px58JnKo7)
