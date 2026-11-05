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
          Count every {question.emoji || "item"}!
        </p>
      </div>
    );
  }

  // Case 2: Visual Math (Group A + / - Group B)
  if (question.type === "visual_math" && question.emojiGroups) {
    const groupA = Array.from({ length: question.operandA });
    const groupB = Array.from({ length: question.operandB || 1 });
    const isSubtraction = question.operator === "−";

    return (
      <div className="flex flex-col items-center justify-center my-4">
        <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner flex-wrap">
          {/* Group A */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[120px]">
            {groupA.map((_, i) => (
              <motion.span
                key={`a-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="text-3xl md:text-4xl select-none"
              >
                {question.emoji || "🍓"}
              </motion.span>
            ))}
          </div>

          {/* Bold Operator */}
          <span className="text-3xl font-black text-[#FFD166] px-1 select-none">
            {question.operator || "+"}
          </span>

          {/* Group B */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[120px]">
            {groupB.map((_, i) => (
              <motion.span
                key={`b-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                className={`text-3xl md:text-4xl select-none ${
                  isSubtraction ? "opacity-60 grayscale-[40%] line-through" : ""
                }`}
              >
                {question.emoji || "🍓"}
              </motion.span>
            ))}
          </div>

          {/* Equals Question Mark */}
          <span className="text-3xl font-black text-[#40B9FF] px-1 select-none">= ?</span>
        </div>
        <p className="mt-2 text-xs md:text-sm text-white/70 font-semibold">
          {isSubtraction ? "Take away the items, what is left?" : "Count both groups together!"}
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
