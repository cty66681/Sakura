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

export type LanguageSchoolInfoData = {
  id: string;
  name: string;
  description: string;
  address: string;
  type: "升学型" | "综合型" | "就业型";
  website: string;
  chineseSupport: boolean;

  /*
  |--------------------------------------------------------------------------
  | TODO [API - GET]
  |--------------------------------------------------------------------------
  |
  | 后端学校详情接口完成后，下面这些字段也建议直接由接口返回：
  |
  | GET /api/language-schools/:id
  |
  | foundedYear
  | studentCount
  | chineseStudentRatio
  | nearestStation
  | phone
  | email
  |
  |--------------------------------------------------------------------------
  */

  foundedYear?: number;
  studentCount?: number;
  chineseStudentRatio?: number;
  nearestStation?: string;
  phone?: string;
  email?: string;
};

interface Props {
  school: LanguageSchoolInfoData;
}

export default function LanguageSchoolInfo({
  school,
}: Props) {
  const foundedYear =
    school.foundedYear ?? 1990;

  const studentCount =
    school.studentCount ?? 850;

  const chineseStudentRatio =
    school.chineseStudentRatio ??
    (school.chineseSupport ? 58 : 25);

  const nearestStation =
    school.nearestStation ??
    getMockStation(school.address);

  const phone =
    school.phone ?? "+81-3-XXXX-XXXX";

  const email =
    school.email ?? "info@example.jp";

  return (
    <section
      id="info"
      className="scroll-mt-28"
    >
      <Card className="overflow-hidden rounded-3xl p-8">
        {/* Title */}

        <div className="flex items-center gap-3">
          <div className="h-10 w-1 rounded-full bg-emerald-600" />

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
          {school.description}
        </p>

        {/* Grid */}

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <InfoItem
            icon={<Calendar size={18} />}
            title="成立时间"
            value={`${foundedYear} 年`}
          />

          <InfoItem
            icon={
              <GraduationCap size={18} />
            }
            title="学校类型"
            value={school.type}
          />

          <InfoItem
            icon={<Users size={18} />}
            title="学生人数"
            value={`约 ${studentCount.toLocaleString()} 人`}
          />

          <InfoItem
            icon={<Users size={18} />}
            title="中国学生比例"
            value={`约 ${chineseStudentRatio}%`}
          />

          <InfoItem
            icon={<MapPin size={18} />}
            title="学校地址"
            value={school.address}
          />

          <InfoItem
            icon={<Train size={18} />}
            title="最近车站"
            value={nearestStation}
          />

          <InfoItem
            icon={<Phone size={18} />}
            title="联系电话"
            value={phone}
          />

          <InfoItem
            icon={<Mail size={18} />}
            title="电子邮箱"
            value={email}
          />

          <InfoItem
            icon={<Globe size={18} />}
            title="官方网站"
            value={school.website}
            link
          />
        </div>
      </Card>
    </section>
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
        hover:border-emerald-300
        hover:bg-white
      "
    >
      <div className="flex items-start gap-3">
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-emerald-100
            text-emerald-600
          "
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm text-slate-500">
            {title}
          </p>

          {link ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-1
                block
                break-all
                font-semibold
                text-emerald-600
                hover:underline
              "
            >
              {value}
            </a>
          ) : (
            <p className="mt-1 font-semibold leading-7 text-slate-900">
              {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function getMockStation(
  address: string
) {
  if (address.includes("新宿")) {
    return "JR 新宿站 徒步约 5 分钟";
  }

  if (address.includes("大阪")) {
    return "JR 大阪站 徒步约 8 分钟";
  }

  if (address.includes("京都")) {
    return "JR 京都站 徒步约 10 分钟";
  }

  if (
    address.includes("名古屋") ||
    address.includes("爱知")
  ) {
    return "JR 名古屋站 徒步约 8 分钟";
  }

  if (
    address.includes("福冈") ||
    address.includes("博多")
  ) {
    return "JR 博多站 徒步约 7 分钟";
  }

  if (
    address.includes("北海道") ||
    address.includes("札幌")
  ) {
    return "JR 札幌站 徒步约 10 分钟";
  }

  return "最近车站信息准备中";
}