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
  detail?: string; // e.g. the year, or who granted it
};

export type Certification = {
  name: string;
  issuer: string;
};

export type Experience = {
  role: string;
  org: string;
  location?: string; // e.g. "New Brunswick, NJ"
  period: string; // e.g. "June 2026 → Now"
  active?: boolean; // highlights the row with a live pulse
  bullets?: string[]; // 2–4 impact lines, straight from the resume
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
  kicker: string; // narrative one-liner, e.g. "adaptive accessibility assessment"
  date: string; // e.g. "2025"
  stat?: { value: string; label: string }; // the headline metric on the card
  description?: string;
  highlights?: string[]; // 2–3 bullet-sized proof points
  plate?: "vision" | "launch" | "meta"; // blueprint figure (see ProjectPlate); wins over image
  image?: string; // preview image path in /public
  badges?: ProjectBadge[];
  tags?: string[]; // tech-stack chips
  links?: ProjectLink[];
};

export type Profile = {
  name: string;
  pronunciation?: string; // e.g. "/ar-yun/"
  tagline: string;
  location: string; // shown in the hero marginalia + header clock
  photo?: string; // image path in /public
  photoHover?: string; // shown on hover via a slow crossfade (fun easter egg)
};

/* ────────────────────────────  PROFILE  ──────────────────────────── */

export const profile: Profile = {
  name: "Aryan Patel",
  pronunciation: "/ah-ri-an/",
  tagline:
    "cs & data science student at rutgers, building things that make technology more human.",
  location: "New Brunswick, NJ",
  photo: "/pfp.png", // your photo
  photoHover: "/cat.png", // hover the photo to crossfade to this
};

/* ────────────────────────────  BADGES  ───────────────────────────── */
// The "currently" line in the hero + grounding for the chatbot.

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

/* ───────────────────────────  EDUCATION  ─────────────────────────── */

export const education = {
  school: "Rutgers University",
  degree: "B.S. Computer Science & Data Science · minor in Business Administration",
  period: "Sep 2024 → May 2028",
  location: "New Brunswick, NJ",
  gpa: "3.5",
  honors: ["Honors College", "Dean's List"],
  coursework: [
    "Data Structures",
    "Honors Computer Architecture",
    "Linear Algebra",
    "Discrete Structures I",
  ],
};

/* ─────────────────────  AWARDS & CERTIFICATIONS  ──────────────────── */

export const awards: Award[] = [
  { name: "National Award — Science & Technology Exhibition", detail: "VoxIQ, national showcase" },
  { name: "Rutgers Honors College", detail: "Dean's List" },
  { name: "Break Through Tech AI Fellow", detail: "Cornell Tech" },
  { name: "Blueprint Fellowship", detail: "software engineering" },
];

export const certifications: Certification[] = [
  { name: "Machine Learning Foundations", issuer: "Cornell Tech" },
  { name: "Machine Learning and Image Processing", issuer: "Cisco" },
];

/* ──────────────────────────  EXPERIENCES  ────────────────────────── */
// Use `iconUrl` for a remote logo when you have one; `icon` still shows when `iconUrl` is omitted.

export const experiences: Experience[] = [
  {
    role: "Data Engineer",
    org: "New Brunswick Parking Authority",
    location: "New Brunswick, NJ",
    period: "June 2026 → Present",
    active: true,
    bullets: [
      "Modeling multi-facility financial transaction data in a normalized relational database — replacing Excel-based revenue tracking with a single source of truth for downstream analytics.",
      "Building automated Python + Pandas ETL pipelines over daily revenue time series, targeting a 99%+ cut in manual reporting hours.",
      "Shipping a live revenue dashboard surfacing time-series trends, backed by data validation, role-based access, and audit trails projected to all but eliminate entry errors.",
    ],
    iconUrl: "https://img.logo.dev/njnbpa.org?token=pk_FNeueCUtR0qx7cHP9ZPGrA&format=webp&retina=true",
    icon: "🅿️",
  },
  {
    role: "AI/ML Fellow",
    org: "Break Through Tech @ Cornell Tech",
    location: "New York, NY",
    period: "Mar 2026 → Present",
    active: true,
    bullets: [
      "Selected for Cornell Tech's machine-learning fellowship — ML foundations, applied projects, and industry mentorship.",
    ],
    icon: "🧠",
    iconUrl: "https://img.logo.dev/breakthroughtech.org?token=pk_FNeueCUtR0qx7cHP9ZPGrA&format=webp&retina=true",
  },
  {
    role: "Product Manager + AI/ML Engineer",
    org: "IPser Labs",
    location: "Fort Worth, TX",
    period: "January 2026 → May 2026",
    bullets: [
      "Led a team building core components of a provisional patent-backed system for structured video conferences.",
      "Spearheaded dynamic React interfaces with role-based conversation flows; managed backend logic delivering up to 25% higher system efficiency.",
    ],
    icon: "🤖",
    iconUrl: "https://img.logo.dev/ipserlab.com?token=pk_FNeueCUtR0qx7cHP9ZPGrA&format=webp&retina=true",
  },
  {
    role: "IT Support Engineer",
    org: "Rutgers Digital Classroom Services",
    location: "Piscataway, NJ",
    period: "January 2025 → Present",
    active: true,
    bullets: [
      "Resolving cross-platform hardware, software, and network issues across 15+ buildings serving 10,000+ daily users.",
      "Deploying updates with system administrators and running systematic maintenance to keep classrooms online.",
    ],
    icon: "🖥️",
    iconUrl: "https://img.logo.dev/dcs.rutgers.edu?token=pk_FNeueCUtR0qx7cHP9ZPGrA&format=webp&retina=true",
  },
  {
    role: "Software Engineering Fellow",
    org: "Blueprint",
    location: "remote",
    period: "February 2025 → April 2025",
    bullets: [
      "Software engineering fellowship — shipped production features with a mentored team on a real client project.",
    ],
    icon: "/blueprint.jpg",
  },
];

/* ───────────────────────────  PROJECTS  ──────────────────────────── */
// Rendered as full-width case studies, newest first.

export const projects: Project[] = [
  {
    title: "VoxIQ",
    kicker: "an assessment platform that adapts to any body",
    date: "2025",
    stat: { value: "national", label: "award winner" },
    description:
      "An inclusive, adaptive accessibility assessment platform that scales difficulty from live performance data — so the test meets the person, not the other way around.",
    highlights: [
      "Touchless computer-vision interface — OpenCV + MediaPipe hand-gesture control, no keyboard or mouse required.",
      "Fully audio-navigable via Pyttsx3 speech for visually impaired users.",
      "Won a National Award and was showcased at a national Science & Technology Exhibition.",
    ],
    badges: [{ label: "National Award" }],
    plate: "vision",
    tags: ["Python", "MySQL", "OpenCV", "MediaPipe", "Tkinter", "PyAutoGUI", "Pyttsx3"],
    // links: [{ label: "github", href: "https://github.com/..." }],
    image: "/VoxIQ.png",
  },
  {
    title: "HerLaunch",
    kicker: "a startup incubator for women founders, built in a day",
    date: "2025",
    stat: { value: "24 hrs", label: "idea → full stack" },
    description:
      "An AI-powered incubator hacked together in 24 hours to help women founders reach mentorship and funding — matching, pitch practice, and payments in one place.",
    highlights: [
      "Mentor–mentee matching algorithm plus AI pitch feedback that simulates investor evaluations (Gemini + Presage APIs).",
      "Secure payment processing via the Fiserv API.",
      "Responsive React UI on a Supabase backend — auth, storage, and real-time updates.",
    ],
    badges: [{ label: "Hackathon", icon: "⚡" }],
    plate: "launch",
    tags: ["React", "TypeScript", "Supabase", "Gemini API", "Fiserv API", "Tailwind", "Figma"],
    // links: [{ label: "devpost", href: "https://devpost.com/..." }],
    image: "/HerLaunch.png",
  },
  {
    title: "aryan.is-a.dev",
    kicker: "this site — a portfolio that answers back",
    date: "2026",
    stat: { value: "live", label: "you're inside it" },
    description:
      "The page you're reading: a Next.js 16 site driven by one content file, with an AI chatbot grounded in my real data and a few secrets for the curious.",
    highlights: [
      "\"Query me\" — a streaming AI terminal (Vercel AI SDK + AI Gateway) that only answers from my actual resume data.",
      "Live integrations: Spotify song shelf and AniList anime stats, resolved server-side with graceful fallbacks.",
      "Hidden off-duty world behind a ⌘K command, a Konami code, or tapping my photo five times.",
    ],
    plate: "meta",
    tags: ["Next.js 16", "TypeScript", "Tailwind v4", "Vercel AI SDK", "Spotify", "AniList"],
    links: [{ label: "github", href: "https://github.com/aryanpatel142006/portfolio-website" }],
  },
];

/* ────────────────────────────  STACK  ────────────────────────────── */
// Grouped tech skills shown in the stack section.

export type SkillGroup = {
  label: string;
  items: string[];
};

export const stack: SkillGroup[] = [
  {
    label: "languages",
    items: ["Python", "Java", "C", "SQL", "TypeScript", "JavaScript", "R", "HTML/CSS"],
  },
  {
    label: "quantitative & ml",
    items: ["Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Matplotlib", "Seaborn", "ETL pipelines", "data modeling", "time-series analysis"],
  },
  {
    label: "frameworks",
    items: ["React", "Next.js", "Node.js", "FastAPI", "Django", "Tailwind CSS", "Streamlit", "Hugging Face"],
  },
  {
    label: "databases & tools",
    items: ["MySQL", "PostgreSQL", "Supabase", "Git", "Docker", "Postman", "Jira", "Jupyter", "Google Colab"],
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
    "https://open.spotify.com/track/2oSnGQbI4tZxImmCs2c4PP", // Nasamajh — Aditya Rikhari
    "https://open.spotify.com/track/7eQoMQdE4JqngwYDOqLBU0", // Superstar — dox, JASKARAN, Rita Kim
    // ── japanese city pop (JAP) ──
    "https://open.spotify.com/album/48I17j8JwxGEe2FQAiQ75P", // STAY WITH ME
    "https://open.spotify.com/track/3x4378ztiLvFmm2nuzEI0C", // EVENGELION
    "https://open.spotify.com/track/0kdqcbwei4MDWFEX5f33yG", // bling bang bang born
    "https://open.spotify.com/track/1rN9QoVxw5U7TJkyaUR8C1", // TOKYO GOHUL OPENING
    "https://open.spotify.com/track/6bfjEGSR7DyC8MK8cp3ZCp", // Blood Blockade Battlefront (S1 ED)
    // ── rap ──
    "https://open.spotify.com/track/1Jsos1mzwTwYGOndYN5h8V", // Farebi — Chaar Diwaari, Raftaar
    "https://open.spotify.com/track/7CVw4gVPpH1TPQttQGVmhZ", // Maharani — Karun, Lambo Drive, Arpit Bala
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

/* ────────────────────────  CHATBOT CONTEXT  ──────────────────────── */
/**
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
2026), an AI/ML Fellow with Break Through Tech @ Cornell Tech (since March 2026), and an IT
Support Engineer at Rutgers Digital Classroom Services (since January 2025, supporting 15+
buildings and 10,000+ daily users). Earlier in 2026 I was a Product Manager + AI/ML Engineer
at IPser Labs (Fort Worth, TX) working on a provisional patent-backed structured video
conferencing system, and in early 2025 I was a Software Engineering Fellow at Blueprint.
I'm also a member of SEED2S (Student Equity, Excellence and Diversity in Data Science).

At NBPA I'm architecting a normalized relational database to replace Excel-based revenue
tracking and building automated Python + Pandas ETL pipelines targeting a 99%+ cut in manual
reporting hours, with validation, role-based access, audit trails, and a live revenue dashboard.

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
- This very website (aryan.is-a.dev) — a Next.js 16 portfolio with an AI chatbot grounded in
  my real data, live Spotify and AniList integrations, and hidden easter eggs.

Certifications: Machine Learning Foundations (Cornell Tech) and Machine Learning and Image
Processing (Cisco).

Technical skills: Python, Java, C, SQL, JavaScript, TypeScript, R, HTML, CSS.
Quantitative & ML: Pandas, NumPy, Scikit-learn, TensorFlow, Matplotlib, Seaborn, ETL
pipelines, data modeling, time-series analysis. Frameworks & tools: React, Next.js, Node.js,
FastAPI, Django, Tailwind, Streamlit, Hugging Face, Supabase, MySQL, PostgreSQL, Docker, Git,
Postman, Jira, Jupyter, Google Colab. I work across software engineering and data engineering.

You can reach me at aryanpatel142006@gmail.com or 732-799-9626, find my code at
github.com/aryanpatel142006, connect on LinkedIn (linkedin.com/in/aryanpatel142006), or
visit my site at https://aryan.is-a.dev/.
`.trim();
