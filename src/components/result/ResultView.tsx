"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, CheckCircle2, Heart, Home, Share2, Sparkles, Award } from "lucide-react";
import { ScoreSummary } from "@/lib/scoring";
import { QuizSettings } from "@/types/quiz";
import { ScoreCountUp } from "./ScoreCountUp";
import { triggerGrandCelebration } from "@/components/shared/Confetti";
import { sounds } from "@/lib/sound";
import { ShareReportModal } from "@/components/share/ShareReportModal";
import { formatDifficultyLabel } from "@/lib/astronaut-ranks";

interface ResultViewProps {
  summary: ScoreSummary;
  settings: QuizSettings;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export function ResultView({ summary, settings, onPlayAgain, onGoHome }: ResultViewProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    sounds.playFanfare();
    triggerGrandCelebration();
  }, []);

  const handlePlayAgain = () => {
    sounds.playPop();
    onPlayAgain();
  };

  const handleGoHome = () => {
    sounds.playPop();
    onGoHome();
  };

  const handleOpenShare = () => {
    sounds.playPop();
    setIsShareOpen(true);
  };

  const { astronautRank } = summary;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-3.5 sm:px-4 py-4 sm:py-6 max-w-md mx-auto w-full">
      {/* Astronaut Rank Hero Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -25 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        className="relative my-2"
      >
        <div
          className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr ${astronautRank.borderGradient} p-1 shadow-2xl flex items-center justify-center animate-pulse-glow`}
        >
          <div className="w-full h-full rounded-full bg-[#0B1028] flex items-center justify-center text-5xl sm:text-6xl select-none">
            {astronautRank.badgeEmoji}
          </div>
        </div>

        {/* Floating Rank Pill */}
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#FFD166] text-[#0B1028] text-xs font-black uppercase tracking-wider shadow-lg whitespace-nowrap flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          <span>{astronautRank.rank}</span>
        </div>
      </motion.div>

      {/* Rank Title & Description */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-5"
      >
        <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white/80 uppercase tracking-widest mb-1.5">
          Mission Accomplished 🚀
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {astronautRank.rank}
        </h1>
        <p className="text-base sm:text-lg font-bold text-[#FFD166] mt-1 px-4 leading-snug">
          &ldquo;{astronautRank.description}&rdquo;
        </p>
      </motion.div>

      {/* Score Card with Share Button Beside the Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full mt-5 p-5 sm:p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl relative"
      >
        <div className="text-xs font-extrabold uppercase tracking-wider text-white/70">
          Total Cosmic Score
        </div>

        {/* Main Score Area with Share Icon Beside Score */}
        <div className="my-2 flex items-center justify-center gap-3">
          <div className="flex items-baseline justify-center gap-1 text-5xl sm:text-6xl font-black text-white">
            <ScoreCountUp targetScore={summary.score} />
            <span className="text-xl sm:text-2xl text-white/50 font-bold self-end mb-1">
              / 100
            </span>
          </div>

          {/* Share Button Icon Beside Score */}
          <button
            onClick={handleOpenShare}
            type="button"
            id="btn-share-score"
            title="Share Your Report"
            aria-label="Share Your Report"
            className="p-3 rounded-2xl bg-gradient-to-tr from-[#FFD166]/20 to-[#8175FF]/20 hover:from-[#FFD166]/30 hover:to-[#8175FF]/30 active:scale-95 text-[#FFD166] border border-white/25 shadow-lg cursor-pointer transition-all flex items-center justify-center group"
          >
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Stats Grid: Correct, Practiced, Difficulty */}
        <div className="grid grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-white/10">
          <div className="p-2.5 rounded-2xl bg-[#45D6A0]/15 border border-[#45D6A0]/30 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[#45D6A0] font-extrabold text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Correct</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {summary.correctCount} / {summary.totalQuestions}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#FF78B9]/15 border border-[#FF78B9]/30 flex flex-col items-center">
            <div className="flex items-center gap-1 text-[#FF78B9] font-extrabold text-xs">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Practiced</span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {summary.incorrectCount} / {summary.totalQuestions}
            </span>
          </div>
        </div>

        {/* Difficulty Pill in Score Card */}
        <div className="mt-3 text-xs text-white/60 font-semibold flex items-center justify-center gap-1">
          <span>Level:</span>
          <span className="text-[#40B9FF] font-bold">
            {formatDifficultyLabel(settings.difficulty)}
          </span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full mt-5 flex flex-col gap-2.5"
      >
        {/* Share Report Primary Button */}
        <button
          onClick={handleOpenShare}
          type="button"
          id="btn-share-report"
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FFD166] via-[#FF78B9] to-[#8175FF] text-[#0B1028] font-black text-lg sm:text-xl shadow-xl shadow-[#FFD166]/25 border-2 border-white/40 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2.5 group"
        >
          <Sparkles className="w-5 h-5 text-[#0B1028] group-hover:rotate-12 transition-transform" />
          <span>Share Your Report 📸</span>
        </button>

        {/* Play Again Button */}
        <button
          onClick={handlePlayAgain}
          type="button"
          id="btn-play-again"
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#45D6A0] via-[#40B9FF] to-[#8175FF] text-[#043320] font-black text-lg sm:text-xl shadow-xl shadow-[#45D6A0]/30 border-2 border-white/40 cursor-pointer active:scale-95 transition-transform flex items-center justify-center gap-2.5"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          <span>Play Again 🔄</span>
        </button>

        {/* Back to Home Button */}
        <button
          onClick={handleGoHome}
          type="button"
          id="btn-go-home"
          className="w-full py-3 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-base border border-white/20 backdrop-blur-md cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <Home className="w-4 h-4 text-[#40B9FF]" />
          <span>Back to Home 🏠</span>
        </button>
      </motion.div>

      {/* Share Report Modal */}
      <ShareReportModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        summary={summary}
        settings={settings}
      />
    </div>
  );
}
