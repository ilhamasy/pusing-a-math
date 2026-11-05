"use client";

import React from "react";
import { motion } from "framer-motion";
import { Question } from "@/types/quiz";
import { EmojiMathRenderer } from "./EmojiMathRenderer";

interface QuestionCardProps {
  question: Question;
  isShaking: boolean;
}

export function QuestionCard({ question, isShaking }: QuestionCardProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`w-full max-w-md mx-auto p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl relative overflow-hidden text-center ${
        isShaking ? "animate-gentle-shake border-[#FF78B9]" : ""
      }`}
    >
      {/* Category Tag */}
      <div className="inline-block px-3 py-1 rounded-full bg-[#8175FF]/30 border border-[#8175FF]/50 text-xs font-bold uppercase tracking-wider text-white/90 mb-2">
        {question.type.replace("_", " ")}
      </div>

      {/* Main Question Prompt */}
      <h2 className="text-xl md:text-2xl font-extrabold text-white">
        {question.prompt}
      </h2>

      {/* Visual representation */}
      <EmojiMathRenderer question={question} />
    </motion.div>
  );
}
