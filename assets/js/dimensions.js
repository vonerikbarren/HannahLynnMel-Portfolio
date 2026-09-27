/*
 * Dimensions: faux-3D shapes drifting at different depths as you scroll,
 * and rips in the grid that open onto a starry night.
 *
 *   Dimensions.shapes({ layer, shapes })
 *   Dimensions.rip(hostElement, { width, height, right, top, rotate, seed })
 */
(function () {
  "use strict";
  var TAU = Math.PI * 2;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rng(seed) { // small deterministic PRNG so rips keep their shape
    var s = seed >>> 0 || 1;
    return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
  }

  /* ================= floating shapes ================= */

  var P = { writing: "#F4320B", music: "#2049DF", spark: "#94E718", healing: "#8D1DE2", movement: "#FF692A" };

  function el(tag, cls, parent) { var e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }

  function buildShape(def) {
    var wrap = el("div", "dim dim-" + def.type);
    wrap.style.setProperty("--s", def.size + "px");
    wrap.style.setProperty("--c1", P[def.c1] || def.c1);
    wrap.style.setProperty("--c2", P[def.c2] || def.c2 || P.healing);
    var body = el("div", "dim-body", wrap);
    if (def.type === "cube") {
      ["f", "b", "l", "r", "t", "d"].forEach(function (f) { el("i", "face " + f, body); });
    } else if (def.type === "pyramid") {
      ["p1", "p2", "p3", "p4"].forEach(function (f) { el("i", "face " + f, body); });
    }
    el("div", "dim-shadow", wrap);
    return wrap;
  }

  function shapes(opts) {
    var layer = opts.layer, defs = opts.shapes, items = [];
    defs.forEach(function (d, i) {
      var node = buildShape(d);
      layer.appendChild(node);
      items.push({ d: d, node: node, body: node.querySelector(".dim-body"), phase: i * 1.7 });
    });
    var sy = window.scrollY, target = sy, t0 = performance.now(), running = true;
    var px = -9999, py = -9999;
    if (!reduce) {
      window.addEventListener("pointermove", function (e) { if (e.pointerType !== "touch") { px = e.clientX; py = e.clientY; } }, { passive: true });
      window.addEventListener("pointerdown", function (e) { if (e.pointerType === "touch") { px = e.clientX; py = e.clientY; setTimeout(function () { px = py = -9999; }, 700); } }, { passive: true });
    }
    items.forEach(function (it) { it.nx = 0; it.ny = 0; });
    function place(now) {
      var H = window.innerHeight, W = window.innerWidth, t = (now - t0) / 1000;
      sy += (target - sy) * (reduce ? 1 : 0.08);           // eased scroll → floaty
      var loop = H * 1.8;
      items.forEach(function (it) {
        var d = it.d;
        var raw = d.y * H - sy * d.depth;                   // deeper = slower
        var y = ((raw % loop) + loop) % loop - H * 0.4;     // wrap so they keep arriving
        var x = d.x * W + Math.sin(t * 0.3 + it.phase) * 10;
        var bob = reduce ? 0 : Math.sin(t * 0.6 + it.phase) * 8;
        var scale = 0.55 + d.depth * 0.9;
        // breeze: shapes lean away from the pointer, then drift back
        var ddx = x - px, ddy = y - py, dd = Math.hypot(ddx, ddy), R = 220 * scale;
        var tx = 0, ty = 0;
        if (dd < R && dd > 0.1) { var f = (1 - dd / R); tx = ddx / dd * f * 60 * d.depth; ty = ddy / dd * f * 45 * d.depth; }
        it.nx += (tx - it.nx) * 0.08; it.ny += (ty - it.ny) * 0.08;
        it.node.style.transform = "translate3d(" + (x + it.nx).toFixed(1) + "px," + (y + bob + it.ny).toFixed(1) + "px,0) scale(" + scale.toFixed(3) + ")";
        it.node.style.filter = d.depth < 0.35 ? "blur(" + ((0.35 - d.depth) * 8).toFixed(1) + "px)" : "";
        it.node.style.opacity = String(Math.min(1, 0.45 + d.depth));
        var spin = sy * 0.12 * (d.spin || 1) + (reduce ? 0 : t * 6 * (d.spin || 1));
        if (d.type === "cube" || d.type === "pyramid") {
          it.body.style.transform = "rotateX(" + (-18 + spin * 0.6).toFixed(1) + "deg) rotateY(" + (spin * 1.2).toFixed(1) + "deg)";
        } else if (d.type === "torus") {
          it.body.style.transform = "rotateX(64deg) rotateZ(" + spin.toFixed(1) + "deg)";
        } else if (d.type === "capsule") {
          it.body.style.transform = "rotateZ(" + (d.tilt + Math.sin(sy * 0.002 + it.phase) * 25).toFixed(1) + "deg)";
        }
      });
      if (running && !reduce) requestAnimationFrame(place);
    }
    window.addEventListener("scroll", function () {
      target = window.scrollY;
      if (reduce) requestAnimationFrame(place);
    }, { passive: true });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) running = false; else if (!running) { running = true; requestAnimationFrame(place); }
    });
    requestAnimationFrame(place);
  }

  /* ================= rips: windows into other scenes =================
   * Scenes: "sky" (clouds), "mountain" (peaks + lake), "beach", "tree".
   * Light mode shows each by day; dark mode shows the same place at night.
   * A rip can carry `layers`: smaller torn scraps pasted over it, collage-style. */

  function tornPath(rand, w, h, grow) {
    var h1 = rand() * TAU, h2 = rand() * TAU, h3 = rand() * TAU;
    var pts = [], n = 120, cx = w / 2, cy = h / 2;
    for (var i = 0; i < n; i++) {
      var a = (i / n) * TAU;
      var shape = 1 + 0.10 * Math.sin(2 * a + h1) + 0.07 * Math.sin(3 * a + h2) + 0.05 * Math.sin(5 * a + h3);
      var fibre = 1 - (i % 2) * (0.025 + rand() * 0.035) - (rand() < 0.08 ? 0.06 : 0);
      var pinch = 1 - Math.pow(Math.abs(Math.cos(a)), 8) * 0.5;
      var rx = (w / 2 - 10) * shape * fibre + grow, ry = (h / 2 - 10) * shape * fibre * pinch + grow;
      pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    }
    return "polygon(" + pts.map(function (p) { return p[0].toFixed(1) + "px " + p[1].toFixed(1) + "px"; }).join(",") + ")";
  }

  function isDark() {
    var t = document.documentElement.getAttribute("data-theme");
    return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function season() { return document.documentElement.getAttribute("data-season") || "fall"; }

  /* ---- scene pieces ---- */
  function lin(ctx, y0, y1, stops) {
    var g = ctx.createLinearGradient(0, y0, 0, y1);
    stops.forEach(function (s) { g.addColorStop(s[0], s[1]); });
    return g;
  }
  function skyDay(ctx, W, H, horizon) {
    ctx.fillStyle = lin(ctx, 0, horizon, [[0, "#4F86EC"], [0.55, "#8DBBFA"], [1, "#E6F1FF"]]);
    ctx.fillRect(0, 0, W, horizon + 2);
    var sun = ctx.createRadialGradient(W * 0.78, horizon * 0.35, 0, W * 0.78, horizon * 0.35, W * 0.35);
    sun.addColorStop(0, "rgba(255,244,210,0.95)"); sun.addColorStop(0.12, "rgba(255,236,190,0.6)"); sun.addColorStop(1, "rgba(255,236,190,0)");
    ctx.fillStyle = sun; ctx.fillRect(0, 0, W, horizon + 2);
  }
  function skyNight(ctx, W, H, horizon, stars, t, reduceIt) {
    ctx.fillStyle = lin(ctx, 0, horizon, [[0, "#070519"], [0.6, "#140C38"], [1, "#2A1A55"]]);
    ctx.fillRect(0, 0, W, horizon + 2);
    [[0.3, 0.3, "rgba(141,29,226,0.30)"], [0.75, 0.5, "rgba(32,73,223,0.28)"], [0.55, 0.15, "rgba(244,50,11,0.14)"]].forEach(function (n) {
      var rg = ctx.createRadialGradient(n[0] * W, n[1] * horizon, 0, n[0] * W, n[1] * horizon, Math.max(W, H) * 0.45);
      rg.addColorStop(0, n[2]); rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, horizon + 2);
    });
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i]; if (s.y > horizon) continue;
      var a = reduceIt ? 0.8 : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.tw + s.ph));
      ctx.globalAlpha = a; ctx.fillStyle = s.c;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, TAU); ctx.fill();
      if (s.r > 1.3) { ctx.globalAlpha = a * 0.5; ctx.fillRect(s.x - s.r * 3, s.y - 0.3, s.r * 6, 0.6); ctx.fillRect(s.x - 0.3, s.y - s.r * 3, 0.6, s.r * 6); }
    }
    ctx.globalAlpha = 1;
  }
  function moon(ctx, x, y, r) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
    g.addColorStop(0, "rgba(255,248,220,0.35)"); g.addColorStop(1, "rgba(255,248,220,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 4, 0, TAU); ctx.fill();
    ctx.fillStyle = "#FFF6DA"; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(200,190,160,0.35)"; ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.2, r * 0.22, 0, TAU); ctx.arc(x + r * 0.35, y + r * 0.3, r * 0.15, 0, TAU); ctx.fill();
  }
  function cloud(ctx, x, y, s, dark) {
    var puffs = [[0, 0, 1], [0.85, -0.25, 0.8], [-0.85, 0.1, 0.72], [0.3, -0.55, 0.78], [1.55, 0.15, 0.55], [-1.5, 0.22, 0.5]];
    ctx.fillStyle = dark ? "rgba(120,110,170,0.22)" : "rgba(170,192,228,0.75)";
    puffs.forEach(function (p) { ctx.beginPath(); ctx.arc(x + p[0] * s, y + p[1] * s + s * 0.12, p[2] * s, 0, TAU); ctx.fill(); });
    ctx.fillStyle = dark ? "rgba(190,180,230,0.16)" : "rgba(255,255,255,0.97)";
    puffs.forEach(function (p) { ctx.beginPath(); ctx.arc(x + p[0] * s, y + p[1] * s, p[2] * s * 0.94, 0, TAU); ctx.fill(); });
    ctx.fillStyle = dark ? "rgba(0,0,0,0)" : "rgba(255,255,255,0)";
  }
  function ridge(rand, W, base, amp, rough) {
    var n = 65, ys = new Array(n);
    ys[0] = base - rand() * amp * 0.4; ys[n - 1] = base - rand() * amp * 0.4;
    (function mid(a, b, d) {
      if (b - a < 2) return;
      var m = (a + b) >> 1;
      ys[m] = (ys[a] + ys[b]) / 2 - (rand() - 0.35) * d;
      mid(a, m, d * rough); mid(m, b, d * rough);
    })(0, n - 1, amp);
    return ys.map(function (y, i) { return [i / (n - 1) * W, Math.min(base + 4, y)]; });
  }
  function fillRidge(ctx, pts, floor, fill) {
    ctx.beginPath(); ctx.moveTo(0, floor);
    pts.forEach(function (p) { ctx.lineTo(p[0], p[1]); });
    ctx.lineTo(pts[pts.length - 1][0], floor); ctx.closePath();
    ctx.fillStyle = fill; ctx.fill();
  }
  function snowcap(ctx, pts, floor, snowY, rockFill, snowFill) {
    ctx.save();
    ctx.beginPath(); ctx.moveTo(0, floor); pts.forEach(function (p) { ctx.lineTo(p[0], p[1]); }); ctx.lineTo(pts[pts.length - 1][0], floor); ctx.closePath();
    ctx.clip();
    ctx.beginPath(); ctx.rect(0, 0, 99999, snowY); ctx.clip();
    ctx.fillStyle = snowFill; ctx.fillRect(0, 0, 99999, snowY);
    ctx.beginPath(); ctx.moveTo(0, floor);
    pts.forEach(function (p, i) { ctx.lineTo(p[0], p[1] + 10 + (i % 3) * 4); });
    ctx.lineTo(pts[pts.length - 1][0], floor); ctx.closePath();
    ctx.fillStyle = rockFill; ctx.fill();
    ctx.restore();
  }

  var FOLIAGE = {
    spring: ["#FFB7CE", "#FF8FB1", "#FFE1EA", "#9BD66A"],
    summer: ["#4E9F2E", "#6CBB3C", "#94E718", "#3C7F25"],
    fall:   ["#F4320B", "#FF692A", "#E9A317", "#B5200A"],
    winter: null
  };

  function makeTree(rand, W, H, groundY) {
    var segs = [], leaves = [];
    (function branch(x, y, len, ang, w, depth) {
      var x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
      segs.push([x, y, x2, y2, w]);
      if (depth === 0) { leaves.push([x2, y2]); return; }
      var n = depth > 3 ? 2 : 2 + (rand() < 0.4 ? 1 : 0);
      for (var i = 0; i < n; i++) {
        var spread = (i - (n - 1) / 2) * (0.5 + rand() * 0.25);
        branch(x2, y2, len * (0.68 + rand() * 0.12), ang + spread + (rand() - 0.5) * 0.25, w * 0.68, depth - 1);
      }
      if (depth <= 3) leaves.push([x2, y2]);
    })(W * 0.5, groundY, H * 0.165, -Math.PI / 2 + (rand() - 0.5) * 0.1, Math.max(4, W * 0.018), 6);
    var clusters = [];
    leaves.forEach(function (l) {
      for (var k = 0; k < 4; k++) clusters.push([l[0] + (rand() - 0.5) * 22, l[1] + (rand() - 0.5) * 18, 6 + rand() * 8, (rand() * 4) | 0]);
    });
    return { segs: segs, clusters: clusters };
  }

  function drawTree(ctx, tree, dark, t, reduceIt) {
    var sway = reduceIt ? 0 : Math.sin(t * 0.9) * 1.2;
    ctx.lineCap = "round";
    ctx.strokeStyle = dark ? "#0E0A1E" : "#5A3D26";
    tree.segs.forEach(function (s) {
      ctx.lineWidth = s[4];
      ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2] + sway * (1 - s[4] / 12), s[3]); ctx.stroke();
    });
    var pal = FOLIAGE[season()];
    if (!pal) { // winter: bare branches with snow
      if (!dark) { ctx.fillStyle = "rgba(255,255,255,0.9)"; tree.clusters.forEach(function (c, i) { if (i % 3 === 0) { ctx.beginPath(); ctx.arc(c[0] + sway, c[1] - 2, c[2] * 0.35, 0, TAU); ctx.fill(); } }); }
      return;
    }
    tree.clusters.forEach(function (c) {
      ctx.fillStyle = dark ? ["#1A1233", "#221842", "#150F2A", "#2A1D4F"][c[3]] : pal[c[3]];
      ctx.beginPath(); ctx.arc(c[0] + sway, c[1], c[2], 0, TAU); ctx.fill();
    });
    if (!dark) { // light catching the canopy
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      tree.clusters.forEach(function (c, i) { if (i % 4 === 0) { ctx.beginPath(); ctx.arc(c[0] + sway - c[2] * 0.3, c[1] - c[2] * 0.3, c[2] * 0.45, 0, TAU); ctx.fill(); } });
    }
  }

  function Scene(kind, W, H, seed) {
    var r = rng(seed * 97 + 3);
    this.kind = kind; this.W = W; this.H = H;
    this.horizon = kind === "sky" || kind === "stars" ? H : kind === "beach" ? H * 0.5 : kind === "tree" ? H * 0.76 : H * 0.66;
    var tints = ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#DCE3FF", "#FFE9D6", "#E9D6FF", "#E8FFC9"];
    this.stars = [];
    for (var i = 0; i < Math.round(W * H / 520); i++) this.stars.push({ x: r() * W, y: r() * H, r: r() < 0.08 ? 1.3 + r() * 1.1 : 0.35 + r() * 0.8, c: tints[(r() * tints.length) | 0], tw: 0.6 + r() * 2.4, ph: r() * TAU });
    this.clouds = [];
    var nc = kind === "stars" ? 0 : kind === "sky" ? 6 : 3;
    for (var c = 0; c < nc; c++) this.clouds.push({ x: r() * W, y: (0.12 + r() * (kind === "sky" ? 0.7 : 0.3)) * this.horizon, s: (kind === "sky" ? 14 : 9) + r() * 12, v: 4 + r() * 6 });
    if (kind === "mountain") {
      var hz0 = this.horizon;
      this.back = ridge(r, W, hz0, H * 0.36, 0.62).map(function (p) { return [p[0], Math.max(hz0 - H * 0.42, p[1])]; });
      this.front = ridge(r, W, hz0, H * 0.2, 0.55).map(function (p) { return [p[0], Math.max(hz0 - H * 0.26, p[1])]; });
    }
    if (kind === "tree") {
      this.hill = ridge(r, W, this.horizon + 4, H * 0.08, 0.5);
      this.tree = makeTree(r, W, H, this.horizon + 2);
    }
    this.meteor = null; this.nextMeteor = 2 + r() * 5; this.r = r;
  }
  Scene.prototype.draw = function (ctx, t, dt, reduceIt) {
    var W = this.W, H = this.H, hz = this.horizon, dark = this.forceDark || isDark(), k = this.kind, self = this;
    if (dark) skyNight(ctx, W, H, hz, this.stars, t, reduceIt); else skyDay(ctx, W, H, hz);
    if (dark && k !== "sky" && k !== "stars") moon(ctx, W * 0.8, hz * 0.3, Math.max(6, H * 0.05));
    this.clouds.forEach(function (c) {
      if (!reduceIt) { c.x += c.v * dt; if (c.x - c.s * 3 > W) c.x = -c.s * 3; }
      cloud(ctx, c.x, c.y, c.s, dark);
    });

    if (k === "mountain") {
      fillRidge(ctx, this.back, hz + 2, dark ? "#241C47" : "#9DB2D6");
      snowcap(ctx, this.back, hz + 2, hz - H * 0.25, dark ? "#241C47" : "#9DB2D6", dark ? "rgba(220,215,255,0.35)" : "#FFFFFF");
      fillRidge(ctx, this.front, hz + 2, dark ? "#140F2C" : "#5F7FA8");
      snowcap(ctx, this.front, hz + 2, hz - H * 0.19, dark ? "#140F2C" : "#5F7FA8", dark ? "rgba(220,215,255,0.28)" : "#F4F8FF");
      // lake + reflection
      ctx.fillStyle = lin(ctx, hz, H, dark ? [[0, "#1B1440"], [1, "#07051A"]] : [[0, "#7FA7DE"], [1, "#3E6BB0"]]);
      ctx.fillRect(0, hz, W, H - hz);
      ctx.save(); ctx.globalAlpha = dark ? 0.35 : 0.3;
      ctx.translate(0, hz * 2); ctx.scale(1, -1);
      fillRidge(ctx, this.back, hz + 2, dark ? "#2C2356" : "#C5D3EA");
      fillRidge(ctx, this.front, hz + 2, dark ? "#1B1540" : "#7D98BF");
      ctx.restore();
      this.shimmer(ctx, hz, H, t, dark, reduceIt);
    }
    if (k === "beach") {
      ctx.fillStyle = lin(ctx, hz, H * 0.76, dark ? [[0, "#1A1646"], [1, "#0C0A2A"]] : [[0, "#1F7CC4"], [1, "#4CB5E6"]]);
      ctx.fillRect(0, hz, W, H * 0.76 - hz + 1);
      this.shimmer(ctx, hz, H * 0.72, t, dark, reduceIt);
      var sandTop = H * 0.76;
      ctx.fillStyle = lin(ctx, sandTop, H, dark ? [[0, "#3A3050"], [1, "#2A2340"]] : [[0, "#F3DDB0"], [1, "#E4C088"]]);
      ctx.beginPath(); ctx.moveTo(0, sandTop);
      for (var x = 0; x <= W; x += 8) ctx.lineTo(x, sandTop + Math.sin(x * 0.03 + 1) * 3);
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      // foam
      var ph = reduceIt ? 0 : t * 0.8;
      ctx.strokeStyle = dark ? "rgba(200,200,255,0.35)" : "rgba(255,255,255,0.9)"; ctx.lineWidth = 2;
      ctx.beginPath();
      for (var fx = 0; fx <= W; fx += 6) { var fy = sandTop - 1 + Math.sin(fx * 0.05 + ph) * 2.5 + Math.sin(ph * 0.7) * 2; fx ? ctx.lineTo(fx, fy) : ctx.moveTo(fx, fy); }
      ctx.stroke();
      // a beach ball on the sand, for summer's sake
      var bx = W * 0.22, by = H * 0.88, br = Math.max(5, H * 0.045);
      ["#F4320B", "#FFFFFF", "#2049DF", "#FFFFFF", "#94E718", "#FFFFFF"].forEach(function (col, i) {
        ctx.fillStyle = dark ? "rgba(90,80,130,1)" : col; ctx.beginPath(); ctx.moveTo(bx, by);
        ctx.arc(bx, by, br, i * TAU / 6, (i + 1) * TAU / 6); ctx.closePath(); ctx.fill();
      });
    }
    if (k === "tree") {
      fillRidge(ctx, this.hill, H, dark ? "#0D0A1F" : lin(ctx, hz - 10, H, [[0, "#8CCB4E"], [1, "#4E8E2C"]]));
      drawTree(ctx, this.tree, dark, t, reduceIt);
      if (season() === "fall" && !dark) { // a few leaves on the grass
        ctx.fillStyle = "#FF692A"; for (var i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(W * (0.3 + (i * 0.061) % 0.45), hz + 8 + (i % 3) * 4, 1.8, 0, TAU); ctx.fill(); }
      }
    }
    if (dark && !reduceIt) this.shooting(ctx, t, dt);
  };
  Scene.prototype.shimmer = function (ctx, top, bottom, t, dark, reduceIt) {
    ctx.fillStyle = dark ? "rgba(255,246,218,0.35)" : "rgba(255,255,255,0.55)";
    for (var i = 0; i < 14; i++) {
      var y = top + 4 + ((i * 37) % Math.max(1, bottom - top - 6));
      var x = ((i * 83 + (reduceIt ? 0 : t * (8 + i % 4) * 3)) % (this.W + 40)) - 20;
      ctx.fillRect(x, y, 10 + (i % 3) * 6, 1);
    }
  };
  Scene.prototype.shooting = function (ctx, t, dt) {
    if (!this.meteor && t > this.nextMeteor) {
      this.meteor = { x: this.W * (0.2 + this.r() * 0.5), y: this.horizon * 0.1, vx: 260 + this.r() * 120, vy: 110 + this.r() * 50, life: 0 };
      this.nextMeteor = t + 5 + this.r() * 7;
    }
    var m = this.meteor; if (!m) return;
    m.life += dt; m.x += m.vx * dt; m.y += m.vy * dt;
    var g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 0.25, m.y - m.vy * 0.25);
    g.addColorStop(0, "rgba(255,255,255,0.95)"); g.addColorStop(1, "rgba(148,231,24,0)");
    ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * 0.25, m.y - m.vy * 0.25); ctx.stroke();
    if (m.life > 1.1) this.meteor = null;
  };

  function rip(host, o, isLayer) {
    var w = o.width, h = o.height, seed = o.seed || 7;
    var wrap = el("div", isLayer ? "rip rip-layer" : "rip", host);
    wrap.setAttribute("aria-hidden", "true");
    var pos = "";
    ["left", "right", "top", "bottom"].forEach(function (k) { if (o[k] != null) pos += k + ":" + o[k] + ";"; });
    wrap.style.cssText = "width:" + w + "px;height:" + h + "px;" + pos + "--rot:" + (o.rotate || 0) + "deg";
    var edge = el("div", "rip-edge", wrap);
    edge.style.clipPath = tornPath(rng(seed), w + 18, h + 18, 2);
    var hole = el("div", "rip-hole", wrap);
    hole.style.clipPath = tornPath(rng(seed), w, h, 0);
    var cv = el("canvas", "rip-sky", hole);
    var pad = isLayer ? 20 : 40, dpr = Math.min(2, window.devicePixelRatio || 1);
    var CW = w + pad * 2, CH = h + pad * 2;
    cv.width = CW * dpr; cv.height = CH * dpr;
    cv.style.width = CW + "px"; cv.style.height = CH + "px";
    cv.style.left = -pad + "px"; cv.style.top = -pad + "px";
    var ctx = cv.getContext("2d"); ctx.scale(dpr, dpr);
    var scene = new Scene(o.scene || "sky", CW, CH, seed);
    scene.forceDark = !!o.forceDark;

    var visible = false, raf = 0, start = performance.now(), last = start;
    function paint(now) {
      var t = (now - start) / 1000, dt = Math.min(0.05, (now - last) / 1000); last = now;
      scene.draw(ctx, t, dt, reduce);
    }
    function loop(now) { paint(now); if (visible && !reduce) raf = requestAnimationFrame(loop); }
    paint(performance.now());
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting; cancelAnimationFrame(raf);
        if (visible && !reduce) { last = performance.now(); raf = requestAnimationFrame(loop); }
      }).observe(wrap);
    }
    // repaint when the theme or season changes
    new MutationObserver(function () { paint(performance.now()); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-season"] });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { paint(performance.now()); });

    if (!isLayer) {
      var depth = function () {
        var r = wrap.getBoundingClientRect();
        var off = (r.top + r.height / 2 - window.innerHeight / 2);
        var cl = function (v) { return Math.max(-pad * 0.9, Math.min(pad * 0.9, v)); };
        wrap.style.transform = "translate3d(0," + (off * -0.03).toFixed(1) + "px,0) rotate(var(--rot))";
        cv.style.transform = "translate3d(" + cl(off * 0.03).toFixed(1) + "px," + cl(off * 0.1).toFixed(1) + "px,0)";
      };
      if (!reduce) window.addEventListener("scroll", function () { requestAnimationFrame(depth); }, { passive: true });
      depth();
    }
    (o.layers || []).forEach(function (L, i) { rip(wrap, Object.assign({ seed: seed + 17 * (i + 1) }, L), true); });
    return wrap;
  }

  /* Place a rip in the gap between two sections (on a divider). */
  function ripBetween(divider, o) {
    var slot = document.createElement("div");
    slot.className = "rip-slot";
    divider.parentNode.insertBefore(slot, divider);
    var scale = window.innerWidth < 820 ? 0.62 : 1;
    var w = Math.round(o.width * scale), h = Math.round(o.height * scale);
    var opts = Object.assign({}, o, { width: w, height: h, top: (-h / 2 + 8) + "px" });
    if (o.align === "left") opts.left = o.offset || "4%";
    else if (o.align === "center") opts.left = "calc(50% - " + w / 2 + "px)";
    else opts.right = o.offset || "4%";
    if (o.layers) opts.layers = o.layers.map(function (L) { return Object.assign({}, L, { width: Math.round(L.width * scale), height: Math.round(L.height * scale) }); });
    return rip(slot, opts);
  }

  window.Dimensions = { shapes: shapes, rip: rip, ripBetween: ripBetween };
})();
