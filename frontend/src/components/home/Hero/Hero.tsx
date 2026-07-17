import Container from "@/components/layout/Container";
import { Search } from "lucide-react";

const hotTags = [
  "Java",
  "IT派遣",
  "租房",
  "永住",
  "电话诈骗",
  "副业",
];

const stats = [
  {
    value: "3,200+",
    label: "真实经验",
  },
  {
    value: "8,600+",
    label: "招聘信息",
  },
  {
    value: "6,500+",
    label: "房屋信息",
  },
  {
    value: "560+",
    label: "避坑提醒",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">

      {/* Background */}

      <div className="absolute left-1/2 top-[-260px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />

      <Container>

        <div className="relative py-28">

          {/* Badge */}

          <div className="flex justify-center">

            <div className="rounded-full border border-blue-200 bg-white px-5 py-2 text-sm font-medium text-blue-600 shadow-sm">
              🌸 Project Sakura
            </div>

          </div>

          {/* Title */}

          <h1 className="mt-10 text-center text-6xl font-black tracking-tight text-slate-900 leading-tight">

            帮助每一个在日本生活的人

            <br />

            少走一点弯路

          </h1>

          {/* Subtitle */}

          <p className="mx-auto mt-8 max-w-3xl text-center text-xl leading-9 text-slate-600">

            工作、租房、经验分享、避坑提醒、AI助手。

            <br />

            一个真正属于在日华人的生活平台。

          </p>

          {/* Search */}

          <div className="mx-auto mt-16 max-w-3xl">

            <div className="flex h-16 items-center rounded-2xl border border-slate-200 bg-white px-6 shadow-xl">

              <Search
                size={22}
                className="mr-4 text-slate-400"
              />

              <input
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-slate-400"
                placeholder="今天想找什么？"
              />

              <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">

                搜索

              </button>

            </div>

          </div>

          {/* Hot */}

          <div className="mt-10 flex flex-wrap justify-center gap-3">

            {hotTags.map((item) => (

              <button
                key={item}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
              >

                #{item}

              </button>

            ))}

          </div>

          {/* Stats */}

          <div className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-6 lg:grid-cols-4">

            {stats.map((item) => (

              <div
                key={item.label}
                className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                <h2 className="text-4xl font-black text-blue-600">

                  {item.value}

                </h2>

                <p className="mt-3 text-slate-500">

                  {item.label}

                </p>

              </div>

            ))}

          </div>

        </div>

      </Container>

    </section>
  );
}