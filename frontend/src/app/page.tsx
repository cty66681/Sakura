import Header from "@/components/layout/Herader";
import Hero from "@/components/home/Hero";
import JobSection from "@/components/home/JobSection/JobSection";
import Button from "@/components/ui/Button";
import FeedSection from "@/components/home/FeedSection";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <FeedSection />
        <JobSection />
      </main>
    </>
  );
}