import { FUN_EMOJIS } from "@/constants/emojis";
import { Question, Difficulty, QuestionCount, ComparisonChoice } from "@/types/quiz";

// Helper: Pick random item from array
function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper: Random integer between min and max inclusive
function randomInt(min: number, max: number): number {
  if (min > max) [min, max] = [max, min];
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

  const spread = Math.max(2, Math.floor(maxRange / 10));
  const candidateDeltas = shuffle([
    -1, 1,
    -2, 2,
    -spread, spread,
    -(spread + 1), spread + 1,
    -(spread * 2), spread * 2,
    -3, 3,
  ]);

  for (const delta of candidateDeltas) {
    if (optionsSet.size >= 4) break;
    const candidate = correctAnswer + delta;
    if (candidate >= 0 && candidate <= maxRange && candidate !== correctAnswer) {
      optionsSet.add(candidate);
    }
  }

  // Fallback generation close to correct answer
  let offset = 1;
  while (optionsSet.size < 4 && offset <= Math.max(maxRange, 15)) {
    if (correctAnswer + offset <= maxRange) {
      optionsSet.add(correctAnswer + offset);
    }
    if (optionsSet.size < 4 && correctAnswer - offset >= 0) {
      optionsSet.add(correctAnswer - offset);
    }
    offset++;
  }

  // Safety fallback
  let fallback = 0;
  while (optionsSet.size < 4) {
    optionsSet.add(fallback);
    fallback++;
  }

  return shuffle(Array.from(optionsSet).slice(0, 4));
}

// Creative prompt templates
const ADDITION_PROMPTS = [
  (a: number, b: number) => `Berapa hasil dari ${a} + ${b}?`,
  (a: number, b: number) => `Hitung cepat: ${a} ditambah ${b} sama dengan berapa?`,
  (a: number, b: number) => `Bantu astronot menjumlahkan ${a} + ${b}!`,
  (a: number, b: number) => `Yuk temukan total dari ${a} + ${b}!`,
  (a: number, b: number) => `Berapa hasil penjumlahan ${a} dan ${b}?`,
];

const SUBTRACTION_PROMPTS = [
  (a: number, b: number) => `Berapa hasil dari ${a} − ${b}?`,
  (a: number, b: number) => `Hitung cepat: ${a} dikurangi ${b} sisa berapa?`,
  (a: number, b: number) => `Bantu astronot menghitung sisa ${a} − ${b}!`,
  (a: number, b: number) => `Berapa sisa pengurangan ${a} dikurang ${b}?`,
  (a: number, b: number) => `Yuk temukan jawaban dari ${a} − ${b}!`,
];

const VISUAL_ADD_PROMPTS = [
  "Hitung dan jumlahkan semua gambarnya!",
  "Berapa banyak semua gambar jika digabung?",
  "Yuk bantu astronot hitung total gambarnya!",
];

const VISUAL_SUB_PROMPTS = [
  "Hitung sisa gambarnya setelah dikurangi!",
  "Berapa sisa gambar setelah dikurangi kelompok kedua?",
  "Yuk cari tahu hasil pengurangan gambarnya!",
];

// 1. Counting Objects Generator
function generateCountingQuestion(id: string, difficulty: Difficulty): Question {
  const maxLimit = getDifficultyLimit(difficulty);
  const upperCount = Math.min(maxLimit, difficulty === "easy" ? 9 : difficulty === "medium" ? 15 : 20);
  const lowerCount = difficulty === "easy" ? 2 : difficulty === "medium" ? 4 : 6;
  const count = randomInt(lowerCount, upperCount);
  const emoji = pickRandom(FUN_EMOJIS);
  const options = generateOptions(count, maxLimit);

  const prompts = [
    "Ada berapa banyak objek di bawah ini?",
    "Bantu astronot menghitung jumlah objek ini!",
    "Yuk hitung dengan teliti berapa jumlah gambarnya!",
  ];

  return {
    id,
    type: "counting",
    prompt: pickRandom(prompts),
    emoji,
    operandA: count,
    correctAnswer: count,
    options,
  };
}

// 2. Addition Generator (Strict anti-trivial rules: no +1, strictly appropriate ranges)
function generateAdditionQuestion(id: string, difficulty: Difficulty): Question {
  const limit = getDifficultyLimit(difficulty);
  let a: number;
  let b: number;
  let sum: number;

  switch (difficulty) {
    case "easy": {
      // Sum between 5 and 10, both operands >= 2 (No +1 or 1+)
      sum = randomInt(5, 10);
      a = randomInt(2, sum - 2);
      b = sum - a;
      break;
    }
    case "medium": {
      // Sum strictly between 11 and 20, both operands >= 4
      sum = randomInt(11, 20);
      a = randomInt(4, sum - 4);
      b = sum - a;
      break;
    }
    case "hard": {
      // Sum strictly between 18 and 30, both operands >= 7
      sum = randomInt(18, 30);
      a = randomInt(7, sum - 7);
      b = sum - a;
      break;
    }
    case "wni": {
      // Sum strictly between 40 and 100, both operands >= 15
      sum = randomInt(40, 100);
      a = randomInt(15, sum - 15);
      b = sum - a;
      break;
    }
  }

  const promptFn = pickRandom(ADDITION_PROMPTS);

  return {
    id,
    type: "addition",
    prompt: promptFn(a, b),
    operandA: a,
    operandB: b,
    operator: "+",
    correctAnswer: sum,
    options: generateOptions(sum, limit),
  };
}

// 3. Subtraction Generator (Strict anti-trivial rules: never a - a = 0, no a - 1, diff >= 2)
function generateSubtractionQuestion(id: string, difficulty: Difficulty): Question {
  const limit = getDifficultyLimit(difficulty);
  let a: number;
  let b: number;

  switch (difficulty) {
    case "easy": {
      // a between 5 and 10, b between 2 and a - 2 (diff >= 2, never 0 or 1)
      a = randomInt(5, 10);
      b = randomInt(2, a - 2);
      break;
    }
    case "medium": {
      // a between 12 and 20, b between 4 and a - 3 (diff >= 3, b >= 4)
      a = randomInt(12, 20);
      b = randomInt(4, a - 3);
      break;
    }
    case "hard": {
      // a between 20 and 30, b between 6 and a - 5 (diff >= 5, b >= 6)
      a = randomInt(20, 30);
      b = randomInt(6, a - 5);
      break;
    }
    case "wni": {
      // a between 45 and 99, b between 15 and a - 12 (diff >= 12, b >= 15)
      a = randomInt(45, 99);
      b = randomInt(15, a - 12);
      break;
    }
  }

  const diff = a - b;
  const promptFn = pickRandom(SUBTRACTION_PROMPTS);

  return {
    id,
    type: "subtraction",
    prompt: promptFn(a, b),
    operandA: a,
    operandB: b,
    operator: "−",
    correctAnswer: diff,
    options: generateOptions(diff, limit),
  };
}

// 4. Visual Math Generator (Groups of emojis with + or -)
function generateVisualMathQuestion(id: string, difficulty: Difficulty): Question {
  const isAddition = Math.random() > 0.5;
  const emoji = pickRandom(FUN_EMOJIS);
  const limit = getDifficultyLimit(difficulty);

  if (isAddition) {
    let a: number;
    let b: number;
    switch (difficulty) {
      case "easy":
        a = randomInt(2, 5);
        b = randomInt(2, Math.min(5, 10 - a));
        break;
      case "medium":
        a = randomInt(3, 7);
        b = randomInt(3, Math.min(7, 20 - a));
        break;
      case "hard":
      case "wni":
        a = randomInt(4, 8);
        b = randomInt(4, Math.min(8, 20 - a));
        break;
    }

    const sum = a + b;
    return {
      id,
      type: "visual_math",
      prompt: pickRandom(VISUAL_ADD_PROMPTS),
      emoji,
      emojiGroups: [
        { emoji, count: a },
        { emoji, count: b },
      ],
      operandA: a,
      operandB: b,
      operator: "+",
      correctAnswer: sum,
      options: generateOptions(sum, limit),
    };
  } else {
    // Subtraction: strictly a > b, b >= 2, diff >= 2 (never identical numbers a === b!)
    let a: number;
    let b: number;
    switch (difficulty) {
      case "easy":
        a = randomInt(4, 6);
        b = randomInt(2, a - 2);
        break;
      case "medium":
        a = randomInt(5, 8);
        b = randomInt(2, a - 2);
        break;
      case "hard":
      case "wni":
        a = randomInt(6, 10);
        b = randomInt(3, a - 2);
        break;
    }

    const diff = a - b;
    return {
      id,
      type: "visual_math",
      prompt: pickRandom(VISUAL_SUB_PROMPTS),
      emoji,
      emojiGroups: [
        { emoji, count: a },
        { emoji, count: b },
      ],
      operandA: a,
      operandB: b,
      operator: "−",
      correctAnswer: diff,
      options: generateOptions(diff, limit),
    };
  }
}

// 5. Comparison: "Dari gambar dibawah ini manakah yang paling sedikit?"
function generateComparisonLeastQuestion(id: string, difficulty: Difficulty): Question {
  const emoji = pickRandom(FUN_EMOJIS);
  const labels = ["A", "B", "C", "D"];

  const countsSet = new Set<number>();
  const upperLimit = difficulty === "easy" ? 7 : 8;
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

  const comparisonPrompts = [
    "Dari gambar di bawah ini, manakah yang paling sedikit?",
    "Yuk cari kotak yang isinya paling sedikit!",
    "Di antara pilihan di bawah, manakah jumlah gambar yang paling sedikit?",
  ];

  return {
    id,
    type: "comparison_least",
    prompt: pickRandom(comparisonPrompts),
    emoji,
    comparisonChoices,
    operandA: minCount,
    correctAnswer: correctIndex, // 0, 1, 2, or 3
    options: [0, 1, 2, 3],
  };
}

// Master session generator with full deduplication & difficulty enforcement
export function generateQuizSession(
  count: QuestionCount = 10,
  difficulty: Difficulty = "easy"
): Question[] {
  const questions: Question[] = [];
  const seenSignatures = new Set<string>();

  const getSignature = (q: Question): string =>
    `${q.type}:${q.operator || ""}:${q.operandA}:${q.operandB || ""}`;

  // Helper to add unique question with retry
  const addUnique = (generator: () => Question) => {
    let attempts = 0;
    while (attempts < 15) {
      const candidate = generator();
      const sig = getSignature(candidate);
      if (!seenSignatures.has(sig)) {
        seenSignatures.add(sig);
        questions.push(candidate);
        return;
      }
      attempts++;
    }
    // If maximum retry reached, push anyway with unique ID
    const fallbackQ = generator();
    questions.push(fallbackQ);
  };

  // Guarantee at least 10% comparison_least questions
  const comparisonCount = Math.max(1, Math.ceil(count * 0.1));
  for (let i = 0; i < comparisonCount; i++) {
    addUnique(() => generateComparisonLeastQuestion(`q-comp-${i}-${Date.now()}-${Math.random()}`, difficulty));
  }

  // Allocate remaining questions across Counting, Addition, Subtraction, Visual Math
  const remaining = count - questions.length;
  const additionCount = Math.max(1, Math.round(remaining * 0.3));
  const subtractionCount = Math.max(1, Math.round(remaining * 0.3));
  const visualCount = Math.max(1, Math.round(remaining * 0.25));
  const countingCount = Math.max(1, remaining - additionCount - subtractionCount - visualCount);

  for (let i = 0; i < countingCount; i++) {
    addUnique(() => generateCountingQuestion(`q-counting-${i}-${Date.now()}-${Math.random()}`, difficulty));
  }

  for (let i = 0; i < additionCount; i++) {
    addUnique(() => generateAdditionQuestion(`q-add-${i}-${Date.now()}-${Math.random()}`, difficulty));
  }

  for (let i = 0; i < subtractionCount; i++) {
    addUnique(() => generateSubtractionQuestion(`q-sub-${i}-${Date.now()}-${Math.random()}`, difficulty));
  }

  for (let i = 0; i < visualCount; i++) {
    addUnique(() => generateVisualMathQuestion(`q-visual-${i}-${Date.now()}-${Math.random()}`, difficulty));
  }

  // Trim or fill if rounding had slight difference
  while (questions.length < count) {
    addUnique(() => generateAdditionQuestion(`q-fill-${questions.length}-${Date.now()}-${Math.random()}`, difficulty));
  }

  const finalQuestions = questions.slice(0, count);

  // Return a thoroughly randomized sequence
  return shuffle(finalQuestions);
}
