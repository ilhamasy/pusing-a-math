export type QuestionType =
  | "counting"
  | "addition"
  | "subtraction"
  | "visual_math"
  | "comparison_least";

export type Difficulty = "easy" | "medium" | "hard" | "wni";

export type QuestionCount = 10 | 20 | 30;

export interface EmojiGroup {
  emoji: string;
  count: number;
}

export interface ComparisonChoice {
  id: number;
  emoji: string;
  count: number;
  label: string; // "A" | "B" | "C" | "D"
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  emoji?: string;
  emojiGroups?: EmojiGroup[];
  comparisonChoices?: ComparisonChoice[];
  operandA: number;
  operandB?: number;
  operator?: "+" | "−";
  correctAnswer: number;
  options: number[];
}

export type QuizStatus =
  | "landing"
  | "in_quiz"
  | "feedback"
  | "result";

export interface AnswerFeedback {
  isCorrect: boolean;
  selectedOption: number;
  correctAnswer: number;
  encouragement: string;
}

export interface QuizSettings {
  questionCount: QuestionCount;
  difficulty: Difficulty;
}

export interface QuizState {
  status: QuizStatus;
  questions: Question[];
  currentIndex: number;
  score: number;
  correctCount: number;
  incorrectCount: number;
  lastFeedback: AnswerFeedback | null;
  selectedOption: number | null;
  soundEnabled: boolean;
  settings: QuizSettings;
}
