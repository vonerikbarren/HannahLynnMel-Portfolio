# Future updates for full stack

Planning notes for moving the site from front-end only to a full-stack build.
Nothing in this folder is loaded by the site.

## 1. Chat → live messages to Hannah

### Where it stands (front end only)

- `assets/js/chat.js` shows a chat launcher **only when the site is viewed on its own**
  (not inside an iframe, not with `?mode=omni`). In OmniReality the OmniFeed chat
  takes over, and it is a separate system.
- Replies are automatic, written in Hannah's voice, from `client.js → chat.replies`
  plus the live calendar and highlight data. The header says "Automatic replies · your
  messages reach me directly" so visitors know replies are automated.
- "Leave Hannah a message" collects name, email and message, then calls the **transport**.
- The default transport POSTs to `chat.endpoint` (or `contact.endpoint`) as form data.
  With neither set, the chat tells the visitor it isn't connected and points to Linktree.
- Crisis language gets a fixed safety reply with 988 / 911 and never goes to automation.

### The swap point

Anything that implements this contract can replace the default:

```js
window.HLMChatTransport = {
  live: true,                         // true = real-time conversation
  send(msg) { return Promise },       // msg: { name, email, message, topic, transcript[], page }
  // for live mode, add:
  subscribe(conversationId, onMessage) {},   // Hannah's replies stream back in
  typing(conversationId, isTyping) {}
};
```

Define it **before** `chat.js` loads (or before `HLMChat.mount`), and the UI keeps working unchanged.

### Recommended path

| Step | What | Notes |
|---|---|---|
| 1 | Form endpoint (now) | Formspree / Basin / Netlify Forms. Messages land in Hannah's inbox with the transcript. No code. |
| 2 | Hosted live chat | Crisp, Tawk.to or Chatwoot. Hannah answers from a phone app. Write a thin transport that forwards to their JS SDK, and keep our UI. |
| 3 | Own backend | Supabase (Postgres + Realtime + Auth) or Firebase. See the data model below. Hannah gets a small `/admin` inbox (PWA) with push notifications. |

### Data model (step 3)

```
conversations: id, created_at, visitor_name, visitor_email, status (open|waiting|closed), source (site|omni), last_message_at
messages:      id, conversation_id, from (visitor|hannah|auto), body, created_at, read_at
```

- The visitor keeps a `conversation_id` in `localStorage` so they can come back to the same thread.
- Hannah's replies arrive over Realtime and are rendered as `msg-hannah` bubbles; auto replies are flagged `from: auto`.
- When Hannah is offline, send an email digest of new conversations. When she is online, send a push notification.

### Voice and honesty

- The chat speaks as Hannah. While replies are automatic, keep the header note saying so.
- Once Hannah answers live, label her real replies ("Hannah · live") and keep automatic ones labelled.

### Safety, privacy

- Hannah works in chaplaincy and EMDR-informed support, so the chat must **not** invite health details.
  Add a line near the input ("Please don't share medical details here") once it goes live.
- Keep the crisis intercept server-side as well as client-side, and never auto-reply to crisis messages with anything but resources.
- Rate-limit by IP and add hCaptcha / Turnstile on the first message to stop spam.
- Retention: auto-delete closed conversations after N days (her call), and allow export on request.
- Privacy page: what's stored, for how long, who sees it.

## 2. Calendar + highlight from a CMS

The data lives in `client.js → calendar.events` and `highlight` today.

- Move both to a table (Supabase) or a Google Calendar feed. The calendar panel already renders from plain objects
  `{ date: "YYYY-MM-DD", time, title, pillar, where, format, highlight }`, so a fetch that maps to this shape is enough.
- Highlight: one row flagged `is_highlight`, with flier image upload.
- "Save a seat" → real RSVP / ticketing (Stripe Checkout or Eventbrite link) instead of the contact form.

## 3. Contact form

- Set `contact.endpoint` now (Formspree). Later, post into the same `conversations` table so Hannah has one inbox.

## 4. OmniReality

- The embed already goes transparent with `?mode=omni` and hides the chat.
- If OmniFeed needs site data, expose `client.js` as JSON (`/api/client.json`) so both use one source of truth.

## Checklist

- [ ] Pick a form endpoint and set `contact.endpoint` + `chat.endpoint`
- [ ] Hannah reviews every line in `chat.replies` (it's her voice)
- [ ] Real events and highlight in place of the sample data (`sample: false`)
- [ ] Choose step 2 or 3 for live chat
- [ ] Privacy page
- [ ] Spam protection
