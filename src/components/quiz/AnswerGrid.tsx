"use client";

import React from "react";
import { Question, AnswerFeedback } from "@/types/quiz";
import { AnswerButton } from "./AnswerButton";

interface AnswerGridProps {
  question: Question;
  selectedOption: number | null;
  feedback: AnswerFeedback | null;
  onSelect: (value: number) => void;
}

export function AnswerGrid({
  question,
  selectedOption,
  feedback,
  onSelect,
}: AnswerGridProps) {
  const isAnswered = selectedOption !== null;

  return (
    <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-3 md:gap-4 mt-4 px-2">
      {question.options.map((optionValue, idx) => {
        const isSelected = selectedOption === optionValue;
        const isCorrect = isSelected && feedback ? feedback.isCorrect : null;
        // If wrong answer was chosen, also highlight which one was correct to guide learning
        const showAsCorrect =
          isAnswered &&
          feedback !== null &&
          !feedback.isCorrect &&
          optionValue === question.correctAnswer;

        const comparisonChoice = question.comparisonChoices?.[idx];

        return (
          <AnswerButton
            key={`opt-${idx}-${optionValue}`}
            value={optionValue}
            index={idx}
            isSelected={isSelected}
            isCorrect={isCorrect}
            showAsCorrect={showAsCorrect}
            disabled={isAnswered}
            onClick={onSelect}
            comparisonChoice={comparisonChoice}
          />
        );
      })}
    </div>
  );
}
