# Lyons Bespoke — website

Static marketing site for **Lyons Bespoke Kitchens & Bathrooms** (Retford, UK).
Hand-built HTML/CSS/JS — no build step, no dependencies — designed to be hosted
free on GitHub Pages with the custom domain `www.lyonsbespoke.com`.

## Structure

```
index.html         The whole site: one scrolling page
404.html           Not-found page
styles.css         All styling (brand: espresso #3c2015 on cream #f5f0e8)
main.js            Mobile nav, scroll reveal, gallery lightbox
favicon.ico, favicon-32.png, apple-touch-icon.png   Site icons (lion mark from the logo)
assets/img/…       Project photos (kitchens / bathrooms / roofing / brand)
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
   The site will be live at `https://<you>.github.io/lyonsbespoke/`.
3. **When you're ready to move the domain off Wix** (do this only when you want to
   switch the live site over):
   - In **Settings → Pages → Custom domain**, enter `www.lyonsbespoke.com` and Save
     (this creates a `CNAME` file automatically).
   - At your DNS provider add a `CNAME` record for `www` → `<you>.github.io`
   - (optional) apex `lyonsbespoke.com` → GitHub Pages A records
     (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153)
   - Back in **Settings → Pages**, tick **Enforce HTTPS** once the certificate is issued.

> All asset paths are relative, so the site works both at the `github.io/lyonsbespoke/`
> URL and at the root domain — no changes needed when you switch.

## Instagram and Google reviews

The site is a single page (`index.html`). The two live embeds are switched on in
one place — the `CONFIG` block at the top of `main.js`:

```js
var CONFIG = {
  featurableId: "",      // Google reviews widget id from featurable.com
  beholdFeedUrl: "",     // e.g. "https://feeds.behold.so/XXXX" — latest 5 Instagram posts
  instagramPosts: []     // optional: specific post URLs instead
};
```

**Instagram — latest 5 posts, automatic.** Sign up free at [behold.so](https://behold.so), connect
@lyonsbespoke, create a feed, and paste its feed URL into `beholdFeedUrl`. New posts then
appear on the site on their own.

**Instagram — hand-picked posts (alternative).** Open a post on instagram.com, copy its address-bar URL (works for
`/p/…` posts and `/reel/…`), and add it to `instagramPosts`. They render with
Instagram's official embed, no account or key needed. Add new URLs at the top to
show your newest work first.

**Google reviews (4★ and above).** Sign up at [featurable.com](https://featurable.com),
connect your Google Business Profile, set the widget's minimum rating to
4 stars, then paste the widget id into `featurableId`. (Elfsight / Trustindex also
work: paste their snippet into the `data-reviews` div in `index.html`.) Until an id
is set, the section shows a link to your Google reviews. Update the Google link in
that section to your exact review URL once you have it.

## Editing content

- **Text**: edit `index.html` directly — it's plain, commented HTML.
- **Photos**: drop new images into `assets/img/<category>/` and add a `<button class="tile">`
  to the matching gallery (`#kitchens`, `#bathrooms`, `#roofing`). Galleries are
  masonry, so photos of any shape display uncropped; click opens the lightbox.
- **Menu**: nav links are `#section-id` anchors; the active one follows your scroll.
- **Colours & fonts**: change the CSS variables at the top of `styles.css`.
- **Contact details / social links**: search the HTML for `07547 415968` or
  `drrnlyons@gmail.com` to update everywhere.

All photography and branding © Lyons Bespoke Kitchens & Bathrooms.
