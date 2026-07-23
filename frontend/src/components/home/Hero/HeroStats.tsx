import Card from "@/components/ui/Card";
import {
  BriefcaseBusiness,
  House,
  GraduationCap,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    icon: BriefcaseBusiness,
    label: "工作",
    value: "142",
    color: "text-blue-600",
  },
  {
    icon: House,
    label: "房源",
    value: "58",
    color: "text-emerald-600",
  },
  {
    icon: GraduationCap,
    label: "学校",
    value: "18",
    color: "text-violet-600",
  },
  {
    icon: ShieldAlert,
    label: "防骗",
    value: "11",
    color: "text-red-500",
  },
];

export default function HeroStats() {
  return (
    <Card
      glass
      className="
        w-full
        max-w-md
        rounded-[32px]
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            今日新增
          </p>

          <h2 className="mt-1 text-3xl font-bold">
            Sakura
          </h2>

        </div>

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center

            rounded-2xl

            bg-blue-100
          "
        >
          <Sparkles
            className="text-blue-600"
            size={28}
          />
        </div>

      </div>

      {/* Divider */}

      <div className="my-8 h-px bg-slate-200" />

      {/* Stats */}

      <div className="grid grid-cols-2 gap-5">

        {stats.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.label}
              className="
                rounded-2xl

                border

                border-slate-100

                bg-slate-50/80

                p-5

                transition

                hover:bg-white
              "
            >

              <Icon
                size={24}
                className={item.color}
              />

              <p className="mt-4 text-3xl font-bold">

                {item.value}

              </p>

              <p className="mt-1 text-sm text-slate-500">

                {item.label}

              </p>

            </div>

          );

        })}

      </div>

      {/* Divider */}

      <div className="my-8 h-px bg-slate-200" />

      {/* AI */}

      <div
        className="
          rounded-3xl

          bg-gradient-to-r

          from-blue-600

          via-indigo-600

          to-violet-600

          p-6

          text-white
        "
      >

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-blue-100">

              AI 推荐

            </p>

            <h3 className="mt-2 text-xl font-bold">

              Java Backend Engineer

            </h3>

          </div>

          <TrendingUp size={28} />

        </div>

        <button
          className="
            mt-6

            w-full

            rounded-2xl

            bg-white

            py-3

            font-semibold

            text-blue-700

            transition

            hover:scale-[1.02]
          "
        >
          查看推荐
        </button>

      </div>

    </Card>
  );
}