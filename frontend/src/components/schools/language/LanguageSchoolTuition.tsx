import {
  CreditCard,
  CircleDollarSign,
  Wallet,
} from "lucide-react";

import Card from "@/components/ui/Card/Card";

export type LanguageSchoolTuitionData = {
  id: string;
  name: string;

  /*
  |--------------------------------------------------------------------------
  | TODO [API - GET]
  |--------------------------------------------------------------------------
  |
  | 正式后端完成后：
  |
  | GET /api/language-schools/:id/tuition
  |
  | 建议接口返回：
  |
  | {
  |   applicationFee: number;
  |   admissionFee: number;
  |   annualTuition: number;
  |   materialFee: number;
  |   facilityFee: number;
  |   insuranceFee: number;
  |   paymentInstallments: number;
  |   updatedAt: string;
  | }
  |
  | 当前 annualTuition 使用学校详情页已有的 tuition 数据，
  | 其他费用暂时使用 MOCK。
  |
  |--------------------------------------------------------------------------
  */

  tuition: number;
};

interface Props {
  school: LanguageSchoolTuitionData;
}

type TuitionItem = {
  title: string;
  price: number;
  desc: string;
};

export default function LanguageSchoolTuition({
  school,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | MOCK DATA
  |--------------------------------------------------------------------------
  |
  | 这些数据以后由：
  |
  | GET /api/language-schools/:id/tuition
  |
  | 返回。
  |
  |--------------------------------------------------------------------------
  */

  const applicationFee = 20000;
  const admissionFee = 60000;
  const materialFee = 30000;

  const annualTuition = school.tuition;

  const halfYearTuition = Math.round(
    annualTuition / 2
  );

  const tuitionItems: TuitionItem[] = [
    {
      title: "报名费",
      price: applicationFee,
      desc: "申请学校时缴纳，一般仅收取一次。",
    },

    {
      title: "入学金",
      price: admissionFee,
      desc: "正式入学时缴纳，一般仅第一年需要。",
    },

    {
      title: "学费（半年）",
      price: halfYearTuition,
      desc: `按照当前年学费 ¥${annualTuition.toLocaleString()} 计算。`,
    },

    {
      title: "教材费",
      price: materialFee,
      desc: "根据课程、教材以及入学时期可能有所不同。",
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | 第一年度参考费用
  |--------------------------------------------------------------------------
  |
  | 年学费 + 报名费 + 入学金 + 教材费
  |
  | 注意：
  | 当前还没有包含设施费、保险费、活动费、宿舍费等。
  |
  |--------------------------------------------------------------------------
  */

  const firstYearTotal =
    annualTuition +
    applicationFee +
    admissionFee +
    materialFee;

  /*
  |--------------------------------------------------------------------------
  | 当前缴费参考
  |--------------------------------------------------------------------------
  |
  | 报名费 + 入学金 + 半年学费 + 教材费
  |
  |--------------------------------------------------------------------------
  */

  const initialPayment =
    applicationFee +
    admissionFee +
    halfYearTuition +
    materialFee;

  return (
    <section
      id="tuition"
      className="scroll-mt-28"
    >
      <Card className="rounded-3xl p-8">
        {/* Title */}

        <div className="flex items-center gap-3">
          <div className="h-10 w-1 rounded-full bg-emerald-600" />

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              学费信息
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Tuition Information
            </p>
          </div>
        </div>

        {/* School */}

        <div className="mt-6 rounded-2xl bg-emerald-50 px-5 py-4">
          <p className="text-sm leading-7 text-emerald-800">
            当前显示{" "}
            <span className="font-bold">
              {school.name}
            </span>{" "}
            的学费参考信息。
          </p>
        </div>

        {/* Table */}

        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[560px]">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  项目
                </th>

                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                  金额
                </th>
              </tr>
            </thead>

            <tbody>
              {tuitionItems.map((item) => (
                <tr
                  key={item.title}
                  className="
                    border-t
                    border-slate-200
                    transition
                    hover:bg-slate-50
                  "
                >
                  <td className="px-6 py-5">
                    <p className="font-semibold text-slate-900">
                      {item.title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {item.desc}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <span className="text-lg font-bold text-emerald-600">
                      ¥
                      {item.price.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}

              {/* 年学费 */}

              <tr className="border-t border-slate-200 bg-emerald-50/60">
                <td className="px-6 py-5">
                  <p className="font-bold text-slate-900">
                    年学费
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    当前学校公布的年度学费参考。
                  </p>
                </td>

                <td className="px-6 py-5 text-right">
                  <span className="text-xl font-black text-emerald-600">
                    ¥
                    {annualTuition.toLocaleString()}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <InfoCard
            icon={
              <CreditCard size={22} />
            }
            title="第一年预计"
            value={`¥${firstYearTotal.toLocaleString()}`}
            description="年学费 + 基础入学费用"
          />

          <InfoCard
            icon={<Wallet size={22} />}
            title="半年学费"
            value={`¥${halfYearTuition.toLocaleString()}`}
            description="根据当前年学费计算"
          />

          <InfoCard
            icon={
              <CircleDollarSign
                size={22}
              />
            }
            title="首次缴费参考"
            value={`¥${initialPayment.toLocaleString()}`}
            description="含半年学费及基础费用"
          />
        </div>

        {/* Tip */}

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm leading-7 text-amber-800">
            ※ 当前费用为 Sakura
            整理的参考数据。实际学费可能因课程、入学时间、
            教材费、设施费、保险费等发生变化，最终请以学校官方公布的信息为准。
          </p>
        </div>
      </Card>
    </section>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

function InfoCard({
  icon,
  title,
  value,
  description,
}: InfoCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-slate-50
        p-5
        transition
        hover:border-emerald-300
        hover:bg-white
      "
    >
      <div className="flex items-center gap-3 text-emerald-600">
        {icon}

        <span className="font-semibold">
          {title}
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900 xl:text-3xl">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}