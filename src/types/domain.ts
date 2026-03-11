export type AthleteCategory = 'powerlifting' | 'football' | 'general_fitness' | 'running';
export type AthleteLevel = 'beginner' | 'intermediate' | 'advanced';

export type StrengthLevel = 'novice' | 'intermediate' | 'advanced' | 'elite';

/**
 * Unified level type that accepts both Level (beginner/intermediate/advanced)
 * and StrengthLevel (novice/intermediate/advanced/elite)
 */
export type AnyLevel = 'beginner' | 'novice' | 'intermediate' | 'advanced' | 'elite';

export type MovementPattern = 'push_horizontal' | 'push_vertical' | 'pull_horizontal' | 'pull_vertical' | 'squat' | 'hinge';

export interface AthleteProfile {
  category: AthleteCategory;
  level: AthleteLevel;
  bodyWeightKg?: number;
}

export type ExerciseId =
  | 'bench_press'
  | 'overhead_press'
  | 'barbell_row'
  | 'weighted_pull_up'
  | 'squat'
  | 'deadlift'
  | 'dips'
  | 'tricep_extension'
  | 'face_pull';

export interface StrengthMetrics {
  exerciseId: ExerciseId;
  weightKg: number;
  reps: number;
}

export type AssessmentStatus = 'optimal' | 'warning' | 'critical';

export interface AssessmentResult {
  exercise: ExerciseId;
  current1RM: number;
  target1RM: number;
  percentageEfficiency: number;
  status: AssessmentStatus;
  recommendation: string;
  strengthLevel?: AnyLevel;
  levelProgress?: number;
  relativeRatio?: number; // 1RM / bodyWeight
  movementPattern?: MovementPattern;
}

export interface StrengthStandard {
  novice: number;
  intermediate: number;
  advanced: number;
  elite: number;
}

export interface ExerciseStandard {
  standard: StrengthStandard;
  function: string;
  movementPattern: MovementPattern;
}

export interface CrossExerciseAlert {
  type: 'push_pull_imbalance';
  severity: 'critical' | 'warning';
  pushExercise: ExerciseId;
  pullExercise: ExerciseId;
  pushLevel: AnyLevel;
  pullLevel: AnyLevel;
  levelDifference: number;
  message: string;
}
