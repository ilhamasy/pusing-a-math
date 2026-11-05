import { AstronautRank, getAstronautRank } from "./astronaut-ranks";

export interface ScoreSummary {
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  badge: string;
  message: string;
  astronautEmotion: "superstar" | "happy" | "encouraged" | "cheering";
  astronautRank: AstronautRank;
}

export function calculateScore(correctCount: number, totalQuestions: number = 10): ScoreSummary {
  const safeTotal = totalQuestions > 0 ? totalQuestions : 10;
  const score = Math.max(0, Math.min(100, Math.round((correctCount / safeTotal) * 100)));
  const incorrectCount = Math.max(0, safeTotal - correctCount);

  const astronautRank = getAstronautRank(score);
  const badge = astronautRank.badgeEmoji;
  const message = astronautRank.description;

  let astronautEmotion: ScoreSummary["astronautEmotion"] = "superstar";
  if (score === 100) {
    astronautEmotion = "superstar";
  } else if (score >= 70) {
    astronautEmotion = "happy";
  } else if (score >= 40) {
    astronautEmotion = "encouraged";
  } else {
    astronautEmotion = "cheering";
  }

  return {
    score,
    totalQuestions: safeTotal,
    correctCount,
    incorrectCount,
    badge,
    message,
    astronautEmotion,
    astronautRank,
  };
}
