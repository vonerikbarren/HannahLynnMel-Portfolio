# Hannah Lynn Mell — Portfolio

Landing site for Hannah Lynn Mell: writer, music educator, movement choreographer, interfaith chaplain and EMDR-trained curator of healing spaces.

Plain HTML/CSS/JS, no build step. Open `index.html` or serve the folder.

## Structure

```
index.html              page shell + layers
assets/js/client.js     the client object (all copy, links, palette, embed + season settings)
assets/js/seasons.js    SeasonalMargins: falling seasonal symbols (standalone embed)
assets/js/main.js       renders the page from the client object; parallax, omni mode, video, form
assets/css/styles.css   design tokens + layout (light and dark)
data/userData.json      original brief
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

## To do

- Contact form: set `contact.endpoint` in `client.js` (e.g. a Formspree URL) to deliver messages.
- Writing: refresh `writing.fromArchive` as new Substack posts go up.
