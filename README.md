# Vice City Files

**Every File. Every Theory. Every Street.** — Your Unofficial GTA 6 Archive.

An unofficial fan website inspired by GTA 6 and Vice City. Not affiliated with Rockstar Games or Take-Two Interactive. No copyrighted assets are used — all visuals are original fan art, neon gradient placeholders, or links to official sources.

## Tech Stack

| Layer      | Technology                                        |
| ---------- | ------------------------------------------------- |
| Framework  | Next.js 15 (App Router, React Server Components)  |
| Language   | TypeScript (strict)                               |
| Styling    | Tailwind CSS + custom neon design system          |
| UI         | Shadcn-style primitives (`src/components/ui`)     |
| Animation  | Framer Motion                                     |
| CMS        | Headless WordPress via WPGraphQL                  |
| Commerce   | WooCommerce (WooGraphQL) + Stripe Checkout        |
| Media      | Cloudinary (f_auto/q_auto delivery)               |
| Maps       | Stylized SVG fan map, Mapbox GL-ready             |
| Deployment | Vercel (ISR + on-demand revalidation)             |

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in your keys (all optional for local dev)
npm run dev
```

The site works fully **without any environment variables** — every service falls back to the built-in demo content in `src/lib/mock-data.ts`. Connect real backends by filling in `.env.local`.

## Project Structure

```
src/
  app/                  # App Router pages, API routes, sitemap, robots, RSS
    api/checkout/       # Stripe Checkout session (server-side price resolution)
    api/search/         # Global search endpoint
    api/revalidate/     # On-demand ISR webhook for WordPress
    wiki/[category]/[slug]/
    news/[slug]/
    store/[slug]/ + cart + success
    map/ media/ community/[section]/ search/ about/
  components/
    ui/                 # Button, Card, Badge, Input, Skeleton, Separator, Slot
    layout/             # Navbar (sticky, search, cart, theme), Footer
    shared/             # Cards, Ticker, RumorMeter, Gallery, SearchDialog,
                        # Pagination, Breadcrumbs, Motion wrappers, MediaImage
  features/
    home/               # Hero, WikiCategories, FeaturedArticles, MapPreview,
                        # CharacterSpotlight, MerchPreview, MediaGallery, Community
    map/                # Interactive ViceMap
    store/              # AddToCart, CartView
    community/          # CommunityPostCard
  services/             # wordpress.ts, woocommerce.ts, search.ts, cloudinary.ts
  graphql/              # WPGraphQL client + queries
  providers/            # ThemeProvider, CartProvider (localStorage persistence)
  hooks/                # useDebounce
  lib/                  # constants, utils, seo (metadata + JSON-LD), mock-data
  types/                # Domain types
  styles/               # globals.css — design tokens, glassmorphism, VHS effects
```

## WordPress CMS Setup

1. Host WordPress anywhere (e.g. `cms.vicecityfiles.com`).
2. Install plugins: **WPGraphQL**, **WPGraphQL for ACF**, **Advanced Custom Fields**, **WooCommerce**, **WooGraphQL**, and optionally **Yoast SEO + WPGraphQL Yoast**.
3. Register custom post types (`show_in_graphql: true`) matching `src/services/wordpress.ts`:
   `character`, `vehicle`, `location`, `weapon`, `mission`, `business`, `gang`, `easterEgg`.
4. Create ACF field groups:
   - `wikiFields`: `summary` (text), `stats` (JSON textarea), `gallery` (gallery), `relatedSlugs` (text)
   - `articleFields`: `rumorLevel` (select: confirmed/likely/rumor/debunked), `featured` (boolean)
5. Set `WORDPRESS_GRAPHQL_ENDPOINT` and `WORDPRESS_HOSTNAME`.
6. (Optional) Add a save-post webhook to `POST /api/revalidate` with header `x-revalidation-secret` for instant cache invalidation.

## Stripe Setup

1. Create a Stripe account, grab keys into `.env.local`.
2. Checkout sessions are created server-side in `src/app/api/checkout/route.ts`. **Prices are resolved from the product catalog on the server — client prices are never trusted.**
3. Optionally set `stripePriceId` per product to use Stripe-managed prices.
4. Add a webhook for `checkout.session.completed` → your WooCommerce order sync (extend as needed).

## Deploying to Vercel

1. Push this repo to GitHub.
2. `vercel.com` → **New Project** → import repo (framework auto-detected: Next.js).
3. Add environment variables from `.env.example` (Production + Preview).
4. Deploy. ISR is preconfigured (`revalidate` per route + tag-based on-demand revalidation).
5. Point your domain, set `NEXT_PUBLIC_SITE_URL` to the production URL, and redeploy.
6. Verify `https://yourdomain/sitemap.xml`, `/robots.txt`, and `/feed.xml`.

### Performance checklist (Lighthouse 95+)

- Server Components everywhere; client components only for interactivity
- `next/image` with AVIF/WebP + Cloudinary `f_auto,q_auto`
- `next/font` with `display: swap` (Inter, Orbitron, JetBrains Mono)
- Static generation + ISR (`generateStaticParams` on all dynamic routes)
- Immutable cache headers for static assets, `s-maxage` on API/RSS
- Zero layout shift: aspect-ratio boxes on all media

## Legal

Vice City Files is an unofficial fan site and is not affiliated with Rockstar Games or Take-Two Interactive. All trademarks belong to their respective owners. Do not add copyrighted assets to this repository.