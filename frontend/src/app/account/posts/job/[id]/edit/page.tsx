"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  Check,
  CircleAlert,
  Clock3,
  GraduationCap,
  Info,
  JapaneseYen,
  Languages,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Send,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import Container from "@/components/layout/Container";

type SaveAction = "draft" | "submit";

type JobStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected";

interface JobForm {
  company: string;
  title: string;

  prefecture: string;
  city: string;
  address: string;
  nearestStation: string;

  salaryMin: string;
  salaryMax: string;
  salaryType: string;

  employmentType: string;
  workStyle: string;

  experience: string;
  education: string;
  language: string;

  workingHours: string;
  holiday: string;

  description: string;

  contactName: string;
  phone: string;
  email: string;
}

interface MockJob {
  id: string;
  status: JobStatus;
  form: JobForm;
  benefits: string[];
}

const prefectures = [
  "北海道",
  "青森",
  "岩手",
  "宫城",
  "秋田",
  "山形",
  "福岛",
  "茨城",
  "栃木",
  "群马",
  "埼玉",
  "千叶",
  "东京",
  "神奈川",
  "新潟",
  "富山",
  "石川",
  "福井",
  "山梨",
  "长野",
  "岐阜",
  "静冈",
  "爱知",
  "三重",
  "滋贺",
  "京都",
  "大阪",
  "兵库",
  "奈良",
  "和歌山",
  "鸟取",
  "岛根",
  "冈山",
  "广岛",
  "山口",
  "德岛",
  "香川",
  "爱媛",
  "高知",
  "福冈",
  "佐贺",
  "长崎",
  "熊本",
  "大分",
  "宫崎",
  "鹿儿岛",
  "冲绳",
];

const employmentOptions = [
  "正社員",
  "契約社員",
  "派遣社員",
  "アルバイト・パート",
  "業務委託",
  "インターン",
];

const workStyleOptions = [
  "现场办公",
  "混合办公",
  "完全远程",
];

const benefitOptions = [
  "交通费支给",
  "社会保险",
  "奖金",
  "加薪制度",
  "住房补贴",
  "资格补贴",
  "远程办公",
  "弹性工作",
  "带薪休假",
  "签证支持",
  "外国人欢迎",
  "未经验可",
];

function getSalaryMax(
  salaryType: string
) {
  switch (salaryType) {
    case "时薪":
      return 100_000;

    case "日薪":
      return 1_000_000;

    case "月薪":
      return 10_000_000;

    case "年薪":
      return 100_000_000;

    default:
      return 100_000_000;
  }
}

/*
|--------------------------------------------------------------------------
| 工作编辑 API
|--------------------------------------------------------------------------
|
| TODO [API - GET]
| GET /api/me/jobs/:id
|
| 获取当前登录用户自己的招聘信息。
|
| 后端必须验证：
| job.authorId === session.user.id
|
|--------------------------------------------------------------------------
|
| TODO [API - PATCH]
| PATCH /api/jobs/:id
|
| 修改招聘信息。
|
| status:
| - draft
| - pending
|
| 后端必须再次验证 ownership。
|
|--------------------------------------------------------------------------
*/

function createMockJob(id: string): MockJob {
  return {
    id,
    status: "published",

    form: {
      company: "Sakura Tech株式会社",
      title: "Python 后端工程师",

      prefecture: "东京",
      city: "涩谷区",
      address: "涩谷2丁目",
      nearestStation: "涩谷站",

      salaryMin: "450000",
      salaryMax: "650000",
      salaryType: "月薪",

      employmentType: "正社員",
      workStyle: "混合办公",

      experience: "Python开发经验2年以上",
      education: "专门学校以上",
      language: "日语N2以上，中文不限",

      workingHours: "9:00 ～ 18:00",
      holiday: "周六日祝、年末年始",

      description:
        "【工作内容】\n・Python / FastAPI 后端开发\n・公司内部系统开发\n・数据库设计及维护\n\n【招聘要求】\n・Python开发经验\n・能够使用日语进行工作沟通\n\n【欢迎条件】\n・有日本IT项目经验\n・有AWS经验",

      contactName: "田中太郎",
      phone: "0312345678",
      email: "recruit@example.com",
    },

    benefits: [
      "交通费支给",
      "社会保险",
      "奖金",
      "远程办公",
      "带薪休假",
      "外国人欢迎",
    ],
  };
}

export default function EditJobPage() {
  const params = useParams<{ id: string }>();

  const jobId = params.id;

  const [form, setForm] =
    useState<JobForm | null>(null);

  const [status, setStatus] =
    useState<JobStatus>("draft");

  const [benefits, setBenefits] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [notice, setNotice] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadJob() {
      setLoading(true);

      try {
        /*
        ================================================================
        TODO [API - GET]
        GET /api/me/jobs/:id

        const response = await fetch(
          `/api/me/jobs/${jobId}`
        );

        if (!response.ok) {
          throw new Error("无法读取招聘信息");
        }

        const data = await response.json();
        ================================================================
        */

        await new Promise((resolve) => {
          window.setTimeout(resolve, 300);
        });

        const data = createMockJob(jobId);

        if (!active) {
          return;
        }

        setForm(data.form);
        setBenefits(data.benefits);
        setStatus(data.status);
      } catch {
        if (active) {
          setError(
            "无法读取该招聘信息。"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadJob();

    return () => {
      active = false;
    };
  }, [jobId]);

  const locationPreview = useMemo(() => {
    if (!form) {
      return "";
    }

    return [form.prefecture, form.city]
      .filter(Boolean)
      .join(" · ");
  }, [form]);

  const salaryPreview = useMemo(() => {
    if (!form) {
      return "薪资面议";
    }

    const min = Number(form.salaryMin);
    const max = Number(form.salaryMax);

    if (!min && !max) {
      return "薪资面议";
    }

    if (min && max) {
      return `${formatYen(min)} ～ ${formatYen(max)} / ${form.salaryType}`;
    }

    if (min) {
      return `${formatYen(min)} 起 / ${form.salaryType}`;
    }

    return `最高 ${formatYen(max)} / ${form.salaryType}`;
  }, [form]);

  function updateField<
    K extends keyof JobForm
  >(
    key: K,
    value: JobForm[K]
  ) {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [key]: value,
      };
    });

    setError("");
    setNotice("");
  }

  function toggleBenefit(
    benefit: string
  ) {
    setBenefits((current) => {
      if (current.includes(benefit)) {
        return current.filter(
          (item) => item !== benefit
        );
      }

      return [
        ...current,
        benefit,
      ];
    });

    setNotice("");
  }

  function validateForSubmit() {
    if (!form) {
      return "招聘数据尚未加载。";
    }

    if (!form.company.trim()) {
      return "请输入公司名称。";
    }

    if (
      form.company.trim().length >
      100
    ) {
      return "公司名称不能超过 100 个字符。";
    }

    if (!form.title.trim()) {
      return "请输入招聘职位。";
    }

    if (
      form.title.trim().length >
      80
    ) {
      return "招聘职位不能超过 80 个字符。";
    }

    if (!form.prefecture) {
      return "请选择工作所在地。";
    }

    if (!form.city.trim()) {
      return "请输入市区町村。";
    }

    if (
      form.city.trim().length > 50
    ) {
      return "市区町村不能超过 50 个字符。";
    }

    if (
      form.address.trim().length >
      150
    ) {
      return "详细地址不能超过 150 个字符。";
    }

    if (
      form.nearestStation.trim()
        .length > 50
    ) {
      return "最近车站不能超过 50 个字符。";
    }

    if (!form.employmentType) {
      return "请选择雇佣形式。";
    }

    if (!form.workStyle) {
      return "请选择工作方式。";
    }

    const salaryLimit =
      getSalaryMax(form.salaryType);

    if (form.salaryMin) {
      const salaryMin =
        Number(form.salaryMin);

      if (
        !Number.isFinite(salaryMin) ||
        salaryMin <= 0
      ) {
        return "请输入正确的最低薪资。";
      }

      if (
        salaryMin > salaryLimit
      ) {
        return `${form.salaryType}不能超过 ${salaryLimit.toLocaleString()} 日元。`;
      }
    }

    if (form.salaryMax) {
      const salaryMax =
        Number(form.salaryMax);

      if (
        !Number.isFinite(salaryMax) ||
        salaryMax <= 0
      ) {
        return "请输入正确的最高薪资。";
      }

      if (
        salaryMax > salaryLimit
      ) {
        return `${form.salaryType}不能超过 ${salaryLimit.toLocaleString()} 日元。`;
      }
    }

    if (
      form.salaryMin &&
      form.salaryMax &&
      Number(form.salaryMin) >
        Number(form.salaryMax)
    ) {
      return "最低薪资不能高于最高薪资。";
    }

    if (
      form.experience.trim().length >
      200
    ) {
      return "经验要求不能超过 200 个字符。";
    }

    if (
      form.education.trim().length >
      100
    ) {
      return "学历要求不能超过 100 个字符。";
    }

    if (
      form.language.trim().length >
      200
    ) {
      return "语言要求不能超过 200 个字符。";
    }

    if (
      form.workingHours.trim().length >
      100
    ) {
      return "工作时间不能超过 100 个字符。";
    }

    if (
      form.holiday.trim().length >
      100
    ) {
      return "休息 / 休日不能超过 100 个字符。";
    }

    if (!form.description.trim()) {
      return "请输入招聘详细内容。";
    }

    if (
      form.description.trim().length >
      5000
    ) {
      return "招聘详细内容不能超过 5000 个字符。";
    }

    if (!form.contactName.trim()) {
      return "请输入招聘联系人。";
    }

    if (
      form.contactName.trim().length <
      2
    ) {
      return "招聘联系人至少需要 2 个字符。";
    }

    if (
      form.contactName.trim().length >
      50
    ) {
      return "招聘联系人不能超过 50 个字符。";
    }

    if (
      !/^[一-龯々ぁ-んァ-ヶーa-zA-Z\s・]+$/.test(
        form.contactName.trim()
      )
    ) {
      return "招聘联系人包含不支持的字符。";
    }

    if (
      !form.phone.trim() &&
      !form.email.trim()
    ) {
      return "联系电话和邮箱至少填写一项。";
    }

    if (
      form.phone &&
      !/^0\d{9,10}$/.test(
        form.phone
      )
    ) {
      return "请输入正确的日本电话号码。";
    }

    if (
      form.email.length > 254
    ) {
      return "邮箱地址不能超过 254 个字符。";
    }

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      return "请输入正确的招聘邮箱。";
    }

    return "";
  }

  async function saveJob(
    action: SaveAction
  ) {
    if (!form) {
      return;
    }

    setError("");
    setNotice("");

    if (action === "submit") {
      const validationError =
        validateForSubmit();

      if (validationError) {
        setError(
          validationError
        );

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }
    }

    setSaving(true);

    try {
      const payload = {
        company:
          form.company.trim(),

        title:
          form.title.trim(),

        prefecture:
          form.prefecture,

        city:
          form.city.trim(),

        address:
          form.address.trim(),

        nearestStation:
          form.nearestStation.trim(),

        salaryMin:
          Number(
            form.salaryMin || 0
          ),

        salaryMax:
          Number(
            form.salaryMax || 0
          ),

        salaryType:
          form.salaryType,

        employmentType:
          form.employmentType,

        workStyle:
          form.workStyle,

        experience:
          form.experience.trim(),

        education:
          form.education.trim(),

        language:
          form.language.trim(),

        workingHours:
          form.workingHours.trim(),

        holiday:
          form.holiday.trim(),

        benefits,

        description:
          form.description.trim(),

        contactName:
          form.contactName.trim(),

        phone:
          form.phone.trim(),

        email:
          form.email.trim(),

        status:
          action === "draft"
            ? ("draft" as const)
            : ("pending" as const),
      };

      /*
      ================================================================
      TODO [API - PATCH]
      PATCH /api/jobs/:id

      const response = await fetch(
        `/api/jobs/${jobId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload
          ),
        }
      );

      if (!response.ok) {
        throw new Error(
          "修改招聘信息失败"
        );
      }
      ================================================================
      */

      console.log(
        "Mock update job:",
        jobId,
        payload
      );

      await new Promise((resolve) => {
        window.setTimeout(
          resolve,
          400
        );
      });

      if (action === "draft") {
        setStatus("draft");

        setNotice(
          "修改内容已保存为草稿。当前为 Mock 模式。"
        );
      } else {
        setStatus("pending");

        setNotice(
          "修改后的招聘信息已重新提交审核。当前为 Mock 模式。"
        );
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch {
      setError(
        "保存失败，请稍后重新尝试。"
      );
    } finally {
      setSaving(false);
    }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    void saveJob("submit");
  }

  if (loading) {
    return <LoadingPage />;
  }

  if (!form) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Container>
          <div className="px-4 py-20">
            <div
              className="
                mx-auto
                max-w-lg
                rounded-[24px]
                border
                border-rose-200
                bg-white
                p-8
                text-center
                shadow-sm
              "
            >
              <CircleAlert
                size={32}
                className="
                  mx-auto
                  text-rose-500
                "
              />

              <h1
                className="
                  mt-4
                  text-xl
                  font-black
                  text-slate-950
                "
              >
                无法读取招聘信息
              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                招聘不存在，或者你没有编辑权限。
              </p>

              <Link
                href="/account/posts"
                className="
                  mt-6
                  inline-flex
                  rounded-xl
                  bg-slate-950
                  px-5
                  py-3
                  text-sm
                  font-black
                  text-white
                "
              >
                返回我的发布
              </Link>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* TOP */}

      <section
        className="
          border-b
          border-slate-200
          bg-white
        "
      >
        <Container>
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              px-4
              py-5
            "
          >
            <Link
              href="/account/posts"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-bold
                text-slate-500
                transition
                hover:text-slate-900
              "
            >
              <ArrowLeft size={16} />
              返回我的发布
            </Link>

            <StatusBadge
              status={status}
            />
          </div>
        </Container>
      </section>

      {/* HERO */}

      <section
        className="
          relative
          overflow-hidden
          bg-slate-950
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -left-32
            -top-32
            h-[420px]
            w-[420px]
            rounded-full
            bg-violet-600/15
            blur-3xl
          "
        />

        <Container>
          <div
            className="
              relative
              px-4
              py-10
              sm:py-12
            "
          >
            <div
              className="
                flex
                max-w-3xl
                items-start
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-violet-400/20
                  bg-violet-400/10
                  text-violet-300
                "
              >
                <BriefcaseBusiness
                  size={22}
                />
              </div>

              <div>
                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-violet-400
                  "
                >
                  EDIT JOB
                </p>

                <h1
                  className="
                    mt-2
                    text-3xl
                    font-black
                    tracking-tight
                    text-white
                  "
                >
                  编辑招聘
                </h1>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-slate-400
                  "
                >
                  招聘 ID：{jobId}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FORM */}

      <section className="py-8 sm:py-10">
        <Container>
          <form
            onSubmit={handleSubmit}
            className="
              grid
              gap-7
              px-4
              xl:grid-cols-[minmax(0,1fr)_320px]
            "
          >
            <div className="min-w-0 space-y-6">
              {error && (
                <MessageBox type="error">
                  {error}
                </MessageBox>
              )}

              {notice && (
                <MessageBox type="success">
                  {notice}
                </MessageBox>
              )}

              {status === "published" && (
                <div
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-[20px]
                    border
                    border-amber-200
                    bg-amber-50
                    p-4
                  "
                >
                  <Info
                    size={18}
                    className="
                      mt-0.5
                      shrink-0
                      text-amber-600
                    "
                  />

                  <p
                    className="
                      text-sm
                      font-semibold
                      leading-6
                      text-amber-900
                    "
                  >
                    这是已经公开的招聘信息。
                    修改后重新提交时，
                    新内容将进入审核状态。
                  </p>
                </div>
              )}

              {status === "rejected" && (
                <div
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-[20px]
                    border
                    border-rose-200
                    bg-rose-50
                    p-4
                  "
                >
                  <CircleAlert
                    size={18}
                    className="
                      mt-0.5
                      shrink-0
                      text-rose-600
                    "
                  />

                  <p
                    className="
                      text-sm
                      font-semibold
                      leading-6
                      text-rose-900
                    "
                  >
                    该招聘之前未通过审核。
                    修改相关信息后可以重新提交。
                  </p>
                </div>
              )}

              {/* COMPANY */}

              <FormSection
                title="公司与职位"
                description="修改招聘主体和职位信息"
              >
                <Field
                  label="公司名称"
                  required
                >
                  <div className="relative">
                    <Building2
                      size={17}
                      className={iconClass}
                    />

                    <input
                      value={form.company}
                      maxLength={100}
                      onChange={(event) =>
                        updateField(
                          "company",
                          event.target.value
                        )
                      }
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                <Field
                  label="招聘职位"
                  required
                >
                  <div className="relative">
                    <BriefcaseBusiness
                      size={17}
                      className={iconClass}
                    />

                    <input
                      value={form.title}
                      maxLength={80}
                      onChange={(event) =>
                        updateField(
                          "title",
                          event.target.value
                        )
                      }
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                <Field
                  label="雇佣形式"
                  required
                >
                  <select
                    value={
                      form.employmentType
                    }
                    onChange={(event) =>
                      updateField(
                        "employmentType",
                        event.target.value
                      )
                    }
                    className={selectClass}
                  >
                    <option value="">
                      请选择
                    </option>

                    {employmentOptions.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </Field>

                <Field
                  label="工作方式"
                  required
                >
                  <select
                    value={form.workStyle}
                    onChange={(event) =>
                      updateField(
                        "workStyle",
                        event.target.value
                      )
                    }
                    className={selectClass}
                  >
                    <option value="">
                      请选择
                    </option>

                    {workStyleOptions.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </Field>
              </FormSection>

              {/* LOCATION */}

              <FormSection
                title="工作地点"
                description="修改实际工作所在地"
              >
                <Field
                  label="都道府县"
                  required
                >
                  <select
                    value={
                      form.prefecture
                    }
                    onChange={(event) =>
                      updateField(
                        "prefecture",
                        event.target.value
                      )
                    }
                    className={selectClass}
                  >
                    <option value="">
                      请选择
                    </option>

                    {prefectures.map(
                      (prefecture) => (
                        <option
                          key={prefecture}
                          value={prefecture}
                        >
                          {prefecture}
                        </option>
                      )
                    )}
                  </select>
                </Field>

                <Field
                  label="市区町村"
                  required
                >
                  <input
                    value={form.city}
                    maxLength={50}
                    onChange={(event) =>
                      updateField(
                        "city",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="详细地址"
                  full
                >
                  <div className="relative">
                    <MapPin
                      size={17}
                      className={iconClass}
                    />

                    <input
                      value={form.address}
                      maxLength={150}
                      onChange={(event) =>
                        updateField(
                          "address",
                          event.target.value
                        )
                      }
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                <Field label="最近车站">
                  <input
                    value={form.nearestStation}
                    maxLength={50}
                    onChange={(event) =>
                      updateField(
                        "nearestStation",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </Field>
              </FormSection>

              {/* SALARY */}

              <FormSection
                title="薪资待遇"
                description="修改薪资范围"
              >
                <Field label="薪资形式">
                  <select
                    value={
                      form.salaryType
                    }
                    onChange={(event) =>
                      updateField(
                        "salaryType",
                        event.target.value
                      )
                    }
                    className={selectClass}
                  >
                    <option value="月薪">
                      月薪
                    </option>

                    <option value="年薪">
                      年薪
                    </option>

                    <option value="时薪">
                      时薪
                    </option>

                    <option value="日薪">
                      日薪
                    </option>
                  </select>
                </Field>

                <div className="hidden md:block" />

                <Field label="最低薪资">
                  <MoneyInput
                    value={form.salaryMin}
                    max={getSalaryMax(
                      form.salaryType
                    )}
                    onChange={(value) =>
                      updateField(
                        "salaryMin",
                        value
                      )
                    }
                  />
                </Field>

                <Field label="最高薪资">
                  <MoneyInput
                    value={form.salaryMax}
                    max={getSalaryMax(
                      form.salaryType
                    )}
                    onChange={(value) =>
                      updateField(
                        "salaryMax",
                        value
                      )
                    }
                  />
                </Field>
              </FormSection>

              {/* REQUIREMENTS */}

              <FormSection
                title="招聘条件"
                description="修改应聘条件"
              >
                <Field label="经验要求">
                  <div className="relative">
                    <Users
                      size={17}
                      className={iconClass}
                    />

                    <input
                      value={form.experience}
                      maxLength={200}
                      onChange={(event) =>
                        updateField(
                          "experience",
                          event.target.value
                        )
                      }
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                <Field label="学历要求">
                  <div className="relative">
                    <GraduationCap
                      size={17}
                      className={iconClass}
                    />

                    <input
                      value={form.education}
                      maxLength={100}
                      onChange={(event) =>
                        updateField(
                          "education",
                          event.target.value
                        )
                      }
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                <Field
                  label="语言要求"
                  full
                >
                  <div className="relative">
                    <Languages
                      size={17}
                      className={iconClass}
                    />

                    <input
                      value={form.language}
                      maxLength={200}
                      onChange={(event) =>
                        updateField(  
                          "language",
                          event.target.value
                        )
                      }
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>
              </FormSection>

              {/* HOURS */}

              <FormSection
                title="工作时间"
                description="修改工作时间和休日"
              >
                <Field label="工作时间">
                  <div className="relative">
                    <Clock3
                      size={17}
                      className={iconClass}
                    />

                    <input
                      value={form.workingHours}
                      maxLength={100}
                      onChange={(event) =>
                        updateField(
                          "workingHours",
                          event.target.value
                        )
                      }
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                <Field label="休息 / 休日">
                  <input
                    value={form.holiday}
                    maxLength={100}
                    onChange={(event) =>
                      updateField(
                        "holiday",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </Field>
              </FormSection>

              {/* BENEFITS */}

              <FormSection
                title="福利待遇"
                description="修改福利标签"
                singleColumn
              >
                <div
                  className="
                    flex
                    flex-wrap
                    gap-2.5
                  "
                >
                  {benefitOptions.map(
                    (benefit) => {
                      const active =
                        benefits.includes(
                          benefit
                        );

                      return (
                        <button
                          key={benefit}
                          type="button"
                          onClick={() =>
                            toggleBenefit(
                              benefit
                            )
                          }
                          className={`
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            px-3.5
                            py-2
                            text-sm
                            font-bold
                            transition
                            ${
                              active
                                ? "border-violet-600 bg-violet-600 text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-600"
                            }
                          `}
                        >
                          {active && (
                            <Check
                              size={14}
                            />
                          )}

                          {benefit}
                        </button>
                      );
                    }
                  )}
                </div>
              </FormSection>

              {/* DESCRIPTION */}

              <FormSection
                title="招聘详情"
                description="修改职位详细内容"
                singleColumn
              >
                <Field
                  label="详细内容"
                  required
                  full
                >
                  <textarea
                    value={form.description}
                    maxLength={5000}
                    onChange={(event) =>
                      updateField(
                        "description",
                        event.target.value
                      )
                    }
                    rows={10}
                    className={`${inputClass} resize-y leading-7`}
                  />

                  <p
                    className="
                      mt-2
                      text-right
                      text-xs
                      text-slate-400
                    "
                  >
                    {
                      form.description
                        .length
                    } / 5000 字
                  </p>
                </Field>
              </FormSection>

              {/* CONTACT */}

              <FormSection
                title="招聘联系方式"
                description="修改求职者使用的联系方式"
              >
                <Field
                  label="招聘联系人"
                  required
                >
                  <div className="relative">
                    <User
                      size={17}
                      className={iconClass}
                    />

                    <input
                      type="text"
                      maxLength={50}
                      value={form.contactName}
                      onChange={(event) => {
                        const value =
                          event.target.value
                            .replace(
                              /[^一-龯々ぁ-んァ-ヶーa-zA-Z\s・]/g,
                              ""
                            )
                            .slice(0, 50);

                        updateField(
                          "contactName",
                          value
                        );
                      }}
                      placeholder="例如：田中太郎"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                <Field label="联系电话">
                  <div className="relative">
                    <Phone
                      size={17}
                      className={iconClass}
                    />

                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={11}
                      value={form.phone}
                      onChange={(event) =>
                        updateField(
                          "phone",
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 11)
                        )
                      }
                      placeholder="09012345678"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                <Field
                  label="招聘邮箱"
                  full
                >
                  <div className="relative">
                    <Mail
                      size={17}
                      className={iconClass}
                    />

                    <input
                      type="email"
                      maxLength={254}
                      value={form.email}
                      onChange={(event) =>
                        updateField(
                          "email",
                          event.target.value
                        )
                      }
                      placeholder="recruit@example.com"
                      className={`${inputClass} pl-11`}
                    />
                  </div>

                  <p
                    className="
                      mt-2
                      text-xs
                      text-slate-400
                    "
                  >
                    电话和邮箱至少填写一项。
                  </p>
                </Field>
              </FormSection>
            </div>

            {/* SIDEBAR */}

            <aside
              className="
                h-fit
                xl:sticky
                xl:top-24
              "
            >
              <div
                className="
                  rounded-[24px]
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <h2
                    className="
                      font-black
                      text-slate-950
                    "
                  >
                    修改预览
                  </h2>

                  <StatusBadge
                    status={status}
                  />
                </div>

                <div
                  className="
                    mt-5
                    rounded-[20px]
                    border
                    border-slate-200
                    bg-white
                    p-5
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-violet-50
                        text-violet-600
                      "
                    >
                      <BriefcaseBusiness
                        size={19}
                      />
                    </div>

                    <div className="min-w-0">
                      <h3
                        className="
                          line-clamp-2
                          font-black
                          text-slate-950
                        "
                      >
                        {form.title ||
                          "招聘职位"}
                      </h3>

                      <p
                        className="
                          mt-1
                          truncate
                          text-xs
                          font-semibold
                          text-slate-500
                        "
                      >
                        {form.company ||
                          "公司名称"}
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      mt-5
                      text-lg
                      font-black
                      text-violet-600
                    "
                  >
                    {salaryPreview}
                  </div>

                  <div
                    className="
                      mt-4
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    {form.employmentType && (
                      <PreviewTag>
                        {
                          form.employmentType
                        }
                      </PreviewTag>
                    )}

                    {form.workStyle && (
                      <PreviewTag>
                        {form.workStyle}
                      </PreviewTag>
                    )}

                    {locationPreview && (
                      <PreviewTag>
                        {locationPreview}
                      </PreviewTag>
                    )}
                  </div>

                  {benefits.length > 0 && (
                    <div
                      className="
                        mt-4
                        flex
                        flex-wrap
                        gap-1.5
                      "
                    >
                      {benefits
                        .slice(0, 4)
                        .map((benefit) => (
                          <span
                            key={benefit}
                            className="
                              rounded-full
                              bg-slate-100
                              px-2.5
                              py-1
                              text-[10px]
                              font-bold
                              text-slate-600
                            "
                          >
                            {benefit}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                <div
                  className="
                    mt-5
                    rounded-2xl
                    bg-violet-50
                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-2
                    "
                  >
                    <Info
                      size={16}
                      className="
                        mt-0.5
                        shrink-0
                        text-violet-600
                      "
                    />

                    <p
                      className="
                        text-xs
                        leading-5
                        text-violet-900/75
                      "
                    >
                      保存修改可以先保留为草稿。
                      重新提交后进入审核流程。
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mt-5
                    space-y-2.5
                  "
                >
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      void saveJob(
                        "draft"
                      )
                    }
                    className="
                      inline-flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      font-black
                      text-slate-700
                      transition
                      hover:bg-slate-50
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {saving ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={17} />
                    )}

                    保存修改
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="
                      inline-flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-violet-600
                      px-4
                      py-3
                      text-sm
                      font-black
                      text-white
                      shadow-lg
                      shadow-violet-600/15
                      transition
                      hover:bg-violet-700
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {saving ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Send size={17} />
                    )}

                    重新提交审核
                  </button>
                </div>

                <Link
                  href={`/jobs/${jobId}`}
                  className="
                    mt-3
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    px-4
                    py-2.5
                    text-xs
                    font-bold
                    text-slate-500
                    transition
                    hover:bg-slate-50
                    hover:text-slate-900
                  "
                >
                  查看当前公开页面
                </Link>
              </div>

              <div
                className="
                  mt-4
                  rounded-[22px]
                  border
                  border-amber-200
                  bg-amber-50
                  p-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    font-black
                    text-amber-900
                  "
                >
                  <ShieldCheck size={17} />
                  修改提醒
                </div>

                <p
                  className="
                    mt-3
                    text-xs
                    leading-5
                    text-amber-900/70
                  "
                >
                  正式上线后只有招聘发布者本人和管理员可以编辑这条信息。
                </p>
              </div>
            </aside>
          </form>
        </Container>
      </section>
    </main>
  );
}

function StatusBadge({
  status,
}: {
  status: JobStatus;
}) {
  const config = {
    draft: {
      label: "草稿",
      className:
        "bg-slate-100 text-slate-600",
    },

    pending: {
      label: "审核中",
      className:
        "bg-amber-100 text-amber-700",
    },

    published: {
      label: "已发布",
      className:
        "bg-emerald-100 text-emerald-700",
    },

    rejected: {
      label: "未通过",
      className:
        "bg-rose-100 text-rose-700",
    },
  }[status];

  return (
    <span
      className={`
        inline-flex
        shrink-0
        rounded-full
        px-3
        py-1.5
        text-[11px]
        font-black
        ${config.className}
      `}
    >
      {config.label}
    </span>
  );
}

function FormSection({
  title,
  description,
  children,
  singleColumn = false,
}: {
  title: string;
  description: string;
  children: ReactNode
  singleColumn?: boolean;
}) {
  return (
    <section
      className="
        rounded-[26px]
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        sm:p-6
      "
    >
      <div
        className="
          border-b
          border-slate-100
          pb-5
        "
      >
        <h2
          className="
            text-lg
            font-black
            text-slate-950
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-slate-500
          "
        >
          {description}
        </p>
      </div>

      <div
        className={
          singleColumn
            ? "mt-6"
            : "mt-6 grid gap-5 md:grid-cols-2"
        }
      >
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  required = false,
  full = false,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  children: ReactNode
}) {
  return (
    <div
      className={
        full ? "md:col-span-2" : ""
      }
    >
      <label
        className="
          mb-2
          block
          text-sm
          font-black
          text-slate-700
        "
      >
        {label}

        {required && (
          <span className="ml-1 text-rose-500">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

function MoneyInput({
    value,
    onChange,
    max,
  }: {
    value: string;
    onChange: (
      value: string
    ) => void;
    max: number;
  }) {
    return (
      <div className="relative">
        <JapaneseYen
          size={17}
          className={iconClass}
        />

        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(event) => {
            const raw =
              event.target.value.replace(
                /\D/g,
                ""
              );

            if (!raw) {
              onChange("");
              return;
            }

            const amount =
              Math.min(
                Number(raw),
                max
              );

            onChange(
              String(amount)
            );
          }}
          className={`${inputClass} pl-11`}
        />
      </div>
    );
  }

function PreviewTag({
  children,
}: {
  children: ReactNode
}) {
  return (
    <span
      className="
        rounded-full
        border
        border-violet-100
        bg-violet-50
        px-2.5
        py-1
        text-[10px]
        font-black
        text-violet-700
      "
    >
      {children}
    </span>
  );
}

function MessageBox({
  type,
  children,
}: {
  type: "error" | "success";
  children: ReactNode
}) {
  const isError =
    type === "error";

  return (
    <div
      className={`
        flex
        items-start
        gap-3
        rounded-[20px]
        border
        p-4
        ${
          isError
            ? "border-rose-200 bg-rose-50 text-rose-800"
            : "border-emerald-200 bg-emerald-50 text-emerald-800"
        }
      `}
    >
      {isError ? (
        <CircleAlert
          size={18}
          className="mt-0.5 shrink-0"
        />
      ) : (
        <Check
          size={18}
          className="mt-0.5 shrink-0"
        />
      )}

      <p
        className="
          text-sm
          font-semibold
          leading-6
        "
      >
        {children}
      </p>
    </div>
  );
}

function LoadingPage() {
  return (
    <main
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-slate-50
      "
    >
      <div className="text-center">
        <Loader2
          size={28}
          className="
            mx-auto
            animate-spin
            text-violet-600
          "
        />

        <p
          className="
            mt-3
            text-sm
            font-bold
            text-slate-500
          "
        >
          正在读取招聘信息...
        </p>
      </div>
    </main>
  );
}

const inputClass = `
  w-full
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-3
  text-sm
  text-slate-900
  outline-none
  transition
  placeholder:text-slate-400
  focus:border-violet-400
  focus:ring-4
  focus:ring-violet-50
`;

const selectClass = `
  w-full
  appearance-none
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-3
  text-sm
  font-semibold
  text-slate-700
  outline-none
  transition
  focus:border-violet-400
  focus:ring-4
  focus:ring-violet-50
`;

const iconClass = `
  pointer-events-none
  absolute
  left-4
  top-1/2
  -translate-y-1/2
  text-slate-400
`;

function formatYen(
  value: number
) {
  return `¥${value.toLocaleString()}`;
}