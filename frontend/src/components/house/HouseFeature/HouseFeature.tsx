"use client";

export interface HouseFeatureProps {
  layout: string;
  area: string;

  floor: string;
  builtYear: string;
  direction: string;
  structure: string;

  managementFee: string;
  deposit: string;
  keyMoney: string;

  availableDate: string;

  publishTime: string;
  views: number;
}

export default function HouseFeature({
  layout,
  area,
  floor,
  builtYear,
  direction,
  structure,
  managementFee,
  deposit,
  keyMoney,
  availableDate,
  publishTime,
  views,
}: HouseFeatureProps) {
  const items = [
    {
      label: "户型",
      value: layout,
    },
    {
      label: "面积",
      value: area,
    },
    {
      label: "楼层",
      value: floor,
    },
    {
      label: "建筑年份",
      value: builtYear,
    },
    {
      label: "朝向",
      value: direction,
    },
    {
      label: "建筑结构",
      value: structure,
    },
    {
      label: "管理费",
      value: managementFee,
    },
    {
      label: "押金",
      value: deposit,
    },
    {
      label: "礼金",
      value: keyMoney,
    },
    {
      label: "入住时间",
      value: availableDate,
    },
    {
      label: "发布时间",
      value: publishTime,
    },
    {
      label: "浏览量",
      value: `${views}`,
    },
  ];

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
      "
    >
      <h2
        className="
          mb-6
          text-lg
          font-semibold
          text-slate-900
        "
      >
        房屋信息
      </h2>

      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        {items.map((item) => (
          <div
            key={item.label}
            className="
              flex
              justify-between
              border-b
              border-slate-100
              pb-3
            "
          >
            <span className="text-slate-500">
              {item.label}
            </span>

            <span className="font-medium text-slate-900">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}