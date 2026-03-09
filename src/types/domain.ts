export type AthleteCategory = 'powerlifting' | 'football' | 'general_fitness' | 'running';
export type AthleteLevel = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseId =
  | 'bench_press'
  | 'overhead_press'
  | 'barbell_row'
  | 'weighted_pull_up'
  | 'squat'
  | 'deadlift';

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
}
