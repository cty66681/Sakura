import {
  CreditCard,
  CircleDollarSign,
  Wallet,
} from "lucide-react";

import Card from "@/components/ui/Card/Card";

interface Props {
  id: string;
}

const tuition = [
  {
    title: "报名费",
    price: "¥20,000",
    desc: "申请学校时缴纳，仅收取一次。",
  },
  {
    title: "入学金",
    price: "¥60,000",
    desc: "首次入学缴纳，仅第一年需要。",
  },
  {
    title: "学费（半年）",
    price: "¥360,000",
    desc: "每半年缴纳一次。",
  },
  {
    title: "教材费",
    price: "¥30,000",
    desc: "根据课程略有不同。",
  },
];

export default function LanguageSchoolTuition({
  id,
}: Props) {
  const total = 20000 + 60000 + 360000 + 30000;

  return (
    <Card className="rounded-3xl p-8">

      {/* Title */}

      <div className="flex items-center gap-3">

        <div className="h-10 w-1 rounded-full bg-blue-600" />

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            学费信息
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Tuition Information
          </p>

        </div>

      </div>

      {/* Table */}

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">

        <table className="w-full">

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

            {tuition.map((item) => (

              <tr
                key={item.title}
                className="border-t border-slate-200 hover:bg-slate-50"
              >

                <td className="px-6 py-5">

                  <p className="font-semibold text-slate-900">
                    {item.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.desc}
                  </p>

                </td>

                <td className="px-6 py-5 text-right">

                  <span className="text-lg font-bold text-blue-600">
                    {item.price}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Summary */}

      <div className="mt-8 grid gap-5 md:grid-cols-3">

        <InfoCard
          icon={<CreditCard size={22} />}
          title="第一年预计"
          value="约 ¥470,000"
        />

        <InfoCard
          icon={<Wallet size={22} />}
          title="半年学费"
          value="¥360,000"
        />

        <InfoCard
          icon={<CircleDollarSign size={22} />}
          title="参考合计"
          value={`¥${total.toLocaleString()}`}
        />

      </div>

      {/* Tip */}

      <div className="mt-8 rounded-2xl bg-amber-50 p-5">

        <p className="text-sm leading-7 text-amber-700">
          ※ 学费仅供参考，最终金额请以学校官方公布为准。
          不同课程、教材及保险费用可能存在差异，
          后期可接入学校官方数据自动同步。
        </p>

      </div>

    </Card>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function InfoCard({
  icon,
  title,
  value,
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
        hover:border-blue-300
        hover:bg-white
      "
    >

      <div className="flex items-center gap-3 text-blue-600">

        {icon}

        <span className="font-semibold">
          {title}
        </span>

      </div>

      <p className="mt-4 text-3xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}