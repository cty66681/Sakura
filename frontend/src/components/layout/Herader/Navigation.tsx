import Link from "next/link";

const navItems = [
  {
    title: "首页",
    href: "/",
  },
  {
    title: "工作",
    href: "/jobs",
  },
  {
    title: "房源",
    href: "/houses",
  },
  {
    title: "学校",
    href: "/schools",
  },
  {
    title: "经验",
    href: "/experiences",
  },
  {
    title: "避坑",
    href: "/scams",
  },
  {
    title: "AI",
    href: "/ai-tools",
  },
];

export default function Navigation() {
  return (
    <nav className="hidden lg:block">

      <ul className="flex items-center gap-2">

        {navItems.map((item) => (
          <li key={item.href}>

            <Link
              href={item.href}
              className="
                rounded-xl

                px-4
                py-2

                text-sm
                font-semibold

                text-slate-600

                transition-all
                duration-300

                hover:bg-slate-100
                hover:text-blue-600
              "
            >
              {item.title}
            </Link>

          </li>
        ))}

      </ul>

    </nav>
  );
}