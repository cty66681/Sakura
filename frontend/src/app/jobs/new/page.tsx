"use client";

import Link from "next/link";
import {
  FormEvent,
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
  Mail,
  MapPin,
  Save,
  Send,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import Container from "@/components/layout/Container";

type PublishAction = "draft" | "submit";

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

const initialForm: JobForm = {
  company: "",
  title: "",

  prefecture: "",
  city: "",
  address: "",
  nearestStation: "",

  salaryMin: "",
  salaryMax: "",
  salaryType: "月薪",

  employmentType: "",
  workStyle: "",

  experience: "",
  education: "",
  language: "",

  workingHours: "",
  holiday: "",

  description: "",

  contactName: "",
  phone: "",
  email: "",
};

/*
|--------------------------------------------------------------------------
| 工作发布 API
|--------------------------------------------------------------------------
|
| TODO [API - POST]
| POST /api/jobs
|
| 创建招聘信息。
|
| 后端必须：
| - 从登录 Session 获取 authorId
| - 不接受前端自行指定 authorId
| - 校验发布权限
| - 校验职位字段
| - 防止重复 / 垃圾招聘
|
| status:
| "draft"   = 草稿
| "pending" = 提交审核
|
|--------------------------------------------------------------------------
*/

export default function NewJobPage() {
  const [form, setForm] =
    useState<JobForm>(initialForm);

  const [benefits, setBenefits] =
    useState<string[]>([]);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const locationPreview = useMemo(() => {
    return [form.prefecture, form.city]
      .filter(Boolean)
      .join(" · ");
  }, [form.prefecture, form.city]);

  const salaryPreview = useMemo(() => {
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
  }, [
    form.salaryMin,
    form.salaryMax,
    form.salaryType,
  ]);

  function updateField<K extends keyof JobForm>(
    key: K,
    value: JobForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setError("");
    setNotice("");
  }

  function toggleBenefit(benefit: string) {
    setBenefits((current) => {
      if (current.includes(benefit)) {
        return current.filter(
          (item) => item !== benefit
        );
      }

      return [...current, benefit];
    });

    setNotice("");
  }

  function validateForSubmit() {
    if (!form.company.trim()) {
      return "请输入公司名称。";
    }

    if (!form.title.trim()) {
      return "请输入招聘职位。";
    }

    if (!form.prefecture) {
      return "请选择工作所在地。";
    }

    if (!form.city.trim()) {
      return "请输入市区町村。";
    }

    if (!form.employmentType) {
      return "请选择雇佣形式。";
    }

    if (!form.workStyle) {
      return "请选择工作方式。";
    }

    if (
      form.salaryMin &&
      Number(form.salaryMin) < 0
    ) {
      return "最低薪资格式不正确。";
    }

    if (
      form.salaryMax &&
      Number(form.salaryMax) < 0
    ) {
      return "最高薪资格式不正确。";
    }

    if (
      form.salaryMin &&
      form.salaryMax &&
      Number(form.salaryMin) >
        Number(form.salaryMax)
    ) {
      return "最低薪资不能高于最高薪资。";
    }

    if (!form.description.trim()) {
      return "请输入招聘详细内容。";
    }

    if (!form.contactName.trim()) {
      return "请输入招聘联系人。";
    }

    if (
      !form.phone.trim() &&
      !form.email.trim()
    ) {
      return "联系电话和邮箱至少填写一项。";
    }

    return "";
  }

  async function saveJob(
    action: PublishAction
  ) {
    setError("");
    setNotice("");

    if (action === "submit") {
      const validationError =
        validateForSubmit();

      if (validationError) {
        setError(validationError);

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
        company: form.company.trim(),
        title: form.title.trim(),

        prefecture: form.prefecture,
        city: form.city.trim(),
        address: form.address.trim(),

        nearestStation:
          form.nearestStation.trim(),

        salaryMin: Number(
          form.salaryMin || 0
        ),

        salaryMax: Number(
          form.salaryMax || 0
        ),

        salaryType: form.salaryType,

        employmentType:
          form.employmentType,

        workStyle: form.workStyle,

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

        phone: form.phone.trim(),
        email: form.email.trim(),

        status:
          action === "draft"
            ? ("draft" as const)
            : ("pending" as const),
      };

      /*
      ================================================================
      TODO [API - POST]
      POST /api/jobs

      const response = await fetch(
        "/api/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(
          "发布工作失败"
        );
      }
      ================================================================
      */

      console.log(
        "Mock job publish:",
        payload
      );

      await new Promise((resolve) => {
        window.setTimeout(resolve, 350);
      });

      if (action === "draft") {
        setNotice(
          "招聘草稿已保存。当前为 Mock 模式，刷新页面后不会保留。"
        );
      } else {
        setNotice(
          "招聘信息已提交审核。当前为 Mock 模式，接入后端后会进入「审核中」状态。"
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

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================================================= */}
      {/* TOP */}
      {/* ================================================= */}

      <section
        className="
          border-b
          border-slate-200
          bg-white
        "
      >
        <Container>
          <div className="px-4 py-5">
            <Link
              href="/account/publish"
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
              返回发布中心
            </Link>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

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
                  NEW JOB
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
                  发布工作
                </h1>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-slate-400
                  "
                >
                  发布真实、清楚的招聘信息。
                  可以先保存草稿，确认后再提交审核。
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* FORM */}
      {/* ================================================= */}

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
            <div
              className="
                min-w-0
                space-y-6
              "
            >
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

              {/* ================================================= */}
              {/* COMPANY */}
              {/* ================================================= */}

              <FormSection
                title="公司与职位"
                description="填写招聘主体和职位名称"
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
                      onChange={(event) =>
                        updateField(
                          "company",
                          event.target.value
                        )
                      }
                      placeholder="例如：株式会社Sakura"
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
                      onChange={(event) =>
                        updateField(
                          "title",
                          event.target.value
                        )
                      }
                      placeholder="例如：Python 后端工程师"
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

              {/* ================================================= */}
              {/* LOCATION */}
              {/* ================================================= */}

              <FormSection
                title="工作地点"
                description="填写实际工作所在地，不使用地图"
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
                    onChange={(event) =>
                      updateField(
                        "city",
                        event.target.value
                      )
                    }
                    placeholder="例如：涩谷区"
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
                      onChange={(event) =>
                        updateField(
                          "address",
                          event.target.value
                        )
                      }
                      placeholder="例如：涩谷区涩谷..."
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                <Field label="最近车站">
                  <input
                    value={
                      form.nearestStation
                    }
                    onChange={(event) =>
                      updateField(
                        "nearestStation",
                        event.target.value
                      )
                    }
                    placeholder="例如：涩谷站"
                    className={inputClass}
                  />
                </Field>
              </FormSection>

              {/* ================================================= */}
              {/* SALARY */}
              {/* ================================================= */}

              <FormSection
                title="薪资待遇"
                description="尽量公开清楚的薪资范围"
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
                    value={
                      form.salaryMin
                    }
                    onChange={(value) =>
                      updateField(
                        "salaryMin",
                        value
                      )
                    }
                    placeholder={
                      form.salaryType ===
                      "年薪"
                        ? "5000000"
                        : "300000"
                    }
                  />
                </Field>

                <Field label="最高薪资">
                  <MoneyInput
                    value={
                      form.salaryMax
                    }
                    onChange={(value) =>
                      updateField(
                        "salaryMax",
                        value
                      )
                    }
                    placeholder={
                      form.salaryType ===
                      "年薪"
                        ? "7000000"
                        : "500000"
                    }
                  />
                </Field>
              </FormSection>

              {/* ================================================= */}
              {/* REQUIREMENTS */}
              {/* ================================================= */}

              <FormSection
                title="招聘条件"
                description="填写应聘者需要满足的主要条件"
              >
                <Field label="经验要求">
                  <div className="relative">
                    <Users
                      size={17}
                      className={iconClass}
                    />

                    <input
                      value={
                        form.experience
                      }
                      onChange={(event) =>
                        updateField(
                          "experience",
                          event.target.value
                        )
                      }
                      placeholder="例如：Python开发经验2年以上"
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
                      value={
                        form.education
                      }
                      onChange={(event) =>
                        updateField(
                          "education",
                          event.target.value
                        )
                      }
                      placeholder="例如：专门学校以上 / 不限"
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
                      onChange={(event) =>
                        updateField(
                          "language",
                          event.target.value
                        )
                      }
                      placeholder="例如：日语N2以上，中文不限"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>
              </FormSection>

              {/* ================================================= */}
              {/* WORK */}
              {/* ================================================= */}

              <FormSection
                title="工作时间"
                description="填写工作时间和休息制度"
              >
                <Field label="工作时间">
                  <div className="relative">
                    <Clock3
                      size={17}
                      className={iconClass}
                    />

                    <input
                      value={
                        form.workingHours
                      }
                      onChange={(event) =>
                        updateField(
                          "workingHours",
                          event.target.value
                        )
                      }
                      placeholder="例如：9:00 ～ 18:00"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                <Field label="休息 / 休日">
                  <input
                    value={form.holiday}
                    onChange={(event) =>
                      updateField(
                        "holiday",
                        event.target.value
                      )
                    }
                    placeholder="例如：周六日祝、年末年始"
                    className={inputClass}
                  />
                </Field>
              </FormSection>

              {/* ================================================= */}
              {/* BENEFITS */}
              {/* ================================================= */}

              <FormSection
                title="福利待遇"
                description="选择实际提供的福利，可多选"
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

              {/* ================================================= */}
              {/* DESCRIPTION */}
              {/* ================================================= */}

              <FormSection
                title="招聘详情"
                description="说明工作内容、招聘要求和公司情况"
                singleColumn
              >
                <Field
                  label="详细内容"
                  required
                  full
                >
                  <textarea
                    value={
                      form.description
                    }
                    onChange={(event) =>
                      updateField(
                        "description",
                        event.target.value
                      )
                    }
                    rows={10}
                    placeholder={`例如：

【工作内容】
・负责公司内部系统开发
・Python / FastAPI 后端开发
・数据库设计及维护

【招聘要求】
・Python开发经验
・能够使用日语进行工作沟通

【欢迎条件】
・有日本IT项目经验
・有AWS经验`}
                    className={`${inputClass} resize-y leading-7`}
                  />

                  <div
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
                    }{" "}
                    字
                  </div>
                </Field>
              </FormSection>

              {/* ================================================= */}
              {/* CONTACT */}
              {/* ================================================= */}

              <FormSection
                title="招聘联系方式"
                description="求职者咨询和应聘时使用"
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
                      value={
                        form.contactName
                      }
                      onChange={(event) =>
                        updateField(
                          "contactName",
                          event.target.value
                        )
                      }
                      placeholder="联系人姓名"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                <Field label="联系电话">
                  <div className="relative">
                    <PhoneIcon />

                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateField(
                          "phone",
                          event.target.value
                        )
                      }
                      placeholder="03-1234-5678"
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

            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}

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
                <h2
                  className="
                    font-black
                    text-slate-950
                  "
                >
                  招聘预览
                </h2>

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
                          "招聘职位会显示在这里"}
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
                      保存草稿不会公开。
                      提交后招聘信息进入审核，
                      审核通过后显示在工作页面。
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
                      void saveJob("draft")
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
                    <Save size={17} />

                    {saving
                      ? "处理中..."
                      : "保存草稿"}
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
                    <Send size={17} />

                    {saving
                      ? "处理中..."
                      : "提交审核"}
                  </button>
                </div>
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
                  招聘发布规则
                </div>

                <div
                  className="
                    mt-3
                    space-y-2
                    text-xs
                    leading-5
                    text-amber-900/70
                  "
                >
                  <p>
                    请确保公司、薪资和工作内容真实。
                  </p>

                  <p>
                    不发布违法、高风险或明显误导性的招聘信息。
                  </p>

                  <p>
                    不要求求职者公开与招聘无关的敏感个人资料。
                  </p>
                </div>
              </div>
            </aside>
          </form>
        </Container>
      </section>
    </main>
  );
}

/* ================================================= */
/* FORM SECTION */
/* ================================================= */

function FormSection({
  title,
  description,
  children,
  singleColumn = false,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
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

/* ================================================= */
/* FIELD */
/* ================================================= */

function Field({
  label,
  required = false,
  full = false,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
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

/* ================================================= */
/* MONEY */
/* ================================================= */

function MoneyInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <JapaneseYen
        size={17}
        className={iconClass}
      />

      <input
        type="number"
        min="0"
        step="1"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className={`${inputClass} pl-11`}
      />
    </div>
  );
}

/* ================================================= */
/* PREVIEW TAG */
/* ================================================= */

function PreviewTag({
  children,
}: {
  children: React.ReactNode;
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

/* ================================================= */
/* PHONE ICON */
/* ================================================= */

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

/* ================================================= */
/* MESSAGE */
/* ================================================= */

function MessageBox({
  type,
  children,
}: {
  type: "error" | "success";
  children: React.ReactNode;
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

/* ================================================= */
/* STYLES */
/* ================================================= */

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

function formatYen(value: number) {
  return `¥${value.toLocaleString()}`;
}