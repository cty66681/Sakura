"use client";

const regions = [
  "全部",
  "东京",
  "大阪",
  "京都",
  "神奈川",
  "爱知",
  "福冈",
  "北海道",
];

export default function FilterSidebar() {
  return (
    <aside
      className="
        sticky
        top-24
        h-fit

        rounded-3xl
        border
        border-slate-200

        bg-white

        p-7

        shadow-sm
      "
    >
      {/* 地区 */}

      <SectionTitle title="地区" />

      <div className="mt-5 space-y-2">

        {regions.map((item, index) => (
          <button
            key={item}
            className={`
              flex
              w-full
              rounded-xl
              px-4
              py-3
              text-left
              text-sm
              transition

              ${
                index === 0
                  ? "bg-blue-50 font-semibold text-blue-600"
                  : "hover:bg-slate-100"
              }
            `}
          >
            {item}
          </button>
        ))}

      </div>

      <Divider />

      {/* 学校类型 */}

      <SectionTitle title="学校类型" />

      <Checkbox label="国立大学" />
      <Checkbox label="公立大学" />
      <Checkbox label="私立大学" />

      <Divider />

      {/* 学历 */}

      <SectionTitle title="学历" />

      <Checkbox label="本科（学部）" />
      <Checkbox label="大学院（修士）" />
      <Checkbox label="博士" />

      <Divider />

      {/* 专业 */}

      <SectionTitle title="热门专业" />

      <Checkbox label="文科" />
      <Checkbox label="理科" />
      <Checkbox label="IT" />
      <Checkbox label="商科" />
      <Checkbox label="医学" />
      <Checkbox label="艺术设计" />

      <Divider />

      {/* 学费 */}

      <SectionTitle title="学费" />

      <Checkbox label="30万以下" />
      <Checkbox label="30~60万" />
      <Checkbox label="60~100万" />
      <Checkbox label="100万以上" />

      <Divider />

      {/* QS */}

      <SectionTitle title="QS 世界排名" />

      <Checkbox label="TOP 50" />
      <Checkbox label="TOP 100" />
      <Checkbox label="TOP 200" />

      <Divider />

      {/* EJU */}

      <SectionTitle title="EJU" />

      <Checkbox label="需要 EJU" />
      <Checkbox label="无需 EJU" />

    </aside>
  );
}

function Divider() {
  return (
    <div className="my-8 border-t border-slate-200" />
  );
}

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <h3 className="text-lg font-bold text-slate-900">
      {title}
    </h3>
  );
}

function Checkbox({
  label,
}: {
  label: string;
}) {
  return (
    <label
      className="
        mt-4
        flex
        cursor-pointer
        items-center
        gap-3
        text-sm
        text-slate-600
      "
    >
      <input
        type="checkbox"
        className="
          h-4
          w-4
          rounded
          border-slate-300
        "
      />

      {label}
    </label>
  );
}