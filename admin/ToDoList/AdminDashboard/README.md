# To do: Admin dashboard for Hannah

A private place where Hannah sees and manages everything the site collects.
Not built yet. This is the list to build from. (Backend plan: `admin/dev/futureUpdatesForFullStack`.)

## What reaches her today (front end only)

Everything arrives as an email to **hannahlynnmell@gmail.com** through FormSubmit:

| Source | Subject line | Fields |
|---|---|---|
| Save a seat (highlight panel) | `New sign-up: <event> · <name> (+N)` | Event, When, Where, Name, email, Phone, Age range, People, Ticket, Notes, Email updates |
| Contact form | `New message from Hannah Lynn Mell's site` | name, email, topic, message |
| Chat hand-off | `Chat message from <name> (Hannah Lynn Mell site)` | name, email, message, transcript |

Sign-ups also send the person an automatic confirmation email (`highlight.rsvp.confirmation`).

**Before launch:** Hannah confirms FormSubmit's one-time activation email, then the endpoint in
`client.js → contact.endpoint` is switched to the random alias FormSubmit gives her.

## Dashboard: must have

- [ ] **Sign in** for Hannah only (magic link / passkey)
- [ ] **Sign-ups** per event: name, email, phone, age range, party size, ticket, notes, timestamp
  - [ ] Seats taken vs capacity (`highlight.spots`), with a waitlist when full
  - [ ] Close sign-ups automatically at capacity or at a cut-off time
  - [ ] Export CSV
  - [ ] Email everyone signed up (reminder / venue update)
  - [ ] Mark attended / no-show
- [ ] **Inbox**: contact form + chat hand-offs in one list, with reply-by-email and a status (new / replied / archived)
- [ ] **Highlight editor**: title, subtitle, date, time, where, format, cost, spots, description, flier upload, ticket types, on/off
- [ ] **Calendar editor**: add / edit / delete events, pillar colour, recurring (e.g. every Monday for the Muse), mark one as the highlight
- [ ] **Notifications**: email per sign-up (on today), daily digest option, push to her phone later

## Nice to have

- [ ] Payments for tickets (Stripe Checkout; sliding scale with suggested amounts)
- [ ] Add-to-calendar links in confirmation emails (.ics)
- [ ] Edit the chat's replies (`chat.replies`) without touching code
- [ ] Carousel manager: reorder slides, upload photos (auto-crop to 4:5)
- [ ] Season + paper defaults (grid / lined) toggles
- [ ] Simple stats: visits, sign-ups by source, messages per week
- [ ] Sync with OmniReality / OmniFeed (one source of truth for events and the highlight)

## Data model sketch

```
events:    id, title, subtitle, pillar, date, time, end_time, where, format, cost, capacity, is_highlight, flier_url, description, tickets[]
signups:   id, event_id, name, email, phone, age_range, people, ticket, notes, updates_opt_in, status (confirmed|waitlist|cancelled), created_at
messages:  id, source (contact|chat), name, email, topic, body, transcript, status, created_at
```

## Privacy

- Ask only what's needed. Age range is optional; keep it optional.
- No health details in forms or chat (she works in chaplaincy and EMDR-informed support).
- Retention: delete sign-ups some months after the event (her call); export on request.
