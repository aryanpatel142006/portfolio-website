import { certifications, education } from "@/lib/content";
import SectionHeading from "./SectionHeading";

/** Education and certifications — the receipts, set like a colophon. */
export default function Recognition() {
  return (
    <section id="record" aria-label="Recognition" className="scroll-mt-20">
      <SectionHeading index="05" label="the record" />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* education */}
        <div>
          <p className="kicker mb-4">education</p>
          <h3 className="display text-xl text-foreground">{education.school}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-strong">
            {education.degree}
          </p>
          <p className="mt-2 font-mono text-[11px] text-muted">
            {education.period} · GPA {education.gpa}
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-strong">
            {education.honors.join(" · ")}
          </p>
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
            {education.coursework.join(", ")}
          </p>
        </div>

        {/* certifications */}
        <div>
          <p className="kicker mb-4">certifications</p>
          <ul className="flex flex-col">
            {certifications.map((c) => (
              <li
                key={c.name}
                className="border-b border-border py-3 first:border-t"
              >
                <p className="text-[13.5px] text-foreground">{c.name}</p>
                <p className="mt-0.5 font-mono text-[11px] text-muted">
                  {c.issuer}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
