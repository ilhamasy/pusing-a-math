"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Compass, Check } from "lucide-react";
import { QuestionCount, Difficulty, QuizSettings } from "@/types/quiz";
import { sounds } from "@/lib/sound";

interface LandingHeroProps {
  initialSettings?: QuizSettings;
  onStart: (settings: QuizSettings) => void;
}

const QUESTION_COUNTS: QuestionCount[] = [10, 20, 30];

const DIFFICULTIES: {
  key: Difficulty;
  label: string;
  badge: string;
  desc: string;
  color: string;
  borderColor: string;
}[] = [
  {
    key: "easy",
    label: "Easy",
    badge: "🟢",
    desc: "Operasi di bawah 10",
    color: "from-[#45D6A0]/25 to-[#45D6A0]/10",
    borderColor: "border-[#45D6A0]",
  },
  {
    key: "medium",
    label: "Medium",
    badge: "🟡",
    desc: "Operasi di bawah 20",
    color: "from-[#FFD166]/25 to-[#FFD166]/10",
    borderColor: "border-[#FFD166]",
  },
  {
    key: "hard",
    label: "Hard",
    badge: "🔴",
    desc: "Operasi di bawah 30",
    color: "from-[#FF78B9]/25 to-[#FF78B9]/10",
    borderColor: "border-[#FF78B9]",
  },
  {
    key: "wni",
    label: "WNI",
    badge: "🇮🇩",
    desc: "Operasi di bawah 100",
    color: "from-[#8175FF]/30 to-[#40B9FF]/15",
    borderColor: "border-[#8175FF]",
  },
];

export function LandingHero({ initialSettings, onStart }: LandingHeroProps) {
  const [selectedCount, setSelectedCount] = useState<QuestionCount>(
    initialSettings?.questionCount || 10
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    initialSettings?.difficulty || "easy"
  );

  const handleStart = () => {
    sounds.playPop();
    onStart({
      questionCount: selectedCount,
      difficulty: selectedDifficulty,
    });
  };

  const handleSelectCount = (count: QuestionCount) => {
    sounds.playPop();
    setSelectedCount(count);
  };

  const handleSelectDifficulty = (diff: Difficulty) => {
    sounds.playPop();
    setSelectedDifficulty(diff);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-4 max-w-lg mx-auto w-full">
      {/* Space Explorer Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[#FFD166] font-bold text-xs sm:text-sm mb-4 shadow-md"
      >
        <Sparkles className="w-4 h-4 text-[#FFD166] animate-spin" style={{ animationDuration: "8s" }} />
        <span>Space Math Odyssey for Kindergarten</span>
        <Compass className="w-4 h-4 text-[#40B9FF]" />
      </motion.div>

      {/* Floating Astronaut Character */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative my-2 flex items-center justify-center"
      >
        <div className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-[#8175FF]/30 via-[#40B9FF]/20 to-[#FF78B9]/30 blur-2xl animate-pulse" />

        <motion.div
          animate={{
            y: [0, -14, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative text-6xl md:text-7xl select-none"
        >
          🧑‍🚀
          <motion.span
            animate={{
              x: [0, 12, 0],
              y: [0, -8, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-2 -right-5 text-3xl md:text-4xl"
          >
            🚀
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Hero Titles */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-2"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
          Ready to Explore <br />
          <span className="bg-gradient-to-r from-[#40B9FF] via-[#8175FF] to-[#FF78B9] bg-clip-text text-transparent">
            Numbers? 🚀
          </span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-white/80 font-medium max-w-sm mx-auto">
          Atur jumlah kuis dan tingkat kesulitan belajarmu di bawah ini:
        </p>
      </motion.div>

      {/* Interactive Setup Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full mt-5 p-4 sm:p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl flex flex-col gap-4 text-left"
      >
        {/* Step 1: Number of Quiz Questions */}
        <div>
          <label className="text-xs sm:text-sm font-extrabold text-white/90 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <span>1. Mau berapa soal?</span>
            <span className="text-[#FFD166] font-bold">({selectedCount} Soal)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {QUESTION_COUNTS.map((count) => {
              const isSelected = selectedCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => handleSelectCount(count)}
                  id={`btn-count-${count}`}
                  className={`py-2.5 px-3 rounded-2xl font-black text-base sm:text-lg transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? "bg-gradient-to-r from-[#8175FF] to-[#40B9FF] text-white border-white shadow-lg shadow-[#8175FF]/40 scale-102 ring-2 ring-[#40B9FF]"
                      : "bg-white/5 hover:bg-white/10 text-white/80 border-white/15"
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  <span>{count} Soal</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Difficulty Selection */}
        <div>
          <label className="text-xs sm:text-sm font-extrabold text-white/90 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <span>2. Pilih Tingkat Kesulitan:</span>
            <span className="text-[#FFD166] font-bold">
              ({DIFFICULTIES.find((d) => d.key === selectedDifficulty)?.label})
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DIFFICULTIES.map((diff) => {
              const isSelected = selectedDifficulty === diff.key;
              return (
                <button
                  key={diff.key}
                  type="button"
                  onClick={() => handleSelectDifficulty(diff.key)}
                  id={`btn-diff-${diff.key}`}
                  className={`p-2.5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                    isSelected
                      ? `bg-gradient-to-br ${diff.color} ${diff.borderColor} text-white shadow-lg ring-2 ring-white scale-102`
                      : "bg-white/5 hover:bg-white/10 text-white/80 border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-extrabold text-base flex items-center gap-1">
                      <span>{diff.badge}</span>
                      <span>{diff.label}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </div>
                  <span className="text-xs text-white/70 mt-1 font-medium leading-tight">
                    {diff.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Start Adventure Pulsing CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="w-full max-w-sm mt-5"
      >
        <button
          onClick={handleStart}
          type="button"
          id="btn-start-adventure"
          className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-[#8175FF] via-[#6355FF] to-[#40B9FF] text-white font-extrabold text-xl md:text-2xl shadow-xl shadow-[#8175FF]/50 border-2 border-white/40 cursor-pointer active:scale-95 transition-transform animate-pulse-glow"
        >
          Mulai Petualangan 🚀
        </button>
      </motion.div>
    </div>
  );
}
