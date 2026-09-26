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

  var nav = [["about", "About"], ["offerings", "Offerings"], ["writing", "Writing"], ["media", "Video"], ["listen", "Listen"], ["connect", "Connect"]];

  var html = "";

  html += '<header class="masthead">' +
    '<a class="mono monogram" href="#top" aria-label="' + esc(C.name) + ', top of page">' + esc(C.monogram) + "</a>" +
    '<nav aria-label="Sections"><ul>' + nav.map(function (n) { return '<li><a href="#' + n[0] + '">' + n[1] + "</a></li>"; }).join("") + "</ul></nav>" +
    "</header>";

  html += '<section class="hero" id="top"><div class="hero-text">' +
    '<p class="eyebrow mono"><span class="spark-dot" aria-hidden="true"></span>' + esc(C.location) + "</p>" +
    '<h1 class="hero-name" aria-label="' + esc(C.name) + '">' +
    C.nameLines.map(function (l, i) { return '<span class="line l' + i + '" aria-hidden="true">' + esc(l) + "</span>"; }).join("") +
    "</h1>" +
    '<p class="hero-tag">' + esc(C.tagline) + "</p>" +
    '<ul class="roles mono">' + C.roles.map(function (r) { return '<li style="--mark:var(--c-' + r.pillar + ')">' + esc(r.label) + "</li>"; }).join("") + "</ul>" +
    '<div class="actions"><a class="btn" href="#connect">Work with Hannah</a>' + ext(C.writing.url, "Read the Monday Morning Muse", "textlink") + "</div>" +
    "</div>" + fig(IMG.hero, "arch hero-img", "Hero portrait") +
    "</section>";

  html += '<hr class="staff" aria-hidden="true">';

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

  if (IMG.gallery && IMG.gallery.length) {
    html += '<section class="gallery" id="gallery" aria-label="Gallery"><div class="strip">' +
      IMG.gallery.map(function (g, i) { return fig(g, "g g" + (i % 5), "Gallery " + (i + 1)); }).join("") +
      "</div></section>";
    html += '<hr class="staff" aria-hidden="true">';
  }

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
    '<p class="mono season-now" id="season-now"></p></div>' +
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
    document.querySelectorAll(".seg button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.season === chosen));
    });
    document.getElementById("season-now").textContent = C.seasons.labels[sm.season];
    root.setAttribute("data-season", sm.season);
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
  var gal = [].slice.call(document.querySelectorAll(".gallery .img"));
  var ticking = false;
  function parallax() {
    ticking = false;
    var y = window.scrollY;
    fieldsEls.forEach(function (el) {
      el.style.transform = "translate3d(0," + (-y * el.dataset.depth).toFixed(1) + "px,0)";
    });
    grid.style.backgroundPosition = "0 " + (-y * 0.12).toFixed(1) + "px";
    gal.forEach(function (el, i) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      var mid = (r.top + r.height / 2 - window.innerHeight / 2);
      el.style.transform = "translate3d(0," + (mid * (i % 2 ? -0.08 : 0.05)).toFixed(1) + "px,0)";
    });
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
})();
