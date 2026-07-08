/* Lyons Bespoke — mobile nav, scroll reveal, gallery lightbox */
(function () {
  "use strict";

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

  /* ---- Reveal on scroll ---- */
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

  /* ---- Swipeable sliders (arrows + native touch/trackpad swipe + dots) ---- */
  document.querySelectorAll("[data-slider]").forEach(function (slider) {
    var track = slider.querySelector("[data-slider-track]");
    if (!track) return;
    var prev = slider.querySelector("[data-slider-prev]");
    var next = slider.querySelector("[data-slider-next]");
    var dotsWrap = slider.querySelector("[data-slider-dots]");
    var slides = track.querySelectorAll(".slide");

    function step() {
      var s = track.querySelector(".slide");
      if (!s) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap || "18") || 18;
      return s.getBoundingClientRect().width + gap;
    }
    function perView() { return Math.max(1, Math.round(track.clientWidth / step())); }

    // Build dots (one per "page")
    if (dotsWrap && slides.length) {
      var pages = Math.max(1, Math.ceil(slides.length / perView()));
      dotsWrap.innerHTML = "";
      for (var p = 0; p < pages; p++) {
        (function (p) {
          var b = document.createElement("button");
          b.type = "button";
          b.setAttribute("aria-label", "Go to slide group " + (p + 1));
          b.addEventListener("click", function () {
            track.scrollTo({ left: p * perView() * step(), behavior: "smooth" });
          });
          dotsWrap.appendChild(b);
        })(p);
      }
    }

    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
      if (dotsWrap) {
        var dots = dotsWrap.children;
        var idx = Math.round(track.scrollLeft / (perView() * step()));
        for (var i = 0; i < dots.length; i++) {
          dots[i].classList.toggle("is-active", i === idx);
        }
      }
    }

    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -track.clientWidth * 0.9, behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: track.clientWidth * 0.9, behavior: "smooth" }); });
    var raf;
    track.addEventListener("scroll", function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  /* ---- Footer year ---- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
