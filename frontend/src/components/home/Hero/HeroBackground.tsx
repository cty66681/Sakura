export default function HeroBackground() {
  return (
    <>
      {/* Grid */}

      <div
        className="
          absolute
          inset-0
          -z-30

          bg-[linear-gradient(to_right,#dbeafe25_1px,transparent_1px),linear-gradient(to_bottom,#dbeafe25_1px,transparent_1px)]
          bg-[size:46px_46px]
        "
      />

      {/* Top Glow */}

      <div
        className="
          absolute
          -left-60
          -top-52

          -z-20

          h-[620px]
          w-[620px]

          rounded-full

          bg-blue-500/25

          blur-[170px]

          animate-pulse
        "
      />

      {/* Right Glow */}

      <div
        className="
          absolute
          -right-60
          top-10

          -z-20

          h-[560px]
          w-[560px]

          rounded-full

          bg-violet-500/20

          blur-[170px]

          animate-pulse
        "
        style={{
          animationDelay: "1.5s",
        }}
      />

      {/* Bottom */}

      <div
        className="
          absolute
          left-1/2
          bottom-[-260px]

          -z-20

          h-[700px]
          w-[700px]

          -translate-x-1/2

          rounded-full

          bg-cyan-400/15

          blur-[200px]
        "
      />

      {/* Aurora */}

      <div
        className="
          absolute
          inset-0

          -z-10

          bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,.12),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,.12),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(6,182,212,.10),transparent_32%)]
        "
      />

      {/* Left Beam */}

      <div
        className="
          absolute
          left-[-120px]
          top-0

          -z-10

          h-full
          w-[340px]

          rotate-[18deg]

          bg-gradient-to-b
          from-blue-400/15
          via-blue-300/5
          to-transparent

          blur-3xl
        "
      />

      {/* Right Beam */}

      <div
        className="
          absolute
          right-[-120px]
          top-0

          -z-10

          h-full
          w-[340px]

          -rotate-[18deg]

          bg-gradient-to-b
          from-violet-400/15
          via-fuchsia-300/5
          to-transparent

          blur-3xl
        "
      />

      {/* Floating Circle 1 */}

      <div
        className="
          absolute
          left-[12%]
          top-[22%]

          -z-10

          h-5
          w-5

          rounded-full

          bg-blue-400/70

          blur-sm

          animate-bounce
        "
      />

      {/* Floating Circle 2 */}

      <div
        className="
          absolute
          right-[18%]
          top-[30%]

          -z-10

          h-4
          w-4

          rounded-full

          bg-violet-400/70

          blur-sm

          animate-bounce
        "
        style={{
          animationDelay: "1s",
        }}
      />

      {/* Floating Circle 3 */}

      <div
        className="
          absolute
          left-[42%]
          bottom-[22%]

          -z-10

          h-3
          w-3

          rounded-full

          bg-cyan-400/70

          blur-sm

          animate-bounce
        "
        style={{
          animationDelay: "2s",
        }}
      />

      {/* Noise */}

      <div
        className="
          absolute
          inset-0

          -z-10

          opacity-[0.03]

          mix-blend-overlay

          bg-[radial-gradient(circle_at_center,black_1px,transparent_1px)]

          bg-[size:14px_14px]
        "
      />

      {/* Fade */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0

          h-56

          bg-gradient-to-b
          from-transparent
          to-white
        "
      />
    </>
  );
}