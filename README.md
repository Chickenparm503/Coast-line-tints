# Coastline Tints

Multi-page static website for **Coastline Tints** — automotive, residential, commercial, RV & fleet window tinting in Abbotsford, BC.

## Pages

- `index.html` — home: hero slideshow, quote box, services overview, stats, process, gallery preview, reviews, contact
- `services.html` — in-depth Automotive / Residential / Commercial / RV & Fleet sections
- `why-tint.html` — benefits, film-type comparison (dyed/carbon/ceramic), BC tint law note, FAQ
- `gallery.html` — full photo gallery with category tags and lightbox
- `reviews.html` — customer review cards + service standards
- `contact.html` — quote form, contact info, booking steps, quick FAQ

## Features

- Full-screen hero slideshow with Ken Burns zoom and staggered text animations
- Prominent **Get a Free Quote** box — in the hero on desktop, its own section on mobile — plus a full contact form
- Reactive particle background that responds to mouse movement and scroll
- Scroll-reveal animations, animated stat counters, FAQ accordions, gallery lightbox
- Mobile-first responsive layout with hamburger menu; current page highlighted in the nav
- SEO: per-page titles/descriptions, Open Graph tags + LocalBusiness JSON-LD structured data
- Respects `prefers-reduced-motion`

## Structure

- `*.html` — the six pages (no build step, no dependencies)
- `assets/style.css`, `assets/main.js` — shared styles and behavior
- `images/` — site photography

## Preview locally

```
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

Upload everything (HTML files, `assets/`, `images/`) to any static host (GitHub Pages, Netlify, Cloudflare Pages, or classic web hosting). No server-side code required.

## Before launch

- The testimonials in the Reviews section are placeholders — swap in real customer reviews.
- Quote forms POST to [FormSubmit](https://formsubmit.co/) and deliver straight to Coastlinetints@coastlinetints.com. **One-time activation required:** the first submission triggers a confirmation email to that inbox — click "Activate" in it and every later submission flows through. (After activation, FormSubmit also issues a random alias endpoint you can swap into the `action` attributes to keep the raw email address out of the page source.)
