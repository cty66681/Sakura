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
  BookOpen,
  Check,
  CircleAlert,
  Clock3,
  FileText,
  Info,
  Loader2,
  MapPin,
  Save,
  Send,
  ShieldCheck,
  Tag,
  User,
} from "lucide-react";

import Container from "@/components/layout/Container";

type SaveAction = "draft" | "submit";

type ExperienceStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected";

interface ExperienceForm {
  title: string;
  category: string;
  prefecture: string;
  summary: string;
  content: string;
  authorName: string;
}

interface MockExperience {
  id: string;
  status: ExperienceStatus;
  form: ExperienceForm;
  tags: string[];
}

const categories = [
  "日本生活",
  "工作求职",
  "租房搬家",
  "留学升学",
  "签证手续",
  "税金年金",
  "银行金融",
  "医疗健康",
  "交通出行",
  "购物消费",
  "育儿家庭",
  "其他经验",
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

function createMockExperience(
  id: string
): MockExperience {
  return {
    id,
    status: "published",

    form: {
      title:
        "第一次在日本租房，我后来才知道的 8 件事",

      category: "租房搬家",

      prefecture: "东京",

      summary:
        "第一次在日本租房时，我对礼金、保证会社、退房费用都不太了解。这篇记录一下我实际租房后才知道的几个问题。",

      content: `【事情背景】

刚来日本的时候，我第一次自己找房。当时只关注房租多少钱，没有仔细看初期费用，也不知道保证会社、礼金、更新料这些东西具体是什么意思。

【实际过程】

后来真正签约以后才发现，除了房租之外，还有敷金、礼金、保证会社费用、火灾保险、换锁费用等。

有些房子虽然月租便宜，但是第一次付款的金额并不低。

我当时还没有注意退房清扫费用，后来搬家的时候才发现合同里面其实已经写得很清楚。

【后来怎么解决】

第二次找房的时候，我会先把所有初期费用列出来，然后再比较不同房源，而不是只比较房租。

另外，我也会提前确认更新料、退房费用以及短期解约违约金。

【给后来人的建议】

如果第一次在日本租房，签约之前一定要把合同里面不明白的费用问清楚。

特别是初期费用、更新费用、退房费用和短期解约条件。`,

      authorName:
        "东京生活第6年",
    },

    tags: [
      "日本租房",
      "东京生活",
      "初期费用",
    ],
  };
}

export default function EditExperiencePage() {
  const params =
    useParams<{ id: string }>();

  const experienceId = params.id;

  const [form, setForm] =
    useState<ExperienceForm | null>(
      null
    );

  const [status, setStatus] =
    useState<ExperienceStatus>(
      "draft"
    );

  const [tags, setTags] =
    useState<string[]>([]);

  const [tagInput, setTagInput] =
    useState("");

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

    async function loadExperience() {
      setLoading(true);
      setError("");

      try {
        // TODO [API - GET]
        // GET /api/me/experiences/:id
        // Purpose:
        // 获取当前登录用户自己的经验文章。
        // 后端必须验证：
        // experience.authorId === session.user.id

        /*
        const response = await fetch(
        `/api/me/experiences/${experienceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

        if (!response.ok) {
          throw new Error(
            "无法读取经验文章"
          );
        }

        const data =
          await response.json();
        */

        await new Promise(
          (resolve) => {
            window.setTimeout(
              resolve,
              300
            );
          }
        );

        const data =
          createMockExperience(
            experienceId
          );

        if (!active) {
          return;
        }

        setForm(data.form);
        setTags(data.tags);
        setStatus(data.status);
      } catch {
        if (active) {
          setError(
            "无法读取该经验文章。"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadExperience();

    return () => {
      active = false;
    };
  }, [experienceId]);

  const readingMinutes =
    useMemo(() => {
      if (!form) {
        return 0;
      }

      const length =
        form.content
          .replace(/\s/g, "")
          .length;

      if (length === 0) {
        return 0;
      }

      return Math.max(
        1,
        Math.ceil(length / 400)
      );
    }, [form]);

  function updateField<
    K extends keyof ExperienceForm
  >(
    key: K,
    value: ExperienceForm[K]
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

  function addTag() {
    const value =
      tagInput.trim();

    if (!value) {
      return;
    }

    if (tags.includes(value)) {
      setTagInput("");
      return;
    }

    if (tags.length >= 5) {
      setError(
        "最多可以添加 5 个标签。"
      );

      return;
    }

    setTags((current) => [
      ...current,
      value,
    ]);

    setTagInput("");
    setError("");
    setNotice("");
  }

  function removeTag(
    tag: string
  ) {
    setTags((current) =>
      current.filter(
        (item) => item !== tag
      )
    );

    setNotice("");
  }

  function validateForSubmit() {
    if (!form) {
      return "经验数据尚未加载。";
    }

    const title = form.title.trim();
    const summary = form.summary.trim();
    const content = form.content.trim();
    const authorName = form.authorName.trim();

    if (!title) {
      return "请输入经验标题。";
    }

    if (title.length > 80) {
      return "经验标题不能超过 80 个字符。";
    }

    if (!form.category) {
      return "请选择经验分类。";
    }

    if (!categories.includes(form.category)) {
      return "请选择有效的经验分类。";
    }

    if (!prefectures.includes(form.prefecture)) {
      return "请选择有效的相关地区。";
    }

    if (!summary) {
      return "请输入经验摘要。";
    }

    if (summary.length > 300) {
      return "经验摘要不能超过 300 个字符。";
    }

    if (!content) {
      return "请输入经验正文。";
    }

    if (content.length < 50) {
      return "经验正文至少填写 50 个字符。";
    }

    if (content.length > 5000) {
      return "经验正文不能超过 5000 个字符。";
    }

    if (tags.length > 5) {
      return "最多可以添加 5 个标签。";
    }

    if (
      tags.some(
        (tag) =>
          !tag.trim() ||
          tag.trim().length > 20
      )
    ) {
      return "每个标签必须为 1～20 个字符。";
    }

    if (!authorName) {
      return "请输入显示名称。";
    }

    if (authorName.length > 50) {
      return "显示名称不能超过 50 个字符。";
    }

    return "";
  }

  async function saveExperience(
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
        title:
          form.title.trim(),

        category:
          form.category,

        prefecture:
          form.prefecture,

        summary:
          form.summary.trim(),

        content:
          form.content.trim(),

        tags,

        authorName:
          form.authorName.trim(),

        status:
          action === "draft"
            ? ("draft" as const)
            : ("pending" as const),
      };

      // TODO [API - PATCH]
      // PATCH /api/me/experiences/:id
      // Purpose: 修改当前登录用户自己的经验文章。
      // Backend must verify ownership.
      // Purpose:
      // 修改当前用户自己的经验文章。
      // 后端必须验证 ownership。
      //
      // const response = await fetch(
      //   `/api/experiences/${experienceId}`,
      //   {
      //     method: "PATCH",
      //     headers: {
      //       "Content-Type":
      //         "application/json",
      //     },
      //     body: JSON.stringify(
      //       payload
      //     ),
      //   }
      // );
      //
      // if (!response.ok) {
      //   throw new Error(
      //     "修改经验失败"
      //   );
      // }

      console.log(
        "Mock update experience:",
        experienceId,
        payload
      );

      await new Promise(
        (resolve) => {
          window.setTimeout(
            resolve,
            400
          );
        }
      );

      if (action === "draft") {
        setStatus("draft");

        setNotice(
          "修改内容已保存为草稿。当前为 Mock 模式。"
        );
      } else {
        setStatus("pending");

        setNotice(
          "修改后的经验文章已重新提交审核。当前为 Mock 模式。"
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

    void saveExperience(
      "submit"
    );
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
                无法读取经验文章
              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                文章不存在，
                或者当前账号没有编辑权限。
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
            bg-emerald-500/15
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
                  border-emerald-400/20
                  bg-emerald-400/10
                  text-emerald-300
                "
              >
                <BookOpen
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
                    text-emerald-400
                  "
                >
                  EDIT EXPERIENCE
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
                  编辑在日经验
                </h1>

                <p
                  className="
                    mt-3
                    text-sm
                    text-slate-400
                  "
                >
                  文章 ID：
                  {experienceId}
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

              {status ===
                "published" && (
                <NoticeBox>
                  这篇经验目前已经公开。
                  修改完成后重新提交，
                  新内容将重新进入审核状态。
                </NoticeBox>
              )}

              {status ===
                "pending" && (
                <NoticeBox>
                  这篇经验正在审核中。
                  如果继续修改并重新提交，
                  审核内容将以最新版本为准。
                </NoticeBox>
              )}

              {status ===
                "rejected" && (
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
                    这篇经验之前未通过审核。
                    修改相关内容后可以重新提交。
                  </p>
                </div>
              )}

              {/* BASIC */}

              <FormSection
                title="基本信息"
                description="修改文章标题、分类和相关地区"
              >
                <Field
                  label="经验标题"
                  required
                  full
                >
                  <input
                    value={form.title}
                    onChange={(event) =>
                      updateField(
                        "title",
                        event.target.value
                      )
                    }
                    maxLength={80}
                    className={inputClass}
                  />

                  <CharacterCount
                    current={
                      form.title.length
                    }
                    max={80}
                  />
                </Field>

                <Field
                  label="经验分类"
                  required
                >
                  <div className="relative">
                    <FileText
                      size={17}
                      className={iconClass}
                    />

                    <select
                      value={
                        form.category
                      }
                      onChange={(event) =>
                        updateField(
                          "category",
                          event.target.value
                        )
                      }
                      className={`${selectClass} pl-11`}
                    >
                      <option value="">
                        请选择分类
                      </option>

                      {categories.map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </Field>

                <Field label="相关地区">
                  <div className="relative">
                    <MapPin
                      size={17}
                      className={iconClass}
                    />

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
                      className={`${selectClass} pl-11`}
                    >
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
                  </div>
                </Field>
              </FormSection>

              {/* SUMMARY */}

              <FormSection
                title="文章摘要"
                description="修改列表页展示的简短介绍"
                singleColumn
              >
                <Field
                  label="简短介绍"
                  required
                  full
                >
                  <textarea
                    value={
                      form.summary
                    }
                    onChange={(event) =>
                      updateField(
                        "summary",
                        event.target.value
                      )
                    }
                    rows={4}
                    maxLength={300}
                    className={`${inputClass} resize-none leading-7`}
                  />

                  <CharacterCount
                    current={
                      form.summary.length
                    }
                    max={300}
                  />
                </Field>
              </FormSection>

              {/* CONTENT */}

              <FormSection
                title="经验正文"
                description="修改文章的完整内容"
                singleColumn
              >
                <Field
                  label="正文内容"
                  required
                  full
                >
                  <textarea
                    value={
                      form.content
                    }
                    onChange={(event) =>
                      updateField(
                        "content",
                        event.target.value
                      )
                    }
                    rows={18}
                    maxLength={5000}
                    className={`${inputClass} min-h-[420px] resize-y leading-8`}
                  />

                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      justify-between
                      gap-4
                      text-xs
                      text-slate-400
                    "
                  >
                    <span>
                      最少 50 个字符
                    </span>

                    <span>
                      {
                        form.content
                          .length
                      } / 5000
                    </span>
                  </div>
                </Field>
              </FormSection>

              {/* TAG */}

              <FormSection
                title="文章标签"
                description="最多保留 5 个标签"
                singleColumn
              >
                <div>
                  <div
                    className="
                      flex
                      flex-col
                      gap-2
                      sm:flex-row
                    "
                  >
                    <div
                      className="
                        relative
                        flex-1
                      "
                    >
                      <Tag
                        size={17}
                        className={iconClass}
                      />

                      <input
                        value={tagInput}
                        onChange={(event) =>
                          setTagInput(
                            event.target
                              .value
                          )
                        }
                        onKeyDown={(
                          event
                        ) => {
                          if (
                            event.key ===
                            "Enter"
                          ) {
                            event.preventDefault();

                            addTag();
                          }
                        }}
                        maxLength={20}
                        placeholder="添加标签"
                        className={`${inputClass} pl-11`}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={addTag}
                      className="
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
                        hover:border-emerald-300
                        hover:text-emerald-700
                      "
                    >
                      添加标签
                    </button>
                  </div>

                  {tags.length > 0 && (
                    <div
                      className="
                        mt-4
                        flex
                        flex-wrap
                        gap-2
                      "
                    >
                      {tags.map(
                        (tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() =>
                              removeTag(
                                tag
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              border
                              border-emerald-100
                              bg-emerald-50
                              px-3
                              py-1.5
                              text-xs
                              font-bold
                              text-emerald-700
                              transition
                              hover:border-rose-200
                              hover:bg-rose-50
                              hover:text-rose-600
                            "
                          >
                            #{tag}
                            <span>×</span>
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </FormSection>

              {/* AUTHOR */}

              <FormSection
                title="发布者信息"
                description="修改文章公开显示的名称"
                singleColumn
              >
                <Field
                  label="显示名称"
                  required
                  full
                >
                  <div className="relative">
                    <User
                      size={17}
                      className={iconClass}
                    />

                    <input
                      value={
                        form.authorName
                      }
                      onChange={(event) =>
                        updateField(
                          "authorName",
                          event.target.value
                        )
                      }
                      maxLength={50}
                      className={`${inputClass} pl-11`}
                    />
                  </div>
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
                    p-5
                  "
                >
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
                        bg-emerald-50
                        px-2.5
                        py-1
                        text-[10px]
                        font-black
                        text-emerald-700
                      "
                    >
                      {form.category ||
                        "经验分类"}
                    </span>

                    {form.prefecture !==
                      "不限地区" && (
                      <span
                        className="
                          text-[11px]
                          font-bold
                          text-slate-400
                        "
                      >
                        {
                          form.prefecture
                        }
                      </span>
                    )}
                  </div>

                  <h3
                    className="
                      mt-4
                      line-clamp-3
                      text-lg
                      font-black
                      leading-7
                      text-slate-950
                    "
                  >
                    {form.title ||
                      "经验文章标题"}
                  </h3>

                  <p
                    className="
                      mt-3
                      line-clamp-4
                      text-sm
                      leading-6
                      text-slate-500
                    "
                  >
                    {form.summary ||
                      "文章摘要"}
                  </p>

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      justify-between
                      gap-3
                      border-t
                      border-slate-100
                      pt-4
                    "
                  >
                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-2
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
                          text-slate-500
                        "
                      >
                        <User
                          size={13}
                        />
                      </div>

                      <span
                        className="
                          truncate
                          text-xs
                          font-bold
                          text-slate-500
                        "
                      >
                        {form.authorName ||
                          "发布者"}
                      </span>
                    </div>

                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        gap-1
                        text-[11px]
                        text-slate-400
                      "
                    >
                      <Clock3
                        size={12}
                      />

                      {readingMinutes >
                      0
                        ? `${readingMinutes} 分钟`
                        : "--"}
                    </div>
                  </div>
                </div>

                {tags.length > 0 && (
                  <div
                    className="
                      mt-4
                      flex
                      flex-wrap
                      gap-1.5
                    "
                  >
                    {tags.map(
                      (tag) => (
                        <span
                          key={tag}
                          className="
                            rounded-full
                            bg-slate-100
                            px-2.5
                            py-1
                            text-[10px]
                            font-bold
                            text-slate-500
                          "
                        >
                          #{tag}
                        </span>
                      )
                    )}
                  </div>
                )}

                <div
                  className="
                    mt-5
                    rounded-2xl
                    bg-emerald-50
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
                        text-emerald-600
                      "
                    />

                    <p
                      className="
                        text-xs
                        leading-5
                        text-emerald-900/75
                      "
                    >
                      保存修改可以暂时变成草稿。
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
                      void saveExperience(
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
                      <Save
                        size={17}
                      />
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
                      bg-emerald-600
                      px-4
                      py-3
                      text-sm
                      font-black
                      text-white
                      shadow-lg
                      shadow-emerald-600/15
                      transition
                      hover:bg-emerald-700
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
                      <Send
                        size={17}
                      />
                    )}

                    重新提交审核
                  </button>
                </div>

                {status ===
                  "published" && (
                  <Link
                    href={`/experience/${experienceId}`}
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
                )}
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
                  <ShieldCheck
                    size={17}
                  />
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
                  正式上线后只有文章发布者本人和管理员可以修改这篇内容。
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
  status: ExperienceStatus;
}) {
  if (status === "draft") {
    return (
      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-600">
        草稿
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="rounded-full bg-amber-100 px-3 py-1.5 text-[11px] font-black text-amber-700">
        审核中
      </span>
    );
  }

  if (status === "published") {
    return (
      <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-black text-emerald-700">
        已发布
      </span>
    );
  }

  return (
    <span className="rounded-full bg-rose-100 px-3 py-1.5 text-[11px] font-black text-rose-700">
      未通过
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
  children: ReactNode;
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
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-lg font-black text-slate-950">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
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
  children: ReactNode;
}) {
  return (
    <div
      className={
        full
          ? "md:col-span-2"
          : ""
      }
    >
      <label className="mb-2 block text-sm font-black text-slate-700">
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

function CharacterCount({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  return (
    <p className="mt-2 text-right text-xs text-slate-400">
      {current} / {max}
    </p>
  );
}

function NoticeBox({
  children,
}: {
  children: ReactNode;
}) {
  return (
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

      <p className="text-sm font-semibold leading-6 text-amber-900">
        {children}
      </p>
    </div>
  );
}

function MessageBox({
  type,
  children,
}: {
  type: "error" | "success";
  children: ReactNode;
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

      <p className="text-sm font-semibold leading-6">
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
            text-emerald-600
          "
        />

        <p className="mt-3 text-sm font-bold text-slate-500">
          正在读取经验文章...
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
  focus:border-emerald-400
  focus:ring-4
  focus:ring-emerald-50
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
  focus:border-emerald-400
  focus:ring-4
  focus:ring-emerald-50
`;

const iconClass = `
  pointer-events-none
  absolute
  left-4
  top-1/2
  -translate-y-1/2
  text-slate-400
`;