"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Eye,
  FileText,
  Heart,
  Link2,
  Loader2,
  MapPin,
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

import Container from "@/components/layout/Container";

interface ExperienceDetail {
  id: number;
  title: string;
  summary: string;
  category: string;
  prefecture: string;
  authorName: string;
  publishTime: string;
  updatedTime?: string;
  views: number;
  readingMinutes: number;
  tags: string[];
  content: string;
}

interface RelatedExperience {
  id: number;
  title: string;
  summary: string;
  category: string;
  prefecture: string;
  authorName: string;
  publishTime: string;
  views: number;
  readingMinutes: number;
  tags: string[];
}

const FAVORITE_KEY =
  "sakura-experience-favorites";

const FAVORITE_EVENT =
  "sakura-experience-favorite-change";

const experiences: ExperienceDetail[] = [
  {
    id: 1,
    title:
      "第一次在日本租房，我后来才知道的 8 件事",
    summary:
      "第一次在日本租房时，我对礼金、保证会社、退房费用都不太了解。这篇记录一下我实际租房后才知道的几个问题。",
    category: "租房搬家",
    prefecture: "东京",
    authorName: "东京生活第6年",
    publishTime: "2026-08-28",
    updatedTime: "2026-08-29",
    views: 2358,
    readingMinutes: 6,
    tags: [
      "日本租房",
      "东京生活",
      "初期费用",
    ],
    content: `【事情背景】

刚来日本的时候，我第一次自己找房。当时最关心的就是每个月房租多少钱，觉得只要月租在预算以内就可以。

真正开始申请以后，我才发现日本租房并不是只看房租。敷金、礼金、保证会社、火灾保险、换锁费用、中介费等，加起来可能是一笔不小的金额。

【1. 房租便宜，不代表初期费用便宜】

我第一次看房时，特别容易被“月租便宜”吸引。

后来拿到初期费用明细才发现，有些房子的礼金、保证会社费用、中介费比较高，第一次付款的总金额并不低。

所以后来再找房，我都会直接问：

“初期费用全部加起来大概是多少钱？”

这样比只看房租更容易比较。

【2. 礼金基本上不会退回来】

当时我第一次看到礼金的时候，还以为和敷金差不多。

后来才知道，礼金通常是支付给房东的钱，退房的时候原则上不会返还。

如果预算比较紧，可以优先寻找“礼金0个月”或者“敷金礼金0”的房源。

不过也不能只看这一项，因为有些房子会在其他费用上增加金额。

【3. 保证会社费用也要算进预算】

很多房源需要加入保证会社。

我第一次租房的时候，完全没有把这笔钱算进预算。

保证会社的费用根据公司和合同不同会有区别，有些还会有每年或者每月的更新费用。

签约之前最好确认：

・第一次保证费用是多少
・以后有没有更新费用
・更新周期是多少

【4. 一定要确认短期解约违约金】

这个是我后来才特别注意的地方。

有些房源如果入住不到一年或者两年就退房，可能需要支付短期解约违约金。

如果自己的工作、学校或者生活地点还不稳定，这一条最好提前看清楚。

【5. 退房清扫费用最好签约前确认】

我第一次签约的时候，没有认真看退房清扫费用。

后来搬家时才发现合同里面其实已经写明了固定清扫费用。

所以现在我会提前确认：

・退房清扫费
・空调清扫费
・恢复原状相关费用

如果合同里有不理解的地方，我会在签字以前直接问清楚。

【6. 更新料不要忘记】

有些租赁合同两年更新一次。

更新时除了保险、保证会社等费用之外，也可能存在更新料。

如果准备长期居住，这部分也应该算进长期成本。

【7. 看房的时候拍照很有用】

入住之前，如果墙壁、地板、门、设备已经存在划痕或者损坏，我现在都会拍照保存。

如果管理会社有入住确认表，也会认真填写。

这样退房的时候比较容易说明哪些问题是在入住以前就存在的。

【8. 不懂的地方不要不好意思问】

这是我觉得最重要的一点。

第一次在日本租房时，因为很多词看不懂，我有时候会觉得一直问中介很麻烦。

后来发现，合同一旦签了，很多事情就是按照合同执行。

所以真正重要的不是“赶快签下来”，而是在签约以前把自己不理解的费用和条件全部确认清楚。

【给后来人的建议】

如果你也是第一次在日本租房，我建议至少把下面几项单独列出来比较：

・每月房租
・管理费
・敷金
・礼金
・保证会社费用
・中介费
・火灾保险
・换锁费用
・更新料
・短期解约违约金
・退房清扫费用

把这些费用放在一起看，再决定哪套房真正适合自己。

这只是我自己的实际租房经验，不同房屋、管理会社和合同的条件都会不同。最终还是以你实际签署的租赁合同为准。`,
  },
  {
    id: 2,
    title:
      "日本 IT 求职，从投简历到拿到 Offer 的完整过程",
    summary:
      "整理一下我在日本找 IT 工作时实际经历过的流程，包括简历、面试、薪资沟通以及入职前需要确认的问题。",
    category: "工作求职",
    prefecture: "东京",
    authorName: "在日程序员",
    publishTime: "2026-08-26",
    views: 3241,
    readingMinutes: 8,
    tags: [
      "日本IT",
      "求职",
      "面试",
    ],
    content: `【开始找工作】

我当时主要通过招聘网站和朋友介绍寻找日本 IT 工作。

最开始投简历的时候，我发现日本企业比较重视工作经历的具体内容，所以后来重新整理了职务经历书。

【准备材料】

我主要准备了履历书和职务经历书。

职务经历书里面没有只写“负责 Python 开发”，而是尽量写清楚项目是什么、自己负责什么、使用什么技术以及最后完成了什么。

【面试】

不同公司的流程不一样。

我遇到过一次面试结束的，也遇到过需要两到三次面试的。

技术问题之外，日语沟通、离职理由、未来计划也经常会被问到。

【拿到 Offer 以后】

我没有马上只看工资，而是一起确认了雇佣形式、加班、休日、试用期和工作地点。

这是我觉得比较重要的一点。

最终条件还是应该以企业提供的劳动条件通知书和正式合同为准。`,
  },
  {
    id: 3,
    title:
      "搬到大阪以后，我才发现生活成本和东京差这么多",
    summary:
      "从东京搬到大阪生活半年以后，整理房租、交通、吃饭以及日常生活成本方面比较明显的区别。",
    category: "日本生活",
    prefecture: "大阪",
    authorName: "关西生活中",
    publishTime: "2026-08-24",
    views: 1786,
    readingMinutes: 5,
    tags: [
      "大阪生活",
      "生活成本",
      "搬家",
    ],
    content: `从东京搬到大阪以后，我最明显的感受还是房租。

当然区域和房屋条件不同，不能简单说大阪一定比东京便宜，但在我自己的预算范围内，同样价格能选择的房子明显更多。

交通和吃饭方面也有一些区别，不过最终生活成本还是和自己的生活方式关系很大。

如果准备跨城市搬家，我建议不要只比较房租，也把通勤时间、交通费和附近生活设施一起考虑。`,
  },
  {
    id: 4,
    title:
      "日本银行卡怎么选？我实际用过的几个账户",
    summary:
      "不是做银行排名，而是从工资收取、转账、ATM、信用卡绑定这些实际使用场景讲一下自己的经验。",
    category: "银行金融",
    prefecture: "不限地区",
    authorName: "普通上班族",
    publishTime: "2026-08-20",
    views: 2864,
    readingMinutes: 7,
    tags: [
      "日本银行",
      "银行卡",
      "生活经验",
    ],
    content: `我在日本生活以后陆续使用过几个银行账户。

后来发现并不存在一个账户适合所有场景。

工资收取、房租自动扣款、信用卡绑定、ATM 手续费和转账费用，都可能影响实际使用体验。

我的做法是保留一个主要账户，再根据需要使用其他账户。

银行服务和手续费可能发生变化，所以具体条件还是应该查看银行当时公布的信息。`,
  },
  {
    id: 5,
    title:
      "专门学校毕业后在日本找工作的几个现实问题",
    summary:
      "学校推荐求人不一定适合所有人。分享一下毕业前准备、企业选择以及第一份工作时我比较后悔没有提前确认的事情。",
    category: "留学升学",
    prefecture: "东京",
    authorName: "毕业第4年",
    publishTime: "2026-08-18",
    views: 1560,
    readingMinutes: 6,
    tags: [
      "专门学校",
      "毕业求职",
      "留学生",
    ],
    content: `毕业前找工作的时候，我最开始比较依赖学校提供的求人。

后来发现学校推荐当然有帮助，但自己也应该主动了解企业。

尤其是仕事内容、勤務地、給与、休日和雇佣形式，最好在入职以前确认。

如果准备毕业后留在日本工作，也应该提前了解自己的专业和计划从事的工作之间是否匹配。`,
  },
  {
    id: 6,
    title:
      "在日本搬家之后，这些地址变更别忘了做",
    summary:
      "搬家不只是去区役所迁出迁入。银行卡、手机、驾照、公司、邮局等地址也最好一次整理清楚。",
    category: "日本生活",
    prefecture: "神奈川",
    authorName: "横滨居住中",
    publishTime: "2026-08-15",
    views: 1988,
    readingMinutes: 4,
    tags: [
      "搬家",
      "地址变更",
      "日本生活",
    ],
    content: `我第一次搬家的时候，以为去区役所办完手续基本就结束了。

后来才发现银行卡、手机、公司登记信息以及各种服务也可能需要修改地址。

所以第二次搬家时，我提前做了一张清单，每完成一项就打勾。

不同人的情况不一样，实际需要办理的项目也会不同。`,
  },
  {
    id: 7,
    title:
      "第一次自己去区役所办手续，其实没有想象中那么难",
    summary:
      "分享第一次独自办理住民票、印鉴登记等手续的过程，以及日语不太熟时可以提前准备的东西。",
    category: "签证手续",
    prefecture: "埼玉",
    authorName: "生活慢慢来",
    publishTime: "2026-08-12",
    views: 947,
    readingMinutes: 5,
    tags: [
      "区役所",
      "住民票",
      "手续",
    ],
    content: `第一次自己去区役所的时候，我也比较紧张。

后来发现提前把自己要办理的事项写下来，会方便很多。

不知道窗口在哪里时，可以直接向入口附近的工作人员询问。

不同自治体的流程可能不同，所以最好提前查看所在地自治体公布的信息。`,
  },
  {
    id: 8,
    title:
      "在日本看病前最好先知道的几个小细节",
    summary:
      "预约、保险证、初诊费、处方药局这些事情第一次接触会有点乱，记录一下自己的实际经验。",
    category: "医疗健康",
    prefecture: "爱知",
    authorName: "名古屋生活",
    publishTime: "2026-08-10",
    views: 1315,
    readingMinutes: 5,
    tags: [
      "日本看病",
      "医疗",
      "生活经验",
    ],
    content: `第一次自己在日本看病的时候，我最不习惯的是医院和药局可能是分开的。

有些医院需要预约，有些可以直接去。

我后来习惯在出发以前先确认医院的受付时间、是否需要预约以及需要携带什么。

医疗问题应该以医生和医疗机构的专业意见为准，这里只是分享自己的就诊流程经验。`,
  },
  {
    id: 9,
    title:
      "日本公司入职第一周，我建议提前准备这些东西",
    summary:
      "从服装、交通路线、印章，到公司常用的沟通方式，整理第一次进入日本公司时容易忽略的细节。",
    category: "工作求职",
    prefecture: "东京",
    authorName: "会社员日记",
    publishTime: "2026-08-08",
    views: 2267,
    readingMinutes: 6,
    tags: [
      "日本公司",
      "入职",
      "职场",
    ],
    content: `第一次进入日本公司以前，我提前确认了上班时间和路线。

第一周最重要的并不是马上把所有工作学会，而是先了解公司的沟通方式、内部规则和工作流程。

如果不知道某件事情应该怎么做，我后来会尽量早点确认，而不是自己猜很久。

不同企业文化差异很大，所以这只是我的个人经历。`,
  },
];

export default function ExperienceDetailPage() {
  const params =
    useParams<{ id: string }>();

  const experienceId = Number(
    params.id
  );

  const [loading, setLoading] =
    useState(true);

  const [experience, setExperience] =
    useState<ExperienceDetail | null>(
      null
    );

  const [favorite, setFavorite] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [shareNotice, setShareNotice] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadExperience() {
      setLoading(true);

      try {
        // TODO [API - GET]
        // GET /api/experiences/:id
        // Purpose:
        // 获取已经审核通过并公开的经验详情。
        // 后端只能返回 status === "published" 的文章。

        /*
        const response = await fetch(
          `/api/experiences/${params.id}`
        );

        if (!response.ok) {
          throw new Error(
            "Experience not found"
          );
        }

        const data =
          await response.json();
        */

        await new Promise(
          (resolve) => {
            window.setTimeout(
              resolve,
              250
            );
          }
        );

        const data =
          experiences.find(
            (item) =>
              item.id ===
              experienceId
          );

        if (!active) {
          return;
        }

        setExperience(
          data ?? null
        );
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
  }, [experienceId, params.id]);

  useEffect(() => {
    if (
      !Number.isFinite(
        experienceId
      )
    ) {
      return;
    }

    const favorites =
      readFavoriteIds();

    setFavorite(
      favorites.includes(
        experienceId
      )
    );
  }, [experienceId]);

  useEffect(() => {
    function handleFavoriteChange() {
      const favorites =
        readFavoriteIds();

      setFavorite(
        favorites.includes(
          experienceId
        )
      );
    }

    window.addEventListener(
      FAVORITE_EVENT,
      handleFavoriteChange
    );

    window.addEventListener(
      "storage",
      handleFavoriteChange
    );

    return () => {
      window.removeEventListener(
        FAVORITE_EVENT,
        handleFavoriteChange
      );

      window.removeEventListener(
        "storage",
        handleFavoriteChange
      );
    };
  }, [experienceId]);

  const relatedExperiences =
    useMemo(() => {
      if (!experience) {
        return [];
      }

      const scored =
        experiences
          .filter(
            (item) =>
              item.id !==
              experience.id
          )
          .map((item) => {
            let score = 0;

            if (
              item.category ===
              experience.category
            ) {
              score += 4;
            }

            if (
              item.prefecture ===
              experience.prefecture
            ) {
              score += 2;
            }

            const sharedTags =
              item.tags.filter(
                (tag) =>
                  experience.tags.includes(
                    tag
                  )
              ).length;

            score += sharedTags * 3;

            return {
              item,
              score,
            };
          })
          .sort((a, b) => {
            if (
              b.score !== a.score
            ) {
              return (
                b.score -
                a.score
              );
            }

            return (
              new Date(
                b.item.publishTime
              ).getTime() -
              new Date(
                a.item.publishTime
              ).getTime()
            );
          });

      return scored
        .slice(0, 3)
        .map(
          (entry) => entry.item
        );
    }, [experience]);

  function toggleFavorite() {
    if (!experience) {
      return;
    }

    const current =
      readFavoriteIds();

    const exists =
      current.includes(
        experience.id
      );

    const next = exists
      ? current.filter(
          (id) =>
            id !== experience.id
        )
      : [
          ...current,
          experience.id,
        ];

    window.localStorage.setItem(
      FAVORITE_KEY,
      JSON.stringify(next)
    );

    setFavorite(!exists);

    window.dispatchEvent(
      new Event(FAVORITE_EVENT)
    );

    // TODO [API - POST]
    // POST /api/me/favorites
    // Purpose:
    // 收藏经验文章。
    //
    // TODO [API - DELETE]
    // DELETE /api/me/favorites/experience/:id
    // Purpose:
    // 取消收藏经验文章。
    //
    // 正式接入账号系统后，
    // 根据 exists 决定调用收藏或取消收藏接口。
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      setCopied(true);
      setShareNotice(
        "链接已复制"
      );

      window.setTimeout(() => {
        setCopied(false);
        setShareNotice("");
      }, 1800);
    } catch {
      setShareNotice(
        "复制失败，请手动复制浏览器地址。"
      );
    }
  }

  async function shareExperience() {
    if (!experience) {
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title:
            experience.title,
          text:
            experience.summary,
          url:
            window.location.href,
        });

        return;
      } catch {
        return;
      }
    }

    await copyLink();
  }

  if (loading) {
    return <LoadingPage />;
  }

  if (!experience) {
    return <NotFoundPage />;
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
              href="/experience"
              className="
                shrink-0
                transition
                hover:text-slate-900
              "
            >
              在日经验
            </Link>

            <ChevronRight
              size={13}
              className="shrink-0"
            />

            <span
              className="
                truncate
                text-slate-600
              "
            >
              {experience.title}
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
            -top-40
            h-[520px]
            w-[520px]
            rounded-full
            bg-emerald-500/15
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-60
            right-0
            h-[520px]
            w-[520px]
            rounded-full
            bg-cyan-500/10
            blur-3xl
          "
        />

        <Container>
          <div
            className="
              relative
              px-4
              py-12
              sm:py-16
            "
          >
            <Link
              href="/experience"
              className="
                inline-flex
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
              返回经验列表
            </Link>

            <div
              className="
                mt-8
                max-w-4xl
              "
            >
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2.5
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-emerald-400/20
                    bg-emerald-400/10
                    px-3
                    py-1.5
                    text-xs
                    font-black
                    text-emerald-300
                  "
                >
                  <Sparkles
                    size={13}
                  />
                  {
                    experience.category
                  }
                </span>

                {experience.prefecture !==
                  "不限地区" && (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      text-xs
                      font-bold
                      text-slate-400
                    "
                  >
                    <MapPin
                      size={13}
                    />
                    {
                      experience.prefecture
                    }
                  </span>
                )}
              </div>

              <h1
                className="
                  mt-6
                  max-w-4xl
                  text-3xl
                  font-black
                  leading-tight
                  tracking-tight
                  text-white
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                {experience.title}
              </h1>

              <p
                className="
                  mt-5
                  max-w-3xl
                  text-sm
                  leading-7
                  text-slate-400
                  sm:text-base
                  sm:leading-8
                "
              >
                {experience.summary}
              </p>

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  items-center
                  gap-x-5
                  gap-y-3
                  text-xs
                  font-semibold
                  text-slate-400
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                  "
                >
                  <User size={14} />
                  {
                    experience.authorName
                  }
                </span>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                  "
                >
                  <Clock3
                    size={14}
                  />
                  {
                    experience.readingMinutes
                  }{" "}
                  分钟阅读
                </span>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                  "
                >
                  <Eye size={14} />
                  {formatViews(
                    experience.views
                  )}{" "}
                  浏览
                </span>

                <span>
                  发布于{" "}
                  {formatDate(
                    experience.publishTime
                  )}
                </span>
              </div>
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
            {/* ARTICLE */}

            <article
              className="
                min-w-0
                rounded-[28px]
                border
                border-slate-200
                bg-white
                shadow-sm
              "
            >
              {/* ARTICLE TOP */}

              <div
                className="
                  flex
                  flex-col
                  gap-4
                  border-b
                  border-slate-100
                  px-5
                  py-5
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  sm:px-8
                "
              >
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
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-emerald-50
                      text-emerald-700
                    "
                  >
                    <User size={17} />
                  </div>

                  <div>
                    <p
                      className="
                        text-sm
                        font-black
                        text-slate-900
                      "
                    >
                      {
                        experience.authorName
                      }
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[11px]
                        font-semibold
                        text-slate-400
                      "
                    >
                      Sakura 用户经验分享
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <button
                    type="button"
                    onClick={
                      toggleFavorite
                    }
                    className={`
                      inline-flex
                      h-10
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      px-3.5
                      text-xs
                      font-black
                      transition
                      ${
                        favorite
                          ? "border-rose-200 bg-rose-50 text-rose-600"
                          : "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:text-rose-600"
                      }
                    `}
                  >
                    <Heart
                      size={16}
                      className={
                        favorite
                          ? "fill-current"
                          : ""
                      }
                    />

                    {favorite
                      ? "已收藏"
                      : "收藏"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void shareExperience()
                    }
                    className="
                      inline-flex
                      h-10
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-3.5
                      text-xs
                      font-black
                      text-slate-600
                      transition
                      hover:border-emerald-200
                      hover:text-emerald-700
                    "
                  >
                    <Share2
                      size={16}
                    />
                    分享
                  </button>
                </div>
              </div>

              {/* BODY */}

              <div
                className="
                  px-5
                  py-7
                  sm:px-8
                  sm:py-9
                "
              >
                <div
                  className="
                    rounded-[20px]
                    border
                    border-emerald-100
                    bg-emerald-50/70
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
                    <BookOpen
                      size={18}
                      className="
                        mt-0.5
                        shrink-0
                        text-emerald-700
                      "
                    />

                    <div>
                      <p
                        className="
                          text-xs
                          font-black
                          uppercase
                          tracking-[0.12em]
                          text-emerald-700
                        "
                      >
                        文章摘要
                      </p>

                      <p
                        className="
                          mt-2
                          text-sm
                          font-semibold
                          leading-7
                          text-emerald-950/80
                        "
                      >
                        {
                          experience.summary
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <ExperienceContent
                  content={
                    experience.content
                  }
                />

                {/* TAGS */}

                <div
                  className="
                    mt-10
                    border-t
                    border-slate-100
                    pt-6
                  "
                >
                  <p
                    className="
                      text-xs
                      font-black
                      text-slate-400
                    "
                  >
                    相关标签
                  </p>

                  <div
                    className="
                      mt-3
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    {experience.tags.map(
                      (tag) => (
                        <Link
                          key={tag}
                          href={`/experience?q=${encodeURIComponent(
                            tag
                          )}`}
                          className="
                            rounded-full
                            border
                            border-slate-200
                            bg-slate-50
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            text-slate-600
                            transition
                            hover:border-emerald-200
                            hover:bg-emerald-50
                            hover:text-emerald-700
                          "
                        >
                          #{tag}
                        </Link>
                      )
                    )}
                  </div>
                </div>

                {/* DISCLAIMER */}

                <div
                  className="
                    mt-8
                    rounded-[20px]
                    border
                    border-amber-200
                    bg-amber-50
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
                    <ShieldCheck
                      size={18}
                      className="
                        mt-0.5
                        shrink-0
                        text-amber-700
                      "
                    />

                    <div>
                      <h3
                        className="
                          text-sm
                          font-black
                          text-amber-950
                        "
                      >
                        阅读提醒
                      </h3>

                      <p
                        className="
                          mt-2
                          text-xs
                          leading-6
                          text-amber-900/75
                        "
                      >
                        本文为用户分享的个人经验，
                        不代表 Sakura
                        对所有情况作出保证。
                        法律、签证、医疗、税务、
                        合同等重要事项可能因个人情况和时间发生变化，
                        请以相关机构、专业人士或正式文件的信息为准。
                      </p>
                    </div>
                  </div>
                </div>

                {/* UPDATED */}

                <div
                  className="
                    mt-6
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                    text-[11px]
                    font-semibold
                    text-slate-400
                  "
                >
                  <span>
                    发布：
                    {formatDate(
                      experience.publishTime
                    )}
                  </span>

                  {experience.updatedTime && (
                    <span>
                      最后更新：
                      {formatDate(
                        experience.updatedTime
                      )}
                    </span>
                  )}
                </div>
              </div>
            </article>

            {/* SIDEBAR */}

            <aside
              className="
                h-fit
                space-y-4
                xl:sticky
                xl:top-24
              "
            >
              {/* ACTION */}

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
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-emerald-600
                  "
                >
                  ARTICLE
                </p>

                <h2
                  className="
                    mt-2
                    text-lg
                    font-black
                    text-slate-950
                  "
                >
                  觉得有用？
                </h2>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-5
                    text-slate-500
                  "
                >
                  可以收藏下来，
                  以后在个人中心继续查看。
                </p>

                <button
                  type="button"
                  onClick={
                    toggleFavorite
                  }
                  className={`
                    mt-5
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    px-4
                    py-3
                    text-sm
                    font-black
                    transition
                    ${
                      favorite
                        ? "border-rose-200 bg-rose-50 text-rose-600"
                        : "border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:text-rose-600"
                    }
                  `}
                >
                  <Bookmark
                    size={17}
                    className={
                      favorite
                        ? "fill-current"
                        : ""
                    }
                  />

                  {favorite
                    ? "已加入收藏"
                    : "收藏这篇经验"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void copyLink()
                  }
                  className="
                    mt-2
                    inline-flex
                    w-full
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
                    transition
                    hover:bg-slate-800
                  "
                >
                  {copied ? (
                    <Check size={17} />
                  ) : (
                    <Link2 size={17} />
                  )}

                  {copied
                    ? "链接已复制"
                    : "复制文章链接"}
                </button>

                {shareNotice && (
                  <p
                    className="
                      mt-3
                      text-center
                      text-xs
                      font-bold
                      text-emerald-600
                    "
                  >
                    {shareNotice}
                  </p>
                )}
              </div>

              {/* AUTHOR */}

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
                      rounded-full
                      bg-emerald-50
                      text-emerald-700
                    "
                  >
                    <User size={18} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-sm
                        font-black
                        text-slate-950
                      "
                    >
                      {
                        experience.authorName
                      }
                    </p>

                    <p
                      className="
                        mt-1
                        text-[11px]
                        font-semibold
                        text-slate-400
                      "
                    >
                      Sakura 经验分享者
                    </p>
                  </div>
                </div>

                <p
                  className="
                    mt-4
                    text-xs
                    leading-6
                    text-slate-500
                  "
                >
                  内容来自用户的实际生活经验。
                  请结合自己的情况判断是否适用。
                </p>
              </div>

              {/* PUBLISH */}

              <div
                className="
                  overflow-hidden
                  rounded-[24px]
                  bg-slate-950
                  p-5
                  text-white
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
                    bg-emerald-400/10
                    text-emerald-300
                  "
                >
                  <BookOpen
                    size={18}
                  />
                </div>

                <h2
                  className="
                    mt-4
                    text-lg
                    font-black
                  "
                >
                  你也有经验想分享？
                </h2>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-6
                    text-slate-400
                  "
                >
                  把自己真正经历过的事情写下来，
                  也许正好能帮到另一个人。
                </p>

                <Link
                  href="/experience/new"
                  className="
                    mt-5
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-emerald-500
                    px-4
                    py-3
                    text-sm
                    font-black
                    text-slate-950
                    transition
                    hover:bg-emerald-400
                  "
                >
                  分享我的经验
                  <ArrowRight
                    size={15}
                  />
                </Link>
              </div>

              {/* REPORT */}

              <div
                className="
                  rounded-[22px]
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
                  <MessageCircle
                    size={17}
                    className="
                      mt-0.5
                      shrink-0
                      text-slate-400
                    "
                  />

                  <div>
                    <p
                      className="
                        text-xs
                        font-black
                        text-slate-700
                      "
                    >
                      发现内容有问题？
                    </p>

                    <p
                      className="
                        mt-1.5
                        text-[11px]
                        leading-5
                        text-slate-400
                      "
                    >
                      后续接入举报和内容纠错系统后，
                      用户可以提交错误信息、隐私问题或违规内容。
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* RELATED */}

      {relatedExperiences.length >
        0 && (
        <section
          className="
            border-t
            border-slate-200
            bg-white
            py-12
          "
        >
          <Container>
            <div className="px-4">
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-end
                  sm:justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-xs
                      font-black
                      uppercase
                      tracking-[0.14em]
                      text-emerald-600
                    "
                  >
                    RELATED
                  </p>

                  <h2
                    className="
                      mt-1
                      text-2xl
                      font-black
                      tracking-tight
                      text-slate-950
                    "
                  >
                    你可能还想看
                  </h2>
                </div>

                <Link
                  href="/experience"
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    text-xs
                    font-black
                    text-slate-500
                    transition
                    hover:text-emerald-700
                  "
                >
                  查看全部经验
                  <ArrowRight
                    size={14}
                  />
                </Link>
              </div>

              <div
                className="
                  mt-6
                  grid
                  gap-5
                  md:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {relatedExperiences.map(
                  (item) => (
                    <RelatedCard
                      key={item.id}
                      experience={item}
                    />
                  )
                )}
              </div>
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}

function ExperienceContent({
  content,
}: {
  content: string;
}) {
  const blocks =
    content
      .split("\n")
      .map((line) =>
        line.trim()
      );

  return (
    <div
      className="
        mt-9
        text-[15px]
        leading-8
        text-slate-700
        sm:text-base
        sm:leading-9
      "
    >
      {blocks.map(
        (line, index) => {
          if (!line) {
            return (
              <div
                key={`space-${index}`}
                className="h-4"
              />
            );
          }

          if (
            line.startsWith(
              "【"
            ) &&
            line.endsWith(
              "】"
            )
          ) {
            return (
              <h2
                key={`heading-${index}`}
                className="
                  mb-3
                  mt-7
                  text-xl
                  font-black
                  tracking-tight
                  text-slate-950
                  first:mt-0
                  sm:text-2xl
                "
              >
                {line.slice(
                  1,
                  -1
                )}
              </h2>
            );
          }

          if (
            /^・/.test(line)
          ) {
            return (
              <div
                key={`list-${index}`}
                className="
                  my-1
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  bg-slate-50
                  px-4
                  py-2.5
                "
              >
                <span
                  className="
                    mt-[13px]
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    bg-emerald-500
                  "
                />

                <span>
                  {line.replace(
                    /^・/,
                    ""
                  )}
                </span>
              </div>
            );
          }

          return (
            <p
              key={`paragraph-${index}`}
              className="my-3"
            >
              {line}
            </p>
          );
        }
      )}
    </div>
  );
}

function RelatedCard({
  experience,
}: {
  experience: RelatedExperience;
}) {
  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        rounded-[22px]
        border
        border-slate-200
        bg-white
        p-5
        transition
        hover:-translate-y-1
        hover:border-emerald-200
        hover:shadow-lg
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
          {experience.category}
        </span>

        {experience.prefecture !==
          "不限地区" && (
          <span
            className="
              inline-flex
              items-center
              gap-1
              text-[10px]
              font-bold
              text-slate-400
            "
          >
            <MapPin size={11} />
            {
              experience.prefecture
            }
          </span>
        )}
      </div>

      <Link
        href={`/experience/${experience.id}`}
        className="mt-4 block"
      >
        <h3
          className="
            line-clamp-2
            text-base
            font-black
            leading-6
            text-slate-950
            transition
            group-hover:text-emerald-700
          "
        >
          {experience.title}
        </h3>
      </Link>

      <p
        className="
          mt-3
          line-clamp-3
          text-xs
          leading-6
          text-slate-500
        "
      >
        {experience.summary}
      </p>

      <div
        className="
          mt-auto
          flex
          items-center
          justify-between
          gap-3
          border-t
          border-slate-100
          pt-4
        "
      >
        <span
          className="
            inline-flex
            items-center
            gap-1
            text-[10px]
            font-semibold
            text-slate-400
          "
        >
          <Eye size={11} />
          {formatViews(
            experience.views
          )}
        </span>

        <Link
          href={`/experience/${experience.id}`}
          className="
            inline-flex
            items-center
            gap-1
            text-[11px]
            font-black
            text-emerald-700
          "
        >
          阅读
          <ArrowRight
            size={12}
          />
        </Link>
      </div>
    </article>
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

        <p
          className="
            mt-3
            text-sm
            font-bold
            text-slate-500
          "
        >
          正在读取经验文章...
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
                text-slate-400
              "
            >
              <FileText
                size={23}
              />
            </div>

            <h1
              className="
                mt-5
                text-xl
                font-black
                text-slate-950
              "
            >
              找不到这篇经验
            </h1>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-slate-500
              "
            >
              文章可能不存在、
              尚未通过审核，
              或者已经被删除。
            </p>

            <Link
              href="/experience"
              className="
                mt-6
                inline-flex
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
                transition
                hover:bg-slate-800
              "
            >
              <ArrowLeft
                size={15}
              />
              返回经验列表
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}

function readFavoriteIds(): number[] {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  try {
    const raw =
      window.localStorage.getItem(
        FAVORITE_KEY
      );

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (value): value is number =>
        typeof value ===
          "number" &&
        Number.isFinite(value)
    );
  } catch {
    return [];
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

function formatViews(
  value: number
) {
  if (value >= 10000) {
    return `${(
      value / 10000
    ).toFixed(1)}万`;
  }

  if (value >= 1000) {
    return `${(
      value / 1000
    ).toFixed(1)}k`;
  }

  return value.toString();
}