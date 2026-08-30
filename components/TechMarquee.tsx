import SectionHeading from "./SectionHeading";

// Devicon glyphs are an icon font that inherits `currentColor`, so we style them
// monochrome ink instead of their default brand colors. Each entry uses the
// icon's actually-available variant (not all have a `plain` version).
const ICONS: { name: string; className: string }[] = [
  { name: "Python", className: "devicon-python-plain" },
  { name: "Java", className: "devicon-java-plain" },
  { name: "C", className: "devicon-c-plain" },
  { name: "SQL", className: "devicon-postgresql-plain" },
  { name: "TypeScript", className: "devicon-typescript-plain" },
  { name: "JavaScript", className: "devicon-javascript-plain" },
  { name: "R", className: "devicon-r-plain" },
  { name: "HTML", className: "devicon-html5-plain" },
  { name: "CSS", className: "devicon-css3-plain" },
  { name: "React", className: "devicon-react-original" },
  { name: "Next.js", className: "devicon-nextjs-plain" },
  { name: "Django", className: "devicon-django-plain" },
  { name: "FastAPI", className: "devicon-fastapi-plain" },
  { name: "Tailwind", className: "devicon-tailwindcss-original" },
  { name: "Supabase", className: "devicon-supabase-plain" },
  { name: "Pandas", className: "devicon-pandas-plain" },
  { name: "NumPy", className: "devicon-numpy-plain" },
  { name: "Scikit-learn", className: "devicon-scikitlearn-plain" },
  { name: "TensorFlow", className: "devicon-tensorflow-original" },
  { name: "Matplotlib", className: "devicon-matplotlib-plain" },
  { name: "PostgreSQL", className: "devicon-postgresql-plain" },
  { name: "MySQL", className: "devicon-mysql-original" },
  { name: "Docker", className: "devicon-docker-plain" },
  { name: "Git", className: "devicon-git-plain" },
  { name: "Postman", className: "devicon-postman-plain" },
  { name: "Jupyter", className: "devicon-jupyter-plain" },
  { name: "Streamlit", className: "devicon-streamlit-plain" },
  { name: "Jira", className: "devicon-jira-plain" },
];

export default function TechMarquee() {
  return (
    <section aria-label="Tech stack">
      <SectionHeading index="01" label="the toolkit" />

      {/* Compact belt — the header row of the skills exhibit below. Generous
          -my/py keeps hover lifts and tooltips from being clipped. */}
      <div className="marquee-group marquee-mask -mt-8 overflow-hidden border-y border-border pt-8 pb-5">
        <div className="marquee-track flex items-center gap-8">
          {/* Two identical copies produce a seamless -50% loop */}
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex shrink-0 items-center gap-8"
              aria-hidden={copy === 1}
            >
              {ICONS.map((icon) => (
                <li
                  key={copy + icon.name}
                  className="group/icon relative flex shrink-0 flex-col items-center"
                >
                  {/* Tooltip — mono chip, fades + rises in on hover */}
                  <span
                    className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 translate-y-1 whitespace-nowrap border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-muted-strong opacity-0 shadow-[var(--shadow)] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/icon:translate-y-0 group-hover/icon:opacity-100"
                    aria-hidden
                  >
                    {icon.name}
                  </span>
                  <i
                    className={`${icon.className} inline-block text-3xl text-foreground/55 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/icon:-translate-y-1 group-hover/icon:text-accent`}
                    role="img"
                    aria-label={copy === 0 ? icon.name : undefined}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
