"use client";

type UniversityInfoData = {
  name: string;
  englishName: string;
  location: string;
  address: string;
  type: "国立大学" | "公立大学" | "私立大学";
  degree: "大学" | "大学院";
  qs: number | null;
  hensachi: number | null;
  tuition: number;
  eju: boolean;
  rating: number;
  website: string;
  description: string;
  tags: string[];
};

type Props = {
  university: UniversityInfoData;
};

export default function UniversityInfo({
  university,
}: Props) {
  const infos = [
    {
      label: "学校性质",
      value: university.type,
    },
    {
      label: "教育阶段",
      value: university.degree,
    },
    {
      label: "所在地区",
      value: university.location,
    },
    {
      label: "学校地址",
      value: university.address,
    },
    {
      label: "QS 世界排名",
      value:
        university.qs !== null
          ? `QS ${university.qs}`
          : "暂无数据",
    },
    {
      label: "偏差值",
      value:
        university.hensachi !== null
          ? String(university.hensachi)
          : university.degree === "大学院"
            ? "大学院不适用"
            : "暂无数据",
    },
    {
      label: "EJU",
      value: university.eju ? "需要" : "无需 / 视专业而定",
    },
    {
      label: "参考学费",
      value: `${university.tuition.toLocaleString()}円 / 年`,
    },
  ];

  return (
    <section
      id="info"
      className="
        scroll-mt-28
        rounded-[28px]
        border
        border-slate-200
        bg-white
        p-8
        shadow-sm
      "
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            学校简介
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {university.englishName}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {university.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="
                rounded-full
                bg-blue-50
                px-3
                py-1.5
                text-xs
                font-bold
                text-blue-600
              "
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-6 leading-8 text-slate-600">
        {university.description}
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {infos.map((item) => (
          <div
            key={item.label}
            className="
              flex
              min-h-[72px]
              items-center
              justify-between
              gap-5
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              px-6
              py-5
            "
          >
            <span className="shrink-0 font-medium text-slate-500">
              {item.label}
            </span>

            <span className="text-right font-bold text-slate-900">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div
        className="
          mt-6
          flex
          items-center
          justify-between
          gap-5
          rounded-2xl
          border
          border-slate-200
          bg-slate-50
          px-6
          py-5
        "
      >
        <span className="shrink-0 font-medium text-slate-500">
          官方网站
        </span>

        <a
          href={university.website}
          target="_blank"
          rel="noreferrer"
          className="
            truncate
            font-bold
            text-blue-600
            transition
            hover:text-blue-700
            hover:underline
          "
        >
          {university.website}
        </a>
      </div>
    </section>
  );
}