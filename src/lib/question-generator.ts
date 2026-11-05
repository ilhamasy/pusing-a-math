import { FUN_EMOJIS } from "@/constants/emojis";
import { Question, QuestionType, Difficulty, QuestionCount, ComparisonChoice } from "@/types/quiz";

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

// Get numeric ceiling based on difficulty setting
function getDifficultyLimit(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy":
      return 10;
    case "medium":
      return 20;
    case "hard":
      return 30;
    case "wni":
      return 100;
  }
}

// Generate 4 unique answer options including the correct one
function generateOptions(correctAnswer: number, maxRange: number = 10): number[] {
  const optionsSet = new Set<number>([correctAnswer]);

  // Reasonable spread of distractors
  const spread = Math.max(2, Math.floor(maxRange / 10));
  const candidateDeltas = shuffle([
    -spread,
    spread,
    -(spread * 2),
    spread * 2,
    -1,
    1,
    -(spread + 1),
    spread + 1,
  ]);

  for (const delta of candidateDeltas) {
    if (optionsSet.size >= 4) break;
    const candidate = correctAnswer + delta;
    if (candidate >= 0 && candidate <= maxRange && candidate !== correctAnswer) {
      optionsSet.add(candidate);
    }
  }

  // Fallback generation if needed
  let fallback = 0;
  while (optionsSet.size < 4 && fallback <= maxRange) {
    optionsSet.add(fallback);
    fallback++;
  }

  // If still need more (e.g. small maxRange)
  let extra = 1;
  while (optionsSet.size < 4) {
    optionsSet.add(correctAnswer + extra);
    extra++;
  }

  return shuffle(Array.from(optionsSet).slice(0, 4));
}

// 1. Counting Objects Generator
function generateCountingQuestion(id: string, difficulty: Difficulty): Question {
  const maxLimit = getDifficultyLimit(difficulty);
  // Keep visual count manageable for counting
  const upperCount = Math.min(maxLimit, difficulty === "easy" ? 10 : difficulty === "medium" ? 16 : 24);
  const lowerCount = difficulty === "easy" ? 1 : difficulty === "medium" ? 3 : 5;
  const count = randomInt(lowerCount, upperCount);
  const emoji = pickRandom(FUN_EMOJIS);
  const options = generateOptions(count, maxLimit);

  return {
    id,
    type: "counting",
    prompt: "Ada berapa objek di bawah ini? 🔍",
    emoji,
    operandA: count,
    correctAnswer: count,
    options,
  };
}

// 2. Addition Generator (operandA + operandB <= limit)
function generateAdditionQuestion(id: string, difficulty: Difficulty): Question {
  const limit = getDifficultyLimit(difficulty);
  const minOperand = difficulty === "wni" ? 10 : 1;
  const a = randomInt(minOperand, limit - (difficulty === "wni" ? 10 : 2));
  const b = randomInt(1, limit - a);
  const sum = a + b;
  const options = generateOptions(sum, limit);

  return {
    id,
    type: "addition",
    prompt: "Berapa hasil penjumlahan ini? ➕",
    operandA: a,
    operandB: b,
    operator: "+",
    correctAnswer: sum,
    options,
  };
}

// 3. Subtraction Generator (operandA - operandB >= 0, operandA <= limit)
function generateSubtractionQuestion(id: string, difficulty: Difficulty): Question {
  const limit = getDifficultyLimit(difficulty);
  const a = randomInt(difficulty === "wni" ? 15 : 2, limit);
  const b = randomInt(1, a);
  const diff = a - b;
  const options = generateOptions(diff, limit);

  return {
    id,
    type: "subtraction",
    prompt: "Berapa sisa pengurangannya? ➖",
    operandA: a,
    operandB: b,
    operator: "−",
    correctAnswer: diff,
    options,
  };
}

// 4. Visual Math Generator (groups of emojis with + or -)
function generateVisualMathQuestion(id: string, difficulty: Difficulty): Question {
  const isAddition = Math.random() > 0.5;
  const emoji = pickRandom(FUN_EMOJIS);
  const limit = getDifficultyLimit(difficulty);

  const maxVisualPerGroup = difficulty === "easy" ? 5 : difficulty === "medium" ? 8 : 12;

  if (isAddition) {
    const a = randomInt(1, maxVisualPerGroup);
    const b = randomInt(1, Math.min(maxVisualPerGroup, limit - a));
    const sum = a + b;
    const options = generateOptions(sum, limit);

    return {
      id,
      type: "visual_math",
      prompt: "Hitung dan jumlahkan gambarnya! 🍓",
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
    const a = randomInt(2, maxVisualPerGroup);
    const b = randomInt(1, a - 1);
    const diff = a - b;
    const options = generateOptions(diff, limit);

    return {
      id,
      type: "visual_math",
      prompt: "Ambil gambar yang dicoret, berapakah sisanya? 🍬",
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

// 5. Comparison: "Dari gambar dibawah ini manakah yang paling sedikit?"
function generateComparisonLeastQuestion(id: string, difficulty: Difficulty): Question {
  const emoji = pickRandom(FUN_EMOJIS);
  const labels = ["A", "B", "C", "D"];

  // Generate 4 unique counts
  const countsSet = new Set<number>();
  const upperLimit = difficulty === "easy" ? 8 : difficulty === "medium" ? 14 : 20;
  const lowerLimit = 1;

  while (countsSet.size < 4) {
    countsSet.add(randomInt(lowerLimit, upperLimit));
  }

  const counts = shuffle(Array.from(countsSet));
  const minCount = Math.min(...counts);
  const correctIndex = counts.indexOf(minCount);

  const comparisonChoices: ComparisonChoice[] = counts.map((count, idx) => ({
    id: idx,
    label: labels[idx],
    emoji,
    count,
  }));

  return {
    id,
    type: "comparison_least",
    prompt: "Dari gambar di bawah ini, manakah yang paling sedikit? 🔍",
    emoji,
    comparisonChoices,
    operandA: minCount,
    correctAnswer: correctIndex, // 0, 1, 2, or 3 representing Option A, B, C, or D
    options: [0, 1, 2, 3],
  };
}

// Master session generator with configurable question count & difficulty
export function generateQuizSession(
  count: QuestionCount = 10,
  difficulty: Difficulty = "easy"
): Question[] {
  const questions: Question[] = [];

  // Guarantee at least 10% comparison_least questions
  const comparisonCount = Math.max(1, Math.ceil(count * 0.1));
  for (let i = 0; i < comparisonCount; i++) {
    questions.push(generateComparisonLeastQuestion(`q-comp-${i}-${Date.now()}`, difficulty));
  }

  // Allocate remaining questions across Counting, Addition, Subtraction, Visual Math
  const remaining = count - comparisonCount;
  const additionCount = Math.max(1, Math.round(remaining * 0.28));
  const subtractionCount = Math.max(1, Math.round(remaining * 0.28));
  const visualCount = Math.max(1, Math.round(remaining * 0.24));
  const countingCount = Math.max(1, remaining - additionCount - subtractionCount - visualCount);

  for (let i = 0; i < countingCount; i++) {
    questions.push(generateCountingQuestion(`q-counting-${i}-${Date.now()}`, difficulty));
  }

  for (let i = 0; i < additionCount; i++) {
    questions.push(generateAdditionQuestion(`q-add-${i}-${Date.now()}`, difficulty));
  }

  for (let i = 0; i < subtractionCount; i++) {
    questions.push(generateSubtractionQuestion(`q-sub-${i}-${Date.now()}`, difficulty));
  }

  for (let i = 0; i < visualCount; i++) {
    questions.push(generateVisualMathQuestion(`q-visual-${i}-${Date.now()}`, difficulty));
  }

  // Trim or adjust if rounding had slight difference
  let finalQuestions = questions.slice(0, count);
  while (finalQuestions.length < count) {
    finalQuestions.push(generateAdditionQuestion(`q-fill-${finalQuestions.length}-${Date.now()}`, difficulty));
  }

  // Ensure randomized sequence
  return shuffle(finalQuestions);
}
