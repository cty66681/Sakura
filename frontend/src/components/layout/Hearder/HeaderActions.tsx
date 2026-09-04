"use client";

import Link from "next/link";
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import Avatar from "@/components/ui/Avatar";
import MobileMenu from "./MobileMenu";

import {
  Bell,
  Bookmark,
  Check,
  ChevronDown,
  FileText,
  Globe,
  Languages,
  LogOut,
  Plus,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";

type OpenMenu =
  | "language"
  | "notification"
  | "account"
  | null;

type Language =
  | "zh-CN"
  | "ja";

interface NotificationItem {
  id: number;
  type: "comment" | "system" | "review";
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const notifications: NotificationItem[] = [
  {
    id: 1,
    type: "comment",
    title: "你的经验文章收到新回复",
    description:
      "有人回复了你发布的「在日本租房时需要注意什么？」",
    time: "10分钟前",
    unread: true,
  },
  {
    id: 2,
    type: "review",
    title: "发布内容审核完成",
    description:
      "你提交的信息已经通过审核并公开显示。",
    time: "2小时前",
    unread: true,
  },
  {
    id: 3,
    type: "system",
    title: "欢迎使用 Sakura",
    description:
      "你可以在个人中心管理发布、收藏和账号信息。",
    time: "昨天",
    unread: false,
  },
];

export default function HeaderActions() {
  const router = useRouter();

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  const [openMenu, setOpenMenu] =
    useState<OpenMenu>(null);

  const [language, setLanguage] =
    useState<Language>("zh-CN");

  const [notificationList, setNotificationList] =
    useState(notifications);

  const unreadCount =
    notificationList.filter(
      (item) => item.unread
    ).length;

  useEffect(() => {
    function handlePointerDown(
      event: MouseEvent
    ) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenMenu(null);
      }
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    }

    document.addEventListener(
      "mousedown",
      handlePointerDown
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  function toggleMenu(
    menu: Exclude<OpenMenu, null>
  ) {
    setOpenMenu((current) =>
      current === menu
        ? null
        : menu
    );
  }

  function selectLanguage(
    value: Language
  ) {
    setLanguage(value);
    setOpenMenu(null);

    /*
     * 当前 Sakura 的主要内容仍然是中文。
     *
     * 这里先把语言选择交互完整做出来。
     * 后续全站国际化阶段接入真正的 locale 系统。
     *
     * 不使用依赖 Google 的网页翻译方案。
     */

    if (value === "ja") {
      console.info(
        "Japanese locale selected. Full i18n will be connected later."
      );
    }
  }

  function markAllAsRead() {
    setNotificationList(
      (current) =>
        current.map((item) => ({
          ...item,
          unread: false,
        }))
    );

    // TODO [API - PATCH]
    // PATCH /api/me/notifications/read-all
    // Purpose:
    // Mark all notifications belonging to
    // the current user as read.
  }

  function openNotification(
    id: number
  ) {
    setNotificationList(
      (current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                unread: false,
              }
            : item
        )
    );

    // TODO [API - PATCH]
    // PATCH /api/me/notifications/:id/read
    // Purpose:
    // Mark one notification as read.

    setOpenMenu(null);

    /*
     * 后端接入后 notification 应返回：
     *
     * targetType
     * targetId
     * targetUrl
     *
     * 然后这里直接进入对应内容。
     */
  }

  function handleLogout() {
    setOpenMenu(null);

    // TODO [API - POST]
    // POST /api/auth/logout
    // Purpose:
    // Destroy the current secure server session.

    /*
     * 当前没有真实 Auth，
     * 所以暂时只返回首页。
     */
    router.push("/");
  }

  return (
    <div
      ref={wrapperRef}
      className="
        relative
        flex
        items-center
        gap-1
        sm:gap-2
      "
    >
      {/* Search */}

      <HeaderIconButton
        label="搜索"
        onClick={() => {
          setOpenMenu(null);
          router.push("/search");
        }}
      >
        <Search size={20} />
      </HeaderIconButton>

      {/* Language */}

      <div className="relative hidden md:block">
        <HeaderIconButton
          label="切换语言"
          active={
            openMenu === "language"
          }
          onClick={() =>
            toggleMenu("language")
          }
        >
          <Globe size={20} />
        </HeaderIconButton>

        {openMenu ===
          "language" && (
          <LanguageMenu
            language={language}
            onSelect={
              selectLanguage
            }
          />
        )}
      </div>

      {/* Notification */}

      <div className="relative hidden md:block">
        <button
          type="button"
          aria-label="通知"
          aria-expanded={
            openMenu ===
            "notification"
          }
          onClick={() =>
            toggleMenu(
              "notification"
            )
          }
          className={`
            relative
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            text-slate-700
            transition
            ${
              openMenu ===
              "notification"
                ? "bg-slate-100 text-slate-950"
                : "hover:bg-slate-100"
            }
          `}
        >
          <Bell size={20} />

          {unreadCount > 0 && (
            <span
              className="
                absolute
                right-2
                top-2
                flex
                h-4
                min-w-4
                items-center
                justify-center
                rounded-full
                bg-rose-500
                px-1
                text-[9px]
                font-black
                leading-none
                text-white
                ring-2
                ring-white
              "
            >
              {unreadCount > 9
                ? "9+"
                : unreadCount}
            </span>
          )}
        </button>

        {openMenu ===
          "notification" && (
          <NotificationMenu
            items={
              notificationList
            }
            unreadCount={
              unreadCount
            }
            onReadAll={
              markAllAsRead
            }
            onOpen={
              openNotification
            }
            onClose={() =>
              setOpenMenu(null)
            }
          />
        )}
      </div>

      {/* Publish */}

      <Link
        href="/account/publish"
        onClick={() =>
          setOpenMenu(null)
        }
        className="
          hidden
          min-h-11
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-slate-950
          px-4
          text-sm
          font-black
          text-white
          shadow-sm
          transition
          hover:bg-blue-600
          lg:inline-flex
        "
      >
        <Plus size={16} />

        发布信息
      </Link>

      {/* Account */}

      <div className="relative hidden lg:block">
        <button
          type="button"
          aria-label="打开个人菜单"
          aria-expanded={
            openMenu === "account"
          }
          onClick={() =>
            toggleMenu("account")
          }
          className={`
            flex
            min-h-11
            items-center
            gap-1
            rounded-xl
            px-1.5
            transition
            ${
              openMenu ===
              "account"
                ? "bg-slate-100"
                : "hover:bg-slate-100"
            }
          `}
        >
          <Avatar
            name="S"
            size="md"
          />

          <ChevronDown
            size={14}
            className={`
              text-slate-400
              transition-transform
              ${
                openMenu ===
                "account"
                  ? "rotate-180"
                  : ""
              }
            `}
          />
        </button>

        {openMenu ===
          "account" && (
          <AccountMenu
            onClose={() =>
              setOpenMenu(null)
            }
            onLogout={
              handleLogout
            }
          />
        )}
      </div>

      {/* Mobile */}

      <MobileMenu />
    </div>
  );
}

function HeaderIconButton({
  label,
  active = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={
        active || undefined
      }
      onClick={onClick}
      className={`
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-xl
        text-slate-700
        transition
        ${
          active
            ? "bg-slate-100 text-slate-950"
            : "hover:bg-slate-100"
        }
      `}
    >
      {children}
    </button>
  );
}

function LanguageMenu({
  language,
  onSelect,
}: {
  language: Language;
  onSelect: (
    language: Language
  ) => void;
}) {
  return (
    <div
      className="
        absolute
        right-0
        top-[calc(100%+12px)]
        z-[70]
        w-[250px]
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-2
        shadow-2xl
        shadow-slate-900/10
      "
    >
      <div className="px-3 pb-2 pt-2">
        <div className="flex items-center gap-2">
          <Languages
            size={16}
            className="text-blue-600"
          />

          <p
            className="
              text-sm
              font-black
              text-slate-950
            "
          >
            网站语言
          </p>
        </div>

        <p
          className="
            mt-1.5
            text-[11px]
            leading-5
            text-slate-400
          "
        >
          Sakura 目前以中文为主要语言。
        </p>
      </div>

      <div
        className="
          my-1
          h-px
          bg-slate-100
        "
      />

      <LanguageOption
        active={
          language === "zh-CN"
        }
        title="简体中文"
        subtitle="中文"
        onClick={() =>
          onSelect("zh-CN")
        }
      />

      <LanguageOption
        active={
          language === "ja"
        }
        title="日本語"
        subtitle="Japanese"
        onClick={() =>
          onSelect("ja")
        }
      />

      <div
        className="
          mt-2
          rounded-xl
          bg-slate-50
          px-3
          py-2.5
        "
      >
        <p
          className="
            text-[10px]
            font-semibold
            leading-5
            text-slate-400
          "
        >
          日语版正在准备中。
          当前选择会在正式国际化系统接入后应用到整个网站。
        </p>
      </div>
    </div>
  );
}

function LanguageOption({
  active,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        min-h-12
        w-full
        items-center
        justify-between
        gap-3
        rounded-xl
        px-3
        text-left
        transition
        ${
          active
            ? "bg-blue-50"
            : "hover:bg-slate-50"
        }
      `}
    >
      <div>
        <p
          className={`
            text-sm
            font-black
            ${
              active
                ? "text-blue-700"
                : "text-slate-800"
            }
          `}
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            text-[10px]
            font-semibold
            text-slate-400
          "
        >
          {subtitle}
        </p>
      </div>

      {active && (
        <div
          className="
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            bg-blue-600
            text-white
          "
        >
          <Check size={13} />
        </div>
      )}
    </button>
  );
}

function NotificationMenu({
  items,
  unreadCount,
  onReadAll,
  onOpen,
  onClose,
}: {
  items: NotificationItem[];
  unreadCount: number;
  onReadAll: () => void;
  onOpen: (id: number) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="
        absolute
        right-0
        top-[calc(100%+12px)]
        z-[70]
        w-[360px]
        max-w-[calc(100vw-32px)]
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-2xl
        shadow-slate-900/10
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          border-b
          border-slate-100
          px-4
          py-4
        "
      >
        <div>
          <h3
            className="
              text-sm
              font-black
              text-slate-950
            "
          >
            通知
          </h3>

          <p
            className="
              mt-0.5
              text-[10px]
              font-semibold
              text-slate-400
            "
          >
            {unreadCount > 0
              ? `${unreadCount} 条未读消息`
              : "没有未读消息"}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onReadAll}
            className="
              min-h-9
              rounded-lg
              px-2
              text-xs
              font-black
              text-blue-600
              transition
              hover:bg-blue-50
            "
          >
            全部已读
          </button>
        )}
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              onOpen(item.id)
            }
            className={`
              relative
              flex
              w-full
              gap-3
              border-b
              border-slate-100
              px-4
              py-4
              text-left
              transition
              last:border-none
              ${
                item.unread
                  ? "bg-blue-50/50 hover:bg-blue-50"
                  : "bg-white hover:bg-slate-50"
              }
            `}
          >
            <NotificationIcon
              type={item.type}
            />

            <div className="min-w-0 flex-1">
              <div
                className="
                  flex
                  items-start
                  gap-2
                "
              >
                <p
                  className="
                    flex-1
                    text-xs
                    font-black
                    leading-5
                    text-slate-800
                  "
                >
                  {item.title}
                </p>

                {item.unread && (
                  <span
                    className="
                      mt-1.5
                      h-2
                      w-2
                      shrink-0
                      rounded-full
                      bg-blue-500
                    "
                  />
                )}
              </div>

              <p
                className="
                  mt-1
                  line-clamp-2
                  text-[11px]
                  leading-5
                  text-slate-500
                "
              >
                {item.description}
              </p>

              <p
                className="
                  mt-1.5
                  text-[10px]
                  font-semibold
                  text-slate-400
                "
              >
                {item.time}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div
        className="
          border-t
          border-slate-100
          p-2
        "
      >
        <button
          type="button"
          onClick={onClose}
          className="
            flex
            min-h-10
            w-full
            items-center
            justify-center
            rounded-xl
            text-xs
            font-black
            text-slate-500
            transition
            hover:bg-slate-50
          "
        >
          关闭
        </button>
      </div>
    </div>
  );
}

function NotificationIcon({
  type,
}: {
  type: NotificationItem["type"];
}) {
  if (type === "comment") {
    return (
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-blue-50
          text-blue-600
        "
      >
        <Bell size={16} />
      </div>
    );
  }

  if (type === "review") {
    return (
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-emerald-50
          text-emerald-600
        "
      >
        <FileText size={16} />
      </div>
    );
  }

  return (
    <div
      className="
        flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-xl
        bg-violet-50
        text-violet-600
      "
    >
      <Bell size={16} />
    </div>
  );
}

function AccountMenu({
  onClose,
  onLogout,
}: {
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <div
      className="
        absolute
        right-0
        top-[calc(100%+12px)]
        z-[70]
        w-[270px]
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-2
        shadow-2xl
        shadow-slate-900/10
      "
    >
      {/* User */}

      <Link
        href="/account"
        onClick={onClose}
        className="
          flex
          items-center
          gap-3
          rounded-xl
          p-3
          transition
          hover:bg-slate-50
        "
      >
        <Avatar
          name="S"
          size="md"
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
            Sakura 用户
          </p>

          <p
            className="
              mt-0.5
              text-[10px]
              font-semibold
              text-slate-400
            "
          >
            查看个人中心
          </p>
        </div>
      </Link>

      <div
        className="
          my-2
          h-px
          bg-slate-100
        "
      />

      <AccountLink
        href="/account"
        icon={<User size={17} />}
        onClick={onClose}
      >
        个人中心
      </AccountLink>

      <AccountLink
        href="/account/posts"
        icon={<FileText size={17} />}
        onClick={onClose}
      >
        我的发布
      </AccountLink>

      <AccountLink
        href="/account/favorites"
        icon={<Bookmark size={17} />}
        onClick={onClose}
      >
        我的收藏
      </AccountLink>

      <AccountLink
        href="/account/settings"
        icon={<Settings size={17} />}
        onClick={onClose}
      >
        账号设置
      </AccountLink>

      <div
        className="
          my-2
          h-px
          bg-slate-100
        "
      />

      <button
        type="button"
        onClick={onLogout}
        className="
          flex
          min-h-11
          w-full
          items-center
          gap-3
          rounded-xl
          px-3
          text-left
          text-sm
          font-bold
          text-rose-600
          transition
          hover:bg-rose-50
        "
      >
        <LogOut size={17} />

        退出登录
      </button>
    </div>
  );
}

function AccountLink({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        flex
        min-h-11
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
      <span className="text-slate-400">
        {icon}
      </span>

      {children}
    </Link>
  );
}