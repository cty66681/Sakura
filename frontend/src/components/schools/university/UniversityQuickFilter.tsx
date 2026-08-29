"use client";

import Container from "@/components/layout/Container";

const filters = [
  "全部",
  "国立大学",
  "私立大学",
  "大学院",
  "QS排名",
  "EJU",
  "文科",
  "理科",
  "艺术",
  "医学",
];

export default function QuickFilter() {
  return (
    <section className="bg-slate-50 border-b border-slate-200">
      <Container>
        <div className="flex flex-wrap gap-3 py-6">

          {filters.map((item, index) => (
            <button
              key={item}
              className={`
                rounded-full
                px-5
                py-2.5
                text-sm
                font-medium
                transition-all
                duration-200

                ${
                  index === 0
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-blue-500 hover:text-blue-600"
                }
              `}
            >
              {item}
            </button>
          ))}

        </div>
      </Container>
    </section>
  );
}