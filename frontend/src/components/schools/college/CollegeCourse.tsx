import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Clock3,
  Code2,
  GraduationCap,
  Palette,
  Plane,
  Scissors,
  Stethoscope,
  Wrench,
} from "lucide-react";

import Card from "@/components/ui/Card/Card";

export type CollegeCourseData = {
  id: string;
  name: string;

  category:
    | "IT・AI"
    | "设计・动漫"
    | "商务・观光"
    | "美容・时尚"
    | "医疗・福祉"
    | "汽车・技术";

  tags: string[];
};

interface Props {
  school: CollegeCourseData;
}

type Course = {
  id: string;
  name: string;
  duration: string;
  degree: string;
  description: string;
  subjects: string[];
  careers: string[];
  qualifications: string[];
};

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 正式后端完成后：
|
| GET /api/colleges/:id/courses
|
| 示例：
|
| GET /api/colleges/tokyo-tech-ai/courses
|
| 建议返回：
|
| {
|   courses: [
|     {
|       id: string;
|       name: string;
|       durationYears: number;
|       degree: string;
|       description: string;
|       subjects: string[];
|       careers: string[];
|       qualifications: string[];
|     }
|   ]
| }
|
| 当前根据学校 category 使用 MOCK DATA。
|
|--------------------------------------------------------------------------
*/

export default function CollegeCourse({
  school,
}: Props) {
  const courses =
    getMockCourses(
      school.category
    );

  return (
    <section
      id="course"
      className="scroll-mt-28"
    >
      <Card className="rounded-3xl p-8">
        {/* Header */}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-1 rounded-full bg-orange-500" />

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                专业学科
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Courses & Majors
              </p>
            </div>
          </div>

          <div className="rounded-full bg-orange-50 px-4 py-2 text-xs font-bold text-orange-700">
            {school.category}
          </div>
        </div>

        <p className="mt-7 leading-8 text-slate-600">
          {school.name}
          目前主要提供
          <span className="mx-1 font-bold text-slate-900">
            {school.category}
          </span>
          相关专业方向。
          专门学校课程通常更重视实践技能、
          资格证书以及毕业后的就业能力。
        </p>

        {/* Summary */}

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={
              <BookOpen
                size={20}
              />
            }
            label="专业方向"
            value={`${courses.length} 个`}
          />

          <SummaryCard
            icon={
              <Clock3
                size={20}
              />
            }
            label="主要学制"
            value="2年制"
          />

          <SummaryCard
            icon={
              <BriefcaseBusiness
                size={20}
              />
            }
            label="课程重点"
            value="实务・就业"
          />
        </div>

        {/* Courses */}

        <div className="mt-9 space-y-5">
          {courses.map(
            (
              course,
              index
            ) => (
              <CourseCard
                key={
                  course.id
                }
                course={
                  course
                }
                index={
                  index
                }
              />
            )
          )}
        </div>

        {/* School tags */}

        {school.tags.length >
          0 && (
          <div className="mt-8 border-t border-slate-100 pt-7">
            <p className="text-sm font-bold text-slate-800">
              学校特色
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {school.tags.map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* Notice */}

        <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50/70 p-5">
          <div className="flex items-start gap-3">
            <BadgeCheck
              size={20}
              className="mt-0.5 shrink-0 text-orange-600"
            />

            <div>
              <p className="font-bold text-orange-800">
                专业选择提示
              </p>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                同一所专门学校不同学科的招生条件、
                学制、学费以及可取得资格可能不同。
                特别是医疗、汽车整备等资格类专业，
                报名前需要确认最新募集要项。
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
| Course Card
|--------------------------------------------------------------------------
*/

function CourseCard({
  course,
  index,
}: {
  course: Course;
  index: number;
}) {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        transition
        hover:border-orange-200
        hover:shadow-lg
        hover:shadow-slate-100
      "
    >
      {/* Top */}

      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-orange-100
            text-orange-600
          "
        >
          <CourseIcon
            index={index}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {course.name}
              </h3>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                  {course.duration}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {course.degree}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            {course.description}
          </p>
        </div>
      </div>

      {/* Details */}

      <div className="grid border-t border-slate-100 md:grid-cols-3">
        <CourseDetail
          title="主要课程"
          items={
            course.subjects
          }
        />

        <CourseDetail
          title="就业方向"
          items={
            course.careers
          }
        />

        <CourseDetail
          title="相关资格"
          items={
            course.qualifications
          }
          last
        />
      </div>
    </div>
  );
}

function CourseDetail({
  title,
  items,
  last = false,
}: {
  title: string;
  items: string[];
  last?: boolean;
}) {
  return (
    <div
      className={`
        p-5
        ${
          last
            ? ""
            : "border-b border-slate-100 md:border-b-0 md:border-r"
        }
      `}
    >
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <div className="mt-3 space-y-2">
        {items.map(
          (item) => (
            <div
              key={item}
              className="flex items-start gap-2 text-sm text-slate-700"
            >
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />

              <span>
                {item}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Summary
|--------------------------------------------------------------------------
*/

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
          {icon}
        </div>

        <div>
          <p className="text-xs text-slate-400">
            {label}
          </p>

          <p className="mt-1 font-bold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function CourseIcon({
  index,
}: {
  index: number;
}) {
  const icons = [
    <GraduationCap
      key="graduation"
      size={23}
    />,
    <BriefcaseBusiness
      key="business"
      size={23}
    />,
    <BookOpen
      key="book"
      size={23}
    />,
  ];

  return (
    icons[
      index %
        icons.length
    ]
  );
}

/*
|--------------------------------------------------------------------------
| MOCK Courses
|--------------------------------------------------------------------------
|
| 后端完成后整个 getMockCourses 删除。
|
|--------------------------------------------------------------------------
*/

function getMockCourses(
  category: CollegeCourseData["category"]
): Course[] {
  switch (category) {
    case "IT・AI":
      return [
        {
          id: "ai-engineer",

          name: "AI・人工智能开发学科",

          duration: "2年制",

          degree: "専門士",

          description:
            "学习人工智能、Python、机器学习以及数据处理等技术，并通过实际项目培养AI应用开发能力。",

          subjects: [
            "Python程序设计",
            "机器学习基础",
            "生成式AI应用",
            "数据库・SQL",
          ],

          careers: [
            "AI工程师",
            "数据分析师",
            "软件工程师",
          ],

          qualifications: [
            "基本情報技術者",
            "Python相关认证",
            "IT Passport",
          ],
        },

        {
          id: "web-system",

          name: "Web・系统开发学科",

          duration: "2年制",

          degree: "専門士",

          description:
            "以Web应用和企业系统开发为核心，学习前端、后端、数据库以及团队开发流程。",

          subjects: [
            "JavaScript",
            "React / Web开发",
            "Java程序设计",
            "数据库设计",
          ],

          careers: [
            "Web工程师",
            "系统工程师",
            "后端工程师",
          ],

          qualifications: [
            "基本情報技術者",
            "Java相关认证",
            "IT Passport",
          ],
        },

        {
          id: "network-cloud",

          name: "网络・云计算学科",

          duration: "2年制",

          degree: "専門士",

          description:
            "学习服务器、网络、Linux以及云计算基础，培养企业基础设施和云环境运维能力。",

          subjects: [
            "Linux",
            "网络基础",
            "AWS基础",
            "信息安全",
          ],

          careers: [
            "云工程师",
            "网络工程师",
            "基础设施工程师",
          ],

          qualifications: [
            "AWS认证",
            "CCNA",
            "Linux相关认证",
          ],
        },
      ];

    case "设计・动漫":
      return [
        {
          id: "anime",

          name: "动漫・角色设计学科",

          duration: "2年制",

          degree: "専門士",

          description:
            "学习角色设计、数字绘画、动漫制作和视觉表现，并以作品集制作为核心进行实践训练。",

          subjects: [
            "角色设计",
            "数字插画",
            "动漫制作",
            "作品集制作",
          ],

          careers: [
            "角色设计师",
            "动漫制作人员",
            "插画师",
          ],

          qualifications: [
            "Adobe相关认证",
            "色彩检定",
            "CG相关认证",
          ],
        },

        {
          id: "game-design",

          name: "游戏设计学科",

          duration: "2年制",

          degree: "専門士",

          description:
            "从游戏企划、UI设计到3D制作，学习游戏开发现场所需要的设计与制作技能。",

          subjects: [
            "游戏企划",
            "UI / UX",
            "3DCG",
            "游戏制作",
          ],

          careers: [
            "游戏设计师",
            "UI设计师",
            "3D设计师",
          ],

          qualifications: [
            "CG Creator检定",
            "Adobe相关认证",
            "色彩检定",
          ],
        },
      ];

    case "商务・观光":
      return [
        {
          id: "international-business",

          name: "国际商务学科",

          duration: "2年制",

          degree: "専門士",

          description:
            "学习商务日语、贸易、市场营销以及日本企业职场规则，培养国际商务人才。",

          subjects: [
            "商务日语",
            "市场营销",
            "贸易实务",
            "Office实务",
          ],

          careers: [
            "贸易公司职员",
            "营业・销售",
            "事务职",
          ],

          qualifications: [
            "日商簿记",
            "商务能力检定",
            "MOS",
          ],
        },

        {
          id: "hotel-tourism",

          name: "酒店・观光学科",

          duration: "2年制",

          degree: "専門士",

          description:
            "学习酒店、旅游、接客服务和观光商务知识，并通过实习培养服务行业实际工作能力。",

          subjects: [
            "酒店实务",
            "观光商务",
            "接客日语",
            "企业实习",
          ],

          careers: [
            "酒店工作人员",
            "旅行社职员",
            "机场服务人员",
          ],

          qualifications: [
            "ホテルビジネス実務検定",
            "旅行相关资格",
            "服务接遇检定",
          ],
        },
      ];

    case "美容・时尚":
      return [
        {
          id: "beauty",

          name: "美容综合学科",

          duration: "2年制",

          degree: "専門士",

          description:
            "学习美容、美发、化妆以及造型相关技能，并进行国家资格考试和行业就业准备。",

          subjects: [
            "美容技术",
            "美发",
            "化妆",
            "接客实务",
          ],

          careers: [
            "美容师",
            "化妆师",
            "造型师",
          ],

          qualifications: [
            "美容師国家試験",
            "化妆相关检定",
            "色彩检定",
          ],
        },

        {
          id: "fashion",

          name: "时尚设计学科",

          duration: "2年制",

          degree: "専門士",

          description:
            "学习服装设计、商品企划和时尚商务，并通过作品制作和企业项目积累经验。",

          subjects: [
            "服装设计",
            "商品企划",
            "时尚商务",
            "作品制作",
          ],

          careers: [
            "时尚设计师",
            "商品企划",
            "服装销售",
          ],

          qualifications: [
            "色彩检定",
            "Fashion Business检定",
            "Pattern相关检定",
          ],
        },
      ];

    case "医疗・福祉":
      return [
        {
          id: "care",

          name: "介护福祉学科",

          duration: "2年制",

          degree: "専門士",

          description:
            "学习介护专业知识和实际护理技能，并通过设施实习准备介护福祉士国家资格考试。",

          subjects: [
            "介护基础",
            "生活支援技术",
            "社会福祉",
            "介护设施实习",
          ],

          careers: [
            "介护福祉士",
            "福祉设施工作人员",
            "高龄者支援人员",
          ],

          qualifications: [
            "介護福祉士",
            "福祉相关资格",
            "介护事务资格",
          ],
        },

        {
          id: "medical-office",

          name: "医疗事务学科",

          duration: "2年制",

          degree: "専門士",

          description:
            "学习医院和诊所事务工作需要的医疗知识、接待能力以及医疗费用计算等实务。",

          subjects: [
            "医疗事务",
            "医疗费用计算",
            "医院接待",
            "电脑实务",
          ],

          careers: [
            "医院事务",
            "诊所工作人员",
            "医疗秘书",
          ],

          qualifications: [
            "医疗事务相关资格",
            "医疗秘书检定",
            "MOS",
          ],
        },
      ];

    case "汽车・技术":
      return [
        {
          id: "automotive",

          name: "汽车整备学科",

          duration: "2年制",

          degree: "専門士",

          description:
            "通过大量实习课程学习汽车构造、检查、维修和故障诊断，并以汽车整备士资格为目标。",

          subjects: [
            "汽车构造",
            "发动机技术",
            "故障诊断",
            "整备实习",
          ],

          careers: [
            "汽车整备士",
            "汽车经销商技术人员",
            "维修工程师",
          ],

          qualifications: [
            "二級自動車整備士",
            "汽车相关资格",
            "危险物相关资格",
          ],
        },

        {
          id: "mechanical",

          name: "机械・制造技术学科",

          duration: "2年制",

          degree: "専門士",

          description:
            "学习机械设计、CAD以及制造现场技术，培养能够进入制造业和技术企业工作的实务人才。",

          subjects: [
            "机械设计",
            "CAD",
            "制造技术",
            "质量管理",
          ],

          careers: [
            "机械工程师",
            "CAD操作员",
            "制造技术人员",
          ],

          qualifications: [
            "CAD利用技术者",
            "机械相关检定",
            "质量管理检定",
          ],
        },
      ];
  }
}