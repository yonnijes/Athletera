import { describe, expect, it } from 'vitest';
import {
  assessMetrics,
  buildRecommendation,
  classifyStatus,
  computeCurrentRatio,
  computeDeviationPct,
  estimate1RM,
  formatExercise,
  getMidIdealRatio,
} from './calculators';

describe('estimate1RM', () => {
  it('calcula 100kg x 10 reps ≈ 133.33', () => {
    expect(estimate1RM(100, 10)).toBe(133.33);
  });

  it('calcula 80kg x 8 reps ≈ 101.33', () => {
    expect(estimate1RM(80, 8)).toBe(101.33);
  });

  it('calcula 60kg x 5 reps = 70.00', () => {
    expect(estimate1RM(60, 5)).toBe(70);
  });

  it('lanza error con reps = 0', () => {
    expect(() => estimate1RM(100, 0)).toThrow('reps debe ser mayor que 0');
  });

  it('lanza error con reps negativas', () => {
    expect(() => estimate1RM(100, -5)).toThrow('reps debe ser mayor que 0');
  });

  it('lanza error con peso = 0', () => {
    expect(() => estimate1RM(0, 10)).toThrow('weightKg debe ser mayor que 0');
  });

  it('lanza error con peso negativo', () => {
    expect(() => estimate1RM(-50, 10)).toThrow('weightKg debe ser mayor que 0');
  });
});

describe('computeCurrentRatio', () => {
  it('calcula ratio actual correctamente', () => {
    expect(computeCurrentRatio(60, 100)).toBe(0.6);
  });

  it('lanza error con pivot1RM = 0', () => {
    expect(() => computeCurrentRatio(60, 0)).toThrow('pivot1RM debe ser mayor que 0');
  });
});

describe('getMidIdealRatio', () => {
  it('devuelve 0.625 para overhead_press (promedio de 0.6-0.65)', () => {
    expect(getMidIdealRatio('overhead_press')).toBeCloseTo(0.625, 2);
  });

  it('devuelve 0.775 para barbell_row (promedio de 0.75-0.8)', () => {
    expect(getMidIdealRatio('barbell_row')).toBeCloseTo(0.775, 2);
  });

  it('devuelve ~1.3 para squat (promedio de 1.2-1.4)', () => {
    expect(getMidIdealRatio('squat')).toBeCloseTo(1.3, 2);
  });

  it('devuelve null para bench_press (no tiene ratio)', () => {
    expect(getMidIdealRatio('bench_press')).toBeNull();
  });
});

describe('computeDeviationPct', () => {
  it('calcula 0% cuando actual = ideal', () => {
    expect(computeDeviationPct(0.625, 0.625)).toBe(0);
  });

  it('calcula desviación positiva cuando actual > ideal', () => {
    expect(computeDeviationPct(0.7, 0.625)).toBeCloseTo(12, 0);
  });

  it('calcula desviación negativa cuando actual < ideal', () => {
    expect(computeDeviationPct(0.5, 0.625)).toBeCloseTo(-20, 0);
  });

  it('lanza error con idealRatio = 0', () => {
    expect(() => computeDeviationPct(0.5, 0)).toThrow('idealRatio debe ser mayor que 0');
  });
});

describe('classifyStatus', () => {
  it('clasifica como optimal con desviación 0%', () => {
    expect(classifyStatus(0)).toBe('optimal');
  });

  it('clasifica como optimal con desviación -3%', () => {
    expect(classifyStatus(-3)).toBe('optimal');
  });

  it('clasifica como optimal con desviación -5% (límite superior)', () => {
    // -5 NO es < -5, así que es optimal
    expect(classifyStatus(-5)).toBe('optimal');
  });

  it('clasifica como warning con desviación -6%', () => {
    expect(classifyStatus(-6)).toBe('warning');
  });

  it('clasifica como warning con desviación -10%', () => {
    expect(classifyStatus(-10)).toBe('warning');
  });

  it('clasifica como critical con desviación -15%', () => {
    expect(classifyStatus(-15)).toBe('critical');
  });

  it('clasifica como critical con desviación -20%', () => {
    expect(classifyStatus(-20)).toBe('critical');
  });
});

describe('buildRecommendation', () => {
  it('devuelve mensaje de mantener para optimal', () => {
    expect(buildRecommendation('overhead_press', 'optimal')).toContain('Mantener');
  });

  it('devuelve recomendación específica para overhead_press', () => {
    expect(buildRecommendation('overhead_press', 'critical')).toContain('Face Pulls');
  });

  it('devuelve recomendación específica para squat', () => {
    expect(buildRecommendation('squat', 'warning')).toContain('sentadilla frontal');
  });

  it('devuelve recomendación con consejo de nivel para ejercicio sin advice específico', () => {
    const rec = buildRecommendation('bench_press', 'warning', 'novice');
    expect(rec).toContain('técnica');
  });
});

describe('formatExercise', () => {
  it('formatea bench_press correctamente', () => {
    expect(formatExercise('bench_press')).toBe('Press de Banca');
  });

  it('formatea overhead_press correctamente', () => {
    expect(formatExercise('overhead_press')).toBe('Press Militar');
  });

  it('formatea squat correctamente', () => {
    expect(formatExercise('squat')).toBe('Sentadilla');
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

  it('requiere al menos 2 ejercicios', () => {
    expect(() =>
      assessMetrics([{ exerciseId: 'bench_press', weightKg: 80, reps: 8 }]),
    ).toThrow(/al menos dos/i);
  });

  it('calcula resultados correctamente con datos válidos', () => {
    // Bench: 100kg x 10 reps = 133.33 1RM
    // Overhead: 60kg x 8 reps = 76 1RM
    // Ratio actual: 76 / 133.33 = 0.57
    // Ratio ideal: 0.625
    // Eficiencia: 0.57 / 0.625 * 100 = 91.2%
    const results = assessMetrics([
      { exerciseId: 'bench_press', weightKg: 100, reps: 10 },
      { exerciseId: 'overhead_press', weightKg: 60, reps: 8 },
    ]);

    expect(results).toHaveLength(1);
    const result = results[0]!;
    expect(result.exercise).toBe('overhead_press');
    expect(result.current1RM).toBe(76);
    expect(result.percentageEfficiency).toBeCloseTo(91.2, 0);
  });

  it('marca como critical cuando hay deficiencia significativa', () => {
    const results = assessMetrics([
      { exerciseId: 'bench_press', weightKg: 100, reps: 10 },
      { exerciseId: 'overhead_press', weightKg: 40, reps: 6 }, // Muy bajo
    ]);

    expect(results[0]!.status).toBe('critical');
  });

  it('calcula 1RM correctamente para ejercicios de autocarga (weighted_pull_up con bodyWeight)', () => {
    // Usuario de 75kg hace dominadas con 25kg de lastre x 5 reps
    // Peso total = 75 + 25 = 100kg
    // 1RM = 100 × (1 + 5/30) = 100 × 1.167 = 116.67kg
    const results = assessMetrics([
      { exerciseId: 'bench_press', weightKg: 100, reps: 10 },
      { exerciseId: 'weighted_pull_up', weightKg: 25, reps: 5 },
    ], 75); // bodyWeightKg = 75

    expect(results).toHaveLength(1);
    const result = results[0]!;
    expect(result.exercise).toBe('weighted_pull_up');
    expect(result.current1RM).toBe(116.67); // 100kg total × (1 + 5/30)
  });

  it('calcula 1RM correctamente para dips con bodyWeight', () => {
    // Usuario de 80kg hace dips con 20kg de lastre x 8 reps
    // Peso total = 80 + 20 = 100kg
    // 1RM = 100 × (1 + 8/30) = 100 × 1.267 = 126.67kg
    const results = assessMetrics([
      { exerciseId: 'bench_press', weightKg: 100, reps: 10 },
      { exerciseId: 'dips', weightKg: 20, reps: 8 },
    ], 80); // bodyWeightKg = 80

    expect(results).toHaveLength(1);
    const result = results[0]!;
    expect(result.exercise).toBe('dips');
    expect(result.current1RM).toBe(126.67); // 100kg total × (1 + 8/30)
  });

  it('usa solo lastre si no hay bodyWeight para ejercicios de autocarga', () => {
    // Sin bodyWeight, usa solo el lastre (comportamiento fallback)
    const results = assessMetrics([
      { exerciseId: 'bench_press', weightKg: 100, reps: 10 },
      { exerciseId: 'weighted_pull_up', weightKg: 25, reps: 5 },
    ]); // sin bodyWeightKg

    expect(results).toHaveLength(1);
    const result = results[0]!;
    expect(result.exercise).toBe('weighted_pull_up');
    expect(result.current1RM).toBe(29.17); // solo 25kg × (1 + 5/30)
  });

  it('no aplica autocarga a ejercicios que no son de autocarga', () => {
    // Bench press no usa autocarga, solo el peso de la barra
    const results = assessMetrics([
      { exerciseId: 'bench_press', weightKg: 100, reps: 10 },
      { exerciseId: 'overhead_press', weightKg: 50, reps: 8 },
    ], 75); // bodyWeightKg = 75 (no debería afectar overhead_press)

    expect(results).toHaveLength(1);
    const result = results[0]!;
    expect(result.exercise).toBe('overhead_press');
    expect(result.current1RM).toBe(63.33); // 50kg × (1 + 8/30), NO incluye bodyWeight
  });

  it('ajusta el 1RM para mancuernas (peso por lado ×2 con -10%)', () => {
    // Press militar con mancuernas: 20kg por lado × 8 reps
    // Peso total = 20×2 = 40kg
    // Corrección -10% → 36kg efectivos
    // 1RM = 36 × (1 + 8/30) = 36 × 1.2667 = 45.6kg
    const results = assessMetrics([
      { exerciseId: 'bench_press', weightKg: 100, reps: 10 },
      { exerciseId: 'overhead_press', weightKg: 20, reps: 8, implement: 'dumbbell' },
    ]);

    expect(results).toHaveLength(1);
    const result = results[0]!;
    expect(result.exercise).toBe('overhead_press');
    expect(result.current1RM).toBe(45.6);
  });
});
