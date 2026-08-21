"use client";

import Container from "@/components/layout/Container";

export default function UniversityHero() {
  return (
    <section
      className="
        relative
        overflow-hidden

        bg-gradient-to-br
        from-blue-950
        via-slate-950
        to-slate-900
      "
    >
      {/* Background */}
      <div
        className="
          absolute
          inset-0

          bg-[radial-gradient(circle_at_top_right,#2563eb30,transparent_45%)]
        "
      />

      <Container>
        <div
          className="
            relative
            z-10

            py-24

            text-center
          "
        >
          {/* Badge */}

          <div
            className="
              inline-flex
              items-center
              gap-2

              rounded-full

              border
              border-blue-400/30

              bg-blue-500/10

              px-5
              py-2

              text-sm
              font-semibold

              text-blue-300
            "
          >
            🎓 日本大学
          </div>

          {/* Title */}

          <h1
            className="
              mt-8

              text-6xl

              font-black

              tracking-tight

              text-white
            "
          >
            找到真正适合你的

            <span className="block text-blue-400">
              日本大学
            </span>
          </h1>

          {/* Description */}

          <p
            className="
              mx-auto

              mt-8

              max-w-4xl

              text-lg

              leading-9

              text-slate-300
            "
          >
            国立、私立、大学院、QS排名、EJU要求、学费、
            专业介绍，一站式查询。
          </p>

          {/* Search */}

          <div
            className="
              mx-auto
              mt-12

              max-w-4xl
            "
          >
            这里先放搜索框
          </div>

          {/* Tags */}

          <div
            className="
              mt-10

              flex
              flex-wrap
              justify-center

              gap-4
            "
          >
            {[
              "国立大学",
              "私立大学",
              "大学院",
              "QS排名",
              "EJU",
            ].map((item) => (
              <span
                key={item}
                className="
                  rounded-full

                  border
                  border-blue-400/20

                  bg-white/5

                  px-5
                  py-2

                  text-sm

                  text-slate-300
                "
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}