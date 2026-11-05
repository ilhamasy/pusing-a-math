import { FUN_EMOJIS } from "@/constants/emojis";
import { Question, QuestionType } from "@/types/quiz";

// Helper: Pick random item from array
function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper: Random integer between min and max inclusive
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper: Shuffle array
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generate 4 unique answer options including the correct one
function generateOptions(correctAnswer: number, maxRange: number = 10): number[] {
  const optionsSet = new Set<number>([correctAnswer]);

  // Candidate offsets to produce sensible distractors (e.g. ±1, ±2, ±3)
  const candidateDeltas = shuffle([-2, -1, 1, 2, 3, -3, 4, -4]);

  for (const delta of candidateDeltas) {
    if (optionsSet.size >= 4) break;
    const candidate = correctAnswer + delta;
    if (candidate >= 0 && candidate <= maxRange && candidate !== correctAnswer) {
      optionsSet.add(candidate);
    }
  }

  // Fallback if needed to guarantee 4 unique options
  let fallback = 0;
  while (optionsSet.size < 4 && fallback <= 10) {
    optionsSet.add(fallback);
    fallback++;
  }

  return shuffle(Array.from(optionsSet).slice(0, 4));
}

// 1. Counting Objects generator (count 1 to 10)
function generateCountingQuestion(id: string): Question {
  const count = randomInt(1, 10);
  const emoji = pickRandom(FUN_EMOJIS);
  const options = generateOptions(count);

  return {
    id,
    type: "counting",
    prompt: "How many are there?",
    emoji,
    operandA: count,
    correctAnswer: count,
    options,
  };
}

// 2. Addition generator (operandA + operandB <= 10)
function generateAdditionQuestion(id: string): Question {
  const a = randomInt(1, 8);
  const b = randomInt(1, 10 - a);
  const sum = a + b;
  const options = generateOptions(sum);

  return {
    id,
    type: "addition",
    prompt: "What is the sum?",
    operandA: a,
    operandB: b,
    operator: "+",
    correctAnswer: sum,
    options,
  };
}

// 3. Subtraction generator (operandA - operandB >= 0, operands 1-10)
function generateSubtractionQuestion(id: string): Question {
  const a = randomInt(2, 10);
  const b = randomInt(1, a); // guarantees a - b >= 0
  const diff = a - b;
  const options = generateOptions(diff);

  return {
    id,
    type: "subtraction",
    prompt: "What is left?",
    operandA: a,
    operandB: b,
    operator: "−",
    correctAnswer: diff,
    options,
  };
}

// 4. Visual Math generator (groups of emojis with + or -)
function generateVisualMathQuestion(id: string): Question {
  const isAddition = Math.random() > 0.5;
  const emoji = pickRandom(FUN_EMOJIS);

  if (isAddition) {
    const a = randomInt(1, 5);
    const b = randomInt(1, Math.min(5, 10 - a));
    const sum = a + b;
    const options = generateOptions(sum);

    return {
      id,
      type: "visual_math",
      prompt: "Count and add them together!",
      emoji,
      emojiGroups: [
        { emoji, count: a },
        { emoji, count: b },
      ],
      operandA: a,
      operandB: b,
      operator: "+",
      correctAnswer: sum,
      options,
    };
  } else {
    const a = randomInt(2, 8);
    const b = randomInt(1, Math.min(a - 1, 4));
    const diff = a - b;
    const options = generateOptions(diff);

    return {
      id,
      type: "visual_math",
      prompt: "Take away the items, how many remain?",
      emoji,
      emojiGroups: [
        { emoji, count: a },
        { emoji, count: b },
      ],
      operandA: a,
      operandB: b,
      operator: "−",
      correctAnswer: diff,
      options,
    };
  }
}

// Master session generator: Exactly 10 questions (3 Counting, 2 Addition, 2 Subtraction, 3 Visual Math)
export function generateQuizSession(): Question[] {
  const questions: Question[] = [];

  // 3 Counting
  for (let i = 0; i < 3; i++) {
    questions.push(generateCountingQuestion(`q-counting-${i}-${Date.now()}`));
  }

  // 2 Addition
  for (let i = 0; i < 2; i++) {
    questions.push(generateAdditionQuestion(`q-add-${i}-${Date.now()}`));
  }

  // 2 Subtraction
  for (let i = 0; i < 2; i++) {
    questions.push(generateSubtractionQuestion(`q-sub-${i}-${Date.now()}`));
  }

  // 3 Visual Math
  for (let i = 0; i < 3; i++) {
    questions.push(generateVisualMathQuestion(`q-visual-${i}-${Date.now()}`));
  }

  // Shuffle question sequence so order is varied every session
  return shuffle(questions);
}
