# TODO

## 1. Show the latest 5 Instagram posts (Behold)
- [ ] Sign up free at https://behold.so
- [ ] Connect the Instagram account **@lyonsbespoke** (needs the account owner's login; business/creator account is best)
- [ ] Create a feed (any layout — the site only uses the data)
- [ ] Copy the feed URL (`https://feeds.behold.so/XXXXXXXX`)
- [ ] Paste it into `beholdFeedUrl` in the `CONFIG` block at the top of `main.js`
- [ ] Push, then check the "Our latest work" section shows 5 tiles that link to Instagram

Fallback: add specific post URLs (`https://www.instagram.com/p/XXXX/`) to `instagramPosts` in the same block.

## 2. Live Google reviews, 4★ and above (Featurable)
- [ ] Sign up free at https://featurable.com
- [ ] New widget → **Google Reviews** → search "Lyons Bespoke Kitchens and Bathrooms" (Retford) and connect it
- [ ] Set the minimum rating to **4 stars**; choose a carousel layout
- [ ] Copy the widget ID (the `XXXX` in `featurable-XXXX`)
- [ ] Paste it into `featurableId` in the `CONFIG` block in `main.js`
- [ ] Push and check the Reviews section loads. If not, paste Featurable's full embed code into the `data-reviews` div in `index.html`

## 3. Smaller jobs
- [ ] Swap in the exact Google review link (hero badge, Reviews button) — currently a Google search link
- [ ] Confirm the navy kitchen wording ("handleless", "quartz worktops") is right
- [ ] Optional: remove the Facebook icon in the footer and `sameAs` link, if dropping Facebook fully
- [ ] Get a larger copy of the logo (current one is only 564px wide)
