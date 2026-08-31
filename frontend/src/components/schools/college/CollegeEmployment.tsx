import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  GraduationCap,
  Languages,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card/Card";

export type CollegeEmploymentData = {
  id: string;
  name: string;

  category:
    | "IT・AI"
    | "设计・动漫"
    | "商务・观光"
    | "美容・时尚"
    | "医疗・福祉"
    | "汽车・技术";

  employmentRate: number;

  internationalSupport: boolean;
  chineseSupport: boolean;
  visaSupport: boolean;
};

interface Props {
  school: CollegeEmploymentData;
}

type EmploymentData = {
  employmentRate: number;
  internationalEmploymentRate: number;

  jobSeekers: number;
  employedStudents: number;

  majorEmployers: string[];

  jobTypes: string[];

  support: string[];

  salaryMin: number;
  salaryMax: number;
};

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 正式后端完成后：
|
| GET /api/colleges/:id/employment
|
| 示例：
|
| GET /api/colleges/tokyo-tech-ai/employment
|
| 建议返回：
|
| {
|   employmentRate: number;
|   internationalEmploymentRate: number;
|
|   jobSeekers: number;
|   employedStudents: number;
|
|   majorEmployers: string[];
|   jobTypes: string[];
|
|   support: string[];
|
|   salary: {
|     min: number;
|     max: number;
|   };
|
|   updatedAt: string;
| }
|
| 当前使用 MOCK DATA。
|
|--------------------------------------------------------------------------
*/

export default function CollegeEmployment({
  school,
}: Props) {
  const employment =
    getMockEmployment(school);

  return (
    <section
      id="employment"
      className="scroll-mt-28"
    >
      <Card className="rounded-3xl p-8">
        {/* Header */}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-1 rounded-full bg-orange-500" />

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                就业情况
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Employment & Career
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
            <TrendingUp size={15} />

            就业率 {employment.employmentRate}%
          </div>
        </div>

        <p className="mt-7 leading-8 text-slate-600">
          专门学校与大学相比更加重视职业技能和毕业后的实际就业。
          以下数据用于展示
          <span className="mx-1 font-bold text-slate-900">
            {school.name}
          </span>
          的就业情况、主要就业方向以及学校提供的求职支持。
        </p>

        {/* Main Stats */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={
              <BriefcaseBusiness size={21} />
            }
            label="整体就业率"
            value={`${employment.employmentRate}%`}
            description="希望就业学生"
          />

          <StatCard
            icon={
              <Languages size={21} />
            }
            label="留学生就业率"
            value={`${employment.internationalEmploymentRate}%`}
            description="外国人学生参考"
          />

          <StatCard
            icon={
              <Users size={21} />
            }
            label="求职学生"
            value={`${employment.jobSeekers} 人`}
            description="当前 Mock 年度"
          />

          <StatCard
            icon={
              <CheckCircle2 size={21} />
            }
            label="成功就业"
            value={`${employment.employedStudents} 人`}
            description="取得内定 / 就职"
          />
        </div>

        {/* Employment Rate */}

        <div className="mt-8 rounded-3xl bg-slate-950 p-7 text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-orange-300">
                <Target size={18} />

                EMPLOYMENT RATE
              </div>

              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-black tracking-tight">
                  {employment.employmentRate}
                </span>

                <span className="pb-1 text-2xl font-bold text-orange-400">
                  %
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-400">
                当前展示的就业数据为开发阶段 Mock 数据。
              </p>
            </div>

            <div className="w-full max-w-md">
              <div className="flex justify-between text-xs text-slate-400">
                <span>就业进度</span>

                <span>
                  {employment.employedStudents} /{" "}
                  {employment.jobSeekers}
                </span>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                  style={{
                    width: `${Math.min(
                      employment.employmentRate,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Job Types */}

        <div className="mt-9 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <GraduationCap size={20} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  主要就业方向
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Typical Career Paths
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {employment.jobTypes.map(
                (job) => (
                  <div
                    key={job}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
                  >
                    <CheckCircle2
                      size={17}
                      className="shrink-0 text-emerald-500"
                    />

                    <span className="text-sm font-medium text-slate-700">
                      {job}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Employers */}

          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Building2 size={20} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  主要就业企业
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Example Employers
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {employment.majorEmployers.map(
                (company) => (
                  <div
                    key={company}
                    className="
                      flex
                      min-h-14
                      items-center
                      rounded-xl
                      border
                      border-slate-100
                      bg-slate-50
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    {company}
                  </div>
                )
              )}
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-400">
              ※ 当前企业名称为页面开发用示例数据，
              正式上线后由学校就业实绩数据替换。
            </p>
          </div>
        </div>

        {/* Salary */}

        <div className="mt-9 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">
                毕业初期月薪参考
              </p>

              <p className="mt-2 text-xs leading-6 text-slate-500">
                根据专业方向生成的开发阶段参考范围，
                不代表学校保证工资。
              </p>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              <p className="text-xs font-medium text-slate-400">
                月薪参考
              </p>

              <p className="mt-1 text-2xl font-black text-slate-950">
                ¥
                {employment.salaryMin.toLocaleString()}
                {" 〜 "}
                ¥
                {employment.salaryMax.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Career Support */}

        <div className="mt-9">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness
              size={20}
              className="text-orange-500"
            />

            <h3 className="text-lg font-bold text-slate-900">
              就业支持
            </h3>
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            对留学生来说，
            除了学校整体就业率之外，
            是否提供外国人求职指导、
            履历书修改以及签证支持同样重要。
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {employment.support.map(
              (item) => (
                <div
                  key={item}
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                  "
                >
                  <BadgeCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-orange-500"
                  />

                  <span className="text-sm font-medium leading-6 text-slate-700">
                    {item}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* International */}

        {school.internationalSupport && (
          <div className="mt-9 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <Languages size={20} />
              </div>

              <div>
                <h3 className="font-bold text-emerald-900">
                  留学生就业支持
                </h3>

                <p className="mt-2 text-sm leading-7 text-emerald-800/80">
                  该学校当前标记为提供留学生支持。
                  在正式数据库中，这里会进一步展示外国人就业实绩、
                  留学生就业企业、工作签证转换支持以及对应专业的就业情况。
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {school.chineseSupport && (
                    <SupportTag>
                      中文咨询
                    </SupportTag>
                  )}

                  {school.visaSupport && (
                    <SupportTag>
                      就职签证支持
                    </SupportTag>
                  )}

                  <SupportTag>
                    留学生求职指导
                  </SupportTag>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notice */}

        <div className="mt-6 rounded-2xl bg-orange-50 p-5">
          <div className="flex items-start gap-3">
            <BadgeCheck
              size={20}
              className="mt-0.5 shrink-0 text-orange-600"
            />

            <div>
              <p className="font-bold text-orange-800">
                Sakura 就业数据提示
              </p>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                查看学校就业率时需要注意统计口径。
                有些学校使用“希望就业者中的就业人数”，
                并不等于全部毕业生就业率。
                正式上线后 Sakura 会尽量同时展示统计年度、
                样本人数以及数据来源，方便用户比较。
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

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
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
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
        {icon}
      </div>

      <p className="mt-4 text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

function SupportTag({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700">
      {children}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| MOCK DATA
|--------------------------------------------------------------------------
|
| 正式数据库完成后删除 getMockEmployment。
|
|--------------------------------------------------------------------------
*/

function getMockEmployment(
  school: CollegeEmploymentData
): EmploymentData {
  const base =
    getCategoryEmployment(
      school.category
    );

  const jobSeekers =
    base.jobSeekers;

  const employedStudents =
    Math.round(
      jobSeekers *
        (school.employmentRate /
          100)
    );

  return {
    ...base,

    employmentRate:
      school.employmentRate,

    employedStudents,

    internationalEmploymentRate:
      Math.max(
        75,
        school.employmentRate -
          (school.internationalSupport
            ? 3
            : 10)
      ),
  };
}

function getCategoryEmployment(
  category: CollegeEmploymentData["category"]
): Omit<
  EmploymentData,
  | "employmentRate"
  | "internationalEmploymentRate"
  | "employedStudents"
> {
  switch (category) {
    case "IT・AI":
      return {
        jobSeekers: 318,

        majorEmployers: [
          "日本IT企业",
          "软件开发公司",
          "Web服务企业",
          "系统集成企业",
          "云服务企业",
          "企业信息系统部门",
        ],

        jobTypes: [
          "系统工程师（SE）",
          "Web工程师",
          "程序开发工程师",
          "AI・数据相关工程师",
          "云・基础设施工程师",
        ],

        support: [
          "IT企业校内说明会",
          "履历书・职务申请材料指导",
          "模拟面试与技术面试训练",
          "企业实习及项目经验支持",
          "留学生商务日语与面试指导",
          "就职签证转换相关咨询",
        ],

        salaryMin: 220000,
        salaryMax: 280000,
      };

    case "设计・动漫":
      return {
        jobSeekers: 246,

        majorEmployers: [
          "设计事务所",
          "动漫制作公司",
          "游戏开发企业",
          "广告制作公司",
          "Web设计企业",
          "内容制作企业",
        ],

        jobTypes: [
          "平面设计师",
          "角色设计师",
          "动漫制作人员",
          "游戏设计师",
          "UI・Web设计师",
        ],

        support: [
          "作品集 Portfolio 制作指导",
          "设计行业企业说明会",
          "创意行业面试训练",
          "企业合作制作项目",
          "毕业作品展示支持",
          "留学生就业与签证咨询",
        ],

        salaryMin: 210000,
        salaryMax: 260000,
      };

    case "商务・观光":
      return {
        jobSeekers: 205,

        majorEmployers: [
          "酒店集团",
          "旅行公司",
          "航空相关企业",
          "贸易公司",
          "零售服务企业",
          "国际商务企业",
        ],

        jobTypes: [
          "酒店工作人员",
          "观光服务人员",
          "机场地勤",
          "国际贸易事务",
          "营业・销售职",
        ],

        support: [
          "商务日语强化训练",
          "酒店・观光企业实习",
          "接客与面试训练",
          "履历书修改指导",
          "企业联合招聘说明会",
          "留学生就职签证指导",
        ],

        salaryMin: 210000,
        salaryMax: 250000,
      };

    case "美容・时尚":
      return {
        jobSeekers: 188,

        majorEmployers: [
          "美容沙龙",
          "美发企业",
          "化妆品企业",
          "时尚品牌",
          "服装企业",
          "婚礼美容企业",
        ],

        jobTypes: [
          "美容师",
          "美发师",
          "化妆师",
          "时尚顾问",
          "服装销售・企划",
        ],

        support: [
          "美容行业企业说明会",
          "资格考试就业联动指导",
          "作品与技能展示指导",
          "沙龙・企业实习",
          "面试及接客训练",
          "外国人就业资格咨询",
        ],

        salaryMin: 200000,
        salaryMax: 250000,
      };

    case "医疗・福祉":
      return {
        jobSeekers: 176,

        majorEmployers: [
          "医疗法人",
          "介护设施",
          "福祉法人",
          "医院",
          "高龄者设施",
          "医疗服务企业",
        ],

        jobTypes: [
          "介护福祉士",
          "福祉设施工作人员",
          "医疗事务",
          "医疗秘书",
          "高龄者生活支援人员",
        ],

        support: [
          "医疗・福祉设施实习",
          "国家资格考试指导",
          "医疗法人联合招聘",
          "履历书及面试指导",
          "留学生专业日语支持",
          "在留资格转换咨询",
        ],

        salaryMin: 220000,
        salaryMax: 270000,
      };

    case "汽车・技术":
      return {
        jobSeekers: 154,

        majorEmployers: [
          "汽车制造企业",
          "汽车经销商",
          "汽车维修企业",
          "机械制造企业",
          "零部件企业",
          "技术服务企业",
        ],

        jobTypes: [
          "汽车整备士",
          "汽车技术人员",
          "机械工程技术人员",
          "CAD操作员",
          "制造技术人员",
        ],

        support: [
          "汽车企业校内招聘",
          "国家资格考试指导",
          "企业实习",
          "技术面试训练",
          "履历书修改支持",
          "外国人技术签证咨询",
        ],

        salaryMin: 220000,
        salaryMax: 280000,
      };
  }
}