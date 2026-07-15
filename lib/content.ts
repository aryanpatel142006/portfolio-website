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
  { name: "HerLaunch Hackathon" },
  { name: "Rutgers University" },
  { name: "Blueprint @ Rutgers" },
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
 * The hidden "beyond the code" section. Unlock it any of four ways:
 *   • the ⌘K palette — type "whoami", "sudo", "off-duty", or "human"
 *   • click your hero photo 5 times
 *   • the Konami code:  ↑ ↑ ↓ ↓ ← → ← → B A
 * Once found it stays unlocked (saved in the browser).
 * Everything below is yours to edit — swap the placeholders for real life.
 */

export type NowItem = {
  label: string; // e.g. "reading", "learning", "playing", "obsessed with"
  value: string; // the thing itself
};

export type MediaItem = {
  title: string;
  creator?: string; // author / artist / director
  kind: "book" | "music" | "show" | "film" | "podcast";
  take?: string; // your one-line hot take
};

export type CatPhoto = {
  src: string; // image path in /public
  caption?: string; // optional hover caption
};

export const offDuty = {
  // A short, human intro line shown under the heading.
  intro:
    "the version of me that isn't staring at a terminal. currently caffeinated, probably losing to my cat.",

  // ── /now — what's true this week. Keep it fresh; it's the point. ──
  now: [
    { label: "reading", value: "«swap me» — a book you're actually reading" },
    { label: "learning", value: "«swap me» — a skill / topic you're picking up" },
    { label: "playing", value: "«swap me» — a game / instrument / sport" },
    { label: "obsessed with", value: "«swap me» — the current rabbit hole" },
  ] as NowItem[],

  // ── hobbies — quick, low-commitment tags. Emoji optional. ──
  hobbies: [
    "☕ chai",
    "🐱 cat dad",
    "🎧 music",
    "📷 photography",
    "🍜 finding the best ramen",
    "🎮 gaming",
  ],

  // ── bookshelf / media diet — the stuff in rotation, with takes. ──
  media: [
    {
      title: "«a book»",
      creator: "author",
      kind: "book",
      take: "one-line take that shows your taste",
    },
    {
      title: "«an album»",
      creator: "artist",
      kind: "music",
      take: "the one on repeat right now",
    },
    {
      title: "«a show»",
      creator: "creator",
      kind: "show",
      take: "the comfort rewatch, no notes",
    },
  ] as MediaItem[],

  // ── cat corner — drop photos in /public and reference them here. ──
  catPhotos: [
    { src: "/cat.png", caption: "the boss" },
    // { src: "/cat2.png", caption: "3am zoomies" },
    // { src: "/travel.png", caption: "somewhere green" },
  ] as CatPhoto[],
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
