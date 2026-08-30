import {
  BedDouble,
  Home,
  MapPinned,
  Wifi,
  CookingPot,
  WashingMachine,
} from "lucide-react";

import Card from "@/components/ui/Card/Card";

export type LanguageSchoolDormitoryData = {
  id: string;
  name: string;
  area: string;
  location: string;
};

interface Props {
  school: LanguageSchoolDormitoryData;
}

type Dormitory = {
  id: string;
  title: string;
  room: string;
  price: number;
  distance: string;
};

const facilities = [
  {
    icon: <Wifi size={20} />,
    name: "免费 Wi-Fi",
  },
  {
    icon: <CookingPot size={20} />,
    name: "公共厨房",
  },
  {
    icon: <WashingMachine size={20} />,
    name: "洗衣机",
  },
  {
    icon: <BedDouble size={20} />,
    name: "家具齐全",
  },
];

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 正式后端完成后：
|
| GET /api/language-schools/:id/dormitories
|
| 建议返回：
|
| {
|   available: boolean;
|   description: string;
|   dormitories: [
|     {
|       id: string;
|       name: string;
|       roomType: string;
|       monthlyRent: number;
|       distance: string;
|       availableRooms: number;
|     }
|   ];
|   facilities: string[];
| }
|
| 当前暂时使用 MOCK DATA。
|
|--------------------------------------------------------------------------
*/

const dormitoryMock: Record<string, Dormitory[]> = {
  "1": [
    {
      id: "1-a",
      title: "新宿学生宿舍 A",
      room: "单人间",
      price: 48000,
      distance: "步行约 6 分钟",
    },
    {
      id: "1-b",
      title: "新宿学生宿舍 B",
      room: "双人间",
      price: 35000,
      distance: "步行约 10 分钟",
    },
  ],

  "2": [
    {
      id: "2-a",
      title: "东京国际学生寮",
      room: "单人间",
      price: 52000,
      distance: "电车约 12 分钟",
    },
    {
      id: "2-b",
      title: "新宿合作宿舍",
      room: "双人间",
      price: 38000,
      distance: "步行约 15 分钟",
    },
  ],

  "3": [
    {
      id: "3-a",
      title: "大阪学生宿舍",
      room: "单人间",
      price: 42000,
      distance: "自行车约 8 分钟",
    },
    {
      id: "3-b",
      title: "大阪国际学生寮",
      room: "双人间",
      price: 30000,
      distance: "电车约 10 分钟",
    },
  ],

  "4": [
    {
      id: "4-a",
      title: "京都国际学生宿舍",
      room: "单人间",
      price: 45000,
      distance: "公交约 10 分钟",
    },
  ],

  "5": [
    {
      id: "5-a",
      title: "名古屋学生寮",
      room: "单人间",
      price: 40000,
      distance: "步行约 12 分钟",
    },
    {
      id: "5-b",
      title: "名古屋合作宿舍",
      room: "双人间",
      price: 29000,
      distance: "地铁约 8 分钟",
    },
  ],

  "6": [
    {
      id: "6-a",
      title: "博多国际学生寮",
      room: "单人间",
      price: 38000,
      distance: "自行车约 10 分钟",
    },
  ],

  "7": [
    {
      id: "7-a",
      title: "札幌学生宿舍",
      room: "单人间",
      price: 36000,
      distance: "地铁约 10 分钟",
    },
    {
      id: "7-b",
      title: "北海道国际学生寮",
      room: "双人间",
      price: 28000,
      distance: "公交约 15 分钟",
    },
  ],

  "8": [
    {
      id: "8-a",
      title: "新宿就业学生寮",
      room: "单人间",
      price: 50000,
      distance: "步行约 8 分钟",
    },
  ],
};

export default function LanguageSchoolDormitory({
  school,
}: Props) {
  const dormitories =
    dormitoryMock[school.id] ?? [];

  const hasDormitory =
    dormitories.length > 0;

  return (
    <section
      id="dormitory"
      className="scroll-mt-28"
    >
      <Card className="rounded-3xl p-8">
        {/* Title */}

        <div className="flex items-center gap-3">
          <div className="h-10 w-1 rounded-full bg-emerald-600" />

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              学生宿舍
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Student Dormitory
            </p>
          </div>
        </div>

        {/* Description */}

        <p className="mt-8 leading-8 text-slate-600">
          {school.name}
          {hasDormitory
            ? ` 提供或合作提供留学生宿舍。当前显示的是 ${school.location} 周边的住宿参考信息，可在来日前咨询申请。`
            : " 当前暂无学校宿舍资料，可向学校咨询合作公寓或附近民间房源。"}
        </p>

        {/* Dormitory Cards */}

        {hasDormitory ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {dormitories.map((item) => (
              <div
                key={item.id}
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:border-emerald-300
                  hover:shadow-xl
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-emerald-100
                      text-emerald-600
                    "
                  >
                    <Home size={24} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {item.room}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500">
                      房型
                    </span>

                    <span className="font-semibold text-slate-900">
                      {item.room}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500">
                      房租
                    </span>

                    <span className="font-bold text-emerald-600">
                      ¥
                      {item.price.toLocaleString()}{" "}
                      / 月
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500">
                      距离学校
                    </span>

                    <div className="flex items-center gap-2 text-right">
                      <MapPinned
                        size={16}
                        className="shrink-0 text-emerald-500"
                      />

                      <span className="font-medium text-slate-800">
                        {item.distance}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <Home
              size={32}
              className="mx-auto text-slate-400"
            />

            <p className="mt-4 font-semibold text-slate-700">
              暂无宿舍资料
            </p>

            <p className="mt-2 text-sm text-slate-500">
              后续接入学校数据后自动更新。
            </p>
          </div>
        )}

        {/* Facilities */}

        {hasDormitory && (
          <div className="mt-10">
            <h3 className="text-lg font-bold text-slate-900">
              宿舍设施
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
              {facilities.map((item) => (
                <div
                  key={item.name}
                  className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-6
                    text-center
                    transition
                    hover:border-emerald-300
                    hover:bg-white
                  "
                >
                  <div className="text-emerald-600">
                    {item.icon}
                  </div>

                  <span className="mt-3 text-sm font-medium text-slate-700">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tip */}

        <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <p className="text-sm leading-7 text-emerald-800">
            ※
            宿舍价格、空房数量和入住条件可能随时变化。
            收到录取通知后建议尽早确认。若学校宿舍已满，
            可咨询学校合作宿舍或附近民间公寓。
          </p>
        </div>

        {/*
        |--------------------------------------------------------------------------
        | TODO [API - POST]
        |--------------------------------------------------------------------------
        |
        | 后期如果 Sakura 提供“咨询宿舍 / 申请宿舍”功能：
        |
        | POST /api/language-schools/:id/dormitory-inquiries
        |
        | 或：
        |
        | POST /api/language-schools/:id/dormitory-applications
        |
        | 请求数据可包含：
        |
        | dormitoryId
        | studentId
        | desiredMoveInDate
        | roomType
        | message
        |
        |--------------------------------------------------------------------------
        */}
      </Card>
    </section>
  );
}