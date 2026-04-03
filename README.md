# Podis Landing Funnel (Smoke Validation)

SEO-optimized, conversion-focused landing page for validating demand before full SaaS build.

## What this includes

- Dark Discord-inspired branding (`#1E1E2F`, accent `#7289DA`)
- High-conversion funnel structure (awareness → problem/solution → ROI → lead capture)
- On-page SEO: metadata, canonical, Open Graph, Twitter cards, keyword-rich sections
- JSON-LD structured data: `Organization`, `SoftwareApplication`, and `FAQPage`
- Waitlist form with local lead capture (for validation/testing)
- `robots.txt` and `sitemap.xml`
- Small SEO validation script

## Project structure

- `index.html` – Page + copy + schema markup
- `styles.css` – Brand styling and responsive UI
- `app.js` – Scroll UX, ROI calculator, lead form behavior
- `scripts/check-seo.mjs` – Basic SEO/content checks
- `robots.txt`, `sitemap.xml` – Crawl/index helpers

## Run locally

```bash
npm test
npm start
```

Then open `http://localhost:4173`.

## Notes for production

- Replace canonical and sitemap URLs if domain changes.
- Replace placeholder Open Graph images (`/og-image.jpg`).
- Connect `#lead-form` to your CRM (HubSpot, ConvertKit, etc.) or backend endpoint.
- Add analytics (GA4 + ad pixels) and map events (`waitlist_submit`, CTA clicks).
