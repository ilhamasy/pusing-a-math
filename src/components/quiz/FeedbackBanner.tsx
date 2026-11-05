"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import { AnswerFeedback } from "@/types/quiz";

interface FeedbackBannerProps {
  feedback: AnswerFeedback;
  onNext: () => void;
  isLastQuestion: boolean;
  questionType?: string;
}

export function FeedbackBanner({
  feedback,
  onNext,
  isLastQuestion,
  questionType,
}: FeedbackBannerProps) {
  const { isCorrect, encouragement } = feedback;

  const answerDetail = isCorrect
    ? "+10 cosmic points!"
    : questionType === "comparison_least"
    ? `Pilihan yang paling sedikit adalah ${["A", "B", "C", "D"][feedback.correctAnswer]}`
    : `Jawaban yang benar adalah ${feedback.correctAnswer}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
      className={`w-full max-w-md mx-auto mt-4 p-4 rounded-2xl border shadow-xl flex items-center justify-between gap-3 ${
        isCorrect
          ? "bg-[#45D6A0]/20 border-[#45D6A0]/60 text-white backdrop-blur-md"
          : "bg-[#FF78B9]/20 border-[#FF78B9]/60 text-white backdrop-blur-md"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            isCorrect ? "bg-[#45D6A0] text-[#043320]" : "bg-[#FF78B9] text-white"
          }`}
        >
          {isCorrect ? <Sparkles className="w-5 h-5" /> : <Heart className="w-5 h-5 fill-current" />}
        </div>
        <div>
          <p className="font-extrabold text-base md:text-lg leading-tight">
            {encouragement}
          </p>
          <p className="text-xs text-white/80 mt-0.5">
            {answerDetail}
          </p>
        </div>
      </div>

      <button
        onClick={onNext}
        type="button"
        id="btn-next-question"
        className="px-4 py-2.5 rounded-xl bg-white text-[#0B1026] font-extrabold text-sm md:text-base shrink-0 flex items-center gap-1.5 shadow-md hover:bg-white/90 active:scale-95 transition-all cursor-pointer"
      >
        <span>{isLastQuestion ? "See Results 🏆" : "Next"}</span>
        {!isLastQuestion && <ArrowRight className="w-4 h-4" />}
      </button>
    </motion.div>
  );
}
