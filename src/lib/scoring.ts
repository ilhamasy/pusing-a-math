export interface ScoreSummary {
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  badge: string;
  message: string;
  astronautEmotion: "superstar" | "happy" | "encouraged" | "cheering";
}

export function calculateScore(correctCount: number, totalQuestions: number = 10): ScoreSummary {
  const safeTotal = totalQuestions > 0 ? totalQuestions : 10;
  const score = Math.round((correctCount / safeTotal) * 100);
  const incorrectCount = safeTotal - correctCount;

  let badge = "🌟";
  let message = "Amazing! Math Superstar! 🌟";
  let astronautEmotion: ScoreSummary["astronautEmotion"] = "superstar";

  if (score >= 90) {
    badge = "🌟";
    message = "Amazing! Math Superstar! 🌟";
    astronautEmotion = "superstar";
  } else if (score >= 70) {
    badge = "🚀";
    message = "Great Job! 🚀";
    astronautEmotion = "happy";
  } else if (score >= 50) {
    badge = "💫";
    message = "Good Try! Keep Learning! 💫";
    astronautEmotion = "encouraged";
  } else {
    badge = "❤️";
    message = "Let's Practice Again! ❤️";
    astronautEmotion = "cheering";
  }

  return {
    score,
    totalQuestions,
    correctCount,
    incorrectCount,
    badge,
    message,
    astronautEmotion,
  };
}
