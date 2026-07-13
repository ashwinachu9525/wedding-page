import confetti from "canvas-confetti";

export const useConfetti = () => {
  const triggerSidePoppers = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      // launch a few confetti from the left edge
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ["#D4AF37", "#FF9933", "#FFFFFF", "#E6C280"]
      });
      // and launch a few from the right edge
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ["#D4AF37", "#FF9933", "#FFFFFF", "#E6C280"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  return { triggerSidePoppers };
};
