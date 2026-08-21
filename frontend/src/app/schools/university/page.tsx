import UniversityHero from "@/components/schools/university/UniversityHero";
import FilterSidebar from "@/components/schools/university/FilterSidebar";
import UniversityCard from "@/components/schools/university/UniversityCard";

export default function UniversityPage() {
  return (
    <main className="bg-slate-50 min-h-screen">

      {/* Hero */}

      <UniversityHero />

      {/* 分类 */}

      <section className="border-b bg-white">

        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-6 py-5">

          {[
            "全部",
            "国立大学",
            "公立大学",
            "私立大学",
            "大学院",
            "QS排名",
            "EJU",
            "文科",
            "理科",
            "医学",
            "艺术",
          ].map((item, index) => (
            <button
              key={item}
              className={`rounded-full px-5 py-2 text-sm transition
              ${
                index === 0
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          ))}

        </div>

      </section>

      {/* 内容 */}

      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="grid grid-cols-[280px_1fr] gap-8">

          {/* 左侧 */}

          <FilterSidebar />

          {/* 右侧 */}

          <div>

            {/* 标题 */}

            <div className="mb-8 flex items-center justify-between">

              <div>

                <h2 className="text-3xl font-black">
                  日本大学
                </h2>

                <p className="mt-2 text-slate-500">
                  共找到 813 所大学
                </p>

              </div>

              <select className="rounded-xl border px-4 py-3">

                <option>推荐排序</option>

                <option>QS 排名</option>

                <option>学费最低</option>

                <option>外国人评价</option>

              </select>

            </div>

            {/* Card */}

            <div className="space-y-8">

              <UniversityCard
                id="tokyo"
                name="东京大学"
                image="/images/university/university01.jpg"
                location="东京"
                type="国立大学"
                qs={28}
                hensachi={72}
                tuition="535,800円/年"
                eju
                rating={4.9}
                tags={[
                  "计算机",
                  "AI",
                  "医学",
                  "奖学金",
                  "英语课程",
                ]}
              />

              <UniversityCard
                id="waseda"
                name="早稻田大学"
                image="/images/university/university02.jpg"
                location="东京"
                type="私立大学"
                qs={181}
                hensachi={70}
                tuition="1,100,000円/年"
                eju
                rating={4.8}
                tags={[
                  "商科",
                  "传媒",
                  "法学",
                  "留学生宿舍",
                ]}
              />

              <UniversityCard
                id="kyoto"
                name="京都大学"
                image="/images/university/university03.jpg"
                location="京都"
                type="国立大学"
                qs={46}
                hensachi={71}
                tuition="535,800円/年"
                eju
                rating={4.8}
                tags={[
                  "理工",
                  "医学",
                  "研究型",
                  "奖学金",
                ]}
              />

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}