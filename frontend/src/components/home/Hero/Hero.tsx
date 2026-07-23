import Container from "@/components/layout/Container";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroStats from "./HeroStats";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">

      <HeroBackground />

      <Container>

        <div className="relative z-10 flex min-h-screen flex-col items-center gap-20 py-24 lg:flex-row">

          {/* Left */}

          <div className="flex-1">
            <HeroContent />
          </div>

          {/* Right */}

          <div className="flex w-full justify-center lg:w-auto">

            <HeroStats />

          </div>

        </div>

      </Container>

    </section>
  );
}