import {
  BookOpen,
  Clock3,
  GraduationCap,
  Languages,
} from "lucide-react";

import Card from "@/components/ui/Card/Card";

export type LanguageSchoolCourseData = {
  id: string;
  name: string;
  type: "升学型" | "综合型" | "就业型";
  universitySupport: boolean;
  graduateSupport: boolean;
  tags: string[];
};

interface Props {
  school: LanguageSchoolCourseData;
}

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 正式后端完成后：
|
| GET /api/language-schools/:id/courses
|
| 建议返回：
|
| [
|   {
|     id: string;
|     title: string;
|     level: string;
|     duration: string;
|     target: string;
|     category: string;
|   }
| ]
|
| 现在暂时根据学校类型和升学支持情况生成 MOCK 课程。
|
|--------------------------------------------------------------------------
*/

type Course = {
  title: string;
  level: string;
  duration: string;
  target: string;
  color:
    | "emerald"
    | "cyan"
    | "violet"
    | "amber";
};

const colorMap = {
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    border: "hover:border-emerald-300",
  },

  cyan: {
    bg: "bg-cyan-100",
    text: "text-cyan-600",
    border: "hover:border-cyan-300",
  },

  violet: {
    bg: "bg-violet-100",
    text: "text-violet-600",
    border: "hover:border-violet-300",
  },

  amber: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    border: "hover:border-amber-300",
  },
};

export default function LanguageSchoolCourse({
  school,
}: Props) {
  const courses = getCourses(school);

  return (
    <section
      id="course"
      className="scroll-mt-28"
    >
      <Card className="rounded-3xl p-8">
        {/* Title */}

        <div className="flex items-center gap-3">
          <div className="h-10 w-1 rounded-full bg-emerald-600" />

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              课程设置
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Course Information
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-emerald-50 px-5 py-4">
          <p className="text-sm leading-7 text-emerald-800">
            当前为{" "}
            <span className="font-bold">
              {school.name}
            </span>{" "}
            的课程参考信息。实际课程、入学时期和班级设置，
            以后将直接读取学校数据库。
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {courses.map((course) => {
            const style =
              colorMap[course.color];

            return (
              <div
                key={course.title}
                className={`
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                  ${style.border}
                `}
              >
                <div className="flex items-center justify-between gap-4">
                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      ${style.bg}
                      ${style.text}
                    `}
                  >
                    <BookOpen size={24} />
                  </div>

                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      ${style.bg}
                      ${style.text}
                    `}
                  >
                    {course.level}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {course.title}
                </h3>

                <div className="mt-6 space-y-4">
                  <InfoRow
                    icon={
                      <Clock3 size={17} />
                    }
                    label="学习时间"
                    value={
                      course.duration
                    }
                  />

                  <InfoRow
                    icon={
                      <GraduationCap
                        size={17}
                      />
                    }
                    label="适合人群"
                    value={
                      course.target
                    }
                  />

                  <InfoRow
                    icon={
                      <Languages
                        size={17}
                      />
                    }
                    label="日语等级"
                    value={course.level}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}

function getCourses(
  school: LanguageSchoolCourseData
): Course[] {
  const courses: Course[] = [
    {
      title: "长期课程",
      level: "N5 ～ N1",
      duration:
        "1年 / 1年6个月 / 2年",
      target:
        school.type === "就业型"
          ? "日语强化 · 在日就业"
          : "升学 · 日语强化",
      color: "emerald",
    },

    {
      title: "短期课程",
      level: "N5 ～ N2",
      duration: "3个月 ～ 6个月",
      target:
        "体验留学 · 日语提升",
      color: "cyan",
    },

    {
      title: "JLPT 冲刺班",
      level: "N4 ～ N1",
      duration: "约 8 ～ 12 周",
      target: "JLPT 考试",
      color: "amber",
    },
  ];

  if (school.universitySupport) {
    courses.splice(2, 0, {
      title: "EJU 升学班",
      level: "N2 以上",
      duration: "全年",
      target: "日本大学本科升学",
      color: "violet",
    });
  }

  if (school.graduateSupport) {
    courses.push({
      title: "大学院升学辅导",
      level: "N2 ～ N1",
      duration: "6个月 ～ 1年",
      target:
        "大学院 · 研究计划书 · 面试",
      color: "violet",
    });
  }

  if (school.type === "就业型") {
    courses.push({
      title: "商务日语 · 就业班",
      level: "N3 ～ N1",
      duration: "3个月 ～ 1年",
      target:
        "求职 · 面试 · 商务日语",
      color: "cyan",
    });
  }

  return courses;
}

interface RowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({
  icon,
  label,
  value,
}: RowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0 text-slate-400">
        {icon}
      </div>

      <span className="shrink-0 text-sm text-slate-500">
        {label}
      </span>

      <span className="ml-auto text-right text-sm font-medium leading-6 text-slate-800">
        {value}
      </span>
    </div>
  );
}