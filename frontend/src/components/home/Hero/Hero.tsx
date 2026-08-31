import Container from "@/components/layout/Container";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroStats from "./HeroStats";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Background */}

      <HeroBackground />

      {/* Main dark background */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-b
          from-slate-950/98
          via-slate-950/95
          to-slate-950
        "
      />

      {/* Left blue glow */}

      <div
        className="
          pointer-events-none
          absolute
          left-[-180px]
          top-[100px]
          h-[520px]
          w-[520px]
          rounded-full
          bg-blue-600/[0.10]
          blur-[120px]
        "
      />

      {/* Center glow */}

      <div
        className="
          pointer-events-none
          absolute
          left-[38%]
          top-[-260px]
          h-[560px]
          w-[560px]
          rounded-full
          bg-sky-500/[0.07]
          blur-[130px]
        "
      />

      {/* Right violet glow */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-180px]
          top-[120px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-violet-600/[0.08]
          blur-[130px]
        "
      />

      {/* Subtle grid */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)]
          [background-size:48px_48px]
          [mask-image:linear-gradient(to_bottom,black,transparent_90%)]
        "
      />

      {/* Top radial highlight */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-[420px]
          bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.09),transparent_65%)]
        "
      />

      <Container>
        <div
          className="
            relative
            z-10
            grid
            gap-12
            pb-24
            pt-20

            lg:grid-cols-[minmax(0,1.12fr)_minmax(420px,0.88fr)]
            lg:items-center
            lg:gap-14
            lg:pb-28
            lg:pt-24

            xl:grid-cols-[minmax(0,1.16fr)_minmax(460px,0.84fr)]
            xl:gap-20
          "
        >
          {/* Left */}

          <div className="flex min-w-0 justify-start">
            <HeroContent />
          </div>

          {/* Right */}

          <div
            className="
              flex
              min-w-0
              w-full
              justify-center

              lg:justify-end
            "
          >
            <HeroStats />
          </div>
        </div>
      </Container>

      {/* Bottom transition */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-20
          w-full
          bg-gradient-to-b
          from-transparent
          to-slate-50
        "
      />
    </section>
  );
}