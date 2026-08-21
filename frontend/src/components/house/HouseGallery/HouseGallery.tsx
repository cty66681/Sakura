"use client";

import { useState } from "react";

export interface HouseGalleryProps {
  images: string[];
}

export default function HouseGallery({
  images,
}: HouseGalleryProps) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">

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
          src={images[current]}
          alt=""
          className="
            h-[520px]
            w-full
            object-cover
          "
        />
      </div>

      <div className="flex gap-3 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`
              overflow-hidden
              rounded-xl
              border-2
              transition
              ${
                current === index
                  ? "border-blue-500"
                  : "border-transparent"
              }
            `}
          >
            <img
              src={image}
              alt=""
              className="
                h-24
                w-36
                object-cover
              "
            />
          </button>
        ))}
      </div>

    </div>
  );
}