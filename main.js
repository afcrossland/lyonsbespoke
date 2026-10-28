/* Lyons Bespoke — nav, scroll-spy, reveal, lightbox, review + Instagram embeds */
(function () {
  "use strict";

  /* ---- Site config: edit these two to switch on the live embeds ----
     featurableId   : widget id from featurable.com (Google reviews, set min rating to 4★)
     instagramPosts : full URLs of Instagram posts/reels to show, newest first,
                      e.g. "https://www.instagram.com/p/AbCdEfGhIjK/"            */
  var CONFIG = {
    featurableId: "",
    beholdFeedUrl: "",     // e.g. "https://feeds.behold.so/XXXX" — shows your latest 5 Instagram posts
    instagramPosts: []     // optional: specific post URLs to embed instead
  };

  function loadScript(src) {
    var s = document.createElement("script");
    s.src = src; s.async = true; document.body.appendChild(s);
  }

  /* ---- Google reviews (Featurable) ---- */
  var reviews = document.querySelector("[data-reviews]");
  if (reviews && CONFIG.featurableId) {
    reviews.innerHTML = '<div id="featurable-' + CONFIG.featurableId + '" data-featurable-async></div>';
    loadScript("https://featurable.com/assets/bundle.js");
  }

  /* ---- Instagram post embeds ---- */
  var ig = document.querySelector("[data-instagram]");
  if (ig && CONFIG.beholdFeedUrl) {
    fetch(CONFIG.beholdFeedUrl).then(function (r) { return r.json(); }).then(function (data) {
      var posts = (data.posts || data || []).slice(0, 5);
      if (!posts.length) return;
      ig.innerHTML = "";
      posts.forEach(function (p) {
        var sz = (p.sizes && (p.sizes.medium || p.sizes.large)) || {};
        var img = sz.mediaUrl || p.thumbnailUrl || p.mediaUrl;
        var a = document.createElement("a");
        a.className = "ig-post"; a.href = p.permalink; a.target = "_blank"; a.rel = "noopener";
        var im = document.createElement("img");
        im.src = img; im.loading = "lazy"; im.alt = (p.caption || "Instagram post").slice(0, 120);
        a.appendChild(im);
        if (p.caption) { var c = document.createElement("span"); c.className = "ig-post__cap"; c.textContent = p.caption; a.appendChild(c); }
        ig.appendChild(a);
      });
    }).catch(function () { /* keep the follow link */ });
  } else if (ig && CONFIG.instagramPosts.length) {
    ig.innerHTML = ""; ig.className = "ig-grid";
    CONFIG.instagramPosts.forEach(function (url) {
      var bq = document.createElement("blockquote");
      bq.className = "instagram-media";
      bq.setAttribute("data-instgrm-permalink", url);
      bq.setAttribute("data-instgrm-version", "14");
      var a = document.createElement("a");
      a.href = url; a.target = "_blank"; a.rel = "noopener"; a.textContent = "View this post on Instagram";
      bq.appendChild(a); ig.appendChild(bq);
    });
    loadScript("https://www.instagram.com/embed.js");
  }

  /* ---- Mobile navigation ---- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav__toggle");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Galleries: built from data/gallery.json (edited by the /admin uploader) ---- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function tileHtml(p) {
    return '<button class="tile" data-lightbox data-full="' + esc(p.src) + '" data-cap="' + esc(p.cap || "") + '">' +
      '<img src="' + esc(p.src) + '" alt="' + esc(p.alt || p.cap || "") + '" loading="lazy">' +
      (p.cap ? '<span class="tile__cap">' + esc(p.cap) + '</span>' : "") + '</button>';
  }
  function renderGalleries(data) {
    document.querySelectorAll("[data-gallery]").forEach(function (mount) {
      var sec = (data.sections || {})[mount.getAttribute("data-gallery")];
      if (!sec) return;
      var html = "";
      if (sec.featured && sec.featured.length) {
        html += '<div class="masonry reveal">' + sec.featured.map(tileHtml).join("") + "</div>";
      }
      (sec.jobs || []).forEach(function (job) {
        if (!job.photos || !job.photos.length) return;
        html += '<div class="job reveal"><h3 class="job-title">' + esc(job.title) +
          (job.sub ? "<span>" + esc(job.sub) + "</span>" : "") + '</h3><div class="masonry">' +
          job.photos.map(tileHtml).join("") + "</div></div>";
      });
      mount.innerHTML = html;
    });
  }

  function initReveal() {
    var reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && reveals.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  }

  function initLightbox() {
      /* ---- Gallery lightbox ---- */
    var tiles = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
    if (tiles.length) {
      var items = tiles.map(function (t) {
        return { src: t.getAttribute("data-full") || t.querySelector("img").src,
                 cap: t.getAttribute("data-cap") || "" };
      });
      var current = 0;

      var box = document.createElement("div");
      box.className = "lightbox";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      box.setAttribute("aria-label", "Image viewer");
      box.innerHTML =
        '<button class="lightbox__btn lightbox__close" aria-label="Close">&times;</button>' +
        '<button class="lightbox__btn lightbox__prev" aria-label="Previous">&#8249;</button>' +
        '<img alt="">' +
        '<button class="lightbox__btn lightbox__next" aria-label="Next">&#8250;</button>' +
        '<div class="lightbox__cap"></div>';
      document.body.appendChild(box);

      var imgEl = box.querySelector("img");
      var capEl = box.querySelector(".lightbox__cap");

      function show(i) {
        current = (i + items.length) % items.length;
        imgEl.src = items[current].src;
        imgEl.alt = items[current].cap;
        capEl.textContent = items[current].cap;
      }
      function open(i) { show(i); box.classList.add("is-open"); document.body.style.overflow = "hidden"; }
      function close() { box.classList.remove("is-open"); document.body.style.overflow = ""; }

      tiles.forEach(function (t, i) {
        t.addEventListener("click", function () { open(i); });
      });
      box.querySelector(".lightbox__close").addEventListener("click", close);
      box.querySelector(".lightbox__prev").addEventListener("click", function () { show(current - 1); });
      box.querySelector(".lightbox__next").addEventListener("click", function () { show(current + 1); });
      box.addEventListener("click", function (e) { if (e.target === box) close(); });
      document.addEventListener("keydown", function (e) {
        if (!box.classList.contains("is-open")) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft") show(current - 1);
        else if (e.key === "ArrowRight") show(current + 1);
      });
  }

  }

  /* "Latest work": photos Darren adds through Pages CMS (data/recent.json).
     Phone photos are big, so they're shrunk on the fly by the free wsrv.nl image proxy. */
  function resized(src, w) {
    var abs = new URL(src.replace(/^\//, ""), location.href).href;
    return "https://wsrv.nl/?url=" + encodeURIComponent(abs) + "&w=" + w + "&q=80&output=jpg&we";
  }
  function renderRecent(data) {
    var photos = ((data && data.photos) || []).filter(Boolean);
    var mount = document.querySelector("[data-recent]");
    if (!mount || !photos.length) return;
    mount.innerHTML = photos.slice().reverse().map(function (src) {
      return '<button class="tile" data-lightbox data-full="' + esc(resized(src, 1600)) + '" data-cap="">' +
        '<img src="' + esc(resized(src, 800)) + '" alt="Recent work by Lyons Bespoke" loading="lazy" onerror="this.onerror=null;this.src=\'' + esc(src) + '\'">' +
        '</button>';
    }).join("");
    document.getElementById("gallery").hidden = false;
    var nav = document.querySelector("[data-nav-gallery]"); if (nav) nav.hidden = false;
  }
  function getJson(url) { return fetch(url, { cache: "no-cache" }).then(function (r) { return r.json(); }).catch(function () { return null; }); }

  Promise.all([getJson("data/gallery.json"), getJson("data/recent.json")]).then(function (res) {
    if (res[0]) renderGalleries(res[0]);
    renderRecent(res[1]);
    initReveal(); initLightbox();
  });

  /* ---- Evolving header: condense on scroll, highlight current section, progress bar ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]:not(.btn)'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  var bar = document.querySelector(".scroll-progress span");
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 40);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar && max > 0) bar.style.transform = "scaleX(" + Math.min(1, y / max) + ")";
    var probe = y + window.innerHeight * 0.35, active = -1;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= probe) active = i; });
    // "About"/band sit between Services and Kitchens; the last link wins at page bottom
    if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) active = links.length - 1;
    links.forEach(function (a, i) { a.classList.toggle("is-active", i === active); });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---- Footer year ---- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
