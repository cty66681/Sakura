"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Bookmark,
  Check,
  ExternalLink,
  Share2,
} from "lucide-react";

type UniversitySidebarData = {
  id: string;
  name: string;
  website: string;
  degree: "大学" | "大学院";
};

type Props = {
  university: UniversitySidebarData;
};

const FAVORITE_KEY =
  "sakura-university-favorites";

const FAVORITE_EVENT =
  "sakura-university-favorite-change";

const menus = [
  {
    id: "info",
    title: "学校介绍",
  },
  {
    id: "course",
    title: "专业设置",
  },
  {
    id: "tuition",
    title: "学费参考",
  },
  {
    id: "gallery",
    title: "校园环境",
  },
  {
    id: "review",
    title: "学生评价",
  },
];

export default function UniversitySidebar({
  university,
}: Props) {
  const [favorite, setFavorite] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("info");

  const [copied, setCopied] =
    useState(false);

  /* =========================================================
     从 localStorage 读取收藏状态
  ========================================================= */

  const syncFavorite = useCallback(() => {
    try {
      const saved =
        localStorage.getItem(
          FAVORITE_KEY
        );

      if (!saved) {
        setFavorite(false);
        return;
      }

      const favorites: string[] =
        JSON.parse(saved);

      setFavorite(
        favorites.includes(
          university.id
        )
      );
    } catch {
      setFavorite(false);
    }
  }, [university.id]);

  /* =========================================================
     初始化收藏 + 实时同步
  ========================================================= */

  useEffect(() => {
    syncFavorite();

    /*
      当前标签页组件之间同步
    */

    const handleFavoriteChange =
      () => {
        syncFavorite();
      };

    /*
      不同浏览器标签页同步
    */

    const handleStorage = (
      event: StorageEvent
    ) => {
      if (
        event.key === FAVORITE_KEY
      ) {
        syncFavorite();
      }
    };

    window.addEventListener(
      FAVORITE_EVENT,
      handleFavoriteChange
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        FAVORITE_EVENT,
        handleFavoriteChange
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, [syncFavorite]);

  /* =========================================================
     页面滚动监听
  ========================================================= */

  useEffect(() => {
    const sections = menus
      .map((menu) =>
        document.getElementById(
          menu.id
        )
      )
      .filter(
        (
          section
        ): section is HTMLElement =>
          section !== null
      );

    if (sections.length === 0) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visibleEntries =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              );

          if (
            visibleEntries.length >
            0
          ) {
            setActiveSection(
              visibleEntries[0]
                .target.id
            );
          }
        },
        {
          rootMargin:
            "-20% 0px -65% 0px",
          threshold: [
            0,
            0.1,
            0.25,
            0.5,
          ],
        }
      );

    sections.forEach(
      (section) =>
        observer.observe(section)
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =========================================================
     收藏 / 取消收藏
  ========================================================= */

  const handleFavorite = () => {
    try {
      const saved =
        localStorage.getItem(
          FAVORITE_KEY
        );

      let favorites: string[] =
        saved
          ? JSON.parse(saved)
          : [];

      if (
        favorites.includes(
          university.id
        )
      ) {
        favorites =
          favorites.filter(
            (id) =>
              id !==
              university.id
          );
      } else {
        favorites = [
          ...favorites,
          university.id,
        ];
      }

      localStorage.setItem(
        FAVORITE_KEY,
        JSON.stringify(favorites)
      );

      /*
        通知当前页面其他组件
      */

      window.dispatchEvent(
        new CustomEvent(
          FAVORITE_EVENT,
          {
            detail: {
              id: university.id,
              favorite:
                favorites.includes(
                  university.id
                ),
            },
          }
        )
      );
    } catch {
      setFavorite(
        (current) => !current
      );
    }
  };

  /* =========================================================
     页面导航
  ========================================================= */

  const handleScroll = (
    id: string
  ) => {
    const element =
      document.getElementById(id);

    if (!element) {
      return;
    }

    setActiveSection(id);

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* =========================================================
     分享
  ========================================================= */

  const handleShare =
    async () => {
      const url =
        window.location.href;

      try {
        if (navigator.share) {
          await navigator.share({
            title:
              university.name,
            text: `查看 ${university.name} 的学校信息`,
            url,
          });

          return;
        }

        await navigator.clipboard.writeText(
          url
        );

        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 1800);
      } catch {
        /*
          用户主动取消系统分享时，
          不需要显示错误。
        */
      }
    };

  /* =========================================================
     官网
  ========================================================= */

  const handleWebsite = () => {
    if (!university.website) {
      return;
    }

    window.open(
      university.website,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =========================================================
     申请
  ========================================================= */

  const handleApply = () => {
    const params =
      new URLSearchParams({
        schoolId:
          university.id,
        schoolName:
          university.name,
        type:
          university.degree,
      });

    window.location.href =
      `/schools/apply?${params.toString()}`;
  };

  return (
    <aside
      className="
        sticky
        top-24
        space-y-5
      "
    >
      {/* ===============================================
          页面导航
      =============================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="text-sm font-bold text-slate-900">
            学校信息
          </p>
        </div>

        <nav className="p-2">
          {menus.map((menu) => {
            const active =
              activeSection ===
              menu.id;

            return (
              <button
                key={menu.id}
                type="button"
                onClick={() =>
                  handleScroll(
                    menu.id
                  )
                }
                className={`
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-medium
                  transition
                  ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
              >
                {menu.title}

                {active && (
                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-blue-600
                    "
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ===============================================
          操作区域
      =============================================== */}

      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
        "
      >
        <p className="text-sm font-bold text-slate-900">
          对这所学校感兴趣？
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          收藏学校、查看官网或进一步了解申请信息。
        </p>

        {/* 申请 */}

        <button
          type="button"
          onClick={handleApply}
          className="
            mt-5
            w-full
            rounded-xl
            bg-blue-600
            px-4
            py-3
            text-sm
            font-bold
            text-white
            transition
            hover:bg-blue-700
            active:scale-[0.98]
          "
        >
          查看申请信息
        </button>

        {/* 收藏 */}

        <button
          type="button"
          onClick={
            handleFavorite
          }
          className={`
            mt-3
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            px-4
            py-3
            text-sm
            font-semibold
            transition
            active:scale-[0.98]
            ${
              favorite
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
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
            ? "已收藏"
            : "收藏学校"}
        </button>

        {/* 分享 */}

        <button
          type="button"
          onClick={handleShare}
          className="
            mt-3
            flex
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
            font-semibold
            text-slate-600
            transition
            hover:border-blue-200
            hover:bg-blue-50
            hover:text-blue-700
            active:scale-[0.98]
          "
        >
          {copied ? (
            <>
              <Check
                size={17}
              />
              链接已复制
            </>
          ) : (
            <>
              <Share2
                size={17}
              />
              分享学校
            </>
          )}
        </button>

        {/* 官网 */}

        {university.website && (
          <button
            type="button"
            onClick={
              handleWebsite
            }
            className="
              mt-3
              flex
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
              font-semibold
              text-slate-600
              transition
              hover:border-blue-200
              hover:bg-blue-50
              hover:text-blue-700
              active:scale-[0.98]
            "
          >
            <ExternalLink
              size={17}
            />
            学校官网
          </button>
        )}
      </div>
    </aside>
  );
}