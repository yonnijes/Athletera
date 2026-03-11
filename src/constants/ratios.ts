import type { ExerciseId, StrengthLevel } from '../types/domain';

export const PIVOT_EXERCISE: ExerciseId = 'bench_press';

export type Level = 'beginner' | 'intermediate' | 'advanced';

/**
 * Matriz de Estándares de Fuerza por Nivel
 * Basado en peso corporal (BW) y ratio vs Press de Banca
 * 
 * Fuentes: Strength Level, Starting Strength, NSCA
 */
export interface LevelStandard {
  beginner: number;
  intermediate: number;
  advanced: number;
}

/**
 * Estándares por ejercicio basados en peso corporal (BW)
 */
export const BW_STANDARDS: Record<ExerciseId, LevelStandard> = {
  bench_press: {
    beginner: 0.8,   // 0.8× BW
    intermediate: 1.2, // 1.2× BW
    advanced: 1.5,   // 1.5× BW
  },
  overhead_press: {
    beginner: 0.4,   // 50% de bench beginner
    intermediate: 0.72, // 60% de bench intermediate
    advanced: 1.125, // 75% de bench advanced
  },
  barbell_row: {
    beginner: 0.48,  // 60% de bench beginner
    intermediate: 0.9,  // 75% de bench intermediate
    advanced: 1.35,  // 90% de bench advanced
  },
  weighted_pull_up: {
    beginner: 0.8,   // BW (0 extras)
    intermediate: 1.0, // +25% BW
    advanced: 1.2,   // +50% BW
  },
  squat: {
    beginner: 0.8,   // 1.0× BW (ajustado)
    intermediate: 1.2, // 1.5× BW
    advanced: 1.6,   // 2.0× BW
  },
  deadlift: {
    beginner: 0.96,  // 1.2× BW
    intermediate: 1.44, // 1.8× BW
    advanced: 2.0,   // 2.5× BW
  },
  dips: {
    beginner: 0.88,  // 110% de bench beginner
    intermediate: 1.32, // 110% de bench intermediate
    advanced: 1.65,  // 110% de bench advanced
  },
  tricep_extension: {
    beginner: 0.16,  // 20% de bench beginner
    intermediate: 0.24, // 20% de bench intermediate
    advanced: 0.3,   // 20% de bench advanced
  },
  face_pull: {
    beginner: 0.08,  // 10% de bench (resistencia)
    intermediate: 0.1, // 12.5% de bench
    advanced: 0.12,  // 15% de bench
  },
};

/**
 * Ratios ideales de balance (vs Press de Banca = 100%)
 * Usado para comparación de equilibrio muscular
 */
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
  dips: { min: 1.1, max: 1.2 },
  tricep_extension: { min: 0.18, max: 0.22 },
  face_pull: { min: 0.08, max: 0.12 },
};

/**
 * Labels para mostrar en UI
 */
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

/**
 * Umbrales de deficiencia
 */
export const DEFICIENCY_THRESHOLD = -15; // -15% o más = crítico

/**
 * Umbral de alerta de desequilibrio escapular
 * Si tracción es 20% menor que empuje → ALERTA CRÍTICA
 */
export const SCAPULAR_IMBALANCE_THRESHOLD = -20;

/**
 * Mapeo de niveles a labels en español
 */
export const LEVEL_LABELS: Record<Level | StrengthLevel, string> = {
  beginner: 'Principiante',
  novice: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
  elite: 'Élite',
};

/**
 * Colores de Tailwind para cada nivel
 */
export const LEVEL_COLORS: Record<Level | StrengthLevel, string> = {
  beginner: 'text-slate-600 bg-slate-100',
  novice: 'text-slate-600 bg-slate-100',
  intermediate: 'text-blue-600 bg-blue-100',
  advanced: 'text-purple-600 bg-purple-100',
  elite: 'text-amber-600 bg-amber-100',
};
