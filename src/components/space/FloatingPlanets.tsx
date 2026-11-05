"use client";

import React from "react";
import { motion } from "framer-motion";

export function FloatingPlanets() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Top right ringed planet (Saturn-like) */}
      <motion.div
        className="absolute top-12 right-6 md:right-24 opacity-80"
        animate={{
          y: [0, -14, 0],
          rotate: [0, 4, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-[#8175FF] via-[#40B9FF] to-[#FFD166] shadow-lg shadow-[#8175FF]/30 relative flex items-center justify-center">
          <div className="absolute w-24 h-4 md:w-36 md:h-6 border-2 border-[#FFD166]/60 rounded-[100%] rotate-[-25deg] pointer-events-none" />
        </div>
      </motion.div>

      {/* Bottom left friendly coral planet */}
      <motion.div
        className="absolute bottom-16 left-6 md:left-20 opacity-70"
        animate={{
          y: [0, 16, 0],
          rotate: [0, -6, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#FF78B9] to-[#FFD166] shadow-lg shadow-[#FF78B9]/30" />
      </motion.div>

      {/* Small floating turquoise asteroid/moon */}
      <motion.div
        className="absolute top-1/2 left-4 md:left-12 opacity-60"
        animate={{
          y: [0, -10, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-8 h-8 rounded-full bg-[#45D6A0] shadow-md shadow-[#45D6A0]/30" />
      </motion.div>
    </div>
  );
}
