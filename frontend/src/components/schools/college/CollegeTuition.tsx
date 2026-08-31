import {
  BadgeCheck,
  Banknote,
  BookOpen,
  CalendarDays,
  CircleDollarSign,
  GraduationCap,
  ReceiptText,
  WalletCards,
} from "lucide-react";

import Card from "@/components/ui/Card/Card";

export type CollegeTuitionData = {
  id: string;
  name: string;
  tuition: number;

  category:
    | "IT・AI"
    | "设计・动漫"
    | "商务・观光"
    | "美容・时尚"
    | "医疗・福祉"
    | "汽车・技术";
};

interface Props {
  school: CollegeTuitionData;
}

type TuitionData = {
  applicationFee: number;
  admissionFee: number;
  annualTuition: number;
  facilityFee: number;
  materialFee: number;
  practicalFee: number;
};

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 正式后端完成后：
|
| GET /api/colleges/:id/tuition
|
| 示例：
|
| GET /api/colleges/tokyo-tech-ai/tuition
|
| 建议返回：
|
| {
|   applicationFee: number;
|   admissionFee: number;
|   annualTuition: number;
|   facilityFee: number;
|   materialFee: number;
|   practicalFee: number;
|   installmentAvailable: boolean;
|   installmentCount: number;
|   scholarshipAvailable: boolean;
|   updatedAt: string;
| }
|
| 当前使用 MOCK DATA。
|
|--------------------------------------------------------------------------
*/

export default function CollegeTuition({
  school,
}: Props) {
  const tuition =
    getMockTuition(school);

  const firstYearTotal =
    tuition.applicationFee +
    tuition.admissionFee +
    tuition.annualTuition +
    tuition.facilityFee +
    tuition.materialFee +
    tuition.practicalFee;

  const admissionPayment =
    tuition.applicationFee +
    tuition.admissionFee +
    Math.round(
      tuition.annualTuition / 2
    ) +
    tuition.facilityFee +
    tuition.materialFee +
    tuition.practicalFee;

  const secondPayment =
    Math.round(
      tuition.annualTuition / 2
    );

  return (
    <section
      id="tuition"
      className="scroll-mt-28"
    >
      <Card className="rounded-3xl p-8">
        {/* Header */}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-1 rounded-full bg-orange-500" />

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                学费信息
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Tuition & Fees
              </p>
            </div>
          </div>

          <div className="rounded-full bg-orange-50 px-4 py-2 text-xs font-bold text-orange-700">
            {school.category}
          </div>
        </div>

        <p className="mt-7 leading-8 text-slate-600">
          以下费用为当前 Sakura
          测试数据，用于帮助比较不同专门学校的大致费用结构。
          正式申请时，请以学校最新年度募集要项为准。
        </p>

        {/* Main Price */}

        <div
          className="
            mt-8
            overflow-hidden
            rounded-3xl
            bg-gradient-to-br
            from-slate-950
            via-slate-900
            to-orange-950
            p-7
            text-white
          "
        >
          <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-orange-300">
                <WalletCards
                  size={18}
                />

                第一年预计总费用
              </div>

              <div className="mt-4 flex flex-wrap items-end gap-2">
                <span className="text-4xl font-black tracking-tight sm:text-5xl">
                  ¥
                  {firstYearTotal.toLocaleString()}
                </span>

                <span className="pb-1 text-sm text-slate-400">
                  / 第一年
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                包含报名费、入学金、学费、
                设施费、教材费及实习相关费用。
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-xs text-slate-400">
                基础年度学费
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                ¥
                {tuition.annualTuition.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Fee Breakdown */}

        <div className="mt-9">
          <h3 className="text-lg font-bold text-slate-900">
            第一年费用明细
          </h3>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <TuitionRow
              icon={
                <ReceiptText
                  size={18}
                />
              }
              title="报名费"
              description="提交入学申请时产生的审查费用"
              amount={
                tuition.applicationFee
              }
            />

            <TuitionRow
              icon={
                <GraduationCap
                  size={18}
                />
              }
              title="入学金"
              description="正式入学时一次性缴纳"
              amount={
                tuition.admissionFee
              }
            />

            <TuitionRow
              icon={
                <Banknote
                  size={18}
                />
              }
              title="年度学费"
              description="专业课程的主要授课费用"
              amount={
                tuition.annualTuition
              }
            />

            <TuitionRow
              icon={
                <CalendarDays
                  size={18}
                />
              }
              title="设施设备费"
              description="教室、实验室及学校设施相关费用"
              amount={
                tuition.facilityFee
              }
            />

            <TuitionRow
              icon={
                <BookOpen
                  size={18}
                />
              }
              title="教材费"
              description="教材、资料以及部分课程用品"
              amount={
                tuition.materialFee
              }
            />

            <TuitionRow
              icon={
                <CircleDollarSign
                  size={18}
                />
              }
              title="实习・实践费"
              description="专业实习、设备使用及实践课程费用"
              amount={
                tuition.practicalFee
              }
              last
            />
          </div>
        </div>

        {/* Payment */}

        <div className="mt-9">
          <h3 className="text-lg font-bold text-slate-900">
            缴费参考
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <PaymentCard
              number="01"
              title="入学前预计缴纳"
              amount={
                admissionPayment
              }
              description="报名费、入学金、半年学费以及其他初期费用"
            />

            <PaymentCard
              number="02"
              title="后期学费参考"
              amount={
                secondPayment
              }
              description="剩余半年课程学费，实际缴费时间以学校规定为准"
            />
          </div>
        </div>

        {/* Scholarship */}

        <div className="mt-9 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white
                text-emerald-600
                shadow-sm
              "
            >
              <BadgeCheck
                size={20}
              />
            </div>

            <div>
              <h3 className="font-bold text-emerald-900">
                奖学金・学费减免
              </h3>

              <p className="mt-2 text-sm leading-7 text-emerald-800/80">
                部分专门学校会提供留学生奖学金、
                学费减免、成绩优秀者减免或校内推荐制度。
                后续接入正式学校数据库后，
                Sakura 会在这里展示每所学校实际可申请的奖学金信息。
              </p>
            </div>
          </div>
        </div>

        {/* Notice */}

        <div className="mt-6 rounded-2xl bg-orange-50 p-5">
          <div className="flex items-start gap-3">
            <BadgeCheck
              size={20}
              className="mt-0.5 shrink-0 text-orange-600"
            />

            <div>
              <p className="font-bold text-orange-800">
                学费确认提示
              </p>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                专门学校不同学科之间的费用可能存在明显差异。
                IT、设计、美容、医疗、汽车等需要设备或大量实习的专业，
                还可能产生额外教材、工具、制服、资格考试及实习费用。
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Tuition Row
|--------------------------------------------------------------------------
*/

function TuitionRow({
  icon,
  title,
  description,
  amount,
  last = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  amount: number;
  last?: boolean;
}) {
  return (
    <div
      className={`
        flex
        flex-col
        gap-4
        bg-white
        p-5
        sm:flex-row
        sm:items-center
        sm:justify-between
        ${
          last
            ? ""
            : "border-b border-slate-100"
        }
      `}
    >
      <div className="flex items-start gap-4">
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-orange-50
            text-orange-600
          "
        >
          {icon}
        </div>

        <div>
          <p className="font-bold text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <p className="shrink-0 text-lg font-black text-slate-900">
        ¥
        {amount.toLocaleString()}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Payment Card
|--------------------------------------------------------------------------
*/

function PaymentCard({
  number,
  title,
  amount,
  description,
}: {
  number: string;
  title: string;
  amount: number;
  description: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-slate-50
        p-6
        transition
        hover:border-orange-200
        hover:bg-orange-50/40
      "
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-black tracking-widest text-orange-500">
          STEP {number}
        </span>

        <WalletCards
          size={19}
          className="text-slate-300"
        />
      </div>

      <p className="mt-4 text-sm font-bold text-slate-800">
        {title}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-950">
        ¥
        {amount.toLocaleString()}
      </p>

      <p className="mt-3 text-xs leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| MOCK Tuition
|--------------------------------------------------------------------------
|
| 正式数据库完成后删除 getMockTuition。
|
|--------------------------------------------------------------------------
*/

function getMockTuition(
  school: CollegeTuitionData
): TuitionData {
  const common = {
    applicationFee: 20000,
    admissionFee: 100000,
    annualTuition:
      school.tuition,
  };

  switch (school.category) {
    case "IT・AI":
      return {
        ...common,
        facilityFee: 120000,
        materialFee: 60000,
        practicalFee: 80000,
      };

    case "设计・动漫":
      return {
        ...common,
        facilityFee: 140000,
        materialFee: 90000,
        practicalFee: 100000,
      };

    case "商务・观光":
      return {
        ...common,
        facilityFee: 80000,
        materialFee: 50000,
        practicalFee: 60000,
      };

    case "美容・时尚":
      return {
        ...common,
        facilityFee: 120000,
        materialFee: 120000,
        practicalFee: 140000,
      };

    case "医疗・福祉":
      return {
        ...common,
        facilityFee: 130000,
        materialFee: 80000,
        practicalFee: 120000,
      };

    case "汽车・技术":
      return {
        ...common,
        facilityFee: 150000,
        materialFee: 90000,
        practicalFee: 150000,
      };
  }
}