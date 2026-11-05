"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, CheckCircle2, Sparkles, Heart } from "lucide-react";
import { ScoreSummary } from "@/lib/scoring";
import { ScoreCountUp } from "./ScoreCountUp";
import { triggerGrandCelebration } from "@/components/shared/Confetti";
import { sounds } from "@/lib/sound";

interface ResultViewProps {
  summary: ScoreSummary;
  onPlayAgain: () => void;
}

export function ResultView({ summary, onPlayAgain }: ResultViewProps) {
  useEffect(() => {
    sounds.playFanfare();
    triggerGrandCelebration();
  }, []);

  const handlePlayAgain = () => {
    sounds.playPop();
    onPlayAgain();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-6 max-w-md mx-auto w-full">
      {/* Trophy / Astronaut Hero Container */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative my-2"
      >
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-[#FFD166] via-[#FF78B9] to-[#8175FF] p-1 shadow-2xl shadow-[#FFD166]/40 flex items-center justify-center animate-pulse-glow">
          <div className="w-full h-full rounded-full bg-[#0B1026] flex items-center justify-center">
            <Trophy className="w-16 h-16 md:w-18 md:h-18 text-[#FFD166] drop-shadow-md" />
          </div>
        </div>
        <span className="absolute -bottom-2 -right-2 text-4xl select-none animate-bounce-item">
          {summary.badge}
        </span>
      </motion.div>

      {/* Motivational Title & Message */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4"
      >
        <h1 className="text-3xl md:text-4xl font-black text-white">
          Mission Complete! 🚀
        </h1>
        <p className="text-xl md:text-2xl font-extrabold text-[#FFD166] mt-2">
          {summary.message}
        </p>
      </motion.div>

      {/* Score Card with Count-Up */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full mt-6 p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
      >
        <div className="text-sm font-bold uppercase tracking-wider text-white/70">
          Total Cosmic Score
        </div>
        <div className="text-6xl md:text-7xl font-black text-white my-2 flex items-center justify-center gap-1">
          <ScoreCountUp targetScore={summary.score} />
          <span className="text-2xl md:text-3xl text-white/50 font-bold self-end mb-2">
            / 100
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-[#45D6A0]/15 border border-[#45D6A0]/30 flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#45D6A0] font-extrabold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Correct</span>
            </div>
            <span className="text-2xl font-black text-white mt-1">
              {summary.correctCount} / {summary.totalQuestions}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#FF78B9]/15 border border-[#FF78B9]/30 flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[#FF78B9] font-extrabold text-sm">
              <Heart className="w-4 h-4 fill-current" />
              <span>Practiced</span>
            </div>
            <span className="text-2xl font-black text-white mt-1">
              {summary.incorrectCount} / {summary.totalQuestions}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Bouncing Play Again Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full mt-6"
      >
        <button
          onClick={handlePlayAgain}
          type="button"
          id="btn-play-again"
          className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-[#45D6A0] via-[#40B9FF] to-[#8175FF] text-[#043320] font-black text-xl md:text-2xl shadow-xl shadow-[#45D6A0]/40 border-2 border-white/40 cursor-pointer active:scale-95 transition-transform flex items-center justify-center gap-3 animate-bounce-item"
        >
          <RotateCcw className="w-6 h-6 stroke-[3]" />
          <span>Play Again 🔄</span>
        </button>
        <p className="text-xs text-white/60 mt-2 font-medium">
          Ready for another 10 questions? Let&apos;s go!
        </p>
      </motion.div>
    </div>
  );
}
