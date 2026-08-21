import {
  BadgeCheck,
  ExternalLink,
  Globe,
  Heart,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card/Card";

interface Props {
  id: string;
}

export default function LanguageSchoolSidebar({
  id,
}: Props) {
  return (
    <div className="sticky top-24 space-y-6">

      {/* 报名 */}

      <Card className="rounded-3xl p-6">

        <h3 className="text-xl font-bold text-slate-900">
          快速申请
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          提交申请信息后，
          后期可直接对接学校或中介机构。
        </p>

        <Button className="mt-6 h-12 w-full">
          我要报名
        </Button>

        <Button
          variant="outline"
          className="mt-3 h-12 w-full"
        >
          <ExternalLink
            size={18}
            className="mr-2"
          />

          官网查看
        </Button>

      </Card>

      {/* AI */}

      <Card className="rounded-3xl p-6">

        <div className="flex items-center gap-2">

          <Sparkles
            size={18}
            className="text-blue-600"
          />

          <h3 className="font-bold text-slate-900">
            Sakura AI 推荐
          </h3>

        </div>

        <p className="mt-4 text-sm leading-7 text-slate-600">
          适合：
          <br />
          ✔ 升学
          <br />
          ✔ JLPT N2~N1
          <br />
          ✔ EJU
          <br />
          ✔ 长期留学
        </p>

        <div className="mt-5 rounded-2xl bg-blue-50 p-4">

          <div className="flex items-center gap-2">

            <BadgeCheck
              size={18}
              className="text-blue-600"
            />

            <span className="font-semibold text-blue-700">
              AI 推荐指数
            </span>

          </div>

          <div className="mt-3 text-4xl font-black text-blue-600">
            95
          </div>

          <p className="mt-1 text-xs text-slate-500">
            非常推荐
          </p>

        </div>

      </Card>

      {/* 联系 */}

      <Card className="rounded-3xl p-6">

        <h3 className="font-bold text-slate-900">
          联系学校
        </h3>

        <div className="mt-5 space-y-3">

          <button
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              border
              border-slate-200
              px-4
              py-3
              transition
              hover:border-blue-300
            "
          >

            <MessageCircle size={18} />

            在线咨询

          </button>

          <button
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              border
              border-slate-200
              px-4
              py-3
              transition
              hover:border-blue-300
            "
          >

            <Heart size={18} />

            收藏学校

          </button>

          <button
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              border
              border-slate-200
              px-4
              py-3
              transition
              hover:border-blue-300
            "
          >

            <Globe size={18} />

            官方网站

          </button>

        </div>

      </Card>

    </div>
  );
}