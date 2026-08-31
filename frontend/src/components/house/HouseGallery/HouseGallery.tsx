"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  ImageIcon,
  Maximize2,
  X,
} from "lucide-react";

export interface HouseGalleryProps {
  images: string[];
}

export default function HouseGallery({
  images,
}: HouseGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [previewOpen, setPreviewOpen] =
    useState(false);

  const hasImages = images.length > 0;
  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (current >= images.length) {
      setCurrent(0);
    }
  }, [images.length, current]);

  useEffect(() => {
    if (!previewOpen) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent  
    ) {
      if (event.key === "Escape") {
        setPreviewOpen(false);
      }

      if (
        event.key === "ArrowLeft" &&
        hasMultiple
      ) {
        setCurrent((value) =>
          value === 0
            ? images.length - 1
            : value - 1
        );
      }

      if (
        event.key === "ArrowRight" &&
        hasMultiple
      ) {
        setCurrent((value) =>
          value === images.length - 1
            ? 0
            : value + 1
        );
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    previewOpen,
    hasMultiple,
    images.length,
  ]);

  function previousImage() {
    if (!hasMultiple) {
      return;
    }

    setCurrent((value) =>
      value === 0
        ? images.length - 1
        : value - 1
    );
  }

  function nextImage() {
    if (!hasMultiple) {
      return;
    }

    setCurrent((value) =>
      value === images.length - 1
        ? 0
        : value + 1
    );
  }

  /* ===================================================== */
  /* No image */
  /* ===================================================== */

  if (!hasImages) {
    return (
      <section
        className="
          relative
          flex
          min-h-[320px]
          items-center
          justify-center
          overflow-hidden
          rounded-[28px]
          border
          border-slate-200
          bg-slate-100
          sm:min-h-[420px]
        "
      >
        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)]
            [background-size:32px_32px]
          "
        />

        <div className="relative text-center">
          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-white
              text-slate-400
              shadow-sm
            "
          >
            <Home size={28} />
          </div>

          <p
            className="
              mt-4
              text-sm
              font-bold
              text-slate-500
            "
          >
            暂无房源照片
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-400
            "
          >
            房源图片更新后将在这里显示
          </p>
        </div>
      </section>
    );
  }

  /* ===================================================== */
  /* Gallery */
  /* ===================================================== */

  return (
    <>
      <section className="space-y-3">
        {/* Main image */}

        <div
          className="
            group
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-slate-200
            bg-slate-100
            shadow-sm
          "
        >
          <img
            src={images[current]}
            alt={`房源照片 ${current + 1}`}
            className="
              h-[320px]
              w-full
              object-cover
              sm:h-[440px]
              lg:h-[520px]
            "
          />

          {/* Gradient */}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-28
              bg-gradient-to-t
              from-black/50
              to-transparent
            "
          />

          {/* Count */}

          <div
            className="
              absolute
              bottom-4
              left-4
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-black/60
              px-3
              py-2
              text-xs
              font-bold
              text-white
              backdrop-blur-md
            "
          >
            <ImageIcon size={14} />

            {current + 1} / {images.length}
          </div>

          {/* Full screen */}

          <button
            type="button"
            onClick={() =>
              setPreviewOpen(true)
            }
            aria-label="查看大图"
            className="
              absolute
              right-4
              top-4
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-black/50
              text-white
              backdrop-blur-md
              transition
              hover:bg-black/70
            "
          >
            <Maximize2 size={17} />
          </button>

          {/* Previous */}

          {hasMultiple && (
            <button
              type="button"
              onClick={previousImage}
              aria-label="上一张图片"
              className="
                absolute
                left-4
                top-1/2
                flex
                h-11
                w-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-black/45
                text-white
                opacity-0
                backdrop-blur-md
                transition
                hover:bg-black/70
                group-hover:opacity-100
                max-sm:opacity-100
              "
            >
              <ChevronLeft size={21} />
            </button>
          )}

          {/* Next */}

          {hasMultiple && (
            <button
              type="button"
              onClick={nextImage}
              aria-label="下一张图片"
              className="
                absolute
                right-4
                top-1/2
                flex
                h-11
                w-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-black/45
                text-white
                opacity-0
                backdrop-blur-md
                transition
                hover:bg-black/70
                group-hover:opacity-100
                max-sm:opacity-100
              "
            >
              <ChevronRight size={21} />
            </button>
          )}
        </div>

        {/* Thumbnails */}

        {hasMultiple && (
          <div
            className="
              flex
              gap-2
              overflow-x-auto
              pb-1
            "
          >
            {images.map((image, index) => {
              const active =
                current === index;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() =>
                    setCurrent(index)
                  }
                  aria-label={`查看第 ${
                    index + 1
                  } 张房源照片`}
                  className={`
                    relative
                    shrink-0
                    overflow-hidden
                    rounded-xl
                    border-2
                    transition
                    ${
                      active
                        ? "border-blue-500"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }
                  `}
                >
                  <img
                    src={image}
                    alt=""
                    className="
                      h-20
                      w-28
                      object-cover
                      sm:h-24
                      sm:w-36
                    "
                  />

                  {active && (
                    <div
                      className="
                        absolute
                        inset-0
                        ring-2
                        ring-inset
                        ring-blue-500/20
                      "
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ================================================= */}
      {/* Fullscreen Preview */}
      {/* ================================================= */}

      {previewOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/95
            p-4
          "
        >
          <button
            type="button"
            onClick={() =>
              setPreviewOpen(false)
            }
            aria-label="关闭图片预览"
            className="
              absolute
              right-5
              top-5
              z-10
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
            <X size={20} />
          </button>

          <img
            src={images[current]}
            alt={`房源照片 ${current + 1}`}
            className="
              max-h-[88vh]
              max-w-[92vw]
              object-contain
            "
          />

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={previousImage}
                aria-label="上一张图片"
                className="
                  absolute
                  left-4
                  top-1/2
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
                  sm:left-8
                "
              >
                <ChevronLeft size={24} />
              </button>

              <button
                type="button"
                onClick={nextImage}
                aria-label="下一张图片"
                className="
                  absolute
                  right-4
                  top-1/2
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
                  sm:right-8
                "
              >
                <ChevronRight size={24} />
              </button>

              <div
                className="
                  absolute
                  bottom-6
                  left-1/2
                  -translate-x-1/2
                  rounded-full
                  bg-white/10
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-white
                  backdrop-blur-md
                "
              >
                {current + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}