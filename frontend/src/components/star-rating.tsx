"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export function StarRating({ rating, count, size = "md", showCount = true }: StarRatingProps) {
  const sizes = {
    sm: { box: "w-4 h-4", icon: 10, text: "text-xs" },
    md: { box: "w-5 h-5", icon: 12, text: "text-sm" },
    lg: { box: "w-6 h-6", icon: 14, text: "text-base" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`${s.box} rounded-sm flex items-center justify-center ${
              i <= Math.floor(rating) ? "bg-[#F15C00]" : "bg-[#EBEBEB]"
            }`}
          >
            <Star size={s.icon} className="text-white fill-current" />
          </div>
        ))}
      </div>
      {showCount && count !== undefined && (
        <span className={`${s.text} font-medium text-[#5C6370]`}>
          {count} reseñas
        </span>
      )}
    </div>
  );
}
