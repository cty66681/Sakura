import {
  Star,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";

import Card from "@/components/ui/Card/Card";

interface Props {
  id: string;
}

const reviews = [
  {
    name: "陈同学",
    country: "中国",
    year: "2025届",
    score: 5,
    content:
      "老师非常负责，升学辅导也很专业。我从 N3 提升到了 N1，最后顺利考上东京的大学。",
  },
  {
    name: "李同学",
    country: "中国",
    year: "2024届",
    score: 5,
    content:
      "学校位置很好，距离车站近。老师会耐心帮助留学生办理各种手续，非常推荐。",
  },
  {
    name: "王同学",
    country: "中国",
    year: "2023届",
    score: 4,
    content:
      "课程安排比较合理，宿舍环境不错，就是热门时期宿舍比较紧张，需要提前申请。",
  },
];

export default function LanguageSchoolReview({
  id,
}: Props) {
  return (
    <Card className="rounded-3xl p-8">

      {/* Title */}

      <div className="flex items-center gap-3">

        <div className="h-10 w-1 rounded-full bg-blue-600" />

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            学生评价
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Student Reviews
          </p>

        </div>

      </div>

      {/* Score */}

      <div className="mt-8 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white">

        <div className="flex flex-wrap items-center justify-between gap-6">

          <div>

            <div className="text-6xl font-black">
              4.8
            </div>

            <div className="mt-3 flex items-center gap-1">

              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={20}
                  className="fill-yellow-300 text-yellow-300"
                />
              ))}

            </div>

            <p className="mt-3 text-blue-100">
              综合评分（326位学生）
            </p>

          </div>

          <div className="grid gap-4 text-right">

            <div className="flex items-center justify-end gap-2">
              <ThumbsUp size={18} />
              96% 推荐
            </div>

            <div className="flex items-center justify-end gap-2">
              <MessageCircle size={18} />
              已收录 326 条评价
            </div>

          </div>

        </div>

      </div>

      {/* Reviews */}

      <div className="mt-8 space-y-5">

        {reviews.map((item) => (

          <div
            key={item.name + item.year}
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              transition
              hover:border-blue-300
              hover:shadow-lg
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-bold text-slate-900">
                  {item.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {item.country} · {item.year}
                </p>

              </div>

              <div className="flex">

                {Array.from({ length: item.score }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}

              </div>

            </div>

            <p className="mt-5 leading-8 text-slate-600">
              {item.content}
            </p>

          </div>

        ))}

      </div>

    </Card>
  );
}