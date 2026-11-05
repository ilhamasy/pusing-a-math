"use client";

import React from "react";
import { ScoreSummary } from "@/lib/scoring";
import { QuizSettings } from "@/types/quiz";
import { formatDifficultyLabel } from "@/lib/astronaut-ranks";

interface ReportCardTemplateProps {
  summary: ScoreSummary;
  settings: QuizSettings;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export function ReportCardTemplate({ summary, settings, cardRef }: ReportCardTemplateProps) {
  const { astronautRank, score, correctCount, totalQuestions } = summary;
  const difficultyText = formatDifficultyLabel(settings.difficulty);

  return (
    <div
      ref={cardRef}
      style={{
        width: 600,
        height: 750,
        fontFamily: "'Nunito', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI'",
      }}
      className="relative overflow-hidden bg-gradient-to-b from-[#0A0E2A] via-[#10173E] to-[#1C1748] text-white p-8 flex flex-col justify-between select-none shadow-2xl"
    >
      {/* Decorative Cosmic Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-6 left-8 text-2xl animate-pulse">✨</div>
        <div className="absolute top-20 right-12 text-3xl">🪐</div>
        <div className="absolute top-44 left-10 text-xl text-[#FFD166]">⭐</div>
        <div className="absolute top-72 right-8 text-xl text-[#40B9FF]">🌟</div>
        <div className="absolute bottom-32 left-12 text-2xl">🛸</div>
        <div className="absolute bottom-20 right-16 text-2xl text-[#FF78B9]">✨</div>
        {/* Glowing gradient orbs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#8175FF]/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-[#FF78B9]/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#FFD166]/10 blur-3xl" />
      </div>

      {/* Header Branding */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFD166] to-[#8175FF] p-0.5 shadow-lg shadow-[#8175FF]/40 flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-[#0B1026] flex items-center justify-center text-2xl">
              🚀
            </div>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-[#FFD166] to-[#40B9FF] bg-clip-text text-transparent">
              Pusing A Math
            </div>
            <div className="text-xs font-bold text-[#FFD166] tracking-wide">
              Fun Quiz For Kindergarten Kids
            </div>
          </div>
        </div>

        {/* Difficulty Pill */}
        <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-extrabold text-white/90">
          {difficultyText}
        </div>
      </div>

      {/* Center Rank & Badge Hero */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center">
        {/* Glowing Rank Badge Container */}
        <div className="relative my-2">
          <div
            className={`w-36 h-36 rounded-full bg-gradient-to-tr ${astronautRank.borderGradient} p-1.5 shadow-2xl flex items-center justify-center`}
          >
            <div className="w-full h-full rounded-full bg-[#0D1233] flex items-center justify-center text-6xl shadow-inner">
              {astronautRank.badgeEmoji}
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FFD166] text-[#0A0E2A] text-xs font-black uppercase tracking-wider shadow-md whitespace-nowrap">
            OFFICIAL RANK
          </div>
        </div>

        {/* Astronaut Rank Title */}
        <h2 className="text-3xl font-black text-white mt-4 tracking-tight drop-shadow-md">
          {astronautRank.rank}
        </h2>

        {/* Description */}
        <p className="text-sm font-bold text-[#FFD166] mt-1.5 max-w-sm px-4 leading-relaxed">
          &ldquo;{astronautRank.description}&rdquo;
        </p>

        {/* Score & Stats Card */}
        <div className="w-full mt-5 px-6 py-4 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xl flex items-center justify-around">
          {/* Total Score */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-white/60">
              Cosmic Score
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-4xl font-black text-white">{score}</span>
              <span className="text-sm font-bold text-white/50">/ 100</span>
            </div>
          </div>

          <div className="w-px h-10 bg-white/20" />

          {/* Accuracy */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#45D6A0]">
              Jawaban Benar
            </span>
            <span className="text-2xl font-black text-white mt-0.5">
              {correctCount} / {totalQuestions}
            </span>
          </div>

          <div className="w-px h-10 bg-white/20" />

          {/* Mode */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#40B9FF]">
              Level
            </span>
            <span className="text-base font-black text-white mt-1 capitalize">
              {settings.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Challenge Message & Footer Callout */}
      <div className="relative z-10 pt-4 border-t border-white/15 flex flex-col items-center text-center gap-2">
        <div className="px-4 py-1.5 rounded-2xl bg-gradient-to-r from-[#FF78B9]/30 to-[#8175FF]/30 border border-white/20 text-xs font-extrabold text-[#FFE27A]">
          🔥 &ldquo;I challenge you to complete this quiz!&rdquo; 🔥
        </div>

        <div className="flex items-center justify-between w-full text-xs text-white/70 font-semibold px-2">
          <span>Mainkan sekarang secara gratis:</span>
          <span className="font-extrabold text-[#40B9FF] tracking-wide underline underline-offset-2">
            https://pusing-a-math.vercel.app/
          </span>
        </div>
      </div>
    </div>
  );
}
