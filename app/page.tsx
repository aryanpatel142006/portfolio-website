import Hero from "@/components/Hero";
import Divider from "@/components/Divider";
import TechMarquee from "@/components/TechMarquee";
import StackGroups from "@/components/StackGroups";
import QueryMe from "@/components/QueryMe";
import Experiences from "@/components/Experiences";
import CaseStudies from "@/components/CaseStudies";
import Recognition from "@/components/Recognition";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import OffDuty from "@/components/OffDuty";

export default function Home() {
  return (
    <main id="top" className="fade-up mx-auto w-[92%] py-10 sm:w-[88%] sm:py-14">
      <Reveal>
        <Hero />
      </Reveal>

      <Divider />

      <Reveal>
        <TechMarquee />
        <StackGroups />
      </Reveal>

      <Divider />

      <Reveal delay={60}>
        <QueryMe />
      </Reveal>

      <Divider />

      <Reveal>
        <Experiences />
      </Reveal>

      <Divider />

      <Reveal>
        <CaseStudies />
      </Reveal>

      <Divider />

      <Reveal>
        <Recognition />
      </Reveal>

      {/* Hidden until unlocked (⌘K "whoami" · tap the photo 5× · Konami code) */}
      <OffDuty />

      <Footer />
    </main>
  );
}
