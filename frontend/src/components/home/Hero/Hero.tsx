
import Container from "@/components/layout/Container";
import HeroContent from "./HeroContent";
import HeroStats from "./HeroStats";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAF9F7]">
      {/* 顶部一点柔和的暖色，不使用科技感光晕 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-[320px]
          bg-gradient-to-b
          from-[#FFF1ED]
          via-[#FFF8F5]
          to-transparent
        "
      />

      <Container>
        <div
          className="
            relative
            mx-auto
            max-w-[1120px]
            pb-14
            pt-12
            sm:pb-20
            sm:pt-16
            lg:pt-20
          "
        >
          <HeroContent />

          {/* Sakura 特色：生活处境导航 */}
          <div className="mx-auto mt-9 max-w-[940px] sm:mt-12">
            <HeroStats />
          </div>
        </div>
      </Container>
    </section>
  );
}
