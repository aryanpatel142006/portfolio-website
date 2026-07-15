"use client";

import { useState } from "react";
import { projects } from "@/lib/content";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import SectionHeading from "./SectionHeading";

export default function Projects() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (projects.length === 0) return null;

  return (
    <section aria-label="Projects">
      <SectionHeading>projects</SectionHeading>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} onOpen={() => setOpenIndex(i)} />
        ))}
      </div>

      {openIndex !== null && (
        <ProjectModal
          project={projects[openIndex]}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  );
}
