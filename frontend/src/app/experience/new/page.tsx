"use client";

import Link from "next/link";
import {
  type FormEvent,
  type ReactNode,
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
  MapPin,
  Save,
  Send,
  ShieldCheck,
  Tag,
  User,
} from "lucide-react";

import Container from "@/components/layout/Container";

type PublishAction = "draft" | "submit";

interface ExperienceForm {
  title: string;
  category: string;
  prefecture: string;
  summary: string;
  content: string;
  authorName: string;
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

const initialForm: ExperienceForm = {
  title: "",
  category: "",
  prefecture: "不限地区",
  summary: "",
  content: "",
  authorName: "",
};

export default function NewExperiencePage() {
  const [form, setForm] =
    useState<ExperienceForm>(initialForm);

  const [tags, setTags] =
    useState<string[]>([]);

  const [tagInput, setTagInput] =
    useState("");

  const [error, setError] =
    useState("");

  const [notice, setNotice] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const readingMinutes = useMemo(() => {
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
  }, [form.content]);

  function updateField<
    K extends keyof ExperienceForm
  >(
    key: K,
    value: ExperienceForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

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
  }

  function removeTag(
    tag: string
  ) {
    setTags((current) =>
      current.filter(
        (item) => item !== tag
      )
    );
  }

  function validateForSubmit() {
    if (!form.title.trim()) {
      return "请输入经验标题。";
    }

    if (!form.category) {
      return "请选择经验分类。";
    }

    if (!form.summary.trim()) {
      return "请输入经验摘要。";
    }

    if (
      form.summary.trim().length >
      160
    ) {
      return "经验摘要请控制在 160 字以内。";
    }

    if (!form.content.trim()) {
      return "请输入经验正文。";
    }

    if (
      form.content.trim().length <
      50
    ) {
      return "经验正文至少填写 50 字。";
    }

    if (!form.authorName.trim()) {
      return "请输入显示名称。";
    }

    return "";
  }

  async function saveExperience(
    action: PublishAction
  ) {
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

      /*
      ================================================================
      TODO [API - POST]
      POST /api/experiences

      Purpose:
      创建当前登录用户的经验文章。

      const response = await fetch(
        "/api/experiences",
        {
          method: "POST",
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
          "发布经验失败"
        );
      }

      注意：
      authorId 必须由后端根据 Session 获取，
      不能信任前端传入的用户 ID。
      ================================================================
      */

      console.log(
        "Mock experience publish:",
        payload
      );

      await new Promise((resolve) => {
        window.setTimeout(
          resolve,
          350
        );
      });

      if (action === "draft") {
        setNotice(
          "经验草稿已保存。当前为 Mock 模式。"
        );
      } else {
        setNotice(
          "经验文章已提交审核。审核通过后会公开显示。当前为 Mock 模式。"
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
                <BookOpen size={22} />
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
                  NEW EXPERIENCE
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
                  分享在日经验
                </h1>

                <p
                  className="
                    mt-3
                    max-w-2xl
                    text-sm
                    leading-7
                    text-slate-400
                  "
                >
                  把真正有用的日本生活经验分享给后来的人。
                  可以是租房、求职、升学、手续，
                  也可以是一件你踩过坑之后才知道的事情。
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CONTENT */}

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

              {/* BASIC */}

              <FormSection
                title="基本信息"
                description="让读者一眼知道这篇经验在讲什么"
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
                    placeholder="例如：第一次在日本租房，我后来才知道的 8 件事"
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
                description="列表页会优先显示这段内容"
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
                    maxLength={160}
                    placeholder="用两三句话告诉读者，这篇文章能帮他解决什么问题。"
                    className={`${inputClass} resize-none leading-7`}
                  />

                  <CharacterCount
                    current={
                      form.summary.length
                    }
                    max={160}
                  />
                </Field>
              </FormSection>

              {/* CONTENT */}

              <FormSection
                title="经验正文"
                description="尽量写清楚事情经过、方法和最终结果"
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
                    placeholder={`可以参考这样的结构：

【事情背景】
我当时是什么情况，为什么会遇到这个问题。

【实际过程】
我做了什么，遇到了哪些问题。

【后来怎么解决】
最终用了什么方法。

【给后来人的建议】
如果你也遇到同样情况，可以提前注意什么。`}
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
                      最少建议 50 字
                    </span>

                    <span>
                      {
                        form.content
                          .length
                      }{" "}
                      字
                    </span>
                  </div>
                </Field>
              </FormSection>

              {/* TAGS */}

              <FormSection
                title="文章标签"
                description="添加最多 5 个标签，让用户更容易找到这篇经验"
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
                        placeholder="例如：日本租房"
                        maxLength={20}
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
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() =>
                            removeTag(tag)
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
                      ))}
                    </div>
                  )}
                </div>
              </FormSection>

              {/* AUTHOR */}

              <FormSection
                title="发布者信息"
                description="这里填写文章公开显示的名称"
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
                      placeholder="例如：东京生活第6年"
                      maxLength={30}
                      className={`${inputClass} pl-11`}
                    />
                  </div>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-5
                      text-slate-400
                    "
                  >
                    后端正式接入账号系统后，
                    实际用户身份会从登录 Session 获取，
                    不会信任前端传入的用户 ID。
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
                <h2
                  className="
                    font-black
                    text-slate-950
                  "
                >
                  文章预览
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
                      "经验文章标题会显示在这里"}
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
                      "文章摘要会显示在这里，让读者快速了解这篇经验的内容。"}
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
                        <User size={13} />
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
                      <Clock3 size={12} />

                      {readingMinutes > 0
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
                    {tags.map((tag) => (
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
                    ))}
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
                      保存草稿不会公开。
                      提交审核后，
                      审核通过的文章才会进入经验列表。
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
                  发布提醒
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
                    尽量分享自己真实经历，
                    不冒充官方机构或专业人士。
                  </p>

                  <p>
                    不公开身份证、银行卡、
                    私人电话、家庭住址等敏感信息。
                  </p>

                  <p>
                    涉及具体公司纠纷或诈骗举报的内容，
                    后续建议发布到「避坑」模块。
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
  children: ReactNode;
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
        mt-2
        text-right
        text-xs
        text-slate-400
      "
    >
      {current} / {max}
    </p>
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