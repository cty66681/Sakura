import {
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarDays,
  Globe,
  GraduationCap,
  Languages,
  MapPin,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card/Card";

export type CollegeInfoData = {
  id: string;

  name: string;
  description: string;

  location: string;
  area: string;
  address: string;

  category:
    | "IT・AI"
    | "设计・动漫"
    | "商务・观光"
    | "美容・时尚"
    | "医疗・福祉"
    | "汽车・技术";

  internationalSupport: boolean;
  chineseSupport: boolean;
  visaSupport: boolean;

  website: string;

  foundedYear?: number;
  studentCount?: number;
  internationalStudentRatio?: number;
  courseCount?: number;
};

interface Props {
  school: CollegeInfoData;
}

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 正式后端完成后：
|
| GET /api/colleges/:id
|
| 详情数据建议包含：
|
| foundedYear
| studentCount
| internationalStudentRatio
| courseCount
| address
| description
| internationalSupport
| chineseSupport
| visaSupport
|
|--------------------------------------------------------------------------
*/

export default function CollegeInfo({
  school,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | MOCK DATA
  |--------------------------------------------------------------------------
  |
  | 后端接入后删除这些 fallback。
  |
  |--------------------------------------------------------------------------
  */

  const foundedYear =
    school.foundedYear ??
    getMockFoundedYear(
      school.id
    );

  const studentCount =
    school.studentCount ??
    getMockStudentCount(
      school.id
    );

  const internationalStudentRatio =
    school.internationalStudentRatio ??
    getMockInternationalRatio(
      school.id
    );

  const courseCount =
    school.courseCount ??
    getMockCourseCount(
      school.category
    );

  return (
    <section
      id="info"
      className="scroll-mt-28"
    >
      <Card className="rounded-3xl p-8">
        {/* Title */}

        <div className="flex items-center gap-3">
          <div className="h-10 w-1 rounded-full bg-orange-500" />

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

        {/* Main Data */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoStat
            icon={
              <CalendarDays
                size={20}
              />
            }
            label="创立时间"
            value={`${foundedYear}年`}
          />

          <InfoStat
            icon={
              <Users size={20} />
            }
            label="在校学生"
            value={`约 ${studentCount.toLocaleString()} 人`}
          />

          <InfoStat
            icon={
              <GraduationCap
                size={20}
              />
            }
            label="专业学科"
            value={`${courseCount} 个方向`}
          />

          <InfoStat
            icon={
              <Languages
                size={20}
              />
            }
            label="留学生比例"
            value={`约 ${internationalStudentRatio}%`}
          />
        </div>

        {/* School Details */}

        <div className="mt-10 border-t border-slate-100 pt-8">
          <h3 className="text-lg font-bold text-slate-900">
            基本信息
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <DetailItem
              icon={
                <Building2
                  size={18}
                />
              }
              label="学校类型"
              value="专门学校"
            />

            <DetailItem
              icon={
                <BookOpen
                  size={18}
                />
              }
              label="主要领域"
              value={
                school.category
              }
            />

            <DetailItem
              icon={
                <MapPin size={18} />
              }
              label="所在地区"
              value={
                school.location
              }
            />

            <DetailItem
              icon={
                <MapPin size={18} />
              }
              label="学校地址"
              value={
                school.address
              }
            />
          </div>
        </div>

        {/* International Support */}

        <div className="mt-10 border-t border-slate-100 pt-8">
          <div className="flex items-center gap-2">
            <Globe
              size={20}
              className="text-orange-500"
            />

            <h3 className="text-lg font-bold text-slate-900">
              留学生支持
            </h3>
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            对于留学生来说，
            除了专业课程本身，
            就业指导、签证以及语言支持也是选择专门学校时的重要条件。
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <SupportCard
              active={
                school.internationalSupport
              }
              title="留学生支持"
              description={
                school.internationalSupport
                  ? "提供留学生学习、生活及就业相关支持"
                  : "当前暂无明确的专项留学生支持信息"
              }
            />

            <SupportCard
              active={
                school.chineseSupport
              }
              title="中文支持"
              description={
                school.chineseSupport
                  ? "可提供中文咨询或面向中国学生的相关支持"
                  : "主要以日语或其他语言提供咨询"
              }
            />

            <SupportCard
              active={
                school.visaSupport
              }
              title="签证支持"
              description={
                school.visaSupport
                  ? "提供留学签证及在留手续相关指导"
                  : "当前暂无明确的签证专项支持信息"
              }
            />
          </div>
        </div>

        {/* Website */}

        <div className="mt-8 rounded-2xl bg-orange-50 p-5">
          <div className="flex items-start gap-3">
            <BadgeCheck
              size={20}
              className="mt-0.5 shrink-0 text-orange-600"
            />

            <div>
              <p className="font-bold text-orange-800">
                Sakura 提示
              </p>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                专门学校的专业名称、
                招生条件、学费以及外国人入学要求可能每年发生变化。
                正式申请前建议再次确认学校最新募集要项和官方网站信息。
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Components
|--------------------------------------------------------------------------
*/

function InfoStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-slate-50
        p-5
        transition
        hover:border-orange-200
        hover:bg-orange-50/40
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          bg-orange-100
          text-orange-600
        "
      >
        {icon}
      </div>

      <p className="mt-4 text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl bg-slate-50 p-5">
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-white
          text-orange-600
          shadow-sm
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

function SupportCard({
  active,
  title,
  description,
}: {
  active: boolean;
  title: string;
  description: string;
}) {
  return (
    <div
      className={`
        rounded-2xl
        border
        p-5
        ${
          active
            ? "border-emerald-200 bg-emerald-50"
            : "border-slate-200 bg-slate-50"
        }
      `}
    >
      <div className="flex items-center gap-2">
        <BadgeCheck
          size={18}
          className={
            active
              ? "text-emerald-600"
              : "text-slate-300"
          }
        />

        <p
          className={
            active
              ? "font-bold text-emerald-800"
              : "font-bold text-slate-500"
          }
        >
          {title}
        </p>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| MOCK Helpers
|--------------------------------------------------------------------------
|
| 正式数据库完成后，这些函数删除。
|
|--------------------------------------------------------------------------
*/

function getMockFoundedYear(
  id: string
) {
  const data: Record<
    string,
    number
  > = {
    "tokyo-tech-ai": 1987,
    "tokyo-design": 1992,
    "osaka-computer": 1985,
    "kyoto-design": 1996,
    "nagoya-business": 1990,
    "fukuoka-tourism": 1988,
    "tokyo-beauty": 1994,
    "osaka-medical": 1986,
    "yokohama-auto": 1982,
    "saitama-it": 1998,
  };

  return data[id] ?? 1990;
}

function getMockStudentCount(
  id: string
) {
  const data: Record<
    string,
    number
  > = {
    "tokyo-tech-ai": 1450,
    "tokyo-design": 1280,
    "osaka-computer": 1680,
    "kyoto-design": 920,
    "nagoya-business": 850,
    "fukuoka-tourism": 780,
    "tokyo-beauty": 1100,
    "osaka-medical": 1350,
    "yokohama-auto": 980,
    "saitama-it": 720,
  };

  return data[id] ?? 800;
}

function getMockInternationalRatio(
  id: string
) {
  const data: Record<
    string,
    number
  > = {
    "tokyo-tech-ai": 32,
    "tokyo-design": 28,
    "osaka-computer": 30,
    "kyoto-design": 18,
    "nagoya-business": 38,
    "fukuoka-tourism": 35,
    "tokyo-beauty": 24,
    "osaka-medical": 16,
    "yokohama-auto": 22,
    "saitama-it": 36,
  };

  return data[id] ?? 25;
}

function getMockCourseCount(
  category: CollegeInfoData["category"]
) {
  const data: Record<
    CollegeInfoData["category"],
    number
  > = {
    "IT・AI": 6,
    "设计・动漫": 7,
    "商务・观光": 5,
    "美容・时尚": 6,
    "医疗・福祉": 5,
    "汽车・技术": 4,
  };

  return data[category];
}