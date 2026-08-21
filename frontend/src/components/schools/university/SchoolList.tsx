"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "@/components/layout/Container";

const universities = [
  {
    id: 1,
    name: "东京大学",
    type: "国立大学",
    city: "东京",
    image: "/images/university/university01.png",
    qs: "#28",
    deviation: "72",
    tuition: "535,800円 / 年",
    eju: "需要",
  },
  {
    id: 2,
    name: "早稻田大学",
    type: "私立大学",
    city: "东京",
    image: "/images/university/university02.jpg",
    qs: "#181",
    deviation: "70",
    tuition: "1,100,000円 / 年",
    eju: "需要",
  },
  {
    id: 3,
    name: "庆应义塾大学",
    type: "私立大学",
    city: "东京",
    image: "/images/university/university03.jpg",
    qs: "#214",
    deviation: "69",
    tuition: "1,350,000円 / 年",
    eju: "需要",
  },
];

export default function SchoolList() {
  return (
    <section className="bg-slate-50 py-10">

      <Container>

        <div className="space-y-6">

          {universities.map((school) => (

            <Link
              key={school.id}
              href={`/schools/university/${school.id}`}
            >
              <div
                className="
                  overflow-hidden
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >

                <div className="flex">

                  {/* 图片 */}

                  <div className="relative h-[220px] w-[320px]">

                    <Image
                      src={school.image}
                      alt={school.name}
                      fill
                      className="object-cover"
                    />

                  </div>

                  {/* 内容 */}

                  <div className="flex flex-1 flex-col justify-between p-8">

                    <div>

                      <div className="flex items-center gap-3">

                        <span
                          className="
                            rounded-full
                            bg-blue-100
                            px-3
                            py-1
                            text-sm
                            font-semibold
                            text-blue-600
                          "
                        >
                          {school.type}
                        </span>

                        <span className="text-slate-400">
                          {school.city}
                        </span>

                      </div>

                      <h2
                        className="
                          mt-4
                          text-3xl
                          font-black
                          text-slate-900
                        "
                      >
                        {school.name}
                      </h2>

                    </div>

                    <div className="grid grid-cols-4 gap-5">

                      <Info title="QS" value={school.qs} />

                      <Info title="偏差值" value={school.deviation} />

                      <Info title="EJU" value={school.eju} />

                      <Info title="学费" value={school.tuition} />

                    </div>

                    <div className="mt-6">

                      <button
                        className="
                          rounded-xl
                          bg-blue-600
                          px-6
                          py-3
                          font-semibold
                          text-white
                          transition
                          hover:bg-blue-700
                        "
                      >
                        查看详情
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </Container>

    </section>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>

      <div className="text-sm text-slate-400">
        {title}
      </div>

      <div className="mt-2 font-bold text-slate-800">
        {value}
      </div>

    </div>
  );
}