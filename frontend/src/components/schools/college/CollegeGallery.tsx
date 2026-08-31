"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Maximize2,
  X,
} from "lucide-react";

import Card from "@/components/ui/Card/Card";

export type CollegeGalleryData = {
  id: string;
  name: string;
  category:
    | "IT・AI"
    | "设计・动漫"
    | "商务・观光"
    | "美容・时尚"
    | "医疗・福祉"
    | "汽车・技术";
};

interface Props {
  school: CollegeGalleryData;
}

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  label: string;
};

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 正式后端完成后：
|
| GET /api/colleges/:id/gallery
|
| 示例：
|
| GET /api/colleges/tokyo-tech-ai/gallery
|
| 建议返回：
|
| {
|   images: [
|     {
|       id: string;
|       url: string;
|       alt: string;
|       label: string;
|       sortOrder: number;
|     }
|   ]
| }
|
| 当前使用本地 MOCK 图片。
|
|--------------------------------------------------------------------------
*/

export default function CollegeGallery({
  school,
}: Props) {
  const images = useMemo(
    () => getMockGallery(school),
    [school]
  );

  const [activeIndex, setActiveIndex] =
    useState<number | null>(null);

  const activeImage =
    activeIndex !== null
      ? images[activeIndex]
      : null;

  const closeLightbox =
    useCallback(() => {
      setActiveIndex(null);
    }, []);

  const showPrevious =
    useCallback(() => {
      setActiveIndex((current) => {
        if (current === null) {
          return 0;
        }

        return current === 0
          ? images.length - 1
          : current - 1;
      });
    }, [images.length]);

  const showNext =
    useCallback(() => {
      setActiveIndex((current) => {
        if (current === null) {
          return 0;
        }

        return current ===
          images.length - 1
          ? 0
          : current + 1;
      });
    }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (
        event.key === "ArrowLeft"
      ) {
        showPrevious();
      }

      if (
        event.key === "ArrowRight"
      ) {
        showNext();
      }
    };

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    activeIndex,
    closeLightbox,
    showNext,
    showPrevious,
  ]);

  return (
    <>
      <section
        id="gallery"
        className="scroll-mt-28"
      >
        <Card className="rounded-3xl p-8">
          {/* Header */}

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1 rounded-full bg-orange-500" />

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  学校环境
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Campus Gallery
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-bold text-orange-700">
              <ImageIcon size={15} />

              {images.length} 张图片
            </div>
          </div>

          <p className="mt-7 leading-8 text-slate-600">
            查看
            <span className="mx-1 font-bold text-slate-900">
              {school.name}
            </span>
            的校园环境、实习教室、
            专业设备以及学生学习空间。
            点击图片可以查看大图。
          </p>

          {/* Gallery */}

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {images.map(
              (image, index) => {
                const featured =
                  index === 0;

                return (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() =>
                      setActiveIndex(
                        index
                      )
                    }
                    className={`
                      group
                      relative
                      overflow-hidden
                      rounded-2xl
                      bg-slate-100
                      text-left
                      ${
                        featured
                          ? "col-span-2 row-span-2 min-h-[320px] md:min-h-[390px]"
                          : "min-h-[155px] md:min-h-[190px]"
                      }
                    `}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="
                        absolute
                        inset-0
                        h-full
                        w-full
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
                        from-slate-950/75
                        via-slate-950/5
                        to-transparent
                      "
                    />

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                      <div>
                        <p
                          className={`
                            font-bold
                            text-white
                            ${
                              featured
                                ? "text-lg"
                                : "text-sm"
                            }
                          `}
                        >
                          {image.label}
                        </p>

                        {featured && (
                          <p className="mt-1 text-xs text-white/70">
                            {
                              school.name
                            }
                          </p>
                        )}
                      </div>

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-white/15
                          text-white
                          backdrop-blur
                          transition
                          group-hover:bg-orange-500
                        "
                      >
                        <Maximize2
                          size={16}
                        />
                      </div>
                    </div>
                  </button>
                );
              }
            )}
          </div>

          {/* Info */}

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm leading-7 text-slate-500">
              当前图片为 Sakura
              开发阶段示例图片。
              正式学校资料接入后，
              这里会展示各校真实教学楼、
              实训设备、教室、学生空间以及校园活动照片。
            </p>
          </div>
        </Card>
      </section>

      {/* Lightbox */}

      {activeImage && (
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
          role="dialog"
          aria-modal="true"
          aria-label="学校图片预览"
          onClick={
            closeLightbox
          }
        >
          {/* Close */}

          <button
            type="button"
            onClick={
              closeLightbox
            }
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
            aria-label="关闭图片"
          >
            <X size={22} />
          </button>

          {/* Counter */}

          <div
            className="
              absolute
              left-5
              top-5
              rounded-full
              bg-white/10
              px-4
              py-2
              text-sm
              font-medium
              text-white
              backdrop-blur
            "
          >
            {(activeIndex ?? 0) +
              1}
            {" / "}
            {images.length}
          </div>

          {/* Previous */}

          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              className="
                absolute
                left-3
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
                hover:bg-orange-500
                md:left-7
              "
              aria-label="上一张"
            >
              <ChevronLeft
                size={26}
              />
            </button>
          )}

          {/* Image */}

          <div
            className="
              flex
              max-h-[88vh]
              w-full
              max-w-6xl
              flex-col
              items-center
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              className="
                relative
                flex
                max-h-[78vh]
                w-full
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
              "
            >
              <img
                src={
                  activeImage.src
                }
                alt={
                  activeImage.alt
                }
                className="
                  max-h-[78vh]
                  max-w-full
                  object-contain
                "
              />
            </div>

            <div className="mt-4 text-center">
              <p className="font-bold text-white">
                {
                  activeImage.label
                }
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {school.name}
              </p>
            </div>
          </div>

          {/* Next */}

          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              className="
                absolute
                right-3
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
                hover:bg-orange-500
                md:right-7
              "
              aria-label="下一张"
            >
              <ChevronRight
                size={26}
              />
            </button>
          )}
        </div>
      )}
    </>
  );
}

/*
|--------------------------------------------------------------------------
| MOCK Gallery
|--------------------------------------------------------------------------
|
| 图片建议放：
|
| public/images/college/
|
| 当前为了避免不同学校需要大量图片，
| 所有学校暂时共用同一组测试图片。
|
| 后端 / CDN 完成后删除此函数。
|
|--------------------------------------------------------------------------
*/

function getMockGallery(
  school: CollegeGalleryData
): GalleryImage[] {
  const categoryLabels: Record<
    CollegeGalleryData["category"],
    string[]
  > = {
    "IT・AI": [
      "校园环境",
      "计算机教室",
      "AI・开发实训室",
      "学生学习空间",
      "团队开发课堂",
    ],

    "设计・动漫": [
      "校园环境",
      "设计工作室",
      "数字绘画教室",
      "作品制作空间",
      "学生作品展示",
    ],

    "商务・观光": [
      "校园环境",
      "商务实训教室",
      "酒店服务实训室",
      "学生学习空间",
      "企业实习课程",
    ],

    "美容・时尚": [
      "校园环境",
      "美容实训室",
      "化妆造型教室",
      "时尚设计空间",
      "学生实习课程",
    ],

    "医疗・福祉": [
      "校园环境",
      "介护实训室",
      "医疗事务教室",
      "专业设备",
      "学生实习课程",
    ],

    "汽车・技术": [
      "校园环境",
      "汽车整备实训场",
      "机械技术教室",
      "专业设备",
      "企业实践课程",
    ],
  };

  const labels =
    categoryLabels[
      school.category
    ];

  return labels.map(
    (label, index) => ({
      id: `${school.id}-gallery-${index + 1}`,

      src: `/images/college/college0${
        index + 1
      }.jpg`,

      alt: `${school.name} ${label}`,

      label,
    })
  );
}