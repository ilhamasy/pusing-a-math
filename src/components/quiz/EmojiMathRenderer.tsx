"use client";

import React from "react";
import { motion } from "framer-motion";
import { Question } from "@/types/quiz";

interface EmojiMathRendererProps {
  question: Question;
}

export function EmojiMathRenderer({ question }: EmojiMathRendererProps) {
  // Case 1: Counting objects (1 to 10 items)
  if (question.type === "counting") {
    const items = Array.from({ length: question.operandA });
    return (
      <div className="flex flex-col items-center justify-center my-4">
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-[280px] p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
          {items.map((_, index) => (
            <motion.span
              key={index}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="text-4xl md:text-5xl select-none inline-block hover:scale-125 transition-transform"
            >
              {question.emoji || "🍎"}
            </motion.span>
          ))}
        </div>
        <p className="mt-2 text-sm text-white/70 font-semibold">
          Hitung semua {question.emoji || "gambarnya"}!
        </p>
      </div>
    );
  }

  // Case 2: Visual Math (Group A + / - Group B)
  if (question.type === "visual_math" && question.emojiGroups) {
    const groupA = Array.from({ length: question.operandA });
    const groupB = Array.from({ length: question.operandB || 1 });
    const isSubtraction = question.operator === "−";

    const maxCount = Math.max(groupA.length, groupB.length);
    const emojiSizeClass =
      maxCount <= 3
        ? "text-3xl sm:text-4xl"
        : maxCount <= 6
        ? "text-2xl sm:text-3xl"
        : "text-xl sm:text-2xl";

    return (
      <div className="flex flex-col items-center justify-center my-3 w-full">
        {/* Main Equation Container */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-3xl bg-white/5 border border-white/10 shadow-inner max-w-full">
          {/* Group A Capsule with Parentheses */}
          <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-[#8175FF]/20 border-2 border-[#8175FF]/50 shadow-sm backdrop-blur-sm">
            <span className="text-2xl sm:text-3xl font-black text-[#FFD166] select-none leading-none">
              (
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 max-w-[130px] sm:max-w-[160px]">
              {groupA.map((_, i) => (
                <motion.span
                  key={`a-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className={`${emojiSizeClass} select-none leading-tight inline-block`}
                >
                  {question.emoji || "🎈"}
                </motion.span>
              ))}
            </div>
            <span className="text-2xl sm:text-3xl font-black text-[#FFD166] select-none leading-none">
              )
            </span>
          </div>

          {/* Math Operator */}
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FFD166]/20 border-2 border-[#FFD166]/50 shadow-sm shrink-0">
            <span className="text-xl sm:text-2xl font-black text-[#FFD166] select-none leading-none">
              {question.operator || "+"}
            </span>
          </div>

          {/* Group B Capsule with Parentheses */}
          <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-[#FF78B9]/20 border-2 border-[#FF78B9]/50 shadow-sm backdrop-blur-sm">
            <span className="text-2xl sm:text-3xl font-black text-[#FF78B9] select-none leading-none">
              (
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 max-w-[130px] sm:max-w-[160px]">
              {groupB.map((_, i) => (
                <motion.span
                  key={`b-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.04 }}
                  className={`${emojiSizeClass} select-none leading-tight inline-block`}
                >
                  {question.emoji || "🎈"}
                </motion.span>
              ))}
            </div>
            <span className="text-2xl sm:text-3xl font-black text-[#FF78B9] select-none leading-none">
              )
            </span>
          </div>

          {/* Equals Question Mark */}
          <div className="inline-flex items-center px-1 shrink-0">
            <span className="text-2xl sm:text-3xl font-black text-[#40B9FF] select-none">
              = ?
            </span>
          </div>
        </div>

        <p className="mt-2 text-xs sm:text-sm text-white/70 font-semibold text-center">
          {isSubtraction ? "Hitung hasil pengurangannya!" : "Hitung semua gambar bersama-sama!"}
        </p>
      </div>
    );
  }

  // Case 3: Comparison Least ("Manakah yang paling sedikit?")
  if (question.type === "comparison_least") {
    return (
      <div className="flex flex-col items-center justify-center my-2">
        <p className="text-xs md:text-sm text-[#FFD166] font-bold">
          Pilih kotak (A, B, C, atau D) yang isinya paling sedikit! 👇
        </p>
      </div>
    );
  }

  // Case 4: Numerical Addition / Subtraction
  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner flex items-center justify-center gap-4">
        <span className="text-5xl md:text-6xl font-black text-white select-none">
          {question.operandA}
        </span>
        <span className="text-4xl md:text-5xl font-black text-[#FFD166] select-none">
          {question.operator}
        </span>
        <span className="text-5xl md:text-6xl font-black text-white select-none">
          {question.operandB}
        </span>
        <span className="text-4xl md:text-5xl font-black text-[#40B9FF] select-none">= ?</span>
      </div>
    </div>
  );
}
