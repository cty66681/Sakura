"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  BadgeCheck,
  Heart,
  MessageSquare,
  Send,
  Star,
  ThumbsUp,
  UserRound,
} from "lucide-react";

import Card from "@/components/ui/Card/Card";

export type CollegeReviewData = {
  id: string;
  name: string;
  rating: number;

  category:
    | "IT・AI"
    | "设计・动漫"
    | "商务・观光"
    | "美容・时尚"
    | "医疗・福祉"
    | "汽车・技术";
};

interface Props {
  school: CollegeReviewData;
}

type Review = {
  id: string;
  userName: string;
  nationality: string;
  course: string;
  year: string;
  rating: number;
  content: string;
  likes: number;
  createdAt: string;
  verified: boolean;
};

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 正式后端完成后：
|
| GET /api/colleges/:id/reviews
|
| Query:
|
| ?page=1
| &sort=latest
|
| 用于获取学校评价列表。
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| TODO [API - POST]
|--------------------------------------------------------------------------
|
| 用户提交评价：
|
| POST /api/colleges/:id/reviews
|
| Body:
|
| {
|   rating: number;
|   content: string;
|   course?: string;
| }
|
| 当前使用本地 state。
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| TODO [API - POST / DELETE]
|--------------------------------------------------------------------------
|
| 点赞评价：
|
| POST /api/college-reviews/:reviewId/like
|
| 取消点赞：
|
| DELETE /api/college-reviews/:reviewId/like
|
| 当前使用本地 state。
|
|--------------------------------------------------------------------------
*/

export default function CollegeReview({
  school,
}: Props) {
  const initialReviews =
    useMemo(
      () =>
        getMockReviews(
          school
        ),
      [school]
    );

  const [reviews, setReviews] =
    useState<Review[]>(
      initialReviews
    );

  const [likedReviews, setLikedReviews] =
    useState<string[]>([]);

  const [rating, setRating] =
    useState(5);

  const [hoverRating, setHoverRating] =
    useState<number | null>(
      null
    );

  const [content, setContent] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (total, review) =>
            total +
            review.rating,
          0
        ) / reviews.length
      : school.rating;

  const ratingStats = [
    5,
    4,
    3,
    2,
    1,
  ].map((star) => {
    const count =
      reviews.filter(
        (review) =>
          review.rating ===
          star
      ).length;

    return {
      star,
      count,
      percentage:
        reviews.length > 0
          ? Math.round(
              (count /
                reviews.length) *
                100
            )
          : 0,
    };
  });

  const handleSubmit = () => {
    const trimmed =
      content.trim();

    if (!trimmed) {
      return;
    }

    const newReview: Review =
      {
        id: `local-${Date.now()}`,

        userName: "Sakura 用户",

        nationality: "留学生",

        course:
          school.category,

        year: "在校生",

        rating,

        content: trimmed,

        likes: 0,

        createdAt: "刚刚",

        verified: false,
      };

    setReviews(
      (current) => [
        newReview,
        ...current,
      ]
    );

    setContent("");

    setRating(5);

    setSubmitted(true);

    window.setTimeout(() => {
      setSubmitted(false);
    }, 2500);
  };

  const toggleLike = (
    reviewId: string
  ) => {
    const alreadyLiked =
      likedReviews.includes(
        reviewId
      );

    setLikedReviews(
      (current) =>
        alreadyLiked
          ? current.filter(
              (id) =>
                id !== reviewId
            )
          : [
              ...current,
              reviewId,
            ]
    );

    setReviews(
      (current) =>
        current.map(
          (review) =>
            review.id ===
            reviewId
              ? {
                  ...review,

                  likes:
                    review.likes +
                    (alreadyLiked
                      ? -1
                      : 1),
                }
              : review
        )
    );
  };

  return (
    <section
      id="review"
      className="scroll-mt-28"
    >
      <Card className="rounded-3xl p-8">
        {/* Header */}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-1 rounded-full bg-orange-500" />

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                学生评价
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Student Reviews
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2">
            <Star
              size={16}
              className="fill-amber-400 text-amber-400"
            />

            <span className="text-sm font-black text-slate-900">
              {averageRating.toFixed(
                1
              )}
            </span>

            <span className="text-xs text-slate-500">
              / 5.0
            </span>
          </div>
        </div>

        {/* Rating Summary */}

        <div className="mt-8 grid gap-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:grid-cols-[180px_1fr]">
          <div className="flex flex-col items-center justify-center border-b border-slate-200 pb-6 text-center md:border-b-0 md:border-r md:pb-0 md:pr-6">
            <p className="text-5xl font-black tracking-tight text-slate-950">
              {averageRating.toFixed(
                1
              )}
            </p>

            <div className="mt-3 flex gap-1">
              {[
                1,
                2,
                3,
                4,
                5,
              ].map(
                (star) => (
                  <Star
                    key={star}
                    size={17}
                    className={
                      star <=
                      Math.round(
                        averageRating
                      )
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }
                  />
                )
              )}
            </div>

            <p className="mt-3 text-xs text-slate-400">
              {reviews.length} 条评价
            </p>
          </div>

          <div className="space-y-3">
            {ratingStats.map(
              (item) => (
                <div
                  key={
                    item.star
                  }
                  className="flex items-center gap-3"
                >
                  <div className="flex w-10 items-center gap-1 text-xs font-bold text-slate-600">
                    {
                      item.star
                    }

                    <Star
                      size={12}
                      className="fill-amber-400 text-amber-400"
                    />
                  </div>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>

                  <span className="w-10 text-right text-xs text-slate-400">
                    {
                      item.percentage
                    }
                    %
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Write Review */}

        <div className="mt-9 rounded-3xl border border-orange-100 bg-orange-50/50 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
              <MessageSquare
                size={20}
              />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                分享你的真实体验
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                你的经历可以帮助其他留学生更好地选择学校
              </p>
            </div>
          </div>

          {/* Rating Input */}

          <div className="mt-6">
            <p className="text-sm font-bold text-slate-700">
              你的评分
            </p>

            <div
              className="mt-3 flex w-fit gap-2"
              onMouseLeave={() =>
                setHoverRating(
                  null
                )
              }
            >
              {[
                1,
                2,
                3,
                4,
                5,
              ].map(
                (star) => {
                  const active =
                    star <=
                    (hoverRating ??
                      rating);

                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() =>
                        setHoverRating(
                          star
                        )
                      }
                      onClick={() =>
                        setRating(
                          star
                        )
                      }
                      className="transition hover:scale-110"
                      aria-label={`${star} 星`}
                    >
                      <Star
                        size={27}
                        className={
                          active
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }
                      />
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Content */}

          <div className="mt-5">
            <textarea
              value={content}
              onChange={(event) =>
                setContent(
                  event.target
                    .value
                )
              }
              maxLength={500}
              placeholder="例如：课程怎么样？老师是否负责？留学生就业支持如何？学校有哪些优点或需要注意的地方？"
              className="
                min-h-[130px]
                w-full
                resize-none
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                text-sm
                leading-7
                text-slate-800
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-orange-400
                focus:ring-4
                focus:ring-orange-100
              "
            />

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-400">
                {
                  content.length
                }
                /500
              </p>

              <button
                type="button"
                onClick={
                  handleSubmit
                }
                disabled={
                  !content.trim()
                }
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-orange-500
                  px-5
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-orange-600
                  disabled:cursor-not-allowed
                  disabled:bg-slate-300
                "
              >
                <Send
                  size={17}
                />

                发布评价
              </button>
            </div>

            {submitted && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <BadgeCheck
                  size={17}
                />

                评价已添加到当前页面
              </div>
            )}
          </div>
        </div>

        {/* Review List */}

        <div className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900">
              全部评价
            </h3>

            <span className="text-xs text-slate-400">
              共 {reviews.length} 条
            </span>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {reviews.map(
              (review) => (
                <ReviewItem
                  key={
                    review.id
                  }
                  review={
                    review
                  }
                  liked={likedReviews.includes(
                    review.id
                  )}
                  onLike={() =>
                    toggleLike(
                      review.id
                    )
                  }
                />
              )
            )}
          </div>
        </div>

        {/* Notice */}

        <div className="mt-8 rounded-2xl bg-slate-50 p-5">
          <div className="flex items-start gap-3">
            <BadgeCheck
              size={19}
              className="mt-0.5 shrink-0 text-orange-500"
            />

            <p className="text-sm leading-7 text-slate-500">
              当前评价为开发阶段 Mock
              数据。正式上线后，
              Sakura 将区分普通用户评价与经过在校生、
              毕业生等身份验证的评价，并提供举报和审核机制。
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Review Item
|--------------------------------------------------------------------------
*/

function ReviewItem({
  review,
  liked,
  onLike,
}: {
  review: Review;
  liked: boolean;
  onLike: () => void;
}) {
  return (
    <article className="py-7 first:pt-0 last:pb-0">
      <div className="flex items-start gap-4">
        {/* Avatar */}

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <UserRound
            size={20}
          />
        </div>

        <div className="min-w-0 flex-1">
          {/* User */}

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold text-slate-900">
                  {
                    review.userName
                  }
                </p>

                {review.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
                    <BadgeCheck
                      size={12}
                    />

                    已验证学生
                  </span>
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                <span>
                  {
                    review.nationality
                  }
                </span>

                <span>·</span>

                <span>
                  {
                    review.course
                  }
                </span>

                <span>·</span>

                <span>
                  {review.year}
                </span>
              </div>
            </div>

            <span className="text-xs text-slate-400">
              {
                review.createdAt
              }
            </span>
          </div>

          {/* Stars */}

          <div className="mt-3 flex gap-1">
            {[
              1,
              2,
              3,
              4,
              5,
            ].map(
              (star) => (
                <Star
                  key={star}
                  size={15}
                  className={
                    star <=
                    review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200"
                  }
                />
              )
            )}
          </div>

          {/* Content */}

          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {review.content}
          </p>

          {/* Like */}

          <div className="mt-4">
            <button
              type="button"
              onClick={onLike}
              className={`
                inline-flex
                items-center
                gap-2
                rounded-lg
                px-3
                py-2
                text-xs
                font-semibold
                transition
                ${
                  liked
                    ? "bg-orange-50 text-orange-600"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }
              `}
            >
              {liked ? (
                <Heart
                  size={15}
                  className="fill-current"
                />
              ) : (
                <ThumbsUp
                  size={15}
                />
              )}

              有帮助

              {review.likes >
                0 && (
                <span>
                  {
                    review.likes
                  }
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/*
|--------------------------------------------------------------------------
| MOCK Reviews
|--------------------------------------------------------------------------
|
| 正式数据库完成后删除。
|
|--------------------------------------------------------------------------
*/

function getMockReviews(
  school: CollegeReviewData
): Review[] {
  const categoryReview =
    getCategoryReview(
      school.category
    );

  return [
    {
      id: `${school.id}-review-1`,

      userName: "林同学",

      nationality:
        "中国留学生",

      course:
        school.category,

      year: "2025年毕业",

      rating: 5,

      content:
        categoryReview.good,

      likes: 18,

      createdAt:
        "2026年6月12日",

      verified: true,
    },

    {
      id: `${school.id}-review-2`,

      userName: "王同学",

      nationality:
        "中国留学生",

      course:
        school.category,

      year: "在校生",

      rating: 4,

      content:
        categoryReview.normal,

      likes: 11,

      createdAt:
        "2026年5月28日",

      verified: true,
    },

    {
      id: `${school.id}-review-3`,

      userName: "匿名用户",

      nationality:
        "外国留学生",

      course:
        school.category,

      year: "2024年毕业",

      rating: 4,

      content:
        categoryReview.notice,

      likes: 7,

      createdAt:
        "2026年4月15日",

      verified: false,
    },

    {
      id: `${school.id}-review-4`,

      userName: "陈同学",

      nationality:
        "中国留学生",

      course:
        school.category,

      year: "2025年毕业",

      rating:
        Math.max(
          3,
          Math.round(
            school.rating
          )
        ),

      content:
        "学校整体环境和老师的对应都还不错。选择专门学校的话，建议不要只看学校名气，最好提前确认具体学科的课程内容、就业企业以及留学生实际就业情况。",

      likes: 5,

      createdAt:
        "2026年3月20日",

      verified: true,
    },
  ];
}

function getCategoryReview(
  category: CollegeReviewData["category"]
) {
  switch (category) {
    case "IT・AI":
      return {
        good:
          "课程比较偏实际开发，不只是学书本内容。我们做过Web开发和团队项目，老师也会帮忙修改履历书。对想在日本找IT工作的留学生来说，就业指导比较有用。",

        normal:
          "编程课程从基础开始，不过进度还是比较快。如果自己课后完全不练习会比较吃力。学校有企业说明会，这一点对找工作帮助比较大。",

        notice:
          "建议报名前确认每个学科到底学什么。有些写着AI的课程实际上基础IT内容也很多，不要只看专业名字，最好把课程表和就业实绩都看清楚。",
      };

    case "设计・动漫":
      return {
        good:
          "老师比较重视作品集，平时会一直修改作品。找设计和动漫相关工作时作品集非常重要，学校也有企业合作项目，可以提前了解实际制作流程。",

        normal:
          "课程挺有意思，但作业和作品制作很多。想进动漫或者游戏公司的话，只靠上课不够，自己也要花很多时间做作品。",

        notice:
          "设计类专业就业比较看个人作品和日语沟通能力。学校能提供机会，但最后还是要看作品集质量，所以入学前最好先确认自己是否真的喜欢这个方向。",
      };

    case "商务・观光":
      return {
        good:
          "商务日语和面试训练比较实用，老师会帮忙修改履历书。学校也有酒店和观光企业的说明会，对留学生找服务行业工作比较方便。",

        normal:
          "课程整体不难，但是找工作的时候日语很重要。特别是酒店和接客行业，需要能够比较自然地和日本客人沟通。",

        notice:
          "如果目标是留在日本就业，建议提前确认专业和工作签证的对应关系，不要只看就业率。不同职位能够申请的在留资格可能不一样。",
      };

    case "美容・时尚":
      return {
        good:
          "实践课很多，能实际练习美容和造型技术。老师会针对资格考试进行指导，想进入美容行业的话整体学习环境不错。",

        normal:
          "除了学费之外，工具、材料和考试也会产生一些额外费用。学习内容比较偏实践，平时练习时间很多。",

        notice:
          "美容类专业一定要提前确认资格要求和外国人的就业条件。有些职业需要日本国家资格，入学之前最好把毕业后的就业路线确认清楚。",
      };

    case "医疗・福祉":
      return {
        good:
          "实习机会比较多，老师对资格考试也抓得比较紧。介护相关行业现在工作机会很多，学校会帮助留学生准备专业日语和面试。",

        normal:
          "专业内容不算轻松，除了日语还要学习很多医疗和福祉专业词汇。实习期间也比较辛苦，不过能提前了解实际工作环境。",

        notice:
          "医疗和福祉不同专业对应的资格完全不一样。建议先确认自己毕业后想做什么，再决定具体学科，不要只因为就业率高就报名。",
      };

    case "汽车・技术":
      return {
        good:
          "实习设备比较多，课程基本都是理论加实际操作。老师会指导整备士考试，也有汽车企业来学校招聘，找工作路线比较明确。",

        normal:
          "实习课程不少，需要认真练习。汽车相关专业很多术语都是日语，刚开始留学生可能需要花时间适应。",

        notice:
          "如果目标是汽车整备士，要重点确认学校对应的国家资格、考试合格率和毕业后的就业企业，这几个信息比单纯看学校排名更重要。",
      };
  }
}