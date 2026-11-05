"use client";

import React, { useMemo } from "react";

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function StarField() {
  // Generate deterministic stars to avoid SSR hydration mismatch
  const stars: Star[] = useMemo(() => {
    const list: Star[] = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        top: Math.round(((i * 37) % 98) + 1),
        left: Math.round(((i * 61) % 98) + 1),
        size: (i % 3) + 1.5,
        duration: 2 + (i % 4),
        delay: (i % 5) * 0.7,
        opacity: 0.3 + ((i % 5) * 0.15),
      });
    }
    return list;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Deep cosmic ambient gradient layers */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#8175FF]/15 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-[#40B9FF]/15 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-[#FF78B9]/10 blur-3xl" />

      {/* Twinkling star elements */}
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            opacity: star.opacity,
            boxShadow: star.size > 2 ? "0 0 6px rgba(255, 255, 255, 0.8)" : "none",
          }}
        />
      ))}
    </div>
  );
}
