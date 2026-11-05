"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnswerButtonProps {
  value: number;
  index: number;
  isSelected: boolean;
  isCorrect: boolean | null; // null if not yet evaluated, true/false after
  showAsCorrect: boolean; // true if this was the correct answer when an incorrect one was picked
  disabled: boolean;
  onClick: (value: number) => void;
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
      aria-label={`Select answer ${value}`}
      className={`w-full min-h-[72px] md:min-h-[80px] rounded-2xl flex items-center justify-center font-black text-4xl md:text-5xl shadow-md cursor-pointer transition-all disabled:cursor-not-allowed ${feedbackStyle}`}
    >
      {value}
    </motion.button>
  );
}
