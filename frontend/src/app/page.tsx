import Hero from "@/components/home/Hero";
import FeedSection from "@/components/home/FeedSection";
import SchoolSection from "@/components/home/SchoolSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import ScamSection from "@/components/home/ScamSection";
import AiToolSection from "@/components/home/AiToolSection";
import HouseSection from "@/components/home/HouseSection";
import JobSection from "@/components/home/JobSection/JobSection";

export default function Home() {
  return (
    <main>
      {/* 1. 第一屏：搜索 + 核心入口 */}
      <Hero />

      {/* 2. 今日动态：让首页保持“活着” */}
      <FeedSection />

      {/* 3. Sakura 核心：学校 */}
      <SchoolSection />

      {/* 4. Sakura 核心：在日真实经验 */}
      <ExperienceSection />

      {/* 5. Sakura 核心：避坑 */}
      <ScamSection />

      {/* 6. Sakura AI */}
      <AiToolSection />

      {/* 7. 扩展服务：房源 */}
      <HouseSection />

      {/* 8. 扩展服务：工作 */}
      <JobSection />
    </main>
  );
}