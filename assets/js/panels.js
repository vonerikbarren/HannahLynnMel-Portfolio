/*
 * Panels: component cards that live in the carousel (Highlight, Calendar)
 * and the drawer that drops open underneath the carousel when one is clicked.
 *
 *   Panels.card(slide, C)         → HTML for a card slide
 *   Panels.drawerHTML()           → HTML for the (closed) drawer
 *   Panels.init(C, { onToggle })  → wires cards + drawer
 */
(function () {
  "use strict";

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function parse(d) { var p = d.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function key(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function longDate(d) { return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); }
  function isExternal(u) { return /^https?:/.test(u || ""); }
  function link(u, label, cls) {
    return '<a class="' + cls + '" href="' + esc(u) + '"' + (isExternal(u) ? ' target="_blank" rel="noopener"' : "") + ">" + label + "</a>";
  }

  function upcoming(C, n) {
    var t = today();
    return (C.calendar.events || [])
      .map(function (e) { return Object.assign({ d: parse(e.date) }, e); })
      .filter(function (e) { return e.d >= t; })
      .sort(function (a, b) { return a.d - b.d; })
      .slice(0, n);
  }

  /* ---------------- cards (carousel slides) ---------------- */

  function glyph(text) { // ⟐ in the symbol face, read aloud as "Omni"
    return esc(text).replace("⟐", '<span class="glyph" aria-hidden="true">⟐</span><span class="sr">Omni</span>');
  }

  function card(slide, C) {
    if (slide.type === "donate") {
      var D = C.donate || {};
      return '<button type="button" class="slide-card card-donate" data-panel="donate" aria-expanded="false" aria-controls="drawer">' +
        '<span class="card-top"><span class="chip mono">Give</span></span>' +
        (D.logo && D.logo.src
          ? '<span class="logo-mask give-logo" role="img" aria-label="' + esc(D.logo.alt || D.name) + '" style="--logo:url(\'' + esc(D.logo.src) + '\')"></span>'
          : '<span class="give-mark" aria-hidden="true"><span class="gm-num">44<i>.</i>4</span><span class="gm-wave"></span></span>') +
        '<span class="card-title">' + esc(D.cardTitle || D.name) + "</span>" +
        '<span class="card-sub">' + esc(D.cardSub || D.tagline || "") + "</span>" +
        '<span class="card-foot mono"><span>Support the work</span><span class="card-open">Ways to give <span aria-hidden="true">↓</span></span></span>' +
        "</button>";
    }
    if (slide.type === "omni") {
      var O = C.omni || {};
      return '<button type="button" class="slide-card card-omni" data-panel="omni" aria-expanded="false" aria-controls="drawer" aria-label="OmniReality: peek inside">' +
        '<span class="card-top"><span class="chip mono"><span aria-hidden="true"><span class="glyph">⟐</span>mniReality</span></span></span>' +
        '<span class="omni-mini" aria-hidden="true"><span class="om-orbit"><i></i><i></i><i></i><i></i><i></i></span>' +
        '<svg viewBox="0 0 120 120"><path d="M60 8 112 60 60 112 8 60Z" fill="none" stroke="url(#omc-g)" stroke-width="5" stroke-linejoin="round"/>' +
        '<defs><linearGradient id="omc-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4320B"/><stop offset=".3" stop-color="#FF692A"/><stop offset=".65" stop-color="#8D1DE2"/><stop offset="1" stop-color="#2049DF"/></linearGradient></defs>' +
        '<circle cx="60" cy="60" r="9" fill="#94E718"/></svg></span>' +
        '<span class="card-title">' + esc(O.cardTitle || "Something is gathering") + "</span>" +
        '<span class="card-sub">' + glyph(O.cardSub || "Join me, to my ⟐reality.") + "</span>" +
        '<span class="card-foot mono"><span>' + (O.url ? "Open" : "Preview") + '</span><span class="card-open">Peek inside <span aria-hidden="true">↓</span></span></span>' +
        "</button>";
    }
    if (slide.type === "highlight") {
      var H = C.highlight, d = H.date ? parse(H.date) : null;
      return '<button type="button" class="slide-card card-highlight" data-panel="highlight" aria-expanded="false" aria-controls="drawer" style="--pc:var(--c-' + esc(H.pillar) + ')">' +
        '<span class="card-top"><span class="chip mono"><span class="spark-dot" aria-hidden="true"></span>' + esc(H.kicker) + "</span>" +
        (H.sample ? '<span class="chip chip-ghost mono">Sample</span>' : "") + "</span>" +
        '<span class="card-title">' + esc(H.title) + "</span>" +
        '<span class="card-sub">' + esc(H.subtitle) + "</span>" +
        '<span class="card-foot mono">' + (d ? esc(d.toLocaleDateString("en-US", { month: "short", day: "numeric" })) + " · " : "") + esc(H.time || "") +
        '<span class="card-open">Details <span aria-hidden="true">↓</span></span></span>' +
        "</button>";
    }
    if (slide.type === "calendar") {
      var next = upcoming(C, 1)[0], t = today();
      var monthEvents = (C.calendar.events || []).filter(function (e) { var x = parse(e.date); return x.getMonth() === t.getMonth() && x.getFullYear() === t.getFullYear() && x >= t; });
      var first = new Date(t.getFullYear(), t.getMonth(), 1), days = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
      var dots = "";
      for (var i = 0; i < first.getDay(); i++) dots += '<i class="pad"></i>';
      for (var dd = 1; dd <= days; dd++) {
        var k = key(new Date(t.getFullYear(), t.getMonth(), dd));
        var ev = (C.calendar.events || []).filter(function (e) { return e.date === k; })[0];
        dots += '<i class="' + (dd === t.getDate() ? "is-today " : "") + (ev ? "has" : "") + '"' + (ev ? ' style="--dc:var(--c-' + esc(ev.pillar) + ')"' : "") + "></i>";
      }
      return '<button type="button" class="slide-card card-calendar" data-panel="calendar" aria-expanded="false" aria-controls="drawer">' +
        '<span class="card-top"><span class="chip mono">Calendar</span>' + (C.calendar.sample ? '<span class="chip chip-ghost mono">Sample</span>' : "") + "</span>" +
        '<span class="mono cal-month">' + MONTHS[t.getMonth()] + " " + t.getFullYear() + "</span>" +
        '<span class="mini-grid" aria-hidden="true">' + dots + "</span>" +
        (next
          ? '<span class="card-next"><span class="next-day">' + next.d.getDate() + '</span><span class="next-text"><span class="mono">Next up · ' + esc(next.d.toLocaleDateString("en-US", { weekday: "short", month: "short" })) + "</span>" + esc(next.title) + "</span></span>"
          : '<span class="card-next"><span class="next-text">Nothing scheduled yet.</span></span>') +
        '<span class="card-foot mono">' + monthEvents.length + (monthEvents.length === 1 ? " date" : " dates") + " left this month<span class=\"card-open\">Open <span aria-hidden=\"true\">↓</span></span></span>" +
        "</button>";
    }
    return "";
  }

  function drawerHTML() {
    return '<div class="drawer" id="drawer" aria-hidden="true"><div class="drawer-clip"><div class="drawer-inner" id="drawer-inner"></div></div></div>';
  }

  /* ---------------- highlight panel ---------------- */

  function flyerHTML(H) {
    var d = H.date ? parse(H.date) : null;
    // Real flier image if present; otherwise a typographic flier built from the data.
    return '<figure class="flyer">' +
      (H.flyer && H.flyer.src ? '<img src="' + esc(H.flyer.src) + '" alt="' + esc(H.flyer.alt || H.title) + '" onerror="this.remove()">' : "") +
      '<div class="flyer-made" style="--pc:var(--c-' + esc(H.pillar) + ')">' +
      '<span class="mono flyer-top">' + esc(C_NAME) + " presents</span>" +
      '<span class="flyer-title">' + esc(H.title) + "</span>" +
      '<span class="flyer-sub">' + esc(H.subtitle) + "</span>" +
      '<span class="flyer-date"><b>' + (d ? d.getDate() : "") + '</b><span class="mono">' + (d ? MONTHS[d.getMonth()].slice(0, 3) + " · " + DOW[d.getDay()] : "") + "<br>" + esc(H.time || "") + "</span></span>" +
      '<span class="mono flyer-where">' + esc(H.where || "") + "</span>" +
      "</div></figure>";
  }
  var C_NAME = "";

  function highlightPanel(C) {
    var H = C.highlight, d = H.date ? parse(H.date) : null;
    var rows = [["When", (d ? longDate(d) : "") + (H.time ? " · " + H.time : "")], ["Where", H.where], ["Format", H.format], ["Cost", H.cost], ["Space", H.spots]]
      .filter(function (r) { return r[1]; });
    return '<div class="split">' +
      '<div class="split-left">' + flyerHTML(H) + "</div>" +
      '<div class="split-right">' +
      '<p class="mono panel-kicker" style="color:var(--t-' + esc(H.pillar) + ')">' + esc(H.kicker) + (H.sample ? ' <span class="chip chip-ghost">Sample details</span>' : "") + "</p>" +
      '<h3 class="panel-title">' + esc(H.title) + "</h3>" +
      '<p class="panel-sub">' + esc(H.subtitle) + "</p>" +
      '<dl class="facts">' + rows.map(function (r) { return "<div><dt class=\"mono\">" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("") + "</dl>" +
      (H.description || []).map(function (p) { return '<p class="prose">' + esc(p) + "</p>"; }).join("") +
      '<div class="panel-actions">' +
      (H.rsvp && H.rsvp.enabled
        ? '<button type="button" class="btn" id="rsvp-open" aria-expanded="false" aria-controls="rsvp">' + esc(H.cta ? H.cta.label : "Save a seat") + "</button>"
        : (H.cta ? link(H.cta.url, esc(H.cta.label), "btn panel-cta") : "")) +
      (H.secondary ? link(H.secondary.url, esc(H.secondary.label) + ' <span aria-hidden="true">↗</span>', "textlink") : "") +
      "</div>" + (H.rsvp && H.rsvp.enabled ? rsvpHTML(H) : "") + "</div></div>";
  }

  /* ---------------- save-a-seat form ---------------- */
  function rsvpHTML(H) {
    var R = H.rsvp, people = "";
    for (var i = 1; i <= (R.maxPeople || 6); i++) people += "<option>" + i + "</option>";
    return '<form class="rsvp" id="rsvp" hidden novalidate>' +
      '<p class="mono panel-kicker">' + esc(R.heading || "Save a seat") + "</p>" +
      '<p class="rsvp-intro">' + esc(R.intro || "") + "</p>" +
      '<div class="rsvp-grid">' +
      '<div class="field-row"><label for="rs-name">Name</label><input id="rs-name" name="Name" autocomplete="name" required></div>' +
      '<div class="field-row"><label for="rs-email">Email</label><input id="rs-email" name="email" type="email" autocomplete="email" required></div>' +
      (R.askPhone ? '<div class="field-row"><label for="rs-phone">Phone <span class="opt">(optional)</span></label><input id="rs-phone" name="Phone" type="tel" autocomplete="tel"></div>' : "") +
      '<div class="field-row"><label for="rs-age">Age <span class="opt">(optional)</span></label><select id="rs-age" name="Age range"><option value="">Choose…</option>' +
      (R.ageRanges || []).map(function (a) { return "<option>" + esc(a) + "</option>"; }).join("") + "</select></div>" +
      '<div class="field-row"><label for="rs-people">People</label><select id="rs-people" name="People">' + people + "</select></div>" +
      '<div class="field-row"><label for="rs-ticket">Ticket</label><select id="rs-ticket" name="Ticket">' +
      (R.tickets || []).map(function (t) { return "<option>" + esc(t) + "</option>"; }).join("") + "</select></div>" +
      '<div class="field-row wide"><label for="rs-notes">Anything Hannah should know? <span class="opt">(optional)</span></label><textarea id="rs-notes" name="Notes" rows="3" placeholder="Access needs, questions, who you\'re bringing"></textarea></div>' +
      "</div>" +
      '<label class="check"><input type="checkbox" id="rs-updates" name="Email updates" value="Yes"> Email me about future circles</label>' +
      '<input type="text" name="_honey" class="sr" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<div class="panel-actions"><button type="submit" class="btn">Send my sign-up</button><button type="button" class="textlink rsvp-cancel">Cancel</button></div>' +
      '<p class="form-status" id="rsvp-status" role="status" aria-live="polite"></p>' +
      "</form>";
  }

  function wireRsvp(C, root) {
    var H = C.highlight, R = H.rsvp, form = root.querySelector("#rsvp"), btn = root.querySelector("#rsvp-open");
    if (!form || !btn) return;
    var status = root.querySelector("#rsvp-status");
    function toggle(open) {
      form.hidden = !open; btn.setAttribute("aria-expanded", String(open));
      if (open) { root.querySelector("#rs-name").focus(); form.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
    }
    btn.addEventListener("click", function () { toggle(form.hidden); });
    form.querySelector(".rsvp-cancel").addEventListener("click", function () { toggle(false); btn.focus(); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        status.textContent = "Please add your name and a valid email."; status.dataset.tone = "warn";
        form.querySelector(":invalid").focus(); return;
      }
      var d = H.date ? parse(H.date) : null, when = (d ? longDate(d) : "") + (H.time ? " · " + H.time : "");
      var name = form.elements["Name"].value.trim(), people = form.elements["People"].value;
      var fd = new FormData(form);
      // what Hannah sees in her inbox
      fd.set("_subject", "New sign-up: " + H.title + " · " + name + (people > 1 ? " (+" + (people - 1) + ")" : ""));
      fd.set("_template", "table");
      fd.set("_autoresponse", (R.confirmation || "").replace("{title}", H.title).replace("{date}", when));
      fd.set("Event", H.title);
      fd.set("When", when);
      fd.set("Where", H.where || "");
      if (!fd.get("Email updates")) fd.set("Email updates", "No");
      var endpoint = C.contact && C.contact.endpoint;
      if (!endpoint) { status.textContent = "Sign-ups aren't connected yet. Please use the contact form below."; status.dataset.tone = "warn"; return; }
      status.textContent = "Sending…"; status.dataset.tone = "info";
      fetch(endpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
        .then(function (r) { if (!r.ok) throw new Error(); return r; })
        .then(function () {
          form.innerHTML = '<div class="rsvp-done"><p class="mono panel-kicker" style="color:var(--t-spark)">You\'re on the list</p>' +
            '<p class="panel-sub">Thank you, ' + esc(name.split(/\s+/)[0]) + ". " + (people > 1 ? people + " seats are" : "Your seat is") + " saved for " + esc(H.title) + ".</p>" +
            '<p class="prose">A confirmation is on its way to your inbox. Hannah will follow up with the details.</p></div>';
          btn.hidden = true;
        })
        .catch(function () {
          status.textContent = "That didn't go through. Check your connection and try again, or use the contact form below.";
          status.dataset.tone = "warn";
        });
    });
  }

  /* ---------------- give panel ---------------- */
  function donatePanel(C) {
    var D = C.donate || {}, cur = D.currency || "$";
    var amounts = D.amounts || [10, 25, 50, 100];
    return '<div class="split">' +
      '<div class="split-left">' +
      '<figure class="flyer give-poster"><div class="flyer-made give-made">' +
      '<span class="mono flyer-top">Arts & education for social change</span>' +
      (D.logo && D.logo.src
        ? '<span class="logo-mask poster-logo" role="img" aria-label="' + esc(D.logo.alt || D.name) + '" style="--logo:url(\'' + esc(D.logo.src) + '\')"></span>'
        : '<span class="give-big">44<i>.</i>4</span>') +
      '<span class="flyer-title">' + esc(D.name || "") + "</span>" +
      '<span class="give-staff" aria-hidden="true"></span>' +
      '<span class="mono flyer-where">with ' + esc(C.name) + "</span>" +
      "</div></figure></div>" +
      '<div class="split-right">' +
      '<p class="mono panel-kicker" style="color:var(--t-movement)">Give</p>' +
      '<h3 class="panel-title">' + esc(D.name || "") + "</h3>" +
      '<p class="panel-sub">' + esc(D.tagline || "") + "</p>" +
      (D.description || []).map(function (p) { return '<p class="prose">' + esc(p) + "</p>"; }).join("") +
      '<ol class="give-ways">' +
      // 1. give directly
      '<li class="give-way"><p class="mono give-step">1 · Give directly</p>' +
      '<div class="give-freq" role="group" aria-label="How often"><button type="button" class="pick" data-freq="once" aria-pressed="true">One time</button><button type="button" class="pick" data-freq="monthly" aria-pressed="false">Monthly</button></div>' +
      '<div class="give-amounts" role="group" aria-label="Amount">' + amounts.map(function (a, i) {
        return '<button type="button" class="pick amt" data-amt="' + a + '" aria-pressed="' + (i === 1) + '">' + esc(cur) + a + "</button>";
      }).join("") +
      '<label class="give-other"><span class="sr">Other amount</span><span aria-hidden="true">' + esc(cur) + '</span><input id="give-other" inputmode="decimal" placeholder="Other"></label></div>' +
      '<div class="panel-actions"><a class="btn" id="give-go" target="_blank" rel="noopener" href="#">Give</a>' +
      '<span class="give-note mono" id="give-note"></span></div></li>' +
      // 2. visit the page
      '<li class="give-way"><p class="mono give-step">2 · Visit the page</p>' +
      link(D.pageUrl || "#", esc(D.pageLabel || "Visit the page") + ' <span aria-hidden="true">↗</span>', "textlink") + "</li>" +
      // 3. ask Hannah
      '<li class="give-way"><p class="mono give-step">3 · Questions about giving?</p>' +
      '<button type="button" class="btn btn-ghost" id="give-ask">Ask Hannah in the chat</button></li>' +
      "</ol></div></div>";
  }

  function wireDonate(C, root) {
    var D = C.donate || {}, cur = D.currency || "$";
    var freq = "once", amt = (D.amounts || [10, 25])[1] || 25;
    var go = root.querySelector("#give-go"), note = root.querySelector("#give-note"), other = root.querySelector("#give-other");
    function update() {
      var direct = D.directUrl && D.directUrl.length;
      go.textContent = "Give " + cur + amt + (freq === "monthly" ? " monthly" : "");
      go.href = direct ? D.directUrl.replace("{amount}", encodeURIComponent(amt)) : (D.pageUrl || "#");
      note.textContent = direct ? "" : (freq === "monthly" ? "Monthly giving is set up on Patreon" : "Opens the Team44point4 page to complete your gift");
    }
    root.addEventListener("click", function (e) {
      var f = e.target.closest("[data-freq]"), a = e.target.closest("[data-amt]");
      if (f) { freq = f.dataset.freq; root.querySelectorAll("[data-freq]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === f)); }); update(); }
      if (a) { amt = +a.dataset.amt; other.value = ""; root.querySelectorAll("[data-amt]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === a)); }); update(); }
    });
    other.addEventListener("input", function () {
      var v = parseFloat(other.value.replace(/[^0-9.]/g, ""));
      if (v > 0) { amt = Math.round(v * 100) / 100; root.querySelectorAll("[data-amt]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); }); update(); }
    });
    root.querySelector("#give-ask").addEventListener("click", function () {
      if (window.HLMChatInstance) { window.HLMChatInstance.openWith("donate"); return; }
      // embedded (no chat): fall back to the contact form with the topic set
      var sel = document.getElementById("cf-topic"); if (sel) sel.value = "Donating";
      var c = document.getElementById("connect"); if (c) c.scrollIntoView({ behavior: "smooth" });
      setTimeout(function () { var n = document.getElementById("cf-name"); if (n) n.focus({ preventScroll: true }); }, 600);
    });
    update();
  }

  /* ---------------- calendar panel ---------------- */

  function calendarPanel(C) {
    var L = C.calendar.legend || [];
    return '<div class="split">' +
      '<div class="split-left cal">' +
      '<ul class="legend" aria-label="Legend">' + L.map(function (l) {
        return '<li><span class="swatch" style="--dc:var(--c-' + esc(l.pillar) + ')" aria-hidden="true"></span>' + esc(l.label) + "</li>";
      }).join("") + '<li><span class="swatch swatch-today" aria-hidden="true"></span>Today</li></ul>' +
      '<div class="cal-head"><button type="button" class="car-btn cal-nav" data-step="-1" aria-label="Previous month">←</button>' +
      '<p class="cal-title" id="cal-title" aria-live="polite"></p>' +
      '<button type="button" class="car-btn cal-nav" data-step="1" aria-label="Next month">→</button></div>' +
      '<div class="cal-grid" role="grid" aria-labelledby="cal-title">' +
      DOW.map(function (d) { return '<span class="mono dow" role="columnheader">' + d.slice(0, 2) + "</span>"; }).join("") +
      '<div class="cal-days" id="cal-days"></div></div>' +
      '<div class="day-state" id="day-state" aria-live="polite"></div>' +
      "</div>" +
      '<div class="split-right">' +
      '<p class="mono panel-kicker">Coming up' + (C.calendar.sample ? ' <span class="chip chip-ghost">Sample dates</span>' : "") + "</p>" +
      '<h3 class="panel-title">What\'s next with Hannah</h3>' +
      '<ol class="agenda" id="agenda"></ol>' +
      '<div class="panel-actions"><a class="btn" href="#connect">Ask about a date</a></div>' +
      "</div></div>";
  }

  function wireCalendar(C, root) {
    var events = (C.calendar.events || []).map(function (e) { return Object.assign({ d: parse(e.date) }, e); });
    var byDay = {};
    events.forEach(function (e) { (byDay[e.date] = byDay[e.date] || []).push(e); });
    var t = today(), view = new Date(t.getFullYear(), t.getMonth(), 1), selected = key(t);
    var nextUp = upcoming(C, 1)[0];
    if (nextUp && !byDay[selected]) selected = nextUp.date, view = new Date(nextUp.d.getFullYear(), nextUp.d.getMonth(), 1);

    function evLine(e) {
      return '<li style="--dc:var(--c-' + esc(e.pillar) + ')"><span class="ev-bar" aria-hidden="true"></span><span class="ev-text"><span class="ev-title">' + esc(e.title) + (e.highlight ? ' <span class="chip">Highlight</span>' : "") +
        '</span><span class="mono ev-meta">' + esc(e.time) + " · " + esc(e.where) + " · " + esc(e.format) + "</span></span></li>";
    }
    function renderState() {
      var d = parse(selected), list = byDay[selected] || [];
      root.querySelector("#day-state").innerHTML =
        '<p class="mono state-date">' + esc(longDate(d)) + (key(t) === selected ? " · Today" : "") + "</p>" +
        (list.length ? '<ul class="state-list">' + list.map(evLine).join("") + "</ul>"
          : '<p class="state-empty">Open day. Nothing scheduled.</p>');
    }
    function renderMonth() {
      root.querySelector("#cal-title").textContent = MONTHS[view.getMonth()] + " " + view.getFullYear();
      var first = view.getDay(), days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate(), html = "";
      for (var i = 0; i < first; i++) html += '<span class="day pad" aria-hidden="true"></span>';
      for (var d = 1; d <= days; d++) {
        var dt = new Date(view.getFullYear(), view.getMonth(), d), k = key(dt), list = byDay[k] || [];
        var label = longDate(dt) + (list.length ? ", " + list.length + (list.length > 1 ? " events" : " event") : ", no events");
        html += '<button type="button" class="day' + (k === key(t) ? " is-today" : "") + (k === selected ? " is-selected" : "") + (dt < t ? " is-past" : "") + (list.some(function (e) { return e.highlight; }) ? " is-highlight" : "") +
          '" data-date="' + k + '" aria-label="' + esc(label) + '" aria-pressed="' + (k === selected) + '">' +
          '<span class="num">' + d + "</span>" +
          '<span class="dots">' + list.slice(0, 3).map(function (e) { return '<i style="--dc:var(--c-' + esc(e.pillar) + ')"></i>'; }).join("") + "</span></button>";
      }
      root.querySelector("#cal-days").innerHTML = html;
    }
    function renderAgenda() {
      root.querySelector("#agenda").innerHTML = upcoming(C, 6).map(function (e) {
        return '<li><button type="button" class="agenda-item" data-date="' + e.date + '" style="--dc:var(--c-' + esc(e.pillar) + ')">' +
          '<span class="ag-date"><b>' + e.d.getDate() + '</b><span class="mono">' + MONTHS[e.d.getMonth()].slice(0, 3) + "</span></span>" +
          '<span class="ev-text"><span class="ev-title">' + esc(e.title) + (e.highlight ? ' <span class="chip">Highlight</span>' : "") + '</span><span class="mono ev-meta">' +
          esc(DOW[e.d.getDay()]) + " · " + esc(e.time) + " · " + esc(e.format) + "</span></span></button></li>";
      }).join("") || '<li class="state-empty">Nothing coming up yet.</li>';
    }
    function select(k) {
      selected = k;
      var d = parse(k);
      if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) view = new Date(d.getFullYear(), d.getMonth(), 1);
      renderMonth(); renderState();
    }
    root.addEventListener("click", function (e) {
      var nav = e.target.closest(".cal-nav");
      if (nav) { view = new Date(view.getFullYear(), view.getMonth() + (+nav.dataset.step), 1); renderMonth(); return; }
      var day = e.target.closest(".day[data-date], .agenda-item");
      if (day) {
        select(day.dataset.date);
        if (day.classList.contains("agenda-item")) { var b = root.querySelector('.day[data-date="' + day.dataset.date + '"]'); if (b) b.focus(); }
      }
    });
    root.addEventListener("keydown", function (e) { // arrow keys move between days
      var cur = e.target.closest(".day[data-date]"); if (!cur) return;
      var step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key]; if (!step) return;
      e.preventDefault();
      var d = parse(cur.dataset.date); d.setDate(d.getDate() + step);
      select(key(d));
      var b = root.querySelector('.day[data-date="' + key(d) + '"]'); if (b) b.focus();
    });
    renderMonth(); renderState(); renderAgenda();
  }

  /* ---------------- drawer ---------------- */

  function init(C, opts) {
    C_NAME = C.name;
    opts = opts || {};
    var drawer = document.getElementById("drawer"), inner = document.getElementById("drawer-inner"), open = null;
    function setCards() {
      document.querySelectorAll(".slide-card").forEach(function (c) {
        var on = c.dataset.panel === open;
        c.setAttribute("aria-expanded", String(on));
        c.classList.toggle("is-open", on);
      });
    }
    function close() {
      open = null; drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); setCards();
      if (opts.onToggle) opts.onToggle(false);
    }
    function show(which) {
      if (open === which) { close(); return; }
      open = which;
      inner.innerHTML = '<div class="drawer-bar"><p class="mono">' + (which === "calendar" ? "Calendar" : which === "omni" ? '<span class="glyph">⟐</span>mniReality' : which === "donate" ? "Give" : "Highlight") + "</p>" +
        '<button type="button" class="drawer-close mono" aria-label="Close panel">Close ✕</button></div>' +
        (which === "calendar" ? calendarPanel(C) : which === "donate" ? donatePanel(C) : which === "omni" ? (window.Omni ? window.Omni.panelHTML(C) : "") : highlightPanel(C));
      if (which === "calendar") wireCalendar(C, inner);
      else if (which === "donate") wireDonate(C, inner);
      else if (which === "omni") { if (window.Omni) requestAnimationFrame(function () { window.Omni.init(C, { root: inner, timed: true }); }); }
      else wireRsvp(C, inner);
      inner.querySelector(".drawer-close").addEventListener("click", function () {
        var btn = document.querySelector('.slide-card[data-panel="' + open + '"]'); close(); if (btn) btn.focus();
      });
      var cta = inner.querySelector(".panel-cta");
      if (cta && C.highlight.cta && C.highlight.cta.topic) cta.addEventListener("click", function () {
        var sel = document.getElementById("cf-topic"); if (sel) sel.value = C.highlight.cta.topic;
      });
      drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); setCards();
      if (opts.onToggle) opts.onToggle(true);
      setTimeout(function () {
        var r = drawer.getBoundingClientRect();
        if (r.top > window.innerHeight * 0.7) window.scrollBy({ top: r.top - window.innerHeight * 0.35, behavior: "smooth" });
      }, 80);
    }
    document.addEventListener("click", function (e) {
      var c = e.target.closest(".slide-card"); if (c) show(c.dataset.panel);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) close(); });
  }

  window.Panels = { card: card, drawerHTML: drawerHTML, init: init };
})();
