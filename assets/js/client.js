/*
 * Client object: Hannah Lynn Mell
 * ---------------------------------------------------------------
 * Single source of truth for the landing site. Everything the page
 * renders (copy, links, palette, embed + season settings) comes from
 * here, so edits happen in one place.
 *
 * Sources: data/userData.json (brief) + her public Linktree bio.
 */
window.HANNAH = {
  name: "Hannah Lynn Mell",
  nameLines: ["Hannah", "Lynn", "Mell"],
  monogram: "HLM",
  tagline: "Confluent curator of healing spaces.",
  location: "Boston · in person & remote",
  roles: [
    { label: "Writer", pillar: "writing" },
    { label: "Music educator", pillar: "music" },
    { label: "Movement choreographer", pillar: "movement" },
    { label: "Interfaith chaplain", pillar: "healing" },
    { label: "EMDR-trained", pillar: "healing" },
    { label: "OG nerd", pillar: "spark" }
  ],
  qualities: ["Resilient", "Positive", "Adaptive", "Grounded"],

  about: {
    heading: "Where music, movement, spirit and the page run together.",
    paragraphs: [
      "Hannah Lynn Mell is an artist, educator and yogi who builds healing spaces. A former therapist, she now offers somatic coaching and consultation to individuals and groups, in person in Boston and remotely.",
      "She teaches and composes music. She choreographs yoga, Zumba, ballroom and Qi Gong. She serves as an interfaith chaplain, is trained in EMDR, and writes the Monday Morning Muse on Substack. She is also, proudly, an OG nerd."
    ]
  },

  pillars: [
    {
      id: "music",
      domain: "Music & Education",
      service: "Music lessons",
      description: "Music instruction, education and creative composition, for students who want to learn, play and make something of their own.",
      offerings: ["Lessons", "Music education", "Composition"],
      /* Listening room. Paste any Spotify playlist / album / track link
   * (Share → Copy link to playlist) into playlists. A profile link
   * can't play inside the page, so it's used as the fallback. */
  music: {
    heading: "The listening room.",
    intro: "Songs Hannah keeps close. Press play and it keeps going while you read.",
    profile: "https://open.spotify.com/user/1299316400",
    playlists: [
      // { title: "Playlist name", url: "https://open.spotify.com/playlist/XXXXXXXXXXXXXXXXXXXXXX" }
    ]
  },

  links: [
        { label: "Watch on YouTube", url: "https://www.youtube.com/@hannahlynnmell" },
        { label: "Team44point4 & Total Resonance", url: "https://www.patreon.com/Team44point4" }
      ]
    },
    {
      id: "movement",
      domain: "Movement & Wellness",
      service: "Yoga & choreography",
      description: "Yoga, Zumba, ballroom and Qi Gong choreography, with a focus on somatic healing through movement.",
      offerings: ["Yoga", "Zumba", "Ballroom", "Qi Gong", "Somatic coaching"],
      /* Listening room. Paste any Spotify playlist / album / track link
   * (Share → Copy link to playlist) into playlists. A profile link
   * can't play inside the page, so it's used as the fallback. */
  music: {
    heading: "The listening room.",
    intro: "Songs Hannah keeps close. Press play and it keeps going while you read.",
    profile: "https://open.spotify.com/user/1299316400",
    playlists: [
      // { title: "Playlist name", url: "https://open.spotify.com/playlist/XXXXXXXXXXXXXXXXXXXXXX" }
    ]
  },

  links: [{ label: "BreatheDeep", url: "https://hannahlynnmell.com" }]
    },
    {
      id: "healing",
      domain: "Spiritual & Mental Health Support",
      service: "Healing spaces",
      description: "Interfaith chaplaincy and EMDR-trained support, offered as calm, curated spaces for individuals and groups.",
      offerings: ["Interfaith chaplaincy", "EMDR-trained support", "Consultation", "Intergenerational vibe curation"],
      /* Listening room. Paste any Spotify playlist / album / track link
   * (Share → Copy link to playlist) into playlists. A profile link
   * can't play inside the page, so it's used as the fallback. */
  music: {
    heading: "The listening room.",
    intro: "Songs Hannah keeps close. Press play and it keeps going while you read.",
    profile: "https://open.spotify.com/user/1299316400",
    playlists: [
      // { title: "Playlist name", url: "https://open.spotify.com/playlist/XXXXXXXXXXXXXXXXXXXXXX" }
    ]
  },

  links: []
    },
    {
      id: "writing",
      domain: "Writing & Reflection",
      service: "Monday Morning Muse",
      description: "Essays, creative writing and weekly reflections on mental health, personal growth and music.",
      offerings: ["Substack essays", "Creative writing", "Notes & podcast"],
      /* Listening room. Paste any Spotify playlist / album / track link
   * (Share → Copy link to playlist) into playlists. A profile link
   * can't play inside the page, so it's used as the fallback. */
  music: {
    heading: "The listening room.",
    intro: "Songs Hannah keeps close. Press play and it keeps going while you read.",
    profile: "https://open.spotify.com/user/1299316400",
    playlists: [
      // { title: "Playlist name", url: "https://open.spotify.com/playlist/XXXXXXXXXXXXXXXXXXXXXX" }
    ]
  },

  links: [{ label: "Read the Muse", url: "https://mondaymorningmuse.substack.com/" }]
    }
  ],

  writing: {
    title: "Monday Morning Muse",
    url: "https://mondaymorningmuse.substack.com/",
    archive: "https://mondaymorningmuse.substack.com/archive",
    description: "Notes and a podcast with Hannah's reflections on mental health, personal growth and music. New musings land on Mondays, more or less.",
    // Pulled from the public archive; refresh as new posts go up.
    fromArchive: [
      { date: "Jun 9", title: "you are no special friend of fear" },
      { date: "Jun 3", title: "questions that reorient", subtitle: "Monday-ish musings on a Tuesday" },
      { date: "May 28", title: "living out loud", subtitle: "happy birthday, Maria Gabriela!" }
    ],
    subscribeEmbed: "https://mondaymorningmuse.substack.com/embed"
  },

  media: {
    youtube: {
      handle: "@hannahlynnmell",
      url: "https://www.youtube.com/@hannahlynnmell",
      channelId: "UCRpmn_vvvdGZLGUieIATlJA",
      // "UU" + channelId minus "UC" = the channel's uploads playlist
      uploadsPlaylist: "UURpmn_vvvdGZLGUieIATlJA"
    }
  },

  /* Listening room. Paste any Spotify playlist / album / track link
   * (Share → Copy link to playlist) into playlists. A profile link
   * can't play inside the page, so it's used as the fallback. */
  music: {
    heading: "The listening room.",
    intro: "Songs Hannah keeps close. Press play and it keeps going while you read.",
    profile: "https://open.spotify.com/user/1299316400",
    playlists: [
      // { title: "Playlist name", url: "https://open.spotify.com/playlist/XXXXXXXXXXXXXXXXXXXXXX" }
    ]
  },

  links: [
    { label: "Linktree", url: "https://linktr.ee/Hannahlynnmell", note: "Everything, in one place" },
    { label: "Substack", url: "https://mondaymorningmuse.substack.com/", note: "Monday Morning Muse" },
    { label: "YouTube", url: "https://www.youtube.com/@hannahlynnmell", note: "@hannahlynnmell" },
    { label: "Instagram", url: "https://www.instagram.com/hannahlynnmell", note: "@hannahlynnmell" },
    { label: "Facebook", url: "https://www.facebook.com/hannahlynnmell", note: "hannahlynnmell" },
    { label: "Spotify", url: "https://open.spotify.com/user/1299316400", note: "Playlists" },
    { label: "Patreon", url: "https://www.patreon.com/Team44point4", note: "Team44point4 & Total Resonance" },
    { label: "BreatheDeep", url: "https://hannahlynnmell.com", note: "hannahlynnmell.com" }
  ],

  contact: {
    heading: "Say hello.",
    intro: "Lessons, movement sessions, somatic coaching, chaplaincy or a collaboration. Tell Hannah what you're looking for and she'll be in touch.",
    // Messages are delivered to Hannah's inbox (hannahlynnmell@gmail.com) through
    // FormSubmit. The first message sends her a one-time activation email;
    // after she confirms, FormSubmit gives a random alias to use here instead
    // of the address, which keeps it out of the page source.
    email: "hannahlynnmell@gmail.com",
    endpoint: "https://formsubmit.co/ajax/hannahlynnmell@gmail.com"
  },

  theme: {
    default: "light", // first visit always opens in light; the toggle still switches to dark
    paper: "grid",   // "grid" | "lined" (lined notebook paper)
    palette: {
      writing: "#F4320B",  // primary accent
      music: "#2049DF",    // secondary accent
      spark: "#94E718",    // highlight
      healing: "#8D1DE2",  // deep accent
      movement: "#FF692A"  // warm accent
    }
  },

  /* OmniReality embed. Load the page with ?mode=omni (or set mode here)
   * and the page ground goes transparent so her world shows through.
   * Wallpaper color fields sit between 20% and 50% opacity. */
  embed: {
    mode: "standalone",          // "standalone" | "omni"
    wallpaperOpacityMin: 0.2,
    wallpaperOpacityMax: 0.5,
    backgroundOpacity: 0.2,      // page wash in omni mode
    surfaceOpacity: 0.5,         // content column in omni mode
    grid: { size: 32, majorEvery: 4 }
  },

  seasons: {
    hemisphere: "north",
    current: "auto",             // "auto" | "spring" | "summer" | "fall" | "winter"
    labels: {
      spring: "Spring · flowers",
      summer: "Summer · beach balls & chairs",
      fall: "Fall · maple leaves",
      winter: "Winter · snowflakes"
    }
  },

  /* Images. Drop files into assets/img/ with these names and they
   * appear; missing ones show a labelled placeholder while
   * showImagePlaceholders is true (turn off for launch). */
  images: {
    showImagePlaceholders: true,
    avatar: { src: "assets/img/avatar.jpg", alt: "" },
    hero:  { src: "assets/img/hero.jpg",  alt: "Hannah Lynn Mell smiling in a trucker cap", shape: "4:5 portrait" },
    about: { src: "assets/img/about.jpg", alt: "Hannah smiling, close up", shape: "3:4 portrait" },
    pillars: {
      music:    { src: "assets/img/music.jpg",    alt: "Music lesson", shape: "3:2 landscape" },
      movement: { src: "assets/img/movement.jpg", alt: "Movement session", shape: "3:2 landscape" },
      healing:  { src: "assets/img/healing.jpg",  alt: "A calm healing space", shape: "3:2 landscape" },
      writing:  { src: "assets/img/writing.jpg",  alt: "Writing desk", shape: "3:2 landscape" }
    },
    /* Carousel ("Moments"). Add or reorder slides freely; blank
     * slides show a placeholder until their file exists. */
    carousel: {
      heading: "Hats, codes and healing.",
      autoplaySeconds: 6,   // covers view only; the shelf stays still
      view: "shelf",        // "shelf" (spines, pull one out) | "covers" (all cards open)
      slides: [
        { type: "omni" },        // ⟐ card: opens the OmniReality loader in the panel (data: omni below)
        { type: "highlight" },   // opens the Highlight panel (data: highlight below)
        { type: "calendar" },    // opens the Calendar panel (data: calendar below)
        { type: "donate" },      // opens the Give panel for Team44point4 & Total Resonance (data: donate below)
        { src: "assets/img/slide-1.jpg", alt: "Hannah in a cork-brimmed cap, smiling in a sunlit room", caption: "hats, codes, and healing", shape: "4:5" },
        { src: "assets/img/slide-2.jpg", alt: "Hannah in a bright checked scarf, mid-thought", caption: "", shape: "4:5" },
        { src: "assets/img/slide-3.jpg", alt: "Hannah laughing on a drive, in a tie-dye top", caption: "", shape: "4:5" },
        { src: "assets/img/slide-4.jpg", alt: "", caption: "", shape: "4:5" },
        { src: "assets/img/slide-5.jpg", alt: "", caption: "", shape: "4:5" },
        { src: "assets/img/slide-6.jpg", alt: "", caption: "", shape: "4:5" }
      ]
    }
  },

  /* The one thing Hannah most wants to push right now. First card in the
   * carousel; opens a panel with the flier on the left, details on the right.
   * sample: true shows a "sample" tag until real details go in. */
  highlight: {
    sample: true,
    kicker: "Strongest highlight",
    title: "Soul Collage Circle",
    subtitle: "Layers of meaning, one card at a time.",
    pillar: "healing",
    date: "2026-10-18",
    time: "2:00–4:30 pm",
    where: "Boston · venue to be announced",
    format: "In person",
    cost: "Sliding scale",
    spots: "12 seats",
    description: [
      "An afternoon of cutting, layering and listening. Bring nothing but curiosity; images, paper and glue are provided.",
      "Each card becomes a small conversation with a part of yourself. We close by sharing, if and as you like."
    ],
    flyer: { src: "assets/img/highlight-flyer.jpg", alt: "Flier for the Soul Collage Circle", shape: "4:5 flier" },
    cta: { label: "Save a seat", url: "#connect", topic: "Healing spaces" },
    /* Sign-up form behind "Save a seat". Each sign-up is emailed to Hannah
     * (contact.endpoint) as a table, and the person gets a confirmation email.
     * Ticket names below are samples; set them to what she actually offers. */
    rsvp: {
      enabled: true,
      heading: "Save a seat",
      intro: "Tell Hannah who's coming. You'll get a confirmation email, and she'll follow up with the details.",
      maxPeople: 6,
      ageRanges: ["18–29", "30–44", "45–59", "60+", "Prefer not to say"],
      tickets: ["Sliding scale · pay what you can", "Standard", "Supporter · helps cover a seat"],
      askPhone: true,
      confirmation: "Thank you for saving a seat at {title} on {date}. Hannah will email you the details soon. If your plans change, just reply to this email."
    },
    secondary: { label: "Read about it on the Muse", url: "https://mondaymorningmuse.substack.com/" }
  },

  /* Calendar. Second card in the carousel; opens a panel with a month
   * calendar (legend on top) and the next upcoming items on the right.
   * pillar picks the colour: music | movement | healing | writing | spark (community). */
  calendar: {
    sample: true,
    legend: [
      { pillar: "music", label: "Music & lessons" },
      { pillar: "movement", label: "Movement" },
      { pillar: "healing", label: "Healing spaces" },
      { pillar: "writing", label: "Writing & Muse" },
      { pillar: "spark", label: "Community & live" }
    ],
    events: [
      { date: "2026-09-28", time: "9:00 am", title: "Monday Morning Muse", pillar: "writing", where: "Substack", format: "Online" },
      { date: "2026-09-30", time: "6:30 pm", title: "Qi Gong at dusk", pillar: "movement", where: "Boston Common", format: "In person" },
      { date: "2026-10-03", time: "10:00 am", title: "Open music lessons", pillar: "music", where: "Studio", format: "In person" },
      { date: "2026-10-05", time: "9:00 am", title: "Monday Morning Muse", pillar: "writing", where: "Substack", format: "Online" },
      { date: "2026-10-07", time: "7:00 pm", title: "Zumba with Hannah", pillar: "movement", where: "Community center", format: "In person" },
      { date: "2026-10-09", time: "12:00 pm", title: "Interfaith lunchtime reflection", pillar: "healing", where: "Online", format: "Online" },
      { date: "2026-10-12", time: "9:00 am", title: "Monday Morning Muse", pillar: "writing", where: "Substack", format: "Online" },
      { date: "2026-10-14", time: "7:30 pm", title: "Live with Hannah", pillar: "spark", where: "Substack Live", format: "Online" },
      { date: "2026-10-18", time: "2:00 pm", title: "Soul Collage Circle", pillar: "healing", where: "Boston", format: "In person", highlight: true },
      { date: "2026-10-18", time: "6:00 pm", title: "Ballroom basics", pillar: "movement", where: "Studio", format: "In person" },
      { date: "2026-10-19", time: "9:00 am", title: "Monday Morning Muse", pillar: "writing", where: "Substack", format: "Online" },
      { date: "2026-10-24", time: "11:00 am", title: "Songwriting circle", pillar: "music", where: "Studio", format: "In person" },
      { date: "2026-10-26", time: "9:00 am", title: "Monday Morning Muse", pillar: "writing", where: "Substack", format: "Online" },
      { date: "2026-10-29", time: "6:30 pm", title: "Somatic coaching group", pillar: "healing", where: "Online", format: "Online" },
      { date: "2026-11-07", time: "10:00 am", title: "Yoga & breath", pillar: "movement", where: "Studio", format: "In person" },
      { date: "2026-11-14", time: "3:00 pm", title: "Community sing", pillar: "spark", where: "Boston", format: "In person" }
    ]
  },

  /* Giving: Team44point4 & Total Resonance. Fourth card in the carousel; its
   * panel offers three ways to help: give directly, visit the page, or ask
   * Hannah in the chat.
   * directUrl: a donation link (PayPal.me, Stripe Payment Link, Donorbox…).
   *   Use {amount} where the amount goes, e.g. "https://paypal.me/NAME/{amount}".
   *   Empty = "Give directly" sends people to the Patreon page instead. */
  donate: {
    name: "Team44point4 & Total Resonance",
    // Line-art logo cut out to transparency; the site colours the lines per theme.
    logo: { src: "assets/img/team44point4-logo.png", alt: "Team44point4 logo: a grinning fox riding a bicycle" },
    tagline: "Arts & education for social change.",
    description: [
      "Team44point4 & Total Resonance is Hannah's home for arts and education for social change.",
      "Support keeps the music, the teaching and the gatherings going, and open to more people."
    ],
    pageUrl: "https://www.patreon.com/Team44point4",
    pageLabel: "Visit Team44point4 on Patreon",
    directUrl: "",
    amounts: [10, 25, 50, 100],
    currency: "$",
    cardTitle: "Team44point4 & Total Resonance",
    cardSub: "Arts & education for social change."
  },

  /* ⟐ quick menu: the sticky ⟐ button, top right. action: a #section,
   * "support" (support.url), "omni" (omni.url, or the ⟐ section until it's set)
   * or any URL. */
  support: { url: "https://www.patreon.com/Team44point4", note: "Patreon · Team44point4 & Total Resonance" },
  quickMenu: [
    { label: "Learn More About Hannah", note: "Her story and practice", action: "#about", color: "healing" },
    { label: "Contact Hannah", note: "A message straight to her inbox", action: "#connect", color: "music" },
    { label: "Support Hannah", note: "Give to Team44point4 & Total Resonance", action: "donate", color: "movement" },
    { label: "Visit Hannah's ⟐Reality", note: "Step into OmniReality", action: "omni", color: "spark" }
  ],

  /* ⟐ OmniReality: the site condensing into a loader. Lives behind the ⟐ card
   * (first in the carousel) and opens in the panel under it, so people find it
   * out of curiosity rather than having it in the page. */
  omni: {
    url: "",   // OmniReality link goes here
    title: "Enter OmniReality",
    cardTitle: "Something is being realized.",
    cardSub: "Join me, to my ⟐reality.",
    note: "Everything here, gathered into one point. OmniReality opens with a load screen just like this."
  },

  /* Chat (standalone site only; hidden when embedded, e.g. in OmniReality,
   * which has its own OmniFeed chat). Replies are written in Hannah's voice
   * and answered automatically; "leave a message" hands off to Hannah.
   * endpoint: where hand-off messages POST (falls back to contact.endpoint).
   * See admin/dev/futureUpdatesForFullStack for the live-messaging plan. */
  chat: {
    enabled: true,
    endpoint: "",   // empty = use contact.endpoint (her inbox)
    title: "Chat with Hannah",
    status: "Automatic replies · your messages reach me directly",
    greeting: "Hi, I'm Hannah. Welcome in. What brings you here today?",
    quick: ["What's coming up?", "Lessons & sessions", "Tell me about you", "Leave Hannah a message"],
    replies: {
      about: "I'm a writer, music educator and movement choreographer, an interfaith chaplain, and EMDR-trained. I used to work as a therapist; these days I offer somatic coaching and consultation, in person in Boston and remotely. Also, proudly, an OG nerd.",
      music: "I teach music and compose. Lessons are for anyone who wants to learn, play and make something of their own. Tell me a little about where you're starting from and I'll write back.",
      movement: "I choreograph and lead yoga, Zumba, ballroom and Qi Gong, with a focus on somatic healing through movement. Want the next class, or to ask about a private session?",
      healing: "I hold healing spaces through interfaith chaplaincy and EMDR-trained support, for individuals and groups. If you'd like to talk about working together, leave me a note and I'll reply personally.",
      writing: "I write the Monday Morning Muse on Substack: reflections on mental health, personal growth and music. New musings land on Mondays, more or less.",
      media: "You'll find me on YouTube, Spotify, Instagram and Facebook. Links are below.",
      location: "I'm based in Boston and work in person there, and remotely anywhere.",
      price: "It depends on what you're looking for, and I keep some offerings on a sliding scale. Tell me what you have in mind and I'll send details.",
      thanks: "Thank you for being here. Take good care.",
      donate: "Thank you for thinking of Team44point4 & Total Resonance. That's where my arts and education for social change lives. You can give on the Team44point4 page, or ask me anything about giving and I'll write back personally.",
      fallback: "I don't want to guess on that one. Leave me a note and I'll write back personally.",
      crisis: "I'm really glad you reached out. This chat can't give crisis support. If you're in the US, please call or text 988 (Suicide & Crisis Lifeline) now, or call 911 if you're in immediate danger. Outside the US, please contact your local emergency number."
    }
  },

  /* Faux-3D shapes floating between dimensions. x: 0–1 of the width,
   * y: 0–1.8 of a screen height (they loop), depth: 0.1 (far, blurred,
   * slow) to 0.9 (near, sharp, fast). Colours are palette names. */
  dimensions: {
    shapes: [
      { type: "sphere",  x: 0.04, y: 0.2,  size: 110, depth: 0.55, c1: "writing", c2: "movement" },
      { type: "cube",    x: 0.9,  y: 0.55, size: 84,  depth: 0.7,  c1: "music",   c2: "healing", spin: 1 },
      { type: "torus",   x: 0.45, y: 1.1,  size: 220, depth: 0.2,  c1: "healing", c2: "writing", spin: 0.6 },
      { type: "pyramid", x: 0.06, y: 1.45, size: 96,  depth: 0.8,  c1: "movement", c2: "writing", spin: -0.8 }
    ],
    /* Rips sit in the gaps between sections, on the dividers
     * (0 = after the hero, 1 = after About, 2 = after Offerings,
     *  3 = after Writing, 4 = after Video, 5 = after Listen).
     * scene: "sky" | "mountain" | "beach" | "tree". Day in light mode,
     * night in dark mode. layers = torn scraps pasted on top, collage-style. */
    rips: [
      { between: 1, scene: "mountain", align: "right", width: 440, height: 170, rotate: -4, seed: 11,
        layers: [{ scene: "sky", width: 130, height: 80, left: "-40px", top: "-18px", rotate: -14 }] },
      { between: 2, scene: "sky", align: "left", width: 380, height: 150, rotate: 5, seed: 23 },
      { between: 3, scene: "beach", align: "right", offset: "10%", width: 420, height: 160, rotate: 3, seed: 5,
        layers: [{ scene: "tree", width: 120, height: 110, right: "-30px", bottom: "-26px", rotate: 11 }] },
      { between: 5, scene: "tree", align: "center", width: 360, height: 170, rotate: -3, seed: 41 }
    ]
  },

  layout: {
    // Carousel opens the page: "above-location" or "below-location" (the Boston line)
    carouselPlacement: "below-location"
  },

  colophon: "Set in Bodoni Moda and Literata, with IBM Plex Mono for the small print."
};
