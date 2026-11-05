"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StarField } from "@/components/space/StarField";
import { FloatingPlanets } from "@/components/space/FloatingPlanets";
import { AudioControl } from "@/components/shared/AudioControl";
import { LandingHero } from "@/components/landing/LandingHero";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { AnswerGrid } from "@/components/quiz/AnswerGrid";
import { FeedbackBanner } from "@/components/quiz/FeedbackBanner";
import { ResultView } from "@/components/result/ResultView";
import { calculateScore } from "@/lib/scoring";
import { useQuiz } from "@/hooks/use-quiz";

export default function PusingAMathPage() {
  const {
    state,
    currentQuestion,
    startQuiz,
    selectAnswer,
    nextQuestion,
    playAgain,
  } = useQuiz();

  const [isShaking, setIsShaking] = useState(false);

  const handleSelectAnswer = (option: number) => {
    if (!currentQuestion) return;
    const isCorrect = option === currentQuestion.correctAnswer;
    if (!isCorrect) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
    selectAnswer(option);
  };

  const isLastQuestion =
    state.currentIndex === state.questions.length - 1;

  const scoreSummary = calculateScore(state.correctCount, state.questions.length || 10);

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden p-4 sm:p-6 md:p-8">
      {/* Dynamic Cosmic Background */}
      <StarField />
      <FloatingPlanets />

      {/* Top Header Shell */}
      <header className="relative z-20 w-full max-w-4xl mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl select-none">🚀</span>
          <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-[#FFD166] to-[#40B9FF] bg-clip-text text-transparent">
            Pusing A Math
          </span>
        </div>

        {/* Global Sound Toggle in header when on landing or result */}
        {(state.status === "landing" || state.status === "result") && (
          <AudioControl />
        )}
      </header>

      {/* Main Interactive Stage */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-4 w-full">
        <AnimatePresence mode="wait">
          {/* View 1: Landing Page */}
          {state.status === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <LandingHero onStart={startQuiz} />
            </motion.div>
          )}

          {/* View 2: Active Quiz (In Quiz & Feedback State) */}
          {(state.status === "in_quiz" || state.status === "feedback") && currentQuestion && (
            <motion.div
              key={`question-${currentQuestion.id}`}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full flex flex-col items-center justify-center"
            >
              <QuizHeader
                currentIndex={state.currentIndex}
                totalQuestions={state.questions.length}
                score={state.score}
              />

              <QuestionCard
                question={currentQuestion}
                isShaking={isShaking}
              />

              <AnswerGrid
                question={currentQuestion}
                selectedOption={state.selectedOption}
                feedback={state.lastFeedback}
                onSelect={handleSelectAnswer}
              />

              {state.lastFeedback && (
                <FeedbackBanner
                  feedback={state.lastFeedback}
                  onNext={nextQuestion}
                  isLastQuestion={isLastQuestion}
                />
              )}
            </motion.div>
          )}

          {/* View 3: Result & Celebration Page */}
          {state.status === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="w-full flex justify-center"
            >
              <ResultView
                summary={scoreSummary}
                onPlayAgain={playAgain}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <footer className="relative z-10 py-3 text-center text-xs text-white/50 font-medium select-none">
        Pusing A Math • Fun Learning Odyssey for Kindergarten Kids 🌟
      </footer>
    </main>
  );
}
