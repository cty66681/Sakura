import Header from "@/components/layout/Herader";
import Hero from "@/components/home/Hero";
import JobSection from "@/components/home/JobSection/JobSection";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <JobSection />
      </main>
    </>
  );
}