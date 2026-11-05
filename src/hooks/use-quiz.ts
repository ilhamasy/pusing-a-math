"use client";

import { useReducer, useCallback } from "react";
import { QuizState, Question, AnswerFeedback, QuizSettings } from "@/types/quiz";
import { generateQuizSession } from "@/lib/question-generator";
import { ENCOURAGEMENTS } from "@/constants/emojis";
import { triggerCorrectConfetti } from "@/components/shared/Confetti";
import { sounds } from "@/lib/sound";

type QuizAction =
  | { type: "START_QUIZ"; settings?: QuizSettings }
  | { type: "SET_SETTINGS"; settings: QuizSettings }
  | { type: "SELECT_ANSWER"; option: number }
  | { type: "NEXT_QUESTION" }
  | { type: "PLAY_AGAIN" }
  | { type: "GO_HOME" };

const initialSettings: QuizSettings = {
  questionCount: 10,
  difficulty: "easy",
};

const initialState: QuizState = {
  status: "landing",
  questions: [],
  currentIndex: 0,
  score: 0,
  correctCount: 0,
  incorrectCount: 0,
  lastFeedback: null,
  selectedOption: null,
  soundEnabled: true,
  settings: initialSettings,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SET_SETTINGS": {
      return {
        ...state,
        settings: action.settings,
      };
    }

    case "START_QUIZ": {
      const activeSettings = action.settings || state.settings;
      const newQuestions = generateQuizSession(
        activeSettings.questionCount,
        activeSettings.difficulty
      );
      return {
        ...initialState,
        settings: activeSettings,
        status: "in_quiz",
        questions: newQuestions,
        currentIndex: 0,
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        lastFeedback: null,
        selectedOption: null,
      };
    }

    case "SELECT_ANSWER": {
      // Prevent multiple clicks if already answered
      if (state.selectedOption !== null || state.status !== "in_quiz") {
        return state;
      }

      const currentQuestion = state.questions[state.currentIndex];
      if (!currentQuestion) return state;

      const isCorrect = action.option === currentQuestion.correctAnswer;
      const pool = isCorrect ? ENCOURAGEMENTS.correct : ENCOURAGEMENTS.incorrect;
      const encouragement = pool[Math.floor(Math.random() * pool.length)];

      const feedback: AnswerFeedback = {
        isCorrect,
        selectedOption: action.option,
        correctAnswer: currentQuestion.correctAnswer,
        encouragement,
      };

      const totalQ = state.questions.length || 10;
      const pointsPerQ = 100 / totalQ;
      const newCorrectCount = isCorrect ? state.correctCount + 1 : state.correctCount;
      const newScore = Math.round(newCorrectCount * pointsPerQ);
      const newIncorrectCount = !isCorrect ? state.incorrectCount + 1 : state.incorrectCount;

      return {
        ...state,
        status: "feedback",
        selectedOption: action.option,
        lastFeedback: feedback,
        score: newScore,
        correctCount: newCorrectCount,
        incorrectCount: newIncorrectCount,
      };
    }

    case "NEXT_QUESTION": {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.questions.length) {
        return {
          ...state,
          status: "result",
          selectedOption: null,
          lastFeedback: null,
        };
      }

      return {
        ...state,
        status: "in_quiz",
        currentIndex: nextIndex,
        selectedOption: null,
        lastFeedback: null,
      };
    }

    case "PLAY_AGAIN": {
      const freshQuestions = generateQuizSession(
        state.settings.questionCount,
        state.settings.difficulty
      );
      return {
        ...initialState,
        settings: state.settings,
        status: "in_quiz",
        questions: freshQuestions,
      };
    }

    case "GO_HOME": {
      return {
        ...initialState,
        settings: state.settings,
        status: "landing",
      };
    }

    default:
      return state;
  }
}

export function useQuiz() {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const setSettings = useCallback((settings: QuizSettings) => {
    dispatch({ type: "SET_SETTINGS", settings });
  }, []);

  const startQuiz = useCallback((settings?: QuizSettings) => {
    dispatch({ type: "START_QUIZ", settings });
  }, []);

  const selectAnswer = useCallback(
    (option: number) => {
      if (state.selectedOption !== null) return;

      const currentQuestion = state.questions[state.currentIndex];
      if (!currentQuestion) return;

      const isCorrect = option === currentQuestion.correctAnswer;
      if (isCorrect) {
        sounds.playCorrect();
        triggerCorrectConfetti();
      } else {
        sounds.playTryAgain();
      }

      dispatch({ type: "SELECT_ANSWER", option });
    },
    [state.selectedOption, state.questions, state.currentIndex]
  );

  const nextQuestion = useCallback(() => {
    sounds.playPop();
    dispatch({ type: "NEXT_QUESTION" });
  }, []);

  const playAgain = useCallback(() => {
    dispatch({ type: "PLAY_AGAIN" });
  }, []);

  const goHome = useCallback(() => {
    sounds.playPop();
    dispatch({ type: "GO_HOME" });
  }, []);

  return {
    state,
    currentQuestion: state.questions[state.currentIndex] as Question | undefined,
    setSettings,
    startQuiz,
    selectAnswer,
    nextQuestion,
    playAgain,
    goHome,
  };
}
