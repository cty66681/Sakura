"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
  Check,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  FileText,
  Info,
  Loader2,
  LockKeyhole,
  MessageSquareReply,
  Paperclip,
  Scale,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";

import Container from "@/components/layout/Container";

type ApplicationType =
  | "correction"
  | "response"
  | "counter_evidence";

type ApplicantRelation =
  | "person"
  | "business_owner"
  | "employee"
  | "representative"
  | "other";

type SubmitStatus =
  | "idle"
  | "submitting"
  | "success";

interface ScamSummary {
  id: number;
  title: string;
  category: string;
  prefecture: string;
  publishTime: string;
}

interface FormErrors {
  applicationType?: string;
  relation?: string;
  applicantName?: string;
  organizationName?: string;
  contactEmail?: string;
  subject?: string;
  content?: string;
  declaration?: string;
}

const MAX_NAME_LENGTH = 50;
const MAX_ORGANIZATION_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 80;
const MAX_CONTENT_LENGTH = 5000;
const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const scamSummaries: ScamSummary[] = [
  {
    id: 1,
    title:
      "高额日结、只负责取快递：这类招聘信息需要特别警惕",
    category: "危险招聘",
    prefecture: "东京",
    publishTime: "2026-08-30",
  },
  {
    id: 2,
    title:
      "租房签约前被要求支付高额预付款，用户提交交易记录",
    category: "租房纠纷",
    prefecture: "神奈川",
    publishTime: "2026-08-28",
  },
  {
    id: 3,
    title:
      "“帮忙取现金就能当天结算”——请勿参与此类所谓兼职",
    category: "诈骗风险",
    prefecture: "不限地区",
    publishTime: "2026-08-27",
  },
];

export default function ScamCorrectionPage() {
  const params =
    useParams<{ id: string }>();

  const reportId = Number(params.id);

  const report = useMemo(
    () =>
      scamSummaries.find(
        (item) => item.id === reportId
      ) ?? null,
    [reportId]
  );

  const [applicationType, setApplicationType] =
    useState<ApplicationType | "">("");

  const [relation, setRelation] =
    useState<ApplicantRelation | "">("");

  const [applicantName, setApplicantName] =
    useState("");

  const [
    organizationName,
    setOrganizationName,
  ] = useState("");

  const [contactEmail, setContactEmail] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [content, setContent] =
    useState("");

  const [files, setFiles] =
    useState<File[]>([]);

  const [declaration, setDeclaration] =
    useState(false);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [fileError, setFileError] =
    useState("");

  const [submitStatus, setSubmitStatus] =
    useState<SubmitStatus>("idle");

  const needsOrganization =
    relation === "business_owner" ||
    relation === "employee" ||
    relation === "representative";

  function handleApplicantNameChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .slice(0, MAX_NAME_LENGTH);

    setApplicantName(value);

    if (errors.applicantName) {
      setErrors((current) => ({
        ...current,
        applicantName: undefined,
      }));
    }
  }

  function handleOrganizationChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .slice(
        0,
        MAX_ORGANIZATION_LENGTH
      );

    setOrganizationName(value);

    if (errors.organizationName) {
      setErrors((current) => ({
        ...current,
        organizationName: undefined,
      }));
    }
  }

  function handleEmailChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value
      .replace(/\s/g, "")
      .slice(0, MAX_EMAIL_LENGTH);

    setContactEmail(value);

    if (errors.contactEmail) {
      setErrors((current) => ({
        ...current,
        contactEmail: undefined,
      }));
    }
  }

  function handleSubjectChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .slice(0, MAX_SUBJECT_LENGTH);

    setSubject(value);

    if (errors.subject) {
      setErrors((current) => ({
        ...current,
        subject: undefined,
      }));
    }
  }

  function handleContentChange(
    event: ChangeEvent<HTMLTextAreaElement>
  ) {
    const value = event.target.value
      .replace(/\u0000/g, "")
      .slice(0, MAX_CONTENT_LENGTH);

    setContent(value);

    if (errors.content) {
      setErrors((current) => ({
        ...current,
        content: undefined,
      }));
    }
  }

  function handleFiles(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selected =
      Array.from(
        event.target.files ?? []
      );

    event.target.value = "";

    if (selected.length === 0) {
      return;
    }

    setFileError("");

    const nextFiles = [
      ...files,
      ...selected,
    ];

    if (nextFiles.length > MAX_FILES) {
      setFileError(
        `最多上传 ${MAX_FILES} 个文件。`
      );
      return;
    }

    const oversizedFile =
      selected.find(
        (file) =>
          file.size > MAX_FILE_SIZE
      );

    if (oversizedFile) {
      setFileError(
        `单个文件不能超过 10MB：${oversizedFile.name}`
      );
      return;
    }

    const duplicateFile =
      nextFiles.find(
        (file, index, array) =>
          array.findIndex(
            (candidate) =>
              candidate.name ===
                file.name &&
              candidate.size ===
                file.size &&
              candidate.lastModified ===
                file.lastModified
          ) !== index
      );

    if (duplicateFile) {
      setFileError(
        `请勿重复上传同一文件：${duplicateFile.name}`
      );
      return;
    }

    setFiles(nextFiles);
  }

  function removeFile(index: number) {
    setFiles((current) =>
      current.filter(
        (_, fileIndex) =>
          fileIndex !== index
      )
    );

    setFileError("");
  }

  function validateForSubmit() {
    const nextErrors: FormErrors = {};

    if (!applicationType) {
      nextErrors.applicationType =
        "请选择申请类型。";
    }

    if (!relation) {
      nextErrors.relation =
        "请选择你与本页面的关系。";
    }

    const normalizedName =
      applicantName.trim();

    if (!normalizedName) {
      nextErrors.applicantName =
        "请输入申请人姓名。";
    } else if (
      normalizedName.length < 2 ||
      normalizedName.length >
        MAX_NAME_LENGTH
    ) {
      nextErrors.applicantName =
        "申请人姓名请输入 2～50 个字符。";
    } else if (
      !/^[\p{L}\p{M}·・ー\s.'-]+$/u.test(
        normalizedName
      )
    ) {
      nextErrors.applicantName =
        "申请人姓名包含不支持的字符。";
    }

    const normalizedOrganization =
      organizationName.trim();

    if (
      needsOrganization &&
      !normalizedOrganization
    ) {
      nextErrors.organizationName =
        "请输入企业或组织名称。";
    } else if (
      normalizedOrganization.length >
      MAX_ORGANIZATION_LENGTH
    ) {
      nextErrors.organizationName =
        "企业或组织名称不能超过 100 个字符。";
    }

    const normalizedEmail =
      contactEmail
        .trim()
        .toLowerCase();

    if (!normalizedEmail) {
      nextErrors.contactEmail =
        "请输入联系邮箱。";
    } else if (
      normalizedEmail.length >
      MAX_EMAIL_LENGTH
    ) {
      nextErrors.contactEmail =
        "邮箱不能超过 254 个字符。";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalizedEmail
      )
    ) {
      nextErrors.contactEmail =
        "请输入有效的邮箱地址。";
    }

    const normalizedSubject =
      subject.trim();

    if (!normalizedSubject) {
      nextErrors.subject =
        "请输入申请标题。";
    } else if (
      normalizedSubject.length >
      MAX_SUBJECT_LENGTH
    ) {
      nextErrors.subject =
        "申请标题不能超过 80 个字符。";
    }

    const normalizedContent =
      content.trim();

    if (!normalizedContent) {
      nextErrors.content =
        "请填写具体说明。";
    } else if (
      normalizedContent.length < 20
    ) {
      nextErrors.content =
        "请至少填写 20 个字符，以便平台进行审核。";
    } else if (
      normalizedContent.length >
      MAX_CONTENT_LENGTH
    ) {
      nextErrors.content =
        "说明内容不能超过 5000 个字符。";
    }

    if (!declaration) {
      nextErrors.declaration =
        "提交前请确认声明。";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length ===
      0
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!report) {
      return;
    }

    if (!validateForSubmit()) {
      return;
    }

    setSubmitStatus("submitting");

    try {
      // TODO [API - POST]
      // POST /api/scams/:id/corrections
      //
      // Purpose:
      // Submit correction / right-of-reply /
      // counter-evidence application.
      //
      // Recommended backend requirements:
      // - authenticated user
      // - rate limit
      // - CSRF protection
      // - ownership / relationship verification
      // - evidence stored privately
      // - malware/file validation
      // - audit log
      // - moderation status = pending
      // - never auto-publish submitted evidence

      const payload = {
        reportId: report.id,
        applicationType,
        relation,
        applicantName:
          applicantName.trim(),
        organizationName:
          organizationName.trim(),
        contactEmail:
          contactEmail
            .trim()
            .toLowerCase(),
        subject: subject.trim(),
        content: content.trim(),
        evidenceFiles: files,
      };

      void payload;

      await new Promise((resolve) => {
        window.setTimeout(
          resolve,
          700
        );
      });

      setSubmitStatus("success");
    } catch {
      setSubmitStatus("idle");
    }
  }

  if (!report) {
    return (
      <NotFoundPage
        reportId={reportId}
      />
    );
  }

  if (submitStatus === "success") {
    return (
      <SuccessPage
        report={report}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* BREADCRUMB */}

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
              gap-2
              overflow-hidden
              px-4
              py-4
              text-xs
              font-bold
              text-slate-400
            "
          >
            <Link
              href="/"
              className="
                shrink-0
                transition
                hover:text-slate-900
              "
            >
              首页
            </Link>

            <ChevronRight
              size={13}
              className="shrink-0"
            />

            <Link
              href="/scam"
              className="
                shrink-0
                transition
                hover:text-slate-900
              "
            >
              避坑・风险信息
            </Link>

            <ChevronRight
              size={13}
              className="shrink-0"
            />

            <Link
              href={`/scam/${report.id}`}
              className="
                max-w-[180px]
                truncate
                transition
                hover:text-slate-900
                sm:max-w-xs
              "
            >
              {report.title}
            </Link>

            <ChevronRight
              size={13}
              className="shrink-0"
            />

            <span
              className="
                shrink-0
                text-slate-600
              "
            >
              纠错 / 回应
            </span>
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
            -left-40
            -top-48
            h-[480px]
            w-[480px]
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
            h-[460px]
            w-[460px]
            rounded-full
            bg-blue-500/10
            blur-3xl
          "
        />

        <Container>
          <div
            className="
              relative
              px-4
              py-10
              sm:py-14
            "
          >
            <Link
              href={`/scam/${report.id}`}
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
                  text-[11px]
                  font-black
                  text-rose-300
                "
              >
                <Scale size={13} />
                CORRECTION & RESPONSE
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
                申请纠错 / 当事方回应
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
                如果页面涉及你本人、你的企业或你依法代表的相关方，
                可以提交事实纠错、公开回应或反证材料。
                所有申请都会先进入人工审核，不会自动修改或删除原报告。
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* MAIN */}

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
            <form
              onSubmit={handleSubmit}
              className="
                min-w-0
                space-y-6
              "
            >
              {/* REPORT */}

              <FormCard
                step="01"
                title="确认涉及的风险信息"
                description="请确认你正在针对正确的页面提交申请。"
              >
                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                    sm:p-5
                  "
                >
                  <div
                    className="
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    <span
                      className="
                        rounded-full
                        bg-rose-50
                        px-2.5
                        py-1
                        text-[10px]
                        font-black
                        text-rose-700
                      "
                    >
                      {report.category}
                    </span>

                    <span
                      className="
                        rounded-full
                        bg-white
                        px-2.5
                        py-1
                        text-[10px]
                        font-bold
                        text-slate-500
                      "
                    >
                      {report.prefecture}
                    </span>
                  </div>

                  <h2
                    className="
                      mt-3
                      text-base
                      font-black
                      leading-7
                      text-slate-950
                    "
                  >
                    {report.title}
                  </h2>

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      justify-between
                      gap-4
                      border-t
                      border-slate-200
                      pt-4
                    "
                  >
                    <span
                      className="
                        text-[11px]
                        font-bold
                        text-slate-400
                      "
                    >
                      发布：
                      {formatDate(
                        report.publishTime
                      )}
                    </span>

                    <Link
                      href={`/scam/${report.id}`}
                      target="_blank"
                      className="
                        inline-flex
                        min-h-9
                        items-center
                        gap-1
                        text-[11px]
                        font-black
                        text-rose-700
                      "
                    >
                      查看原页面
                      <ArrowRight
                        size={12}
                      />
                    </Link>
                  </div>
                </div>
              </FormCard>

              {/* APPLICATION TYPE */}

              <FormCard
                step="02"
                title="选择申请类型"
                description="请选择最符合本次申请目的的一项。"
              >
                <div
                  className="
                    grid
                    gap-3
                    md:grid-cols-3
                  "
                >
                  <ChoiceCard
                    selected={
                      applicationType ===
                      "correction"
                    }
                    icon={
                      <FileText size={19} />
                    }
                    title="事实纠错"
                    description="页面中的日期、金额、身份关系、事件经过等事实存在错误。"
                    onClick={() => {
                      setApplicationType(
                        "correction"
                      );

                      setErrors(
                        (current) => ({
                          ...current,
                          applicationType:
                            undefined,
                        })
                      );
                    }}
                  />

                  <ChoiceCard
                    selected={
                      applicationType ===
                      "response"
                    }
                    icon={
                      <MessageSquareReply
                        size={19}
                      />
                    }
                    title="当事方回应"
                    description="希望针对页面内容提交正式说明，由平台审核后展示回应。"
                    onClick={() => {
                      setApplicationType(
                        "response"
                      );

                      setErrors(
                        (current) => ({
                          ...current,
                          applicationType:
                            undefined,
                        })
                      );
                    }}
                  />

                  <ChoiceCard
                    selected={
                      applicationType ===
                      "counter_evidence"
                    }
                    icon={
                      <FileCheck2
                        size={19}
                      />
                    }
                    title="提交反证"
                    description="你持有能够补充、反驳或重新解释现有信息的材料。"
                    onClick={() => {
                      setApplicationType(
                        "counter_evidence"
                      );

                      setErrors(
                        (current) => ({
                          ...current,
                          applicationType:
                            undefined,
                        })
                      );
                    }}
                  />
                </div>

                <FieldError
                  message={
                    errors.applicationType
                  }
                />
              </FormCard>

              {/* IDENTITY */}

              <FormCard
                step="03"
                title="申请人身份与关系"
                description="这些信息用于审核申请资格，不会直接显示在公开页面。"
              >
                <div>
                  <FieldLabel required>
                    你与本页面的关系
                  </FieldLabel>

                  <div
                    className="
                      mt-3
                      grid
                      gap-2
                      sm:grid-cols-2
                    "
                  >
                    <RelationButton
                      selected={
                        relation === "person"
                      }
                      label="涉及本人"
                      onClick={() => {
                        setRelation("person");
                        setErrors(
                          (current) => ({
                            ...current,
                            relation:
                              undefined,
                          })
                        );
                      }}
                    />

                    <RelationButton
                      selected={
                        relation ===
                        "business_owner"
                      }
                      label="企业经营者 / 负责人"
                      onClick={() => {
                        setRelation(
                          "business_owner"
                        );
                        setErrors(
                          (current) => ({
                            ...current,
                            relation:
                              undefined,
                          })
                        );
                      }}
                    />

                    <RelationButton
                      selected={
                        relation ===
                        "employee"
                      }
                      label="企业员工"
                      onClick={() => {
                        setRelation(
                          "employee"
                        );
                        setErrors(
                          (current) => ({
                            ...current,
                            relation:
                              undefined,
                          })
                        );
                      }}
                    />

                    <RelationButton
                      selected={
                        relation ===
                        "representative"
                      }
                      label="律师 / 授权代理人"
                      onClick={() => {
                        setRelation(
                          "representative"
                        );
                        setErrors(
                          (current) => ({
                            ...current,
                            relation:
                              undefined,
                          })
                        );
                      }}
                    />

                    <RelationButton
                      selected={
                        relation === "other"
                      }
                      label="其他直接相关方"
                      onClick={() => {
                        setRelation("other");
                        setErrors(
                          (current) => ({
                            ...current,
                            relation:
                              undefined,
                          })
                        );
                      }}
                    />
                  </div>

                  <FieldError
                    message={errors.relation}
                  />
                </div>

                <div
                  className="
                    mt-6
                    grid
                    gap-5
                    sm:grid-cols-2
                  "
                >
                  <div>
                    <FieldLabel required>
                      申请人姓名
                    </FieldLabel>

                    <input
                      type="text"
                      value={applicantName}
                      onChange={
                        handleApplicantNameChange
                      }
                      maxLength={
                        MAX_NAME_LENGTH
                      }
                      autoComplete="name"
                      placeholder="请输入真实姓名"
                      className={getInputClass(
                        Boolean(
                          errors.applicantName
                        )
                      )}
                    />

                    <FieldError
                      message={
                        errors.applicantName
                      }
                    />

                    <CharacterCount
                      current={
                        applicantName.length
                      }
                      max={MAX_NAME_LENGTH}
                    />
                  </div>

                  <div>
                    <FieldLabel required>
                      联系邮箱
                    </FieldLabel>

                    <input
                      type="email"
                      value={contactEmail}
                      onChange={
                        handleEmailChange
                      }
                      maxLength={
                        MAX_EMAIL_LENGTH
                      }
                      autoComplete="email"
                      inputMode="email"
                      placeholder="example@email.com"
                      className={getInputClass(
                        Boolean(
                          errors.contactEmail
                        )
                      )}
                    />

                    <FieldError
                      message={
                        errors.contactEmail
                      }
                    />
                  </div>
                </div>

                {needsOrganization && (
                  <div className="mt-5">
                    <FieldLabel required>
                      企业 / 组织名称
                    </FieldLabel>

                    <input
                      type="text"
                      value={
                        organizationName
                      }
                      onChange={
                        handleOrganizationChange
                      }
                      maxLength={
                        MAX_ORGANIZATION_LENGTH
                      }
                      autoComplete="organization"
                      placeholder="请输入正式名称"
                      className={getInputClass(
                        Boolean(
                          errors.organizationName
                        )
                      )}
                    />

                    <FieldError
                      message={
                        errors.organizationName
                      }
                    />

                    <CharacterCount
                      current={
                        organizationName.length
                      }
                      max={
                        MAX_ORGANIZATION_LENGTH
                      }
                    />
                  </div>
                )}

                <div
                  className="
                    mt-5
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
                    姓名、邮箱、企业证明、
                    授权文件和身份验证资料仅用于平台审核。
                    除非你明确同意并通过审核，
                    Sakura
                    不会把这些私人资料直接公开到风险页面。
                  </p>
                </div>
              </FormCard>

              {/* CONTENT */}

              <FormCard
                step="04"
                title="填写申请内容"
                description="尽量说明具体哪一部分存在问题、你的主张是什么，以及可以支持主张的事实。"
              >
                <div>
                  <FieldLabel required>
                    申请标题
                  </FieldLabel>

                  <input
                    type="text"
                    value={subject}
                    onChange={
                      handleSubjectChange
                    }
                    maxLength={
                      MAX_SUBJECT_LENGTH
                    }
                    placeholder={
                      getSubjectPlaceholder(
                        applicationType
                      )
                    }
                    className={getInputClass(
                      Boolean(
                        errors.subject
                      )
                    )}
                  />

                  <FieldError
                    message={errors.subject}
                  />

                  <CharacterCount
                    current={subject.length}
                    max={
                      MAX_SUBJECT_LENGTH
                    }
                  />
                </div>

                <div className="mt-5">
                  <FieldLabel required>
                    具体说明
                  </FieldLabel>

                  <textarea
                    value={content}
                    onChange={
                      handleContentChange
                    }
                    maxLength={
                      MAX_CONTENT_LENGTH
                    }
                    rows={10}
                    placeholder={
                      getContentPlaceholder(
                        applicationType
                      )
                    }
                    className={`
                      mt-2
                      min-h-[220px]
                      w-full
                      resize-y
                      rounded-2xl
                      border
                      bg-white
                      px-4
                      py-3.5
                      text-sm
                      leading-7
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      ${
                        errors.content
                          ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                          : "border-slate-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5"
                      }
                    `}
                  />

                  <FieldError
                    message={errors.content}
                  />

                  <CharacterCount
                    current={content.length}
                    max={
                      MAX_CONTENT_LENGTH
                    }
                  />
                </div>

                <div
                  className="
                    mt-5
                    rounded-2xl
                    bg-slate-50
                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <Info
                      size={17}
                      className="
                        mt-0.5
                        shrink-0
                        text-slate-500
                      "
                    />

                    <div
                      className="
                        text-xs
                        leading-6
                        text-slate-600
                      "
                    >
                      <p className="font-black text-slate-800">
                        建议写清楚：
                      </p>

                      <p className="mt-1">
                        原页面哪一句或哪项信息存在问题；
                        你认为正确的事实是什么；
                        事件发生的时间；
                        你与事件的关系；
                        有哪些材料能够支持你的说明。
                      </p>
                    </div>
                  </div>
                </div>
              </FormCard>

              {/* EVIDENCE */}

              <FormCard
                step="05"
                title="提交证明 / 反证材料"
                description="不是强制公开。材料默认作为私密审核资料处理。"
              >
                <label
                  className="
                    flex
                    min-h-[150px]
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-dashed
                    border-slate-300
                    bg-slate-50
                    px-5
                    py-7
                    text-center
                    transition
                    hover:border-slate-400
                    hover:bg-slate-100
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
                    上传证明材料
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-slate-500
                    "
                  >
                    最多 {MAX_FILES} 个文件，
                    单个文件最大 10MB
                  </p>

                  <input
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={handleFiles}
                  />
                </label>

                {fileError && (
                  <div
                    className="
                      mt-3
                      flex
                      items-start
                      gap-2
                      rounded-xl
                      bg-rose-50
                      px-3
                      py-2.5
                      text-xs
                      font-bold
                      text-rose-700
                    "
                  >
                    <AlertTriangle
                      size={14}
                      className="
                        mt-0.5
                        shrink-0
                      "
                    />
                    {fileError}
                  </div>
                )}

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map(
                      (file, index) => (
                        <div
                          key={`${file.name}-${file.lastModified}`}
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-3
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
                              bg-slate-100
                              text-slate-600
                            "
                          >
                            <Paperclip
                              size={15}
                            />
                          </div>

                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >
                            <p
                              className="
                                truncate
                                text-xs
                                font-black
                                text-slate-800
                              "
                            >
                              {file.name}
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-[10px]
                                font-bold
                                text-slate-400
                              "
                            >
                              {formatFileSize(
                                file.size
                              )}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFile(
                                index
                              )
                            }
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              text-slate-400
                              transition
                              hover:bg-rose-50
                              hover:text-rose-600
                            "
                            aria-label={`删除 ${file.name}`}
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}

                <div
                  className="
                    mt-4
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    border
                    border-amber-200
                    bg-amber-50
                    p-4
                  "
                >
                  <ShieldCheck
                    size={17}
                    className="
                      mt-0.5
                      shrink-0
                      text-amber-700
                    "
                  />

                  <p
                    className="
                      text-xs
                      leading-6
                      text-amber-900
                    "
                  >
                    请不要为了申请而上传与事件无关的第三方身份证件、
                    银行密码、登录密码或其他不必要的高度敏感信息。
                    正式上线后，文件还会经过类型检查、
                    恶意文件检测和访问权限控制。
                  </p>
                </div>
              </FormCard>

              {/* DECLARATION */}

              <FormCard
                step="06"
                title="确认并提交"
                description="提交后进入审核队列。平台可能联系你补充材料或完成身份关系验证。"
              >
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
                      errors.declaration
                        ? "border-rose-300 bg-rose-50"
                        : "border-slate-200 bg-slate-50"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={declaration}
                    onChange={(event) => {
                      setDeclaration(
                        event.target.checked
                      );

                      if (
                        errors.declaration
                      ) {
                        setErrors(
                          (current) => ({
                            ...current,
                            declaration:
                              undefined,
                          })
                        );
                      }
                    }}
                    className="
                      mt-1
                      h-4
                      w-4
                      shrink-0
                      accent-slate-950
                    "
                  />

                  <span
                    className="
                      text-xs
                      leading-6
                      text-slate-600
                    "
                  >
                    我确认以上内容基于本人目前掌握的信息如实提交，
                    不利用纠错或回应功能进行骚扰、冒充、
                    泄露他人隐私、报复性曝光或提交明知虚假的材料。
                    我理解提交申请不代表 Sakura
                    已认可我的主张，也不会自动删除原报告。
                  </span>
                </label>

                <FieldError
                  message={
                    errors.declaration
                  }
                />

                <button
                  type="submit"
                  disabled={
                    submitStatus ===
                    "submitting"
                  }
                  className="
                    mt-5
                    inline-flex
                    min-h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-slate-950
                    px-5
                    py-3.5
                    text-sm
                    font-black
                    text-white
                    transition
                    hover:bg-slate-800
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {submitStatus ===
                  "submitting" ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      正在提交...
                    </>
                  ) : (
                    <>
                      提交审核
                      <ArrowRight
                        size={16}
                      />
                    </>
                  )}
                </button>
              </FormCard>
            </form>

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
                <Scale
                  size={19}
                  className="text-rose-600"
                />

                <h2
                  className="
                    mt-3
                    text-base
                    font-black
                    text-slate-950
                  "
                >
                  申请不会自动公开
                </h2>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-6
                    text-slate-500
                  "
                >
                  平台会先确认申请人与事件的关系、
                  检查材料并判断哪些内容适合公开。
                </p>
              </div>

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
                    text-blue-600
                  "
                >
                  REVIEW FLOW
                </p>

                <h2
                  className="
                    mt-2
                    text-base
                    font-black
                    text-slate-950
                  "
                >
                  审核流程
                </h2>

                <div className="mt-5 space-y-4">
                  <ReviewStep
                    number="1"
                    title="提交申请"
                    description="填写事实和相关材料。"
                  />

                  <ReviewStep
                    number="2"
                    title="身份 / 关系确认"
                    description="确认申请人是否属于直接相关方。"
                  />

                  <ReviewStep
                    number="3"
                    title="材料审核"
                    description="比较原报告、反证和可核实信息。"
                  />

                  <ReviewStep
                    number="4"
                    title="处理结果"
                    description="纠错、补充说明、展示回应或维持原内容。"
                  />
                </div>
              </div>

              <div
                className="
                  rounded-[24px]
                  bg-slate-950
                  p-5
                  text-white
                "
              >
                <LockKeyhole
                  size={19}
                  className="text-blue-400"
                />

                <h2
                  className="
                    mt-3
                    text-base
                    font-black
                  "
                >
                  私密材料
                </h2>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-6
                    text-slate-400
                  "
                >
                  身份证明、合同原件、
                  私人聊天记录和联系方式默认仅授权审核人员访问。
                  公开页面只展示经过审核后允许公开的内容。
                </p>
              </div>

              <div
                className="
                  rounded-[24px]
                  border
                  border-amber-200
                  bg-amber-50
                  p-5
                "
              >
                <AlertTriangle
                  size={18}
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
                  关于删除报告
                </h2>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-6
                    text-amber-900/80
                  "
                >
                  提交纠错或回应不等于自动删除。
                  如果事实发生变化，
                  平台可以更新、增加纠错记录、
                  降低风险标记或停止公开；
                  具体处理取决于审核结果。
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </main>
  );
}

function FormCard({
  step,
  title,
  description,
  children,
}: {
  step: string;
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
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-slate-950
            text-xs
            font-black
            text-white
          "
        >
          {step}
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
              leading-6
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

function ChoiceCard({
  selected,
  icon,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`
        min-h-[150px]
        rounded-2xl
        border
        p-4
        text-left
        transition
        ${
          selected
            ? "border-slate-950 bg-slate-950 text-white shadow-lg"
            : "border-slate-200 bg-white text-slate-900 hover:border-slate-400"
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
            selected
              ? "bg-white/10 text-white"
              : "bg-slate-100 text-slate-600"
          }
        `}
      >
        {icon}
      </div>

      <p
        className="
          mt-4
          text-sm
          font-black
        "
      >
        {title}
      </p>

      <p
        className={`
          mt-2
          text-xs
          leading-5
          ${
            selected
              ? "text-slate-300"
              : "text-slate-500"
          }
        `}
      >
        {description}
      </p>
    </button>
  );
}

function RelationButton({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`
        flex
        min-h-11
        items-center
        gap-2
        rounded-xl
        border
        px-3.5
        py-2.5
        text-left
        text-xs
        font-black
        transition
        ${
          selected
            ? "border-slate-950 bg-slate-950 text-white"
            : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
        }
      `}
    >
      <span
        className={`
          flex
          h-5
          w-5
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          ${
            selected
              ? "border-white bg-white text-slate-950"
              : "border-slate-300"
          }
        `}
      >
        {selected && (
          <Check size={12} />
        )}
      </span>

      {label}
    </button>
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
    <label
      className="
        block
        text-xs
        font-black
        text-slate-800
      "
    >
      {children}

      {required && (
        <span className="ml-1 text-rose-600">
          *
        </span>
      )}
    </label>
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
    <p
      className="
        mt-2
        flex
        items-start
        gap-1.5
        text-xs
        font-bold
        text-rose-600
      "
    >
      <AlertTriangle
        size={13}
        className="
          mt-0.5
          shrink-0
        "
      />

      {message}
    </p>
  );
}

function CharacterCount({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  return (
    <p
      className="
        mt-1.5
        text-right
        text-[10px]
        font-bold
        text-slate-400
      "
    >
      {current} / {max}
    </p>
  );
}

function ReviewStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
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
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-slate-100
          text-[10px]
          font-black
          text-slate-700
        "
      >
        {number}
      </div>

      <div>
        <p
          className="
            text-xs
            font-black
            text-slate-800
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-[11px]
            leading-5
            text-slate-500
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function SuccessPage({
  report,
}: {
  report: ScamSummary;
}) {
  return (
    <main
      className="
        min-h-screen
        bg-slate-50
      "
    >
      <Container>
        <div
          className="
            flex
            min-h-[75vh]
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
              rounded-[28px]
              border
              border-slate-200
              bg-white
              p-7
              text-center
              shadow-sm
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
                bg-emerald-50
                text-emerald-600
              "
            >
              <CheckCircle2
                size={28}
              />
            </div>

            <div
              className="
                mt-5
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-amber-50
                px-3
                py-1.5
                text-[11px]
                font-black
                text-amber-700
              "
            >
              <FileCheck2
                size={13}
              />
              待审核
            </div>

            <h1
              className="
                mt-4
                text-2xl
                font-black
                text-slate-950
              "
            >
              申请已提交
            </h1>

            <p
              className="
                mx-auto
                mt-3
                max-w-md
                text-sm
                leading-7
                text-slate-500
              "
            >
              你的申请已经进入审核队列。
              在完成身份关系确认和材料审核以前，
              申请内容不会自动公开，
              原风险信息也不会自动删除。
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
              <p
                className="
                  text-[10px]
                  font-black
                  text-slate-400
                "
              >
                涉及页面
              </p>

              <p
                className="
                  mt-1.5
                  text-sm
                  font-black
                  leading-6
                  text-slate-800
                "
              >
                {report.title}
              </p>
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
                href={`/scam/${report.id}`}
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
                  text-sm
                  font-black
                  text-slate-700
                "
              >
                <ArrowLeft
                  size={15}
                />
                返回原页面
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
                  text-sm
                  font-black
                  text-white
                "
              >
                风险信息首页
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

function NotFoundPage({
  reportId,
}: {
  reportId: number;
}) {
  return (
    <main className="min-h-screen bg-slate-50">
      <Container>
        <div
          className="
            flex
            min-h-[70vh]
            items-center
            justify-center
            px-4
            py-16
          "
        >
          <div
            className="
              w-full
              max-w-lg
              rounded-[26px]
              border
              border-slate-200
              bg-white
              p-8
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-slate-100
                text-slate-500
              "
            >
              <UserRound size={23} />
            </div>

            <h1
              className="
                mt-5
                text-xl
                font-black
                text-slate-950
              "
            >
              无法提交申请
            </h1>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-slate-500
              "
            >
              找不到编号为{" "}
              {Number.isFinite(reportId)
                ? reportId
                : "-"}{" "}
              的公开风险信息。
            </p>

            <Link
              href="/scam"
              className="
                mt-6
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-slate-950
                px-5
                py-3
                text-sm
                font-black
                text-white
              "
            >
              <ArrowLeft size={15} />
              返回风险信息
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}

function getInputClass(
  hasError: boolean
) {
  return `
    mt-2
    min-h-11
    w-full
    rounded-xl
    border
    bg-white
    px-3.5
    py-2.5
    text-sm
    text-slate-900
    outline-none
    transition
    placeholder:text-slate-400
    ${
      hasError
        ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
        : "border-slate-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5"
    }
  `;
}

function getSubjectPlaceholder(
  type: ApplicationType | ""
) {
  switch (type) {
    case "correction":
      return "例如：页面中的事件日期存在错误";
    case "response":
      return "例如：关于本事件的当事方说明";
    case "counter_evidence":
      return "例如：提交能够补充说明事件经过的材料";
    default:
      return "请简要概括本次申请";
  }
}

function getContentPlaceholder(
  type: ApplicationType | ""
) {
  switch (type) {
    case "correction":
      return "请说明原页面具体哪项信息存在错误、目前页面如何描述、你认为正确的事实是什么，以及可以支持该事实的材料。";
    case "response":
      return "请填写希望平台审核的正式回应。建议围绕可核实事实进行说明，避免公开无关第三方隐私信息。";
    case "counter_evidence":
      return "请说明你提交的材料是什么、材料与原报告哪一部分有关，以及这些材料能够证明或补充什么事实。";
    default:
      return "请尽可能按照时间顺序说明事实，并指出与原页面内容的具体关系。";
  }
}

function formatDate(
  value: string
) {
  return value.replaceAll("-", ".");
}

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
    (1024 * 1024)
  ).toFixed(1)} MB`;
}