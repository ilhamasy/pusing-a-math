"use client";

import React from "react";
import { motion } from "framer-motion";
import { AudioControl } from "@/components/shared/AudioControl";

interface QuizHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  score: number;
}

export function QuizHeader({ currentIndex, totalQuestions, score }: QuizHeaderProps) {
  const currentNumber = currentIndex + 1;
  const progressPercent = Math.round((currentNumber / totalQuestions) * 100);

  return (
    <header className="w-full max-w-md mx-auto mb-4 px-2" aria-label="Quiz progress">
      {/* Top status bar: Question Counter & Score Badge */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#8175FF]/25 border border-[#8175FF]/40 text-sm font-extrabold text-[#FFD166] shadow-sm">
            Question {currentNumber} of {totalQuestions}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white/90">
            ⭐ {score} pts
          </span>
          <AudioControl />
        </div>
      </div>

      {/* Cosmic Progress Bar with Traveling Rocket */}
      <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden border border-white/15 p-0.5 backdrop-blur-sm">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#40B9FF] via-[#8175FF] to-[#FF78B9] shadow-md shadow-[#40B9FF]/40"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </header>
  );
}
