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
    // Set to a form endpoint (e.g. Formspree) to deliver messages.
    endpoint: ""
  },

  theme: {
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
    hero:  { src: "assets/img/hero.jpg",  alt: "Portrait of Hannah Lynn Mell", shape: "4:5 portrait" },
    about: { src: "assets/img/about.jpg", alt: "Hannah at work", shape: "3:4 portrait" },
    pillars: {
      music:    { src: "assets/img/music.jpg",    alt: "Music lesson", shape: "3:2 landscape" },
      movement: { src: "assets/img/movement.jpg", alt: "Movement session", shape: "3:2 landscape" },
      healing:  { src: "assets/img/healing.jpg",  alt: "A calm healing space", shape: "3:2 landscape" },
      writing:  { src: "assets/img/writing.jpg",  alt: "Writing desk", shape: "3:2 landscape" }
    },
    gallery: [
      { src: "assets/img/gallery-1.jpg", alt: "", caption: "", shape: "4:5" },
      { src: "assets/img/gallery-2.jpg", alt: "", caption: "", shape: "4:5" },
      { src: "assets/img/gallery-3.jpg", alt: "", caption: "", shape: "4:5" },
      { src: "assets/img/gallery-4.jpg", alt: "", caption: "", shape: "4:5" },
      { src: "assets/img/gallery-5.jpg", alt: "", caption: "", shape: "4:5" }
    ]
  },

  colophon: "Set in Bodoni Moda and Literata, with IBM Plex Mono for the small print."
};
