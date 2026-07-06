# Inspired Epoxy

Multi-page static website for **Inspired Epoxy** — garage, metallic, basement & commercial epoxy flooring (inspiredepoxy.ca).

Built to replace the marketer-controlled site so the business owns its own website. This folder is fully self-contained — copy it anywhere and it works.

## Pages

- `index.html` — home: hero slideshow, quote box, services overview, stats, process, gallery preview, reviews, contact
- `services.html` — in-depth Garage / Metallic / Basement / Commercial sections
- `why-epoxy.html` — benefits, system comparison (flake/metallic/solid), prep-matters note, FAQ
- `gallery.html` — full gallery with category tags and lightbox
- `reviews.html` — customer review cards + service standards
- `contact.html` — quote form, contact info, booking steps, quick FAQ
- `thank-you.html` — form-submission confirmation page

## ⚠️ Placeholders to confirm before launch

The original inspiredepoxy.ca blocked automated access when this site was built, so the following are **stand-ins** — search-and-replace across all HTML files:

| Item | Placeholder used | Replace with |
|---|---|---|
| Phone | `(604) 555-0123` / `tel:+16045550123` | Real phone number |
| Email | `quotes@inspiredepoxy.ca` | Real email (also in form `action=` URLs) |
| Hours | Mon–Sat 8am–6pm | Real hours |
| Service area | Lower Mainland & Fraser Valley, BC | Real service area |
| Reviews | Sample reviews marked "Placeholder review" | Real Google reviews |
| Images | Generated SVG artwork in `images/` | Real job photos (JPGs) |

Also confirm exact business name/wording, services offered, and any warranty claims (the copy mentions "warranty-backed installs" and "15+ years" — adjust to what the business actually offers).

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
