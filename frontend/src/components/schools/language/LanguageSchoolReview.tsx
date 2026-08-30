"use client";

import { useMemo, useState } from "react";
import {
  Star,
  ThumbsUp,
  MessageCircle,
  Send,
} from "lucide-react";

import Card from "@/components/ui/Card/Card";

export type LanguageSchoolReviewData = {
  id: string;
  name: string;
  rating: number;
};

interface Props {
  school: LanguageSchoolReviewData;
}

type Review = {
  id: string;
  name: string;
  country: string;
  year: string;
  score: number;
  content: string;
  likes: number;
};

const initialReviews: Review[] = [
  {
    id: "review-1",
    name: "陈同学",
    country: "中国",
    year: "2025届",
    score: 5,
    content:
      "老师非常负责，升学辅导也很专业。我从 N3 提升到了 N1，最后顺利考上东京的大学。",
    likes: 18,
  },
  {
    id: "review-2",
    name: "李同学",
    country: "中国",
    year: "2024届",
    score: 5,
    content:
      "学校位置很好，距离车站近。老师会耐心帮助留学生办理各种手续，非常推荐。",
    likes: 12,
  },
  {
    id: "review-3",
    name: "王同学",
    country: "中国",
    year: "2023届",
    score: 4,
    content:
      "课程安排比较合理，宿舍环境不错，就是热门时期宿舍比较紧张，需要提前申请。",
    likes: 7,
  },
];

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 正式后端完成后：
|
| GET /api/language-schools/:id/reviews
|
| 建议返回：
|
| {
|   summary: {
|     averageScore: number;
|     reviewCount: number;
|     recommendRate: number;
|   };
|   reviews: [
|     {
|       id: string;
|       userName: string;
|       country: string;
|       graduationYear: string;
|       score: number;
|       content: string;
|       likes: number;
|       createdAt: string;
|     }
|   ]
| }
|
|--------------------------------------------------------------------------
*/

export default function LanguageSchoolReview({
  school,
}: Props) {
  const [reviews, setReviews] =
    useState<Review[]>(initialReviews);

  const [likedIds, setLikedIds] = useState<
    string[]
  >([]);

  const [score, setScore] = useState(5);
  const [content, setContent] =
    useState("");

  const averageScore = useMemo(() => {
    if (reviews.length === 0) {
      return school.rating;
    }

    const total = reviews.reduce(
      (sum, item) => sum + item.score,
      0
    );

    return total / reviews.length;
  }, [reviews, school.rating]);

  const recommendRate = useMemo(() => {
    if (reviews.length === 0) {
      return 0;
    }

    const recommended =
      reviews.filter(
        (item) => item.score >= 4
      ).length;

    return Math.round(
      (recommended / reviews.length) * 100
    );
  }, [reviews]);

  const toggleLike = (
    reviewId: string
  ) => {
    /*
    |--------------------------------------------------------------------------
    | TODO [API - POST / DELETE]
    |--------------------------------------------------------------------------
    |
    | 点赞：
    |
    | POST /api/language-schools/:id/reviews/:reviewId/like
    |
    | 取消点赞：
    |
    | DELETE /api/language-schools/:id/reviews/:reviewId/like
    |
    | 当前暂时只使用本地 state。
    |
    |--------------------------------------------------------------------------
    */

    const liked =
      likedIds.includes(reviewId);

    setLikedIds((current) =>
      liked
        ? current.filter(
            (id) => id !== reviewId
          )
        : [...current, reviewId]
    );

    setReviews((current) =>
      current.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              likes: Math.max(
                0,
                review.likes +
                  (liked ? -1 : 1)
              ),
            }
          : review
      )
    );
  };

  const submitReview = () => {
    const text = content.trim();

    if (!text) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | TODO [API - POST]
    |--------------------------------------------------------------------------
    |
    | 正式用户系统完成后：
    |
    | POST /api/language-schools/:id/reviews
    |
    | body:
    |
    | {
    |   score,
    |   content
    | }
    |
    | 后端根据登录用户自动取得：
    |
    | userId
    | userName
    | country
    |
    |--------------------------------------------------------------------------
    */

    const review: Review = {
      id: `local-${Date.now()}`,
      name: "我",
      country: "用户评价",
      year: "刚刚发布",
      score,
      content: text,
      likes: 0,
    };

    setReviews((current) => [
      review,
      ...current,
    ]);

    setContent("");
    setScore(5);
  };

  return (
    <section
      id="review"
      className="scroll-mt-28"
    >
      <Card className="rounded-3xl p-8">
        {/* Title */}

        <div className="flex items-center gap-3">
          <div className="h-10 w-1 rounded-full bg-emerald-600" />

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              学生评价
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Student Reviews
            </p>
          </div>
        </div>

        {/* Score */}

        <div className="mt-8 rounded-3xl bg-gradient-to-r from-emerald-600 to-cyan-500 p-8 text-white">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="text-6xl font-black">
                {averageScore.toFixed(1)}
              </div>

              <div className="mt-3 flex items-center gap-1">
                {Array.from({
                  length: 5,
                }).map((_, index) => (
                  <Star
                    key={index}
                    size={20}
                    className={
                      index <
                      Math.round(
                        averageScore
                      )
                        ? "fill-yellow-300 text-yellow-300"
                        : "text-white/30"
                    }
                  />
                ))}
              </div>

              <p className="mt-3 text-emerald-50">
                {school.name} 综合评分
              </p>
            </div>

            <div className="grid gap-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <ThumbsUp size={18} />

                {recommendRate}% 推荐
              </div>

              <div className="flex items-center justify-end gap-2">
                <MessageCircle
                  size={18}
                />

                已收录{" "}
                {reviews.length} 条评价
              </div>
            </div>
          </div>
        </div>

        {/* Write Review */}

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-lg font-bold text-slate-900">
            写下你的评价
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            分享真实的学校经历，
            帮助其他留学生做判断。
          </p>

          {/* Score */}

          <div className="mt-5">
            <p className="text-sm font-medium text-slate-700">
              评分
            </p>

            <div className="mt-3 flex gap-2">
              {Array.from({
                length: 5,
              }).map((_, index) => {
                const value = index + 1;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setScore(value)
                    }
                    className="transition hover:scale-110"
                    aria-label={`${value} 星`}
                  >
                    <Star
                      size={26}
                      className={
                        value <= score
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}

          <textarea
            value={content}
            onChange={(event) =>
              setContent(
                event.target.value
              )
            }
            maxLength={1000}
            placeholder="例如：老师怎么样、升学指导如何、学校管理、宿舍、周边环境、需要注意的问题……"
            className="
              mt-5
              min-h-32
              w-full
              resize-y
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-4
              py-4
              text-sm
              leading-7
              text-slate-800
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-emerald-400
              focus:ring-4
              focus:ring-emerald-100
            "
          />

          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              {content.length} /
              1000
            </span>

            <button
              type="button"
              onClick={submitReview}
              disabled={!content.trim()}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-emerald-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-emerald-700
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Send size={16} />

              发布评价
            </button>
          </div>
        </div>

        {/* Reviews */}

        <div className="mt-8 space-y-5">
          {reviews.map((item) => {
            const liked =
              likedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  transition
                  hover:border-emerald-300
                  hover:shadow-lg
                "
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.country} ·{" "}
                      {item.year}
                    </p>
                  </div>

                  <div className="flex">
                    {Array.from({
                      length: 5,
                    }).map(
                      (_, index) => (
                        <Star
                          key={index}
                          size={18}
                          className={
                            index <
                            item.score
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-200"
                          }
                        />
                      )
                    )}
                  </div>
                </div>

                <p className="mt-5 leading-8 text-slate-600">
                  {item.content}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      toggleLike(
                        item.id
                      )
                    }
                    className={`
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      px-3
                      py-2
                      text-sm
                      font-medium
                      transition
                      ${
                        liked
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }
                    `}
                  >
                    <ThumbsUp
                      size={16}
                      className={
                        liked
                          ? "fill-current"
                          : ""
                      }
                    />

                    有帮助
                    {item.likes > 0 &&
                      ` ${item.likes}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}