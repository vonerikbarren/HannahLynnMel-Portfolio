/*
 * Chat: front-end only for now.
 * - Visible only when the site is viewed on its own (not inside an iframe,
 *   not in ?mode=omni). OmniReality has its own OmniFeed chat.
 * - Replies come from the client object, in Hannah's voice.
 * - "Leave a message" hands off to Hannah through a pluggable transport.
 *
 * Transport contract (swap for live messaging later, see
 * admin/dev/futureUpdatesForFullStack):
 *   window.HLMChatTransport = { send: function (msg) { return Promise } }
 *   msg = { name, email, message, topic, transcript: [{from, text, at}], page }
 */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function parse(d) { var p = d.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }

  /* ---------- default transport: POST to a form endpoint ---------- */
  function formTransport(endpoint) {
    return {
      live: false,
      send: function (msg) {
        if (!endpoint) return Promise.reject(new Error("not-connected"));
        var fd = new FormData();
        fd.append("_subject", (msg.topic && msg.topic !== "Chat" ? msg.topic + " question from " : "Chat message from ") + msg.name + " (Hannah Lynn Mell site)");
        fd.append("_template", "table");
        fd.append("name", msg.name); fd.append("email", msg.email);
        fd.append("topic", msg.topic || "Chat"); fd.append("message", msg.message);
        fd.append("transcript", msg.transcript.map(function (t) { return t.from + ": " + t.text; }).join("\n"));
        return fetch(endpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
          .then(function (r) { if (!r.ok) throw new Error("failed"); return true; });
      }
    };
  }

  /* ---------- intents ---------- */
  var INTENTS = [
    ["crisis", /\b(suicid\w*|kill (my ?self|me)|end (it|my life)|hurt (my ?self)|self[- ]?harm|overdos\w*|want to die|in crisis|emergency)\b/],
    ["donate", /\b(donat\w*|give|giving|gift|support (you|hannah|the team)|patreon|team ?44|total resonance|fund\w*|sponsor\w*)\b/],
    ["handoff", /\b(message|contact|reach|email|book|booking|appointment|schedule a|talk to (you|hannah)|get in touch|leave (a )?(note|message)|hire|work with)\b/],
    ["highlight", /\b(collage|soul|highlight|featured|workshop)\b/],
    ["events", /\b(event|events|calendar|coming up|upcoming|what'?s on|when|next|this week|class(es)?|dates?)\b/],
    ["music", /\b(music|lesson|lessons|piano|guitar|sing|singing|voice|song|songs|compos\w*|instrument)\b/],
    ["movement", /\b(yoga|zumba|ballroom|danc\w*|qi ?gong|movement|exercise|stretch\w*|breath\w*)\b/],
    ["healing", /\b(chaplain\w*|spiritual|faith|pray\w*|emdr|therap\w*|heal\w*|somatic|coach\w*|grief|anxiety|trauma|support)\b/],
    ["writing", /\b(muse|substack|writ\w*|blog|newsletter|podcast|essay\w*)\b/],
    ["media", /\b(youtube|video|videos|spotify|playlist|instagram|facebook|social|patreon)\b/],
    ["price", /\b(cost|price|prices|rate|rates|fee|fees|pay|sliding|how much|free)\b/],
    ["location", /\b(where|boston|remote|online|zoom|location|in person|near)\b/],
    ["about", /\b(who are you|about you|about hannah|background|yourself|tell me about)\b/],
    ["thanks", /\b(thanks|thank you|bye|goodbye|take care)\b/],
    ["hello", /^\s*(hi|hey|hello|hiya|good (morning|afternoon|evening))\b/]
  ];
  function intentOf(text) {
    var t = text.toLowerCase();
    for (var i = 0; i < INTENTS.length; i++) if (INTENTS[i][1].test(t)) return INTENTS[i][0];
    return "fallback";
  }

  function mount(C, opts) {
    opts = opts || {};
    var cfg = C.chat || {};
    var R = cfg.replies || {};
    var transport = window.HLMChatTransport || formTransport(cfg.endpoint || (C.contact && C.contact.endpoint));
    var transcript = [], flow = null, lastQuestion = "";

    var root = document.createElement("aside");
    root.className = "chat";
    root.setAttribute("aria-label", cfg.title || "Chat");
    root.innerHTML =
      '<button type="button" class="chat-launch" aria-expanded="false" aria-controls="chat-panel">' +
      '<span class="chat-face"><img src="' + esc((C.images && C.images.avatar && C.images.avatar.src) || "") + '" alt=""></span>' +
      '<span class="chat-launch-text">Chat with Hannah</span></button>' +
      '<section class="chat-panel" id="chat-panel" hidden>' +
      '<header class="chat-head"><span class="chat-face"><img src="' + esc((C.images && C.images.avatar && C.images.avatar.src) || "") + '" alt=""></span>' +
      '<span class="chat-id"><b>' + esc(cfg.title || "Chat") + '</b><span class="mono">' + esc(cfg.status || "") + "</span></span>" +
      '<button type="button" class="chat-x mono" aria-label="Close chat">✕</button></header>' +
      '<ol class="chat-log" id="chat-log" aria-live="polite"></ol>' +
      '<div class="chat-quick" id="chat-quick"></div>' +
      '<form class="chat-form" id="chat-form" autocomplete="off">' +
      '<label class="sr" for="chat-input">Message</label>' +
      '<input id="chat-input" name="chat-input" placeholder="Ask me anything…" maxlength="800">' +
      '<button type="submit" class="chat-send" aria-label="Send">↑</button></form>' +
      "</section>";
    document.body.appendChild(root);

    var launch = root.querySelector(".chat-launch"), panel = root.querySelector(".chat-panel");
    var log = root.querySelector("#chat-log"), quick = root.querySelector("#chat-quick");
    var form = root.querySelector("#chat-form"), input = root.querySelector("#chat-input");

    function save() { try { sessionStorage.setItem("hlm-chat", JSON.stringify(transcript)); } catch (e) {} }
    function scroll() { log.scrollTop = log.scrollHeight; }

    function add(from, html, text, actions) {
      var li = document.createElement("li");
      li.className = "msg msg-" + from;
      li.innerHTML = '<div class="bubble">' + html + "</div>" +
        (actions && actions.length ? '<div class="msg-actions">' + actions.map(function (a, i) {
          return a.url ? '<a class="chip-btn" href="' + esc(a.url) + '"' + (/^https?:/.test(a.url) ? ' target="_blank" rel="noopener"' : "") + ">" + esc(a.label) + "</a>"
            : '<button type="button" class="chip-btn" data-act="' + i + '">' + esc(a.label) + "</button>";
        }).join("") + "</div>" : "");
      (actions || []).forEach(function (a, i) {
        if (a.run) { var b = li.querySelector('[data-act="' + i + '"]'); if (b) b.addEventListener("click", a.run); }
      });
      log.appendChild(li);
      transcript.push({ from: from === "me" ? "visitor" : "hannah", text: text || li.textContent, at: new Date().toISOString() });
      save(); scroll();
    }
    function say(text, actions) {
      var typing = document.createElement("li");
      typing.className = "msg msg-hannah typing"; typing.innerHTML = '<div class="bubble"><i></i><i></i><i></i></div>';
      log.appendChild(typing); scroll();
      setTimeout(function () { typing.remove(); add("hannah", esc(text).replace(/\n/g, "<br>"), text, actions); }, Math.min(1400, 350 + text.length * 6));
    }
    function setQuick(list) {
      quick.innerHTML = (list || []).map(function (q) { return '<button type="button" class="chip-btn">' + esc(q) + "</button>"; }).join("");
    }

    /* ---- actions that reach into the page ---- */
    function openPanel(which) {
      var card = document.querySelector('.slide-card[data-panel="' + which + '"]');
      if (!card) return;
      if (window.HLMShelf) window.HLMShelf.openFor(card);
      if (card.getAttribute("aria-expanded") !== "true") card.click();
      setTimeout(function () { document.getElementById("drawer").scrollIntoView({ behavior: "smooth", block: "start" }); }, 150);
    }
    function upcoming(n) {
      var t = new Date(); t.setHours(0, 0, 0, 0);
      return ((C.calendar && C.calendar.events) || []).map(function (e) { return Object.assign({ d: parse(e.date) }, e); })
        .filter(function (e) { return e.d >= t; }).sort(function (a, b) { return a.d - b.d; }).slice(0, n);
    }
    var leaveMsg = { label: "Leave Hannah a message", run: function () { startHandoff(); } };

    function answer(kind, text) {
      var P = {}; (C.pillars || []).forEach(function (p) { P[p.id] = p; });
      switch (kind) {
        case "crisis":
          say(R.crisis, [{ label: "988 Lifeline", url: "https://988lifeline.org/" }]);
          setQuick([]); return;
        case "handoff": startHandoff(); return;
        case "donate":
          say(R.donate || R.fallback, [
            { label: "Ask about giving", run: function () { startHandoff("Donating"); } },
            { label: "Visit the page", url: (C.donate && C.donate.pageUrl) || (C.support && C.support.url) || "#connect" }]);
          return;
        case "hello": say("Hi there. Ask me about lessons, movement, healing spaces, what's coming up, or anything else.", []); setQuick(cfg.quick); return;
        case "events":
          var up = upcoming(3);
          say(up.length ? "Here's what's coming up:\n" + up.map(function (e) {
            return "• " + e.d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) + ", " + e.time + ": " + e.title;
          }).join("\n") : "Nothing is on the calendar just yet. Leave me a note and I'll let you know when there is.",
            [{ label: "Open the calendar", run: function () { openPanel("calendar"); } }, leaveMsg]);
          return;
        case "highlight":
          var H = C.highlight || {};
          say(H.title ? "The one I'm most excited about: " + H.title + ". " + (H.subtitle || "") + (H.date ? " " + parse(H.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) + (H.time ? ", " + H.time : "") + "." : "") : R.fallback,
            [{ label: "See the details", run: function () { openPanel("highlight"); } }, leaveMsg]);
          return;
        case "music": case "movement": case "healing": case "writing":
          var links = ((P[kind] && P[kind].links) || []).map(function (l) { return { label: l.label, url: l.url }; });
          say(R[kind], links.concat([leaveMsg])); return;
        case "media":
          say(R.media, (C.links || []).filter(function (l) { return /YouTube|Spotify|Instagram|Facebook/.test(l.label); }).map(function (l) { return { label: l.label, url: l.url }; }));
          return;
        case "about": say(R.about, [{ label: "Read more", run: function () { document.getElementById("about").scrollIntoView({ behavior: "smooth" }); } }]); return;
        case "location": say(R.location, [leaveMsg]); return;
        case "price": say(R.price, [leaveMsg]); return;
        case "thanks": say(R.thanks); return;
        default: say(R.fallback, [leaveMsg]);
      }
    }

    /* ---- hand-off: collect name, email, message; send to Hannah ---- */
    function startHandoff(topic) {
      flow = { step: "name", data: { message: lastQuestion, topic: topic || "Chat" } };
      setQuick([]);
      say("I'd love to hear from you. What's your name?");
      input.placeholder = "Your name";
    }
    function continueHandoff(text) {
      var d = flow.data;
      if (flow.step === "name") {
        d.name = text; flow.step = "email"; input.placeholder = "you@example.com"; input.type = "email";
        say("Thanks, " + text.split(/\s+/)[0] + ". What's the best email to reach you?");
      } else if (flow.step === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) { say("That email doesn't look quite right. Could you check it?"); return; }
        d.email = text; flow.step = "message"; input.type = "text"; input.placeholder = "Your message";
        say(d.message ? "And your message? I have \"" + d.message + "\" so far. Send it as is, or type more." : "And what would you like to say?",
          d.message ? [{ label: "Send as is", run: function () { if (flow && flow.step === "message") handle(d.message); } }] : []);
      } else if (flow.step === "message") {
        d.message = text; flow = null; input.placeholder = "Ask me anything…";
        var msg = { name: d.name, email: d.email, message: d.message, topic: d.topic || "Chat", transcript: transcript.slice(), page: location.href };
        transport.send(msg).then(function () {
          say("Sent. Thank you, " + d.name.split(/\s+/)[0] + ". I'll write back to " + d.email + " soon.");
        }).catch(function (err) {
          if (err && err.message === "not-connected") {
            say("Messages from this chat aren't connected to my inbox yet, so please reach me through my Linktree for now. I'm sorry for the extra step.",
              [{ label: "Open Linktree", url: (C.links || []).filter(function (l) { return l.label === "Linktree"; }).map(function (l) { return l.url; })[0] || "#connect" }]);
          } else {
            say("That didn't go through. Check your connection and try again, or use the contact form below.", [{ label: "Go to the form", url: "#connect" }]);
          }
        });
        setQuick(cfg.quick);
      }
    }

    function handle(text) {
      text = text.trim(); if (!text) return;
      add("me", esc(text), text);
      if (flow) { continueHandoff(text); return; }
      if (text === (cfg.quick || [])[3]) { startHandoff(); return; }
      if (text === (cfg.quick || [])[2]) { answer("about"); return; }
      if (text === (cfg.quick || [])[1]) { say("Happy to help. Which are you curious about?", [
        { label: "Music lessons", run: function () { handle("Music lessons"); } },
        { label: "Movement", run: function () { handle("Movement classes"); } },
        { label: "Healing & coaching", run: function () { handle("Healing and somatic coaching"); } }]); return; }
      lastQuestion = text;
      answer(intentOf(text), text);
    }

    form.addEventListener("submit", function (e) { e.preventDefault(); var v = input.value; input.value = ""; handle(v); });
    quick.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) handle(b.textContent); });

    var started = false;
    function openChat(open) {
      panel.hidden = !open;
      launch.setAttribute("aria-expanded", String(open));
      root.classList.toggle("open", open);
      if (open && !started) {
        started = true;
        var prior = null;
        try { prior = JSON.parse(sessionStorage.getItem("hlm-chat") || "null"); } catch (e) {}
        if (prior && prior.length) {
          prior.forEach(function (m) { var li = document.createElement("li"); li.className = "msg msg-" + (m.from === "visitor" ? "me" : "hannah"); li.innerHTML = '<div class="bubble">' + esc(m.text).replace(/\n/g, "<br>") + "</div>"; log.appendChild(li); });
          transcript = prior; scroll();
        } else {
          say(cfg.greeting);
        }
        setQuick(cfg.quick);
      }
      if (open) setTimeout(function () { input.focus(); }, 60);
    }
    launch.addEventListener("click", function () { openChat(panel.hidden); });
    root.querySelector(".chat-x").addEventListener("click", function () { openChat(false); launch.focus(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden && root.contains(document.activeElement)) { openChat(false); launch.focus(); } });
    var api = {
      open: function () { openChat(true); },
      /* open the chat straight into a flow, e.g. openWith("donate") */
      openWith: function (kind) {
        openChat(true);
        setTimeout(function () { setQuick([]); answer(kind); }, started ? 50 : 900);
      }
    };
    window.HLMChatInstance = api;
    return api;
  }

  /* Standalone only: not in an iframe, not in OmniReality mode. */
  function isStandalone(mode) {
    var framed = true;
    try { framed = window.self !== window.top; } catch (e) { framed = true; }
    return !framed && mode !== "omni";
  }

  window.HLMChat = { mount: mount, isStandalone: isStandalone, formTransport: formTransport };
})();
