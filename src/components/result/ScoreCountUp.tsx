"use client";

import React, { useEffect, useState } from "react";

interface ScoreCountUpProps {
  targetScore: number;
  durationMs?: number;
}

export function ScoreCountUp({ targetScore, durationMs = 1200 }: ScoreCountUpProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      // Ease out quad
      const current = Math.floor(progress * (2 - progress) * targetScore);
      setDisplayScore(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayScore(targetScore);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetScore, durationMs]);

  return <span className="tabular-nums">{displayScore}</span>;
}
