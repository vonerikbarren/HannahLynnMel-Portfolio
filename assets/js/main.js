/* Renders the landing page from window.HANNAH, then wires up
 * OmniReality mode, parallax, seasonal margins, video + form. */
(function () {
  "use strict";
  var C = window.HANNAH;
  var PREVIEW = !!window.__PREVIEW__; // sandboxed preview: no third-party iframes
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function ext(url, label, cls) {
    return '<a class="' + (cls || "") + '" href="' + esc(url) + '" target="_blank" rel="noopener">' + label + "</a>";
  }
  function host(url) { try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return ""; } }

  /* ---------- mode: standalone vs OmniReality ---------- */
  var params = new URLSearchParams(location.search);
  var mode = params.get("mode") || (params.has("omni") ? "omni" : C.embed.mode);
  if (mode === "omni") root.setAttribute("data-mode", "omni");
  root.style.setProperty("--wash-alpha", C.embed.backgroundOpacity);
  root.style.setProperty("--omni-surface-alpha", C.embed.surfaceOpacity);
  root.style.setProperty("--grid-size", C.embed.grid.size + "px");
  root.style.setProperty("--grid-major", C.embed.grid.size * C.embed.grid.majorEvery + "px");

  /* ---------- wallpaper: five colour fields, 20–50% opacity ---------- */
  var wall = document.getElementById("wall");
  var P = C.theme.palette;
  var lo = C.embed.wallpaperOpacityMin, hi = C.embed.wallpaperOpacityMax;
  var fields = [
    { color: P.writing, x: -12, y: -8, s: 70, o: hi, depth: 0.06 },
    { color: P.music, x: 68, y: 6, s: 64, o: (hi + lo) / 2 + 0.05, depth: 0.14 },
    { color: P.healing, x: 60, y: 62, s: 78, o: hi - 0.05, depth: 0.22 },
    { color: P.movement, x: -18, y: 88, s: 66, o: (hi + lo) / 2, depth: 0.1 },
    { color: P.spark, x: 30, y: 150, s: 48, o: lo, depth: 0.3 }
  ];
  wall.innerHTML = fields.map(function (f, i) {
    return '<span class="field f' + i + '" data-depth="' + f.depth + '" style="--c:' + f.color + ";--o:" + f.o +
      ";left:" + f.x + "vw;top:" + f.y + "vh;width:" + f.s + "vmax;height:" + f.s + 'vmax"></span>';
  }).join("");

  /* ---------- page ---------- */
  var pillarById = {};
  C.pillars.forEach(function (p) { pillarById[p.id] = p; });

  function nextMonday() {
    var d = new Date(); d.setHours(0, 0, 0, 0);
    var add = (8 - d.getDay()) % 7;
    if (add === 0) return "today";
    d.setDate(d.getDate() + add);
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }

  var IMG = C.images || {};
  function fig(slot, cls, name) {
    if (!slot || !slot.src) return "";
    return '<figure class="img ' + cls + (IMG.showImagePlaceholders ? " draft" : "") + '">' +
      '<img src="' + esc(slot.src) + '" alt="' + esc(slot.alt) + '" loading="lazy" decoding="async">' +
      '<span class="ph mono" aria-hidden="true"><b>' + esc(name) + "</b>" + esc(slot.src.split("/").pop()) + " · " + esc(slot.shape || "") + "</span>" +
      (slot.caption ? "<figcaption>" + esc(slot.caption) + "</figcaption>" : "") +
      "</figure>";
  }

  var nav = [["omni", '<span aria-hidden="true"><span class="glyph">⟐</span>mniReality</span><span class="sr">OmniReality</span>'], ["about", "About"], ["offerings", "Offerings"], ["writing", "Writing"], ["media", "Video"], ["listen", "Listen"], ["connect", "Connect"]];

  var CAR = IMG.carousel;
  var hasCar = !!(CAR && CAR.slides && CAR.slides.length);
  function carouselHTML() {
    var nSlides = CAR.slides.length;
    return '<div class="carousel" role="region" aria-roledescription="carousel" aria-label="Moments with Hannah">' +
      '<div class="track" id="track" tabindex="0">' +
      CAR.slides.map(function (sl, i) {
        return '<div class="slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + " of " + nSlides + '">' +
          (sl.type && window.Panels ? window.Panels.card(sl, C) : fig(sl, "slide-img" + (i % 3 === 1 ? " arched" : ""), "Slide " + (i + 1))) + "</div>";
      }).join("") + "</div>" +
      '<div class="car-ctl">' +
      '<button type="button" class="car-btn" id="car-prev" aria-label="Previous slide">←</button>' +
      '<p class="mono car-count" aria-live="polite"><span id="car-i">01</span> / ' + String(nSlides).padStart(2, "0") + "</p>" +
      '<div class="car-bar" aria-hidden="true"><span id="car-fill"></span></div>' +
      '<button type="button" class="car-btn" id="car-next" aria-label="Next slide">→</button>' +
      "</div></div>" + (window.Panels ? window.Panels.drawerHTML() : "");
  }
  // Carousel sits at the top of the page, above or below the location line.
  // Set layout.carouselPlacement in client.js; #carousel-above / #carousel-below in the URL override it.
  var placement = (C.layout && C.layout.carouselPlacement) || "below-location";
  if (location.hash === "#carousel-above") placement = "above-location";
  if (location.hash === "#carousel-below") placement = "below-location";
  var eyebrowHTML = '<p class="eyebrow mono"><span class="spark-dot" aria-hidden="true"></span>' + esc(C.location) + "</p>";

  var html = "";

  html += '<header class="masthead">' +
    '<a class="brand" href="#top" aria-label="' + esc(C.name) + ', top of page">' +
    (IMG.avatar && IMG.avatar.src ? '<span class="avatar"><img src="' + esc(IMG.avatar.src) + '" alt="" width="40" height="40"></span>' : "") +
    '<span class="mono monogram">' + esc(C.monogram) + "</span></a>" +
    '<div class="masthead-right">' +
    '<nav aria-label="Sections"><ul>' + nav.map(function (n) { return '<li><a href="#' + n[0] + '">' + n[1] + "</a></li>"; }).join("") + "</ul></nav>" +
    '<button type="button" class="theme-toggle" id="theme-toggle" aria-label="Switch to dark mode"><span class="knob">' +
    '<svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></g></svg>' +
    '<svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="currentColor"/></svg>' +
    "</span></button></div>" +
    "</header>";

  html += '<section class="hero carousel-' + placement + '" id="top">' +
    (hasCar && placement === "above-location" ? carouselHTML() : "") +
    eyebrowHTML +
    (hasCar && placement !== "above-location" ? carouselHTML() : "") +
    '<div class="hero-grid"><div class="hero-text">' +
    '<h1 class="hero-name" aria-label="' + esc(C.name) + '">' +
    C.nameLines.map(function (l, i) { return '<span class="line l' + i + '" aria-hidden="true">' + esc(l) + "</span>"; }).join("") +
    "</h1>" +
    '<p class="hero-tag">' + esc(C.tagline) + "</p>" +
    '<ul class="roles mono">' + C.roles.map(function (r) { return '<li style="--mark:var(--c-' + r.pillar + ')">' + esc(r.label) + "</li>"; }).join("") + "</ul>" +
    '<div class="actions"><a class="btn" href="#connect">Work with Hannah</a>' + ext(C.writing.url, "Read the Monday Morning Muse", "textlink") + "</div>" +
    "</div>" + fig(IMG.hero, "arch hero-img", "Hero portrait") +
    "</div></section>";

  html += '<hr class="staff" aria-hidden="true">';

  if (window.Omni) {
    html += window.Omni.html(C);
    html += '<hr class="staff" aria-hidden="true">';
  }

  html += '<section class="sec" id="about"><p class="label mono">About</p><div class="body">' +
    '<h2 class="h2">' + esc(C.about.heading) + "</h2>" +
    C.about.paragraphs.map(function (p, i) { return '<p class="prose' + (i === 0 ? " dropcap" : "") + '">' + esc(p) + "</p>"; }).join("") +
    '<p class="qualities mono">' + C.qualities.map(esc).join('<span aria-hidden="true"> · </span>') + "</p>" +
    fig(IMG.about, "about-img", "About") +
    "</div></section>";

  html += '<hr class="staff" aria-hidden="true">';

  html += '<section class="sec" id="offerings"><p class="label mono">Offerings</p><div class="body">' +
    '<h2 class="h2">Four currents, one practice.</h2><ol class="pillars">' +
    C.pillars.map(function (p) {
      return '<li class="pillar" style="--pc:var(--c-' + p.id + ');--pt:var(--t-' + p.id + ')">' +
        fig((IMG.pillars || {})[p.id], "pillar-img", p.service) +
        '<p class="pillar-service mono">' + esc(p.service) + "</p>" +
        '<h3 class="pillar-name">' + esc(p.domain) + "</h3>" +
        '<p class="pillar-desc">' + esc(p.description) + "</p>" +
        '<p class="pillar-tags mono">' + p.offerings.map(esc).join(" / ") + "</p>" +
        (p.links.length ? '<p class="pillar-links">' + p.links.map(function (l) { return ext(l.url, esc(l.label) + ' <span aria-hidden="true">↗</span>', "textlink"); }).join("") + "</p>" : "") +
        "</li>";
    }).join("") + "</ol></div></section>";

  html += '<hr class="staff" aria-hidden="true">';

  var W = C.writing;
  html += '<section class="sec" id="writing"><p class="label mono">Writing</p><div class="body">' +
    '<div class="muse">' +
    '<p class="mono muse-kicker">On Substack</p>' +
    '<h2 class="muse-title">' + ext(W.url, esc(W.title)) + "</h2>" +
    '<p class="prose">' + esc(W.description) + "</p>" +
    '<p class="mono next"><span class="spark-dot" aria-hidden="true"></span>Next Monday: ' + esc(nextMonday()) + "</p>" +
    "</div>" +
    '<h3 class="h3">From the archive</h3><ul class="notes">' +
    W.fromArchive.map(function (n) {
      return '<li><span class="mono note-date">' + esc(n.date) + '</span><span class="note-text">' +
        ext(W.archive, esc(n.title), "note-title") + (n.subtitle ? '<span class="note-sub">' + esc(n.subtitle) + "</span>" : "") +
        "</span></li>";
    }).join("") + "</ul>" +
    '<div class="subscribe">' +
    (PREVIEW
      ? '<p class="prose small">Get each Muse by email.</p>' + ext(W.url + "subscribe", "Subscribe on Substack", "btn")
      : '<iframe title="Subscribe to Monday Morning Muse" src="' + esc(W.subscribeEmbed) + '" loading="lazy" frameborder="0" scrolling="no"></iframe>') +
    "</div></div></section>";

  html += '<hr class="staff" aria-hidden="true">';

  var Y = C.media.youtube;
  html += '<section class="sec" id="media"><p class="label mono">Video</p><div class="body">' +
    '<h2 class="h2">Music, movement and the occasional lesson, on film.</h2>' +
    '<div class="player" id="player">' +
    (PREVIEW ? '<a class="play" id="play" href="' + esc(Y.url) + '" target="_blank" rel="noopener">'
      : '<button class="play" id="play" type="button" data-src="https://www.youtube-nocookie.com/embed/videoseries?list=' + esc(Y.uploadsPlaylist) + '&rel=0">') +
    '<span class="play-disc" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>' +
    '<span class="play-text"><span class="play-title">Play her latest uploads</span><span class="mono play-sub">YouTube · ' + esc(Y.handle) + "</span></span>" +
    (PREVIEW ? "</a>" : "</button>") + "</div>" +
    '<p class="pillar-links">' + ext(Y.url, "Visit the channel <span aria-hidden=\"true\">↗</span>", "textlink") + "</p>" +
    "</div></section>";

  html += '<hr class="staff" aria-hidden="true">';

  var M = C.music || { playlists: [] };
  function spotifyEmbed(url) {
    var m = /open\.spotify\.com\/(?:intl-[a-z]+\/)?(playlist|album|track|artist|episode|show)\/([A-Za-z0-9]+)/.exec(url || "");
    return m ? "https://open.spotify.com/embed/" + m[1] + "/" + m[2] + "?utm_source=generator" : null;
  }
  var lists = (M.playlists || []).filter(function (p) { return spotifyEmbed(p.url); });
  html += '<section class="sec" id="listen"><p class="label mono">Listen</p><div class="body">' +
    '<h2 class="h2">' + esc(M.heading) + "</h2>" +
    '<p class="prose">' + esc(M.intro) + "</p>" +
    '<div class="listen-row">' +
    (lists.length
      ? '<button class="btn" type="button" id="open-player">Open the player</button>' +
        (lists.length > 1 ? '<ul class="tracks mono">' + lists.map(function (p, i) {
          return '<li><button type="button" class="pick" data-i="' + i + '">' + esc(p.title || "Playlist " + (i + 1)) + "</button></li>";
        }).join("") + "</ul>" : "") +
        ext(M.profile, "Hannah on Spotify", "textlink")
      : ext(M.profile, "Listen on Spotify <span aria-hidden=\"true\">↗</span>", "btn")) +
    "</div></div></section>";

  html += '<hr class="staff" aria-hidden="true">';

  html += '<section class="sec" id="connect"><p class="label mono">Connect</p><div class="body">' +
    '<h2 class="h2">' + esc(C.contact.heading) + "</h2>" +
    '<p class="prose">' + esc(C.contact.intro) + "</p>" +
    '<div class="connect-grid">' +
    '<form class="form" id="contact-form" novalidate>' +
    '<input type="hidden" name="_subject" value="New message from Hannah Lynn Mell\'s site">' +
    '<input type="hidden" name="_template" value="table">' +
    '<input type="text" name="_honey" class="sr" tabindex="-1" autocomplete="off" aria-hidden="true">' +
    '<div class="field-row"><label for="cf-name">Name</label><input id="cf-name" name="name" autocomplete="name" required></div>' +
    '<div class="field-row"><label for="cf-email">Email</label><input id="cf-email" name="email" type="email" autocomplete="email" required></div>' +
    '<div class="field-row"><label for="cf-topic">Interested in</label><select id="cf-topic" name="topic">' +
    C.pillars.map(function (p) { return "<option>" + esc(p.service) + "</option>"; }).join("") +
    "<option>Somatic coaching</option><option>Something else</option></select></div>" +
    '<div class="field-row"><label for="cf-msg">Message</label><textarea id="cf-msg" name="message" rows="5" required></textarea></div>' +
    '<button class="btn" type="submit">Send message</button>' +
    '<p class="form-status" id="form-status" role="status" aria-live="polite"></p>' +
    "</form>" +
    '<ul class="links">' + C.links.map(function (l) {
      return "<li>" + ext(l.url, '<span class="link-label">' + esc(l.label) + '</span><span class="mono link-note">' + esc(l.note) + '</span><span class="arrow" aria-hidden="true">↗</span>', "link-row") + "</li>";
    }).join("") + "</ul>" +
    "</div></div></section>";

  html += '<footer class="foot">' +
    '<div class="season-ctl"><p class="mono label-sm" id="season-label">Margins</p>' +
    '<div class="seg" role="group" aria-labelledby="season-label">' +
    ["auto", "spring", "summer", "fall", "winter"].map(function (s) {
      return '<button type="button" class="mono" data-season="' + s + '" aria-pressed="false">' + s + "</button>";
    }).join("") + "</div>" +
    '<p class="mono season-now" id="season-now"></p>' +
    '<p class="mono label-sm" id="paper-label">Paper</p>' +
    '<div class="seg" id="paper-seg" role="group" aria-labelledby="paper-label">' +
    ["grid", "lined"].map(function (s) { return '<button type="button" class="mono" data-paper="' + s + '" aria-pressed="false">' + s + "</button>"; }).join("") +
    "</div></div>" +
    '<p class="colophon">' + esc(C.colophon) + "</p>" +
    '<p class="mono fine">© ' + new Date().getFullYear() + " " + esc(C.name) + "</p>" +
    "</footer>";

  document.getElementById("frame").innerHTML = html;

  document.querySelectorAll(".img img").forEach(function (im) {
    function miss() {
      var f = im.closest(".img");
      if (IMG.showImagePlaceholders) f.classList.add("empty"); else f.remove();
    }
    if (im.complete && !im.naturalWidth) miss(); else im.addEventListener("error", miss);
    im.addEventListener("load", function () { im.closest(".img").classList.add("loaded"); });
  });

  /* ---------- light / dark ---------- */
  var toggle = document.getElementById("theme-toggle");
  function isDark() {
    var t = root.getAttribute("data-theme");
    return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function paintToggle() {
    var d = isDark();
    toggle.setAttribute("aria-label", d ? "Switch to light mode" : "Switch to dark mode");
    toggle.setAttribute("aria-pressed", String(d));
  }
  toggle.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("hlm-theme", next); } catch (e) {}
    paintToggle();
  });
  paintToggle();

  /* ---------- dimensions: floating shapes + rips to a starry night ---------- */
  if (window.Dimensions && C.dimensions) {
    window.Dimensions.shapes({ layer: document.getElementById("dims"), shapes: C.dimensions.shapes || [] });
    var dividers = document.querySelectorAll("#frame > hr.staff");
    (C.dimensions.rips || []).forEach(function (r) {
      var d = dividers[r.between];
      if (d) window.Dimensions.ripBetween(d, r);
    });
  }

  /* ---------- ⟐ OmniReality loader ---------- */
  if (window.Omni) window.Omni.init(C);

  /* ---------- paper: grid or lined ---------- */
  function setPaper(v) {
    root.setAttribute("data-paper", v);
    document.querySelectorAll("#paper-seg button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.paper === v)); });
  }
  setPaper(params.get("paper") || (C.theme && C.theme.paper) || "grid");
  document.getElementById("paper-seg").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (b) setPaper(b.dataset.paper);
  });

  /* ---------- thin scrollbar lights up while scrolling ---------- */
  var scrollIdle = 0;
  window.addEventListener("scroll", function () {
    root.classList.add("is-scrolling");
    clearTimeout(scrollIdle);
    scrollIdle = setTimeout(function () { root.classList.remove("is-scrolling"); }, 900);
  }, { passive: true });

  /* ---------- sticky header melts into the grid once you scroll ---------- */
  var mast = document.querySelector(".masthead");
  function mastState() { mast.classList.toggle("is-stuck", window.scrollY > 24); }
  window.addEventListener("scroll", mastState, { passive: true });
  mastState();

  /* ---------- piles: what fell gathers at each section's end, alternating sides ---------- */
  var piles = [];
  if (window.SeasonalMargins && window.SeasonalMargins.pile) {
    document.querySelectorAll("#frame > hr.staff").forEach(function (hr, i) {
      var slot = document.createElement("div");
      slot.className = "pile-slot";
      hr.parentNode.insertBefore(slot, hr);
      piles.push(window.SeasonalMargins.pile(slot, { side: i % 2 ? "right" : "left", seed: 101 + i * 37 }));
    });
  }

  /* ---------- seasonal margins ---------- */
  var frame = document.getElementById("frame");
  var sm = window.SeasonalMargins.mount({
    canvas: document.getElementById("season"),
    season: params.get("season") || C.seasons.current,
    hemisphere: C.seasons.hemisphere,
    lanes: function () {
      var r = frame.getBoundingClientRect();
      return { left: r.left, right: window.innerWidth - r.right };
    }
  });
  var chosen = params.get("season") || C.seasons.current;
  function paintSeason() {
    document.querySelectorAll(".seg button[data-season]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.season === chosen));
    });
    document.getElementById("season-now").textContent = C.seasons.labels[sm.season];
    root.setAttribute("data-season", sm.season);
    piles.forEach(function (p) { p.render(sm.season); });
  }
  document.querySelector(".seg").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    chosen = b.dataset.season; sm.setSeason(chosen); paintSeason();
  });
  paintSeason();

  /* ---------- a flurry of the season as each section scrolls in ---------- */
  if (!reduce && "IntersectionObserver" in window) {
    var lastBurst = 0;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var now = performance.now();
        if (now - lastBurst < 1200) return;
        lastBurst = now;
        sm.burst(window.innerWidth < 700 ? 6 : 10);
      });
    }, { threshold: 0.2 });
    document.querySelectorAll(".hero, .sec, .foot").forEach(function (el) { io.observe(el); });
  }

  /* ---------- parallax ---------- */
  var fieldsEls = [].slice.call(wall.querySelectorAll(".field"));
  var lines = [].slice.call(document.querySelectorAll(".hero-name .line"));
  var lineRate = [-0.05, 0.09, -0.03];
  var grid = document.getElementById("grid");
  var ticking = false;
  function parallax() {
    ticking = false;
    var y = window.scrollY;
    fieldsEls.forEach(function (el) {
      el.style.transform = "translate3d(0," + (-y * el.dataset.depth).toFixed(1) + "px,0)";
    });
    grid.style.backgroundPosition = "0 " + (-y * 0.12).toFixed(1) + "px";
    root.style.setProperty("--grid-y", (-y * 0.12).toFixed(1) + "px");
    if (y < window.innerHeight * 1.2) {
      lines.forEach(function (el, i) { el.style.transform = "translate3d(" + (y * lineRate[i]).toFixed(1) + "px,0,0)"; });
    }
  }
  if (!reduce) {
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } }, { passive: true });
    parallax();
  }

  /* ---------- docked Spotify player (one iframe, never moved, so playback survives scrolling) ---------- */
  if (lists.length) {
    var dock = document.createElement("aside");
    dock.className = "dock";
    dock.setAttribute("aria-label", "Music player");
    dock.innerHTML =
      '<button type="button" class="dock-tab mono" aria-expanded="false" aria-controls="dock-panel">' +
      '<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span><span class="dock-label">Listen</span></button>' +
      '<div class="dock-panel" id="dock-panel" hidden>' +
      '<div class="dock-head"><p class="mono dock-title" id="dock-title"></p>' +
      '<button type="button" class="dock-min mono" aria-label="Minimise player">Hide</button></div>' +
      (PREVIEW
        ? '<p class="dock-note">The player runs on the live site. ' + ext(lists[0].url, "Open in Spotify ↗", "textlink") + "</p>"
        : '<iframe id="spotify" title="Hannah Lynn Mell on Spotify" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>') +
      "</div>";
    document.body.appendChild(dock);
    var tab = dock.querySelector(".dock-tab"), panel = dock.querySelector(".dock-panel");
    var frameEl = dock.querySelector("#spotify"), current = -1;
    function load(i) {
      if (i === current) return;
      current = i;
      document.getElementById("dock-title").textContent = lists[i].title || "Now playing";
      if (frameEl) frameEl.src = spotifyEmbed(lists[i].url);
      document.querySelectorAll(".pick").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.dataset.i === i)); });
    }
    function openDock(open) {
      panel.hidden = !open;
      tab.setAttribute("aria-expanded", String(open));
      dock.classList.toggle("open", open);
      if (open && current < 0) load(0);
    }
    tab.addEventListener("click", function () { openDock(panel.hidden); });
    dock.querySelector(".dock-min").addEventListener("click", function () { openDock(false); tab.focus(); });
    document.getElementById("open-player").addEventListener("click", function () { openDock(true); });
    document.querySelectorAll(".pick").forEach(function (b) {
      b.addEventListener("click", function () { load(+b.dataset.i); openDock(true); });
    });
  }

  /* ---------- highlight + calendar drawer ---------- */
  var drawerOpen = false;
  if (window.Panels) window.Panels.init(C, { onToggle: function (o) { drawerOpen = o; } });

  /* ---------- carousel ---------- */
  var track = document.getElementById("track");
  if (track) {
    var slides = [].slice.call(track.children), idx = 0, timer = 0, holdUntil = 0;
    var every = ((CAR.autoplaySeconds || 6) * 1000);
    function current() {
      var best = 0, bd = Infinity, left = track.scrollLeft;
      slides.forEach(function (sl, i) { var d = Math.abs(sl.offsetLeft - track.offsetLeft - left); if (d < bd) { bd = d; best = i; } });
      return best;
    }
    function paint() {
      idx = current();
      document.getElementById("car-i").textContent = String(idx + 1).padStart(2, "0");
      document.getElementById("car-fill").style.width = ((idx + 1) / slides.length * 100) + "%";
    }
    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[idx].offsetLeft - track.offsetLeft, behavior: reduce ? "auto" : "smooth" });
    }
    function hold() { holdUntil = Date.now() + 12000; }
    document.getElementById("car-prev").addEventListener("click", function () { hold(); go(current() - 1); });
    document.getElementById("car-next").addEventListener("click", function () { hold(); go(current() + 1); });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); hold(); go(current() + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); hold(); go(current() - 1); }
    });
    var st = 0;
    track.addEventListener("scroll", function () { clearTimeout(st); st = setTimeout(paint, 80); }, { passive: true });
    ["pointerdown", "wheel", "touchstart"].forEach(function (ev) { track.addEventListener(ev, hold, { passive: true }); });
    var car = track.closest(".carousel"), hovering = false, focused = false;
    car.addEventListener("mouseenter", function () { hovering = true; });
    car.addEventListener("mouseleave", function () { hovering = false; });
    car.addEventListener("focusin", function () { focused = true; });
    car.addEventListener("focusout", function () { focused = false; });
    if (!reduce) {
      timer = setInterval(function () {
        if (hovering || focused || drawerOpen || document.hidden || Date.now() < holdUntil) return;
        var r = car.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
        go(atEnd ? 0 : current() + 1);
      }, every);
    }
    paint();
  }

  /* ---------- video facade ---------- */
  document.getElementById("play").addEventListener("click", function () {
    if (PREVIEW) return; // plain link in preview
    var box = document.getElementById("player");
    box.innerHTML = '<iframe title="' + esc(C.name) + ' on YouTube" src="' + esc(this.dataset.src) + '&autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
  });

  /* ---------- contact form ---------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      status.textContent = "Please add your name, a valid email and a message.";
      status.dataset.tone = "warn";
      form.querySelector(":invalid").focus();
      return;
    }
    var first = (form.elements["name"].value || "").trim().split(/\s+/)[0];
    if (!C.contact.endpoint) {
      status.textContent = "Thanks, " + first + ". This form isn't connected to an inbox yet, so please reach Hannah through her Linktree for now.";
      status.dataset.tone = "info";
      return;
    }
    status.textContent = "Sending…"; status.dataset.tone = "info";
    fetch(C.contact.endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error();
        form.reset();
        status.textContent = "Sent. Thank you, " + first + ". Hannah will be in touch.";
        status.dataset.tone = "ok";
      })
      .catch(function () {
        status.textContent = "That didn't go through. Check your connection and try again, or reach Hannah through her Linktree.";
        status.dataset.tone = "warn";
      });
  });
  /* ---------- ⟐ quick menu (sticky, top right) ---------- */
  (function () {
    var items = C.quickMenu || [];
    if (!items.length) return;
    var qm = document.createElement("nav");
    qm.className = "qm";
    qm.setAttribute("aria-label", "Quick menu");
    function target(it) {
      if (it.action === "support") return { href: (C.support && C.support.url) || "#connect", ext: true };
      if (it.action === "omni") return C.omni && C.omni.url ? { href: C.omni.url, ext: true } : { href: "#omni" };
      return { href: it.action, ext: /^https?:/.test(it.action) };
    }
    function label(text) { // show ⟐ in the symbol face, read it as "Omni"
      return esc(text).replace("⟐", '<span class="glyph" aria-hidden="true">⟐</span><span class="sr">Omni</span>');
    }
    qm.innerHTML =
      '<button type="button" class="qm-btn" aria-expanded="false" aria-controls="qm-menu" aria-label="Quick menu">' +
      '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 10 110 60 60 110 10 60Z" fill="none" stroke="url(#qm-g)" stroke-width="9" stroke-linejoin="round"/>' +
      '<defs><linearGradient id="qm-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4320B"/><stop offset=".3" stop-color="#FF692A"/><stop offset=".65" stop-color="#8D1DE2"/><stop offset="1" stop-color="#2049DF"/></linearGradient></defs>' +
      '<circle cx="60" cy="60" r="13" fill="#94E718"/></svg></button>' +
      '<div class="qm-menu" id="qm-menu" hidden><p class="mono qm-title">Quick menu</p><ul>' +
      items.map(function (it) {
        var t = target(it);
        return '<li><a class="qm-item" href="' + esc(t.href) + '"' + (t.ext ? ' target="_blank" rel="noopener"' : "") + ' style="--dc:var(--c-' + esc(it.color || "healing") + ')">' +
          '<span class="qm-dot" aria-hidden="true"></span><span class="qm-text"><span class="qm-label">' + label(it.label) + "</span>" +
          '<span class="mono qm-note">' + esc(it.note || "") + "</span></span>" +
          '<span class="qm-arrow" aria-hidden="true">' + (t.ext ? "↗" : "→") + "</span></a></li>";
      }).join("") + "</ul></div>";
    document.body.appendChild(qm);
    var btn = qm.querySelector(".qm-btn"), menu = qm.querySelector(".qm-menu");
    function set(open) {
      menu.hidden = !open; btn.setAttribute("aria-expanded", String(open)); qm.classList.toggle("open", open);
      if (open) { var f = menu.querySelector("a"); if (f) f.focus(); }
    }
    btn.addEventListener("click", function () { set(menu.hidden); });
    menu.addEventListener("click", function (e) {
      var a = e.target.closest("a"); if (!a) return;
      set(false);
      if (a.getAttribute("href") === "#connect") setTimeout(function () { var n = document.getElementById("cf-name"); if (n) n.focus({ preventScroll: true }); }, 500);
    });
    document.addEventListener("click", function (e) { if (!menu.hidden && !qm.contains(e.target)) set(false); });
    qm.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { set(false); btn.focus(); return; }
      var links = [].slice.call(menu.querySelectorAll("a")), i = links.indexOf(document.activeElement);
      if (i < 0) return;
      if (e.key === "ArrowDown") { e.preventDefault(); links[(i + 1) % links.length].focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
    });
  })();

  /* ---------- chat: standalone site only (OmniReality has its own OmniFeed chat) ---------- */
  if (C.chat && C.chat.enabled && window.HLMChat && (window.HLMChat.isStandalone(mode) || PREVIEW || params.has("chat"))) {
    window.HLMChat.mount(C);
  }
})();
