"use client";

import Link from "next/link";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  Flag,
  ImagePlus,
  Info,
  Landmark,
  Loader2,
  LockKeyhole,
  MessageSquareWarning,
  PackageOpen,
  Phone,
  ReceiptText,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Trash2,
  Upload,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

import Container from "@/components/layout/Container";

type ReportType =
  | "dangerous_job"
  | "fraud"
  | "consumer_dispute"
  | "housing_dispute"
  | "other";

type EvidenceType =
  | "chat"
  | "payment"
  | "contract"
  | "advertisement"
  | "official"
  | "other";

type PublicIdentity =
  | "anonymous"
  | "nickname";

type SubmissionStatus =
  | "idle"
  | "saving"
  | "submitting"
  | "success";

interface ReportForm {
  reportType: ReportType;
  title: string;
  prefecture: string;
  incidentDate: string;
  subjectType:
    | "unknown"
    | "individual"
    | "business";
  subjectName: string;
  summary: string;
  details: string;
  publicIdentity: PublicIdentity;
  displayName: string;
  contactEmail: string;
  contactPhone: string;
  hasImmediateDanger: boolean;
  confirmsTruth: boolean;
  confirmsPrivacy: boolean;
  confirmsReview: boolean;
}

interface EvidenceItem {
  id: string;
  file: File;
  previewUrl?: string;
  type: EvidenceType;
  visibility:
    | "admin_only"
    | "public_redacted";
}

const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TITLE_LENGTH = 80;
const MAX_SUMMARY_LENGTH = 300;
const MAX_DETAILS_LENGTH = 5000;
const MAX_DISPLAY_NAME_LENGTH = 50;
const MAX_BUSINESS_NAME_LENGTH = 100;
const MAX_INDIVIDUAL_NAME_LENGTH = 50;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 11;

const allowedEvidenceMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
];

function getTodayDateString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const reportTypes: {
  value: ReportType;
  title: string;
  description: string;
  risk: "normal" | "high";
  icon: ReactNode;
}[] = [
  {
    value: "dangerous_job",
    title: "危险招聘",
    description:
      "取现金、代收包裹、提款、买货、高额日结、工作内容异常等。",
    risk: "high",
    icon: (
      <BriefcaseBusiness
        size={19}
      />
    ),
  },
  {
    value: "fraud",
    title: "诈骗风险",
    description:
      "疑似诈骗、异常转账、冒充客服、账户或资金相关风险。",
    risk: "high",
    icon: (
      <ShieldAlert size={19} />
    ),
  },
  {
    value: "consumer_dispute",
    title: "消费纠纷",
    description:
      "购物、服务、退款、付款、二手交易等消费问题。",
    risk: "normal",
    icon: (
      <ReceiptText size={19} />
    ),
  },
  {
    value: "housing_dispute",
    title: "租房纠纷",
    description:
      "合同、押金、礼金、中介费、退房和房屋相关纠纷。",
    risk: "normal",
    icon: (
      <Building2 size={19} />
    ),
  },
  {
    value: "other",
    title: "其他风险",
    description:
      "无法归入以上分类，但可能对其他在日华人有参考价值。",
    risk: "normal",
    icon: (
      <MessageSquareWarning
        size={19}
      />
    ),
  },
];

const evidenceTypes: {
  value: EvidenceType;
  label: string;
}[] = [
  {
    value: "chat",
    label: "聊天 / 邮件",
  },
  {
    value: "payment",
    label: "付款 / 转账",
  },
  {
    value: "contract",
    label: "合同 / 文件",
  },
  {
    value: "advertisement",
    label: "广告 / 招聘信息",
  },
  {
    value: "official",
    label: "官方材料",
  },
  {
    value: "other",
    label: "其他",
  },
];

const prefectures = [
  "不限地区",
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

const initialForm: ReportForm = {
  reportType: "dangerous_job",
  title: "",
  prefecture: "不限地区",
  incidentDate: "",
  subjectType: "unknown",
  subjectName: "",
  summary: "",
  details: "",
  publicIdentity: "anonymous",
  displayName: "",
  contactEmail: "",
  contactPhone: "",
  hasImmediateDanger: false,
  confirmsTruth: false,
  confirmsPrivacy: false,
  confirmsReview: false,
};

export default function ScamReportPage() {
  const [form, setForm] =
    useState<ReportForm>(
      initialForm
    );

  const [evidence, setEvidence] =
    useState<EvidenceItem[]>([]);

  const [status, setStatus] =
    useState<SubmissionStatus>(
      "idle"
    );

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const selectedType =
    useMemo(
      () =>
        reportTypes.find(
          (item) =>
            item.value ===
            form.reportType
        ) ?? reportTypes[0],
      [form.reportType]
    );

  const isHighRisk =
    selectedType.risk === "high";

 const canSubmit =
  form.title.trim().length >= 8 &&
  form.summary.trim().length >= 30 &&
  form.details.trim().length >= 80 &&
  form.confirmsTruth &&
  form.confirmsPrivacy &&
  form.confirmsReview;



  function updateForm<
    K extends keyof ReportForm,
  >(
    key: K,
    value: ReportForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setError("");
    setMessage("");
  }

  function handleFiles(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files ?? []
    );

    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    const available =
      MAX_FILES - evidence.length;

    if (available <= 0) {
      setError(
        `最多上传 ${MAX_FILES} 个文件。`
      );
      return;
    }

    const accepted =
      files.slice(0, available);

    const unsupported = accepted.find(
      (file) =>
        !allowedEvidenceMimeTypes.includes(
          file.type
        )
    );

    if (unsupported) {
      setError(
        `不支持该文件类型：${unsupported.name}。请上传 JPG、PNG、WebP、HEIC 或 PDF。`
      );
      return;
    }

    const oversized =
      accepted.find(
        (file) =>
          file.size >
          MAX_FILE_SIZE
      );

    if (oversized) {
      setError(
        `单个文件不能超过 10MB：${oversized.name}`
      );
      return;
    }

    const items =
      accepted.map(
        (file): EvidenceItem => {
          const isImage =
            file.type.startsWith(
              "image/"
            );

          return {
            id:
              crypto.randomUUID(),
            file,
            previewUrl: isImage
              ? URL.createObjectURL(
                  file
                )
              : undefined,
            type: "other",
            visibility:
              "admin_only",
          };
        }
      );

    setEvidence((current) => [
      ...current,
      ...items,
    ]);

    setError("");
  }

  function removeEvidence(
    id: string
  ) {
    setEvidence((current) => {
      const target =
        current.find(
          (item) =>
            item.id === id
        );

      if (target?.previewUrl) {
        URL.revokeObjectURL(
          target.previewUrl
        );
      }

      return current.filter(
        (item) =>
          item.id !== id
      );
    });
  }

  function updateEvidenceType(
    id: string,
    type: EvidenceType
  ) {
    setEvidence((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              type,
            }
          : item
      )
    );
  }

  function updateEvidenceVisibility(
    id: string,
    visibility:
      | "admin_only"
      | "public_redacted"
  ) {
    setEvidence((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              visibility,
            }
          : item
      )
    );
  }

  function validateForSubmit() {
    const title = form.title.trim();
    const summary = form.summary.trim();
    const details = form.details.trim();
    const subjectName =
      form.subjectName.trim();
    const displayName =
      form.displayName.trim();
    const email =
      form.contactEmail.trim();
    const phone =
      form.contactPhone.trim();

    const validReportTypes =
      reportTypes.map(
        (item) => item.value
      );

    if (
      !validReportTypes.includes(
        form.reportType
      )
    ) {
      return "请选择有效的风险类型。";
    }

    if (!title) {
      return "请输入报告标题。";
    }

    if (title.length < 8) {
      return "报告标题至少填写 8 个字符。";
    }

    if (
      title.length >
      MAX_TITLE_LENGTH
    ) {
      return `报告标题不能超过 ${MAX_TITLE_LENGTH} 个字符。`;
    }

    if (
      !prefectures.includes(
        form.prefecture
      )
    ) {
      return "请选择有效的发生地区。";
    }

    if (form.incidentDate) {
      const incidentDate =
        new Date(
          `${form.incidentDate}T00:00:00`
        );

      if (
        Number.isNaN(
          incidentDate.getTime()
        )
      ) {
        return "发生日期格式不正确。";
      }

      if (
        form.incidentDate >
        getTodayDateString()
      ) {
        return "发生日期不能晚于今天。";
      }
    }

    if (
      ![
        "unknown",
        "individual",
        "business",
      ].includes(form.subjectType)
    ) {
      return "涉及对象类型不正确。";
    }

    if (
      form.subjectType ===
        "individual" &&
      subjectName.length >
        MAX_INDIVIDUAL_NAME_LENGTH
    ) {
      return `对方公开名称不能超过 ${MAX_INDIVIDUAL_NAME_LENGTH} 个字符。`;
    }

    if (
      form.subjectType ===
        "business" &&
      subjectName.length >
        MAX_BUSINESS_NAME_LENGTH
    ) {
      return `企业或店铺名称不能超过 ${MAX_BUSINESS_NAME_LENGTH} 个字符。`;
    }

    if (!summary) {
      return "请输入简要说明。";
    }

    if (summary.length < 30) {
      return "简要说明至少填写 30 个字符。";
    }

    if (
      summary.length >
      MAX_SUMMARY_LENGTH
    ) {
      return `简要说明不能超过 ${MAX_SUMMARY_LENGTH} 个字符。`;
    }

    if (!details) {
      return "请输入详细经过。";
    }

    if (details.length < 80) {
      return "详细经过至少填写 80 个字符。";
    }

    if (
      details.length >
      MAX_DETAILS_LENGTH
    ) {
      return `详细经过不能超过 ${MAX_DETAILS_LENGTH} 个字符。`;
    }

    if (evidence.length > MAX_FILES) {
      return `最多上传 ${MAX_FILES} 个证据文件。`;
    }

    if (
      evidence.some(
        (item) =>
          item.file.size >
          MAX_FILE_SIZE
      )
    ) {
      return "单个证据文件不能超过 10MB。";
    }

    if (
      evidence.some(
        (item) =>
          !allowedEvidenceMimeTypes.includes(
            item.file.type
          )
      )
    ) {
      return "证据文件仅支持 JPG、PNG、WebP、HEIC 和 PDF。";
    }

    if (
      evidence.some(
        (item) =>
          !evidenceTypes.some(
            (type) =>
              type.value ===
              item.type
          )
      )
    ) {
      return "证据材料类型不正确。";
    }

    if (
      evidence.some(
        (item) =>
          item.visibility !==
            "admin_only" &&
          item.visibility !==
            "public_redacted"
      )
    ) {
      return "证据公开权限不正确。";
    }

    if (
      form.publicIdentity !==
        "anonymous" &&
      form.publicIdentity !==
        "nickname"
    ) {
      return "公开身份设置不正确。";
    }

    if (
      form.publicIdentity ===
      "nickname"
    ) {
      if (!displayName) {
        return "请输入公开昵称。";
      }

      if (
        displayName.length >
        MAX_DISPLAY_NAME_LENGTH
      ) {
        return `公开昵称不能超过 ${MAX_DISPLAY_NAME_LENGTH} 个字符。`;
      }
    }

    if (
      email.length >
      MAX_EMAIL_LENGTH
    ) {
      return `联系邮箱不能超过 ${MAX_EMAIL_LENGTH} 个字符。`;
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      return "请输入正确的邮箱地址。";
    }

    if (
      phone &&
      !/^0\d{9,10}$/.test(phone)
    ) {
      return "联系电话请输入日本常用的 10～11 位数字号码。";
    }

    if (!form.confirmsTruth) {
      return "请确认提交内容基于你实际知道、看到或经历的信息。";
    }

    if (!form.confirmsPrivacy) {
      return "请确认不会故意公开与事件无关的敏感个人信息。";
    }

    if (!form.confirmsReview) {
      return "请确认并理解 Sakura 的审核规则。";
    }

    return "";
  }

  async function saveDraft() {
    setStatus("saving");
    setError("");
    setMessage("");

    try {
      // TODO [API - POST]
      // POST /api/scam-reports/drafts
      // Purpose: save current user's private report draft.
      // Backend derives authorId from the authenticated session.

      await new Promise(
        (resolve) => {
          window.setTimeout(
            resolve,
            450
          );
        }
      );

      setMessage(
        "草稿已暂时保存。正式接入账号系统后会保存到你的个人中心。"
      );
    } finally {
      setStatus("idle");
    }
  }

  async function submitReport(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

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

    setStatus("submitting");
    setError("");
    setMessage("");

    try {
      const uploadedEvidence =
        evidence.map((item) => ({
          clientId: item.id,
          name: item.file.name,
          type: item.type,
          visibility:
            item.visibility,
        }));

      if (evidence.length > 0) {
        // TODO [API - POST]
        // POST /api/scam-reports/evidence
        // Purpose: securely upload private report evidence.
        // Backend validates file signature, MIME, size and ownership.
        // Sensitive files must use private storage, not public CDN.

        await new Promise(
          (resolve) => {
            window.setTimeout(
              resolve,
              350
            );
          }
        );
      }

      // TODO [API - POST]
      // POST /api/scam-reports
      // Purpose: submit a safety report for moderation.
      // Backend derives authorId from session and performs abuse/risk checks.

      console.log({
        ...form,
        evidence:
          uploadedEvidence,
        requestedStatus:
          "pending",
      });

      await new Promise(
        (resolve) => {
          window.setTimeout(
            resolve,
            650
          );
        }
      );

      setStatus("success");
    } catch {
      setError(
        "提交失败，请稍后再试。"
      );
      setStatus("idle");
    }
  }

  if (status === "success") {
    return <SuccessPage />;
  }

  return (
    <main className="min-h-screen bg-slate-50">
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
            -left-48
            -top-48
            h-[520px]
            w-[520px]
            rounded-full
            bg-rose-500/15
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-52
            right-0
            h-[520px]
            w-[520px]
            rounded-full
            bg-amber-500/10
            blur-3xl
          "
        />

        <Container>
          <div
            className="
              relative
              px-4
              py-11
              sm:py-14
            "
          >
            <Link
              href="/scam"
              className="
                inline-flex
                min-h-10
                items-center
                gap-2
                text-xs
                font-black
                text-slate-400
                transition
                hover:text-white
              "
            >
              <ArrowLeft size={15} />
              返回风险信息
            </Link>

            <div
              className="
                mt-6
                max-w-3xl
              "
            >
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-rose-400/20
                  bg-rose-400/10
                  px-3
                  py-1.5
                  text-xs
                  font-black
                  text-rose-300
                "
              >
                <Flag size={14} />
                Sakura Safety Report
              </div>

              <h1
                className="
                  mt-5
                  text-3xl
                  font-black
                  tracking-tight
                  text-white
                  sm:text-4xl
                "
              >
                举报 / 提交风险线索
              </h1>

              <p
                className="
                  mt-4
                  max-w-2xl
                  text-sm
                  leading-7
                  text-slate-400
                  sm:text-base
                  sm:leading-8
                "
              >
                提交你实际遇到的风险、纠纷或危险招聘信息。
                原始证据不会因为提交就自动公开，
                所有公开内容都需要经过审核和隐私处理。
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* PRIVACY STRIP */}

      <section
        className="
          border-b
          border-emerald-200
          bg-emerald-50
        "
      >
        <Container>
          <div
            className="
              grid
              gap-3
              px-4
              py-4
              sm:grid-cols-3
            "
          >
            <SecurityPoint
              icon={
                <LockKeyhole
                  size={17}
                />
              }
              title="证据默认私密"
              text="敏感原件仅授权审核"
            />

            <SecurityPoint
              icon={
                <EyeOff size={17} />
              }
              title="可以前台匿名"
              text="公开身份与后台账号分离"
            />

            <SecurityPoint
              icon={
                <ShieldCheck
                  size={17}
                />
              }
              title="人工审核"
              text="提交不会立即公开"
            />
          </div>
        </Container>
      </section>

      <form
        onSubmit={submitReport}
      >
        <section className="py-8 sm:py-10">
          <Container>
            <div
              className="
                grid
                gap-7
                px-4
                xl:grid-cols-[minmax(0,760px)_320px]
                xl:justify-center
              "
            >
              <div className="min-w-0 space-y-6">
                {/* STEP 1 */}

                <FormSection
                  number="01"
                  title="发生了什么？"
                  description="先选择最接近的风险类型。"
                >
                  <div
                    className="
                      grid
                      gap-3
                      sm:grid-cols-2
                    "
                  >
                    {reportTypes.map(
                      (item) => {
                        const active =
                          form.reportType ===
                          item.value;

                        return (
                          <button
                            key={
                              item.value
                            }
                            type="button"
                            onClick={() =>
                              updateForm(
                                "reportType",
                                item.value
                              )
                            }
                            className={`
                              min-h-[112px]
                              rounded-2xl
                              border
                              p-4
                              text-left
                              transition
                              ${
                                active
                                  ? "border-rose-300 bg-rose-50 ring-4 ring-rose-50"
                                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                              }
                            `}
                          >
                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-3
                              "
                            >
                              <div
                                className={`
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  rounded-xl
                                  ${
                                    active
                                      ? "bg-rose-600 text-white"
                                      : "bg-slate-100 text-slate-600"
                                  }
                                `}
                              >
                                {item.icon}
                              </div>

                              {active && (
                                <CheckCircle2
                                  size={18}
                                  className="text-rose-600"
                                />
                              )}
                            </div>

                            <p
                              className="
                                mt-3
                                text-sm
                                font-black
                                text-slate-950
                              "
                            >
                              {item.title}
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                leading-5
                                text-slate-500
                              "
                            >
                              {
                                item.description
                              }
                            </p>
                          </button>
                        );
                      }
                    )}
                  </div>

                  {isHighRisk && (
                    <HighRiskNotice
                      immediate={
                        form.hasImmediateDanger
                      }
                      onChange={(
                        value
                      ) =>
                        updateForm(
                          "hasImmediateDanger",
                          value
                        )
                      }
                    />
                  )}
                </FormSection>

                {/* STEP 2 */}

                <FormSection
                  number="02"
                  title="事件基本信息"
                  description="尽量描述事实，不需要先给任何人定性。"
                >
                  <div className="space-y-5">
                    <Field
                      label="标题"
                      required
                      hint={`${form.title.length}/${MAX_TITLE_LENGTH}`}
                    >
                      <input
                        value={form.title}
                        maxLength={MAX_TITLE_LENGTH}
                        onChange={(event) =>
                          updateForm(
                            "title",
                            event.target.value
                          )
                        }
                        placeholder="例如：求职时被要求先垫付大额费用"
                        className={inputClass}
                      />
                    </Field>

                    <div
                      className="
                        grid
                        gap-4
                        sm:grid-cols-2
                      "
                    >
                      <Field label="发生地区">
                        <SelectWrap>
                          <select
                            value={
                              form.prefecture
                            }
                            onChange={(
                              event
                            ) =>
                              updateForm(
                                "prefecture",
                                event.target
                                  .value
                              )
                            }
                            className={
                              selectClass
                            }
                          >
                            {prefectures.map(
                              (
                                item
                              ) => (
                                <option
                                  key={
                                    item
                                  }
                                  value={
                                    item
                                  }
                                >
                                  {
                                    item
                                  }
                                </option>
                              )
                            )}
                          </select>
                        </SelectWrap>
                      </Field>

                      <Field label="发生日期">
                        <input
                          type="date"
                          value={form.incidentDate}
                          max={getTodayDateString()}
                          onChange={(event) =>
                            updateForm(
                              "incidentDate",
                              event.target.value
                            )
                          }
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <Field
                      label="涉及对象"
                      hint="不知道真实身份也可以提交"
                    >
                      <div
                        className="
                          grid
                          gap-2
                          sm:grid-cols-3
                        "
                      >
                        <ChoiceButton
                          active={
                            form.subjectType ===
                            "unknown"
                          }
                          onClick={() =>
                            updateForm(
                              "subjectType",
                              "unknown"
                            )
                          }
                        >
                          不确定
                        </ChoiceButton>

                        <ChoiceButton
                          active={
                            form.subjectType ===
                            "individual"
                          }
                          onClick={() =>
                            updateForm(
                              "subjectType",
                              "individual"
                            )
                          }
                        >
                          个人
                        </ChoiceButton>

                        <ChoiceButton
                          active={
                            form.subjectType ===
                            "business"
                          }
                          onClick={() =>
                            updateForm(
                              "subjectType",
                              "business"
                            )
                          }
                        >
                          企业 / 店铺
                        </ChoiceButton>
                      </div>
                    </Field>

                    {form.subjectType !==
                      "unknown" && (
                      <Field
                        label={
                          form.subjectType ===
                          "business"
                            ? "企业 / 店铺名称"
                            : "对方公开使用的名称"
                        }
                        hint="请填写你实际看到或交易时使用的名称"
                      >
                        <input
                          value={form.subjectName}
                          maxLength={
                            form.subjectType === "business"
                              ? MAX_BUSINESS_NAME_LENGTH
                              : MAX_INDIVIDUAL_NAME_LENGTH
                          }
                          onChange={(event) =>
                            updateForm(
                              "subjectName",
                              event.target.value
                            )
                          }
                          placeholder={
                            form.subjectType === "business"
                              ? "例如：合同或店铺页面上的正式名称"
                              : "例如：对方公开使用的账号名称"
                          }
                          className={inputClass}
                        />
                      </Field>
                    )}
                  </div>
                </FormSection>

                {/* STEP 3 */}

                <FormSection
                  number="03"
                  title="说明事实经过"
                  description="按时间顺序写清楚发生了什么，比写“骗子”“黑店”更有价值。"
                >
                  <div className="space-y-5">
                    <Field
                      label="简要说明"
                      required
                      hint={`${form.summary.length}/${MAX_SUMMARY_LENGTH}`}
                    >
                      <textarea
                        value={form.summary}
                        maxLength={MAX_SUMMARY_LENGTH}
                        rows={4}
                        onChange={(event) =>
                          updateForm(
                            "summary",
                            event.target.value
                          )
                        }
                        placeholder="用几句话说明事情的核心经过。"
                        className={textareaClass}
                      />
                    </Field>

                    <Field
                      label="详细经过"
                      required
                      hint={`${form.details.length} / ${MAX_DETAILS_LENGTH}`}
                    >
                      <textarea
                        value={form.details}
                        rows={12}
                        maxLength={MAX_DETAILS_LENGTH}
                        onChange={(event) =>
                          updateForm(
                            "details",
                            event.target.value
                          )
                        }
                        placeholder={`建议按照时间顺序填写：

                          1. 你在哪里看到或接触到这条信息？
                          2. 对方具体说了什么？
                          3. 是否发生付款、签约、取货或其他行为？
                          4. 之后发生了什么？
                          5. 目前事情处于什么状态？`}
                        className={textareaClass}
                      />
                    </Field>

                    <WritingNotice />
                  </div>
                </FormSection>

                {/* STEP 4 */}

                <FormSection
                  number="04"
                  title="证据与材料"
                  description="可以提交聊天、付款、合同、广告截图等。敏感材料默认仅审核员可见。"
                >
                  <label
                    className="
                      flex
                      min-h-36
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      rounded-2xl
                      border-2
                      border-dashed
                      border-slate-300
                      bg-slate-50
                      px-5
                      py-7
                      text-center
                      transition
                      hover:border-rose-300
                      hover:bg-rose-50/50
                    "
                  >
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        bg-white
                        text-slate-600
                        shadow-sm
                      "
                    >
                      <Upload size={19} />
                    </div>

                    <p
                      className="
                        mt-3
                        text-sm
                        font-black
                        text-slate-900
                      "
                    >
                      选择证据文件
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        leading-5
                        text-slate-500
                      "
                    >
                      最多 {MAX_FILES} 个，
                      单个文件不超过 10MB
                    </p>

                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf"
                      className="hidden"
                      onChange={handleFiles}
                    />
                  </label>

                  <div
                    className="
                      mt-4
                      flex
                      items-start
                      gap-3
                      rounded-2xl
                      border
                      border-blue-100
                      bg-blue-50
                      p-4
                    "
                  >
                    <LockKeyhole
                      size={17}
                      className="
                        mt-0.5
                        shrink-0
                        text-blue-700
                      "
                    />

                    <p
                      className="
                        text-xs
                        leading-6
                        text-blue-900
                      "
                    >
                      正式后端会重新检查文件类型、
                      文件签名、大小和权限。
                      原始证据会进入私密存储，
                      不会和公开房源图片放在同一个公开目录。
                    </p>
                  </div>

                  {evidence.length >
                    0 && (
                    <div className="mt-5 space-y-3">
                      {evidence.map(
                        (item) => (
                          <EvidenceEditor
                            key={
                              item.id
                            }
                            item={item}
                            onRemove={() =>
                              removeEvidence(
                                item.id
                              )
                            }
                            onTypeChange={(
                              type
                            ) =>
                              updateEvidenceType(
                                item.id,
                                type
                              )
                            }
                            onVisibilityChange={(
                              visibility
                            ) =>
                              updateEvidenceVisibility(
                                item.id,
                                visibility
                              )
                            }
                          />
                        )
                      )}
                    </div>
                  )}
                </FormSection>

                {/* STEP 5 */}

                <FormSection
                  number="05"
                  title="公开身份"
                  description="后台账号与公开显示身份分开。"
                >
                  <div
                    className="
                      grid
                      gap-3
                      sm:grid-cols-2
                    "
                  >
                    <IdentityCard
                      active={
                        form.publicIdentity ===
                        "anonymous"
                      }
                      icon={
                        <EyeOff
                          size={19}
                        />
                      }
                      title="公开匿名"
                      description="公开页面显示“匿名用户报告”，后台仍保留提交账号用于审核和防滥用。"
                      onClick={() =>
                        updateForm(
                          "publicIdentity",
                          "anonymous"
                        )
                      }
                    />

                    <IdentityCard
                      active={
                        form.publicIdentity ===
                        "nickname"
                      }
                      icon={
                        <UserRound
                          size={19}
                        />
                      }
                      title="显示昵称"
                      description="公开页面显示你指定的昵称，不公开手机号或登录账号信息。"
                      onClick={() =>
                        updateForm(
                          "publicIdentity",
                          "nickname"
                        )
                      }
                    />
                  </div>

                  {form.publicIdentity ===
                    "nickname" && (
                    <div className="mt-4">
                      <Field label="公开昵称">
                        <input
                          value={
                            form.displayName
                          }
                          maxLength={MAX_DISPLAY_NAME_LENGTH}
                          onChange={(
                            event
                          ) =>
                            updateForm(
                              "displayName",
                              event.target
                                .value
                            )
                          }
                          placeholder="例如：东京生活记录"
                          className={
                            inputClass
                          }
                        />
                      </Field>
                    </div>
                  )}
                </FormSection>

                {/* STEP 6 */}

                <FormSection
                  number="06"
                  title="审核联系方式"
                  description="仅用于必要的补充确认，不会直接显示在公开报告中。"
                >
                  <div
                    className="
                      grid
                      gap-4
                      sm:grid-cols-2
                    "
                  >
                    <Field label="联系邮箱">
                      <input
                        type="email"
                        maxLength={MAX_EMAIL_LENGTH}
                        value={form.contactEmail}
                        onChange={(event) =>
                          updateForm(
                            "contactEmail",
                            event.target.value
                          )
                        }
                        placeholder="仅审核使用"
                        autoComplete="email"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="联系电话">
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={
                          form.contactPhone
                        }
                        onChange={(
                          event
                        ) =>
                          updateForm(
                            "contactPhone",
                            event.target
                              .value
                          )
                        }
                        placeholder="仅审核使用"
                        className={
                          inputClass
                        }
                      />
                    </Field>
                  </div>

                  <div
                    className="
                      mt-4
                      flex
                      items-start
                      gap-3
                      rounded-2xl
                      bg-slate-50
                      p-4
                    "
                  >
                    <ShieldCheck
                      size={17}
                      className="
                        mt-0.5
                        shrink-0
                        text-emerald-600
                      "
                    />

                    <p
                      className="
                        text-xs
                        leading-6
                        text-slate-600
                      "
                    >
                      正式账号系统上线后，
                      用户身份应主要从登录 Session 获取，
                      不信任客户端自行提交的 authorId。
                      手机号等敏感资料也不会进入公开内容 API。
                    </p>
                  </div>
                </FormSection>

                {/* STEP 7 */}

                <FormSection
                  number="07"
                  title="提交确认"
                  description="请确认以下内容后再提交审核。"
                >
                  <div className="space-y-3">
                    <ConfirmRow
                      checked={
                        form.confirmsTruth
                      }
                      onChange={(
                        checked
                      ) =>
                        updateForm(
                          "confirmsTruth",
                          checked
                        )
                      }
                    >
                      我确认以上内容基于我实际知道、
                      看到或经历的信息，
                      不故意捏造事实。
                    </ConfirmRow>

                    <ConfirmRow
                      checked={
                        form.confirmsPrivacy
                      }
                      onChange={(
                        checked
                      ) =>
                        updateForm(
                          "confirmsPrivacy",
                          checked
                        )
                      }
                    >
                      我不会故意公开与事件无关的身份证号码、
                      银行卡、家庭住址、私人电话号码等敏感信息。
                    </ConfirmRow>

                    <ConfirmRow
                      checked={
                        form.confirmsReview
                      }
                      onChange={(
                        checked
                      ) =>
                        updateForm(
                          "confirmsReview",
                          checked
                        )
                      }
                    >
                      我理解提交后不会立即公开，
                      Sakura
                      可以进行审核、脱敏、要求补充材料，
                      或拒绝不符合规则的内容。
                    </ConfirmRow>
                  </div>
                </FormSection>

                {/* ERROR */}

                {error && (
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-2xl
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
                        text-rose-800
                      "
                    >
                      {error}
                    </p>
                  </div>
                )}

                {message && (
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-2xl
                      border
                      border-emerald-200
                      bg-emerald-50
                      p-4
                    "
                  >
                    <CheckCircle2
                      size={18}
                      className="
                        mt-0.5
                        shrink-0
                        text-emerald-600
                      "
                    />

                    <p
                      className="
                        text-sm
                        font-semibold
                        leading-6
                        text-emerald-800
                      "
                    >
                      {message}
                    </p>
                  </div>
                )}

                {/* DESKTOP ACTIONS */}

                <div
                  className="
                    hidden
                    items-center
                    justify-between
                    gap-3
                    rounded-[24px]
                    border
                    border-slate-200
                    bg-white
                    p-4
                    shadow-sm
                    sm:flex
                  "
                >
                  <button
                    type="button"
                    disabled={
                      status !== "idle"
                    }
                    onClick={() =>
                      void saveDraft()
                    }
                    className="
                      inline-flex
                      min-h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-5
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
                    {status ===
                    "saving" ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <FileText
                        size={16}
                      />
                    )}

                    保存草稿
                  </button>

                  <button
                    type="submit"
                    disabled={
                      status !==
                        "idle" ||
                      !canSubmit
                    }
                    className="
                      inline-flex
                      min-h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-rose-600
                      px-6
                      py-3
                      text-sm
                      font-black
                      text-white
                      transition
                      hover:bg-rose-700
                      disabled:cursor-not-allowed
                      disabled:bg-slate-300
                    "
                  >
                    {status ===
                    "submitting" ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <ShieldCheck
                        size={16}
                      />
                    )}

                    提交审核
                  </button>
                </div>
              </div>

              {/* SIDEBAR */}

              <aside
                className="
                  h-fit
                  space-y-4
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
                  <p
                    className="
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.14em]
                      text-rose-600
                    "
                  >
                    REPORT PREVIEW
                  </p>

                  <h2
                    className="
                      mt-2
                      text-base
                      font-black
                      text-slate-950
                    "
                  >
                    提交预览
                  </h2>

                  <div className="mt-4 space-y-3">
                    <PreviewRow
                      label="类型"
                      value={
                        selectedType.title
                      }
                    />

                    <PreviewRow
                      label="地区"
                      value={
                        form.prefecture
                      }
                    />

                    <PreviewRow
                      label="公开身份"
                      value={
                        form.publicIdentity ===
                        "anonymous"
                          ? "匿名"
                          : form.displayName ||
                            "昵称"
                      }
                    />

                    <PreviewRow
                      label="证据"
                      value={`${evidence.length} 个文件`}
                    />

                    <PreviewRow
                      label="发布状态"
                      value="提交后待审核"
                    />
                  </div>
                </div>

                {isHighRisk && (
                  <div
                    className="
                      overflow-hidden
                      rounded-[24px]
                      bg-slate-950
                      p-5
                      text-white
                    "
                  >
                    <Siren
                      size={21}
                      className="text-rose-400"
                    />

                    <h2
                      className="
                        mt-4
                        text-base
                        font-black
                      "
                    >
                      危险招聘 / 诈骗
                    </h2>

                    <p
                      className="
                        mt-2
                        text-xs
                        leading-6
                        text-slate-400
                      "
                    >
                      如果有人要求你取现金、
                      提款、收货、购买高价值商品、
                      提供银行卡或继续执行你认为可能违法的任务，
                      不要为了“完成一次工作”继续参与。
                    </p>
                  </div>
                )}

                <div
                  className="
                    rounded-[24px]
                    border
                    border-amber-200
                    bg-amber-50
                    p-5
                  "
                >
                  <Scale
                    size={19}
                    className="text-amber-700"
                  />

                  <h2
                    className="
                      mt-3
                      text-sm
                      font-black
                      text-amber-950
                    "
                  >
                    写事实，不先定罪
                  </h2>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-6
                      text-amber-900/80
                    "
                  >
                    尽量写“什么时候、在哪里、
                    对方要求什么、发生了什么、有什么记录”，
                    而不是直接写
                    “某某一定是诈骗犯”。
                  </p>
                </div>

                <div
                  className="
                    rounded-[24px]
                    border
                    border-slate-200
                    bg-white
                    p-5
                  "
                >
                  <LockKeyhole
                    size={19}
                    className="text-blue-600"
                  />

                  <h2
                    className="
                      mt-3
                      text-sm
                      font-black
                      text-slate-950
                    "
                  >
                    证据不是公开附件
                  </h2>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-6
                      text-slate-500
                    "
                  >
                    即使你选择“允许公开脱敏摘要”，
                    也不代表原始文件直接暴露给所有访客。
                    公开版本以后由审核流程生成。
                  </p>
                </div>
              </aside>
            </div>
          </Container>
        </section>

        {/* MOBILE ACTION BAR */}

        <div
          className="
            fixed
            inset-x-0
            bottom-0
            z-40
            border-t
            border-slate-200
            bg-white/95
            px-3
            py-2.5
            backdrop-blur
            sm:hidden
            [padding-bottom:max(0.625rem,env(safe-area-inset-bottom))]
          "
        >
          <div
            className="
              mx-auto
              grid
              max-w-lg
              grid-cols-[110px_1fr]
              gap-2
            "
          >
            <button
              type="button"
              disabled={
                status !== "idle"
              }
              onClick={() =>
                void saveDraft()
              }
              className="
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-1.5
                rounded-xl
                border
                border-slate-200
                bg-white
                text-xs
                font-black
                text-slate-700
                disabled:opacity-50
              "
            >
              {status === "saving" ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <FileText
                  size={15}
                />
              )}
              草稿
            </button>

            <button
              type="submit"
              disabled={
                status !== "idle" ||
                !canSubmit
              }
              className="
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-rose-600
                px-4
                text-xs
                font-black
                text-white
                disabled:bg-slate-300
              "
            >
              {status ===
              "submitting" ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <ShieldCheck
                  size={15}
                />
              )}

              提交审核
            </button>
          </div>
        </div>

        <div className="h-20 sm:hidden" />
      </form>
    </main>
  );
}

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
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
        sm:p-7
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
            h-10
            min-w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-slate-950
            px-2
            text-xs
            font-black
            text-white
          "
        >
          {number}
        </div>

        <div>
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
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  hint,
  required = false,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div
        className="
          mb-2
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <span
          className="
            text-sm
            font-black
            text-slate-800
          "
        >
          {label}

          {required && (
            <span className="ml-1 text-rose-600">
              *
            </span>
          )}
        </span>

        {hint && (
          <span
            className="
              text-[10px]
              font-bold
              text-slate-400
            "
          >
            {hint}
          </span>
        )}
      </div>

      {children}
    </label>
  );
}

function SelectWrap({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative">
      {children}

      <ChevronDown
        size={15}
        className="
          pointer-events-none
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />
    </div>
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
      className={`
        min-h-11
        rounded-xl
        border
        px-4
        py-2.5
        text-sm
        font-black
        transition
        ${
          active
            ? "border-slate-950 bg-slate-950 text-white"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        }
      `}
    >
      {children}
    </button>
  );
}

function HighRiskNotice({
  immediate,
  onChange,
}: {
  immediate: boolean;
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <div
      className="
        mt-5
        overflow-hidden
        rounded-2xl
        border
        border-rose-200
        bg-rose-50
      "
    >
      <div
        className="
          flex
          items-start
          gap-3
          p-4
        "
      >
        <Siren
          size={20}
          className="
            mt-0.5
            shrink-0
            text-rose-600
          "
        />

        <div>
          <p
            className="
              text-sm
              font-black
              text-rose-950
            "
          >
            先确认你现在是否安全
          </p>

          <p
            className="
              mt-1
              text-xs
              leading-6
              text-rose-900/80
            "
          >
            Sakura
            的审核不是紧急报警服务。
            如果有人正在威胁你、
            要求你立即取钱、提款、
            交付物品或继续执行危险任务，
            请优先停止参与并寻求适当的官方帮助。
          </p>
        </div>
      </div>

      <label
        className="
          flex
          cursor-pointer
          items-start
          gap-3
          border-t
          border-rose-200
          bg-white/60
          p-4
        "
      >
        <input
          type="checkbox"
          checked={immediate}
          onChange={(event) =>
            onChange(
              event.target.checked
            )
          }
          className="
            mt-0.5
            h-4
            w-4
            accent-rose-600
          "
        />

        <span
          className="
            text-xs
            font-bold
            leading-5
            text-rose-900
          "
        >
          我目前正在受到威胁，
          或事情仍在进行中
        </span>
      </label>

      {immediate && (
        <div
          className="
            border-t
            border-rose-200
            bg-rose-100
            p-4
          "
        >
          <p
            className="
              text-xs
              font-black
              leading-6
              text-rose-950
            "
          >
            请不要等待 Sakura
            审核结果。现实中存在即时危险时，
            应优先联系日本警方或适当的紧急服务。
          </p>
        </div>
      )}
    </div>
  );
}

function WritingNotice() {
  return (
    <div
      className="
        grid
        gap-3
        sm:grid-cols-2
      "
    >
      <div
        className="
          rounded-2xl
          border
          border-emerald-100
          bg-emerald-50
          p-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            text-emerald-800
          "
        >
          <CheckCircle2
            size={16}
          />

          <p
            className="
              text-xs
              font-black
            "
          >
            推荐写法
          </p>
        </div>

        <p
          className="
            mt-2
            text-xs
            leading-6
            text-emerald-900/80
          "
        >
          “8 月 20 日，对方要求我先转账
          5 万日元，并表示付款后才提供正式合同。”
        </p>
      </div>

      <div
        className="
          rounded-2xl
          border
          border-rose-100
          bg-rose-50
          p-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            text-rose-800
          "
        >
          <X size={16} />

          <p
            className="
              text-xs
              font-black
            "
          >
            避免这样写
          </p>
        </div>

        <p
          className="
            mt-2
            text-xs
            leading-6
            text-rose-900/80
          "
        >
          “这家公司百分之百就是骗子，
          大家都不要去。”
        </p>
      </div>
    </div>
  );
}

function EvidenceEditor({
  item,
  onRemove,
  onTypeChange,
  onVisibilityChange,
}: {
  item: EvidenceItem;
  onRemove: () => void;
  onTypeChange: (
    type: EvidenceType
  ) => void;
  onVisibilityChange: (
    visibility:
      | "admin_only"
      | "public_redacted"
  ) => void;
}) {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
      "
    >
      <div
        className="
          flex
          items-start
          gap-3
          p-4
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
            overflow-hidden
            rounded-xl
            bg-slate-100
            text-slate-500
          "
        >
          {item.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.previewUrl}
              alt=""
              className="
                h-full
                w-full
                object-cover
              "
            />
          ) : (
            <FileText size={19} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="
              truncate
              text-sm
              font-black
              text-slate-900
            "
          >
            {item.file.name}
          </p>

          <p
            className="
              mt-1
              text-[10px]
              font-semibold
              text-slate-400
            "
          >
            {formatFileSize(
              item.file.size
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            text-slate-400
            transition
            hover:bg-rose-50
            hover:text-rose-600
          "
          aria-label="删除文件"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div
        className="
          grid
          gap-3
          border-t
          border-slate-100
          bg-slate-50
          p-4
          sm:grid-cols-2
        "
      >
        <div>
          <p
            className="
              mb-2
              text-[10px]
              font-black
              text-slate-400
            "
          >
            材料类型
          </p>

          <SelectWrap>
            <select
              value={item.type}
              onChange={(event) =>
                onTypeChange(
                  event.target
                    .value as EvidenceType
                )
              }
              className={
                selectClass
              }
            >
              {evidenceTypes.map(
                (type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>
                )
              )}
            </select>
          </SelectWrap>
        </div>

        <div>
          <p
            className="
              mb-2
              text-[10px]
              font-black
              text-slate-400
            "
          >
            公开权限
          </p>

          <SelectWrap>
            <select
              value={
                item.visibility
              }
              onChange={(event) =>
                onVisibilityChange(
                  event.target
                    .value as
                    | "admin_only"
                    | "public_redacted"
                )
              }
              className={
                selectClass
              }
            >
              <option value="admin_only">
                仅审核员查看原件
              </option>

              <option value="public_redacted">
                允许制作公开脱敏摘要
              </option>
            </select>
          </SelectWrap>
        </div>
      </div>
    </div>
  );
}

function IdentityCard({
  active,
  icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-2xl
        border
        p-4
        text-left
        transition
        ${
          active
            ? "border-blue-300 bg-blue-50 ring-4 ring-blue-50"
            : "border-slate-200 bg-white hover:bg-slate-50"
        }
      `}
    >
      <div
        className={`
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-xl
          ${
            active
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-600"
          }
        `}
      >
        {icon}
      </div>

      <p
        className="
          mt-3
          text-sm
          font-black
          text-slate-950
        "
      >
        {title}
      </p>

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
    </button>
  );
}

function ConfirmRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (
    checked: boolean
  ) => void;
  children: ReactNode;
}) {
  return (
    <label
      className={`
        flex
        cursor-pointer
        items-start
        gap-3
        rounded-2xl
        border
        p-4
        transition
        ${
          checked
            ? "border-emerald-200 bg-emerald-50"
            : "border-slate-200 bg-white hover:bg-slate-50"
        }
      `}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked
          )
        }
        className="
          mt-0.5
          h-4
          w-4
          shrink-0
          accent-emerald-600
        "
      />

      <span
        className="
          text-xs
          font-semibold
          leading-6
          text-slate-700
        "
      >
        {children}
      </span>
    </label>
  );
}

function SecurityPoint({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
      "
    >
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
          text-emerald-700
          shadow-sm
        "
      >
        {icon}
      </div>

      <div>
        <p
          className="
            text-xs
            font-black
            text-emerald-950
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            text-[10px]
            font-semibold
            text-emerald-800/70
          "
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function PreviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        border-b
        border-slate-100
        pb-3
        last:border-none
        last:pb-0
      "
    >
      <span
        className="
          text-xs
          font-semibold
          text-slate-400
        "
      >
        {label}
      </span>

      <span
        className="
          max-w-[160px]
          truncate
          text-right
          text-xs
          font-black
          text-slate-800
        "
      >
        {value}
      </span>
    </div>
  );
}

function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Container>
        <div
          className="
            flex
            min-h-[80vh]
            items-center
            justify-center
            px-4
            py-16
          "
        >
          <div
            className="
              w-full
              max-w-xl
              rounded-[30px]
              border
              border-slate-200
              bg-white
              p-7
              text-center
              shadow-xl
              shadow-slate-200/50
              sm:p-10
            "
          >
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-emerald-100
                text-emerald-700
              "
            >
              <ShieldCheck
                size={27}
              />
            </div>

            <p
              className="
                mt-5
                text-xs
                font-black
                uppercase
                tracking-[0.15em]
                text-emerald-600
              "
            >
              SUBMITTED
            </p>

            <h1
              className="
                mt-2
                text-2xl
                font-black
                text-slate-950
                sm:text-3xl
              "
            >
              线索已提交审核
            </h1>

            <p
              className="
                mt-4
                text-sm
                leading-7
                text-slate-500
              "
            >
              提交内容不会立即公开。
              后续审核可以检查事实描述、
              证据状态和隐私信息，
              必要时还可以要求补充材料。
            </p>

            <div
              className="
                mt-6
                rounded-2xl
                bg-slate-50
                p-4
                text-left
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >
                <LockKeyhole
                  size={17}
                  className="
                    mt-0.5
                    shrink-0
                    text-blue-600
                  "
                />

                <p
                  className="
                    text-xs
                    leading-6
                    text-slate-600
                  "
                >
                  正式账号系统完成后，
                  你可以在个人中心查看
                  “审核中 / 需要补充 / 已公开 / 未通过”
                  等状态。
                </p>
              </div>
            </div>

            <div
              className="
                mt-7
                grid
                gap-3
                sm:grid-cols-2
              "
            >
              <Link
                href="/account/posts"
                className="
                  inline-flex
                  min-h-11
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
                "
              >
                查看我的发布
              </Link>

              <Link
                href="/scam"
                className="
                  inline-flex
                  min-h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-950
                  px-4
                  py-3
                  text-sm
                  font-black
                  text-white
                "
              >
                返回风险信息
                <ArrowRight
                  size={15}
                />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

const inputClass = `
  min-h-12
  w-full
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-3
  text-sm
  font-semibold
  text-slate-900
  outline-none
  transition
  placeholder:text-slate-400
  focus:border-rose-400
  focus:ring-4
  focus:ring-rose-50
`;

const textareaClass = `
  w-full
  resize-y
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-3
  text-sm
  font-semibold
  leading-7
  text-slate-900
  outline-none
  transition
  placeholder:text-slate-400
  focus:border-rose-400
  focus:ring-4
  focus:ring-rose-50
`;

const selectClass = `
  min-h-12
  w-full
  appearance-none
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-3
  pr-10
  text-sm
  font-bold
  text-slate-800
  outline-none
  transition
  focus:border-rose-400
  focus:ring-4
  focus:ring-rose-50
`;

function formatFileSize(
  bytes: number
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    1024 /
    1024
  ).toFixed(1)} MB`;
}