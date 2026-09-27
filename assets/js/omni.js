/*
 * ⟐ : the site condensing into a loader.
 * Miniatures of the site's components start scattered, then spiral in and
 * orbit the ⟐ mark as you scroll, over the grid, inside a rip that opens
 * onto a starry night (stars only). The mark links to OmniReality.
 *
 *   Omni.html(C)   → section markup
 *   Omni.init(C)   → animation
 */
(function () {
  "use strict";
  var TAU = Math.PI * 2;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  var MAPLE = "M0,-1 L.1,-.74 L.3,-.84 L.25,-.46 L.58,-.66 L.5,-.44 L.92,-.46 L.74,-.24 L.86,-.1 L.44,.06 L.5,.22 L.14,.16 L.05,.42 L.04,.95 L-.04,.95 L-.05,.42 L-.14,.16 L-.5,.22 L-.44,.06 L-.86,-.1 L-.74,-.24 L-.92,-.46 L-.5,-.44 L-.58,-.66 L-.25,-.46 L-.3,-.84 L-.1,-.74 Z";

  // Miniatures of the site's own components.
  function tokens(C) {
    var av = (C.images && C.images.avatar && C.images.avatar.src) || "";
    var photo = ((C.images && C.images.carousel && C.images.carousel.slides) || []).filter(function (s) { return s.src; })[0];
    return [
      '<span class="tk tk-avatar"><img src="' + esc(av) + '" alt=""></span>',
      '<span class="tk tk-highlight"><b>' + esc((C.highlight && C.highlight.title) || "Highlight") + "</b></span>",
      '<span class="tk tk-cal">' + Array(15).join("<i></i>") + "</span>",
      photo ? '<span class="tk tk-photo"><img src="' + esc(photo.src) + '" alt=""></span>' : '<span class="tk tk-photo"></span>',
      '<span class="tk tk-leaf"><svg viewBox="-1 -1 2 2"><path d="' + MAPLE + '"/></svg></span>',
      '<span class="tk tk-sphere"></span>',
      '<span class="tk tk-cube"><svg viewBox="0 0 40 40"><path d="M20 3 37 12 20 21 3 12Z" fill="#6F8BFF"/><path d="M3 12 20 21 20 38 3 29Z" fill="#2049DF"/><path d="M37 12 20 21 20 38 37 29Z" fill="#8D1DE2"/></svg></span>',
      '<span class="tk tk-ring"></span>',
      '<span class="tk tk-eq"><i></i><i></i><i></i><i></i></span>',
      '<span class="tk tk-chat"><i></i><i></i><i></i></span>',
      '<span class="tk tk-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff"/></svg></span>',
      '<span class="tk tk-muse">M</span>',
      '<span class="tk tk-mono">HLM</span>',
      '<span class="tk tk-pillars"><i style="--c:#2049DF"></i><i style="--c:#FF692A"></i><i style="--c:#8D1DE2"></i><i style="--c:#F4320B"></i></span>',
      '<span class="tk tk-staff"></span>',
      '<span class="tk tk-scrap"></span>'
    ];
  }

  function markSVG() {
    return '<svg class="omni-mark-svg" viewBox="0 0 120 120" aria-hidden="true">' +
      '<defs><linearGradient id="omni-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4320B"/><stop offset=".3" stop-color="#FF692A"/><stop offset=".65" stop-color="#8D1DE2"/><stop offset="1" stop-color="#2049DF"/></linearGradient></defs>' +
      '<path d="M60 6 114 60 60 114 6 60Z" fill="none" stroke="url(#omni-g)" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M60 22 98 60 60 98 22 60Z" fill="none" stroke="url(#omni-g)" stroke-width="1.2" opacity=".55"/>' +
      '<circle cx="60" cy="60" r="9" fill="#94E718"/></svg>';
  }

  function html(C) {
    var O = C.omni || {};
    var live = !!O.url;
    return '<section class="omni" id="omni" aria-labelledby="omni-title">' +
      '<p class="label mono omni-label"><span aria-hidden="true"><span class="glyph">⟐</span>mniReality</span><span class="sr">OmniReality</span></p>' +
      '<div class="omni-stage" id="omni-stage">' +
      '<div class="omni-rip" id="omni-rip"></div>' +
      '<div class="omni-orbit" id="omni-orbit" aria-hidden="true">' + tokens(C).map(function (t) { return t; }).join("") + "</div>" +
      (live ? '<a class="omni-core" href="' + esc(O.url) + '" target="_blank" rel="noopener">' : '<div class="omni-core">') +
      '<span class="omni-mark">' + markSVG() + "</span>" +
      '<span class="omni-text"><span class="omni-title" id="omni-title">' + esc(O.title || "Enter OmniReality") + "</span>" +
      '<span class="mono omni-status" id="omni-status" aria-live="off">Condensing · 0%</span></span>' +
      (live ? "</a>" : "</div>") +
      "</div>" +
      '<p class="omni-note">' + esc(O.note || "") + (live ? "" : ' <span class="chip chip-ghost">Link coming soon</span>') + "</p>" +
      "</section>";
  }

  /* Panel variant: lives in the drawer under the carousel, opened from the ⟐ card. */
  function panelHTML(C) {
    var O = C.omni || {}, live = !!O.url;
    return '<div class="omni omni-in-panel">' +
      '<div class="omni-stage" id="omni-stage">' +
      '<div class="omni-rip" id="omni-rip"></div>' +
      '<div class="omni-orbit" id="omni-orbit" aria-hidden="true">' + tokens(C).join("") + "</div>" +
      (live ? '<a class="omni-core" href="' + esc(O.url) + '" target="_blank" rel="noopener">' : '<div class="omni-core">') +
      '<span class="omni-mark">' + markSVG() + "</span>" +
      '<span class="omni-text"><span class="omni-title" id="omni-title">' + esc(O.title || "Enter OmniReality") + "</span>" +
      '<span class="mono omni-status" id="omni-status" aria-live="off">Condensing · 0%</span></span>' +
      (live ? "</a>" : "</div>") +
      "</div>" +
      '<div class="omni-foot"><p class="omni-note">' + esc(O.note || "") + "</p>" +
      (live ? '<a class="btn" href="' + esc(O.url) + '" target="_blank" rel="noopener">Enter OmniReality ↗</a>' : '<span class="chip chip-ghost">Link coming soon</span>') +
      "</div></div>";
  }

  /* opts.timed: progress runs on a clock (drawer) instead of scroll (section). */
  function init(C, opts) {
    opts = opts || {};
    var scope = opts.root || document;
    var stage = scope.querySelector("#omni-stage");
    if (!stage) return;
    var startT = performance.now();
    var orbit = scope.querySelector("#omni-orbit"), status = scope.querySelector("#omni-status");
    var els = [].slice.call(orbit.children);
    var n = els.length, seedR = 1;
    function r() { seedR = (seedR * 16807) % 2147483647; return seedR / 2147483647; }

    // each token: a scattered start and an orbit slot on one of three rings
    var T = els.map(function (el, i) {
      var ring = i % 3;
      return {
        el: el, ring: ring,
        a0: (i / n) * TAU * 3 + r() * 0.4,
        sx: (r() - 0.5) * 1.9, sy: (r() - 0.5) * 1.5, srot: (r() - 0.5) * 80,
        dir: ring === 1 ? -1 : 1,
        speed: [0.22, 0.16, 0.11][ring]
      };
    });

    // the starry-night rip (stars only, always night)
    var ripHost = scope.querySelector("#omni-rip"), ripEl = null, lastW = 0;
    function buildRip() {
      var w = stage.clientWidth, h = stage.clientHeight;
      if (Math.abs(w - lastW) < 40 && ripEl) return;
      lastW = w;
      if (ripEl) ripEl.remove();
      var rw = Math.min(w - 24, 860), rh = Math.min(h - 40, 440);
      ripEl = window.Dimensions && window.Dimensions.rip(ripHost, {
        scene: "stars", forceDark: true, width: Math.round(rw), height: Math.round(rh),
        left: Math.round((w - rw) / 2) + "px", top: Math.round((h - rh) / 2) + "px", rotate: -2, seed: 77
      });
    }
    buildRip();
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(buildRip, 200); });

    function progress() {
      if (opts.timed) return Math.min(1, (performance.now() - startT) / (opts.duration || 2600));
      var b = stage.getBoundingClientRect(), vh = window.innerHeight;
      // 0 when the stage top enters the viewport, 1 when its centre reaches the viewport centre
      var p = (vh - b.top) / (vh * 0.5 + b.height * 0.5);
      return Math.max(0, Math.min(1, p));
    }
    function ease(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

    var t0 = performance.now(), visible = true, raf = 0, lastPct = -1;
    function frame(now) {
      if (!stage.isConnected) { cancelAnimationFrame(raf); return; }
      var t = reduce ? 0 : (now - t0) / 1000;
      var W = stage.clientWidth, H = stage.clientHeight, cx = W / 2, cy = H / 2;
      var p = reduce ? 1 : ease(progress());
      var rx = Math.min(W * 0.44, 380), ry = Math.min(H * 0.42, 200);
      T.forEach(function (k) {
        var scale = [1, 0.87, 0.75][k.ring];
        var a = k.a0 + t * k.speed * k.dir * TAU * 0.25;
        var ox = cx + Math.cos(a) * rx * scale, oy = cy + Math.sin(a) * ry * scale;
        var sx = cx + k.sx * W * 0.55, sy = cy + k.sy * H * 0.7;
        var x = sx + (ox - sx) * p, y = sy + (oy - sy) * p;
        var depth = 0.75 + 0.25 * Math.sin(a); // front of the orbit is larger
        var s = (1 - p) * 1.15 + p * (0.7 + 0.35 * depth);
        var rot = k.srot * (1 - p);
        k.el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) translate(-50%,-50%) rotate(" + rot.toFixed(1) + "deg) scale(" + s.toFixed(3) + ")";
        k.el.style.zIndex = String(p > 0.5 ? Math.round(depth * 4) : 2);
        k.el.style.opacity = String(0.5 + 0.5 * Math.min(1, p * 1.2 + 0.2));
      });
      stage.style.setProperty("--p", p.toFixed(3));
      var pct = Math.round(p * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        status.textContent = pct >= 100 ? (C.omni && C.omni.url ? "Ready · step inside →" : "Ready") : "Condensing · " + pct + "%";
        stage.classList.toggle("is-ready", pct >= 100);
      }
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(frame);
      }).observe(stage);
    }
    frame(performance.now());
    if (reduce) window.addEventListener("resize", function () { frame(performance.now()); });
  }

  window.Omni = { html: html, panelHTML: panelHTML, init: init };
})();
