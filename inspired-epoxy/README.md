# Inspired Epoxy

Multi-page static website for **Inspired Epoxy** — epoxy flooring across the Lower Mainland, BC (inspiredepoxy.ca).

Built to replace the marketer-controlled site so the business owns its own website. This folder is fully self-contained — copy it anywhere and it works.

## Pages

- `index.html` — home: hero slideshow, quote box, services overview, stats, process, gallery preview, reviews, contact
- `services.html` — all nine services: Flake, Metallic, Solid Colour, Quartz, Pebble/Stone, Grind & Seal, Concrete Polishing, Garage Makeovers, Slat Wall
- `why-epoxy.html` — benefits, system comparison, prep-matters note, FAQ
- `gallery.html` — full gallery with category tags and lightbox
- `reviews.html` — customer review cards + service standards
- `contact.html` — quote form, contact info, booking steps, quick FAQ
- `thank-you.html` — form-submission confirmation page

## Confirmed from the real site

- Phone: **(236) 233-1848**
- Tagline / service area: durable, seamless epoxy floors for homes and businesses across the **Lower Mainland**
- All nine services and their descriptions
- Job photos (cropped from phone screenshots of the live site)

## ⚠️ Still placeholder — confirm before launch

| Item | Placeholder used | Replace with |
|---|---|---|
| Email | `quotes@inspiredepoxy.ca` | Real email (also in the form `action=` URLs) |
| Hours | Mon–Sat 8am–6pm | Real hours |
| Reviews | Sample reviews marked "Placeholder review" | Real Google reviews |
| Photos | Screenshot crops in `images/*.jpg` | Full-resolution originals of the same photos |

Also confirm any warranty/durability claims in the copy (e.g. "15+ years", "warranty-backed") match what the business actually offers.

## Features

- Full-screen hero slideshow with Ken Burns zoom and staggered text animations
- Prominent **Get a Free Quote** box — in the hero on desktop, its own section on mobile — plus a full contact form
- Reactive particle background, scroll-reveal animations, animated stat counters, FAQ accordions, gallery lightbox
- Mobile-first responsive layout with hamburger menu; current page highlighted in the nav
- SEO: per-page titles/descriptions, Open Graph tags + LocalBusiness JSON-LD structured data
- Respects `prefers-reduced-motion`

## Preview locally

```
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

Upload everything (HTML files, `assets/`, `images/`) to any static host — GitHub Pages, Netlify, Cloudflare Pages, or classic hosting. No build step, no server-side code. To use the inspiredepoxy.ca domain, point its DNS at the new host once the business (not the marketer) controls the domain registration.

## Quote forms

Forms POST to [FormSubmit](https://formsubmit.co/) and deliver to the email in the `action` attribute. **One-time activation required:** the first submission triggers a confirmation email — click "Activate" in it and every later submission flows through. After activation, FormSubmit issues a random alias endpoint you can swap into the `action` attributes to keep the raw email address out of the page source.
