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
  lat_pulldown: {
    standard: {
      novice: 0.7,
      intermediate: 0.9,
      advanced: 1.1,
      elite: 1.3,
    },
    function: 'Tracción Vertical (Máquina)',
    movementPattern: 'pull_vertical',
  },
  bicep_curl: {
    standard: {
      novice: 0.2,
      intermediate: 0.3,
      advanced: 0.4,
      elite: 0.5,
    },
    function: 'Aislamiento de Bíceps',
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
  lunges: {
    standard: {
      novice: 0.6,
      intermediate: 0.9,
      advanced: 1.2,
      elite: 1.4,
    },
    function: 'Pierna Unilateral (Movilidad/Cadera)',
    movementPattern: 'squat',
  },
  dips: {
    standard: {
      novice: 0.88,   // 110% de bench novice (incluye peso corporal)
      intermediate: 1.32, // 110% de bench intermediate
      advanced: 1.65, // 110% de bench advanced
      elite: 1.98,
    },
    function: 'Empuje Vertical (Tríceps/Hombro Inferior)',
    movementPattern: 'push_vertical',
  },
  tricep_extension: {
    standard: {
      novice: 0.16,   // 20% de bench novice
      intermediate: 0.24, // 20% de bench intermediate
      advanced: 0.3,  // 20% de bench advanced
      elite: 0.36,
    },
    function: 'Aislamiento de Tríceps',
    movementPattern: 'push_vertical',
  },
  face_pull: {
    standard: {
      novice: 0.08,   // 10% de bench para 15 reps (resistencia)
      intermediate: 0.1, // 12.5% de bench
      advanced: 0.12, // 15% de bench
      elite: 0.15,
    },
    function: 'Salud del Manguito Rotador (Resistencia)',
    movementPattern: 'pull_horizontal',
  },
};

/**
 * Mapeo de ejercicios a patrones de movimiento para análisis cross-ejercicio
 */
export const PUSH_EXERCISES: ExerciseId[] = ['bench_press', 'overhead_press', 'dips', 'tricep_extension'];
export const PULL_EXERCISES: ExerciseId[] = [
  'barbell_row',
  'weighted_pull_up',
  'lat_pulldown',
  'bicep_curl',
  'face_pull',
];

/**
 * Ejercicios que NO usan 1RM estándar (ej: face_pull usa test de resistencia)
 */
export const ENDURANCE_EXERCISES: ExerciseId[] = ['face_pull'];

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
