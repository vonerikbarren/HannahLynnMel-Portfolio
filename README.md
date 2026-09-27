# HannahLynnMell_Portfolio_V03

Hannah Lynn Mell — Portfolio · Version 03 (2026-09-26)

Landing site for Hannah Lynn Mell: writer, music educator, movement choreographer, interfaith chaplain and EMDR-trained curator of healing spaces.

Plain HTML/CSS/JS, no build step. Open `index.html` or serve the folder.

## Structure

```
index.html              page shell + layers
assets/js/client.js     the client object (all copy, links, palette, embed + season settings)
assets/js/seasons.js    SeasonalMargins: falling seasonal symbols (standalone embed)
assets/js/dimensions.js floating faux-3D shapes + rips to a starry night
assets/js/panels.js   Highlight + Calendar cards and the drawer under the carousel
assets/js/omni.js     ⟐ loader: the site condensing around ⟐; opens from the first carousel card
assets/js/chat.js     chat (standalone only), automatic replies + hand-off to Hannah
assets/js/main.js       renders the page from the client object; parallax, omni mode, video, form
assets/css/styles.css   design tokens + layout (light and dark)
data/userData.json      original brief
admin/dev/futureUpdatesForFullStack/   plans for live chat, CMS, backend
admin/ToDoList/AdminDashboard/          to-do list for Hannah's admin dashboard
admin/dev/handover_design.json         design handover (tokens, components, motion, voice) for matching OmniReality
```

## OmniReality embed

Load with `?mode=omni` (or set `embed.mode` in `client.js`). The page ground drops to 20% opacity, the content column to 50%, and the grid strengthens over the colour-field wallpaper (fields sit between 20% and 50% opacity).

```html
<iframe src="https://…/index.html?mode=omni" allowtransparency="true" style="background:transparent;border:0"></iframe>
```

## Seasonal margins

Auto-picks the season from the date (northern hemisphere). Override with `?season=spring|summer|fall|winter` or the switcher in the footer.

- Spring: flowers · Summer: beach balls & beach chairs · Fall: maple leaves · Winter: snowflakes

Use it on its own anywhere:

```html
<script src="assets/js/seasons.js" data-auto data-season="auto"></script>
```

## Bookshelf carousel

The carousel opens as a bookshelf: every item is a thin spine; click one to pull the book out and see its full card, ↩ to put it back. The Shelf / Covers switch shows all cards open (the old carousel). Default in `client.js → images.carousel.view`.

## Giving

`client.js → donate`: the fourth carousel card and its Give panel for Team44point4 & Total Resonance. Set `directUrl` to a donation link (PayPal.me, Stripe Payment Link, Donorbox; use `{amount}` for the amount) to make "Give directly" go straight there; until then it opens the Patreon page.

## Messages

The contact form, the chat and the Save-a-seat sign-up form all deliver to hannahlynnmell@gmail.com through FormSubmit (`contact.endpoint`). The first message triggers a one-time activation email to Hannah; after she confirms, swap the address in the endpoint for the random alias FormSubmit gives her.

## To do

- Writing: refresh `writing.fromArchive` as new Substack posts go up.

## Light / dark

Light is the default for every first visit. The toggle in the top bar switches to dark and is remembered per visitor. The gradient is identical in both modes.

## Dimensions

`client.js → dimensions` lists the floating shapes (sphere, cube, torus, pyramid, capsule: position, size, depth, colours) and the rips (which section, size, position, tilt). Depth 0.1 is far, blurred and slow; 0.9 is near, sharp and fast.

## Paper

`client.js → theme.paper`: `"grid"` or `"lined"` (notebook lines with a red margin rule). The footer has a switch to compare; `?paper=lined` works too.
