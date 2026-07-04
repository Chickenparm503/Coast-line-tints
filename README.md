# Coastline Tints

Single-file HTML website for **Coastline Tints** — automotive, residential, commercial, RV & fleet window tinting in Abbotsford, BC.

## Features

- Full-screen hero slideshow with Ken Burns zoom and staggered text animations
- Prominent **Get a Free Quote** box — in the hero on desktop, its own section on mobile — plus a full contact form
- Reactive particle background that responds to mouse movement and scroll
- Scroll-reveal animations, animated stat counters, testimonial slider, gallery lightbox
- Mobile-first responsive layout with hamburger menu
- SEO: meta/Open Graph tags + LocalBusiness JSON-LD structured data
- Respects `prefers-reduced-motion`

## Structure

- `index.html` — the entire site (HTML + CSS + JS, no build step, no dependencies)
- `images/` — site photography

## Preview locally

```
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` in a browser.

## Deploy

Upload `index.html` and `images/` to any static host (GitHub Pages, Netlify, Cloudflare Pages, or classic web hosting). No server-side code required.

## Before launch

- The testimonials in the Reviews section are placeholders — swap in real customer reviews.
- The quote form opens the visitor's email app (`mailto:`). For direct submissions, wire it to a form service (e.g. Formspree).
