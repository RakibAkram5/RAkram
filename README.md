# RAKRAM

Premium multi-category e-commerce frontend for Pakistan — dark luxury design, glassmorphism UI, prices in PKR, nationwide delivery UX.

> **Phase 1 — frontend only.** Products, prices, ratings, stock, reviews, orders and customers are **demonstration data**. Checkout, payments and authentication are **interface demonstrations**: no orders are placed, no payments are taken, no accounts are created.

## Stack

- **Next.js 16** (App Router, Cache Components / Partial Prerendering, Turbopack)
- **React 19**, **TypeScript** (strict)
- **Tailwind CSS v4** with design tokens in `src/app/globals.css`
- **Motion** (`motion/react`) for animation — respects `prefers-reduced-motion`
- **lucide-react** icons
- No state library: cart / wishlist / UI state use a ~60-line `useSyncExternalStore` store (`src/store`)

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (186 prerendered routes)
npm start          # serve the production build
npm run lint
npx tsc --noEmit
```

Optional: copy `.env.example` to `.env.local`. No secrets are required for Phase 1.

## What's included

| Area | Routes |
| --- | --- |
| Storefront | `/`, `/shop` (search via `?q=`), `/category/[slug]` (`?sub=`), `/collections/[slug]`, `/product/[slug]` |
| Shopping | `/cart`, `/checkout`, `/checkout/confirmation`, `/wishlist`, cart drawer, quick view, search overlay |
| Customer portal (demo) | `/account/login`, `/account/register`, `/account/forgot-password`, `/account`, `/account/orders`, `/account/orders/[id]`, `/account/addresses`, `/track-order` |
| Content | `/delivery` (fee estimator), `/about`, `/help` |
| Admin (demo) | `/admin`, `/admin/analytics`, `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit`, `/admin/categories`, `/admin/inventory`, `/admin/orders`, `/admin/customers`, `/admin/coupons`, `/admin/settings` |
| SEO | per-page metadata & Open Graph, `sitemap.xml`, `robots.txt` |

Demo coupon codes: `RAKRAM10`, `WELCOME500`, `FREESHIP`. Sample tracking numbers: `RK-20481` … `RK-20477`.

## Project structure

```
src/
  app/
    (store)/        storefront route group (shared header/footer/drawers)
    admin/          separate admin layout
    sitemap.ts, robots.ts, layout.tsx, globals.css (design tokens)
  components/
    ui/             buttons, fields, overlays (drawer/modal), badges, skeletons
    layout/         header, footer, search, cart drawer, mobile menu
    product/        card, gallery + zoom, purchase panel, quick view, rails
    shop/           catalogue browser (search, filters, sort)
    checkout/       cart, checkout, confirmation, delivery estimator
    account/        auth forms, portal, orders, addresses
    admin/          admin shell, charts, product & store managers
  data/             centralised mock data (categories, products, Pakistan delivery, orders)
  lib/              types, catalogue/search logic, pricing, validation, formatting
  services/         API seam for Phase 2 (catalog, orders, delivery, auth, http)
  store/            client state (cart, wishlist, recently viewed, UI)
```

**Adding a category:** append it to `src/data/categories.ts` — navigation, mega-menu, category page, filters, sitemap and admin all update automatically.

## Security notes

- Client-side validation (`src/lib/validation.ts`) is for UX only; **everything must be re-validated server-side**.
- Browser storage holds only non-sensitive ids/quantities (cart, wishlist, recently viewed) and a demo sign-in boolean. Checkout details are kept in memory only and never persisted.
- No `dangerouslySetInnerHTML`; all content is React-escaped. Admin image inputs are restricted to `https` URLs on an allow-listed host.
- Cart totals are always re-priced from the catalogue by product id, never from stored prices.
- **Admin has no access control in Phase 1.** It must be protected by server-side authentication and role checks (e.g. `proxy.ts` + API authorisation) before any real data is connected. Client-side checks are not security.
- Security headers are set in `next.config.ts`; a nonce-based CSP should be added once production origins are final.
- Only `NEXT_PUBLIC_*` variables are read in the browser; never put secrets in them.

## Imagery

Demo photography is served from Unsplash. Some stock images show third-party products or trademarks; brand names in the catalogue are fictional and no affiliation is implied. **Replace with RAKRAM's own product photography before launch.**

## Phase 2 roadmap (backend)

1. **API & database** — catalogue, inventory, orders, customers, coupons. Implement `src/services/*` against the API; keep the types in `src/lib/types.ts` as the contract.
2. **Authentication** — server sessions or OIDC provider; httpOnly/SameSite cookies; CSRF protection; rate-limited login and password reset.
3. **Admin authorisation** — server-side role checks on every admin route and API mutation; audit log for stock/price changes.
4. **Checkout** — server-side re-pricing, stock reservation, coupon validation, order creation, idempotency keys.
5. **Payments** — COD confirmation flow, bank-transfer reconciliation, Easypaisa & JazzCash redirect/webhook integrations (server-side keys only).
6. **Couriers** — implement `DeliveryProvider` (`src/services/delivery.ts`) for TCS / Leopards / M&P / PostEx etc.: live rates, shipment booking, tracking webhooks.
7. **Notifications** — order SMS/WhatsApp/email, newsletter provider.
8. **Media** — signed uploads to a CDN, real product photography.
9. **Localisation** — Urdu (RTL) locale; `lang`/`dir` are already centralised in the root layout.
10. **Hardening** — CSP with nonces, rate limiting, monitoring, analytics with consent.
