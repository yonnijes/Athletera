import {
  DEFICIENCY_THRESHOLD,
  EXERCISE_LABELS,
  IDEAL_RATIO_RANGES,
  PIVOT_EXERCISE,
} from '../constants/ratios';
import type { AssessmentResult, ExerciseId, StrengthMetrics } from '../types/domain';

const round2 = (n: number): number => Math.round(n * 100) / 100;

export function estimate1RM(weightKg: number, reps: number): number {
  if (!Number.isFinite(weightKg) || !Number.isFinite(reps)) {
    throw new Error('weightKg y reps deben ser números finitos.');
  }
  if (weightKg <= 0) throw new Error('weightKg debe ser mayor que 0.');
  if (reps <= 0) throw new Error('reps debe ser mayor que 0.');

  return round2(weightKg * (1 + reps / 30));
}

export function computeCurrentRatio(current1RM: number, pivot1RM: number): number {
  if (pivot1RM <= 0) throw new Error('pivot1RM debe ser mayor que 0.');
  return current1RM / pivot1RM;
}

export function getMidIdealRatio(exerciseId: ExerciseId): number | null {
  const range = IDEAL_RATIO_RANGES[exerciseId];
  if (!range) return null;
  return (range.min + range.max) / 2;
}

export function computeDeviationPct(actualRatio: number, idealRatio: number): number {
  if (idealRatio <= 0) throw new Error('idealRatio debe ser mayor que 0.');
  return ((actualRatio - idealRatio) / idealRatio) * 100;
}

export function classifyStatus(deviationPct: number): 'optimal' | 'warning' | 'critical' {
  if (deviationPct <= DEFICIENCY_THRESHOLD) return 'critical';
  if (deviationPct < -5) return 'warning';
  return 'optimal';
}

export function buildRecommendation(exerciseId: ExerciseId, status: 'optimal' | 'warning' | 'critical'): string {
  if (status === 'optimal') return 'Mantener progresión y técnica actual.';

  const map: Partial<Record<ExerciseId, string>> = {
    overhead_press: 'Aumentar trabajo de hombro/estabilidad escapular (Face Pulls, Press Arnold).',
    barbell_row: 'Priorizar tracción horizontal (remo con pausa, control excéntrico).',
    weighted_pull_up: 'Mejorar tracción vertical (dominadas estrictas y trabajo de dorsales).',
    squat: 'Elevar fuerza de tren inferior (sentadilla frontal, tempo squats).',
    deadlift: 'Reforzar cadena posterior (RDL, hip thrust, bisagra técnica).',
  };
  return map[exerciseId] ?? 'Incrementar volumen específico y revisar técnica.';
}

export function assessMetrics(metrics: StrengthMetrics[]): AssessmentResult[] {
  if (metrics.length < 2) throw new Error('Debes ingresar al menos dos ejercicios para comparar.');

  const pivotMetric = metrics.find((m) => m.exerciseId === PIVOT_EXERCISE);
  if (!pivotMetric) throw new Error('El ejercicio pivot (Press de Banca) es obligatorio.');

  const pivot1RM = estimate1RM(pivotMetric.weightKg, pivotMetric.reps);

  return metrics
    .filter((m) => m.exerciseId !== PIVOT_EXERCISE)
    .map((metric) => {
      const current1RM = estimate1RM(metric.weightKg, metric.reps);
      const actualRatio = computeCurrentRatio(current1RM, pivot1RM);
      const idealRatio = getMidIdealRatio(metric.exerciseId);

      if (!idealRatio) {
        return {
          exercise: metric.exerciseId,
          current1RM,
          target1RM: 0,
          percentageEfficiency: 0,
          status: 'warning',
          recommendation: 'No existe ratio ideal configurado para este ejercicio.',
        } satisfies AssessmentResult;
      }

      const target1RM = round2(pivot1RM * idealRatio);
      const percentageEfficiency = round2((actualRatio / idealRatio) * 100);
      const deviation = computeDeviationPct(actualRatio, idealRatio);
      const status = classifyStatus(deviation);

      return {
        exercise: metric.exerciseId,
        current1RM,
        target1RM,
        percentageEfficiency,
        status,
        recommendation: buildRecommendation(metric.exerciseId, status),
      } satisfies AssessmentResult;
    });
}

export const formatExercise = (exerciseId: ExerciseId): string => EXERCISE_LABELS[exerciseId];
