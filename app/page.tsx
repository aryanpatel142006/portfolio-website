import Hero from "@/components/Hero";
import Divider from "@/components/Divider";
import AwardsMarquee from "@/components/AwardsMarquee";
import QueryMe from "@/components/QueryMe";
import Experiences from "@/components/Experiences";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import TechStack from "@/components/TechStack";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      {/* Narrow column for the reading sections */}
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <Hero />
        </Reveal>
        <Divider />
        <Reveal>
          <AwardsMarquee />
        </Reveal>
        <div className="h-14 sm:h-16" />
        <Reveal delay={60}>
          <QueryMe />
        </Reveal>
        <Divider />
        <Reveal>
          <Experiences />
        </Reveal>
        {/* <div className="h-14 sm:h-16" />
        <Reveal>
          <TechStack />
        </Reveal> */}
        <div className="h-14 sm:h-16" />
      </div>

      {/* Wider container for the projects grid */}
      <Reveal>
        <Projects />
      </Reveal>

      <div className="mx-auto max-w-2xl">
        <Footer />
      </div>
    </main>
  );
}
