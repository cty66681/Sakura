import Hero from "@/components/home/Hero";
import JobSection from "@/components/home/JobSection/JobSection";
import FeedSection from "@/components/home/FeedSection";
import HouseSection from "@/components/home/HouseSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import SchoolSection from "@/components/home/SchoolSection";
import ScamSection from "@/components/home/ScamSection";
import AiToolSection from "@/components/home/AiToolSection";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <FeedSection />
        <ScamSection />
        <SchoolSection />
        <ExperienceSection />
        <HouseSection />
        <JobSection />
        <AiToolSection />
      </main>
    </>
  );
}