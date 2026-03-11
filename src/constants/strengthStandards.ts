import type { ExerciseId, ExerciseStandard, MovementPattern } from '../types/domain';

/**
 * Estándares de fuerza por ejercicio.
 * Los valores representan el ratio esperado vs. peso corporal (BW).
 * 
 * Fuente: Strength Level, Starting Strength, NSCA standards
 */
export const STRENGTH_STANDARDS: Record<ExerciseId, ExerciseStandard> = {
  bench_press: {
    standard: {
      novice: 0.8,
      intermediate: 1.2,
      advanced: 1.5,
      elite: 1.8,
    },
    function: 'Empuje Horizontal (Pivote)',
    movementPattern: 'push_horizontal',
  },
  overhead_press: {
    standard: {
      novice: 0.4,    // 50% de bench novice
      intermediate: 0.72,  // 60% de bench intermediate
      advanced: 1.125, // 75% de bench advanced
      elite: 1.35,
    },
    function: 'Empuje Vertical',
    movementPattern: 'push_vertical',
  },
  barbell_row: {
    standard: {
      novice: 0.48,   // 60% de bench novice
      intermediate: 0.9,  // 75% de bench intermediate
      advanced: 1.35,  // 90% de bench advanced
      elite: 1.62,
    },
    function: 'Tracción Horizontal',
    movementPattern: 'pull_horizontal',
  },
  weighted_pull_up: {
    standard: {
      novice: 0.8,    // BW (0 extras) = ~80% del total
      intermediate: 1.0,  // +25% BW
      advanced: 1.2,  // +50% BW
      elite: 1.5,
    },
    function: 'Tracción Vertical',
    movementPattern: 'pull_vertical',
  },
  squat: {
    standard: {
      novice: 0.8,    // 1.0 x BW (pero usamos ratio vs bench)
      intermediate: 1.2,  // 1.5 x BW
      advanced: 1.6,  // 2.0 x BW
      elite: 2.0,
    },
    function: 'Cadena Anterior (Piernas)',
    movementPattern: 'squat',
  },
  deadlift: {
    standard: {
      novice: 0.96,   // 1.2 x BW
      intermediate: 1.44, // 1.8 x BW
      advanced: 2.0,  // 2.5 x BW
      elite: 2.4,
    },
    function: 'Cadena Posterior',
    movementPattern: 'hinge',
  },
};

/**
 * Mapeo de ejercicios a patrones de movimiento para análisis cross-ejercicio
 */
export const PUSH_EXERCISES: ExerciseId[] = ['bench_press', 'overhead_press'];
export const PULL_EXERCISES: ExerciseId[] = ['barbell_row', 'weighted_pull_up'];

/**
 * Determina el nivel de fuerza basado en el 1RM vs peso corporal
 */
export function determineStrengthLevel(
  oneRM: number,
  bodyWeightKg: number,
  exerciseId: ExerciseId
): { level: 'novice' | 'intermediate' | 'advanced' | 'elite'; progress: number } {
  const standard = STRENGTH_STANDARDS[exerciseId]?.standard;
  if (!standard) {
    return { level: 'novice', progress: 0 };
  }

  const ratio = oneRM / bodyWeightKg;

  // Calcular progreso hacia el próximo nivel
  if (ratio >= standard.elite) {
    return { level: 'elite', progress: Math.min(100, (ratio / standard.elite) * 100) };
  }
  if (ratio >= standard.advanced) {
    const progress = ((ratio - standard.advanced) / (standard.elite - standard.advanced)) * 100;
    return { level: 'advanced', progress };
  }
  if (ratio >= standard.intermediate) {
    const progress = ((ratio - standard.intermediate) / (standard.advanced - standard.intermediate)) * 100;
    return { level: 'intermediate', progress };
  }
  if (ratio >= standard.novice) {
    const progress = ((ratio - standard.novice) / (standard.intermediate - standard.novice)) * 100;
    return { level: 'novice', progress };
  }

  // Por debajo de novice
  const progress = (ratio / standard.novice) * 100;
  return { level: 'novice', progress };
}

/**
 * Labels para mostrar en UI
 */
export const STRENGTH_LEVEL_LABELS: Record<'novice' | 'intermediate' | 'advanced' | 'elite', string> = {
  novice: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
  elite: 'Élite',
};

export const STRENGTH_LEVEL_COLORS: Record<'novice' | 'intermediate' | 'advanced' | 'elite', string> = {
  novice: 'text-slate-600 bg-slate-100',
  intermediate: 'text-blue-600 bg-blue-100',
  advanced: 'text-purple-600 bg-purple-100',
  elite: 'text-amber-600 bg-amber-100',
};
