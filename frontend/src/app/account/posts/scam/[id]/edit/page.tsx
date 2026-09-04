"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  FileCheck2,
  FileText,
  Flag,
  Loader2,
  LockKeyhole,
  MessageSquareWarning,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";

import Container from "@/components/layout/Container";

type PublishStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected";

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

type EvidenceVisibility =
  | "admin_only"
  | "public_redacted";

type PublicIdentity =
  | "anonymous"
  | "nickname";

interface ScamEditForm {
  id: number;
  status: PublishStatus;
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
  reviewerMessage?: string;
  createdAt: string;
  updatedAt: string;
}

interface ExistingEvidence {
  id: string;
  name: string;
  type: EvidenceType;
  visibility: EvidenceVisibility;
  reviewStatus:
    | "submitted"
    | "reviewed"
    | "rejected";
  kind: "existing";
}

interface LocalEvidence {
  id: string;
  file: File;
  previewUrl?: string;
  type: EvidenceType;
  visibility: EvidenceVisibility;
  kind: "local";
}

type EvidenceItem =
  | ExistingEvidence
  | LocalEvidence;

interface StoredScamEdit {
  form: ScamEditForm;
  existingEvidence: ExistingEvidence[];
}

const MAX_FILES = 10;
const MAX_FILE_SIZE =
  10 * 1024 * 1024;

const reportTypes: {
  value: ReportType;
  label: string;
}[] = [
  {
    value: "dangerous_job",
    label: "危险招聘",
  },
  {
    value: "fraud",
    label: "诈骗风险",
  },
  {
    value: "consumer_dispute",
    label: "消费纠纷",
  },
  {
    value: "housing_dispute",
    label: "租房纠纷",
  },
  {
    value: "other",
    label: "其他风险",
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

function createMockScam(
  id: number
): ScamEditForm {
  return {
    id,
    status: "pending",
    reportType: "dangerous_job",
    title:
      "求职时被要求先购买商品并交给陌生人",
    prefecture: "东京",
    incidentDate: "2026-08-22",
    subjectType: "unknown",
    subjectName: "",
    summary:
      "在求职过程中，对方表示工作内容简单，但要求我先用自己的资金购买指定商品，再将商品交给另外的人。",
    details:
      "我是在网络上的招聘信息中看到这个工作。对方最开始只说明是简单的商品相关兼职，没有说明具体内容。沟通以后，对方要求我使用自己的资金购买指定商品，并表示完成以后会把商品费用和报酬一起结算。\n\n我询问正式公司名称和劳动条件时，对方没有明确回答，而是要求继续使用私人聊天工具联系。之后我觉得情况异常，没有继续购买商品，也没有发生付款。\n\n目前我已经停止与对方联系，并保留了原招聘页面和部分聊天记录。",
    publicIdentity: "anonymous",
    displayName: "",
    contactEmail:
      "user@example.com",
    contactPhone: "",
    hasImmediateDanger: false,
    reviewerMessage:
      "材料已收到。请尽量补充原招聘信息截图，并确认聊天截图中是否包含电话号码等敏感信息。",
    createdAt: "2026-08-23",
    updatedAt: "2026-08-30",
  };
}

function createMockEvidence(): ExistingEvidence[] {
  return [
    {
      id: "evidence_001",
      name: "招聘页面截图.jpg",
      type: "advertisement",
      visibility: "admin_only",
      reviewStatus: "reviewed",
      kind: "existing",
    },
    {
      id: "evidence_002",
      name: "聊天记录_01.png",
      type: "chat",
      visibility: "admin_only",
      reviewStatus: "submitted",
      kind: "existing",
    },
  ];
}

export default function ScamEditPage() {
  const params =
    useParams<{ id: string }>();

  const scamId = Number(
    params.id
  );

  const storageKey =
    `sakura-scam-edit-${scamId}`;

  const [form, setForm] =
    useState<ScamEditForm | null>(
      null
    );

  const [evidence, setEvidence] =
    useState<EvidenceItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState<
      "idle" | "draft" | "submit"
    >("idle");

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const totalEvidence =
    evidence.length;

  const canSubmit = useMemo(() => {
    if (!form) {
      return false;
    }

    return (
      form.title.trim().length >=
        8 &&
      form.summary.trim().length >=
        30 &&
      form.details.trim().length >=
        80
    );
  }, [form]);

  const now = new Date();

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  useEffect(() => {
    let active = true;

    async function loadScam() {
      setLoading(true);

      try {
        const stored =
          window.localStorage.getItem(
            storageKey
          );

        if (stored) {
          try {
            const parsed =
              JSON.parse(
                stored
              ) as StoredScamEdit;

            if (
              active &&
              parsed.form
            ) {
              setForm(
                parsed.form
              );

              setEvidence(
                parsed.existingEvidence ??
                  []
              );

              setLoading(false);
              return;
            }
          } catch {
            window.localStorage.removeItem(
              storageKey
            );
          }
        }

        // TODO [API - GET]
        // GET /api/me/scam-reports/:id
        // Purpose: load current user's editable safety report.
        // Backend must enforce ownership.

        await new Promise(
          (resolve) => {
            window.setTimeout(
              resolve,
              300
            );
          }
        );

        if (active) {
          setForm(
            createMockScam(
              scamId
            )
          );

          setEvidence(
            createMockEvidence()
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadScam();

    return () => {
      active = false;
    };
  }, [scamId, storageKey]);

  function updateForm<
    K extends keyof ScamEditForm,
  >(
    key: K,
    value: ScamEditForm[K]
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
      MAX_FILES -
      evidence.length;

    if (available <= 0) {
      setError(
        `最多保留 ${MAX_FILES} 个证据文件。`
      );
      return;
    }

    const accepted =
      files.slice(0, available);

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
        (file): LocalEvidence => {
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
            kind: "local",
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

      if (
        target?.kind ===
          "local" &&
        target.previewUrl
      ) {
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
    visibility: EvidenceVisibility
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

  function saveLocalCopy(
    currentForm: ScamEditForm
  ) {
    const existingEvidence =
      evidence
        .filter(
          (
            item
          ): item is ExistingEvidence =>
            item.kind ===
            "existing"
        )
        .map((item) => ({
          ...item,
        }));

    const payload: StoredScamEdit =
      {
        form: currentForm,
        existingEvidence,
      };

    window.localStorage.setItem(
      storageKey,
      JSON.stringify(payload)
    );
  }

  function validateForSubmit() {
    if (!form) {
      return "报告数据尚未加载完成。";
    }

    const title =
      form.title.trim();

    const subjectName =
      form.subjectName.trim();

    const summary =
      form.summary.trim();

    const details =
      form.details.trim();

    const displayName =
      form.displayName.trim();

    const email =
      form.contactEmail.trim();

    const phone =
      form.contactPhone.trim();

    if (
      !reportTypes.some(
        (item) =>
          item.value ===
          form.reportType
      )
    ) {
      return "请选择有效的风险类型。";
    }

    if (
      title.length < 8 ||
      title.length > 80
    ) {
      return "标题请输入 8～80 个字符。";
    }

    if (
      !prefectures.includes(
        form.prefecture
      )
    ) {
      return "请选择有效的地区。";
    }

    if (!form.incidentDate) {
      return "请选择事件发生日期。";
    }

    const incidentTime =
      new Date(
        `${form.incidentDate}T00:00:00`
      ).getTime();

    if (
      !Number.isFinite(
        incidentTime
      )
    ) {
      return "请输入有效的事件发生日期。";
    }

    const today =
      new Date();

    today.setHours(
      23,
      59,
      59,
      999
    );

    if (
      incidentTime >
      today.getTime()
    ) {
      return "事件发生日期不能晚于今天。";
    }

    if (
      ![
        "unknown",
        "individual",
        "business",
      ].includes(
        form.subjectType
      )
    ) {
      return "请选择有效的涉及对象类型。";
    }

    if (
      form.subjectType !==
        "unknown" &&
      !subjectName
    ) {
      return "请填写涉及对象的名称。";
    }

    if (
      subjectName.length > 100
    ) {
      return "涉及对象名称不能超过 100 个字符。";
    }

    if (
      summary.length < 30 ||
      summary.length > 300
    ) {
      return "简要说明请输入 30～300 个字符。";
    }

    if (
      details.length < 80 ||
      details.length > 5000
    ) {
      return "详细经过请输入 80～5000 个字符。";
    }

    if (
      ![
        "anonymous",
        "nickname",
      ].includes(
        form.publicIdentity
      )
    ) {
      return "请选择有效的公开身份方式。";
    }

    if (
      form.publicIdentity ===
        "nickname" &&
      !displayName
    ) {
      return "请输入公开昵称。";
    }

    if (
      displayName.length > 50
    ) {
      return "公开昵称不能超过 50 个字符。";
    }

    if (
      email.length > 254
    ) {
      return "邮箱地址不能超过 254 个字符。";
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      return "请输入有效的邮箱地址。";
    }

    if (
      phone &&
      !/^0\d{9,10}$/.test(
        phone
      )
    ) {
      return "联系电话请输入日本常用的 10～11 位号码。";
    }

    if (
      evidence.length >
      MAX_FILES
    ) {
      return `证据文件最多 ${MAX_FILES} 个。`;
    }

    for (const item of evidence) {
      if (
        !evidenceTypes.some(
          (type) =>
            type.value ===
            item.type
        )
      ) {
        return "存在无效的证据类型。";
      }

      if (
        ![
          "admin_only",
          "public_redacted",
        ].includes(
          item.visibility
        )
      ) {
        return "存在无效的证据公开权限。";
      }

      if (
        item.kind === "local"
      ) {
        if (
          item.file.size >
          MAX_FILE_SIZE
        ) {
          return `单个证据文件不能超过 10MB：${item.file.name}`;
        }
      }
    }

    return "";
  }

  async function saveDraft() {
    if (!form) {
      return;
    }

    setSaving("draft");
    setError("");
    setMessage("");

    try {
      // TODO [API - PATCH]
      // PATCH /api/me/scam-reports/:id
      // Purpose: save current user's own report as a draft/update.
      // Backend derives user from session and checks ownership.

      await mockUploadLocalEvidence();

      const updatedForm: ScamEditForm =
        {
          ...form,
          status: "draft",
          updatedAt:
            new Date()
              .toISOString()
              .slice(0, 10),
        };

      await new Promise(
        (resolve) => {
          window.setTimeout(
            resolve,
            450
          );
        }
      );

      setForm(updatedForm);
      saveLocalCopy(
        updatedForm
      );

      setMessage(
        "草稿已保存。"
      );
    } finally {
      setSaving("idle");
    }
  }

  async function submitAgain(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form) {
      return;
    }

    const validationError =
      validateForSubmit();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving("submit");
    setError("");
    setMessage("");

    try {
      await mockUploadLocalEvidence();

      // TODO [API - PATCH]
      // PATCH /api/me/scam-reports/:id
      // Purpose: update and resubmit current user's own report.
      // Backend must enforce ownership and move status to pending review.

      await new Promise(
        (resolve) => {
          window.setTimeout(
            resolve,
            550
          );
        }
      );

      const updatedForm: ScamEditForm =
        {
          ...form,
          status: "pending",
          updatedAt:
            new Date()
              .toISOString()
              .slice(0, 10),
        };

      setForm(updatedForm);
      saveLocalCopy(
        updatedForm
      );

      setMessage(
        "已重新提交审核。"
      );
    } finally {
      setSaving("idle");
    }
  }

  async function mockUploadLocalEvidence() {
    const localFiles =
      evidence.filter(
        (
          item
        ): item is LocalEvidence =>
          item.kind ===
          "local"
      );

    if (
      localFiles.length === 0
    ) {
      return;
    }

    // TODO [API - POST]
    // POST /api/me/scam-reports/:id/evidence
    // Purpose: securely upload evidence for current user's own report.
    // Backend validates ownership, file signature, MIME, size and storage permissions.

    await new Promise(
      (resolve) => {
        window.setTimeout(
          resolve,
          300
        );
      }
    );
  }

  if (loading) {
    return <LoadingPage />;
  }

  if (!form) {
    return <NotFoundPage />;
  }

  const isPublished =
    form.status ===
    "published";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}

      <section
        className="
          border-b
          border-slate-800
          bg-slate-950
        "
      >
        <Container>
          <div
            className="
              px-4
              py-9
              sm:py-11
            "
          >
            <Link
              href="/account/posts"
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
              返回我的发布
            </Link>

            <div
              className="
                mt-5
                flex
                flex-col
                gap-5
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >
              <div>
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      rounded-full
                      bg-rose-500/10
                      px-3
                      py-1.5
                      text-xs
                      font-black
                      text-rose-300
                    "
                  >
                    Scam / Safety
                  </span>

                  <StatusBadge
                    status={
                      form.status
                    }
                  />
                </div>

                <h1
                  className="
                    mt-4
                    text-2xl
                    font-black
                    tracking-tight
                    text-white
                    sm:text-3xl
                  "
                >
                  编辑风险报告
                </h1>

                <p
                  className="
                    mt-2
                    text-xs
                    font-semibold
                    text-slate-400
                  "
                >
                  最后更新：
                  {formatDate(
                    form.updatedAt
                  )}
                </p>
              </div>

              {isPublished && (
                <Link
                  href={`/scam/${form.id}`}
                  className="
                    inline-flex
                    min-h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-3
                    text-sm
                    font-black
                    text-white
                    transition
                    hover:bg-white/10
                  "
                >
                  查看公开页面
                  <ArrowRight
                    size={15}
                  />
                </Link>
              )}
            </div>
          </div>
        </Container>
      </section>

      <form
        onSubmit={submitAgain}
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
                {/* STATUS MESSAGE */}

                {form.status ===
                  "pending" && (
                  <NoticeBox
                    tone="blue"
                    icon={
                      <ShieldCheck
                        size={18}
                      />
                    }
                    title="当前正在审核"
                  >
                    你仍然可以补充事实和证据。
                    如果修改涉及重要事实，
                    后续审核会以最新版本为准。
                  </NoticeBox>
                )}

                {form.status ===
                  "rejected" && (
                  <NoticeBox
                    tone="rose"
                    icon={
                      <CircleAlert
                        size={18}
                      />
                    }
                    title="需要修改后重新提交"
                  >
                    {form.reviewerMessage ??
                      "请根据审核意见修改后重新提交。"}
                  </NoticeBox>
                )}

                {form.reviewerMessage &&
                  form.status !==
                    "rejected" && (
                    <NoticeBox
                      tone="amber"
                      icon={
                        <MessageSquareWarning
                          size={18}
                        />
                      }
                      title="审核员备注"
                    >
                      {
                        form.reviewerMessage
                      }
                    </NoticeBox>
                  )}

                {/* BASIC */}

                <FormSection
                  title="事件基本信息"
                  description="修改事实和风险分类。"
                >
                  <div className="space-y-5">
                    <Field label="风险类型">
                      <SelectWrap>
                        <select
                          value={
                            form.reportType
                          }
                          onChange={(
                            event
                          ) =>
                            updateForm(
                              "reportType",
                              event.target
                                .value as ReportType
                            )
                          }
                          className={
                            selectClass
                          }
                        >
                          {reportTypes.map(
                            (item) => (
                              <option
                                key={
                                  item.value
                                }
                                value={
                                  item.value
                                }
                              >
                                {
                                  item.label
                                }
                              </option>
                            )
                          )}
                        </select>
                      </SelectWrap>
                    </Field>

                    <Field
                      label="标题"
                      hint={`${form.title.length}/80`}
                    >
                      <input
                        value={
                          form.title
                        }
                        maxLength={80}
                        onChange={(
                          event
                        ) =>
                          updateForm(
                            "title",
                            event.target
                              .value
                          )
                        }
                        className={
                          inputClass
                        }
                      />
                    </Field>

                    <div
                      className="
                        grid
                        gap-4
                        sm:grid-cols-2
                      "
                    >
                      <Field label="地区">
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
                          max={today}
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

                    <Field label="涉及对象">
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
                      >
                        <input
                          value={form.subjectName}
                          maxLength={100}
                          onChange={(event) =>
                            updateForm(
                              "subjectName",
                              event.target.value
                            )
                          }
                          className={inputClass}
                        />
                      </Field>
                    )}
                  </div>
                </FormSection>

                {/* DETAILS */}

                <FormSection
                  title="事实经过"
                  description="修改公开审核时使用的事实说明。"
                >
                  <div className="space-y-5">
                    <Field
                      label="简要说明"
                      hint={`${form.summary.length}/300`}
                    >
                      <textarea
                        value={
                          form.summary
                        }
                        maxLength={300}
                        rows={4}
                        onChange={(
                          event
                        ) =>
                          updateForm(
                            "summary",
                            event.target
                              .value
                          )
                        }
                        className={
                          textareaClass
                        }
                      />
                    </Field>

                    <Field
                      label="详细经过"
                      hint={`${form.details.length} 字`}
                    >
                      <textarea
                        value={
                          form.details
                        }
                        maxLength={5000}
                        rows={12}
                        onChange={(
                          event
                        ) =>
                          updateForm(
                            "details",
                            event.target
                              .value
                          )
                        }
                        className={
                          textareaClass
                        }
                      />
                    </Field>

                    <div
                      className="
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
                      <AlertTriangle
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
                        已公开内容如果以后修改关键事实，
                        正式系统中应保留内容版本，
                        并可能重新进入审核，
                        避免“通过审核后再改成另一套内容”。
                      </p>
                    </div>
                  </div>
                </FormSection>

                {/* EVIDENCE */}

                <FormSection
                  title="补充证据"
                  description="可以继续追加材料，也可以调整公开权限。"
                >
                  <label
                    className="
                      flex
                      min-h-32
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
                      py-6
                      text-center
                      transition
                      hover:border-rose-300
                      hover:bg-rose-50/50
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
                        bg-white
                        text-slate-600
                        shadow-sm
                      "
                    >
                      <Upload
                        size={18}
                      />
                    </div>

                    <p
                      className="
                        mt-3
                        text-sm
                        font-black
                        text-slate-900
                      "
                    >
                      添加新证据
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                      "
                    >
                      当前 {totalEvidence}/
                      {MAX_FILES}
                    </p>

                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,application/pdf"
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
                      新上传的证据默认仅审核员可见。
                      即使选择允许公开，
                      公开页面以后也只使用审核后的脱敏版本，
                      不直接公开原始文件。
                    </p>
                  </div>

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

                    {evidence.length ===
                      0 && (
                      <div
                        className="
                          rounded-2xl
                          border
                          border-dashed
                          border-slate-300
                          bg-white
                          p-6
                          text-center
                        "
                      >
                        <FileCheck2
                          size={20}
                          className="
                            mx-auto
                            text-slate-400
                          "
                        />

                        <p
                          className="
                            mt-2
                            text-xs
                            font-bold
                            text-slate-500
                          "
                        >
                          当前没有证据文件
                        </p>
                      </div>
                    )}
                  </div>
                </FormSection>

                {/* IDENTITY */}

                <FormSection
                  title="公开身份"
                  description="后台提交账号不会因为公开匿名而消失。"
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
                      title="匿名公开"
                      description="公开页面只显示匿名用户报告。"
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
                      title="显示昵称"
                      description="使用指定昵称公开，不显示登录资料。"
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
                          maxLength={50}
                          onChange={(
                            event
                          ) =>
                            updateForm(
                              "displayName",
                              event.target
                                .value
                            )
                          }
                          className={
                            inputClass
                          }
                        />
                      </Field>
                    </div>
                  )}
                </FormSection>

                {/* CONTACT */}

                <FormSection
                  title="审核联系方式"
                  description="这些信息不会进入公开风险详情页。"
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
                        value={form.contactEmail}
                        maxLength={254}
                        onChange={(event) =>
                          updateForm(
                            "contactEmail",
                            event.target.value
                          )
                        }
                        className={inputClass}
                      />
                    </Field>

                    <Field label="联系电话">
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={11}
                        value={form.contactPhone}
                        onChange={(event) => {
                          const value = event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 11);

                          updateForm(
                            "contactPhone",
                            value
                          );
                        }}
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </FormSection>

                {error && (
                  <NoticeBox
                    tone="rose"
                    icon={
                      <CircleAlert
                        size={18}
                      />
                    }
                    title="无法提交"
                  >
                    {error}
                  </NoticeBox>
                )}

                {message && (
                  <NoticeBox
                    tone="emerald"
                    icon={
                      <CheckCircle2
                        size={18}
                      />
                    }
                    title="已完成"
                  >
                    {message}
                  </NoticeBox>
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
                      saving !==
                      "idle"
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
                      disabled:opacity-50
                    "
                  >
                    {saving ===
                    "draft" ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={16} />
                    )}

                    保存草稿
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving !==
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
                    {saving ===
                    "submit" ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <ShieldCheck
                        size={16}
                      />
                    )}

                    {form.status ===
                    "published"
                      ? "提交修改审核"
                      : "重新提交审核"}
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
                    REPORT STATUS
                  </p>

                  <h2
                    className="
                      mt-2
                      text-base
                      font-black
                      text-slate-950
                    "
                  >
                    当前报告
                  </h2>

                  <div className="mt-4 space-y-3">
                    <PreviewRow
                      label="状态"
                      value={getStatusLabel(
                        form.status
                      )}
                    />

                    <PreviewRow
                      label="类型"
                      value={
                        reportTypes.find(
                          (item) =>
                            item.value ===
                            form.reportType
                        )?.label ??
                        form.reportType
                      }
                    />

                    <PreviewRow
                      label="地区"
                      value={
                        form.prefecture
                      }
                    />

                    <PreviewRow
                      label="证据"
                      value={`${totalEvidence} 个`}
                    />

                    <PreviewRow
                      label="创建时间"
                      value={formatDate(
                        form.createdAt
                      )}
                    />
                  </div>
                </div>

                <div
                  className="
                    rounded-[24px]
                    border
                    border-blue-100
                    bg-blue-50
                    p-5
                  "
                >
                  <LockKeyhole
                    size={19}
                    className="text-blue-700"
                  />

                  <h3
                    className="
                      mt-3
                      text-sm
                      font-black
                      text-blue-950
                    "
                  >
                    私密材料继续私密
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-6
                      text-blue-900/80
                    "
                  >
                    编辑报告不会自动改变证据权限。
                    正式后端必须再次验证当前用户是否拥有这份报告。
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
                  <MessageSquareWarning
                    size={19}
                    className="text-amber-700"
                  />

                  <h3
                    className="
                      mt-3
                      text-sm
                      font-black
                      text-amber-950
                    "
                  >
                    修改后可能重新审核
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-6
                      text-amber-900/80
                    "
                  >
                    尤其是企业名称、
                    事件经过、金额、指控内容和新增证据发生变化时，
                    后端以后应该重新进行风险审核。
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
                saving !== "idle"
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
              {saving ===
              "draft" ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <Save size={15} />
              )}

              草稿
            </button>

            <button
              type="submit"
              disabled={
                saving !== "idle" ||
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
              {saving ===
              "submit" ? (
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
  title,
  description,
  children,
}: {
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

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
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

function IdentityCard({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        min-h-[105px]
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
        className="
          flex
          items-center
          gap-2
        "
      >
        <UserRound
          size={17}
          className={
            active
              ? "text-blue-600"
              : "text-slate-400"
          }
        />

        <p
          className="
            text-sm
            font-black
            text-slate-950
          "
        >
          {title}
        </p>
      </div>

      <p
        className="
          mt-2
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
    visibility: EvidenceVisibility
  ) => void;
}) {
  const name =
    item.kind === "local"
      ? item.file.name
      : item.name;

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
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            bg-slate-100
            text-slate-500
          "
        >
          {item.kind ===
            "local" &&
          item.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={
                item.previewUrl
              }
              alt=""
              className="
                h-full
                w-full
                object-cover
              "
            />
          ) : (
            <FileText size={18} />
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
            {name}
          </p>

          <div
            className="
              mt-1
              flex
              flex-wrap
              gap-2
            "
          >
            <span
              className="
                text-[10px]
                font-bold
                text-slate-400
              "
            >
              {item.kind ===
              "local"
                ? "新增文件"
                : "已有文件"}
            </span>

            {item.kind ===
              "existing" && (
              <EvidenceReviewBadge
                status={
                  item.reviewStatus
                }
              />
            )}
          </div>
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
          aria-label="移除证据"
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
              onChange={(
                event
              ) =>
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
                    key={
                      type.value
                    }
                    value={
                      type.value
                    }
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
            权限
          </p>

          <SelectWrap>
            <select
              value={
                item.visibility
              }
              onChange={(
                event
              ) =>
                onVisibilityChange(
                  event.target
                    .value as EvidenceVisibility
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
                允许制作脱敏摘要
              </option>
            </select>
          </SelectWrap>
        </div>
      </div>
    </div>
  );
}

function EvidenceReviewBadge({
  status,
}: {
  status:
    | "submitted"
    | "reviewed"
    | "rejected";
}) {
  if (status === "reviewed") {
    return (
      <span
        className="
          rounded-full
          bg-emerald-100
          px-2
          py-0.5
          text-[9px]
          font-black
          text-emerald-700
        "
      >
        已查看
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span
        className="
          rounded-full
          bg-rose-100
          px-2
          py-0.5
          text-[9px]
          font-black
          text-rose-700
        "
      >
        不可用
      </span>
    );
  }

  return (
    <span
      className="
        rounded-full
        bg-amber-100
        px-2
        py-0.5
        text-[9px]
        font-black
        text-amber-700
      "
    >
      待查看
    </span>
  );
}

function NoticeBox({
  tone,
  icon,
  title,
  children,
}: {
  tone:
    | "blue"
    | "amber"
    | "rose"
    | "emerald";
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  const className = {
    blue:
      "border-blue-200 bg-blue-50 text-blue-950",
    amber:
      "border-amber-200 bg-amber-50 text-amber-950",
    rose:
      "border-rose-200 bg-rose-50 text-rose-950",
    emerald:
      "border-emerald-200 bg-emerald-50 text-emerald-950",
  }[tone];

  return (
    <div
      className={`
        flex
        items-start
        gap-3
        rounded-2xl
        border
        p-4
        ${className}
      `}
    >
      <div className="mt-0.5 shrink-0">
        {icon}
      </div>

      <div>
        <p
          className="
            text-sm
            font-black
          "
        >
          {title}
        </p>

        <div
          className="
            mt-1
            text-xs
            leading-6
            opacity-80
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: PublishStatus;
}) {
  const config = {
    draft:
      "border-slate-400/20 bg-slate-400/10 text-slate-300",
    pending:
      "border-blue-400/20 bg-blue-400/10 text-blue-300",
    published:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    rejected:
      "border-rose-400/20 bg-rose-400/10 text-rose-300",
  };

  return (
    <span
      className={`
        rounded-full
        border
        px-3
        py-1.5
        text-xs
        font-black
        ${config[status]}
      `}
    >
      {getStatusLabel(status)}
    </span>
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
          max-w-[170px]
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
            text-rose-600
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
          正在读取报告...
        </p>
      </div>
    </main>
  );
}

function NotFoundPage() {
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
          "
        >
          <div
            className="
              max-w-md
              rounded-[26px]
              border
              border-slate-200
              bg-white
              p-8
              text-center
            "
          >
            <MessageSquareWarning
              size={28}
              className="
                mx-auto
                text-slate-400
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
              找不到这份报告
            </h1>

            <Link
              href="/account/posts"
              className="
                mt-6
                inline-flex
                min-h-11
                items-center
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
              返回我的发布
            </Link>
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

function getStatusLabel(
  status: PublishStatus
) {
  switch (status) {
    case "draft":
      return "草稿";
    case "pending":
      return "审核中";
    case "published":
      return "已公开";
    case "rejected":
      return "需修改";
  }
}

function formatDate(
  value: string
) {
  return value.replaceAll(
    "-",
    "."
  );
}