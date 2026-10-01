"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Trash2,
  ChevronDown,
  PlayCircle,
  Building2,
  CircleAlert,
  Clock3,
  Eye,
  FilePenLine,
  Home,
  Loader2,
  MapPin,
  PauseCircle,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import Container from "@/components/layout/Container";

type ModerationStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "hidden";

type ListingStatus =
  | "available"
  | "paused"
  | "rented"
  | "expired"
  | "hidden";

type FilterKey =
  | "all"
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "paused"
  | "rented";

interface AccountHouse {
  id: number;

  title: string;

  rent: number;
  managementFee: number;

  layout: string;
  area: number;

  prefecture: string;
  city: string;

  station: string | null;
  walkMinutes: number | null;

  moderationStatus: ModerationStatus;
  listingStatus: ListingStatus;

  rejectionReason: string | null;

  views: number;

  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;

  images: {
    id: string;
    url: string;
    sortOrder: number;
  }[];

  location: string;
}

interface AccountHousesResponse {
  success: boolean;
  data: AccountHouse[];
  count: number;
  error?: string;
}

const filters: {
  key: FilterKey;
  label: string;
}[] = [
  {
    key: "all",
    label: "全部",
  },
  {
    key: "draft",
    label: "草稿",
  },
  {
    key: "pending",
    label: "审核中",
  },
  {
    key: "approved",
    label: "已发布",
  },
  {
    key: "rejected",
    label: "未通过",
  },
  {
    key: "paused",
    label: "已暂停",
  },
  {
    key: "rented",
    label: "已出租",
  },
];

function formatYen(value: number) {
  return `¥${value.toLocaleString(
    "ja-JP"
  )}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "zh-CN",
    {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).format(date);
}

function matchesFilter(
  house: AccountHouse,
  filter: FilterKey
) {
  if (filter === "all") {
    return true;
  }

  if (filter === "paused") {
    return (
      house.listingStatus ===
      "paused"
    );
  }

  if (filter === "rented") {
    return (
      house.listingStatus ===
      "rented"
    );
  }

  if (filter === "approved") {
    return (
      house.moderationStatus ===
        "approved" &&
      house.listingStatus !==
        "paused" &&
      house.listingStatus !==
        "rented"
    );
  }

  return (
    house.moderationStatus ===
    filter
  );
}

function StatusBadge({
  house,
}: {
  house: AccountHouse;
}) {
  if (
    house.listingStatus ===
    "rented"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-black text-purple-700">
        <Home size={13} />
        已出租
      </span>
    );
  }

  if (
    house.listingStatus ===
    "paused"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
        <PauseCircle size={13} />
        已暂停
      </span>
    );
  }

  switch (
    house.moderationStatus
  ) {
    case "draft":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
          <FilePenLine
            size={13}
          />
          草稿
        </span>
      );

    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700">
          <Clock3 size={13} />
          审核中
        </span>
      );

    case "approved":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
          <Building2
            size={13}
          />
          已发布
        </span>
      );

    case "rejected":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-700">
          <CircleAlert
            size={13}
          />
          未通过
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500">
          不可用
        </span>
      );
  }
}

export default function AccountHousesPage() {
  const [
    houses,
    setHouses,
  ] = useState<AccountHouse[]>(
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    filter,
    setFilter,
  ] =
    useState<FilterKey>(
      "all"
    );

  const [
    keyword,
    setKeyword,
  ] = useState("");

  const [
    deletingId,
    setDeletingId,
  ] = useState<number | null>(
    null
  );

  const [
    managingId,
    setManagingId,
  ] = useState<number | null>(
    null
  );

  const [
    actionHouseId,
    setActionHouseId,
  ] = useState<number | null>(
    null
  );

  async function loadHouses() {
    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/account/houses",
          {
            method: "GET",
            cache: "no-store",
          }
        );

      const result: AccountHousesResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
            "获取房源失败"
        );
      }

      setHouses(
        result.data ?? []
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "获取房源失败"
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteDraft(
    houseId: number
  ) {
    const confirmed =
      window.confirm(
        "确定要删除这个草稿吗？删除后无法恢复。"
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(
      houseId
    );

    setError("");

    try {
      const response =
        await fetch(
          `/api/account/houses/${houseId}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result?.error ||
            "删除草稿失败"
        );
      }

      setHouses(
        (current) =>
          current.filter(
            (house) =>
              house.id !==
              houseId
          )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "删除草稿失败"
      );
    } finally {
      setDeletingId(
        null
      );
    }
  }

  async function manageHouse(
    houseId: number,
    action:
      | "pause"
      | "resume"
      | "mark_rented"
  ) {
    let message = "";

    if (action === "pause") {
      message =
        "确定暂停这套房源吗？暂停后将不会出现在公开房源列表中。";
    }

    if (action === "resume") {
      message =
        "确定恢复发布这套房源吗？";
    }

    if (
      action ===
      "mark_rented"
    ) {
      message =
        "确定将这套房源标记为已出租吗？标记后将不会继续公开展示。";
    }

    if (
      !window.confirm(message)
    ) {
      return;
    }

    setActionHouseId(
      houseId
    );

    setError("");

    try {
      const response =
        await fetch(
          `/api/account/houses/${houseId}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                action,
              }),
          }
        );

      const text =
        await response.text();

      let result: {
        success?: boolean;
        data?: {
          listingStatus?: ListingStatus;
          updatedAt?: string;
        };
        error?: string;
      } = {};

      if (text) {
        try {
          result =
            JSON.parse(text);
        } catch {
          console.error(
            "[House manage invalid response]",
            {
              status:
                response.status,
              text,
            }
          );

          throw new Error(
            `服务器返回异常（HTTP ${response.status}）`
          );
        }
      }

      if (!text) {
        console.error(
          "[House manage empty response]",
          {
            status:
              response.status,
          }
        );

        throw new Error(
          `服务器没有返回数据（HTTP ${response.status}）`
        );
      }

      if (
        !response.ok ||
        !result.success ||
        !result.data ||
        !result.data.listingStatus ||
        !result.data.updatedAt
      ) {
        throw new Error(
          result?.error ||
            "房源状态更新失败"
        );
      }

      const nextListingStatus =
        result.data.listingStatus;

      const nextUpdatedAt =
        result.data.updatedAt;

      setHouses(
      (current) =>
        current.map(
          (house) =>
            house.id ===
            houseId
              ? {
                  ...house,
                  listingStatus:
                    nextListingStatus,
                  updatedAt:
                    nextUpdatedAt,
                }
              : house
        )
    );

      setManagingId(
        null
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "房源状态更新失败"
      );
    } finally {
      setActionHouseId(
        null
      );
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function initialLoad() {
        try {
        const response =
            await fetch(
            "/api/account/houses",
            {
                method: "GET",
                cache: "no-store",
            }
            );

        const result: AccountHousesResponse =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
            result.error ||
                "获取房源失败"
            );
        }

        if (!cancelled) {
            setHouses(
            result.data ?? []
            );
        }
        } catch (error) {
        if (!cancelled) {
            setError(
            error instanceof Error
                ? error.message
                : "获取房源失败"
            );
        }
        } finally {
        if (!cancelled) {
            setLoading(false);
        }
        }
    }

    void initialLoad();

    return () => {
        cancelled = true;
    };
    }, []);

  const counts =
    useMemo(() => {
      const result: Record<
        FilterKey,
        number
      > = {
        all: houses.length,
        draft: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        paused: 0,
        rented: 0,
      };

      for (
        const house of houses
      ) {
        for (
          const item of filters
        ) {
          if (
            item.key !==
              "all" &&
            matchesFilter(
              house,
              item.key
            )
          ) {
            result[item.key] +=
              1;
          }
        }
      }

      return result;
    }, [houses]);

  const visibleHouses =
    useMemo(() => {
      const normalized =
        keyword
          .trim()
          .toLowerCase();

      return houses.filter(
        (house) => {
          if (
            !matchesFilter(
              house,
              filter
            )
          ) {
            return false;
          }

          if (
            !normalized
          ) {
            return true;
          }

          const target = [
            house.title,
            house.prefecture,
            house.city,
            house.station ?? "",
            house.layout,
          ]
            .join(" ")
            .toLowerCase();

          return target.includes(
            normalized
          );
        }
      );
    }, [
      houses,
      filter,
      keyword,
    ]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <Container>
          <div className="px-4 py-8 sm:py-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                  MY HOUSES
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                  我的房源
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  管理草稿、审核状态和已发布房源。
                </p>
              </div>

              <Link
                href="/houses/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
              >
                <Plus size={17} />
                发布新房源
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-7 sm:py-9">
        <Container>
          <div className="px-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {filters.map(
                    (item) => {
                      const active =
                        filter ===
                        item.key;

                      return (
                        <button
                          key={
                            item.key
                          }
                          type="button"
                          onClick={() =>
                            setFilter(
                              item.key
                            )
                          }
                          className={`
                            inline-flex
                            shrink-0
                            items-center
                            gap-2
                            rounded-xl
                            px-3.5
                            py-2.5
                            text-sm
                            font-black
                            transition
                            ${
                              active
                                ? "bg-slate-950 text-white"
                                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }
                          `}
                        >
                          {
                            item.label
                          }

                          <span
                            className={`
                              rounded-full
                              px-1.5
                              py-0.5
                              text-[10px]
                              ${
                                active
                                  ? "bg-white/15 text-white"
                                  : "bg-white text-slate-400"
                              }
                            `}
                          >
                            {
                              counts[
                                item.key
                              ]
                            }
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1 xl:w-[280px]">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={
                        keyword
                      }
                      onChange={(
                        event
                      ) =>
                        setKeyword(
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="搜索房源"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-blue-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      void loadHouses()
                    }
                    disabled={
                      loading
                    }
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
                    aria-label="刷新"
                  >
                    <RefreshCw
                      size={16}
                      className={
                        loading
                          ? "animate-spin"
                          : ""
                      }
                    />
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <Loader2
                  size={28}
                  className="animate-spin text-blue-600"
                />
              </div>
            ) : visibleHouses.length >
              0 ? (
              <div className="mt-6 space-y-4">
                {visibleHouses.map(
                  (house) => (
                    <article
                      key={
                        house.id
                      }
                      className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="grid md:grid-cols-[220px_minmax(0,1fr)]">
                        <div className="relative flex min-h-[180px] items-center justify-center overflow-hidden bg-slate-100">
                          {house
                            .images[0]
                            ?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={
                                house
                                  .images[0]
                                  .url
                              }
                              alt={
                                house.title
                              }
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : (
                            <Building2
                              size={34}
                              className="text-slate-300"
                            />
                          )}
                        </div>

                        <div className="min-w-0 p-5 sm:p-6">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <StatusBadge
                                  house={
                                    house
                                  }
                                />

                                <span className="text-xs font-semibold text-slate-400">
                                  ID #
                                  {
                                    house.id
                                  }
                                </span>
                              </div>

                              <h2 className="mt-3 line-clamp-2 text-xl font-black text-slate-950">
                                {
                                  house.title
                                }
                              </h2>

                              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                                <span className="font-black text-blue-600">
                                  {formatYen(
                                    house.rent
                                  )}
                                  <span className="ml-1 text-xs text-slate-400">
                                    /
                                    月
                                  </span>
                                </span>

                                {house.layout && (
                                  <span>
                                    {
                                      house.layout
                                    }
                                  </span>
                                )}

                                {house.area >
                                  0 && (
                                  <span>
                                    {
                                      house.area
                                    }
                                    ㎡
                                  </span>
                                )}

                                {house.location && (
                                  <span className="inline-flex items-center gap-1">
                                    <MapPin
                                      size={
                                        14
                                      }
                                    />
                                    {
                                      house.location
                                    }
                                  </span>
                                )}
                              </div>

                              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
                                <span>
                                  更新：
                                  {formatDate(
                                    house.updatedAt
                                  )}
                                </span>

                                <span className="inline-flex items-center gap-1">
                                  <Eye
                                    size={
                                      13
                                    }
                                  />
                                  {
                                    house.views
                                  }{" "}
                                  次浏览
                                </span>
                              </div>

                              {house.moderationStatus ===
                                "rejected" &&
                                house.rejectionReason && (
                                  <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs leading-5 text-rose-700">
                                    审核未通过：
                                    {
                                      house.rejectionReason
                                    }
                                  </div>
                                )}
                            </div>

                            <div className="flex shrink-0 flex-wrap gap-2">
                              {house.moderationStatus ===
                                "draft" && (
                                <>
                                  <Link
                                    href={`/houses/new?edit=${house.id}`}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-black text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                  >
                                    <FilePenLine
                                      size={14}
                                    />
                                    继续编辑
                                  </Link>

                                  <button
                                    type="button"
                                    disabled={
                                      deletingId ===
                                      house.id
                                    }
                                    onClick={() =>
                                      void deleteDraft(
                                        house.id
                                      )
                                    }
                                    className="
                                      inline-flex
                                      items-center
                                      gap-1.5
                                      rounded-xl
                                      border
                                      border-rose-200
                                      px-3.5
                                      py-2.5
                                      text-xs
                                      font-black
                                      text-rose-600
                                      transition
                                      hover:bg-rose-50
                                      disabled:cursor-not-allowed
                                      disabled:opacity-50
                                    "
                                  >
                                    <Trash2 size={14} />

                                    {deletingId ===
                                    house.id
                                      ? "删除中..."
                                      : "删除草稿"}
                                  </button>
                                </>
                              )}

                              {house.moderationStatus ===
                                "approved" &&
                                house.listingStatus ===
                                  "available" && (
                                <Link
                                  href={`/houses/${house.id}`}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-black text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                >
                                  <Eye size={14} />
                                  查看
                                </Link>
                              )}

                              {house.moderationStatus ===
                                "approved" && (
                                <div className="relative">
                                  <button
                                    type="button"
                                    disabled={
                                      actionHouseId ===
                                      house.id
                                    }
                                    onClick={() =>
                                      setManagingId(
                                        (current) =>
                                          current ===
                                          house.id
                                            ? null
                                            : house.id
                                      )
                                    }
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
                                      font-black
                                      text-slate-700
                                      transition
                                      hover:border-blue-200
                                      hover:bg-blue-50
                                      hover:text-blue-600
                                      disabled:cursor-not-allowed
                                      disabled:opacity-50
                                    "
                                  >
                                    {actionHouseId ===
                                    house.id
                                      ? "处理中..."
                                      : "管理"}

                                    <ChevronDown
                                      size={14}
                                    />
                                  </button>

                                  {managingId ===
                                    house.id && (
                                    <div
                                      className="
                                        absolute
                                        right-0
                                        top-full
                                        z-20
                                        mt-2
                                        min-w-[170px]
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-1.5
                                        shadow-xl
                                      "
                                    >
                                      {house.listingStatus ===
                                        "available" && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            void manageHouse(
                                              house.id,
                                              "pause"
                                            )
                                          }
                                          className="
                                            flex
                                            w-full
                                            items-center
                                            gap-2
                                            rounded-lg
                                            px-3
                                            py-2.5
                                            text-left
                                            text-xs
                                            font-bold
                                            text-slate-700
                                            transition
                                            hover:bg-slate-100
                                          "
                                        >
                                          <PauseCircle
                                            size={15}
                                          />
                                          暂停发布
                                        </button>
                                      )}

                                      {house.listingStatus ===
                                        "paused" && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            void manageHouse(
                                              house.id,
                                              "resume"
                                            )
                                          }
                                          className="
                                            flex
                                            w-full
                                            items-center
                                            gap-2
                                            rounded-lg
                                            px-3
                                            py-2.5
                                            text-left
                                            text-xs
                                            font-bold
                                            text-slate-700
                                            transition
                                            hover:bg-slate-100
                                          "
                                        >
                                          <PlayCircle
                                            size={15}
                                          />
                                          恢复发布
                                        </button>
                                      )}

                                      {(house.listingStatus ===
                                        "available" ||
                                        house.listingStatus ===
                                          "paused") && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            void manageHouse(
                                              house.id,
                                              "mark_rented"
                                            )
                                          }
                                          className="
                                            flex
                                            w-full
                                            items-center
                                            gap-2
                                            rounded-lg
                                            px-3
                                            py-2.5
                                            text-left
                                            text-xs
                                            font-bold
                                            text-purple-700
                                            transition
                                            hover:bg-purple-50
                                          "
                                        >
                                          <Home
                                            size={15}
                                          />
                                          标记已出租
                                        </button>
                                      )}

                                      {house.listingStatus ===
                                        "rented" && (
                                        <div className="px-3 py-2.5 text-xs font-bold text-slate-400">
                                          该房源已出租
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            ) : (
              <div className="mt-6 rounded-[24px] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
                <Home
                  size={34}
                  className="mx-auto text-slate-300"
                />

                <h2 className="mt-4 text-lg font-black text-slate-900">
                  没有找到房源
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  当前分类下还没有房源。
                </p>

                <Link
                  href="/houses/new"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  <Plus
                    size={16}
                  />
                  发布房源
                </Link>
              </div>
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}