# Deployment Checklist

## 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run migrations: `supabase db push` or apply SQL files in `supabase/migrations/` via SQL Editor
3. Enable Email auth in Authentication → Providers
4. Set Site URL to your Vercel domain
5. Add redirect URL: `https://yourdomain.com/auth/callback`
6. Copy API keys to environment variables

### Create Admin User

After first user registers, promote to admin:

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@yourdomain.com';
INSERT INTO public.admins (user_id) SELECT id FROM public.profiles WHERE email = 'admin@yourdomain.com';
```

## 2. Razorpay Setup

1. Create account at [razorpay.com](https://razorpay.com)
2. Get API keys from Dashboard → Settings → API Keys
3. Create webhook pointing to `https://yourdomain.com/api/razorpay/webhook`
4. Enable events: `payment.captured`, `payment.failed`, `refund.created`
5. Copy webhook secret to `RAZORPAY_WEBHOOK_SECRET`

## 3. Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Set all environment variables from `.env.example`
4. Deploy

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| NEXT_PUBLIC_APP_URL | Production URL |
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon key |
| SUPABASE_SERVICE_ROLE_KEY | Service role key (server only) |
| NEXT_PUBLIC_RAZORPAY_KEY_ID | Razorpay public key |
| RAZORPAY_KEY_SECRET | Razorpay secret |
| RAZORPAY_WEBHOOK_SECRET | Webhook signature secret |
| RESEND_API_KEY | Email API key |
| EMAIL_FROM | Sender email address |
| TELEGRAM_BOT_TOKEN | Optional Telegram bot token |

## 4. Post-Deployment

- [ ] Verify homepage loads with seed data
- [ ] Test user registration and login
- [ ] Test add to cart and checkout (Razorpay test mode)
- [ ] Test COD order flow
- [ ] Verify webhook receives payment events
- [ ] Test admin panel access
- [ ] Verify email notifications
- [ ] Test PWA install on mobile
- [ ] Run Lighthouse audit (target: 90+ mobile)
- [ ] Submit sitemap to Google Search Console

## 5. Production Security

- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `RAZORPAY_KEY_SECRET` client-side
- Use Razorpay live keys only in production
- Enable Supabase RLS (already configured)
- Review CSP headers in `next.config.ts`
