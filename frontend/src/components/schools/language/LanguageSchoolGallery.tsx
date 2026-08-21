import Card from "@/components/ui/Card/Card";

interface Props {
  id: string;
}

const images = [
  "/images/schools/language/classroom.jpg",
  "/images/schools/language/library.jpg",
  "/images/schools/language/lounge.jpg",
  "/images/schools/language/building.jpg",
  "/images/schools/language/dormitory.jpg",
  "/images/schools/language/activity.jpg",
];

export default function LanguageSchoolGallery({
  id,
}: Props) {
  return (
    <Card className="rounded-3xl p-8">

      {/* Title */}

      <div className="flex items-center gap-3">

        <div className="h-10 w-1 rounded-full bg-blue-600" />

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            学校环境
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Campus Gallery
          </p>

        </div>

      </div>

      {/* Description */}

      <p className="mt-8 leading-8 text-slate-600">
        校园拥有现代化教学设施、
        多媒体教室、自习室、
        图书阅览区以及学生休息区。
        学校定期举办文化交流、
        校外活动以及升学讲座，
        为留学生创造良好的学习环境。
      </p>

      {/* Gallery */}

      <div className="mt-10 grid grid-cols-12 gap-4">

        {/* Left Big */}

        <div className="col-span-12 lg:col-span-7">

          <div
            className="
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-slate-100
            "
          >

            <img
              src={images[0]}
              alt=""
              className="
                h-[420px]
                w-full
                object-cover
                transition
                duration-500
                hover:scale-105
              "
            />

          </div>

        </div>

        {/* Right */}

        <div className="col-span-12 lg:col-span-5">

          <div className="grid grid-cols-2 gap-4">

            {images.slice(1).map((item) => (

              <div
                key={item}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-100
                "
              >

                <img
                  src={item}
                  alt=""
                  className="
                    h-48
                    w-full
                    object-cover
                    transition
                    duration-500
                    hover:scale-110
                  "
                />

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="mt-10 grid gap-5 md:grid-cols-3">

        <div
          className="
            rounded-2xl
            bg-blue-50
            p-6
          "
        >

          <h3 className="font-bold text-blue-700">
            教学设施
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            多媒体教室、
            自习室、
            图书阅览区、
            升学辅导教室。
          </p>

        </div>

        <div
          className="
            rounded-2xl
            bg-emerald-50
            p-6
          "

        >

          <h3 className="font-bold text-emerald-700">
            校园生活
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            社团活动、
            文化交流、
            日本体验、
            校外旅行。
          </p>

        </div>

        <div
          className="
            rounded-2xl
            bg-violet-50
            p-6
          "
        >

          <h3 className="font-bold text-violet-700">
            学习环境
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            安静舒适，
            全天开放自习室，
            提供免费 Wi-Fi。
          </p>

        </div>

      </div>

    </Card>
  );
}