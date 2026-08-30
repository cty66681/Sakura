"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
} from "lucide-react";

import Card from "@/components/ui/Card/Card";

export type LanguageSchoolGalleryData = {
  id: string;
  name: string;
};

interface Props {
  school: LanguageSchoolGalleryData;
}

type GalleryImage = {
  src: string;
  alt: string;
  category: string;
};

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 正式后端完成后：
|
| GET /api/language-schools/:id/gallery
|
| 建议返回：
|
| {
|   images: [
|     {
|       id: string;
|       url: string;
|       alt: string;
|       category: string;
|       sortOrder: number;
|     }
|   ]
| }
|
| 后期学校图片可以来自：
| - Sakura 后台上传
| - 学校官方授权图片
| - 对象存储 / CDN
|
| 当前暂时使用本地 MOCK 图片。
|
|--------------------------------------------------------------------------
*/

const defaultImages: GalleryImage[] = [
  {
    src: "/images/schools/language/classroom.jpg",
    alt: "学校教室",
    category: "教学环境",
  },
  {
    src: "/images/schools/language/library.jpg",
    alt: "学校图书区域",
    category: "学习环境",
  },
  {
    src: "/images/schools/language/lounge.jpg",
    alt: "学生休息区",
    category: "校园环境",
  },
  {
    src: "/images/schools/language/building.jpg",
    alt: "学校建筑",
    category: "学校外观",
  },
  {
    src: "/images/schools/language/dormitory.jpg",
    alt: "学生宿舍",
    category: "学生宿舍",
  },
  {
    src: "/images/schools/language/activity.jpg",
    alt: "学校活动",
    category: "校园活动",
  },
];

export default function LanguageSchoolGallery({
  school,
}: Props) {
  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);

  const images = defaultImages;

  const openImage = (index: number) => {
    setSelectedIndex(index);
  };

  const closeImage = () => {
    setSelectedIndex(null);
  };

  const previousImage = () => {
    setSelectedIndex((current) => {
      if (current === null) {
        return null;
      }

      return current === 0
        ? images.length - 1
        : current - 1;
    });
  };

  const nextImage = () => {
    setSelectedIndex((current) => {
      if (current === null) {
        return null;
      }

      return current === images.length - 1
        ? 0
        : current + 1;
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Lightbox Keyboard Control
  |--------------------------------------------------------------------------
  |
  | ESC        关闭
  | ArrowLeft  上一张
  | ArrowRight 下一张
  |
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        closeImage();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    };

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedIndex]);

  return (
    <>
      <section
        id="gallery"
        className="scroll-mt-28"
      >
        <Card className="rounded-3xl p-8">
          {/* Title */}

          <div className="flex items-center gap-3">
            <div className="h-10 w-1 rounded-full bg-emerald-600" />

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
            这里展示{" "}
            <span className="font-semibold text-slate-800">
              {school.name}
            </span>{" "}
            的教学环境、学习空间、学生宿舍以及校园活动。
            点击图片可以查看大图，并可左右切换浏览。
          </p>

          {/* Gallery */}

          <div className="mt-10 grid grid-cols-12 gap-4">
            {/* Main Image */}

            <div className="col-span-12 lg:col-span-7">
              <GalleryItem
                image={images[0]}
                large
                onClick={() =>
                  openImage(0)
                }
              />
            </div>

            {/* Right */}

            <div className="col-span-12 lg:col-span-5">
              <div className="grid grid-cols-2 gap-4">
                {images
                  .slice(1, 5)
                  .map(
                    (
                      image,
                      index
                    ) => (
                      <GalleryItem
                        key={
                          image.src
                        }
                        image={
                          image
                        }
                        onClick={() =>
                          openImage(
                            index +
                              1
                          )
                        }
                      />
                    )
                  )}
              </div>
            </div>
          </div>

          {/* Last image */}

          {images.length > 5 && (
            <button
              type="button"
              onClick={() =>
                openImage(5)
              }
              className="
                group
                relative
                mt-4
                h-48
                w-full
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-slate-100
                text-left
              "
            >
              <Image
                src={images[5].src}
                alt={`${school.name} ${images[5].alt}`}
                fill
                sizes="(max-width: 768px) 100vw, 900px"
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
                  bg-slate-950/20
                  transition
                  group-hover:bg-slate-950/40
                "
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="
                    rounded-full
                    border
                    border-white/20
                    bg-slate-950/60
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    backdrop-blur
                  "
                >
                  查看全部 {images.length} 张图片
                </div>
              </div>
            </button>
          )}

          {/* Bottom */}

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-emerald-50 p-6">
              <h3 className="font-bold text-emerald-700">
                教学设施
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                多媒体教室、自习室、
                图书阅览区以及升学辅导空间。
              </p>
            </div>

            <div className="rounded-2xl bg-cyan-50 p-6">
              <h3 className="font-bold text-cyan-700">
                校园生活
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                文化交流、日本体验、
                校外活动以及学生交流活动。
              </p>
            </div>

            <div className="rounded-2xl bg-violet-50 p-6">
              <h3 className="font-bold text-violet-700">
                学习环境
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                提供安静的学习空间、
                自习区域以及校园网络环境。
              </p>
            </div>
          </div>

          <p className="mt-6 text-xs leading-6 text-slate-400">
            ※
            当前图片为开发阶段展示素材。正式上线后将替换为对应学校的实际授权图片。
          </p>
        </Card>
      </section>

      {/* Lightbox */}

      {selectedIndex !== null && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-slate-950/95
            p-4
            backdrop-blur-sm
          "
          onClick={closeImage}
        >
          {/* Close */}

          <button
            type="button"
            onClick={closeImage}
            aria-label="关闭图片"
            className="
              absolute
              right-5
              top-5
              z-20
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              transition
              hover:bg-white/20
            "
          >
            <X size={22} />
          </button>

          {/* Previous */}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              previousImage();
            }}
            aria-label="上一张"
            className="
              absolute
              left-4
              top-1/2
              z-20
              flex
              h-12
              w-12
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              transition
              hover:bg-white/20
              md:left-8
            "
          >
            <ChevronLeft
              size={26}
            />
          </button>

          {/* Image */}

          <div
            className="
              relative
              h-[75vh]
              w-full
              max-w-6xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <Image
              src={
                images[
                  selectedIndex
                ].src
              }
              alt={`${school.name} ${
                images[
                  selectedIndex
                ].alt
              }`}
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {/* Next */}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              nextImage();
            }}
            aria-label="下一张"
            className="
              absolute
              right-4
              top-1/2
              z-20
              flex
              h-12
              w-12
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-white/10
              text-white
              transition
              hover:bg-white/20
              md:right-8
            "
          >
            <ChevronRight
              size={26}
            />
          </button>

          {/* Bottom Info */}

          <div
            className="
              absolute
              bottom-5
              left-1/2
              z-20
              -translate-x-1/2
              rounded-full
              bg-black/50
              px-5
              py-2
              text-sm
              text-white
              backdrop-blur
            "
          >
            {selectedIndex + 1} /{" "}
            {images.length}
            <span className="mx-2 text-white/40">
              ·
            </span>
            {
              images[
                selectedIndex
              ].category
            }
          </div>
        </div>
      )}
    </>
  );
}

interface GalleryItemProps {
  image: GalleryImage;
  large?: boolean;
  onClick: () => void;
}

function GalleryItem({
  image,
  large = false,
  onClick,
}: GalleryItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        relative
        block
        w-full
        overflow-hidden
        border
        border-slate-200
        bg-slate-100
        text-left
        ${
          large
            ? "h-[420px] rounded-3xl"
            : "h-[202px] rounded-2xl"
        }
      `}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={
          large
            ? "(max-width: 1024px) 100vw, 60vw"
            : "(max-width: 768px) 50vw, 25vw"
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
          bg-gradient-to-t
          from-slate-950/50
          via-transparent
          to-transparent
          opacity-70
          transition
          group-hover:opacity-100
        "
      />

      <div
        className="
          absolute
          bottom-4
          left-4
          right-4
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <span className="text-sm font-semibold text-white">
          {image.category}
        </span>

        <span
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-white/15
            text-white
            opacity-0
            backdrop-blur
            transition
            group-hover:opacity-100
          "
        >
          <Expand size={15} />
        </span>
      </div>
    </button>
  );
}