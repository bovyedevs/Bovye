import confetti from 'canvas-confetti';

export function fireCelebration() {
  confetti({
    particleCount: 30,
    spread: 60,
    startVelocity: 40,
    origin: { x: 0.5, y: 0.7 },
    colors: ['#d97706', '#f59e0b', '#fbbf24'],
    gravity: 1,
    drift: 0,
    ticks: 80,
  });
}
