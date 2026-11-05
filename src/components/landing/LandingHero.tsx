"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Compass } from "lucide-react";
import { sounds } from "@/lib/sound";

interface LandingHeroProps {
  onStart: () => void;
}

export function LandingHero({ onStart }: LandingHeroProps) {
  const handleStart = () => {
    sounds.playPop();
    onStart();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-8 max-w-lg mx-auto w-full">
      {/* Space Explorer Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[#FFD166] font-bold text-sm mb-6 shadow-md"
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
        className="relative my-4 flex items-center justify-center"
      >
        {/* Glow halo */}
        <div className="absolute w-44 h-44 rounded-full bg-gradient-to-r from-[#8175FF]/30 via-[#40B9FF]/20 to-[#FF78B9]/30 blur-2xl animate-pulse" />

        {/* Astronaut and Rocket floating animation container */}
        <motion.div
          animate={{
            y: [0, -16, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative text-7xl md:text-8xl select-none"
        >
          🧑‍🚀
          {/* Miniature rocket companion */}
          <motion.span
            animate={{
              x: [0, 15, 0],
              y: [0, -10, 0],
              rotate: [0, 12, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-3 -right-6 text-4xl md:text-5xl"
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
        className="mt-4"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
          Ready to Explore <br />
          <span className="bg-gradient-to-r from-[#40B9FF] via-[#8175FF] to-[#FF78B9] bg-clip-text text-transparent">
            Numbers? 🚀
          </span>
        </h1>
        <p className="mt-3 text-lg md:text-xl text-white/80 font-medium max-w-sm mx-auto">
          Let&apos;s have fun learning math with friendly emojis and cosmic stars!
        </p>
      </motion.div>

      {/* Feature Badges for Kindergarten */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-2.5 my-6 text-xs md:text-sm font-semibold"
      >
        <span className="px-3 py-1 rounded-full bg-[#8175FF]/20 border border-[#8175FF]/40 text-white">
          🍎 Counting Objects
        </span>
        <span className="px-3 py-1 rounded-full bg-[#40B9FF]/20 border border-[#40B9FF]/40 text-white">
          ➕ Easy Addition
        </span>
        <span className="px-3 py-1 rounded-full bg-[#FF78B9]/20 border border-[#FF78B9]/40 text-white">
          ➖ Fun Subtraction
        </span>
      </motion.div>

      {/* Start Adventure Pulsing CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="w-full max-w-xs mt-2"
      >
        <button
          onClick={handleStart}
          type="button"
          id="btn-start-adventure"
          className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-[#8175FF] via-[#6355FF] to-[#40B9FF] text-white font-extrabold text-xl md:text-2xl shadow-xl shadow-[#8175FF]/50 border-2 border-white/40 cursor-pointer active:scale-95 transition-transform animate-pulse-glow"
        >
          Start Adventure 🚀
        </button>
        <p className="text-xs text-white/60 mt-2 font-medium">
          10 fun questions • Touch-friendly • Ages 4–6
        </p>
      </motion.div>
    </div>
  );
}
