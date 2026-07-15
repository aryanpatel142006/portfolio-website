import Hero from "@/components/Hero";
import Divider from "@/components/Divider";
import AwardsMarquee from "@/components/AwardsMarquee";
import QueryMe from "@/components/QueryMe";
import Experiences from "@/components/Experiences";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import OffDuty from "@/components/OffDuty";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
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
      <div className="h-14 sm:h-16" />
      <Reveal>
        <Projects />
      </Reveal>

      {/* Hidden until unlocked (⌘K "whoami" · tap the photo 5× · Konami code) */}
      <OffDuty />
      <Footer />
    </main>
  );
}
