import Header from "@/components/layout/Herader";
import Hero from "@/components/home/Hero";
import JobSection from "@/components/home/JobSection/JobSection";
import Button from "@/components/ui/Button";
import FeedSection from "@/components/home/FeedSection";
import HouseSection from "@/components/home/HouseSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import SchoolSection from "@/components/home/SchoolSection";
import ScamSection from "@/components/home/ScamSection";
import AiToolSection from "@/components/home/AiToolSection";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <FeedSection />
        <JobSection />
        <HouseSection />
        <SchoolSection />
        <ExperienceSection />
        <ScamSection />
        <AiToolSection />
      </main>
    </>
  );
}