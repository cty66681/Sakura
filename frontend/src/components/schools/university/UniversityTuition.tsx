"use client";

type UniversityTuitionData = {
  degree: "大学" | "大学院";
  tuition: number;
  type: "国立大学" | "公立大学" | "私立大学";
};

type Props = {
  university: UniversityTuitionData;
};

export default function UniversityTuition({
  university,
}: Props) {
  const isGraduate = university.degree === "大学院";

  /*
    Mock 数据

    以后后台接通后，可以直接把这些字段放进 university：
    admissionFee
    tuition
    facilityFee
    firstYearTotal
    scholarship
  */

  const admissionFee =
    university.type === "私立大学"
      ? 200000
      : 282000;

  const facilityFee =
    university.type === "私立大学"
      ? 180000
      : 0;

  const tuition = university.tuition;

  const firstYearTotal =
    admissionFee + tuition + facilityFee;

  const tuitionItems = [
    {
      label: "入学金",
      value: admissionFee,
      description: "首次入学时缴纳",
    },
    {
      label: "年度学费",
      value: tuition,
      description: "参考年度授课费用",
    },
    {
      label: "设施 / 教育费用",
      value: facilityFee,
      description:
        facilityFee > 0
          ? "部分私立大学会另外收取"
          : "当前参考数据暂无额外费用",
    },
  ];

  return (
    <section
      id="tuition"
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
      {/* 标题 */}

      <div>
        <h2 className="text-2xl font-black text-slate-900">
          {isGraduate
            ? "大学院学费参考"
            : "学费参考"}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {isGraduate
            ? "修士 / 博士课程的参考费用"
            : "本科阶段第一年度参考费用"}
        </p>
      </div>

      {/* 总费用 */}

      <div
        className="
          mt-8
          rounded-3xl
          border
          border-blue-100
          bg-blue-50/60
          p-7
        "
      >
        <p className="text-sm font-medium text-slate-500">
          第一年度预计费用
        </p>

        <div className="mt-3 flex flex-wrap items-end gap-3">
          <span className="text-4xl font-black text-slate-900">
            ¥{firstYearTotal.toLocaleString()}
          </span>

          <span className="pb-1 text-sm text-slate-500">
            / 第一年
          </span>
        </div>

        <p className="mt-3 text-xs leading-6 text-slate-400">
          入学金 + 年度学费 + 设施 / 教育费用
        </p>
      </div>

      {/* 费用明细 */}

      <div className="mt-8 space-y-4">
        {tuitionItems.map((item) => (
          <div
            key={item.label}
            className="
              flex
              flex-col
              gap-4
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              px-6
              py-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <h3 className="font-bold text-slate-900">
                {item.label}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {item.description}
              </p>
            </div>

            <div className="text-lg font-black text-slate-900">
              {item.value > 0
                ? `¥${item.value.toLocaleString()}`
                : "—"}
            </div>
          </div>
        ))}
      </div>

      {/* 奖学金 */}

      <div
        className="
          mt-8
          rounded-2xl
          border
          border-slate-200
          p-6
        "
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-slate-900">
              留学生奖学金
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              部分学生可申请学校奖学金、学费减免以及
              JASSO 等留学生支援项目。
            </p>
          </div>

          <span
            className="
              shrink-0
              rounded-full
              bg-blue-50
              px-4
              py-2
              text-xs
              font-bold
              text-blue-600
            "
          >
            可申请
          </span>
        </div>
      </div>

      {/* 大学 / 大学院提示 */}

      {isGraduate && (
        <div
          className="
            mt-6
            rounded-2xl
            border
            border-amber-100
            bg-amber-50
            px-5
            py-4
          "
        >
          <p className="text-sm leading-6 text-amber-800">
            大学院不同研究科、修士 / 博士课程的费用可能不同，
            实际金额以各研究科当年度募集要项为准。
          </p>
        </div>
      )}

      <p className="mt-6 text-xs leading-6 text-slate-400">
        ※ 当前金额为页面开发阶段的 Mock
        数据。后台接通后，将直接读取学校当年度学费、入学金、
        设施费、奖学金及学费减免数据。
      </p>
    </section>
  );
}