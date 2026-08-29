"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ExternalLink,
  Heart,
  Send,
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

const menus = [
  { id: "info", title: "学校介绍" },
  { id: "course", title: "专业设置" },
  { id: "tuition", title: "学费参考" },
  { id: "gallery", title: "校园环境" },
  { id: "review", title: "学生评价" },
];

const FAVORITE_KEY = "sakura-university-favorites";

export default function UniversitySidebar({
  university,
}: Props) {
  const [favorite, setFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] =
    useState("info");

  /* =========================================================
     初始化收藏状态
  ========================================================= */

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAVORITE_KEY);

      if (!saved) return;

      const favorites: string[] = JSON.parse(saved);

      setFavorite(favorites.includes(university.id));
    } catch {
      setFavorite(false);
    }
  }, [university.id]);

  /* =========================================================
     页面滚动时自动更新导航高亮
  ========================================================= */

  useEffect(() => {
    const sections = menus
      .map((menu) =>
        document.getElementById(menu.id)
      )
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio -
              a.intersectionRatio
          );

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-120px 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    sections.forEach((section) =>
      observer.observe(section)
    );

    return () => observer.disconnect();
  }, []);

  /* =========================================================
     收藏
  ========================================================= */

  const handleFavorite = () => {
    try {
      const saved =
        localStorage.getItem(FAVORITE_KEY);

      let favorites: string[] = saved
        ? JSON.parse(saved)
        : [];

      if (favorites.includes(university.id)) {
        favorites = favorites.filter(
          (id) => id !== university.id
        );

        setFavorite(false);
      } else {
        favorites.push(university.id);

        setFavorite(true);
      }

      localStorage.setItem(
        FAVORITE_KEY,
        JSON.stringify(favorites)
      );
    } catch {
      setFavorite((current) => !current);
    }
  };

  /* =========================================================
     分享
  ========================================================= */

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: university.name,
          text: `查看 ${university.name} 的学校信息`,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      /*
        用户主动取消系统分享窗口时，
        浏览器也可能进入 catch。
        不需要报错。
      */
      console.log("Share cancelled", error);
    }
  };

  /* =========================================================
     官网
  ========================================================= */

  const handleWebsite = () => {
    if (!university.website) return;

    window.open(
      university.website,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =========================================================
     申请

     现在先跳转 Sakura 申请页面。
     后面申请系统做好以后直接接 API / Form。
  ========================================================= */

  const handleApply = () => {
    const params = new URLSearchParams({
      schoolId: university.id,
      schoolName: university.name,
      type: university.degree,
    });

    window.location.href = `/schools/apply?${params.toString()}`;
  };

  return (
    <aside className="sticky top-24 space-y-6">

      {/* =====================================================
          页面导航
      ===================================================== */}

      <div
        className="
          rounded-[28px]
          border
          border-slate-200
          bg-white
          p-7
          shadow-sm
        "
      >
        <h3 className="text-xl font-black text-slate-900">
          页面导航
        </h3>

        <div className="mt-6 space-y-2">
          {menus.map((item) => {
            const active =
              activeSection === item.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() =>
                  setActiveSection(item.id)
                }
                className={`
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition
                  ${
                    active
                      ? "bg-blue-50 font-bold text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }
                `}
              >
                {item.title}

                <span
                  className={
                    active
                      ? "text-blue-600"
                      : "text-slate-300"
                  }
                >
                  →
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          操作区域
      ===================================================== */}

      <div
        className="
          rounded-[28px]
          border
          border-slate-200
          bg-white
          p-7
          shadow-sm
        "
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {university.degree === "大学院"
              ? "Graduate School"
              : "University"}
          </p>

          <h3 className="mt-2 text-lg font-black text-slate-900">
            {university.name}
          </h3>
        </div>

        {/* 申请 */}

        <button
          type="button"
          onClick={handleApply}
          className="
            mt-6
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            py-4
            font-bold
            text-white
            transition
            hover:bg-blue-700
            active:scale-[0.98]
          "
        >
          <Send size={18} />

          {university.degree === "大学院"
            ? "咨询大学院申请"
            : "立即申请"}
        </button>

        {/* 收藏 */}

        <button
          type="button"
          onClick={handleFavorite}
          className={`
            mt-4
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            py-4
            font-medium
            transition
            active:scale-[0.98]
            ${
              favorite
                ? "border-red-200 bg-red-50 text-red-500"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }
          `}
        >
          <Heart
            size={18}
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
          className={`
            mt-4
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            py-4
            font-medium
            transition
            active:scale-[0.98]
            ${
              copied
                ? "border-green-200 bg-green-50 text-green-600"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }
          `}
        >
          {copied ? (
            <Check size={18} />
          ) : (
            <Share2 size={18} />
          )}

          {copied
            ? "链接已复制"
            : "分享学校"}
        </button>

        {/* 官网 */}

        <button
          type="button"
          onClick={handleWebsite}
          className="
            mt-4
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-200
            py-4
            font-medium
            text-slate-700
            transition
            hover:border-blue-200
            hover:bg-blue-50
            hover:text-blue-600
            active:scale-[0.98]
          "
        >
          <ExternalLink size={18} />

          官方网站
        </button>
      </div>

      {/* =====================================================
          提示
      ===================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-blue-100
          bg-blue-50/60
          px-5
          py-4
        "
      >
        <p className="text-xs leading-6 text-blue-700">
          学校募集时间、出愿条件及考试要求每年可能发生变化，
          申请前请确认最新募集要项。
        </p>
      </div>
    </aside>
  );
}