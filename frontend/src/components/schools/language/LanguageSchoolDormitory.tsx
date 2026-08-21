import {
  BedDouble,
  Home,
  MapPinned,
  Wifi,
  CookingPot,
  WashingMachine,
} from "lucide-react";

import Card from "@/components/ui/Card/Card";

interface Props {
  id: string;
}

const dormitories = [
  {
    title: "学生宿舍 A",
    room: "单人间",
    price: "¥48,000 / 月",
    distance: "步行 6 分钟",
  },
  {
    title: "学生宿舍 B",
    room: "双人间",
    price: "¥35,000 / 月",
    distance: "步行 10 分钟",
  },
];

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

export default function LanguageSchoolDormitory({
  id,
}: Props) {
  return (
    <Card className="rounded-3xl p-8">

      {/* Title */}

      <div className="flex items-center gap-3">

        <div className="h-10 w-1 rounded-full bg-blue-600" />

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
        学校提供留学生宿舍，
        可在来日前申请入住。
        房间配备床、书桌、空调、
        网络等基础生活设施，
        周边生活便利，
        非常适合刚来日本的新生。
      </p>

      {/* Dormitory Cards */}

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        {dormitories.map((item) => (

          <div
            key={item.title}
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              transition
              duration-300
              hover:-translate-y-1
              hover:border-blue-300
              hover:shadow-xl
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-blue-100
                  text-blue-600
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

            <div className="mt-6 space-y-3">

              <div className="flex justify-between">

                <span className="text-slate-500">
                  房型
                </span>

                <span className="font-semibold">
                  {item.room}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  房租
                </span>

                <span className="font-bold text-blue-600">
                  {item.price}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-slate-500">
                  距离学校
                </span>

                <div className="flex items-center gap-2">

                  <MapPinned
                    size={16}
                    className="text-blue-500"
                  />

                  <span className="font-medium">
                    {item.distance}
                  </span>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Facilities */}

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
                transition
                hover:border-blue-300
                hover:bg-white
              "
            >

              <div className="text-blue-600">
                {item.icon}
              </div>

              <span className="mt-3 text-sm font-medium text-slate-700">
                {item.name}
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Tip */}

      <div className="mt-8 rounded-2xl bg-blue-50 p-5">

        <p className="text-sm leading-7 text-blue-700">
          宿舍数量有限，
          建议收到学校录取通知后尽早申请。
          若宿舍已满，
          学校一般会协助学生寻找附近民间公寓或合作房源。
        </p>

      </div>

    </Card>
  );
}