"use client";

import {
  ChevronDown,
  ChevronUp,
  Flag,
  Heart,
  LoaderCircle,
  MessageCircle,
  Reply,
  Send,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import {
  type FormEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";

type CommentStatus =
  | "published"
  | "pending"
  | "rejected";

interface CommentAuthor {
  id: string;
  name: string;

  /*
   * 后端计算，不接受前端提交。
   *
   * house:
   * authorId === house.authorId
   *
   * experience:
   * authorId === experience.authorId
   */
  isContentOwner?: boolean;
}

interface ReplyTargetUser {
  id: string;
  name: string;
}

interface CommentReply {
  id: number;

  rootCommentId: number;

  parentId: number;

  replyToUser: ReplyTargetUser;

  author: CommentAuthor;

  content: string;

  createdAt: string;

  likes: number;

  liked: boolean;

  status: CommentStatus;

  isMine: boolean;
}

interface CommentItem {
  id: number;

  author: CommentAuthor;

  content: string;

  createdAt: string;

  likes: number;

  liked: boolean;

  status: CommentStatus;

  isMine: boolean;

  replies: CommentReply[];
}

interface CommentSectionProps {
  contentType:
    | "experience"
    | "scam"
    | "house"
    | "job";

  contentId: string | number;
}

interface ReplyComposerTarget {
  rootCommentId: number;

  parentId: number;

  user: ReplyTargetUser;
}

interface DeleteTarget {
  rootCommentId: number;

  replyId?: number;

  content: string;
}

interface ReportTarget {
  rootCommentId: number;

  replyId?: number;

  content: string;
}

const COMMENT_MAX_LENGTH = 1000;
const REPLY_MAX_LENGTH = 1000;

const DEFAULT_VISIBLE_REPLIES = 3;

const mockCurrentUser: CommentAuthor = {
  id: "user_001",
  name: "Sakura 用户",
};

function getCommentCopy(
  contentType: CommentSectionProps["contentType"]
) {
  if (contentType === "house") {
    return {
      title: "房源问答",
      description:
        "公开询问房源条件、费用和入住资格，其他用户也可以参考。",
      latestSort: "最新问答",
      popularSort: "热门问答",
      accountHint: "以当前账号公开提问",
      placeholder:
        "例如：外国人可以申请吗？初期费用大概多少？",
      submitLabel: "发布问题",
      emptyTitle: "还没有房源问答",
      emptyDescription:
        "有关于这套房的问题，可以先公开提问。",
      itemLabel: "问题",
      ownerLabel: "发布者",
    };
  }

  return {
    title: "评论",
    description:
      "分享真实经验，也请尊重其他用户。",
    latestSort: "最新评论",
    popularSort: "热门评论",
    accountHint: "以当前账号发表评论",
    placeholder: "写下你的评论...",
    submitLabel: "发表评论",
    emptyTitle: "还没有评论",
    emptyDescription:
      "成为第一个参与讨论的人。",
    itemLabel: "评论",
    ownerLabel: "作者",
  };
}

const initialComments: CommentItem[] = [
  {
    id: 101,
    author: {
      id: "user_102",
      name: "东京生活笔记",
    },
    content:
      "这个经验很实用。我第一次租房的时候就是没有注意更新费，后来才发现合同里写得很清楚。",
    createdAt: "2026-09-03 18:42",
    likes: 12,
    liked: false,
    status: "published",
    isMine: false,
    replies: [
      {
        id: 1001,
        rootCommentId: 101,
        parentId: 101,
        replyToUser: {
          id: "user_102",
          name: "东京生活笔记",
        },
        author: {
          id: "user_103",
          name: "小林在东京",
        },
        content:
          "对，更新费和退房清扫费都最好在签约前确认清楚。",
        createdAt: "2026-09-03 20:15",
        likes: 4,
        liked: false,
        status: "published",
        isMine: false,
      },
      {
        id: 1002,
        rootCommentId: 101,
        parentId: 101,
        replyToUser: {
          id: "user_102",
          name: "东京生活笔记",
        },
        author: {
          id: "user_104",
          name: "埼玉租房中",
        },
        content:
          "保证会社更新费也很容易忽略，我之前就是一年收一次。",
        createdAt: "2026-09-03 21:03",
        likes: 7,
        liked: false,
        status: "published",
        isMine: false,
      },
      {
        id: 1003,
        rootCommentId: 101,
        parentId: 1002,
        replyToUser: {
          id: "user_104",
          name: "埼玉租房中",
        },
        author: {
          id: "user_105",
          name: "东京打工人",
        },
        content:
          "我住的地方是每个月一起扣，签约的时候确实没注意。",
        createdAt: "2026-09-03 21:20",
        likes: 3,
        liked: false,
        status: "published",
        isMine: false,
      },
      {
        id: 1004,
        rootCommentId: 101,
        parentId: 1003,
        replyToUser: {
          id: "user_105",
          name: "东京打工人",
        },
        author: {
          id: "user_106",
          name: "小周",
        },
        content:
          "每个月扣的话金额看起来小，但是住久了也不少。",
        createdAt: "2026-09-03 21:31",
        likes: 2,
        liked: false,
        status: "published",
        isMine: false,
      },
      {
        id: 1005,
        rootCommentId: 101,
        parentId: 101,
        replyToUser: {
          id: "user_102",
          name: "东京生活笔记",
        },
        author: {
          id: "user_107",
          name: "关西搬家人",
        },
        content:
          "还有短期解约违约金，留学生搬家比较频繁的话一定要看。",
        createdAt: "2026-09-03 22:10",
        likes: 5,
        liked: false,
        status: "published",
        isMine: false,
      },
    ],
  },
  {
    id: 102,
    author: {
      id: "user_001",
      name: "Sakura 用户",
    },
    content:
      "补充一点，如果是外国人入住，还可以提前确认保证会社的审查条件。",
    createdAt: "2026-09-04 09:20",
    likes: 7,
    liked: true,
    status: "published",
    isMine: true,
    replies: [
      {
        id: 1006,
        rootCommentId: 102,
        parentId: 102,
        replyToUser: {
          id: "user_001",
          name: "Sakura 用户",
        },
        author: {
          id: "user_108",
          name: "留学生小陈",
        },
        content:
          "这个很重要，我之前就遇到过保证会社没通过。",
        createdAt: "2026-09-04 10:02",
        likes: 1,
        liked: false,
        status: "published",
        isMine: false,
      },
    ],
  },
];

export default function CommentSection({
  contentType,
  contentId,
}: CommentSectionProps) {

  const copy =
    getCommentCopy(contentType);

  const [comments, setComments] =
    useState<CommentItem[]>(() =>
      contentType === "house"
        ? []
        : initialComments
    );

  const [commentInput, setCommentInput] =
    useState("");

  const [commentError, setCommentError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [
    replyComposerTarget,
    setReplyComposerTarget,
  ] =
    useState<ReplyComposerTarget | null>(
      null
    );

  const [replyInput, setReplyInput] =
    useState("");

  const [replyError, setReplyError] =
    useState("");

  const [sort, setSort] = useState<
    "latest" | "popular"
  >("latest");

  const [
    expandedCommentIds,
    setExpandedCommentIds,
  ] = useState<Set<number>>(
    () => new Set()
  );

  const [deleteTarget, setDeleteTarget] =
    useState<DeleteTarget | null>(
      null
    );

  const [reportTarget, setReportTarget] =
    useState<ReportTarget | null>(
      null
    );

  const [reportReason, setReportReason] =
    useState("");

  const [
    reportMessage,
    setReportMessage,
  ] = useState("");

  /*
   * TODO [API - GET]
   *
   * GET /api/comments
   *
   * Query:
   * {
   *   contentType,
   *   contentId,
   *   sort,
   *   page,
   *   limit
   * }
   *
   * 建议后端返回：
   *
   * [
   *   {
   *     id,
   *     author,
   *     content,
   *     likes,
   *     liked,
   *     replies: [
   *       {
   *         id,
   *         rootCommentId,
   *         parentId,
   *         replyToUser,
   *         ...
   *       }
   *     ]
   *   }
   * ]
   *
   * UI 永远只展示两层。
   * replies 内部使用平铺结构。
   */

  const visibleComments = useMemo(() => {
    const result = [...comments];

    if (sort === "latest") {
      result.sort(
        (a, b) => b.id - a.id
      );
    }

    if (sort === "popular") {
      result.sort(
        (a, b) => b.likes - a.likes
      );
    }

    return result;
  }, [comments, sort]);

  const publishedCommentCount =
    useMemo(() => {
      return comments.reduce(
        (total, comment) => {
          if (
            comment.status !==
            "published"
          ) {
            return total;
          }

          const replyCount =
            comment.replies.filter(
              (reply) =>
                reply.status ===
                "published"
            ).length;

          return total + 1 + replyCount;
        },
        0
      );
    }, [comments]);

  async function handleCommentSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const content =
      normalizeCommentContent(
        commentInput
      );

    if (!content) {
      setCommentError(
        "请输入评论内容。"
      );
      return;
    }

    if (
      content.length >
      COMMENT_MAX_LENGTH
    ) {
      setCommentError(
        `评论最多输入 ${COMMENT_MAX_LENGTH} 个字符。`
      );
      return;
    }

    setCommentError("");
    setSubmitting(true);

    /*
     * TODO [API - POST]
     *
     * POST /api/comments
     *
     * Body:
     * {
     *   contentType,
     *   contentId,
     *   content
     * }
     *
     * 后端必须：
     * - 登录校验
     * - 内容存在校验
     * - 长度校验
     * - Rate Limit
     * - Spam 检测
     * - 风险内容检测
     * - XSS 安全输出
     * - authorId 从 Session 获取
     */

    const newComment: CommentItem = {
      id: Date.now(),
      author: mockCurrentUser,
      content,
      createdAt: "刚刚",
      likes: 0,
      liked: false,
      status: "published",
      isMine: true,
      replies: [],
    };

    setComments((current) => [
      newComment,
      ...current,
    ]);

    setCommentInput("");
    setSubmitting(false);
  }

  function openRootReply(
    comment: CommentItem
  ) {
    setReplyComposerTarget({
      rootCommentId: comment.id,
      parentId: comment.id,
      user: comment.author,
    });

    setReplyInput("");
    setReplyError("");
  }

  function openReplyToReply(
    reply: CommentReply
  ) {
    setReplyComposerTarget({
      rootCommentId:
        reply.rootCommentId,
      parentId: reply.id,
      user: reply.author,
    });

    setReplyInput("");
    setReplyError("");
  }

  function closeReplyComposer() {
    setReplyComposerTarget(null);
    setReplyInput("");
    setReplyError("");
  }

  function handleReplySubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!replyComposerTarget) {
      return;
    }

    const content =
      normalizeCommentContent(
        replyInput
      );

    if (!content) {
      setReplyError(
        "请输入回复内容。"
      );
      return;
    }

    if (
      content.length >
      REPLY_MAX_LENGTH
    ) {
      setReplyError(
        `回复最多输入 ${REPLY_MAX_LENGTH} 个字符。`
      );
      return;
    }

    /*
     * TODO [API - POST]
     *
     * POST /api/comments/:rootCommentId/replies
     *
     * Body:
     * {
     *   parentId: number;
     *   content: string;
     * }
     *
     * parentId:
     * - 回复主评论时 = rootCommentId
     * - 回复某条回复时 = reply.id
     *
     * 后端根据 parentId 找到被回复对象，
     * 自动生成 replyToUser。
     *
     * 后端必须验证：
     * - rootCommentId 存在
     * - parentId 确实属于该 rootCommentId
     * - 不信任前端传入的用户名
     * - 登录 / Rate Limit
     * - 内容审核
     */

    const newReply: CommentReply = {
      id: Date.now(),

      rootCommentId:
        replyComposerTarget.rootCommentId,

      parentId:
        replyComposerTarget.parentId,

      replyToUser:
        replyComposerTarget.user,

      author: mockCurrentUser,

      content,

      createdAt: "刚刚",

      likes: 0,

      liked: false,

      status: "published",

      isMine: true,
    };

    setComments((current) =>
      current.map((comment) =>
        comment.id ===
        replyComposerTarget.rootCommentId
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                newReply,
              ],
            }
          : comment
      )
    );

    setExpandedCommentIds(
      (current) => {
        const next = new Set(current);

        next.add(
          replyComposerTarget.rootCommentId
        );

        return next;
      }
    );

    closeReplyComposer();
  }

  function toggleExpanded(
    commentId: number
  ) {
    setExpandedCommentIds(
      (current) => {
        const next = new Set(current);

        if (next.has(commentId)) {
          next.delete(commentId);
        } else {
          next.add(commentId);
        }

        return next;
      }
    );
  }

  function toggleCommentLike(
    commentId: number
  ) {
    /*
     * TODO [API - POST]
     *
     * POST /api/comments/:commentId/like
     *
     * TODO [API - DELETE]
     *
     * DELETE /api/comments/:commentId/like
     */

    setComments((current) =>
      current.map((comment) => {
        if (
          comment.id !== commentId
        ) {
          return comment;
        }

        return {
          ...comment,

          liked: !comment.liked,

          likes: comment.liked
            ? Math.max(
                0,
                comment.likes - 1
              )
            : comment.likes + 1,
        };
      })
    );
  }

  function toggleReplyLike(
    rootCommentId: number,
    replyId: number
  ) {
    /*
     * TODO [API - POST]
     *
     * POST /api/comments/:replyId/like
     *
     * TODO [API - DELETE]
     *
     * DELETE /api/comments/:replyId/like
     */

    setComments((current) =>
      current.map((comment) => {
        if (
          comment.id !== rootCommentId
        ) {
          return comment;
        }

        return {
          ...comment,

          replies:
            comment.replies.map(
              (reply) => {
                if (
                  reply.id !== replyId
                ) {
                  return reply;
                }

                return {
                  ...reply,

                  liked:
                    !reply.liked,

                  likes: reply.liked
                    ? Math.max(
                        0,
                        reply.likes - 1
                      )
                    : reply.likes +
                      1,
                };
              }
            ),
        };
      })
    );
  }

  function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    /*
     * TODO [API - DELETE]
     *
     * DELETE /api/comments/:id
     *
     * 后端必须校验：
     * - 登录
     * - ownership
     * - 管理员权限分离
     *
     * 删除某条回复时：
     * 不删除它之后被别人回复的内容。
     *
     * 因为 replies 是平铺结构，
     * 后续其他回复仍可以正常保留。
     */

    if (
      deleteTarget.replyId !==
      undefined
    ) {
      setComments((current) =>
        current.map((comment) =>
          comment.id ===
          deleteTarget.rootCommentId
            ? {
                ...comment,

                replies:
                  comment.replies.filter(
                    (reply) =>
                      reply.id !==
                      deleteTarget.replyId
                  ),
              }
            : comment
        )
      );
    } else {
      setComments((current) =>
        current.filter(
          (comment) =>
            comment.id !==
            deleteTarget.rootCommentId
        )
      );
    }

    setDeleteTarget(null);
  }

  function handleReportSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!reportTarget) {
      return;
    }

    if (!reportReason.trim()) {
      setReportMessage(
        "请选择举报原因。"
      );

      return;
    }

    /*
     * TODO [API - POST]
     *
     * POST /api/comments/:id/reports
     *
     * Body:
     * {
     *   reason:
     *     "spam" |
     *     "harassment" |
     *     "privacy" |
     *     "misinformation" |
     *     "other"
     * }
     *
     * 后端：
     * - 登录校验
     * - 防重复举报
     * - Rate Limit
     * - 写入审核队列
     * - 高风险内容进入人工审核
     */

    setReportTarget(null);

    setReportReason("");

    setReportMessage("");
  }

  return (
    <section
      className="
        mt-10
        border-t
        border-slate-200
        pt-8
        sm:mt-12
        sm:pt-10
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <MessageCircle
              size={20}
              className="text-blue-600"
            />

            <h2
              className="
                text-xl
                font-black
                text-slate-950
                sm:text-2xl
              "
            >
              {copy.title}
            </h2>

            <span
              className="
                rounded-full
                bg-slate-100
                px-2.5
                py-1
                text-xs
                font-black
                text-slate-500
              "
            >
              {publishedCommentCount}
            </span>
          </div>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            {copy.description}
          </p>
        </div>

        <div className="relative w-fit">
          <select
            value={sort}
            onChange={(event) =>
              setSort(
                event.target.value as
                  | "latest"
                  | "popular"
              )
            }
            className="
              min-h-11
              appearance-none
              rounded-xl
              border
              border-slate-200
              bg-white
              py-2.5
              pl-4
              pr-10
              text-sm
              font-bold
              text-slate-600
              outline-none
              transition
              focus:border-blue-400
            "
          >
            <option value="latest">
              {copy.latestSort}
            </option>

            <option value="popular">
              {copy.popularSort}
            </option>
          </select>

          <ChevronDown
            size={15}
            className="
              pointer-events-none
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />
        </div>
      </div>

      {/* COMMENT INPUT */}

      <form
        onSubmit={handleCommentSubmit}
        className="
          mt-6
          rounded-[22px]
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
          sm:p-5
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <Avatar
            name={
              mockCurrentUser.name
            }
          />

          <div className="min-w-0">
            <p
              className="
                truncate
                text-sm
                font-black
                text-slate-900
              "
            >
              {mockCurrentUser.name}
            </p>

            <p
              className="
                mt-0.5
                text-xs
                text-slate-400
              "
            >
              {copy.accountHint}
            </p>
          </div>
        </div>

        <textarea
          value={commentInput}
          maxLength={
            COMMENT_MAX_LENGTH
          }
          rows={4}
          onChange={(event) => {
            setCommentInput(
              sanitizeInput(
                event.target.value,
                COMMENT_MAX_LENGTH
              )
            );

            setCommentError("");
          }}
          placeholder={copy.placeholder}
          className="
            mt-4
            min-h-28
            w-full
            resize-y
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
            text-sm
            leading-6
            text-slate-900
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-blue-400
            focus:bg-white
            focus:ring-4
            focus:ring-blue-50
          "
        />

        <div
          className="
            mt-2
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div>
            {commentError && (
              <p
                className="
                  text-xs
                  font-bold
                  text-rose-600
                "
              >
                {commentError}
              </p>
            )}
          </div>

          <span
            className={`
              shrink-0
              text-xs
              font-bold
              ${
                commentInput.length >=
                COMMENT_MAX_LENGTH
                  ? "text-rose-500"
                  : "text-slate-400"
              }
            `}
          >
            {commentInput.length}/
            {COMMENT_MAX_LENGTH}
          </span>
        </div>

        <div
          className="
            mt-4
            flex
            flex-col
            gap-3
            border-t
            border-slate-100
            pt-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              leading-5
              text-slate-400
            "
          >
            <ShieldCheck
              size={15}
              className="shrink-0"
            />

            请勿发布个人隐私、骚扰或违法内容。
          </div>

          <button
            type="submit"
            disabled={
              submitting ||
              !commentInput.trim()
            }
            className="
              inline-flex
              min-h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              py-2.5
              text-sm
              font-black
              text-white
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {submitting ? (
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
            ) : (
              <Send size={16} />
            )}

            {copy.submitLabel}
          </button>
        </div>
      </form>

      {/* COMMENTS */}

      <div className="mt-6">
        {visibleComments.length > 0 ? (
          <div className="space-y-4">
            {visibleComments.map(
              (comment) => {
                const publishedReplies =
                  comment.replies.filter(
                    (reply) =>
                      reply.status ===
                      "published"
                  );

                const expanded =
                  expandedCommentIds.has(
                    comment.id
                  );

                const shownReplies =
                  expanded
                    ? publishedReplies
                    : publishedReplies.slice(
                        0,
                        DEFAULT_VISIBLE_REPLIES
                      );

                const hasMoreReplies =
                  publishedReplies.length >
                  DEFAULT_VISIBLE_REPLIES;

                const replyComposerOpen =
                  replyComposerTarget
                    ?.rootCommentId ===
                  comment.id;

                return (
                  <article
                    key={comment.id}
                    className="
                      rounded-[22px]
                      border
                      border-slate-200
                      bg-white
                      p-4
                      shadow-sm
                      sm:p-5
                    "
                  >
                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >
                      <Avatar
                        name={
                          comment.author
                            .name
                        }
                      />

                      <div className="min-w-0 flex-1">
                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >
                          <p
                            className="
                              text-sm
                              font-black
                              text-slate-900
                            "
                          >
                            {
                              comment.author
                                .name
                            }
                          </p>

                            {comment.author.isContentOwner && (
                              <span
                                className="
                                  rounded-full
                                  bg-emerald-50
                                  px-2
                                  py-0.5
                                  text-[10px]
                                  font-black
                                  text-emerald-700
                                "
                              >
                                {copy.ownerLabel}
                              </span>
                            )}

                          {comment.isMine && (
                            <span
                              className="
                                rounded-full
                                bg-blue-50
                                px-2
                                py-0.5
                                text-[10px]
                                font-black
                                text-blue-600
                              "
                            >
                              我的评论
                            </span>
                          )}
                        </div>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-400
                          "
                        >
                          {comment.createdAt}
                        </p>

                        <p
                          className="
                            mt-3
                            whitespace-pre-wrap
                            break-words
                            text-sm
                            leading-7
                            text-slate-700
                          "
                        >
                          {comment.content}
                        </p>

                        <div
                          className="
                            mt-4
                            flex
                            flex-wrap
                            items-center
                            gap-1
                          "
                        >
                          <LikeButton
                            liked={
                              comment.liked
                            }
                            likes={
                              comment.likes
                            }
                            onClick={() =>
                              toggleCommentLike(
                                comment.id
                              )
                            }
                          />

                          <ActionButton
                            icon="reply"
                            label="回复"
                            onClick={() =>
                              openRootReply(
                                comment
                              )
                            }
                          />

                          {comment.isMine ? (
                            <ActionButton
                              icon="delete"
                              label="删除"
                              danger
                              onClick={() =>
                                setDeleteTarget(
                                  {
                                    rootCommentId:
                                      comment.id,

                                    content:
                                      comment.content,
                                  }
                                )
                              }
                            />
                          ) : (
                            <ActionButton
                              icon="report"
                              label="举报"
                              onClick={() => {
                                setReportTarget(
                                  {
                                    rootCommentId:
                                      comment.id,

                                    content:
                                      comment.content,
                                  }
                                );

                                setReportReason(
                                  ""
                                );

                                setReportMessage(
                                  ""
                                );
                              }}
                            />
                          )}
                        </div>

                        {/* REPLIES */}

                        {shownReplies.length >
                          0 && (
                          <div
                            className="
                              mt-5
                              space-y-4
                              border-l-2
                              border-slate-100
                              pl-4
                              sm:pl-5
                            "
                          >
                            {shownReplies.map(
                              (reply) => (
                                <div
                                  key={
                                    reply.id
                                  }
                                >
                                  <div
                                    className="
                                      flex
                                      items-start
                                      gap-3
                                    "
                                  >
                                    <Avatar
                                      name={
                                        reply
                                          .author
                                          .name
                                      }
                                      small
                                    />

                                    <div className="min-w-0 flex-1">
                                      <div
                                        className="
                                          flex
                                          flex-wrap
                                          items-center
                                          gap-2
                                        "
                                      >
                                        <p
                                          className="
                                            text-xs
                                            font-black
                                            text-slate-900
                                          "
                                        >
                                          {
                                            reply
                                              .author
                                              .name
                                          }
                                        </p>

                                        {reply.author.isContentOwner && (
                                          <span
                                            className="
                                              rounded-full
                                              bg-emerald-50
                                              px-2
                                              py-0.5
                                              text-[9px]
                                              font-black
                                              text-emerald-700
                                            "
                                          >
                                            {copy.ownerLabel}
                                          </span>
                                        )}

                                        {reply.isMine && (
                                          <span
                                            className="
                                              rounded-full
                                              bg-blue-50
                                              px-2
                                              py-0.5
                                              text-[9px]
                                              font-black
                                              text-blue-600
                                            "
                                          >
                                            我的回复
                                          </span>
                                        )}
                                      </div>

                                      <p
                                        className="
                                          mt-1
                                          text-[11px]
                                          text-slate-400
                                        "
                                      >
                                        {
                                          reply.createdAt
                                        }
                                      </p>

                                      <p
                                        className="
                                          mt-2
                                          whitespace-pre-wrap
                                          break-words
                                          text-sm
                                          leading-6
                                          text-slate-700
                                        "
                                      >
                                        <span
                                          className="
                                            mr-1
                                            font-bold
                                            text-blue-600
                                          "
                                        >
                                          回复 @
                                          {
                                            reply
                                              .replyToUser
                                              .name
                                          }
                                        </span>

                                        {
                                          reply.content
                                        }
                                      </p>

                                      <div
                                        className="
                                          mt-2
                                          flex
                                          flex-wrap
                                          items-center
                                          gap-1
                                        "
                                      >
                                        <LikeButton
                                          liked={
                                            reply.liked
                                          }
                                          likes={
                                            reply.likes
                                          }
                                          small
                                          onClick={() =>
                                            toggleReplyLike(
                                              comment.id,
                                              reply.id
                                            )
                                          }
                                        />

                                        <ActionButton
                                          icon="reply"
                                          label="回复"
                                          small
                                          onClick={() =>
                                            openReplyToReply(
                                              reply
                                            )
                                          }
                                        />

                                        {reply.isMine ? (
                                          <ActionButton
                                            icon="delete"
                                            label="删除"
                                            danger
                                            small
                                            onClick={() =>
                                              setDeleteTarget(
                                                {
                                                  rootCommentId:
                                                    comment.id,

                                                  replyId:
                                                    reply.id,

                                                  content:
                                                    reply.content,
                                                }
                                              )
                                            }
                                          />
                                        ) : (
                                          <ActionButton
                                            icon="report"
                                            label="举报"
                                            small
                                            onClick={() => {
                                              setReportTarget(
                                                {
                                                  rootCommentId:
                                                    comment.id,

                                                  replyId:
                                                    reply.id,

                                                  content:
                                                    reply.content,
                                                }
                                              );

                                              setReportReason(
                                                ""
                                              );

                                              setReportMessage(
                                                ""
                                              );
                                            }}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        {/* EXPAND REPLIES */}

                        {hasMoreReplies && (
                          <button
                            type="button"
                            onClick={() =>
                              toggleExpanded(
                                comment.id
                              )
                            }
                            className="
                              mt-4
                              inline-flex
                              min-h-10
                              items-center
                              gap-2
                              rounded-xl
                              px-3
                              text-xs
                              font-black
                              text-blue-600
                              transition
                              hover:bg-blue-50
                            "
                          >
                            {expanded ? (
                              <>
                                <ChevronUp
                                  size={14}
                                />
                                收起回复
                              </>
                            ) : (
                              <>
                                <ChevronDown
                                  size={14}
                                />

                                共{" "}
                                {
                                  publishedReplies.length
                                }{" "}
                                条回复，展开全部
                              </>
                            )}
                          </button>
                        )}

                        {/* REPLY COMPOSER */}

                        {replyComposerOpen &&
                          replyComposerTarget && (
                            <form
                              onSubmit={
                                handleReplySubmit
                              }
                              className="
                                mt-4
                                rounded-2xl
                                border
                                border-blue-100
                                bg-blue-50/40
                                p-3
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
                                <p
                                  className="
                                    min-w-0
                                    truncate
                                    text-xs
                                    font-bold
                                    text-slate-500
                                  "
                                >
                                  回复{" "}
                                  <span className="text-blue-600">
                                    @
                                    {
                                      replyComposerTarget
                                        .user
                                        .name
                                    }
                                  </span>
                                </p>

                                <button
                                  type="button"
                                  onClick={
                                    closeReplyComposer
                                  }
                                  aria-label="取消回复"
                                  className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-slate-400
                                    transition
                                    hover:bg-white
                                    hover:text-slate-700
                                  "
                                >
                                  <X
                                    size={15}
                                  />
                                </button>
                              </div>

                              <textarea
                                value={
                                  replyInput
                                }
                                maxLength={
                                  REPLY_MAX_LENGTH
                                }
                                rows={3}
                                autoFocus
                                onChange={(
                                  event
                                ) => {
                                  setReplyInput(
                                    sanitizeInput(
                                      event
                                        .target
                                        .value,
                                      REPLY_MAX_LENGTH
                                    )
                                  );

                                  setReplyError(
                                    ""
                                  );
                                }}
                                placeholder={`回复 @${replyComposerTarget.user.name}`}
                                className="
                                  mt-2
                                  min-h-24
                                  w-full
                                  resize-y
                                  rounded-xl
                                  border
                                  border-slate-200
                                  bg-white
                                  px-3
                                  py-2.5
                                  text-sm
                                  leading-6
                                  text-slate-900
                                  outline-none
                                  transition
                                  placeholder:text-slate-400
                                  focus:border-blue-400
                                  focus:ring-4
                                  focus:ring-blue-50
                                "
                              />

                              <div
                                className="
                                  mt-2
                                  flex
                                  items-center
                                  justify-between
                                  gap-3
                                "
                              >
                                <div>
                                  {replyError && (
                                    <p
                                      className="
                                        text-xs
                                        font-bold
                                        text-rose-600
                                      "
                                    >
                                      {
                                        replyError
                                      }
                                    </p>
                                  )}
                                </div>

                                <span
                                  className="
                                    shrink-0
                                    text-xs
                                    font-bold
                                    text-slate-400
                                  "
                                >
                                  {
                                    replyInput.length
                                  }
                                  /
                                  {
                                    REPLY_MAX_LENGTH
                                  }
                                </span>
                              </div>

                              <div
                                className="
                                  mt-3
                                  flex
                                  justify-end
                                "
                              >
                                <button
                                  type="submit"
                                  disabled={
                                    !replyInput.trim()
                                  }
                                  className="
                                    inline-flex
                                    min-h-10
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-blue-600
                                    px-4
                                    text-xs
                                    font-black
                                    text-white
                                    transition
                                    hover:bg-blue-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                  "
                                >
                                  <Reply
                                    size={14}
                                  />
                                  回复
                                </button>
                              </div>
                            </form>
                          )}
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        ) : (
          <div
            className="
              rounded-[22px]
              border
              border-dashed
              border-slate-300
              bg-white
              px-5
              py-16
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-slate-100
                text-slate-500
              "
            >
              <MessageCircle
                size={21}
              />
            </div>

            <h3
              className="
                mt-4
                text-sm
                font-black
                text-slate-900
              "
            >
              {copy.emptyTitle}
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              {copy.emptyDescription}
            </p>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}

      {deleteTarget && (
        <ModalShell
          onClose={() =>
            setDeleteTarget(null)
          }
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-rose-50
              text-rose-600
            "
          >
            <Trash2 size={20} />
          </div>

          <h2
            className="
              mt-5
              text-xl
              font-black
              text-slate-950
            "
          >
            永久删除这条
            {deleteTarget.replyId
              ? "回复"
              : "评论"}
            ？
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            删除后无法恢复，请确认是否继续。
          </p>

          <div
            className="
              mt-4
              max-h-28
              overflow-hidden
              rounded-xl
              bg-slate-50
              p-3
              text-xs
              leading-5
              text-slate-500
            "
          >
            {deleteTarget.content}
          </div>

          <div
            className="
              mt-6
              flex
              flex-col-reverse
              gap-3
              sm:flex-row
              sm:justify-end
            "
          >
            <button
              type="button"
              onClick={() =>
                setDeleteTarget(null)
              }
              className={
                secondaryButtonClass
              }
            >
              取消
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="
                min-h-11
                rounded-xl
                bg-rose-600
                px-5
                py-2.5
                text-sm
                font-black
                text-white
                transition
                hover:bg-rose-700
              "
            >
              永久删除
            </button>
          </div>
        </ModalShell>
      )}

      {/* REPORT MODAL */}

      {reportTarget && (
        <ModalShell
          onClose={() => {
            setReportTarget(null);
            setReportReason("");
            setReportMessage("");
          }}
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-amber-50
              text-amber-700
            "
          >
            <Flag size={19} />
          </div>

          <h2
            className="
              mt-5
              text-xl
              font-black
              text-slate-950
            "
          >
            举报评论
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            举报将提交给平台审核，不代表被举报内容已经违规。
          </p>

          <form
            onSubmit={
              handleReportSubmit
            }
            className="mt-5"
          >
            <label
              className="
                text-sm
                font-black
                text-slate-800
              "
            >
              举报原因
            </label>

            <div className="relative mt-2">
              <select
                value={reportReason}
                onChange={(event) => {
                  setReportReason(
                    event.target.value
                  );

                  setReportMessage(
                    ""
                  );
                }}
                className="
                  min-h-11
                  w-full
                  appearance-none
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  py-2.5
                  pl-4
                  pr-10
                  text-sm
                  font-semibold
                  text-slate-700
                  outline-none
                  transition
                  focus:border-blue-400
                  focus:ring-4
                  focus:ring-blue-50
                "
              >
                <option value="">
                  请选择
                </option>

                <option value="spam">
                  垃圾广告
                </option>

                <option value="harassment">
                  骚扰 / 人身攻击
                </option>

                <option value="privacy">
                  泄露个人隐私
                </option>

                <option value="misinformation">
                  疑似虚假或误导信息
                </option>

                <option value="other">
                  其他
                </option>
              </select>

              <ChevronDown
                size={15}
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />
            </div>

            {reportMessage && (
              <p
                className="
                  mt-2
                  text-xs
                  font-bold
                  text-rose-600
                "
              >
                {reportMessage}
              </p>
            )}

            <div
              className="
                mt-6
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={() => {
                  setReportTarget(
                    null
                  );

                  setReportReason("");

                  setReportMessage("");
                }}
                className={
                  secondaryButtonClass
                }
              >
                取消
              </button>

              <button
                type="submit"
                className="
                  min-h-11
                  rounded-xl
                  bg-slate-950
                  px-5
                  py-2.5
                  text-sm
                  font-black
                  text-white
                  transition
                  hover:bg-slate-800
                "
              >
                提交举报
              </button>
            </div>
          </form>
        </ModalShell>
      )}
    </section>
  );
}

function Avatar({
  name,
  small = false,
}: {
  name: string;
  small?: boolean;
}) {
  const initial =
    name.trim().charAt(0) || "S";

  return (
    <div
      className={`
        flex
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-slate-950
        font-black
        text-white
        ${
          small
            ? "h-8 w-8 text-[11px]"
            : "h-10 w-10 text-xs"
        }
      `}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}

function LikeButton({
  liked,
  likes,
  small = false,
  onClick,
}: {
  liked: boolean;
  likes: number;
  small?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={liked}
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-lg
        font-bold
        transition
        ${
          small
            ? "min-h-9 px-2 text-[11px]"
            : "min-h-10 px-2.5 text-xs"
        }
        ${
          liked
            ? "bg-rose-50 text-rose-600"
            : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
        }
      `}
    >
      <Heart
        size={small ? 13 : 14}
        fill={
          liked
            ? "currentColor"
            : "none"
        }
      />

      {likes}
    </button>
  );
}

function ActionButton({
  icon,
  label,
  danger = false,
  small = false,
  onClick,
}: {
  icon:
    | "reply"
    | "delete"
    | "report";

  label: string;

  danger?: boolean;

  small?: boolean;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-lg
        font-bold
        transition
        ${
          small
            ? "min-h-9 px-2 text-[11px]"
            : "min-h-10 px-2.5 text-xs"
        }
        ${
          danger
            ? "text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
        }
      `}
    >
      {icon === "reply" && (
        <Reply
          size={small ? 13 : 14}
        />
      )}

      {icon === "delete" && (
        <Trash2
          size={small ? 13 : 14}
        />
      )}

      {icon === "report" && (
        <Flag
          size={small ? 13 : 14}
        />
      )}

      {label}
    </button>
  );
}

function ModalShell({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-end
        justify-center
        bg-slate-950/60
        p-0
        backdrop-blur-sm
        sm:items-center
        sm:p-4
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          max-h-[90dvh]
          w-full
          max-w-md
          overflow-y-auto
          rounded-t-[26px]
          bg-white
          p-6
          shadow-2xl
          sm:rounded-[26px]
        "
      >
        {children}
      </div>
    </div>
  );
}

function sanitizeInput(
  value: string,
  maxLength: number
) {
  return value
    .replace(/\u0000/g, "")
    .slice(0, maxLength);
}

function normalizeCommentContent(
  value: string
) {
  return value
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

const secondaryButtonClass = `
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
  py-2.5
  text-sm
  font-black
  text-slate-600
  transition
  hover:border-slate-300
  hover:bg-slate-50
  hover:text-slate-950
`;