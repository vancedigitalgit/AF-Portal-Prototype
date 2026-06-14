# Project Status — Adlees Fresh Ordering Portal

**Last updated:** 13 June 2026  
**Stage:** Post-proposal — prototype refined, awaiting build sign-off

---

## What This Is

A production B2B wholesale ordering portal for Adlees Fresh. Customers (cafes, aged care, schools, etc.) log in and place orders. Adam manages everything from an admin panel. No public sign-up — invite-only accounts only.

---

## Current Stage

| Step | Status |
|---|---|
| Technical research (6 tracks) | ✓ Done — `../research/` |
| Prototype (customer + admin portal) | ✓ Done — this codebase |
| Prototype reviewed by Adam | ✓ Happy with it |
| Proposal meeting with Adam | ✓ Done — 11 June 2026 |
| Build sign-off | Pending Adam confirmation |
| Planning session (post-meeting) | Pending Adam's answers |
| Wave 1 — Foundation (Supabase, schema, auth, types) | Not started |
| Wave 2 — Customer portal | Not started |
| Wave 2 — Admin portal | Not started |
| Wave 2 — Email + feedback | Not started |
| Phase 2 (Xero) | Not started |

---

## What's in This Prototype

This is a **demo only** — no real backend, no auth, no database. Built to show Adam the UX and feature set before committing to a build.

### Customer Portal (`/customer/`)
- `/customer/shop` — product catalogue with tabs, filters, search, add to cart
- `/customer/cart` — cart with per-item notes, order notes, delivery date, cut-off countdown
- `/customer/orders` — order history with status tracking, inline cancel confirmation, reorder
- `/customer/orders/[id]` — order detail + edit page (qty steppers, per-item notes, add/remove items, edit order notes and PO number)
- `/customer/favourites` — saved favourite lists (load to cart)
- `/customer/notices` — update notices from Adam
- `/customer/account` — account management

### Admin Portal (`/admin/`)
- `/admin/dashboard` — live orders summary, cut-off time, quick stats
- `/admin/orders` — all orders with status filters
- `/admin/orders/[id]` — order detail with status update buttons
- `/admin/products` — product management, availability toggle
- `/admin/customers` — customer accounts
- `/admin/messages` — post notices to customers

### Shared
- `FeedbackButton` — floating feedback button on every page (both portals). Bug / Feature Request / Not Working + optional screenshot. In production: uploads to Supabase Storage, emails developer via Resend.

---

## Confirmed Feature Set (Phase 1)

**Customer:**
- Invite-only login (no self-registration)
- Product catalogue with search and filters (products toggled unavailable by admin are hidden — no stock quantity tracking)
- Cart with per-item notes and order-level notes
- Cut-off time display and delivery date selection
- Order submission (confirmation email sent automatically)
- Order modification before cut-off (edit until 8pm same day, cancel until 4pm — confirmed with Adam)
- Favourites lists (up to 10 named lists per customer)
- Order history (past 2 weeks) with status tracking and reorder
- Real-time order status updates
- Update notices from Adam (passive read, no email)
- Account self-management
- Feedback button

**Admin:**
- Live orders dashboard
- Product management (add/edit/availability toggle/daily checklist)
- Customer account management (invite, create, edit)
- Order board with status filters
- Order detail with status update buttons
- Packing slip (new window print — content written to an isolated `window.open()` window, avoids full-page print)
- CSV export
- Update notices (post, pin, manage)
- Feedback button

---

## Production Stack (When Build Starts)

| Layer | Choice |
|---|---|
| Frontend / API | Next.js App Router |
| Database + Auth + Storage | Supabase (PostgreSQL + RLS + Auth + Storage) |
| Hosting | Vercel → VPS if needed |
| Email | Nodemailer + Google Workspace SMTP |
| Rate limiting | Upstash Redis |
| Error tracking | Sentry |
| Invoicing (Phase 2) | Xero via xero-node SDK |

---

## Effort Estimate

| Phase | Days | Notes |
|---|---|---|
| Phase 1 — Full ordering portal | ~73 days | Solo dev estimate |
| Phase 2 — Xero integration | ~5 days | After Phase 1 stable |

**Fixed price: $7,000 AUD (Phase 1)**  
Market rate for this scope: $58k–$94k AUD. Priced as a portfolio/relationship engagement.

---

## Research Files

All in `../research/`:

| File | What's in it |
|---|---|
| `MASTER-SUMMARY.md` | Full scope, effort, pricing, risks, questions for Adam |
| `track-A-supabase-schema.md` | Full DB schema SQL, RLS, migrations, Supabase architecture |
| `track-B-auth-security.md` | Auth patterns, RBAC, invite flow, RLS policies, Zod, OWASP |
| `track-C-nextjs-deployment.md` | Next.js + Supabase integration, server actions, caching, Vercel + VPS |
| `track-D-order-lifecycle.md` | Order status machine, cut-off logic, modification, favourites, availability |
| `track-E-email-pdf.md` | Nodemailer + Google Workspace SMTP, 5 email types, failure handling, packing slip print approach, feedback feature implementation |
| `track-F-xero-integration.md` | Xero OAuth, Custom Connections, invoice creation, Australian GST |

---

## Questions to Confirm with Adam (Proposal Meeting)

- 
- [ ] Order number format — does Adlees use an existing reference? (e.g. AF-2026-00001)

- [x] Cut-off time — **4pm to place an order, 8pm to modify a submitted order** (confirmed by Adam, 11 June 2026)

- [ ] GST per product line — which lines are GST-free vs taxable? (Phase 2 pre-req, needs accountant)
- [ ] Historical data — any existing customer or product data to import?

- [ ] Notice types — what categories for the update board? (e.g. Availability, Price change, General)

- [ ] Admin dashboard — what does Adam want to see at a glance? (e.g. today's orders, confirmed count, pending, total value, cut-off countdown)

---

## Where to Start When Build Is Approved

1. Supabase project setup — Auth, Storage buckets, connection strings, env vars
2. DB schema migrations — run in order from `track-A-supabase-schema.md`
3. Auth — invite flow, middleware, RLS policies (`track-B-auth-security.md`)
4. Order lifecycle server actions — status machine, cut-off logic, price snapshotting (`track-D`)
5. Email templates — Resend setup, React Email components (`track-E`)
6. UI build — customer shop + cart + orders, then admin dashboard + order management
7. Integration testing — two customer accounts, full order flow end-to-end
8. Xero (Phase 2) — after Phase 1 is live and stable
