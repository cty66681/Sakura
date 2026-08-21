import Container from "@/components/layout/Container";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroStats from "./HeroStats";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">

      {/* Background */}
      <HeroBackground />

      {/* Dark Overlay */}

      <div
        className="
          absolute
          inset-0

          bg-gradient-to-b

          from-slate-950

          via-slate-950/95

          to-slate-900
        "
      />

      {/* Grid */}

      <div
        className="
          absolute
          inset-0

          opacity-[0.05]

          [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)]

          [background-size:40px_40px]
        "
      />

      <Container>

        <div
          className="
            relative
            z-10

            grid

            min-h-[860px]

            items-center

            gap-20

            py-24

            lg:grid-cols-[56%_44%]
          "
        >

          {/* Left */}

          <div
            className="
              flex
              justify-start
            "
          >
            <HeroContent />
          </div>

          {/* Right */}

          <div
            className="
              flex
              justify-end
              items-center
              w-full
            "
          >
            <HeroStats />
          </div>

        </div>

      </Container>

      {/* Bottom Fade */}

      <div
        className="
          absolute
          bottom-0
          left-0

          h-32
          w-full

          bg-gradient-to-b

          from-transparent

          to-slate-50
        "
      />

    </section>
  );
}