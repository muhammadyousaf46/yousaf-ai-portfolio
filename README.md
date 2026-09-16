# YOUSAF.AI — Portfolio

A single-page, gold-on-black luxury developer portfolio for Muhammad Yousaf
(BSCS — AI Specialization). Pure HTML/CSS/JS — no build step, no framework,
no backend required.

## Run it

Just open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

(Opening `index.html` directly by double-click also works, but the video/fonts
load more reliably over a local server or once uploaded to real hosting.)

## What's inside

```
index.html            all page content
css/style.css          gold/black design system
js/main.js              particles, 3D tilt, nav, contact form
assets/video/hero-walk.mp4   your hero video (already included)
assets/video/poster.jpg      fallback poster frame for the video
```

## Things to personalize before you publish

1. **Resume** — drop your real PDF into `assets/` and name it `resume.pdf`
   (see `assets/resume-PLACEHOLDER.txt`). The "Download Resume" button
   already points to `assets/resume.pdf`.
2. **Contact links** — in `index.html`, inside `#contact`, replace the
   placeholder email, phone number, GitHub, LinkedIn and Instagram URLs
   with your real ones.
3. **Contact form** — it currently opens the visitor's email client with a
   pre-filled message (no backend needed). If you want it to submit
   silently instead, wire `js/main.js`'s submit handler to a form service
   (Formspree, EmailJS, etc.) or your own API endpoint.
4. **Projects** — the "AI Life & Health Assistant" and "Data & AI Models"
   cards have no links yet since those aren't live. Add an `<a>` around
   them once you have URLs, the same way the Veloura card is set up.

## Notes on the effects

- The gold floating particles and the perspective grid floor are drawn on
  a `<canvas>` in `js/main.js` — no external libraries.
- Skill and project cards tilt in 3D toward your cursor (`data-tilt` +
  `mousemove`), and are automatically disabled on touch devices and for
  people with reduced-motion preferences turned on.
- The hero video is masked with a radial gradient so its edges fade into
  the page background instead of showing a visible box.
