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

/** Last-known AniList numbers, shown with a "last synced" note whenever the
    live API is unreachable. Read them off anilist.co/user/<name>/stats. */
export type AnimeSnapshot = {
  syncedAt: string; // ISO date (YYYY-MM-DD)
  count: number;
  episodesWatched: number;
  minutesWatched: number;
  watchingCount: number;
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
    "CS & Data Science student at Rutgers. I build data pipelines, ML tools, and interfaces that make technology more human.",
  location: "New Brunswick, NJ",
  photo: "/pfp.png", // your photo
  photoHover: "/cat.png", // hover the photo to crossfade to this
};

/* ────────────────────────────  BADGES  ───────────────────────────── */
// The "currently" line in the hero + grounding for the chatbot.

export const statusBadges: StatusBadge[] = [
  { role: "Student", org: "Rutgers University", icon: "/rutgers.png" },
  { role: "Data Engineer", org: "New Brunswick Parking Authority", icon: "/nbpa.png", size: 44 },
  {
    role: "AI Fellow",
    org: "American Express",
    iconUrl: "https://img.logo.dev/americanexpress.com?token=pk_FNeueCUtR0qx7cHP9ZPGrA&format=webp&retina=true",
    iconAlt: "American Express",
  },
];

/* ────────────────────────────  SOCIALS  ──────────────────────────── */

/** Links that should leave the page in a new tab: external URLs, and
    documents like the resume PDF — a recruiter mid-skim shouldn't lose
    their place on the page to a full-tab PDF viewer. */
export function opensNewTab(href: string) {
  return href.startsWith("http") || href.endsWith(".pdf");
}

export const socials: Social[] = [
  { type: "email", href: "mailto:aryanpatel142006@gmail.com", label: "Email" },
  { type: "github", href: "https://github.com/aryanpatel142006", label: "GitHub" },
  { type: "linkedin", href: "https://linkedin.com/in/aryanpatel142006/", label: "LinkedIn" },
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
  { name: "National Award, Science & Technology Exhibition", detail: "VoxIQ, national showcase" },
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
    role: "AI Fellow",
    org: "American Express",
    location: "New York, NY",
    period: "Sep 2026 → Dec 2026",
    active: true,
    bullets: [
      "Second-Look Lending, through Break Through Tech's AI Studio: building credit-risk models on consumer-loan data to predict applicant default probability, benchmarking logistic regression, random forests, and gradient boosting (XGBoost, LightGBM) against a production baseline.",
      "Evaluating on a time-based holdout with ROC-AUC, LogLoss, and calibration (reliability curves, Brier score); translating predicted risk into profit-aware lending decisions under a defined cost model.",
      "Optimizing an Inclusive Profit Score (expected portfolio profit minus a penalty for the thin-file inclusion gap) so applicants with little credit history get a fair second look.",
    ],
    icon: "💳",
    iconUrl: "https://img.logo.dev/americanexpress.com?token=pk_FNeueCUtR0qx7cHP9ZPGrA&format=webp&retina=true",
  },
  {
    role: "Data Engineer",
    org: "New Brunswick Parking Authority",
    location: "New Brunswick, NJ",
    period: "June 2026 → Present",
    active: true,
    bullets: [
      "Modeling multi-facility financial transaction data in a normalized relational database, replacing Excel-based revenue tracking with a single source of truth for downstream analytics.",
      "Building automated Python + Pandas ETL pipelines over daily revenue time series, a 99%+ cut in manual reporting time, saving 500+ hours a year.",
      "Shipping a live revenue dashboard surfacing time-series trends, backed by data validation, role-based access, and audit trails.",
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
      "Selected for Cornell Tech's machine-learning fellowship: ML foundations, applied projects, and industry mentorship.",
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
      "Software engineering fellowship: shipped production features with a mentored team on a real client project.",
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
      "An inclusive, adaptive accessibility assessment platform that scales difficulty from live performance data, so the test meets the person, not the other way around.",
    highlights: [
      "Touchless computer-vision interface: OpenCV + MediaPipe hand-gesture control, no keyboard or mouse required.",
      "Fully audio-navigable via Pyttsx3 speech for visually impaired users.",
      "Won a National Award and was showcased at a national Science & Technology Exhibition.",
    ],
    badges: [{ label: "National Award" }],
    plate: "vision",
    tags: ["Python", "MySQL", "OpenCV", "MediaPipe", "Tkinter", "PyAutoGUI", "Pyttsx3"],
    links: [{ label: "github", href: "https://github.com/aryanpatel142006/CBSE-SCIENCE-EXHIBITION" }],
    image: "/VoxIQ.png",
  },
  {
    title: "HerLaunch",
    kicker: "a startup incubator for women founders, built in a day",
    date: "2025",
    stat: { value: "24 hrs", label: "idea → full stack" },
    description:
      "An AI-powered incubator hacked together in 24 hours to help women founders reach mentorship and funding: matching, pitch practice, and payments in one place.",
    highlights: [
      "Mentor–mentee matching algorithm plus AI pitch feedback that simulates investor evaluations (Gemini + Presage APIs).",
      "Secure payment processing via the Fiserv API.",
      "Responsive React UI on a Supabase backend: auth, storage, and real-time updates.",
    ],
    badges: [{ label: "Hackathon", icon: "⚡" }],
    plate: "launch",
    tags: ["React", "TypeScript", "Supabase", "Gemini API", "Fiserv API", "Tailwind", "Figma"],
    links: [
      { label: "devpost", href: "https://devpost.com/software/herlaunch" },
      { label: "github", href: "https://github.com/aryanpatel142006/HackHers-2026" },
    ],
    image: "/HerLaunch.png",
  },
  {
    title: "aryan.is-a.dev",
    kicker: "this site, a portfolio that answers back",
    date: "2026",
    stat: { value: "live", label: "you're inside it" },
    description:
      "The page you're reading: a Next.js 16 site driven by one content file, with an AI chatbot grounded in my real data and a few secrets for the curious.",
    highlights: [
      "\"Query me\": a streaming AI terminal (Vercel AI SDK + AI Gateway) that only answers from my actual resume data.",
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
    label: "quantitative & ml",
    items: ["Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Matplotlib", "Seaborn", "ETL pipelines", "data modeling", "time-series analysis"],
  },
  {
    label: "languages",
    items: ["Python", "Java", "C", "SQL", "TypeScript", "JavaScript", "R", "HTML/CSS"],
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
export type SongLang = "en" | "hi" | "gu" | "pa" | "jp";
/** A Spotify link or a plain "Song — Artist" name, plus the language it's
    sung in (rendered as a small chip) and, optionally, the scene it's from. */
export type SongEntry =
  | string
  | { src: string; lang: SongLang; scene?: string };

export const offDuty = {
  // A short, human intro line shown under the heading.
  intro:
    "the version of me that isn't staring at a terminal: chasing progress in the gym, queuing up an anime, listening to the most random songs, and doing garba till my legs give out.",

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
    { src: "https://open.spotify.com/track/3StShCGECtZMW2yp9XkFYv", lang: "en" }, // There It Is
    { src: "https://open.spotify.com/track/1Xp2sxCBpDFCcerKKh1ik7", lang: "gu" }, // Majja Ni Life
    { src: "https://open.spotify.com/track/4N7LGbba3i05Ymt3lUN4IT", lang: "en" }, // car keys — Tsumyoki
    { src: "https://open.spotify.com/track/6vH6xKa1vh9ihWrLYZAmU8", lang: "hi" }, // Banda Kaam Ka
    { src: "https://open.spotify.com/track/0pMACt1jSBlH8mKdaE1TSv", lang: "en" }, // Don't Even Text — gini
    { src: "https://open.spotify.com/track/4TFYFMssJiMwREPUauwWbt", lang: "hi" }, // Saanvare

    // ── desi indie / bollymood deep cuts ──
    { src: "https://open.spotify.com/track/2oSnGQbI4tZxImmCs2c4PP", lang: "hi" }, // Nasamajh — Aditya Rikhari
    { src: "https://open.spotify.com/track/7eQoMQdE4JqngwYDOqLBU0", lang: "pa" }, // Superstar — dox, JASKARAN, Rita Kim
    { src: "Samjho Na — Aditya Rikhari", lang: "hi" },
    // ── punjabi ──
    { src: "Wavy — Karan Aujla", lang: "pa" },
    { src: "For A Reason — Karan Aujla", lang: "pa" },
    { src: "Dil Nu — AP Dhillon", lang: "pa" }, // AP Dhillon & Shinda Kahlon; say so if you meant Maninder Buttar's
    { src: "Boyfriend — Karan Aujla", lang: "pa" },
    { src: "9:45 — Prabh Singh", lang: "pa" }, // Prabh Singh & Jay Trak
    { src: "Tauba Tauba — Karan Aujla", lang: "pa" }, // from Bad Newz
    // ── japanese: city pop + anime ──
    { src: "Stay With Me — Miki Matsubara", lang: "jp", scene: "city pop" }, // (album links don't resolve; the name does)
    { src: "https://open.spotify.com/track/3x4378ztiLvFmm2nuzEI0C", lang: "jp", scene: "anime op" }, // Cruel Angel's Thesis
    { src: "https://open.spotify.com/track/0kdqcbwei4MDWFEX5f33yG", lang: "jp", scene: "anime op" }, // Bling-Bang-Bang-Born
    { src: "https://open.spotify.com/track/1rN9QoVxw5U7TJkyaUR8C1", lang: "jp", scene: "anime op" }, // unravel (Tokyo Ghoul)
    { src: "https://open.spotify.com/track/6bfjEGSR7DyC8MK8cp3ZCp", lang: "jp", scene: "anime ed" }, // Sugar Song to Bitter Step
    // ── rap ──
    { src: "https://open.spotify.com/track/1Jsos1mzwTwYGOndYN5h8V", lang: "hi", scene: "rap" }, // Farebi — Chaar Diwaari, Raftaar
    { src: "https://open.spotify.com/track/7CVw4gVPpH1TPQttQGVmhZ", lang: "hi", scene: "rap" }, // Maharani — Karun, Lambo Drive

    // ── gujarati ──
    { src: "Luv Ni Love Storys — Aditya Gadhvi", lang: "gu" },
    { src: "Tari Madh Mithi Madh Mithi Vaate", lang: "gu" },
    { src: "Mane Malje", lang: "gu" },
    { src: "Ramo Re", lang: "gu" },
    { src: "Gori Radha Ne Kalo Kaan — Kirtidan Gadhvi", lang: "gu", scene: "garba" }, // the artist keeps it off the covers
    { src: "Khalasi — Aditya Gadhvi", lang: "gu" },
    { src: "Radha Ne Kaan Kare Vaat — Aditya Gadhvi", lang: "gu", scene: "garba" },
    { src: "Maar To Mele", lang: "gu" }, // resolves to the Ishani Dave cut; add "— Geeta Rabari" if you meant hers
    { src: "Dwarikadhish Ne Khamma", lang: "gu" },
    { src: "Helo Maro — Sachin-Jigar", lang: "gu" },
    { src: "Dakla 2 Extended Mix — Bandish Projekt", lang: "gu", scene: "garba" }, // plain "Dakla 2" lands on the original Dakla

  ] as SongEntry[],

  // ── anime stats — live from AniList (public profile, no auth needed). ──
  //  username: the AniList handle to pull stats from. Empty/placeholder hides
  //  the whole section. showStats: master toggle. comparisons: optional custom
  //  "i could've done X in this much time" jokes, picked by hours watched.
  anilist: {
    username: "aryanpatel142006",
    showStats: true,
    comparisons: [] as { hours: number; line: string }[],
    // Fallback when AniList's API refuses server-side requests (it has been
    // blocking non-browser clients). Set to null to hide the section instead.
    snapshot: {
      syncedAt: "2026-09-09",
      count: 139,
      episodesWatched: 3463,
      minutesWatched: 82574,
      watchingCount: 14,
    } as AnimeSnapshot | null,
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

I love building things that make technology more human: accessible, useful, and a little
delightful. Right now I'm an AI Fellow at American Express through Break Through Tech's AI
Studio (Sep–Dec 2026, New York), a Data Engineer at the New Brunswick Parking Authority (since
June 2026), an AI/ML Fellow with Break Through Tech @ Cornell Tech (since March 2026), and an IT
Support Engineer at Rutgers Digital Classroom Services (since January 2025, supporting 15+
buildings and 10,000+ daily users). Earlier in 2026 I was a Product Manager + AI/ML Engineer
at IPser Labs (Fort Worth, TX) working on a provisional patent-backed structured video
conferencing system, and in early 2025 I was a Software Engineering Fellow at Blueprint.
I'm also a member of SEED2S (Student Equity, Excellence and Diversity in Data Science).

For summer 2027 I'm looking for an internship in data engineering, ML, software engineering,
or a forward deployed engineer role. Fintech is where I'd most like to land. I'm not looking
for research positions.

At American Express my AI Studio project is "Second-Look Lending": using synthetic
consumer-loan data and classical ML (logistic regression, random forests, gradient boosting with
XGBoost and LightGBM) to predict each applicant's default risk and turn it into a profit-aware,
fair lending decision for people with thin credit files. Models are judged on a time-based
holdout with ROC-AUC, LogLoss, and calibration (reliability curves, Brier score) against a
logistic-regression baseline; the decision layer is judged on expected portfolio profit under a
cost model and the thin-file inclusion gap, combined into an Inclusive Profit Score. Milestones
run EDA and feature engineering (September), model exploration and hyperparameter tuning with
grid and Bayesian search (October), then final scoring and a Streamlit demo app (November). A
stretch goal is a self-attention model to surface high-order feature interactions.

At NBPA I'm architecting a normalized relational database to replace Excel-based revenue
tracking and building automated Python + Pandas ETL pipelines that cut manual reporting
time by 99%+ (saving 500+ hours a year), with validation, role-based access, audit trails, and a live revenue dashboard.

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
- This very website (aryan.is-a.dev), a Next.js 16 portfolio with an AI chatbot grounded in
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
