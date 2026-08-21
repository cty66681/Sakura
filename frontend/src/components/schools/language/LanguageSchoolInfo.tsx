import {
  Calendar,
  Globe,
  Mail,
  MapPin,
  Phone,
  Train,
  Users,
  GraduationCap,
} from "lucide-react";

import Card from "@/components/ui/Card/Card";

interface Props {
  id: string;
}

export default function LanguageSchoolInfo({ id }: Props) {
  return (
    <Card className="overflow-hidden rounded-3xl p-8">

      {/* Title */}

      <div className="flex items-center gap-3">

        <div className="h-10 w-1 rounded-full bg-blue-600" />

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            学校介绍
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            School Information
          </p>

        </div>

      </div>

      {/* Description */}

      <p className="mt-8 leading-8 text-slate-600">
        东京国际文化学院成立于1990年，
        位于东京新宿区，
        是一所面向国际学生的日语教育机构。
        学校以大学、大学院、
        专门学校升学辅导为核心，
        提供从初级到高级的日语课程，
        同时设有EJU、
        JLPT以及升学指导课程，
        深受亚洲地区留学生欢迎。
      </p>

      {/* Grid */}

      <div className="mt-10 grid gap-5 md:grid-cols-2">

        <InfoItem
          icon={<Calendar size={18} />}
          title="成立时间"
          value="1990 年"
        />

        <InfoItem
          icon={<GraduationCap size={18} />}
          title="学校类型"
          value="日本语言学校"
        />

        <InfoItem
          icon={<Users size={18} />}
          title="学生人数"
          value="约 850 人"
        />

        <InfoItem
          icon={<Users size={18} />}
          title="中国学生比例"
          value="约 58%"
        />

        <InfoItem
          icon={<MapPin size={18} />}
          title="学校地址"
          value="东京都新宿区 ××××"
        />

        <InfoItem
          icon={<Train size={18} />}
          title="最近车站"
          value="JR 新宿站 徒步5分钟"
        />

        <InfoItem
          icon={<Phone size={18} />}
          title="联系电话"
          value="+81-3-XXXX-XXXX"
        />

        <InfoItem
          icon={<Mail size={18} />}
          title="电子邮箱"
          value="info@example.jp"
        />

        <InfoItem
          icon={<Globe size={18} />}
          title="官方网站"
          value="https://www.example.jp"
          link
        />

      </div>

    </Card>
  );
}

interface ItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  link?: boolean;
}

function InfoItem({
  icon,
  title,
  value,
  link,
}: ItemProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-slate-50
        p-5
        transition
        hover:border-blue-300
        hover:bg-white
      "
    >
      <div className="flex items-center gap-3">

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-blue-100
            text-blue-600
          "
        >
          {icon}
        </div>

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          {link ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="
                mt-1
                block
                font-semibold
                text-blue-600
                hover:underline
              "
            >
              {value}
            </a>
          ) : (
            <p className="mt-1 font-semibold text-slate-900">
              {value}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}