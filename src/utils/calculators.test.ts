import { describe, expect, it } from 'vitest';
import { assessMetrics, estimate1RM } from './calculators';

describe('estimate1RM', () => {
  it('calcula 100kg x 10 reps ≈ 133.33', () => {
    expect(estimate1RM(100, 10)).toBe(133.33);
  });

  it('lanza error con reps inválidas', () => {
    expect(() => estimate1RM(100, 0)).toThrow();
  });
});

describe('assessMetrics', () => {
  it('requiere ejercicio pivot (bench_press)', () => {
    expect(() =>
      assessMetrics([
        { exerciseId: 'overhead_press', weightKg: 40, reps: 8 },
        { exerciseId: 'squat', weightKg: 120, reps: 5 },
      ]),
    ).toThrow(/pivot/i);
  });
});
