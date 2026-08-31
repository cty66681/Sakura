"use client";

import {
  Building2,
  CalendarDays,
  Eye,
  Home,
  Maximize2,
  MoveUpRight,
  ReceiptText,
  ShieldCheck,
  SquareStack,
  Sun,
  Wallet,
} from "lucide-react";

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
      icon: Home,
      label: "户型",
      value: layout,
    },
    {
      icon: Maximize2,
      label: "面积",
      value: area,
    },
    {
      icon: SquareStack,
      label: "楼层",
      value: floor,
    },
    {
      icon: Building2,
      label: "建筑年份",
      value: builtYear,
    },
    {
      icon: Sun,
      label: "朝向",
      value: direction,
    },
    {
      icon: Building2,
      label: "建筑结构",
      value: structure,
    },
    {
      icon: ReceiptText,
      label: "管理费",
      value: managementFee,
    },
    {
      icon: ShieldCheck,
      label: "押金",
      value: deposit,
    },
    {
      icon: Wallet,
      label: "礼金",
      value: keyMoney,
    },
    {
      icon: MoveUpRight,
      label: "可入住时间",
      value: availableDate,
    },
    {
      icon: CalendarDays,
      label: "发布时间",
      value: publishTime,
    },
    {
      icon: Eye,
      label: "浏览量",
      value: `${views} 次`,
    },
  ];

  return (
    <section
      className="
        rounded-[24px]
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        sm:p-7
      "
    >
      {/* Header */}

      <div>
        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.16em]
            text-blue-600
          "
        >
          PROPERTY INFORMATION
        </p>

        <h2
          className="
            mt-2
            text-xl
            font-black
            text-slate-950
          "
        >
          房屋基本信息
        </h2>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-slate-500
          "
        >
          户型、面积、建筑条件以及入住相关信息
        </p>
      </div>

      {/* Information */}

      <div
        className="
          mt-6
          grid
          overflow-hidden
          rounded-2xl
          border
          border-slate-100
          sm:grid-cols-2
        "
      >
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className={`
                flex
                min-h-[96px]
                items-center
                gap-4
                p-4
                transition
                hover:bg-slate-50
                sm:p-5
                ${
                  index !== items.length - 1
                    ? "border-b border-slate-100"
                    : ""
                }
                ${
                  index < items.length - 2
                    ? "sm:border-b"
                    : ""
                }
                ${
                  index % 2 === 0
                    ? "sm:border-r"
                    : ""
                }
              `}
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                "
              >
                <Icon size={18} />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-xs
                    font-medium
                    text-slate-400
                  "
                >
                  {item.label}
                </p>

                <p
                  className="
                    mt-1
                    break-words
                    text-sm
                    font-bold
                    leading-6
                    text-slate-800
                  "
                >
                  {item.value || "未填写"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}