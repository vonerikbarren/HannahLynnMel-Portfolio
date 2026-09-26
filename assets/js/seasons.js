/*
 * SeasonalMargins: symbols of the season drifting down the side margins.
 * Self-contained; works on its own as a simple embed:
 *
 *   <script src="seasons.js" data-auto data-season="auto"></script>
 *
 * or from code:
 *
 *   const sm = SeasonalMargins.mount({ season: "auto", lanes: () => ({ left, right }) });
 *   sm.setSeason("winter");
 *
 * Spring: flowers · Summer: beach balls & beach chairs · Fall: maple leaves · Winter: snowflakes
 */
(function () {
  "use strict";

  var TAU = Math.PI * 2;
  var SPRITE = 72; // sprite size in CSS px (drawn at devicePixelRatio)

  function seasonFor(date, hemisphere) {
    var m = date.getMonth(); // 0 = Jan
    var s = m >= 2 && m <= 4 ? "spring" : m >= 5 && m <= 7 ? "summer" : m >= 8 && m <= 10 ? "fall" : "winter";
    if (hemisphere === "south") s = { spring: "fall", summer: "winter", fall: "spring", winter: "summer" }[s];
    return s;
  }

  /* ---------- symbol drawings (unit space: -1..1, centred) ---------- */

  function maple(color, vein) {
    return function (c) {
      // right half of a maple leaf, top to base; mirrored for the left
      var R = [
        [0, -1], [0.1, -0.74], [0.3, -0.84], [0.25, -0.46], [0.58, -0.66], [0.5, -0.44],
        [0.92, -0.46], [0.74, -0.24], [0.86, -0.1], [0.44, 0.06], [0.5, 0.22], [0.14, 0.16], [0.05, 0.42]
      ];
      c.beginPath();
      c.moveTo(R[0][0], R[0][1]);
      for (var i = 1; i < R.length; i++) c.lineTo(R[i][0], R[i][1]);
      for (var j = R.length - 1; j > 0; j--) c.lineTo(-R[j][0], R[j][1]);
      c.closePath();
      c.fillStyle = color;
      c.fill();
      c.strokeStyle = vein;
      c.lineWidth = 0.045;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(0, 0.95); c.lineTo(0, -0.78);
      c.moveTo(0, 0.1); c.lineTo(0.62, -0.46);
      c.moveTo(0, 0.1); c.lineTo(-0.62, -0.46);
      c.moveTo(0, 0.22); c.lineTo(0.5, 0.02);
      c.moveTo(0, 0.22); c.lineTo(-0.5, 0.02);
      c.stroke();
    };
  }

  function snowflake(inner, outer) {
    function arms(c) {
      for (var k = 0; k < 6; k++) {
        c.save();
        c.rotate((k * TAU) / 6);
        c.beginPath();
        c.moveTo(0, 0); c.lineTo(0, -0.92);
        [0.42, 0.66].forEach(function (d, n) {
          var b = n ? 0.2 : 0.28;
          c.moveTo(0, -d); c.lineTo(b, -d - b);
          c.moveTo(0, -d); c.lineTo(-b, -d - b);
        });
        c.stroke();
        c.restore();
      }
    }
    return function (c) {
      c.lineCap = "round";
      c.lineJoin = "round";
      c.strokeStyle = outer; c.lineWidth = 0.17; arms(c);
      c.strokeStyle = inner; c.lineWidth = 0.08; arms(c);
    };
  }

  function fivePetal(petal, center) {
    return function (c) {
      c.fillStyle = petal;
      for (var k = 0; k < 5; k++) {
        c.save(); c.rotate((k * TAU) / 5);
        c.beginPath(); c.ellipse(0, -0.48, 0.3, 0.46, 0, 0, TAU); c.fill();
        c.restore();
      }
      c.fillStyle = center;
      c.beginPath(); c.arc(0, 0, 0.22, 0, TAU); c.fill();
    };
  }

  function daisy(petal, center) {
    return function (c) {
      c.fillStyle = petal;
      for (var k = 0; k < 14; k++) {
        c.save(); c.rotate((k * TAU) / 14);
        c.beginPath(); c.ellipse(0, -0.55, 0.11, 0.4, 0, 0, TAU); c.fill();
        c.restore();
      }
      c.fillStyle = center;
      c.beginPath(); c.arc(0, 0, 0.24, 0, TAU); c.fill();
    };
  }

  function blossom(petal, center) {
    return function (c) {
      c.fillStyle = petal;
      for (var k = 0; k < 5; k++) {
        c.save(); c.rotate((k * TAU) / 5);
        c.beginPath();
        c.moveTo(0, -0.08);
        c.bezierCurveTo(0.48, -0.3, 0.42, -0.9, 0.12, -0.9);
        c.lineTo(0, -0.76); // notch
        c.lineTo(-0.12, -0.9);
        c.bezierCurveTo(-0.42, -0.9, -0.48, -0.3, 0, -0.08);
        c.fill();
        c.restore();
      }
      c.fillStyle = center;
      for (var s = 0; s < 5; s++) {
        var a = (s * TAU) / 5 + 0.6;
        c.beginPath(); c.arc(Math.sin(a) * 0.18, -Math.cos(a) * 0.18, 0.06, 0, TAU); c.fill();
      }
    };
  }

  function tulip(petal, leaf) {
    return function (c) {
      c.strokeStyle = leaf; c.lineWidth = 0.08; c.lineCap = "round";
      c.beginPath(); c.moveTo(0, -0.1); c.quadraticCurveTo(0.08, 0.5, 0, 0.95); c.stroke();
      c.fillStyle = leaf;
      c.beginPath(); c.moveTo(0.02, 0.8); c.quadraticCurveTo(0.5, 0.5, 0.42, 0.2); c.quadraticCurveTo(0.2, 0.5, 0.02, 0.62); c.fill();
      c.fillStyle = petal;
      c.beginPath();
      c.moveTo(-0.42, -0.72);
      c.lineTo(-0.2, -0.46); c.lineTo(0, -0.8); c.lineTo(0.2, -0.46); c.lineTo(0.42, -0.72);
      c.bezierCurveTo(0.5, -0.2, 0.3, 0.02, 0, 0.02);
      c.bezierCurveTo(-0.3, 0.02, -0.5, -0.2, -0.42, -0.72);
      c.fill();
    };
  }

  function beachBall(colors) {
    return function (c) {
      c.save();
      c.beginPath(); c.arc(0, 0, 0.92, 0, TAU); c.clip();
      for (var k = 0; k < 6; k++) {
        c.fillStyle = k % 2 ? "#FFFFFF" : colors[(k / 2) | 0];
        c.beginPath(); c.moveTo(0, 0);
        c.arc(0, 0, 0.95, (k * TAU) / 6 - Math.PI / 2, ((k + 1) * TAU) / 6 - Math.PI / 2);
        c.closePath(); c.fill();
      }
      var g = c.createRadialGradient(-0.35, -0.4, 0.05, 0, 0, 1);
      g.addColorStop(0, "rgba(255,255,255,0.55)");
      g.addColorStop(0.5, "rgba(255,255,255,0)");
      g.addColorStop(1, "rgba(20,10,40,0.28)");
      c.fillStyle = g; c.fillRect(-1, -1, 2, 2);
      c.restore();
      c.fillStyle = "#FFFFFF";
      c.beginPath(); c.arc(0, 0, 0.14, 0, TAU); c.fill();
      c.strokeStyle = "rgba(27,21,48,0.25)"; c.lineWidth = 0.04;
      c.beginPath(); c.arc(0, 0, 0.92, 0, TAU); c.stroke();
    };
  }

  function beachChair(stripe, wood) {
    function striped(pts, n, dark) {
      c_.save();
      c_.beginPath();
      c_.moveTo(pts[0][0], pts[0][1]);
      for (var i = 1; i < pts.length; i++) c_.lineTo(pts[i][0], pts[i][1]);
      c_.closePath();
      c_.fillStyle = "#FFFFFF"; c_.fill();
      c_.clip();
      c_.fillStyle = stripe;
      var w = 2 / n;
      for (var s = 0; s < n; s += 2) c_.fillRect(-1 + s * w, -1, w, 2);
      if (dark) { c_.fillStyle = "rgba(20,10,40,0.18)"; c_.fillRect(-1, -1, 2, 2); }
      c_.restore();
    }
    var c_;
    return function (c) {
      c_ = c;
      c.strokeStyle = wood; c.lineWidth = 0.09; c.lineCap = "round";
      c.beginPath();
      c.moveTo(-0.58, 0.42); c.lineTo(-0.7, 0.92);
      c.moveTo(0.58, 0.42); c.lineTo(0.7, 0.92);
      c.moveTo(-0.46, -0.84); c.lineTo(-0.5, 0.1);
      c.moveTo(0.46, -0.84); c.lineTo(0.5, 0.1);
      c.stroke();
      striped([[-0.44, -0.86], [0.44, -0.86], [0.49, 0.1], [-0.49, 0.1]], 10, false);
      striped([[-0.52, 0.1], [0.52, 0.1], [0.64, 0.44], [-0.64, 0.44]], 10, true);
      c.beginPath();
      c.moveTo(-0.5, -0.2); c.lineTo(-0.82, 0.16); c.lineTo(-0.6, 0.42);
      c.moveTo(0.5, -0.2); c.lineTo(0.82, 0.16); c.lineTo(0.6, 0.42);
      c.stroke();
    };
  }

  var SETS = {
    spring: [
      { draw: fivePetal("#FF8FB1", "#FFD23F") },
      { draw: fivePetal("#B78CF0", "#FFF1A8") },
      { draw: daisy("#FFFFFF", "#FFB627") },
      { draw: daisy("#FFD6E4", "#FF692A") },
      { draw: blossom("#FFC2D4", "#D9346B") },
      { draw: tulip("#F4320B", "#6FB312"), flip: false },
      { draw: tulip("#8D1DE2", "#6FB312"), flip: false }
    ],
    summer: [
      { draw: beachBall(["#F4320B", "#2049DF", "#94E718"]), spin: true },
      { draw: beachBall(["#FF692A", "#8D1DE2", "#FFD23F"]), spin: true },
      { draw: beachChair("#2049DF", "#B07A45"), sway: true, scale: 1.15 },
      { draw: beachChair("#FF692A", "#B07A45"), sway: true, scale: 1.15 },
      { draw: beachChair("#8D1DE2", "#9B6B3C"), sway: true, scale: 1.15 }
    ],
    fall: [
      { draw: maple("#F4320B", "rgba(120,20,0,0.45)") },
      { draw: maple("#FF692A", "rgba(130,40,0,0.4)") },
      { draw: maple("#E9A317", "rgba(120,70,0,0.4)") },
      { draw: maple("#B5200A", "rgba(70,0,0,0.45)") },
      { draw: maple("#C94E12", "rgba(80,20,0,0.45)") }
    ],
    winter: [
      { draw: snowflake("#FFFFFF", "rgba(80,110,220,0.55)") },
      { draw: snowflake("#F1F4FF", "rgba(141,29,226,0.4)") },
      { draw: snowflake("#FFFFFF", "rgba(32,73,223,0.45)") }
    ]
  };

  function makeSprite(draw, dpr) {
    var px = Math.ceil(SPRITE * dpr);
    var cv = document.createElement("canvas");
    cv.width = cv.height = px;
    var c = cv.getContext("2d");
    c.translate(px / 2, px / 2);
    c.scale(px / 2.1, px / 2.1);
    draw(c);
    return cv;
  }

  function mount(opts) {
    opts = opts || {};
    var canvas = opts.canvas;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:" + (opts.zIndex || 2);
      (opts.container || document.body).appendChild(canvas);
    }
    var ctx = canvas.getContext("2d");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var hemisphere = opts.hemisphere || "north";
    var season = "fall";
    var sprites = [], parts = [], W = 0, H = 0, dpr = 1, last = 0, raf = 0, running = false;
    var lanesFn = opts.lanes || function () { return { left: W, right: 0 }; }; // default: whole width
    var density = opts.density || 1;

    function lanes() {
      var l = lanesFn() || {};
      return { left: Math.max(0, l.left || 0), right: Math.max(0, l.right || 0) };
    }

    function spawnX(p) {
      var L = lanes();
      var usable = L.left >= 56 || L.right >= 56;
      p.inLane = usable;
      if (!usable) return Math.random() * W;
      var total = L.left + L.right;
      var r = Math.random() * total;
      var pad = Math.min(18, p.size * 0.4);
      if (r < L.left) return pad + Math.random() * Math.max(1, L.left - pad * 2);
      return W - L.right + pad + Math.random() * Math.max(1, L.right - pad * 2);
    }

    function newPart(anywhereY) {
      var s = sprites[(Math.random() * sprites.length) | 0];
      var size = (16 + Math.random() * 16) * (s.scale || 1);
      var p = {
        s: s, size: size,
        y: anywhereY ? Math.random() * H : -size - Math.random() * H * 0.3,
        speed: 14 + Math.random() * 20,            // px per second: slow, light
        amp: 8 + Math.random() * 22,
        freq: 0.25 + Math.random() * 0.45,
        phase: Math.random() * TAU,
        rot: Math.random() * TAU,
        spin: (Math.random() - 0.5) * (s.spin ? 1.6 : 0.9),
        flip: 0.6 + Math.random() * 1.2,
        alpha: 0.55 + Math.random() * 0.35,
        t: Math.random() * 100
      };
      p.x0 = spawnX(p);
      return p;
    }

    function count() {
      var L = lanes();
      var lane = L.left >= 56 || L.right >= 56;
      var area = lane ? (L.left + L.right) * H : W * H;
      var n = Math.round((area / (lane ? 16000 : 60000)) * density);
      return Math.max(6, Math.min(lane ? 26 : 14, n));
    }

    function build() {
      sprites = SETS[season].map(function (d) {
        return { img: makeSprite(d.draw, dpr), spin: d.spin, sway: d.sway, flip: d.flip !== false && !d.spin && !d.sway, scale: d.scale };
      });
      parts = [];
      var n = count();
      for (var i = 0; i < n; i++) parts.push(newPart(true));
    }

    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = canvas.clientWidth || window.innerWidth;
      H = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      build();
      if (reduce) frame(0);
    }

    function frame(dt) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.t += dt;
        p.y += p.speed * dt;
        p.rot += p.spin * dt;
        if (p.y - p.size > H) {
          if (p.extra) { parts.splice(i, 1); i--; continue; }
          parts[i] = p = newPart(false);
        }
        var x = p.x0 + Math.sin(p.t * p.freq * TAU * 0.5 + p.phase) * p.amp;
        ctx.save();
        ctx.globalAlpha = p.extra ? p.alpha : p.inLane ? p.alpha : p.alpha * 0.55;
        ctx.translate(x, p.y);
        if (p.s.sway) ctx.rotate(Math.sin(p.t * p.freq * 2 + p.phase) * 0.35);
        else ctx.rotate(p.rot);
        if (p.s.flip) ctx.scale(Math.max(0.25, Math.abs(Math.cos(p.t * p.flip))), 1);
        ctx.drawImage(p.s.img, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    }

    function loop(now) {
      if (!running) return;
      var dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      frame(dt);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (reduce || running) return;
      running = true; last = 0;
      raf = requestAnimationFrame(loop);
    }
    function stop() { running = false; cancelAnimationFrame(raf); }

    /* A light flurry across the whole width (used as each section scrolls in). */
    function burst(n, o) {
      if (reduce || !sprites.length) return;
      o = o || {};
      var live = 0;
      for (var i = 0; i < parts.length; i++) if (parts[i].extra) live++;
      n = Math.min(n || 8, (o.max || 24) - live);
      for (var k = 0; k < n; k++) {
        var p = newPart(false);
        p.extra = true;
        p.x0 = 24 + Math.random() * Math.max(1, W - 48);
        p.y = -p.size - Math.random() * H * 0.35;
        p.speed = 26 + Math.random() * 26;
        p.alpha = o.alpha || 0.5 + Math.random() * 0.25;
        parts.push(p);
      }
    }

    function setSeason(s) {
      season = !s || s === "auto" ? seasonFor(new Date(), hemisphere) : s;
      if (!SETS[season]) season = seasonFor(new Date(), hemisphere);
      build();
      if (reduce) frame(0);
      return season;
    }

    setSeason(opts.season);
    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
    start();

    return {
      setSeason: setSeason,
      burst: burst,
      get season() { return season; },
      refresh: resize,
      stop: stop,
      start: start,
      canvas: canvas
    };
  }

  window.SeasonalMargins = { mount: mount, seasonFor: seasonFor, seasons: Object.keys(SETS) };

  // Simple embed: <script src="seasons.js" data-auto data-season="winter"></script>
  var me = document.currentScript;
  if (me && me.hasAttribute("data-auto")) {
    var go = function () { mount({ season: me.getAttribute("data-season") || "auto", hemisphere: me.getAttribute("data-hemisphere") || "north" }); };
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", go) : go();
  }
})();
