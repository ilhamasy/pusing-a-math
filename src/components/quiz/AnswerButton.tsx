"use client";

import React from "react";
import { motion } from "framer-motion";
import { ComparisonChoice } from "@/types/quiz";

interface AnswerButtonProps {
  value: number;
  index: number;
  isSelected: boolean;
  isCorrect: boolean | null; // null if not yet evaluated, true/false after
  showAsCorrect: boolean; // true if this was the correct answer when an incorrect one was picked
  disabled: boolean;
  onClick: (value: number) => void;
  comparisonChoice?: ComparisonChoice;
}

const BUTTON_THEMES = [
  {
    bg: "bg-[#8175FF]",
    border: "border-b-4 border-[#6154e6]",
    shadow: "shadow-[#8175FF]/30",
    text: "text-white",
  },
  {
    bg: "bg-[#40B9FF]",
    border: "border-b-4 border-[#209fe6]",
    shadow: "shadow-[#40B9FF]/30",
    text: "text-white",
  },
  {
    bg: "bg-[#FFD166]",
    border: "border-b-4 border-[#e6b940]",
    shadow: "shadow-[#FFD166]/30",
    text: "text-[#3d2b00]",
  },
  {
    bg: "bg-[#FF78B9]",
    border: "border-b-4 border-[#e6559d]",
    shadow: "shadow-[#FF78B9]/30",
    text: "text-white",
  },
];

export function AnswerButton({
  value,
  index,
  isSelected,
  isCorrect,
  showAsCorrect,
  disabled,
  onClick,
  comparisonChoice,
}: AnswerButtonProps) {
  const theme = BUTTON_THEMES[index % BUTTON_THEMES.length];

  // Determine styling based on feedback state
  let feedbackStyle = `${theme.bg} ${theme.border} ${theme.shadow} ${theme.text}`;

  if (isSelected && isCorrect === true) {
    feedbackStyle = "bg-[#45D6A0] border-b-4 border-[#2db884] shadow-lg shadow-[#45D6A0]/50 text-[#043320] ring-4 ring-white";
  } else if (isSelected && isCorrect === false) {
    feedbackStyle = "bg-[#FF78B9] border-b-4 border-[#d64789] shadow-md shadow-[#FF78B9]/30 text-white opacity-90";
  } else if (showAsCorrect) {
    feedbackStyle = "bg-[#45D6A0] border-b-4 border-[#2db884] shadow-lg shadow-[#45D6A0]/40 text-[#043320] animate-pulse";
  }

  return (
    <motion.button
      type="button"
      whileTap={!disabled ? { scale: 0.94 } : undefined}
      disabled={disabled}
      onClick={() => onClick(value)}
      id={`btn-answer-${index}-${value}`}
      aria-label={comparisonChoice ? `Pilih ${comparisonChoice.label}` : `Pilih jawaban ${value}`}
      className={`w-full min-h-[84px] md:min-h-[96px] rounded-2xl flex items-center justify-center font-black shadow-md cursor-pointer transition-all disabled:cursor-not-allowed ${feedbackStyle}`}
    >
      {comparisonChoice ? (
        <div className="flex flex-col items-center justify-center p-2 w-full h-full">
          <div className="flex items-center justify-between w-full px-2 mb-1">
            <span className="text-xs md:text-sm font-black uppercase px-2 py-0.5 rounded-full bg-black/25 text-white">
              {comparisonChoice.label}
            </span>
            {disabled && (
              <span className="text-xs font-black opacity-90 animate-fade-in">
                {comparisonChoice.count} {comparisonChoice.emoji}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5 w-full py-1">
            {Array.from({ length: comparisonChoice.count }).map((_, i) => (
              <span
                key={i}
                className={`select-none leading-none inline-block ${
                  comparisonChoice.count <= 3
                    ? "text-3xl md:text-4xl"
                    : comparisonChoice.count <= 6
                    ? "text-2xl md:text-3xl"
                    : "text-xl md:text-2xl"
                }`}
              >
                {comparisonChoice.emoji}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <span className="text-4xl md:text-5xl">{value}</span>
      )}
    </motion.button>
  );
}
