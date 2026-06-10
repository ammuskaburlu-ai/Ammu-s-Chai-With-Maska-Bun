# Architecture — Ammu's Chai With Maska Bun Food Ordering Platform

## System Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Customer  │────▶│  Next.js 15  │────▶│  Supabase   │
│   Browser   │     │  App Router  │     │  PostgreSQL │
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Razorpay │ │  Resend  │ │ Telegram │
        │ Payments │ │  Email   │ │   Bot    │
        └──────────┘ └──────────┘ └──────────┘
```

## Folder Structure

```
src/
├── app/                    # Next.js App Router pages & API
│   ├── (customer)/         # Home, menu, cart, checkout, account
│   ├── admin/              # Admin dashboard & CRUD
│   ├── api/                # REST API routes
│   └── auth/               # Auth callback
├── components/
│   ├── ui/                 # ShadCN UI primitives
│   ├── layout/             # Header, footer
│   ├── products/           # Product cards, grid
│   └── orders/             # Order tracker
├── lib/
│   ├── supabase/           # Client, server, admin, middleware
│   ├── notifications/      # Email + Telegram
│   └── razorpay.ts         # Payment utilities
├── store/                  # Zustand cart store
└── types/                  # TypeScript database types
supabase/
└── migrations/             # SQL schema, RLS, seed data
```

## Database Schema

| Table | Purpose |
|-------|---------|
| profiles | User profiles (extends auth.users) |
| admins | Admin role tracking |
| addresses | Customer delivery addresses |
| categories | Menu categories |
| products | Menu items |
| product_images | Additional product images |
| cart_items | Server-side cart (optional) |
| orders | Order records |
| order_items | Line items per order |
| payments | Razorpay payment records |
| coupons | Discount coupons |
| reviews | Product reviews |
| favorites | Saved items |
| loyalty_points | Points transaction history |
| notifications | In-app notifications |
| settings | Business configuration |

## API Architecture

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/orders/create | POST | Create order + Razorpay order |
| /api/razorpay/verify | POST | Verify payment signature |
| /api/razorpay/webhook | POST | Razorpay webhook handler |
| /api/coupons/validate | POST | Validate coupon code |
| /api/user/loyalty | GET | Get loyalty points |
| /api/admin/orders/[id]/status | PATCH | Update order status |

## Authentication

- Supabase Auth with email/password
- JWT stored in secure HTTP-only cookies via `@supabase/ssr`
- Middleware enforces route protection
- RBAC: `profiles.role` = `customer` | `admin`

## Deployment

- **Frontend/API**: Vercel (region: bom1)
- **Database/Auth/Storage**: Supabase
- **Payments**: Razorpay (webhook at `/api/razorpay/webhook`)
- **Email**: Resend
- **Notifications**: Telegram Bot API
