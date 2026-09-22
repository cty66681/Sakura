"use client";

import {
  type ReactNode,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  usePathname,
} from "next/navigation";

import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  MessageCircle,
  FileText,
  GraduationCap,
  Home,
  Menu,
  Plus,
  Settings,
  ShieldAlert,
  Sparkles,
  User,
  X,
} from "lucide-react";

const navItems = [
  {
    title: "首页",
    href: "/",
    type: "home",
  },
  {
    title: "工作",
    href: "/jobs",
    type: "jobs",
  },
  {
    title: "房源",
    href: "/houses",
    type: "houses",
  },
  {
    title: "学校",
    href: "/schools",
    type: "schools",
  },
  {
    title: "经验",
    href: "/experience",
    type: "experience",
  },
  {
    title: "避坑",
    href: "/scam",
    type: "scam",
  },
  {
    title: "AI",
    href: "/ai-tools",
    type: "ai",
  },
] as const;

export default function MobileMenu() {
  const pathname = usePathname();

  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  function isActive(
    href: string
  ) {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(
        `${href}/`
      )
    );
  }

  return (
    <>
      {/* Menu Button */}

      <button
        type="button"
        aria-label="打开导航菜单"
        aria-expanded={open}
        onClick={() =>
          setOpen(true)
        }
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          text-slate-700
          transition
          hover:bg-slate-100
          active:bg-slate-200
          lg:hidden
        "
      >
        <Menu size={22} />
      </button>

      {open && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            lg:hidden
          "
        >
          {/* Mask */}

          <button
            type="button"
            aria-label="关闭导航菜单"
            onClick={closeMenu}
            className="
              absolute
              inset-0
              h-full
              w-full
              cursor-default
              bg-slate-950/40
              backdrop-blur-[2px]
            "
          />

          {/* Drawer */}

          <aside
            className="
              absolute
              bottom-0
              right-0
              top-0
              flex
              w-[min(88vw,360px)]
              flex-col
              overflow-hidden
              border-l
              border-slate-200
              bg-white
              shadow-2xl
            "
          >
            {/* Header */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-slate-100
                px-5
                pb-4
                pt-[max(16px,env(safe-area-inset-top))]
              "
            >
              <Link
                href="/"
                onClick={closeMenu}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
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
                    bg-gradient-to-br
                    from-blue-600
                    to-violet-600
                    text-base
                    font-black
                    text-white
                    shadow-md
                  "
                >
                  桜
                </div>

                <div>
                  <p
                    className="
                      text-base
                      font-black
                      tracking-tight
                      text-slate-950
                    "
                  >
                    Sakura
                  </p>

                  <p
                    className="
                      text-[10px]
                      font-medium
                      text-slate-400
                    "
                  >
                    日本华人生活平台
                  </p>
                </div>
              </Link>

              <button
                type="button"
                aria-label="关闭导航菜单"
                onClick={closeMenu}
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  text-slate-500
                  transition
                  hover:bg-slate-100
                  hover:text-slate-950
                  active:bg-slate-200
                "
              >
                <X size={21} />
              </button>
            </div>

            {/* Scroll Content */}

            <div
              className="
                flex-1
                overflow-y-auto
                overscroll-contain
                px-4
                py-5
              "
            >
              {/* User */}

              <Link
                href="/account"
                onClick={closeMenu}
                className="
                  mb-5
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-3.5
                  transition
                  hover:border-slate-300
                  hover:bg-white
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
                    bg-gradient-to-br
                    from-blue-600
                    to-violet-600
                    text-sm
                    font-black
                    text-white
                  "
                >
                  S
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="
                      truncate
                      text-sm
                      font-black
                      text-slate-900
                    "
                  >
                    Sakura 用户
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[11px]
                      font-medium
                      text-slate-400
                    "
                  >
                    查看个人中心
                  </p>
                </div>

                <User
                  size={17}
                  className="text-slate-400"
                />
              </Link>

              {/* Messages */}
              <Link
                href="/messages"
                onClick={closeMenu}
                className={`
                  mb-5
                  flex
                  min-h-14
                  items-center
                  justify-between
                  gap-3
                  rounded-2xl
                  border
                  px-4
                  transition

                  ${
                    isActive("/messages")
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-800 hover:border-blue-200 hover:bg-blue-50/50"
                  }
                `}
              >
                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >
                  <span
                    className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl

                      ${
                        isActive("/messages")
                          ? "bg-blue-600 text-white"
                          : "bg-blue-50 text-blue-600"
                      }
                    `}
                  >
                    <MessageCircle size={19} />
                  </span>

                  <div className="min-w-0">
                    <p
                      className="
                        text-sm
                        font-black
                      "
                    >
                      聊天
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[11px]
                        font-medium
                        text-slate-400
                      "
                    >
                      查看和继续你的站内聊天
                    </p>
                  </div>
                </div>

                <span
                  className="
                    shrink-0
                    rounded-full
                    bg-rose-500
                    px-2
                    py-1
                    text-[10px]
                    font-black
                    text-white
                  "
                >
                  2
                </span>
              </Link>

              {/* Main Navigation */}

              <div>
                <p
                  className="
                    mb-2
                    px-3
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-slate-400
                  "
                >
                  导航
                </p>

                <nav className="space-y-1">
                  {navItems.map(
                    (item) => {
                      const active =
                        isActive(
                          item.href
                        );

                      return (
                        <Link
                          key={
                            item.href
                          }
                          href={
                            item.href
                          }
                          onClick={
                            closeMenu
                          }
                          className={`
                            flex
                            min-h-12
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            text-sm
                            font-bold
                            transition
                            ${
                              active
                                ? "bg-blue-50 text-blue-700"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                            }
                          `}
                        >
                          <span
                            className={`
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              ${
                                active
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-slate-100 text-slate-500"
                              }
                            `}
                          >
                            <NavIcon
                              type={
                                item.type
                              }
                            />
                          </span>

                          {
                            item.title
                          }
                        </Link>
                      );
                    }
                  )}
                </nav>
              </div>

              <div
                className="
                  my-5
                  h-px
                  bg-slate-100
                "
              />

              {/* Account */}

              <div>
                <p
                  className="
                    mb-2
                    px-3
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-slate-400
                  "
                >
                  我的 Sakura
                </p>

                <div className="space-y-1">
                  <MenuLink
                    href="/account"
                    onClick={
                      closeMenu
                    }
                    icon={
                      <User
                        size={17}
                      />
                    }
                  >
                    个人中心
                  </MenuLink>

                  <MenuLink
                    href="/account/posts"
                    onClick={
                      closeMenu
                    }
                    icon={
                      <FileText
                        size={17}
                      />
                    }
                  >
                    我的发布
                  </MenuLink>

                  <MenuLink
                    href="/account/favorites"
                    onClick={
                      closeMenu
                    }
                    icon={
                      <Bookmark
                        size={17}
                      />
                    }
                  >
                    我的收藏
                  </MenuLink>

                  <MenuLink
                    href="/account/settings"
                    onClick={
                      closeMenu
                    }
                    icon={
                      <Settings
                        size={17}
                      />
                    }
                  >
                    账号设置
                  </MenuLink>
                </div>
              </div>
            </div>

            {/* Bottom Publish */}

            <div
              className="
                shrink-0
                border-t
                border-slate-100
                bg-white
                px-4
                pb-[max(16px,env(safe-area-inset-bottom))]
                pt-4
              "
            >
              <Link
                href="/account/publish"
                onClick={closeMenu}
                className="
                  flex
                  min-h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-950
                  px-4
                  text-sm
                  font-black
                  text-white
                  shadow-lg
                  shadow-slate-900/10
                  transition
                  hover:bg-blue-600
                  active:scale-[0.99]
                "
              >
                <Plus size={18} />

                发布信息
              </Link>

              <p
                className="
                  mt-2
                  text-center
                  text-[10px]
                  leading-4
                  text-slate-400
                "
              >
                分享工作、房源、经验与避坑信息
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function MenuLink({
  href,
  icon,
  onClick,
  children,
}: {
  href: string;
  icon: ReactNode;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        flex
        min-h-12
        items-center
        gap-3
        rounded-xl
        px-3
        text-sm
        font-bold
        text-slate-700
        transition
        hover:bg-slate-50
        hover:text-slate-950
      "
    >
      <span
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-lg
          bg-slate-100
          text-slate-500
        "
      >
        {icon}
      </span>

      {children}
    </Link>
  );
}

function NavIcon({
  type,
}: {
  type:
    | "home"
    | "jobs"
    | "houses"
    | "schools"
    | "experience"
    | "scam"
    | "ai";
}) {
  if (type === "home") {
    return <Home size={17} />;
  }

  if (type === "jobs") {
    return (
      <BriefcaseBusiness
        size={17}
      />
    );
  }

  if (type === "houses") {
    return <Building2 size={17} />;
  }

  if (type === "schools") {
    return (
      <GraduationCap size={17} />
    );
  }

  if (type === "experience") {
    return <FileText size={17} />;
  }

  if (type === "scam") {
    return (
      <ShieldAlert size={17} />
    );
  }

  return <Sparkles size={17} />;
}