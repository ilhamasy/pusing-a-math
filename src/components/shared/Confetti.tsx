import confetti from "canvas-confetti";

export function triggerCorrectConfetti() {
  if (typeof window === "undefined") return;

  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.65 },
    colors: ["#8175FF", "#40B9FF", "#FFD166", "#FF78B9", "#45D6A0"],
    ticks: 150,
    disableForReducedMotion: true,
  });
}

export function triggerGrandCelebration() {
  if (typeof window === "undefined") return;

  const duration = 2 * 1000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#8175FF", "#40B9FF", "#FFD166", "#FF78B9", "#45D6A0"],
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#8175FF", "#40B9FF", "#FFD166", "#FF78B9", "#45D6A0"],
      disableForReducedMotion: true,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}
