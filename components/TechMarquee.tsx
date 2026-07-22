// Devicon glyphs are an icon font that inherits `currentColor`, so we style them
// monochrome (text-white/*) instead of their default brand colors. Each entry uses
// the icon's actually-available variant (not all have a `plain` version).
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
  { name: "Matplotlib", className: "devicon-matplotlib-plain" },
  { name: "Docker", className: "devicon-docker-plain" },
  { name: "Git", className: "devicon-git-plain" },
  { name: "Postman", className: "devicon-postman-plain" },
  { name: "Jupyter", className: "devicon-jupyter-plain" },
  { name: "PyCharm", className: "devicon-pycharm-plain" },
  { name: "VS Code", className: "devicon-vscode-plain" },
  { name: "LaTeX", className: "devicon-latex-original" },
  { name: "Jira", className: "devicon-jira-plain" },
];

export default function TechMarquee() {
  return (
    <section aria-label="Tech stack">
      {/* Generous -my/py keeps the hover lift AND the tooltip (which sits above the
          icons) from being clipped by the overflow-hidden the loop requires. */}
      <div className="marquee-group marquee-mask -my-12 overflow-hidden py-12">
        <div className="marquee-track flex items-center gap-10">
          {/* Two identical copies produce a seamless -50% loop */}
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex shrink-0 items-center gap-10"
              aria-hidden={copy === 1}
            >
              {ICONS.map((icon) => (
                <li
                  key={copy + icon.name}
                  className="group/icon relative flex shrink-0 flex-col items-center"
                >
                  {/* Tooltip — minimalist mono chip, fades + rises in on hover */}
                  <span
                    className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-white/10 bg-[#1b2121]/95 px-2.5 py-1 font-mono text-[11px] text-muted-strong opacity-0 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.7)] backdrop-blur-sm transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/icon:translate-y-0 group-hover/icon:opacity-100"
                    aria-hidden
                  >
                    {icon.name}
                  </span>
                  <i
                    className={`${icon.className} inline-block text-4xl text-white/50 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/icon:-translate-y-1 group-hover/icon:text-white`}
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
