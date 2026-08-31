"use client";

import {
  Banknote,
  Building2,
  MapPin,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

export interface HousePriceProps {
  title: string;
  rent: string;
  location: string;
  managementFee: string;
  deposit: string;
  keyMoney: string;
}

export default function HousePrice({
  title,
  rent,
  location,
  managementFee,
  deposit,
  keyMoney,
}: HousePriceProps) {
  const priceItems = [
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
      icon: Building2,
      label: "礼金",
      value: keyMoney,
    },
  ];

  return (
    <section
      className="
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* Main */}

      <div className="p-6 sm:p-7">
        {/* Location */}

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-slate-500
          "
        >
          <MapPin
            size={16}
            className="shrink-0 text-blue-500"
          />

          <span>{location}</span>
        </div>

        {/* Title */}

        <h1
          className="
            mt-3
            text-2xl
            font-black
            leading-tight
            tracking-tight
            text-slate-950
            sm:text-3xl
          "
        >
          {title}
        </h1>

        {/* Rent */}

        <div
          className="
            mt-7
            flex
            flex-wrap
            items-end
            gap-x-3
            gap-y-1
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-blue-600
            "
          >
            <Banknote size={22} />

            <span
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.12em]
              "
            >
              MONTHLY RENT
            </span>
          </div>

          <div className="w-full" />

          <span
            className="
              text-3xl
              font-black
              tracking-tight
              text-blue-600
              sm:text-4xl
            "
          >
            {rent || "未填写"}
          </span>

          <span
            className="
              pb-1
              text-sm
              font-medium
              text-slate-400
            "
          >
            / 月
          </span>
        </div>
      </div>

      {/* Costs */}

      <div
        className="
          grid
          border-t
          border-slate-100
          bg-slate-50/70
          sm:grid-cols-3
        "
      >
        {priceItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className={`
                flex
                items-center
                gap-3
                px-5
                py-4
                ${
                  index !== priceItems.length - 1
                    ? "border-b border-slate-100 sm:border-b-0 sm:border-r"
                    : ""
                }
              `}
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  text-slate-500
                  shadow-sm
                "
              >
                <Icon size={16} />
              </div>

              <div className="min-w-0">
                <p
                  className="
                    text-[11px]
                    font-medium
                    text-slate-400
                  "
                >
                  {item.label}
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-sm
                    font-black
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