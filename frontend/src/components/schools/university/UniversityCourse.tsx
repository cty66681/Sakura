"use client";

type UniversityCourseData = {
  degree: "大学" | "大学院";
  tags: string[];
};

type Props = {
  university: UniversityCourseData;
};

export default function UniversityCourse({
  university,
}: Props) {
  const undergraduateCourses = [
    {
      name: "文学部",
      description: "文学、语言、历史、哲学及文化研究等方向。",
      tags: ["文学", "语言", "历史"],
    },
    {
      name: "法学部",
      description: "法律、政治、公共政策等方向。",
      tags: ["法律", "政治", "公共政策"],
    },
    {
      name: "经济学部",
      description: "经济学、经营学、金融及国际经济等方向。",
      tags: ["经济", "经营", "金融"],
    },
    {
      name: "工学部",
      description: "机械、电子、信息、建筑、材料等工程领域。",
      tags: ["工学", "AI", "计算机"],
    },
    {
      name: "理学部",
      description: "数学、物理、化学、生物及基础科学研究。",
      tags: ["数学", "物理", "化学"],
    },
    {
      name: "医学部",
      description: "医学、生命科学及相关医疗研究领域。",
      tags: ["医学", "生命科学"],
    },
  ];

  const graduateCourses = [
    {
      name: "人文社会系研究科",
      description: "面向修士、博士阶段的人文与社会科学研究。",
      tags: ["修士", "博士", "人文"],
    },
    {
      name: "法学政治学研究科",
      description: "法律、政治以及公共政策相关高级研究。",
      tags: ["修士", "博士", "法律"],
    },
    {
      name: "经济学研究科",
      description: "经济、金融、经营及相关研究领域。",
      tags: ["修士", "博士", "经济"],
    },
    {
      name: "工学系研究科",
      description: "AI、计算机、机械、电子、建筑等研究方向。",
      tags: ["AI", "计算机", "工学"],
    },
    {
      name: "理学系研究科",
      description: "数学、物理、化学、生物等基础科学研究。",
      tags: ["理学", "研究型"],
    },
    {
      name: "医学系研究科",
      description: "医学、生命科学以及医疗相关研究方向。",
      tags: ["医学", "博士"],
    },
  ];

  const courses =
    university.degree === "大学院"
      ? graduateCourses
      : undergraduateCourses;

  return (
    <section
      id="course"
      className="
        scroll-mt-28
        rounded-[28px]
        border
        border-slate-200
        bg-white
        p-8
        shadow-sm
      "
    >
      <div>
        <h2 className="text-2xl font-black text-slate-900">
          {university.degree === "大学院"
            ? "研究科・研究方向"
            : "学部・专业设置"}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {university.degree === "大学院"
            ? "查看主要研究科、修士 / 博士课程及研究方向"
            : "查看主要学部及专业方向"}
        </p>
      </div>

      {/* 当前学校标签 */}

      {university.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {university.tags.map((tag) => (
            <span
              key={tag}
              className="
                rounded-full
                bg-blue-50
                px-3
                py-1.5
                text-xs
                font-bold
                text-blue-600
              "
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 专业 / 研究科 */}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {courses.map((course) => (
          <div
            key={course.name}
            className="
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-6
              transition
              hover:border-blue-200
              hover:bg-blue-50/40
            "
          >
            <h3 className="text-lg font-black text-slate-900">
              {course.name}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {course.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    text-slate-500
                  "
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs leading-6 text-slate-400">
        ※ 当前为页面开发阶段的 Mock 数据，实际学部、研究科及募集信息以后由后台数据提供。
      </p>
    </section>
  );
}