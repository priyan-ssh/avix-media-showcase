Note on stack: This project runs on TanStack Start (React + Vite), not Next.js. I'll build the exact design and structure you specified with a data-driven architecture so Decap CMS can be wired up later, but hosting stays on Lovable (routes work on refresh — no `out/` folder produced).

## Design tokens (`src/styles.css`)
- `--background: #0A0A0A`, `--card: #1A1A1A`, `--primary: #DE1B24` (red accent), `--foreground: #FFFFFF`, `--muted-foreground: #A1A1A1`, `--border: #262626`.
- Load Inter via `<link>` in `__root.tsx` head; register `--font-sans: Inter` in `@theme`.
- Container: `max-w-[1200px] mx-auto px-6`, 12-col grid utilities.

## Content data layer (Decap-ready)
JSON files under `public/content/` — served as static assets, easy to point Decap at:
```
public/content/
  site.json          # nav links, logo text, footer, social
  home.json          # hero, stats, partners, showreel, clips[], cta
  about.json         # hero, features[]
  contact.json       # heading, subtext, details[], form labels
```
Each page imports its JSON via `fetch('/content/*.json')` in a route loader using `queryClient.ensureQueryData` + `useSuspenseQuery` (isomorphic, works on refresh, easy for Decap edits to appear without redeploy of components).

## Components (all data-driven via props)
`src/components/`
- `Navbar.tsx` — logo (Play icon + "AVIIX MEDIA"), center links with red underline on active via `activeProps`, right CTA button. Mobile: hamburger → sheet.
- `Footer.tsx` — logo, copyright, social icons.
- `Button.tsx` — variants: `red` (filled), `outline` (white border).
- `Hero.tsx` — split 12-col: left text + CTAs + scroll indicator, right image slot (dark placeholder w/ aspect ratio). Supports highlighted red word.
- `StatsBar.tsx` — 4-col row, thin vertical red dividers.
- `PartnerLogos.tsx` — "I'VE WORKED WITH" label + row of text logos with thin grey dividers between.
- `Showreel.tsx` — split: label/heading/subtext/watch button (Play icon in red ring) + dark thumbnail placeholder.
- `ClipsCarousel.tsx` — Embla Carousel (already in shadcn stack; swipeable mobile, dark round arrow buttons). Card: dark bg, 9:16 thumbnail, colored bold title (red/yellow/green via prop), subtitle, views + play icon.
- `BottomCTA.tsx` — centered heading with red highlight span + subtext + red button.
- `AboutHero.tsx` — split similar to Hero, LET'S WORK TOGETHER outline red button.
- `FeatureGrid.tsx` — 3-col, Lucide icons (Zap, Star, Globe) in red-tinted rounded squares.
- `ContactSplit.tsx` — left heading+details (Mail, Instagram, MapPin icons), right form (name/email/message) with `#1A1A1A` inputs and **red** SEND MESSAGE button (overriding the purple in reference per your instruction).

Placeholders: solid `#1A1A1A` blocks with subtle gradient + correct aspect ratios (16:9 for hero/showreel, 9:16 for clips, 4:5 for about silhouette), each accepting an `image?: string` prop that will replace the placeholder when JSON provides a URL.

## Routes
- `src/routes/index.tsx` — Home (replaces placeholder). Sections: Hero, Stats, Partners, Showreel, Clips, BottomCTA.
- `src/routes/about.tsx` — AboutHero + FeatureGrid + BottomCTA.
- `src/routes/contact.tsx` — ContactSplit.
- Each route: unique `head()` with title/description/og/twitter.
- `__root.tsx`: add Inter `<link>` tags, wrap Outlet with `<Navbar />` + `<Footer />`, keep dark background.

## Responsive
- Mobile: stack hero columns, stats become 2×2 grid with red dividers hidden, partners wrap, clips carousel one-per-view, contact stacks.
- Use `grid-cols-[minmax(0,1fr)_auto]` pattern for nav header on mobile.

## Out of scope (for later)
- Actual Decap `config.yml` (you said you'll configure). I'll leave a short comment in `public/content/README.md` documenting field names so mapping is trivial.
- Real photography — dark placeholders in place, swappable via JSON.
- Form submission backend — form is UI only; wire to Cloud/Formspree later.

## Deliverables
Design tokens updated, 3 routes, ~12 components, 4 JSON content files, navbar/footer in root, all text/images pulled from JSON.