"use client";

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
      <h1 className="text-3xl font-bold text-slate-900">
        {title}
      </h1>

      <p className="mt-2 text-slate-500">
        {location}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">

        <div>
          <p className="text-sm text-slate-500">
            房租
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {rent}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            管理费
          </p>

          <p className="mt-2 text-xl font-semibold text-slate-900">
            {managementFee}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            押金
          </p>

          <p className="mt-2 text-xl font-semibold text-slate-900">
            {deposit}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            礼金
          </p>

          <p className="mt-2 text-xl font-semibold text-slate-900">
            {keyMoney}
          </p>
        </div>

      </div>
    </div>
  );
}