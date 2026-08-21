import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3"
    >
      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center

          rounded-2xl

          bg-gradient-to-br
          from-blue-600
          to-violet-600

          text-lg
          font-black
          text-white

          shadow-lg
        "
      >
        桜
      </div>

      <div>

        <h1
          className="
            text-xl
            font-black
            tracking-tight
            text-slate-900
          "
        >
          Sakura
        </h1>

        <p
          className="
            -mt-1
            text-xs
            text-slate-500
          "
        >
          日本华人生活平台
        </p>

      </div>

    </Link>
  );
}