import {
  BookOpen,
  Clock3,
  GraduationCap,
  Languages,
} from "lucide-react";

import Card from "@/components/ui/Card/Card";

interface Props {
  id: string;
}

const courses = [
  {
    title: "长期课程",
    level: "N5 ～ N1",
    duration: "1年 / 1年6个月 / 2年",
    target: "升学 · 大学院 · 专门学校",
    color: "blue",
  },
  {
    title: "短期课程",
    level: "N5 ～ N2",
    duration: "3个月 ～ 6个月",
    target: "体验留学 · 日语提升",
    color: "emerald",
  },
  {
    title: "EJU升学班",
    level: "N2以上",
    duration: "全年",
    target: "大学本科升学",
    color: "violet",
  },
  {
    title: "JLPT冲刺班",
    level: "N4 ～ N1",
    duration: "8周",
    target: "JLPT考试",
    color: "amber",
  },
];

const colorMap = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    border: "hover:border-blue-300",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    border: "hover:border-emerald-300",
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
  id,
}: Props) {
  return (
    <Card className="rounded-3xl p-8">

      {/* Title */}

      <div className="flex items-center gap-3">

        <div className="h-10 w-1 rounded-full bg-blue-600" />

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            课程设置
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Course Information
          </p>

        </div>

      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        {courses.map((course) => {

          const style = colorMap[
            course.color as keyof typeof colorMap
          ];

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

              <div className="flex items-center justify-between">

                <div
                  className={`
                    flex
                    h-12
                    w-12
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

              <div className="mt-6 space-y-3">

                <InfoRow
                  icon={<Clock3 size={17} />}
                  label="学习时间"
                  value={course.duration}
                />

                <InfoRow
                  icon={<GraduationCap size={17} />}
                  label="适合人群"
                  value={course.target}
                />

                <InfoRow
                  icon={<Languages size={17} />}
                  label="日语等级"
                  value={course.level}
                />

              </div>

            </div>
          );
        })}

      </div>

    </Card>
  );
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
    <div className="flex items-center gap-3">

      <div className="text-slate-400">
        {icon}
      </div>

      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="ml-auto font-medium text-slate-800">
        {value}
      </span>

    </div>
  );
}