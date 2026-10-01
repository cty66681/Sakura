"use client";

import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  Suspense,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  ChevronDown,
  CircleAlert,
  FileText,
  Home,
  MessageSquareWarning,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

import Container from "@/components/layout/Container";

import {
  HOUSE_LISTING_STATUS_LABELS,
  type HouseListingStatus,
} from "@/data/houses";

type PostType = "house" | "job" | "experience" | "scam";

type PostStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected";

interface UserPost {
  id: number;
  type: PostType;

  title: string;
  summary: string;

  /*
   * 内容本身的发布 / 审核状态。
   *
   * 和房源是否正在受理完全是两回事。
   */
  status: PostStatus;

  /*
   * 只给 house 使用。
   *
   * published 之后，
   * 房源才会有自己的生命周期状态。
   */
  listingStatus?: HouseListingStatus;

  createdAt: string;
  updatedAt: string;
  views: number;

  href?: string;
}

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 我的发布
|
| GET /api/me/posts
|
| Query:
| {
|   q?: string;
|   type?: "house" | "job" | "experience" | "scam";
|   status?: "draft" | "pending" | "published" | "rejected";
|   sort?: "updated" | "created" | "views";
|   page?: number;
|   limit?: number;
| }
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| TODO [API - DELETE]
|--------------------------------------------------------------------------
|
| 删除自己的发布
|
| DELETE /api/me/posts/:id
|
| 后端需要校验：
| - 当前用户是否为内容作者
| - 是否允许删除当前状态内容
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| TODO [API - PATCH]
|--------------------------------------------------------------------------
|
| 下架 / 重新提交 / 状态修改
|
| PATCH /api/me/posts/:id
|
| Body:
| {
|   action: "unpublish" | "resubmit";
| }
|
|--------------------------------------------------------------------------
*/

const mockPosts: UserPost[] = [
  {
    id: 1,
    type: "house",
    title: "池袋 1LDK",
    summary:
      "池袋站步行8分钟，可养宠物，免礼金。",
    status: "published",
    listingStatus: "available",
    createdAt: "2026-08-20",
    updatedAt: "2026-08-28",
    views: 356,
    href: "/houses/1",
  },
  {
    id: 2,
    type: "house",
    title: "新宿 Studio",
    summary:
      "新宿核心区域，家具家电齐全。",
    status: "published",
    listingStatus: "paused",
    createdAt: "2026-08-29",
    updatedAt: "2026-09-01",
    views: 128,
    href: "/houses/2",
  },
  {
    id: 3,
    type: "house",
    title: "中野 1DK",
    summary:
      "南向采光，可咨询宠物入住条件。",
    status: "published",
    listingStatus: "rented",
    createdAt: "2026-08-30",
    updatedAt: "2026-09-03",
    views: 209,
    href: "/houses/3",
  },
  {
    id: 4,
    type: "job",
    title: "React Frontend Engineer",
    summary: "东京池袋，前端开发，全职现场。",
    status: "published",
    createdAt: "2026-08-12",
    updatedAt: "2026-08-22",
    views: 281,
    href: "/jobs/4",
  },
  {
    id: 5,
    type: "experience",
    title: "第一次在日本租房需要注意什么",
    summary: "整理初期费用、保证会社、更新费等注意事项。",
    status: "published",
    createdAt: "2026-08-15",
    updatedAt: "2026-08-18",
    views: 623,
    href: "/experience/1",
  },
  {
    id: 6,
    type: "experience",
    title: "日本找工作面试的一些经验",
    summary: "分享简历、面试和入职前确认事项。",
    status: "draft",
    createdAt: "2026-08-27",
    updatedAt: "2026-08-30",
    views: 0,
  },
  {
    id: 7,
    type: "scam",
    title: "某租房中介退款纠纷报告",
    summary: "已提交合同、付款记录及沟通记录，等待审核。",
    status: "pending",
    createdAt: "2026-08-30",
    updatedAt: "2026-08-30",
    views: 0,
  },
];

const typeOptions = [
  { value: "all", label: "全部类型" },
  { value: "house", label: "房源" },
  { value: "job", label: "工作" },
  { value: "experience", label: "经验" },
  { value: "scam", label: "避坑" },
] as const;

const statusOptions = [
  { value: "all", label: "全部发布状态" },
  { value: "published", label: "已发布" },
  { value: "pending", label: "审核中" },
  { value: "draft", label: "草稿" },
  { value: "rejected", label: "未通过" },
] as const;

const houseListingStatusOptions = [
  {
    value: "all",
    label: "全部房源状态",
  },
  {
    value: "available",
    label: "可申请",
  },
  {
    value: "paused",
    label: "暂停受理",
  },
  {
    value: "rented",
    label: "已出租",
  },
  {
    value: "expired",
    label: "已过期",
  },
  {
    value: "hidden",
    label: "已隐藏",
  },
] as const;

function AccountPostsPageContent() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const typeFromUrl = parsePostType(
    searchParams.get("type")
  );

  const [posts, setPosts] =
    useState<UserPost[]>(mockPosts);

  const [searchInput, setSearchInput] =
    useState("");

  const [keyword, setKeyword] =
    useState("");

  const type:
    | "all"
    | PostType =
    typeFromUrl;

  function setType(
    nextType:
      | "all"
      | PostType
  ) {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (nextType === "all") {
      params.delete("type");
    } else {
      params.set(
        "type",
        nextType
      );
    }

    const query =
      params.toString();

    router.push(
      query
        ? `/account/posts?${query}`
        : "/account/posts",
      {
        scroll: false,
      }
    );
  }

  const [status, setStatus] = useState<
    "all" | PostStatus
  >("all");

  const [sort, setSort] = useState("updated");

  const [
    houseListingStatus,
    setHouseListingStatus,
  ] = useState<
    "all" | HouseListingStatus
  >("all");

  const [
    rentedTarget,
    setRentedTarget,
  ] = useState<UserPost | null>(
    null
  );

  const isHouseMode =
    type === "house";

  const [deleteTarget, setDeleteTarget] =
    useState<UserPost | null>(null);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (keyword) {
      const q = keyword.toLowerCase();

      result = result.filter((post) =>
        [
          post.title,
          post.summary,
          getTypeLabel(post.type),
          getStatusLabel(post.status),
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    if (type !== "all") {
      result = result.filter(
        (post) => post.type === type
      );
    }

    if (status !== "all") {
      result = result.filter(
        (post) => post.status === status
      );
    }

    if (
      type === "house" &&
      houseListingStatus !== "all"
    ) {
      result = result.filter(
        (post) =>
          post.type === "house" &&
          post.listingStatus ===
            houseListingStatus
      );
    }

    if (sort === "updated") {
      result.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
      );
    }

    if (sort === "created") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    if (sort === "views") {
      result.sort(
        (a, b) => b.views - a.views
      );
    }

    return result;
  }, [
  posts,
  keyword,
  type,
  status,
  sort,
  houseListingStatus,
]);

  const counts = useMemo(() => {
    const scopedPosts =
      type === "all"
        ? posts
        : posts.filter(
            (post) =>
              post.type === type
          );

    return {
      all: scopedPosts.length,

      published:
        scopedPosts.filter(
          (post) =>
            post.status ===
            "published"
        ).length,

      pending:
        scopedPosts.filter(
          (post) =>
            post.status ===
            "pending"
        ).length,

      draft:
        scopedPosts.filter(
          (post) =>
            post.status ===
            "draft"
        ).length,

      rejected:
        scopedPosts.filter(
          (post) =>
            post.status ===
            "rejected"
        ).length,
    };
  }, [posts, type]);

  function handleSearch() {
    setKeyword(searchInput.trim());
  }

  function clearFilters() {
    setSearchInput("");
    setKeyword("");

    setType("all");
    setStatus("all");

    setHouseListingStatus(
      "all"
    );

    setSort("updated");
  }

  function handleHouseListingStatusChange(
    postId: number,
    nextStatus:
      | "available"
      | "paused"
      | "rented"
  ) {
    /*
    * TODO [API - PATCH]
    *
    * PATCH /api/houses/:id/status
    *
    * Body:
    *
    * {
    *   listingStatus:
    *     "available"
    *     | "paused"
    *     | "rented"
    * }
    *
    * 后端必须：
    *
    * 1. 从 Session 获取当前 userId
    *
    * 2. 查询真实 house
    *
    * 3. 验证：
    *
    *    house.authorId === session.user.id
    *
    * 4. 绝对不能相信前端传 authorId
    *
    * 5. 只允许：
    *
    *    available -> paused
    *    paused    -> available
    *
    *    available -> rented
    *    paused    -> rented
    *
    * 6. expired：
    *    后台自动任务处理
    *
    * 7. hidden：
    *    管理员处理
    *
    * 8. 用户咨询 / 聊天 / 申请联系方式
    *    永远不能修改 listingStatus
    *
    * 9. paused / rented 后：
    *    禁止创建新的房源咨询；
    *    已存在的会话仍然保留。
    */

    setPosts((current) =>
      current.map((post) => {
        if (
          post.id !== postId ||
          post.type !== "house" ||
          post.status !==
            "published" ||
          !post.listingStatus
        ) {
          return post;
        }

        const currentStatus =
          post.listingStatus;

        const allowed =
          (currentStatus ===
            "available" &&
            (
              nextStatus ===
                "paused" ||
              nextStatus ===
                "rented"
            )) ||
          (currentStatus ===
            "paused" &&
            (
              nextStatus ===
                "available" ||
              nextStatus ===
                "rented"
            ));

        if (!allowed) {
          return post;
        }

        return {
          ...post,
          listingStatus:
            nextStatus,
        };
      })
    );
  }

  function handleConfirmRented() {
    if (!rentedTarget) {
      return;
    }

    handleHouseListingStatusChange(
      rentedTarget.id,
      "rented"
    );

    setRentedTarget(null);
  }

  function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    /*
    TODO [API - DELETE]

    DELETE /api/me/posts/:id

    await deleteMyPost(deleteTarget.id);
    */

    setPosts((current) =>
      current.filter(
        (post) =>
          post.id !== deleteTarget.id
      )
    );

    setDeleteTarget(null);
  }

  const hasFilters =
    keyword !== "" ||
    type !== "all" ||
    status !== "all";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================================================= */}
      {/* TOP */}
      {/* ================================================= */}

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
              href="/account"
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

              返回个人中心
            </Link>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <section className="py-8 sm:py-10">
        <Container>
          <div className="px-4">
            {/* Header */}

            <div
              className="
                flex
                flex-col
                gap-5
                md:flex-row
                md:items-end
                md:justify-between
              "
            >
              <div>
                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-blue-600
                  "
                >
                  {isHouseMode
                    ? "MY HOUSES"
                    : "MY POSTS"}
                </p>

                <h1
                  className="
                    mt-2
                    text-3xl
                    font-black
                    tracking-tight
                    text-slate-950
                  "
                >
                  {isHouseMode
                    ? "我的房源"
                    : "我的发布"}
                </h1>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  {isHouseMode
                    ? "管理你发布的房源、受理状态和公开状态。"
                    : "管理你发布的房源、工作、经验和避坑内容。"}
                </p>
              </div>

              <Link
                href={
                  isHouseMode
                    ? "/account/publish?type=house"
                    : "/account/publish"
                }
                className="
                  inline-flex
                  w-fit
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-3
                  text-sm
                  font-black
                  text-white
                  shadow-lg
                  shadow-blue-600/15
                  transition
                  hover:bg-blue-700
                "
              >
                <Plus size={18} />

                {isHouseMode
                  ? "发布房源"
                  : "发布新内容"}
              </Link>
            </div>

            {/* ================================================= */}
            {/* STATUS */}
            {/* ================================================= */}

            <div
              className="
                mt-8
                grid
                grid-cols-2
                gap-3
                lg:grid-cols-5
              "
            >
              <StatusButton
                label="全部"
                value={counts.all}
                active={status === "all"}
                onClick={() =>
                  setStatus("all")
                }
              />

              <StatusButton
                label="已发布"
                value={counts.published}
                active={
                  status === "published"
                }
                onClick={() =>
                  setStatus("published")
                }
                color="emerald"
              />

              <StatusButton
                label="审核中"
                value={counts.pending}
                active={
                  status === "pending"
                }
                onClick={() =>
                  setStatus("pending")
                }
                color="amber"
              />

              <StatusButton
                label="草稿"
                value={counts.draft}
                active={
                  status === "draft"
                }
                onClick={() =>
                  setStatus("draft")
                }
              />

              <StatusButton
                label="未通过"
                value={counts.rejected}
                active={
                  status === "rejected"
                }
                onClick={() =>
                  setStatus("rejected")
                }
                color="rose"
              />
            </div>

            {/* ================================================= */}
            {/* FILTER */}
            {/* ================================================= */}

            <div
              className="
                mt-6
                rounded-[24px]
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  lg:flex-row
                "
              >
                {/* Search */}

                <div
                  className="
                    flex
                    min-w-0
                    flex-1
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    transition
                    focus-within:border-blue-400
                    focus-within:bg-white
                  "
                >
                  <div
                    className="
                      flex
                      flex-1
                      items-center
                    "
                  >
                    <Search
                      size={18}
                      className="
                        ml-4
                        shrink-0
                        text-slate-400
                      "
                    />

                    <input
                      value={searchInput}
                      onChange={(e) =>
                        setSearchInput(
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter"
                        ) {
                          handleSearch();
                        }
                      }}
                      placeholder="搜索我的发布..."
                      className="
                        min-w-0
                        flex-1
                        bg-transparent
                        px-3
                        py-3
                        text-sm
                        text-slate-900
                        outline-none
                        placeholder:text-slate-400
                      "
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="
                      border-l
                      border-slate-200
                      px-5
                      text-sm
                      font-bold
                      text-blue-600
                      transition
                      hover:bg-blue-50
                    "
                  >
                    搜索
                  </button>
                </div>

                {/* Type */}

                <SelectBox
                  value={type}
                  onChange={(value) => {
                    const nextType =
                      value as
                        | "all"
                        | PostType;

                    setType(nextType);

                    if (
                      nextType !== "house"
                    ) {
                      setHouseListingStatus(
                        "all"
                      );
                    }
                  }}
                >
                  {typeOptions.map(
                    (item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </SelectBox>

                {/* Status */}

                <SelectBox
                  value={status}
                  onChange={(value) =>
                    setStatus(
                      value as
                        | "all"
                        | PostStatus
                    )
                  }
                >
                  {statusOptions.map(
                    (item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </SelectBox>

                {isHouseMode && (
                  <SelectBox
                    value={
                      houseListingStatus
                    }
                    onChange={(value) =>
                      setHouseListingStatus(
                        value as
                          | "all"
                          | HouseListingStatus
                      )
                    }
                  >
                    {houseListingStatusOptions.map(
                      (item) => (
                        <option
                          key={item.value}
                          value={item.value}
                        >
                          {item.label}
                        </option>
                      )
                    )}
                  </SelectBox>
                )}

                {/* Sort */}

                <SelectBox
                  value={sort}
                  onChange={setSort}
                >
                  <option value="updated">
                    最近更新
                  </option>

                  <option value="created">
                    最近创建
                  </option>

                  <option value="views">
                    浏览最多
                  </option>
                </SelectBox>
              </div>

              {hasFilters && (
                <div
                  className="
                    mt-4
                    flex
                    flex-wrap
                    items-center
                    gap-2
                    border-t
                    border-slate-100
                    pt-4
                  "
                >
                  {keyword && (
                    <FilterChip
                      label={`搜索：${keyword}`}
                      onRemove={() => {
                        setKeyword("");
                        setSearchInput("");
                      }}
                    />
                  )}

                  {type !== "all" && (
                    <FilterChip
                      label={getTypeLabel(type)}
                      onRemove={() =>
                        setType("all")
                      }
                    />
                  )}

                  {status !== "all" && (
                    <FilterChip
                      label={getStatusLabel(
                        status
                      )}
                      onRemove={() =>
                        setStatus("all")
                      }
                    />
                  )}

                  {isHouseMode &&
                    houseListingStatus !==
                      "all" && (
                      <FilterChip
                        label={
                          HOUSE_LISTING_STATUS_LABELS[
                            houseListingStatus
                          ]
                        }
                        onRemove={() =>
                          setHouseListingStatus(
                            "all"
                          )
                        }
                      />
                    )}

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      ml-1
                      text-xs
                      font-bold
                      text-slate-400
                      transition
                      hover:text-blue-600
                    "
                  >
                    清除全部
                  </button>
                </div>
              )}
            </div>

            {/* ================================================= */}
            {/* LIST */}
            {/* ================================================= */}

            <div className="mt-6">
              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-between
                "
              >
                <p
                  className="
                    text-sm
                    font-bold
                    text-slate-500
                  "
                >
                  共{" "}
                  <span className="text-slate-900">
                    {filteredPosts.length}
                  </span>{" "}
                  条内容
                </p>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="space-y-4">
                  {filteredPosts.map(
                    (post) => (
                      <PostCard
                        key={`${post.type}-${post.id}`}
                        post={post}
                        onDelete={() =>
                          setDeleteTarget(post)
                        }
                        onHouseListingStatusChange={(
                          nextStatus
                        ) =>
                          handleHouseListingStatusChange(
                            post.id,
                            nextStatus
                          )
                        }
                        onMarkRented={() =>
                          setRentedTarget(post)
                        }
                      />
                    )
                  )}
                </div>
              ) : (
                <div
                  className="
                    rounded-[24px]
                    border
                    border-dashed
                    border-slate-300
                    bg-white
                    px-6
                    py-20
                    text-center
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
                    <Search size={24} />
                  </div>

                  <h2
                    className="
                      mt-5
                      font-black
                      text-slate-900
                    "
                  >
                    没有找到符合条件的内容
                  </h2>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-500
                    "
                  >
                    可以修改筛选条件或者发布新的内容。
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      mt-5
                      text-sm
                      font-bold
                      text-blue-600
                      hover:text-blue-700
                    "
                  >
                    清除筛选条件
                  </button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* DELETE MODAL */}
      {/* ================================================= */}

      {deleteTarget && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-950/60
            p-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              w-full
              max-w-md
              rounded-[24px]
              bg-white
              p-6
              shadow-2xl
            "
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
              确定删除这条内容？
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-slate-500
              "
            >
              「{deleteTarget.title}」
              删除后将无法恢复。
            </p>

            <div
              className="
                mt-6
                flex
                justify-end
                gap-3
              "
            >
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                className="
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-slate-600
                  transition
                  hover:bg-slate-50
                "
              >
                取消
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="
                  rounded-xl
                  bg-rose-600
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-rose-700
                "
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {rentedTarget && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-950/60
            p-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              w-full
              max-w-md
              rounded-[24px]
              bg-white
              p-6
              shadow-2xl
            "
          >
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-slate-100
                text-slate-700
              "
            >
              <Home size={20} />
            </div>

            <h2
              className="
                mt-5
                text-xl
                font-black
                text-slate-950
              "
            >
              确认房源已经出租？
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-slate-500
              "
            >
              「{rentedTarget.title}」
              标记为已出租后，
              将停止接受新的房源咨询。
              已存在的聊天记录不会删除。
            </p>

            <div
              className="
                mt-6
                flex
                justify-end
                gap-3
              "
            >
              <button
                type="button"
                onClick={() =>
                  setRentedTarget(
                    null
                  )
                }
                className="
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-slate-600
                  transition
                  hover:bg-slate-50
                "
              >
                取消
              </button>

              <button
                type="button"
                onClick={
                  handleConfirmRented
                }
                className="
                  rounded-xl
                  bg-slate-950
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-slate-800
                "
              >
                确认已出租
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function AccountPostsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50">
          <Container>
            <div className="px-4 py-10">
              <div className="h-40 animate-pulse rounded-[24px] border border-slate-200 bg-white" />
            </div>
          </Container>
        </main>
      }
    >
      <AccountPostsPageContent />
    </Suspense>
  );
}

/* ================================================= */
/* POST CARD */
/* ================================================= */

function PostCard({
  post,
  onDelete,
  onHouseListingStatusChange,
  onMarkRented,
}: {
  post: UserPost;

  onDelete: () => void;

  onHouseListingStatusChange: (
    nextStatus:
      | "available"
      | "paused"
  ) => void;

  onMarkRented: () => void;
}) {

  const editHref =
    `/account/posts/${post.type}/${post.id}/edit`;

  return (
    <article
      className="
        rounded-[24px]
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition
        hover:border-slate-300
        hover:shadow-md
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          md:flex-row
          md:items-start
          md:justify-between
        "
      >
        <div
          className="
            flex
            min-w-0
            flex-1
            gap-4
          "
        >
          <div
            className={`
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              ${getTypeIconClass(
                post.type
              )}
            `}
          >
            {post.type === "house" && <Home size={21} />}

            {post.type === "job" && (
            <BriefcaseBusiness size={21} />
            )}

            {post.type === "experience" && (
            <FileText size={21} />
            )}

            {post.type === "scam" && (
            <MessageSquareWarning size={21} />
            )}
            
          </div>

          <div className="min-w-0 flex-1">
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
                  text-xs
                  font-bold
                  text-slate-400
                "
              >
                {getTypeLabel(post.type)}
              </span>

              <StatusBadge
                status={post.status}
              />
            </div>

            {post.type === "house" &&
              post.status ===
                "published" &&
              post.listingStatus && (
                <HouseListingStatusBadge
                  status={
                    post.listingStatus
                  }
                />
              )}

            <h2
              className="
                mt-2
                text-lg
                font-black
                text-slate-950
              "
            >
              {post.title}
            </h2>

            <p
              className="
                mt-2
                max-w-3xl
                text-sm
                leading-6
                text-slate-500
              "
            >
              {post.summary}
            </p>

            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-x-5
                gap-y-2
                text-xs
                text-slate-400
              "
            >
              <span>
                创建：{post.createdAt}
              </span>

              <span>
                更新：{post.updatedAt}
              </span>

              {post.status ===
                "published" && (
                <span>
                  浏览：{post.views}
                </span>
              )}
            </div>

            {post.status ===
              "rejected" && (
              <div
                className="
                  mt-4
                  flex
                  items-start
                  gap-2
                  rounded-xl
                  border
                  border-rose-100
                  bg-rose-50
                  p-3
                  text-xs
                  leading-5
                  text-rose-700
                "
              >
                <CircleAlert
                  size={16}
                  className="mt-0.5 shrink-0"
                />

                内容未通过审核，请根据审核意见修改后重新提交。
              </div>
            )}

            {post.status ===
              "pending" &&
              post.type === "scam" && (
                <div
                  className="
                    mt-4
                    flex
                    items-start
                    gap-2
                    rounded-xl
                    border
                    border-amber-100
                    bg-amber-50
                    p-3
                    text-xs
                    leading-5
                    text-amber-800
                  "
                >
                  <ShieldCheck
                    size={16}
                    className="mt-0.5 shrink-0"
                  />

                  避坑报告正在审核事实描述及证据资料。
                </div>
              )}
          </div>
        </div>

        {/* Actions */}

        {post.type === "house" &&
          post.status ===
            "published" &&
          post.listingStatus ===
            "available" && (
            <button
              type="button"
              onClick={() =>
                onHouseListingStatusChange(
                  "paused"
                )
              }
              className="
                rounded-xl
                border
                border-amber-200
                bg-amber-50
                px-3.5
                py-2.5
                text-xs
                font-bold
                text-amber-700
                transition
                hover:bg-amber-100
              "
            >
              暂停受理
            </button>
          )}

        {post.type === "house" &&
          post.status ===
            "published" &&
          post.listingStatus ===
            "paused" && (
            <button
              type="button"
              onClick={() =>
                onHouseListingStatusChange(
                  "available"
                )
              }
              className="
                rounded-xl
                border
                border-emerald-200
                bg-emerald-50
                px-3.5
                py-2.5
                text-xs
                font-bold
                text-emerald-700
                transition
                hover:bg-emerald-100
              "
            >
              恢复受理
            </button>
          )}

        {post.type === "house" &&
          post.status ===
            "published" &&
          (
            post.listingStatus ===
              "available" ||
            post.listingStatus ===
              "paused"
          ) && (
            <button
              type="button"
              onClick={
                onMarkRented
              }
              className="
                rounded-xl
                border
                border-slate-300
                bg-white
                px-3.5
                py-2.5
                text-xs
                font-bold
                text-slate-700
                transition
                hover:bg-slate-100
              "
            >
              标记已出租
            </button>
          )}

        <div
          className="
            flex
            shrink-0
            flex-wrap
            items-center
            gap-2
            md:justify-end
          "
        >
          {post.status ===
            "published" &&
            post.href && (
              <Link
                href={post.href}
                className="
                  rounded-xl
                  border
                  border-slate-200
                  px-3.5
                  py-2.5
                  text-xs
                  font-bold
                  text-slate-600
                  transition
                  hover:border-slate-300
                  hover:bg-slate-50
                  hover:text-slate-900
                "
              >
                查看
              </Link>
            )}

          <Link
            href={editHref}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-xl
              border
              border-slate-200
              px-3.5
              py-2.5
              text-xs
              font-bold
              text-slate-600
              transition
              hover:border-blue-200
              hover:bg-blue-50
              hover:text-blue-600
            "
          >
            <Pencil size={14} />

            编辑
          </Link>

          <button
            type="button"
            onClick={onDelete}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-xl
              border
              border-slate-200
              px-3.5
              py-2.5
              text-xs
              font-bold
              text-slate-500
              transition
              hover:border-rose-200
              hover:bg-rose-50
              hover:text-rose-600
            "
          >
            <Trash2 size={14} />

            删除
          </button>
        </div>
      </div>
    </article>
  );
}

/* ================================================= */
/* STATUS */
/* ================================================= */

function StatusBadge({
  status,
}: {
  status: PostStatus;
}) {
  const styles: Record<
    PostStatus,
    string
  > = {
    published:
      "bg-emerald-50 text-emerald-700 border-emerald-100",
    pending:
      "bg-amber-50 text-amber-700 border-amber-100",
    draft:
      "bg-slate-50 text-slate-500 border-slate-200",
    rejected:
      "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <span
      className={`
        rounded-full
        border
        px-2.5
        py-1
        text-[11px]
        font-black
        ${styles[status]}
      `}
    >
      {getStatusLabel(status)}
    </span>
  );
}

function HouseListingStatusBadge({
  status,
}: {
  status: HouseListingStatus;
}) {
  const styles: Record<
    HouseListingStatus,
    string
  > = {
    available:
      "border-emerald-100 bg-emerald-50 text-emerald-700",

    paused:
      "border-amber-100 bg-amber-50 text-amber-700",

    rented:
      "border-slate-200 bg-slate-100 text-slate-600",

    expired:
      "border-orange-100 bg-orange-50 text-orange-700",

    hidden:
      "border-rose-100 bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`
        rounded-full
        border
        px-2.5
        py-1
        text-[11px]
        font-black
        ${styles[status]}
      `}
    >
      {
        HOUSE_LISTING_STATUS_LABELS[
          status
        ]
      }
    </span>
  );
}

function StatusButton({
  label,
  value,
  active,
  onClick,
  color = "slate",
}: {
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
  color?:
    | "slate"
    | "emerald"
    | "amber"
    | "rose";
}) {
  const valueClass = {
    slate: "text-slate-950",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
  }[color];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-[20px]
        border
        p-4
        text-left
        shadow-sm
        transition
        ${
          active
            ? "border-slate-950 bg-slate-950"
            : "border-slate-200 bg-white hover:border-slate-300"
        }
      `}
    >
      <div
        className={`
          text-2xl
          font-black
          ${
            active
              ? "text-white"
              : valueClass
          }
        `}
      >
        {value}
      </div>

      <div
        className={`
          mt-1
          text-xs
          font-bold
          ${
            active
              ? "text-slate-300"
              : "text-slate-500"
          }
        `}
      >
        {label}
      </div>
    </button>
  );
}

/* ================================================= */
/* FILTER */
/* ================================================= */

function SelectBox({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          min-w-[150px]
          appearance-none
          rounded-xl
          border
          border-slate-200
          bg-white
          py-3
          pl-4
          pr-10
          text-sm
          font-semibold
          text-slate-600
          outline-none
          transition
          focus:border-blue-400
        "
      >
        {children}
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
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <div
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        border-blue-100
        bg-blue-50
        py-1.5
        pl-3
        pr-2
        text-xs
        font-semibold
        text-blue-700
      "
    >
      {label}

      <button
        type="button"
        onClick={onRemove}
        className="
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded-full
          transition
          hover:bg-blue-100
        "
      >
        <X size={12} />
      </button>
    </div>
  );
}

/* ================================================= */
/* HELPERS */
/* ================================================= */

function parsePostType(
  value: string | null
): "all" | PostType {
  if (
    value === "house" ||
    value === "job" ||
    value === "experience" ||
    value === "scam"
  ) {
    return value;
  }

  return "all";
}

function getTypeLabel(
  type: PostType
) {
  if (type === "house") {
    return "房源";
  }

  if (type === "job") {
    return "工作";
  }

  if (type === "experience") {
    return "经验";
  }

  return "避坑";
}

function getStatusLabel(
  status: PostStatus
) {
  if (status === "published") {
    return "已发布";
  }

  if (status === "pending") {
    return "审核中";
  }

  if (status === "draft") {
    return "草稿";
  }

  return "未通过";
}

function getTypeIconClass(
  type: PostType
) {
  if (type === "house") {
    return "bg-blue-50 text-blue-600";
  }

  if (type === "job") {
    return "bg-violet-50 text-violet-600";
  }

  if (type === "experience") {
    return "bg-emerald-50 text-emerald-600";
  }

  return "bg-rose-50 text-rose-600";
}