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
  dips: { min: 1.1, max: 1.2 }, // 110-120% del Press de Banca
  tricep_extension: { min: 0.18, max: 0.22 }, // ~20% de Banca
  face_pull: { min: 0.08, max: 0.12 }, // 10-12% para resistencia (15 reps)
};

export const EXERCISE_LABELS: Record<ExerciseId, string> = {
  bench_press: 'Press de Banca',
  overhead_press: 'Press Militar',
  barbell_row: 'Remo con Barra',
  weighted_pull_up: 'Dominadas Lastradas',
  squat: 'Sentadilla',
  deadlift: 'Peso Muerto',
  dips: 'Dips (Fondos en Paralelas)',
  tricep_extension: 'Press Francés / Tríceps',
  face_pull: 'Face Pull (Resistencia)',
};

export const DEFICIENCY_THRESHOLD = -15;
