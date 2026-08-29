"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type UniversityGalleryData = {
  id: string;
  name: string;
};

type Props = {
  university: UniversityGalleryData;
};

const galleryMap: Record<string, string[]> = {
  tokyo: [
    "/images/university/university01.jpg",
    "/images/university/university01.jpg",
    "/images/university/university01.jpg",
    "/images/university/university01.jpg",
  ],
  waseda: [
    "/images/university/university02.jpg",
    "/images/university/university02.jpg",
    "/images/university/university02.jpg",
    "/images/university/university02.jpg",
  ],
  kyoto: [
    "/images/university/university03.jpg",
    "/images/university/university03.jpg",
    "/images/university/university03.jpg",
    "/images/university/university03.jpg",
  ],
  osaka: [
    "/images/university/university04.jpg",
    "/images/university/university04.jpg",
    "/images/university/university04.jpg",
    "/images/university/university04.jpg",
  ],
  yokohama: [
    "/images/university/university05.jpg",
    "/images/university/university05.jpg",
    "/images/university/university05.jpg",
    "/images/university/university05.jpg",
  ],
  nagoya: [
    "/images/university/university06.jpg",
    "/images/university/university06.jpg",
    "/images/university/university06.jpg",
    "/images/university/university06.jpg",
  ],
  kyushu: [
    "/images/university/university07.jpg",
    "/images/university/university07.jpg",
    "/images/university/university07.jpg",
    "/images/university/university07.jpg",
  ],
};

export default function UniversityGallery({
  university,
}: Props) {
  const [selectedImage, setSelectedImage] = useState<
    string | null
  >(null);

  const images =
    galleryMap[university.id] ??
    ["/images/university/university01.jpg"];

  return (
    <>
      <section
        id="gallery"
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
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            校园环境
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {university.name} 校园及学习环境参考
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`
                group
                relative
                overflow-hidden
                rounded-2xl
                bg-slate-100
                ${
                  index === 0
                    ? "md:col-span-2 h-[360px]"
                    : "h-[240px]"
                }
              `}
            >
              <Image
                src={image}
                alt={`${university.name} 校园图片 ${
                  index + 1
                }`}
                fill
                sizes={
                  index === 0
                    ? "(max-width: 768px) 100vw, 900px"
                    : "(max-width: 768px) 100vw, 450px"
                }
                className="
                  object-cover
                  transition
                  duration-500
                  group-hover:scale-105
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-black/0
                  transition
                  group-hover:bg-black/10
                "
              />

              <div
                className="
                  absolute
                  bottom-4
                  right-4
                  rounded-full
                  bg-black/60
                  px-3
                  py-1.5
                  text-xs
                  font-bold
                  text-white
                  opacity-0
                  backdrop-blur
                  transition
                  group-hover:opacity-100
                "
              >
                点击查看
              </div>
            </button>
          ))}
        </div>

        <p className="mt-6 text-xs leading-6 text-slate-400">
          ※ 当前图片为 Mock 数据。后台接通后，
          Gallery 可直接读取学校图片列表。
        </p>
      </section>

      {selectedImage && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/90
            p-6
          "
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="
              absolute
              right-6
              top-6
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              backdrop-blur
              transition
              hover:bg-white/20
            "
          >
            <X size={22} />
          </button>

          <div
            className="
              relative
              h-[80vh]
              w-full
              max-w-6xl
            "
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt={`${university.name} 校园大图`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}