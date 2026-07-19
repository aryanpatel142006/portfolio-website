/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  EDIT THIS FILE — this is the single source of truth for the whole site.  │
 * │  Replace any value below to update the site. Images live in /public.      │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

export type SocialType =
  | "email"
  | "github"
  | "linkedin"
  | "x"
  | "devpost"
  | "resume"
  | "website";

export type Social = {
  type: SocialType;
  href: string;
  label: string; // shown as accessible label / tooltip
};

export type StatusBadge = {
  role: string; // e.g. "Student", "Data Engineer"
  org: string; // e.g. "Rutgers University"
  icon?: string; // emoji OR an image path in /public
  iconUrl?: string; // optional remote image URL for the icon
  iconAlt?: string; // accessibility label for icon images
  size?: number; // icon size in px for this individual badge
};

export type Award = {
  name: string;
  logo?: string; // optional image path in /public
};

export type Experience = {
  role: string;
  org: string;
  period: string; // e.g. "June 2026 → Now"
  active?: boolean; // highlights the row with an accent border
  icon?: string; // emoji OR image path in /public
  iconUrl?: string; // optional remote image URL for the icon
  iconAlt?: string; // accessibility label for icon images
};

export type ProjectBadge = {
  label: string; // e.g. "National Award"
  icon?: string; // emoji, defaults to 🏆
};

export type ProjectLink = {
  label: string; // e.g. "github", "devpost", "live", "video"
  href: string;
};

export type Project = {
  title: string;
  date: string; // e.g. "2025"
  description?: string; // shown in the expanded modal
  image?: string; // preview image path in /public
  badges?: ProjectBadge[];
  tags?: string[]; // tech-stack chips shown in the modal
  links?: ProjectLink[]; // links shown at the bottom of the modal
};

export type Profile = {
  name: string;
  pronunciation?: string; // e.g. "/ar-yun/"
  tagline: string;
  photo?: string; // image path in /public
  photoHover?: string; // shown on hover via a slow crossfade (fun easter egg)
};

/* ────────────────────────────  PROFILE  ──────────────────────────── */

export const profile: Profile = {
  name: "Aryan Patel",
  pronunciation: "/ah-ri-an/",
  tagline:
    "i'm a cs & data science student at rutgers, building things that make technology more human.",
  photo: "/pfp.png", // your photo
  photoHover: "/cat.png", // hover the photo to crossfade to this
};

/* ───────────────────────────  BACKGROUND  ─────────────────────────── */
// Lower = darker background scrim, higher = lighter background scrim.
// export const backgroundOverlay = 0.86;
export const backgroundOverlay = 0.6;

/* ────────────────────────────  BADGES  ───────────────────────────── */

export const statusBadges: StatusBadge[] = [
  { role: "Student", org: "Rutgers University", icon: "/rutgers.png" },
  { role: "Data Engineer", org: "New Brunswick Parking Authority", icon: "/nbpa.png", size: 44 },
];

/* ────────────────────────────  SOCIALS  ──────────────────────────── */

export const socials: Social[] = [
  { type: "email", href: "mailto:aryanpatel142006@gmail.com", label: "Email" },
  { type: "github", href: "https://github.com/aryanpatel142006", label: "GitHub" },
  { type: "linkedin", href: "https://linkedin.com/in/aryanpatel142006/", label: "LinkedIn" },
  { type: "website", href: "https://aryan.is-a.dev/", label: "Website" },
  { type: "resume", href: "/resume.pdf", label: "Resume" }, // drop your resume at public/resume.pdf
];

/* ────────────────────────────  AWARDS  ───────────────────────────── */
// Shown in the auto-scrolling marquee. Add a `logo` path to show an icon.

export const awards: Award[] = [
  { name: "National Science & Technology Exhibition" },
  { name: "Rutgers Honors College — Dean's List" },
  { name: "HackRU" },
  { name: "Break Through Tech" },
  { name: "Blueprint" },
  { name: "SEED2S" },
];

/* ──────────────────────────  EXPERIENCES  ────────────────────────── */
// Use `iconUrl` for a remote logo when you have one; `icon` still shows when `iconUrl` is omitted.

export const experiences: Experience[] = [
  {
    role: "Data Engineer",
    org: "New Brunswick Parking Authority",
    period: "June 2026 → Present",
    active: true,
    iconUrl: "https://img.logo.dev/njnbpa.org?token=pk_FNeueCUtR0qx7cHP9ZPGrA&format=webp&retina=true",
    // iconAlt: "New Brunswick Parking Authority logo",
    icon: "🅿️",
  },
  {
    role: "AI/ML Fellow",
    org: "Break Through Tech @Cornell Tech",
    period: "Mar 2026 → Present",
    active: true,
    icon: "🧠",
    // iconUrl: "https://img.logo.dev/bttc.cornelltech.edu?token=pk_FNeueCUtR0qx7cHP9ZPGrA&format=webp&retina=true",
    iconUrl: "https://img.logo.dev/breakthroughtech.org?token=pk_FNeueCUtR0qx7cHP9ZPGrA&format=webp&retina=true",
  },
  {
    role: "Full Stack + AI/ML Intern",
    org: "IPser Labs",
    period: "January 2026 → May 2026",
    icon: "🤖",
    iconUrl: "https://img.logo.dev/ipserlab.com?token=pk_FNeueCUtR0qx7cHP9ZPGrA&format=webp&retina=true",
  },
  {
    role: "IT Support Engineer",
    org: "RU DCS",
    period: "January 2025 → Present",
    icon: "🖥️",
    iconUrl: "https://img.logo.dev/dcs.rutgers.edu?token=pk_FNeueCUtR0qx7cHP9ZPGrA&format=webp&retina=true",
  },
  {
    role: "Software Engineering Fellow",
    org: "Blueprint",
    period: "February 2025 — April 2025",
    icon: "/blueprint.jpg",
  },
  // {
  //   role: "Member",
  //   org: "SEED2S (Data Science)",
  //   period: "January 2026 → Now",
  //   icon: "🌱",
  //   // iconUrl: "https://img.logo.dev/seed2s.rutgers.edu?token=pk_FNeueCUtR0qx7cHP9ZPGrA&format=webp&retina=true",
  // },
];

/* ───────────────────────────  PROJECTS  ──────────────────────────── */
// Drop preview images in /public and reference them as "/projects/name.png".

export const projects: Project[] = [
  {
    title: "VoxIQ",
    date: "",
    description:
      "An inclusive, adaptive accessibility assessment platform that dynamically scales difficulty based on a user's performance. I built a touchless computer-vision interface with OpenCV and MediaPipe for hand-gesture control, and integrated Pyttsx3 speech modules to deliver a fully audio-navigable experience for visually impaired users. VoxIQ won a National Award and was showcased at a national Science & Technology Exhibition.",
    badges: [{ label: "National Award" }],
    tags: ["Python", "MySQL", "OpenCV", "MediaPipe", "Tkinter", "PyAutoGUI", "Pyttsx3"],
    // links: [{ label: "github", href: "https://github.com/..." }],
    image: "/VoxIQ.png",
  },
  {
    title: "HerLaunch",
    date: "24-hr Hackathon",
    description:
      "An AI-powered startup incubator built in a 24-hour hackathon to help women founders access mentorship and funding. It provides startup guidance and tools like a mentor–mentee matching algorithm, AI-driven pitch feedback simulating investor evaluations (Gemini + Presage APIs), and secure payment processing via the Fiserv API. I designed a responsive React UI on a Supabase backend handling authentication, storage, and real-time updates.",
    badges: [{ label: "Hackathon", icon: "⚡" }],
    tags: ["React", "TypeScript", "Supabase", "Gemini API", "Fiserv API", "Tailwind", "Figma"],
    // links: [{ label: "devpost", href: "https://devpost.com/..." }],
    image: "/HerLaunch.png",
  },
];

/* ────────────────────────────  STACK  ────────────────────────────── */
// Grouped tech skills shown in the animated "stack" section.

export type SkillGroup = {
  label: string;
  items: string[];
};

export const stack: SkillGroup[] = [
  {
    label: "languages",
    items: ["Python", "Java", "C", "SQL", "TypeScript", "JavaScript", "R", "HTML", "CSS"],
  },
  {
    label: "frameworks & data",
    items: ["React", "Next.js", "Django", "FastAPI", "Tailwind", "Supabase", "Pandas", "NumPy", "Matplotlib"],
  },
  {
    label: "tools",
    items: ["Docker", "Git", "Postman", "Jupyter", "Anaconda", "PyCharm", "VS Code", "Google Colab", "LaTeX", "Jira"],
  },
];

/* ──────────────────────  OFF-DUTY (the secret)  ──────────────────── */
/**
 * The hidden "beyond the code" section. Unlock it any of three ways:
 *   • the ⌘K palette — type "whoami", "sudo", "off-duty", or "human"
 *   • click your hero photo 5 times
 *   • the Konami code:  ↑ ↑ ↓ ↓ ← → ← → B A
 * It's session-only — a reload hides it again so it stays an easter egg.
 *
 * ⇩ Everything below is the ONE place to edit this section. Swap the values,
 *   add/remove list items freely — the UI renders whatever's here.
 */

export type NowItem = {
  label: string; // e.g. "training", "watching", "learning", "obsessed with"
  value: string; // the thing itself
};

// A song for the "non-mainstream songs" shelf. Paste a Spotify link/URI, OR a
// plain "Song Name — Artist" string (resolved via Spotify search server-side).
export type SongEntry = string;

export const offDuty = {
  // A short, human intro line shown under the heading.
  intro:
    "the version of me that isn't staring at a terminal — chasing progress in the gym, queuing up an anime, listening to the most random songs, and doing garba till my legs give out.",

  // ── hobbies — quick, low-commitment tags. Emoji optional. ──
  hobbies: [
    "🏋️ gym",
    "🇯🇵 anime",
    "💃 garba",
    "🎧 music",
    // "🎮 gaming",
    // "🍜 finding the best ramen",
  ],

  // ── non-mainstream songs — the shelf under off-duty. Paste Spotify links
  //    (open.spotify.com/track/… or spotify:track:…) OR plain "Song — Artist"
  //    names. Server resolves album art + artist via the Spotify API. ──
  nonMainstream: [
    "https://open.spotify.com/track/3StShCGECtZMW2yp9XkFYv", // THER IT IS 
    "https://open.spotify.com/track/1Xp2sxCBpDFCcerKKh1ik7", // MAJJA NI LIFE
    "https://open.spotify.com/track/4N7LGbba3i05Ymt3lUN4IT", // car keys — Tsumyoki, Venserto, lil help
    "https://open.spotify.com/track/6vH6xKa1vh9ihWrLYZAmU8?autoplay_ok=1", // Banda kaam ka
    "https://open.spotify.com/track/0pMACt1jSBlH8mKdaE1TSv", // Don't even text - gini
    "https://open.spotify.com/track/4TFYFMssJiMwREPUauwWbt", // SAVEEREN

    // ── desi indie / bollymood deep cuts ──
    // "https://open.spotify.com/track/51EAvQ6RYU14VwUaMJHsnD", // ROOP — NAYEL, Hasan Raheem
    // "https://open.spotify.com/track/5ThyDv6aRVU8AH4vXQNldF", // Finding Her — Kushagra, Bharath, Saaheal
    // "https://open.spotify.com/track/4DEbmP6I9FTUDD6uXmlhVc", // Doobey — OAFF, Savera, Lothika
    "https://open.spotify.com/track/2oSnGQbI4tZxImmCs2c4PP", // Nasamajh — Aditya Rikhari
    // "https://open.spotify.com/track/0qPoQiQIhgyMaP7X78hxri", // Akhiyaan Gulaab — Mitraz
    "https://open.spotify.com/track/7eQoMQdE4JqngwYDOqLBU0", // Superstar — dox, JASKARAN, Rita Kim
    // "https://open.spotify.com/track/5cCKdYNQtM3TC8PXQljxyA", // kidhar? — Maanu, Talal Qureshi, Zahra Paracha
    // "https://open.spotify.com/track/03BjH2SL1lAB2M55Gcj2pV", // Bardali — Sushant KC
    // "https://open.spotify.com/track/2YrSozvJeJCMqEaQ9EVLfD", // Bheegi Bheegi — James (Gangster)
    // ── japanese city pop (JAP) ──
    "https://open.spotify.com/album/48I17j8JwxGEe2FQAiQ75P", // STAY WITH ME
    "https://open.spotify.com/track/3x4378ztiLvFmm2nuzEI0C", // EVENGELION
    "https://open.spotify.com/track/0kdqcbwei4MDWFEX5f33yG", // bling bang bang born
    "https://open.spotify.com/track/1rN9QoVxw5U7TJkyaUR8C1", // TOKYO GOHUL OPENING
    "https://open.spotify.com/track/6bfjEGSR7DyC8MK8cp3ZCp", // Blood Blockade Battlefront (S1 ED)
    // ── english ──
    // "https://open.spotify.com/track/1NXbNEAcPvY5G1xvfN57aA", // Dracula — Tame Impala
    // "https://open.spotify.com/track/1TSxLktSlIdEsjTGWB4Fub", // It's Only — ODESZA, Zyra
    // "https://open.spotify.com/track/2P5tq6IKBKjlFSZ6FZlZk6", // Make Way For The Sun — O & The Mo
    // ── rap ──
    "https://open.spotify.com/track/1Jsos1mzwTwYGOndYN5h8V", // Farebi — Chaar Diwaari, Raftaar
    "https://open.spotify.com/track/7CVw4gVPpH1TPQttQGVmhZ", // Maharani — Karun, Lambo Drive, Arpit Bala
    // "https://open.spotify.com/track/2FDTHlrBguDzQkp7PVj16Q", // Sprinter — Dave, Central Cee
    // "https://open.spotify.com/track/7H5CsjEafNygkvcm69RevN", // COLD — Nemzzz
  ] as SongEntry[],

  // ── anime stats — live from AniList (public profile, no auth needed). ──
  //  username: the AniList handle to pull stats from. Empty/placeholder hides
  //  the whole section. showStats: master toggle. comparisons: optional custom
  //  "i could've done X in this much time" jokes, picked by hours watched.
  anilist: {
    username: "aryanpatel142006",
    showStats: true,
    comparisons: [] as { hours: number; line: string }[],
  },
};

/* ────────────────────────  CHATBOT CONTEXT  ──────────────────────── *//**
 * The `bio` below is the grounding context for the "query me" AI chatbot.
 * It answers ONLY from this + the structured content above — edit freely.
 */

export const bio = `
I'm Aryan Patel, a Computer Science and Data Science student at Rutgers University
(New Brunswick, NJ) with a minor in Business Administration. I'm in the Honors College
and on the Dean's List, carrying a 3.5 GPA, and I'll graduate in May 2028 (started Sep 2024).
My coursework includes Data Structures, Honors Computer Architecture, Discrete Structures I,
and Linear Algebra.

I love building things that make technology more human — accessible, useful, and a little
delightful. Right now I'm a Data Engineer at the New Brunswick Parking Authority (since June
2026) and an IT Support Engineer at Rutgers DCS department (since January 2025). Earlier in 2026 I was a Full
Stack + AI/ML Intern at IPser Labs (Fort Worth, TX), and in early 2025 I was a Software
Engineering Fellow at Blueprint. I'm also a member of SEED2S (Student Equity, Excellence and
Diversity in Data Science).

A couple of projects I'm proud of:
- VoxIQ, an adaptive accessibility assessment platform (Python, MySQL, OpenCV, MediaPipe,
  Tkinter, PyAutoGUI, Pyttsx3). It dynamically scales difficulty to a user's performance,
  offers a touchless computer-vision gesture interface, and is fully audio-navigable for
  visually impaired users. It won a National Award and was showcased at a national
  Science and Technology Exhibition.
- HerLaunch, an AI-powered startup incubator built in a 24-hour hackathon to help women
  founders access mentorship and funding (React, TypeScript, Supabase, Gemini & Fiserv APIs,
  Tailwind, Figma). It includes a mentor–mentee matching algorithm, AI-driven pitch feedback
  simulating investor evaluations, and secure Fiserv payments.

Technical skills: Python, Java, C, SQL, JavaScript, TypeScript, R, Markdown, HTML, CSS.
Frameworks & tools: React, Next.js, Django, FastAPI, Tailwind, Supabase, Pandas, NumPy,
Matplotlib, Docker, Git, Postman, Jira, Jupyter, Anaconda, LaTeX, PyCharm, VS Code, Google
Colab. I work across software engineering and data engineering.

You can reach me at aryanpatel142006@gmail.com or 732-799-9626, find my code at
github.com/aryanpatel142006, connect on LinkedIn (linkedin.com/in/aryanpatel142006), or
visit my site at https://aryan.is-a.dev/.
`.trim();
