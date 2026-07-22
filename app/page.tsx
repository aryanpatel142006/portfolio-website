import Hero from "@/components/Hero";
import Divider from "@/components/Divider";
import TechMarquee from "@/components/TechMarquee";
import QueryMe from "@/components/QueryMe";
import Experiences from "@/components/Experiences";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import OffDuty from "@/components/OffDuty";

export default function Home() {
  return (
    <main className="mx-auto w-[92%] py-16 sm:w-[90%] sm:py-24 lg:w-[80%] xl:w-[60%] 2xl:w-[40%]">
      <Reveal>
        <Hero />
      </Reveal>
      <Divider />
      <Reveal>
        <TechMarquee />
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
