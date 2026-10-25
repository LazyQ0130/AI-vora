export const samples = Array.from({ length: 60 }, (_, i) => ({
  x: i / 59,
  y: (2 * i) / 59 + 1,
}));
export function loss(w: number, b: number) {
  return (
    samples.reduce((sum, point) => sum + (w * point.x + b - point.y) ** 2, 0) /
    samples.length
  );
}
export function gradient(w: number, b: number) {
  return samples.reduce(
    (sum, point) => {
      const error = w * point.x + b - point.y;
      return {
        dw: sum.dw + (2 * error * point.x) / samples.length,
        db: sum.db + (2 * error) / samples.length,
      };
    },
    { dw: 0, db: 0 },
  );
}
export function train(learningRate: number, iterations: number) {
  if (
    !Number.isFinite(learningRate) ||
    learningRate <= 0 ||
    learningRate > 1 ||
    !Number.isInteger(iterations) ||
    iterations < 0 ||
    iterations > 5000
  )
    throw new RangeError("不支持的学习率或迭代次数");
  let w = 0,
    b = 0;
  const history = [loss(w, b)];
  for (let i = 0; i < iterations; i++) {
    const { dw, db } = gradient(w, b);
    w -= learningRate * dw;
    b -= learningRate * db;
    const current = loss(w, b);
    history.push(current);
    if (!Number.isFinite(current) || current > 1e12)
      return { w, b, history, diverged: true };
  }
  return { w, b, history, diverged: false };
}
