"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Factory,
  HeartHandshake,
  Laptop,
  Languages,
  MapPin,
  Save,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";

import Container from "@/components/layout/Container";
import type { JobCategory } from "@/data/jobs";

/* =========================================================
   Types
========================================================= */

type EmploymentType =
  | "正社員"
  | "契約社員"
  | "派遣"
  | "業務委託"
  | "兼职"
  | "实习";

type SalaryType =
  | "hourly"
  | "daily"
  | "monthly"
  | "annual"
  | "project";

type WorkStyle =
  | "现场"
  | "混合"
  | "远程";

type JapaneseLevel =
  | "none"
  | "n3"
  | "n2"
  | "n1"
  | "native";

type CompanyType =
  | "company"
  | "sole_proprietor"
  | "shop"
  | "individual";

type Step =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7;

interface JobForm {
  category: JobCategory | "";
  occupation: string;

  title: string;
  company: string;
  companyType: CompanyType;

  prefecture: string;
  city: string;
  address: string;

  employmentType: EmploymentType;
  workStyle: WorkStyle;

  salaryType: SalaryType;
  salaryMin: string;
  salaryMax: string;

  japaneseLevel: JapaneseLevel;

  foreignerFriendly: boolean;
  visaSupport: boolean;
  beginnerFriendly: boolean;
  chineseAvailable: boolean;

  experience: string;
  education: string;
  workingHours: string;
  holiday: string;

  benefits: string[];

  description: string;
  requirements: string;

  contactName: string;
  phone: string;
  email: string;

  declaration: boolean;
}

interface CategoryItem {
  key: JobCategory;
  title: string;
  subtitle: string;
}

interface OccupationItem {
  label: string;
}

interface FormErrors {
  [key: string]: string;
}

/* =========================================================
   Constants
========================================================= */

const categories: CategoryItem[] = [
  {
    key: "it",
    title: "IT・技术",
    subtitle: "开发 / AI / 运维 / 测试",
  },
  {
    key: "real-estate",
    title: "不动产",
    subtitle: "营业 / 租赁 / 买卖 / 管理 / 事务",
  },
  {
    key: "construction",
    title: "建筑・现场",
    subtitle: "施工 / 内装 / 电工 / 设备",
  },
  {
    key: "logistics",
    title: "物流・运输",
    subtitle: "配送 / 司机 / 仓库 / 搬家",
  },
  {
    key: "ecommerce-office",
    title: "电商・贸易・办公室",
    subtitle: "运营 / 客服 / 事务 / 翻译",
  },
  {
    key: "service",
    title: "餐饮・零售・服务",
    subtitle: "餐饮 / 酒店 / 清扫 / 店铺",
  },
  {
    key: "manufacturing",
    title: "工厂・制造",
    subtitle: "制造 / 加工 / 检品 / 包装",
  },
  {
    key: "beauty-massage",
    title: "美容・按摩",
    subtitle: "美容 / 美甲 / 美发 / 正规按摩",
  },
  {
    key: "care-professional",
    title: "介护・专业",
    subtitle: "介护 / 医疗 / 教育 / 专业资格",
  },
  {
    key: "other",
    title: "其他工作",
    subtitle: "其他合法招聘职位",
  },
];

const occupations: Record<JobCategory, OccupationItem[]> = {
  it: [
    { label: "后端开发" },
    { label: "前端开发" },
    { label: "AI・数据" },
    { label: "运维・基础设施" },
    { label: "测试・QA" },
    { label: "PM・SE" },
    { label: "UI・UX" },
    { label: "其他IT" },
  ],

  "real-estate": [
    { label: "不动产营业" },
    { label: "租赁仲介" },
    { label: "买卖仲介" },
    { label: "物业管理" },
    { label: "不动产事务" },
    { label: "宅建事务" },
  ],

  construction: [
    { label: "施工管理" },
    { label: "内装" },
    { label: "电工" },
    { label: "设备" },
    { label: "解体" },
    { label: "防水・涂装" },
    { label: "土木" },
    { label: "现场辅助" },
  ],

  logistics: [
    { label: "配送" },
    { label: "轻货司机" },
    { label: "卡车司机" },
    { label: "仓库" },
    { label: "分拣" },
    { label: "搬家" },
    { label: "叉车" },
    { label: "其他物流" },
  ],

  "ecommerce-office": [
    { label: "网店运营" },
    { label: "客服" },
    { label: "事务" },
    { label: "翻译" },
    { label: "贸易" },
    { label: "销售" },
    { label: "会计・财务" },
    { label: "其他办公室" },
  ],

  service: [
    { label: "餐饮" },
    { label: "便利店" },
    { label: "零售" },
    { label: "酒店" },
    { label: "清扫" },
    { label: "店铺服务" },
    { label: "厨房" },
    { label: "其他服务" },
  ],

  manufacturing: [
    { label: "食品制造" },
    { label: "组装" },
    { label: "加工" },
    { label: "检品" },
    { label: "包装" },
    { label: "机械操作" },
    { label: "汽车相关" },
    { label: "其他制造" },
  ],

  "beauty-massage": [
    { label: "美容师" },
    { label: "美甲师" },
    { label: "美发师" },
    { label: "エステ" },
    { label: "正规按摩" },
    { label: "リラクゼーション" },
    { label: "店铺前台" },
    { label: "其他美容" },
  ],

  "care-professional": [
    { label: "介护" },
    { label: "看护辅助" },
    { label: "医疗辅助" },
    { label: "教育" },
    { label: "教师・讲师" },
    { label: "保育" },
    { label: "专业资格职位" },
    { label: "其他专业" },
  ],

  other: [
    { label: "其他工作" },
  ],
};

const prefectures = [
  "东京",
  "神奈川",
  "埼玉",
  "千叶",
  "大阪",
  "京都",
  "兵库",
  "爱知",
  "福冈",
  "北海道",
  "宫城",
  "静冈",
  "其他",
];

const benefitOptions = [
  "交通费",
  "社会保险",
  "奖金",
  "带薪休假",
  "员工宿舍",
  "员工餐",
  "车辆租赁",
  "资格补贴",
  "技术培训",
  "制服提供",
  "远程办公",
  "日払い可",
];

const employmentTypes: EmploymentType[] = [
  "正社員",
  "契約社員",
  "派遣",
  "業務委託",
  "兼职",
  "实习",
];

const stepLabels = [
  "工作分类",
  "职位信息",
  "薪资地点",
  "工作条件",
  "招聘主体",
  "职位说明",
  "确认发布",
];

const initialForm: JobForm = {
  category: "",
  occupation: "",

  title: "",
  company: "",
  companyType: "company",

  prefecture: "",
  city: "",
  address: "",

  employmentType: "正社員",
  workStyle: "现场",

  salaryType: "monthly",
  salaryMin: "",
  salaryMax: "",

  japaneseLevel: "n2",

  foreignerFriendly: true,
  visaSupport: false,
  beginnerFriendly: false,
  chineseAvailable: false,

  experience: "",
  education: "",
  workingHours: "",
  holiday: "",

  benefits: [],

  description: "",
  requirements: "",

  contactName: "",
  phone: "",
  email: "",

  declaration: false,
};

/* =========================================================
   Safety detection
========================================================= */

const suspiciousPatterns = [
  /(?:\+|＋)\s*[vV]/i,
  /\bvx\b/i,
  /\bv信\b/i,
  /加\s*[vV微薇]/i,
  /微\s*信/i,
  /薇\s*信/i,
  /绿色软件/i,
  /纸飞机/i,
  /\btelegram\b/i,
  /\btg\b/i,
  /飞机联系/i,
  /懂的来/i,
  /懂得都懂/i,
];

const highRiskPatterns = [
  /灰色/i,
  /灰产/i,
  /特殊服务/i,
  /成人服务/i,
  /性服务/i,
  /陪睡/i,
  /援交/i,
];

function containsSuspiciousContact(text: string) {
  return suspiciousPatterns.some((pattern) =>
    pattern.test(text),
  );
}

function containsHighRiskContent(text: string) {
  return highRiskPatterns.some((pattern) =>
    pattern.test(text),
  );
}

function sanitizeText(value: string) {
  return value
    .replace(/\u0000/g, "")
    .normalize("NFKC");
}

function sanitizePhone(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11);
}

function getCategoryName(
  category: JobCategory | "",
) {
  return (
    categories.find(
      (item) => item.key === category,
    )?.title ?? ""
  );
}

function getSalaryUnit(type: SalaryType) {
  switch (type) {
    case "hourly":
      return "小时";
    case "daily":
      return "日";
    case "monthly":
      return "月";
    case "annual":
      return "年";
    case "project":
      return "项目";
  }
}

/* =========================================================
   Page
========================================================= */

export default function PublishJobPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] =
    useState<JobForm>(initialForm);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const selectedCategory = useMemo(
    () =>
      categories.find(
        (item) => item.key === form.category,
      ),
    [form.category],
  );

  const availableOccupations =
    form.category
      ? occupations[form.category]
      : [];

  const progress =
    (step / stepLabels.length) * 100;

  function updateField<K extends keyof JobForm>(
    key: K,
    value: JobForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: "",
    }));
  }

  function handleTextChange(
    key:
      | "title"
      | "company"
      | "city"
      | "address"
      | "experience"
      | "education"
      | "workingHours"
      | "holiday"
      | "description"
      | "requirements"
      | "contactName"
      | "email",
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) {
    updateField(
      key,
      sanitizeText(event.target.value),
    );
  }

  function toggleBenefit(value: string) {
    setForm((current) => ({
      ...current,
      benefits: current.benefits.includes(value)
        ? current.benefits.filter(
            (item) => item !== value,
          )
        : [
            ...current.benefits,
            value,
          ].slice(0, 12),
    }));
  }

  function validateStep(
    targetStep: Step,
  ) {
    const nextErrors: FormErrors = {};

    if (targetStep === 1) {
      if (!form.category) {
        nextErrors.category =
          "请选择工作分类";
      }

      if (!form.occupation) {
        nextErrors.occupation =
          "请选择具体职业";
      }
    }

    if (targetStep === 2) {
      const title = form.title.trim();
      const company = form.company.trim();

      if (title.length < 2) {
        nextErrors.title =
          "请输入至少 2 个字符的职位名称";
      } else if (title.length > 80) {
        nextErrors.title =
          "职位名称不能超过 80 个字符";
      }

      if (!company) {
        nextErrors.company =
          "请输入公司、店铺或招聘主体名称";
      } else if (company.length > 100) {
        nextErrors.company =
          "名称不能超过 100 个字符";
      }

      const publicText =
        `${title} ${company}`;

      if (
        containsSuspiciousContact(publicText)
      ) {
        nextErrors.title =
          "职位标题或招聘主体中不能填写微信、+V、VX 等站外导流信息";
      }

      if (
        containsHighRiskContent(publicText)
      ) {
        nextErrors.title =
          "检测到不适合发布的高风险招聘内容";
      }
    }

    if (targetStep === 3) {
      if (!form.prefecture) {
        nextErrors.prefecture =
          "请选择工作地区";
      }

      if (!form.city.trim()) {
        nextErrors.city =
          "请输入市区町村";
      } else if (
        form.city.trim().length > 50
      ) {
        nextErrors.city =
          "地区名称不能超过 50 个字符";
      }

      const min =
        Number(form.salaryMin);
      const max =
        Number(form.salaryMax);

      if (
        !form.salaryMin ||
        Number.isNaN(min) ||
        min <= 0
      ) {
        nextErrors.salaryMin =
          "请输入有效的最低薪资";
      }

      if (
        form.salaryMax &&
        (Number.isNaN(max) ||
          max <= 0)
      ) {
        nextErrors.salaryMax =
          "请输入有效的最高薪资";
      }

      if (
        form.salaryMin &&
        form.salaryMax &&
        max < min
      ) {
        nextErrors.salaryMax =
          "最高薪资不能低于最低薪资";
      }
    }

    if (targetStep === 4) {
      if (!form.workingHours.trim()) {
        nextErrors.workingHours =
          "请输入工作时间";
      }

      if (!form.holiday.trim()) {
        nextErrors.holiday =
          "请输入休息日或排班方式";
      }

      if (!form.experience.trim()) {
        nextErrors.experience =
          "请输入经验要求";
      }
    }

    if (targetStep === 5) {
      const contactName =
        form.contactName.trim();

      if (contactName.length < 2) {
        nextErrors.contactName =
          "请输入联系人姓名";
      } else if (
        contactName.length > 50
      ) {
        nextErrors.contactName =
          "联系人不能超过 50 个字符";
      }

      if (
        !/^0\d{9,10}$/.test(form.phone)
      ) {
        nextErrors.phone =
          "请输入有效的日本电话号码";
      }

      const email =
        form.email.trim();

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email,
        )
      ) {
        nextErrors.email =
          "请输入有效的邮箱地址";
      } else if (email.length > 254) {
        nextErrors.email =
          "邮箱地址过长";
      }
    }

    if (targetStep === 6) {
      const description =
        form.description.trim();

      const requirements =
        form.requirements.trim();

      if (description.length < 20) {
        nextErrors.description =
          "工作内容请至少填写 20 个字符";
      } else if (
        description.length > 5000
      ) {
        nextErrors.description =
          "工作内容不能超过 5000 个字符";
      }

      if (requirements.length > 3000) {
        nextErrors.requirements =
          "招聘要求不能超过 3000 个字符";
      }

      const publicText = [
        form.title,
        form.company,
        description,
        requirements,
      ].join(" ");

      if (
        containsSuspiciousContact(publicText)
      ) {
        nextErrors.description =
          "公开招聘内容中不能填写微信、+V、VX、Telegram 等站外导流信息，请使用专用联系方式字段";
      }

      if (
        containsHighRiskContent(publicText)
      ) {
        nextErrors.description =
          "检测到高风险或禁止发布的招聘内容，请修改后重新提交";
      }

      if (
        form.category === "beauty-massage" &&
        containsHighRiskContent(publicText)
      ) {
        nextErrors.description =
          "美容・按摩分类仅允许合法的一般美容、按摩及リラクゼーション招聘";
      }
    }

    if (targetStep === 7) {
      if (!form.declaration) {
        nextErrors.declaration =
          "请确认招聘内容真实合法并同意平台规则";
      }
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  }

  function nextStep() {
    if (!validateStep(step)) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    if (step < 7) {
      setStep(
        (step + 1) as Step,
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function previousStep() {
    if (step > 1) {
      setStep(
        (step - 1) as Step,
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function saveDraft() {
    const draft = {
      ...form,
      savedAt:
        new Date().toISOString(),
    };

    localStorage.setItem(
      "sakura-job-publish-draft",
      JSON.stringify(draft),
    );

    window.alert("草稿已保存到当前设备。");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!validateStep(7)) {
      return;
    }

    setSubmitting(true);

    try {
      /*
      TODO [API - POST]

      POST /api/jobs

      Purpose:
      Create a new job post.

      Backend MUST perform:

      1. authentication / ownership check
      2. rate limiting
      3. category + occupation validation
      4. category/content consistency check
      5. duplicate recruitment detection
      6. cross-category spam detection
      7. off-platform contact / +V / VX detection
      8. high-risk recruitment detection
      9. beauty-massage enhanced review
      10. company / recruiter verification check
      11. XSS / injection sanitization
      12. moderation status assignment

      Example body:
      {
        ...form
      }
      */

      await new Promise((resolve) =>
        setTimeout(resolve, 700),
      );

      localStorage.removeItem(
        "sakura-job-publish-draft",
      );

      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Container>
          <div className="mx-auto flex min-h-[72vh] max-w-xl items-center justify-center py-16">
            <div className="w-full rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={30} />
              </div>

              <h1 className="mt-6 text-2xl font-bold text-slate-950">
                招聘信息已提交
              </h1>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Sakura 会进行内容和分类审核。
                审核通过后，职位才会公开显示。
              </p>

              {form.category ===
                "beauty-massage" && (
                <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-left text-sm leading-6 text-amber-800">
                  美容・按摩类招聘会进行加强审核，
                  因此可能需要更长时间确认。
                </div>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/account/posts"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white"
                >
                  查看我的发布
                </Link>

                <Link
                  href="/jobs"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700"
                >
                  返回工作列表
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-28 lg:pb-16">
      {/* =====================================================
          Header
      ====================================================== */}

      <div className="border-b border-slate-200 bg-white">
        <Container>
          <div className="py-6 sm:py-8">
            <Link
              href="/account/publish"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              <ArrowLeft size={16} />
              返回发布中心
            </Link>

            <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <BriefcaseBusiness
                    size={17}
                  />
                  发布工作
                </div>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  发布招聘信息
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  请准确选择工作分类并填写真实招聘条件。
                  Sakura 不允许跨分类刷屏、重复招聘或利用招聘信息进行灰色导流。
                </p>
              </div>

              <button
                type="button"
                onClick={saveDraft}
                className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Save size={15} />
                保存草稿
              </button>
            </div>

            {/* Mobile progress */}

            <div className="mt-6 lg:hidden">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-950">
                  {step} / 7
                </span>

                <span className="text-slate-500">
                  {stepLabels[step - 1]}
                </span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-950 transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <form
          onSubmit={handleSubmit}
          className="py-6 sm:py-8"
        >
          <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
            {/* =================================================
                Desktop steps
            ================================================== */}

            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="px-2 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  发布流程
                </p>

                <div className="space-y-1">
                  {stepLabels.map(
                    (label, index) => {
                      const number =
                        (index + 1) as Step;

                      const active =
                        number === step;

                      const completed =
                        number < step;

                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => {
                            if (
                              number < step
                            ) {
                              setStep(number);
                            }
                          }}
                          className={[
                            "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition",
                            active
                              ? "bg-slate-950 text-white"
                              : completed
                                ? "text-slate-800 hover:bg-slate-50"
                                : "cursor-default text-slate-400",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                              active
                                ? "bg-white text-slate-950"
                                : completed
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-slate-100 text-slate-400",
                            ].join(" ")}
                          >
                            {completed ? (
                              <Check
                                size={14}
                              />
                            ) : (
                              number
                            )}
                          </span>

                          <span className="text-sm font-semibold">
                            {label}
                          </span>
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            </aside>

            {/* =================================================
                Main
            ================================================== */}

            <section className="min-w-0">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
                {/* =============================================
                    STEP 1
                ============================================== */}

                {step === 1 && (
                  <div>
                    <StepTitle
                      title="你要招聘什么工作？"
                      description="每个职位只能选择一个主分类和一个具体职业。选择错误分类可能导致审核不通过。"
                    />

                    <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {categories.map(
                        (category) => {
                          const active =
                            form.category ===
                            category.key;

                          return (
                            <button
                              key={
                                category.key
                              }
                              type="button"
                              onClick={() => {
                                updateField(
                                  "category",
                                  category.key,
                                );

                                updateField(
                                  "occupation",
                                  "",
                                );
                              }}
                              className={[
                                "group min-h-[110px] rounded-2xl border p-4 text-left transition",
                                active
                                  ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                              ].join(" ")}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div
                                  className={[
                                    "flex h-10 w-10 items-center justify-center rounded-xl",
                                    active
                                      ? "bg-white/10 text-white"
                                      : "bg-slate-100 text-slate-700",
                                  ].join(" ")}
                                >
                                  {category.key ===
                                    "it" && (
                                    <Laptop
                                      size={
                                        19
                                      }
                                    />
                                  )}

                                  {category.key ===
                                    "construction" && (
                                    <Building2
                                      size={
                                        19
                                      }
                                    />
                                  )}

                                  {category.key ===
                                    "logistics" && (
                                    <Truck
                                      size={
                                        19
                                      }
                                    />
                                  )}

                                  {category.key ===
                                    "ecommerce-office" && (
                                    <ShoppingBag
                                      size={
                                        19
                                      }
                                    />
                                  )}

                                  {category.key ===
                                    "service" && (
                                    <UtensilsCrossed
                                      size={
                                        19
                                      }
                                    />
                                  )}

                                  {category.key ===
                                    "manufacturing" && (
                                    <Factory
                                      size={
                                        19
                                      }
                                    />
                                  )}

                                  {category.key ===
                                    "beauty-massage" && (
                                    <Sparkles
                                      size={
                                        19
                                      }
                                    />
                                  )}

                                  {category.key ===
                                    "care-professional" && (
                                    <HeartHandshake
                                      size={
                                        19
                                      }
                                    />
                                  )}

                                  {category.key ===
                                    "other" && (
                                    <BriefcaseBusiness
                                      size={
                                        19
                                      }
                                    />
                                  )}
                                </div>

                                {active && (
                                  <CheckCircle2
                                    size={19}
                                  />
                                )}
                              </div>

                              <p className="mt-4 text-sm font-bold">
                                {
                                  category.title
                                }
                              </p>

                              <p
                                className={[
                                  "mt-1 text-xs leading-5",
                                  active
                                    ? "text-slate-300"
                                    : "text-slate-500",
                                ].join(" ")}
                              >
                                {
                                  category.subtitle
                                }
                              </p>
                            </button>
                          );
                        },
                      )}
                    </div>

                    <FieldError
                      message={
                        errors.category
                      }
                    />

                    {form.category && (
                      <div className="mt-8 border-t border-slate-100 pt-7">
                        <h3 className="text-sm font-bold text-slate-950">
                          选择具体职业
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          当前：
                          {
                            selectedCategory?.title
                          }
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {availableOccupations.map(
                            (occupation) => (
                              <button
                                key={
                                  occupation.label
                                }
                                type="button"
                                onClick={() =>
                                  updateField(
                                    "occupation",
                                    occupation.label,
                                  )
                                }
                                className={[
                                  "min-h-10 rounded-xl border px-4 py-2 text-sm font-medium transition",
                                  form.occupation ===
                                  occupation.label
                                    ? "border-slate-950 bg-slate-950 text-white"
                                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                                ].join(
                                  " ",
                                )}
                              >
                                {
                                  occupation.label
                                }
                              </button>
                            ),
                          )}
                        </div>

                        <FieldError
                          message={
                            errors.occupation
                          }
                        />
                      </div>
                    )}

                    {form.category ===
                      "beauty-massage" && (
                      <SafetyNotice />
                    )}
                  </div>
                )}

                {/* =============================================
                    STEP 2
                ============================================== */}

                {step === 2 && (
                  <div>
                    <StepTitle
                      title="职位基本信息"
                      description={`${getCategoryName(form.category)} · ${form.occupation}`}
                    />

                    <div className="mt-7 space-y-6">
                      <Field>
                        <FieldLabel required>
                          职位名称
                        </FieldLabel>

                        <input
                          value={form.title}
                          onChange={(event) =>
                            handleTextChange(
                              "title",
                              event,
                            )
                          }
                          maxLength={80}
                          placeholder="例如：仓库分拣工作人员"
                          className={inputClass}
                        />

                        <FieldHint>
                          请直接写真实职位，
                          不要填写“高薪急招”“＋V联系”等广告文字。
                        </FieldHint>

                        <FieldError
                          message={
                            errors.title
                          }
                        />
                      </Field>

                      <Field>
                        <FieldLabel required>
                          公司 / 店铺 /
                          招聘主体名称
                        </FieldLabel>

                        <input
                          value={
                            form.company
                          }
                          onChange={(event) =>
                            handleTextChange(
                              "company",
                              event,
                            )
                          }
                          maxLength={100}
                          placeholder="例如：东京物流株式会社"
                          className={inputClass}
                        />

                        <FieldError
                          message={
                            errors.company
                          }
                        />
                      </Field>

                      <Field>
                        <FieldLabel>
                          雇佣形式
                        </FieldLabel>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {employmentTypes.map(
                            (type) => (
                              <ChoiceButton
                                key={type}
                                active={
                                  form.employmentType ===
                                  type
                                }
                                onClick={() =>
                                  updateField(
                                    "employmentType",
                                    type,
                                  )
                                }
                              >
                                {type}
                              </ChoiceButton>
                            ),
                          )}
                        </div>
                      </Field>

                      <Field>
                        <FieldLabel>
                          工作方式
                        </FieldLabel>

                        <div className="grid grid-cols-3 gap-2">
                          {(
                            [
                              "现场",
                              "混合",
                              "远程",
                            ] as WorkStyle[]
                          ).map(
                            (style) => (
                              <ChoiceButton
                                key={style}
                                active={
                                  form.workStyle ===
                                  style
                                }
                                onClick={() =>
                                  updateField(
                                    "workStyle",
                                    style,
                                  )
                                }
                              >
                                {style}
                              </ChoiceButton>
                            ),
                          )}
                        </div>
                      </Field>
                    </div>
                  </div>
                )}

                {/* =============================================
                    STEP 3
                ============================================== */}

                {step === 3 && (
                  <div>
                    <StepTitle
                      title="薪资与工作地点"
                      description="请尽量填写明确的薪资范围，减少“面议”等不透明招聘。"
                    />

                    <div className="mt-7 space-y-7">
                      <Field>
                        <FieldLabel required>
                          薪资类型
                        </FieldLabel>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                          {(
                            [
                              [
                                "hourly",
                                "时薪",
                              ],
                              [
                                "daily",
                                "日薪",
                              ],
                              [
                                "monthly",
                                "月薪",
                              ],
                              [
                                "annual",
                                "年薪",
                              ],
                              [
                                "project",
                                "按项目",
                              ],
                            ] as const
                          ).map(
                            ([key, label]) => (
                              <ChoiceButton
                                key={key}
                                active={
                                  form.salaryType ===
                                  key
                                }
                                onClick={() =>
                                  updateField(
                                    "salaryType",
                                    key,
                                  )
                                }
                              >
                                {label}
                              </ChoiceButton>
                            ),
                          )}
                        </div>
                      </Field>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                          <FieldLabel required>
                            最低薪资
                          </FieldLabel>

                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                              ¥
                            </span>

                            <input
                              type="number"
                              min={1}
                              value={
                                form.salaryMin
                              }
                              onChange={(
                                event,
                              ) =>
                                updateField(
                                  "salaryMin",
                                  event
                                    .target
                                    .value,
                                )
                              }
                              placeholder="300000"
                              className={`${inputClass} pl-8`}
                            />
                          </div>

                          <FieldError
                            message={
                              errors.salaryMin
                            }
                          />
                        </Field>

                        <Field>
                          <FieldLabel>
                            最高薪资
                          </FieldLabel>

                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                              ¥
                            </span>

                            <input
                              type="number"
                              min={1}
                              value={
                                form.salaryMax
                              }
                              onChange={(
                                event,
                              ) =>
                                updateField(
                                  "salaryMax",
                                  event
                                    .target
                                    .value,
                                )
                              }
                              placeholder="400000"
                              className={`${inputClass} pl-8`}
                            />
                          </div>

                          <FieldError
                            message={
                              errors.salaryMax
                            }
                          />
                        </Field>
                      </div>

                      <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        当前：
                        {form.salaryMin
                          ? ` ¥${Number(
                              form.salaryMin,
                            ).toLocaleString()}`
                          : " 未填写"}
                        {form.salaryMax
                          ? ` ～ ¥${Number(
                              form.salaryMax,
                            ).toLocaleString()}`
                          : ""}
                        {" / "}
                        {getSalaryUnit(
                          form.salaryType,
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                          <FieldLabel required>
                            都道府县
                          </FieldLabel>

                          <select
                            value={
                              form.prefecture
                            }
                            onChange={(event) =>
                              updateField(
                                "prefecture",
                                event.target
                                  .value,
                              )
                            }
                            className={inputClass}
                          >
                            <option value="">
                              请选择
                            </option>

                            {prefectures.map(
                              (item) => (
                                <option
                                  key={item}
                                  value={item}
                                >
                                  {item}
                                </option>
                              ),
                            )}
                          </select>

                          <FieldError
                            message={
                              errors.prefecture
                            }
                          />
                        </Field>

                        <Field>
                          <FieldLabel required>
                            市区町村
                          </FieldLabel>

                          <input
                            value={form.city}
                            onChange={(event) =>
                              handleTextChange(
                                "city",
                                event,
                              )
                            }
                            maxLength={50}
                            placeholder="例如：新宿区"
                            className={inputClass}
                          />

                          <FieldError
                            message={
                              errors.city
                            }
                          />
                        </Field>
                      </div>

                      <Field>
                        <FieldLabel>
                          详细地址
                        </FieldLabel>

                        <input
                          value={form.address}
                          onChange={(event) =>
                            handleTextChange(
                              "address",
                              event,
                            )
                          }
                          maxLength={150}
                          placeholder="审核后根据平台规则决定公开范围"
                          className={inputClass}
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {/* =============================================
                    STEP 4
                ============================================== */}

                {step === 4 && (
                  <div>
                    <StepTitle
                      title="工作条件"
                      description="让求职者在联系前就能了解最重要的工作要求。"
                    />

                    <div className="mt-7 space-y-7">
                      <Field>
                        <FieldLabel>
                          日语要求
                        </FieldLabel>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                          {(
                            [
                              [
                                "none",
                                "基本不要求",
                              ],
                              [
                                "n3",
                                "N3程度",
                              ],
                              [
                                "n2",
                                "N2程度",
                              ],
                              [
                                "n1",
                                "N1程度",
                              ],
                              [
                                "native",
                                "商务级",
                              ],
                            ] as const
                          ).map(
                            ([key, label]) => (
                              <ChoiceButton
                                key={key}
                                active={
                                  form.japaneseLevel ===
                                  key
                                }
                                onClick={() =>
                                  updateField(
                                    "japaneseLevel",
                                    key,
                                  )
                                }
                              >
                                {label}
                              </ChoiceButton>
                            ),
                          )}
                        </div>
                      </Field>

                      <Field>
                        <FieldLabel>
                          外国人招聘条件
                        </FieldLabel>

                        <div className="grid gap-2 sm:grid-cols-2">
                          <ToggleCard
                            title="外国人可应聘"
                            description="明确接受外国籍求职者"
                            checked={
                              form.foreignerFriendly
                            }
                            onChange={(value) =>
                              updateField(
                                "foreignerFriendly",
                                value,
                              )
                            }
                          />

                          <ToggleCard
                            title="签证支援"
                            description="公司可提供相关在留资格支援"
                            checked={
                              form.visaSupport
                            }
                            onChange={(value) =>
                              updateField(
                                "visaSupport",
                                value,
                              )
                            }
                          />

                          <ToggleCard
                            title="未经验可"
                            description="没有相关经验也可以应聘"
                            checked={
                              form.beginnerFriendly
                            }
                            onChange={(value) =>
                              updateField(
                                "beginnerFriendly",
                                value,
                              )
                            }
                          />

                          <ToggleCard
                            title="中文可"
                            description="工作或招聘对应可使用中文"
                            checked={
                              form.chineseAvailable
                            }
                            onChange={(value) =>
                              updateField(
                                "chineseAvailable",
                                value,
                              )
                            }
                          />
                        </div>
                      </Field>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                          <FieldLabel required>
                            经验要求
                          </FieldLabel>

                          <input
                            value={
                              form.experience
                            }
                            onChange={(event) =>
                              handleTextChange(
                                "experience",
                                event,
                              )
                            }
                            maxLength={100}
                            placeholder="例如：未经验可 / 2年以上"
                            className={inputClass}
                          />

                          <FieldError
                            message={
                              errors.experience
                            }
                          />
                        </Field>

                        <Field>
                          <FieldLabel>
                            学历要求
                          </FieldLabel>

                          <input
                            value={
                              form.education
                            }
                            onChange={(event) =>
                              handleTextChange(
                                "education",
                                event,
                              )
                            }
                            maxLength={100}
                            placeholder="例如：不限"
                            className={inputClass}
                          />
                        </Field>

                        <Field>
                          <FieldLabel required>
                            工作时间
                          </FieldLabel>

                          <input
                            value={
                              form.workingHours
                            }
                            onChange={(event) =>
                              handleTextChange(
                                "workingHours",
                                event,
                              )
                            }
                            maxLength={100}
                            placeholder="例如：09:00 ～ 18:00"
                            className={inputClass}
                          />

                          <FieldError
                            message={
                              errors.workingHours
                            }
                          />
                        </Field>

                        <Field>
                          <FieldLabel required>
                            休息 / 排班
                          </FieldLabel>

                          <input
                            value={
                              form.holiday
                            }
                            onChange={(event) =>
                              handleTextChange(
                                "holiday",
                                event,
                              )
                            }
                            maxLength={100}
                            placeholder="例如：周末双休 / 排班制"
                            className={inputClass}
                          />

                          <FieldError
                            message={
                              errors.holiday
                            }
                          />
                        </Field>
                      </div>

                      <Field>
                        <FieldLabel>
                          福利与工作特色
                        </FieldLabel>

                        <div className="flex flex-wrap gap-2">
                          {benefitOptions.map(
                            (benefit) => {
                              const active =
                                form.benefits.includes(
                                  benefit,
                                );

                              return (
                                <ChoiceButton
                                  key={benefit}
                                  active={
                                    active
                                  }
                                  onClick={() =>
                                    toggleBenefit(
                                      benefit,
                                    )
                                  }
                                >
                                  {benefit}
                                </ChoiceButton>
                              );
                            },
                          )}
                        </div>
                      </Field>
                    </div>
                  </div>
                )}

                {/* =============================================
                    STEP 5
                ============================================== */}

                {step === 5 && (
                  <div>
                    <StepTitle
                      title="招聘主体与联系方式"
                      description="招聘方身份会影响职位的可信度展示和审核等级。"
                    />

                    <div className="mt-7 space-y-7">
                      <Field>
                        <FieldLabel>
                          招聘主体
                        </FieldLabel>

                        <div className="grid gap-2 sm:grid-cols-2">
                          {(
                            [
                              [
                                "company",
                                "企业",
                                "株式会社、合同会社等法人",
                              ],
                              [
                                "sole_proprietor",
                                "个体事业主",
                                "个人事业、个体经营者",
                              ],
                              [
                                "shop",
                                "店铺",
                                "餐饮、美容、零售等实体店",
                              ],
                              [
                                "individual",
                                "个人",
                                "非企业主体的个人招聘",
                              ],
                            ] as const
                          ).map(
                            ([
                              key,
                              label,
                              description,
                            ]) => (
                              <button
                                key={key}
                                type="button"
                                onClick={() =>
                                  updateField(
                                    "companyType",
                                    key,
                                  )
                                }
                                className={[
                                  "rounded-2xl border p-4 text-left transition",
                                  form.companyType ===
                                  key
                                    ? "border-slate-950 bg-slate-950 text-white"
                                    : "border-slate-200 hover:bg-slate-50",
                                ].join(
                                  " ",
                                )}
                              >
                                <div className="font-semibold">
                                  {label}
                                </div>

                                <div
                                  className={[
                                    "mt-1 text-xs leading-5",
                                    form.companyType ===
                                    key
                                      ? "text-slate-300"
                                      : "text-slate-500",
                                  ].join(
                                    " ",
                                  )}
                                >
                                  {
                                    description
                                  }
                                </div>
                              </button>
                            ),
                          )}
                        </div>
                      </Field>

                      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                        <div className="flex gap-3">
                          <ShieldCheck
                            size={20}
                            className="mt-0.5 shrink-0 text-blue-600"
                          />

                          <div>
                            <p className="text-sm font-bold text-blue-950">
                              招聘认证
                            </p>

                            <p className="mt-1 text-xs leading-6 text-blue-800">
                              后续 Sakura
                              会支持企业认证、联系方式认证和营业信息确认。
                              未认证信息仍可投稿，但会向求职者明确显示发布主体状态。
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                          <FieldLabel required>
                            联系人
                          </FieldLabel>

                          <input
                            value={
                              form.contactName
                            }
                            onChange={(event) =>
                              handleTextChange(
                                "contactName",
                                event,
                              )
                            }
                            maxLength={50}
                            placeholder="例如：张先生"
                            autoComplete="name"
                            className={inputClass}
                          />

                          <FieldError
                            message={
                              errors.contactName
                            }
                          />
                        </Field>

                        <Field>
                          <FieldLabel required>
                            电话
                          </FieldLabel>

                          <input
                            value={form.phone}
                            onChange={(event) =>
                              updateField(
                                "phone",
                                sanitizePhone(
                                  event.target
                                    .value,
                                ),
                              )
                            }
                            inputMode="numeric"
                            maxLength={11}
                            placeholder="09012345678"
                            autoComplete="tel"
                            className={inputClass}
                          />

                          <FieldError
                            message={
                              errors.phone
                            }
                          />
                        </Field>
                      </div>

                      <Field>
                        <FieldLabel required>
                          邮箱
                        </FieldLabel>

                        <input
                          type="email"
                          value={form.email}
                          onChange={(event) =>
                            handleTextChange(
                              "email",
                              event,
                            )
                          }
                          maxLength={254}
                          autoComplete="email"
                          placeholder="recruit@example.com"
                          className={inputClass}
                        />

                        <FieldError
                          message={
                            errors.email
                          }
                        />
                      </Field>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-800">
                          为什么不能把微信写进正文？
                        </p>

                        <p className="mt-2 text-xs leading-6 text-slate-500">
                          为减少诈骗、广告刷屏和灰色导流，
                          微信、电话、邮箱等联系方式必须使用专门字段。
                          后续 Sakura
                          会逐步提供站内联系功能。
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* =============================================
                    STEP 6
                ============================================== */}

                {step === 6 && (
                  <div>
                    <StepTitle
                      title="职位说明"
                      description="把真实工作内容写清楚，比“高薪急招”更容易获得求职者信任。"
                    />

                    {form.category ===
                      "beauty-massage" && (
                      <SafetyNotice />
                    )}

                    <div className="mt-7 space-y-7">
                      <Field>
                        <div className="flex items-end justify-between gap-3">
                          <FieldLabel required>
                            工作内容
                          </FieldLabel>

                          <span className="text-xs text-slate-400">
                            {
                              form.description
                                .length
                            }
                            /5000
                          </span>
                        </div>

                        <textarea
                          value={
                            form.description
                          }
                          onChange={(event) =>
                            handleTextChange(
                              "description",
                              event,
                            )
                          }
                          maxLength={5000}
                          rows={9}
                          placeholder="请具体说明每天做什么、工作环境、主要职责等。"
                          className={`${inputClass} min-h-[220px] resize-y py-3`}
                        />

                        <FieldError
                          message={
                            errors.description
                          }
                        />
                      </Field>

                      <Field>
                        <div className="flex items-end justify-between gap-3">
                          <FieldLabel>
                            招聘要求
                          </FieldLabel>

                          <span className="text-xs text-slate-400">
                            {
                              form.requirements
                                .length
                            }
                            /3000
                          </span>
                        </div>

                        <textarea
                          value={
                            form.requirements
                          }
                          onChange={(event) =>
                            handleTextChange(
                              "requirements",
                              event,
                            )
                          }
                          maxLength={3000}
                          rows={6}
                          placeholder="例如：需要普通自动车免许；可以正常进行日常日语沟通等。"
                          className={`${inputClass} min-h-[160px] resize-y py-3`}
                        />
                      </Field>

                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <div className="flex gap-3">
                          <CircleAlert
                            size={20}
                            className="mt-0.5 shrink-0 text-amber-600"
                          />

                          <div>
                            <p className="text-sm font-bold text-amber-950">
                              发布内容检查
                            </p>

                            <p className="mt-1 text-xs leading-6 text-amber-800">
                              系统会检查分类不一致、重复招聘、跨分类刷屏、
                              微信/+V/VX等导流以及高风险招聘内容。
                              这些检查最终还会在服务端重新执行。
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* =============================================
                    STEP 7
                ============================================== */}

                {step === 7 && (
                  <div>
                    <StepTitle
                      title="确认并提交审核"
                      description="请确认职位分类、工资和联系方式准确无误。"
                    />

                    <div className="mt-7 space-y-5">
                      <PreviewSection
                        title="分类"
                        rows={[
                          [
                            "工作分类",
                            getCategoryName(
                              form.category,
                            ),
                          ],
                          [
                            "具体职业",
                            form.occupation,
                          ],
                        ]}
                      />

                      <PreviewSection
                        title="职位"
                        rows={[
                          [
                            "职位名称",
                            form.title,
                          ],
                          [
                            "招聘主体",
                            form.company,
                          ],
                          [
                            "雇佣形式",
                            form.employmentType,
                          ],
                          [
                            "工作方式",
                            form.workStyle,
                          ],
                        ]}
                      />

                      <PreviewSection
                        title="薪资・地点"
                        rows={[
                          [
                            "薪资",
                            `¥${Number(
                              form.salaryMin ||
                                0,
                            ).toLocaleString()}${
                              form.salaryMax
                                ? ` ～ ¥${Number(
                                    form.salaryMax,
                                  ).toLocaleString()}`
                                : ""
                            } / ${getSalaryUnit(
                              form.salaryType,
                            )}`,
                          ],
                          [
                            "地点",
                            [
                              form.prefecture,
                              form.city,
                            ]
                              .filter(Boolean)
                              .join(" · "),
                          ],
                        ]}
                      />

                      <PreviewSection
                        title="外国人条件"
                        rows={[
                          [
                            "日语",
                            form.japaneseLevel ===
                            "none"
                              ? "基本不要求"
                              : form.japaneseLevel.toUpperCase(),
                          ],
                          [
                            "外国人",
                            form.foreignerFriendly
                              ? "可应聘"
                              : "未特别注明",
                          ],
                          [
                            "签证支援",
                            form.visaSupport
                              ? "有"
                              : "无",
                          ],
                          [
                            "中文",
                            form.chineseAvailable
                              ? "可"
                              : "未特别注明",
                          ],
                        ]}
                      />

                      <div className="rounded-2xl border border-slate-200 p-5">
                        <p className="text-sm font-bold text-slate-950">
                          工作内容
                        </p>

                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                          {form.description}
                        </p>
                      </div>

                      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4">
                        <input
                          type="checkbox"
                          checked={
                            form.declaration
                          }
                          onChange={(event) =>
                            updateField(
                              "declaration",
                              event.target
                                .checked,
                            )
                          }
                          className="mt-1 h-4 w-4 rounded border-slate-300"
                        />

                        <span>
                          <span className="block text-sm font-semibold text-slate-900">
                            我确认以上招聘信息真实、合法，并且没有故意选择错误分类或重复刷屏。
                          </span>

                          <span className="mt-1 block text-xs leading-6 text-slate-500">
                            如存在虚假招聘、灰色业务、违法招聘、跨分类刷屏或恶意导流，
                            Sakura
                            可拒绝发布、下架内容或限制账号发布权限。
                          </span>
                        </span>
                      </label>

                      <FieldError
                        message={
                          errors.declaration
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* =================================================
              Desktop bottom controls
          ================================================== */}

          <div className="mt-6 hidden lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-6">
            <div />

            <div className="flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={previousStep}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft size={16} />
                  上一步
                </button>
              ) : (
                <div />
              )}

              {step < 7 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  下一步
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "提交中..."
                    : "提交审核"}

                  {!submitting && (
                    <ChevronRight
                      size={16}
                    />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* =================================================
              Mobile sticky controls
          ================================================== */}

          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
            <div className="mx-auto flex max-w-xl gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={previousStep}
                  className="flex h-12 min-w-24 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
                >
                  <ArrowLeft size={16} />
                  上一步
                </button>
              )}

              {step < 7 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white"
                >
                  下一步
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-12 flex-1 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {submitting
                    ? "提交中..."
                    : "提交审核"}
                </button>
              )}
            </div>
          </div>
        </form>
      </Container>
    </main>
  );
}

/* =========================================================
   Small components
========================================================= */

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

function StepTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function Field({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      {children}
    </div>
  );
}

function FieldLabel({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      {children}

      {required && (
        <span className="ml-1 text-rose-500">
          *
        </span>
      )}
    </label>
  );
}

function FieldHint({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p className="text-xs leading-5 text-slate-400">
      {children}
    </p>
  );
}

function FieldError({
  message,
}: {
  message?: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 text-xs font-medium text-rose-600">
      {message}
    </p>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "min-h-11 rounded-xl border px-3 py-2 text-sm font-medium transition",
        active
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ToggleCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onChange(!checked)
      }
      className={[
        "flex min-h-[82px] items-center justify-between gap-4 rounded-2xl border p-4 text-left transition",
        checked
          ? "border-slate-950 bg-slate-50"
          : "border-slate-200 bg-white hover:bg-slate-50",
      ].join(" ")}
    >
      <div>
        <p className="text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <span
        className={[
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
          checked
            ? "border-slate-950 bg-slate-950 text-white"
            : "border-slate-300 bg-white",
        ].join(" ")}
      >
        {checked && <Check size={14} />}
      </span>
    </button>
  );
}

function SafetyNotice() {
  return (
    <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4">
      <div className="flex gap-3">
        <ShieldCheck
          size={20}
          className="mt-0.5 shrink-0 text-rose-600"
        />

        <div>
          <p className="text-sm font-bold text-rose-950">
            美容・按摩类招聘规则
          </p>

          <p className="mt-1 text-xs leading-6 text-rose-800">
            Sakura
            仅允许发布合法的一般美容、按摩、エステ及リラクゼーション相关招聘。
            禁止成人服务、性服务暗示、违法风俗业务、灰色招聘以及利用
            +V、微信变体等方式进行隐晦站外导流。
          </p>

          <p className="mt-2 text-xs font-semibold text-rose-900">
            此分类会进入加强审核流程。
          </p>
        </div>
      </div>
    </div>
  );
}

function PreviewSection({
  title,
  rows,
}: {
  title: string;
  rows: [string, string][];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <h3 className="text-sm font-bold text-slate-950">
        {title}
      </h3>

      <div className="mt-4 divide-y divide-slate-100">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-start justify-between gap-5 py-3 first:pt-0 last:pb-0"
          >
            <span className="shrink-0 text-sm text-slate-400">
              {label}
            </span>

            <span className="text-right text-sm font-medium text-slate-800">
              {value || "未填写"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}