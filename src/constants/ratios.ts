import type { ExerciseId } from '../types/domain';

export const PIVOT_EXERCISE: ExerciseId = 'bench_press';

export interface RatioRange {
  min: number;
  max: number;
}

export const IDEAL_RATIO_RANGES: Partial<Record<ExerciseId, RatioRange>> = {
  overhead_press: { min: 0.6, max: 0.65 },
  barbell_row: { min: 0.75, max: 0.8 },
  weighted_pull_up: { min: 0.75, max: 0.8 },
  squat: { min: 1.2, max: 1.4 },
  deadlift: { min: 1.5, max: 1.8 },
};

export const EXERCISE_LABELS: Record<ExerciseId, string> = {
  bench_press: 'Press de Banca',
  overhead_press: 'Press Militar',
  barbell_row: 'Remo con Barra',
  weighted_pull_up: 'Dominadas Lastradas',
  squat: 'Sentadilla',
  deadlift: 'Peso Muerto',
};

export const DEFICIENCY_THRESHOLD = -15;
