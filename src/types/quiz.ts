export type QuestionType =
  | "counting"
  | "addition"
  | "subtraction"
  | "visual_math";

export interface EmojiGroup {
  emoji: string;
  count: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  emoji?: string;
  emojiGroups?: EmojiGroup[];
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
}
