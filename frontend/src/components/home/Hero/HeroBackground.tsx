export default function HeroBackground() {
  return (
    <>
      {/* Grid Background */}

      <div
        className="
          absolute
          inset-0
          -z-20

          bg-[linear-gradient(to_right,#e2e8f020_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f020_1px,transparent_1px)]

          bg-[size:48px_48px]
        "
      />

      {/* Blue Glow */}

      <div
        className="
          absolute
          left-[-180px]
          top-[-120px]

          -z-10

          h-[420px]
          w-[420px]

          rounded-full

          bg-blue-400/20

          blur-[140px]
        "
      />

      {/* Purple Glow */}

      <div
        className="
          absolute
          right-[-180px]
          top-[120px]

          -z-10

          h-[420px]
          w-[420px]

          rounded-full

          bg-violet-400/20

          blur-[140px]
        "
      />

      {/* Bottom Glow */}

      <div
        className="
          absolute
          bottom-[-220px]
          left-1/2

          -z-10

          h-[520px]
          w-[520px]

          -translate-x-1/2

          rounded-full

          bg-cyan-300/10

          blur-[180px]
        "
      />

      {/* Noise Overlay */}

      <div
        className="
          absolute
          inset-0

          -z-10

          opacity-[0.03]

          mix-blend-overlay

          bg-[radial-gradient(circle_at_center,black_1px,transparent_1px)]

          bg-[size:16px_16px]
        "
      />
    </>
  );
}