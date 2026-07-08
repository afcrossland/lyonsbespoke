# Lyons Bespoke — website

Static marketing site for **Lyons Bespoke Kitchens & Bathrooms** (Retford, UK).
Hand-built HTML/CSS/JS — no build step, no dependencies — designed to be hosted
free on GitHub Pages with the custom domain `www.lyonsbespoke.com`.

## Structure

```
index.html         Home
kitchens.html      Kitchens gallery
bathrooms.html     Bathrooms gallery
roofing.html       Roofing & building gallery
contact.html       Contact + enquiry form
404.html           Not-found page
styles.css         All styling (brand: espresso #3c2015 on cream #f5f0e8)
main.js            Mobile nav, scroll reveal, gallery lightbox
favicon.svg        Site icon
assets/img/…       Project photos (kitchens / bathrooms / roofing / brand)
CNAME              Custom domain for GitHub Pages
sitemap.xml, robots.txt
```

## Preview locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a GitHub repo and push this folder:
   ```bash
   git add -A
   git commit -m "Lyons Bespoke website"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. In the repo: **Settings → Pages → Build and deployment**
   → Source: **Deploy from a branch** → Branch: **main** / **/ (root)** → Save.
3. Point the domain: at your DNS provider add
   - a `CNAME` record for `www` → `<you>.github.io`
   - (optional) apex `lyonsbespoke.com` → GitHub Pages A records
     (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153)
   The `CNAME` file in this repo already sets `www.lyonsbespoke.com`.
4. Back in **Settings → Pages**, tick **Enforce HTTPS** once the certificate is issued.

> Because the current site is on Wix, you'll change the DNS records at your domain
> registrar. Do this only when you're ready to switch the live site over.

## Make the contact form send emails

The form on `contact.html` is ready for [Formspree](https://formspree.io) (free tier):

1. Sign up, create a form, copy its endpoint (e.g. `https://formspree.io/f/abcdwxyz`).
2. In `contact.html`, replace `YOUR_FORM_ID` in the `<form action="…">` with your ID.

Until then, the phone, WhatsApp and email links all work with no setup.

## Social feeds (Instagram + Facebook)

The home page has a **"Follow Us"** section with two columns.

**Facebook** uses Meta's official *Page Plugin* — it shows recent posts and
**updates automatically**, no account or key needed. If posts don't show, edit the
`iframe` `src` in `index.html` and swap the `href` for the numeric page URL
`https://www.facebook.com/61568991250123` (URL-encoded).

**Instagram** currently shows a hand-picked grid of your own photos (always works,
no scripts). To turn it into a **live, auto-updating feed** (free):

1. Sign up at **[behold.so](https://behold.so)** *(recommended)* or
   **[lightwidget.com](https://lightwidget.com)** and connect **@lyonsbespoke**.
2. Create a feed and copy the snippet they give you (e.g. for Behold:
   `<script type="module" src="https://w.behold.so/widget.js"></script>` and
   `<behold-widget feed-id="YOUR_FEED_ID"></behold-widget>`).
3. In `index.html`, find the `INSTAGRAM` comment block, delete the
   `<div class="ig-grid">…</div>` and paste your snippet in its place.

Both providers have free tiers (usually with a small provider credit on free plans).

## Editing content

- **Text**: edit the `.html` files directly — everything is plain, commented HTML.
- **Photos**: drop new images into `assets/img/<category>/` and update the
  `src` / `data-full` paths in the relevant gallery page.
- **Colours & fonts**: change the CSS variables at the top of `styles.css`.
- **Contact details / social links**: search the HTML for the phone number
  `07547 415968` or `drrnlyons@gmail.com` to update everywhere.

All photography and branding © Lyons Bespoke Kitchens & Bathrooms.
