"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export interface FavoriteButtonProps {
  defaultFavorite?: boolean;
  size?: number;
}

export default function FavoriteButton({
  defaultFavorite = false,
  size = 22,
}: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(defaultFavorite);

  return (
    <button
      type="button"
      aria-label="收藏"
      onClick={() => setFavorite(!favorite)}
      className="
        flex
        items-center
        justify-center

        transition-transform
        duration-200

        hover:scale-110
        active:scale-95
      "
    >
      <Heart
        size={size}
        className={`
          transition-all
          duration-200

          ${
            favorite
              ? "fill-red-500 text-red-500"
              : "fill-transparent text-slate-400 hover:text-red-500 hover:fill-red-500"
          }
        `}
      />
    </button>
  );
}