"use client";

import { useMemo, useState } from "react";
import { Star, ThumbsUp } from "lucide-react";

type UniversityReviewData = {
  id: string;
  name: string;
  rating: number;
  degree: "大学" | "大学院";
};

type Props = {
  university: UniversityReviewData;
};

type Review = {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  degree: string;
  major: string;
  content: string;
  likes: number;
};

const reviewMap: Record<string, Review[]> = {
  tokyo: [
    {
      id: 1,
      user: "小林",
      avatar: "林",
      rating: 5,
      date: "2026-07-18",
      degree: "大学",
      major: "工学部",
      content:
        "学校的研究资源非常丰富，实验室设备也很好。课程难度比较高，但是能接触到很多优秀的老师和学生。",
      likes: 36,
    },
    {
      id: 2,
      user: "Chen",
      avatar: "C",
      rating: 5,
      date: "2026-06-03",
      degree: "大学院",
      major: "信息理工学系研究科",
      content:
        "研究环境很好，教授和研究室的国际化程度比较高。申请大学院之前建议提前了解教授的研究方向。",
      likes: 28,
    },
    {
      id: 3,
      user: "王同学",
      avatar: "王",
      rating: 4,
      date: "2026-04-21",
      degree: "大学",
      major: "经济学部",
      content:
        "学习压力不小，但是课程质量很高。东京生活成本偏高，留学生最好提前规划住宿和生活费用。",
      likes: 17,
    },
  ],

  waseda: [
    {
      id: 1,
      user: "刘同学",
      avatar: "刘",
      rating: 5,
      date: "2026-07-11",
      degree: "大学",
      major: "政治经济学部",
      content:
        "留学生很多，国际化氛围非常明显。学校周边生活方便，社团活动也非常丰富。",
      likes: 31,
    },
    {
      id: 2,
      user: "Yuki",
      avatar: "Y",
      rating: 4,
      date: "2026-05-19",
      degree: "大学",
      major: "商学部",
      content:
        "商科资源比较丰富，就职活动也很活跃。不过私立大学整体费用会比国立大学高一些。",
      likes: 22,
    },
  ],

  kyoto: [
    {
      id: 1,
      user: "赵同学",
      avatar: "赵",
      rating: 5,
      date: "2026-06-26",
      degree: "大学",
      major: "理学部",
      content:
        "学术氛围很强，自由度也比较高。比较适合喜欢自己研究和探索的学生。",
      likes: 26,
    },
    {
      id: 2,
      user: "Li",
      avatar: "L",
      rating: 5,
      date: "2026-03-14",
      degree: "大学院",
      major: "工学研究科",
      content:
        "研究室资源很好，京都的生活节奏也比较舒服。大学院申请一定要认真准备研究计划书。",
      likes: 19,
    },
  ],

  osaka: [
    {
      id: 1,
      user: "张同学",
      avatar: "张",
      rating: 5,
      date: "2026-07-02",
      degree: "大学院",
      major: "工学研究科",
      content:
        "研究设施比较完善，教授和学生交流很多。大阪生活也很方便，整体体验不错。",
      likes: 21,
    },
  ],

  yokohama: [
    {
      id: 1,
      user: "孙同学",
      avatar: "孙",
      rating: 4,
      date: "2026-06-08",
      degree: "大学",
      major: "数据科学学部",
      content:
        "数据科学课程比较有特色，学校规模不算特别大，但是学习环境很好。",
      likes: 15,
    },
  ],

  nagoya: [
    {
      id: 1,
      user: "Wu",
      avatar: "W",
      rating: 5,
      date: "2026-07-09",
      degree: "大学院",
      major: "信息学研究科",
      content:
        "研究型大学的感觉很明显。大学院比较看重研究方向和教授匹配度，建议提前联系研究室。",
      likes: 24,
    },
  ],

  kyushu: [
    {
      id: 1,
      user: "周同学",
      avatar: "周",
      rating: 5,
      date: "2026-05-28",
      degree: "大学院",
      major: "系统信息科学府",
      content:
        "伊都校区环境很好，研究设施比较新。福冈生活成本相比东京低一些，对留学生比较友好。",
      likes: 18,
    },
  ],
};

export default function UniversityReview({
  university,
}: Props) {
  const reviews = useMemo(
    () => reviewMap[university.id] ?? [],
    [university.id]
  );

  const [likedReviews, setLikedReviews] = useState<number[]>([]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return university.rating;
    }

    const total = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return Number((total / reviews.length).toFixed(1));
  }, [reviews, university.rating]);

  const handleLike = (reviewId: number) => {
    setLikedReviews((current) =>
      current.includes(reviewId)
        ? current.filter((id) => id !== reviewId)
        : [...current, reviewId]
    );
  };

  return (
    <section
      id="review"
      className="
        scroll-mt-28
        rounded-[28px]
        border
        border-slate-200
        bg-white
        p-8
        shadow-sm
      "
    >
      {/* 标题 */}

      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            学生评价
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {university.name} 留学生学习与生活体验
          </p>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2">
            <Star
              size={22}
              className="fill-amber-400 text-amber-400"
            />

            <span className="text-3xl font-black text-slate-900">
              {averageRating}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            {reviews.length} 条评价
          </p>
        </div>
      </div>

      {/* 评分 */}

      <div
        className="
          mt-8
          flex
          flex-col
          gap-5
          rounded-2xl
          border
          border-slate-200
          bg-slate-50
          p-6
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <p className="text-sm font-bold text-slate-900">
            综合评价
          </p>

          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className={
                  star <= Math.round(averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }
              />
            ))}
          </div>
        </div>

        <div className="text-sm text-slate-500">
          {university.degree === "大学院"
            ? "主要参考研究环境、教授指导、研究室及留学生体验"
            : "主要参考课程、校园生活、就职及留学生体验"}
        </div>
      </div>

      {/* 评论 */}

      {reviews.length > 0 ? (
        <div className="mt-8 divide-y divide-slate-100">
          {reviews.map((review) => {
            const liked = likedReviews.includes(review.id);

            return (
              <article
                key={review.id}
                className="py-7 first:pt-0 last:pb-0"
              >
                {/* 用户 */}

                <div className="flex items-start justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-100
                        font-black
                        text-blue-600
                      "
                    >
                      {review.avatar}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-bold text-slate-900">
                          {review.user}
                        </p>

                        <span
                          className="
                            rounded-full
                            bg-slate-100
                            px-2.5
                            py-1
                            text-xs
                            font-medium
                            text-slate-500
                          "
                        >
                          {review.degree}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        {review.major}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs text-slate-400">
                    {review.date}
                  </span>
                </div>

                {/* 星级 */}

                <div className="mt-5 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </div>

                {/* 内容 */}

                <p className="mt-4 leading-7 text-slate-600">
                  {review.content}
                </p>

                {/* 点赞 */}

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => handleLike(review.id)}
                    className={`
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      transition
                      ${
                        liked
                          ? "border-blue-200 bg-blue-50 text-blue-600"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }
                    `}
                  >
                    <ThumbsUp
                      size={15}
                      className={
                        liked ? "fill-current" : ""
                      }
                    />

                    有帮助

                    <span>
                      {review.likes + (liked ? 1 : 0)}
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div
          className="
            mt-8
            rounded-2xl
            border
            border-dashed
            border-slate-300
            bg-slate-50
            px-6
            py-14
            text-center
          "
        >
          <Star
            size={30}
            className="mx-auto text-slate-300"
          />

          <h3 className="mt-4 font-bold text-slate-900">
            暂无学生评价
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            这所学校暂时还没有留学生评价。
          </p>
        </div>
      )}

      <p className="mt-8 text-xs leading-6 text-slate-400">
        ※ 当前评价为页面开发阶段的 Mock 数据。
        后台完成后可直接替换为评价 API 数据。
      </p>
    </section>
  );
}