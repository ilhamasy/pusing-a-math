import { Difficulty } from "@/types/quiz";

export interface AstronautRank {
  rank: string;
  description: string;
  badgeEmoji: string;
  themeColor: string;
  borderGradient: string;
  bgGradient: string;
  minScore: number;
  maxScore: number;
}

export const ASTRONAUT_RANKS: AstronautRank[] = [
  {
    rank: "Space Rookie",
    description: "Keep learning, SAYA AKAN LAWAN!",
    badgeEmoji: "🔭",
    themeColor: "#FF78B9",
    borderGradient: "from-pink-500 via-rose-500 to-purple-500",
    bgGradient: "from-pink-500/20 to-rose-600/20",
    minScore: 0,
    maxScore: 10,
  },
  {
    rank: "Planet Explorer",
    description: "You're starting to explore the math universe!",
    badgeEmoji: "🪐",
    themeColor: "#40B9FF",
    borderGradient: "from-sky-400 via-blue-500 to-indigo-500",
    bgGradient: "from-sky-500/20 to-blue-600/20",
    minScore: 11,
    maxScore: 30,
  },
  {
    rank: "Junior Astronaut",
    description: "You're making great progress!",
    badgeEmoji: "⭐",
    themeColor: "#8175FF",
    borderGradient: "from-indigo-400 via-purple-500 to-pink-500",
    bgGradient: "from-indigo-500/20 to-purple-600/20",
    minScore: 31,
    maxScore: 50,
  },
  {
    rank: "Space Pilot",
    description: "You're ready to fly through space!",
    badgeEmoji: "🛸",
    themeColor: "#45D6A0",
    borderGradient: "from-emerald-400 via-teal-500 to-cyan-500",
    bgGradient: "from-emerald-500/20 to-teal-600/20",
    minScore: 51,
    maxScore: 70,
  },
  {
    rank: "Galaxy Commander",
    description: "Amazing! You're almost mastering the galaxy!",
    badgeEmoji: "🌌",
    themeColor: "#FFD166",
    borderGradient: "from-amber-400 via-orange-500 to-yellow-300",
    bgGradient: "from-amber-500/20 to-orange-600/20",
    minScore: 71,
    maxScore: 99,
  },
  {
    rank: "Real Astronaut",
    description: "Perfect mission! You've conquered the universe!",
    badgeEmoji: "👨‍🚀🏆",
    themeColor: "#FFE27A",
    borderGradient: "from-yellow-300 via-[#FFD166] to-[#8175FF]",
    bgGradient: "from-yellow-400/25 via-amber-500/20 to-purple-600/25",
    minScore: 100,
    maxScore: 100,
  },
];

/**
 * Determine astronaut rank strictly from normalized percentage score (0-100).
 * Handles safety clamps and guarantees score 100 is always Real Astronaut.
 */
export function getAstronautRank(score: number): AstronautRank {
  const normalized = Math.max(0, Math.min(100, Math.round(score)));

  if (normalized === 100) {
    return ASTRONAUT_RANKS[5]; // Real Astronaut
  }

  for (const rankItem of ASTRONAUT_RANKS) {
    if (normalized >= rankItem.minScore && normalized <= rankItem.maxScore) {
      return rankItem;
    }
  }

  return ASTRONAUT_RANKS[0]; // Fallback Space Rookie
}

/**
 * Format difficulty label nicely for report cards.
 */
export function formatDifficultyLabel(difficulty: Difficulty): string {
  switch (difficulty) {
    case "easy":
      return "Mudah (Di Bawah 10)";
    case "medium":
      return "Sedang (Di Bawah 20)";
    case "hard":
      return "Sulit (Di Bawah 30)";
    case "wni":
      return "WNI (Di Bawah 100)";
  }
}
