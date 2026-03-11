import {
  DEFICIENCY_THRESHOLD,
  EXERCISE_LABELS,
  IDEAL_RATIO_RANGES,
  PIVOT_EXERCISE,
  BW_STANDARDS,
  LEVEL_LABELS,
  SCAPULAR_IMBALANCE_THRESHOLD,
  type Level,
  type RatioRange,
} from '../constants/ratios';
import {
  STRENGTH_STANDARDS,
  PUSH_EXERCISES,
  PULL_EXERCISES,
  ENDURANCE_EXERCISES,
} from '../constants/strengthStandards';
import type {
  AssessmentResult,
  ExerciseId,
  StrengthMetrics,
  StrengthLevel,
  CrossExerciseAlert,
  MovementPattern,
  AnyLevel,
} from '../types/domain';

const round2 = (n: number): number => Math.round(n * 100) / 100;

/**
 * Fórmula de Epley para estimar 1RM
 * 1RM = peso × (1 + reps / 30)
 */
export function estimate1RM(weightKg: number, reps: number): number {
  if (!Number.isFinite(weightKg) || !Number.isFinite(reps)) {
    throw new Error('weightKg y reps deben ser números finitos.');
  }
  if (weightKg <= 0) throw new Error('weightKg debe ser mayor que 0.');
  if (reps <= 0) throw new Error('reps debe ser mayor que 0.');

  return round2(weightKg * (1 + reps / 30));
}

/**
 * Calcula la fuerza relativa (1RM / peso corporal)
 */
export function calculateRelativeStrength(oneRM: number, bodyWeightKg: number): number {
  if (bodyWeightKg <= 0) throw new Error('bodyWeightKg debe ser mayor que 0.');
  return round2(oneRM / bodyWeightKg);
}

/**
 * Determina el nivel actual basado en la fuerza relativa
 * Compara contra la matriz BW_STANDARDS
 */
export function determineCurrentLevel(
  relativeStrength: number,
  exerciseId: ExerciseId
): { level: AnyLevel; progress: number } {
  const standard = BW_STANDARDS[exerciseId];
  if (!standard) {
    return { level: 'beginner', progress: 0 };
  }

  // Determinar nivel basado en umbrales
  if (relativeStrength >= standard.advanced) {
    const progress = Math.min(100, ((relativeStrength - standard.advanced) / standard.advanced) * 100);
    return { level: 'advanced', progress: round2(progress) };
  }
  if (relativeStrength >= standard.intermediate) {
    const progress = ((relativeStrength - standard.intermediate) / (standard.advanced - standard.intermediate)) * 100;
    return { level: 'intermediate', progress: round2(progress) };
  }
  if (relativeStrength >= standard.beginner) {
    const progress = ((relativeStrength - standard.beginner) / (standard.intermediate - standard.beginner)) * 100;
    return { level: 'beginner', progress: round2(progress) };
  }

  // Por debajo de beginner
  const progress = (relativeStrength / standard.beginner) * 100;
  return { level: 'beginner', progress: round2(progress) };
}

/**
 * Calcula el 1RM objetivo para un nivel dado
 */
export function calculateTarget1RM(
  bodyWeightKg: number,
  exerciseId: ExerciseId,
  targetLevel: AnyLevel
): number {
  const standard = BW_STANDARDS[exerciseId];
  if (!standard) return 0;

  let multiplier: number;
  switch (targetLevel) {
    case 'advanced':
    case 'elite':
      multiplier = standard.advanced;
      break;
    case 'intermediate':
      multiplier = standard.intermediate;
      break;
    default:
      multiplier = standard.beginner;
  }

  return round2(bodyWeightKg * multiplier);
}

export function computeCurrentRatio(current1RM: number, pivot1RM: number): number {
  if (pivot1RM <= 0) throw new Error('pivot1RM debe ser mayor que 0.');
  return round2(current1RM / pivot1RM);
}

export function getMidIdealRatio(exerciseId: ExerciseId): number | null {
  const range = IDEAL_RATIO_RANGES[exerciseId];
  if (!range) return null;
  return (range.min + range.max) / 2;
}

export function computeDeviationPct(actualRatio: number, idealRatio: number): number {
  if (idealRatio <= 0) throw new Error('idealRatio debe ser mayor que 0.');
  return round2(((actualRatio - idealRatio) / idealRatio) * 100);
}

export function classifyStatus(deviationPct: number): 'optimal' | 'warning' | 'critical' {
  if (deviationPct <= DEFICIENCY_THRESHOLD) return 'critical';
  if (deviationPct < -5) return 'warning';
  return 'optimal';
}

/**
 * Evalúa el test de resistencia para Face Pulls
 */
export function evaluateEnduranceTest(
  weightKg: number,
  reps: number,
  bench1RM: number,
  targetReps: number = 15,
  targetPercentage: number = 0.1
): { passed: boolean; actualPercentage: number; equivalent1RM: number } {
  const actualPercentage = weightKg / bench1RM;
  const passed = reps >= targetReps && actualPercentage >= targetPercentage;
  const equivalent1RM = estimate1RM(weightKg, reps);
  return { passed, actualPercentage: round2(actualPercentage), equivalent1RM };
}

export function buildRecommendation(
  exerciseId: ExerciseId,
  status: 'optimal' | 'warning' | 'critical',
  strengthLevel?: AnyLevel
): string {
  if (status === 'optimal') {
    if (strengthLevel === 'elite' || strengthLevel === 'advanced') {
      return '¡Nivel avanzado/élite! Considera competir o especializarte.';
    }
    return 'Mantener progresión y técnica actual.';
  }

  const levelAdvice: Record<AnyLevel, string> = {
    beginner: 'Enfocarse en técnica y consistencia antes de aumentar carga.',
    novice: 'Enfocarse en técnica y consistencia antes de aumentar carga.',
    intermediate: 'Priorizar sobrecarga progresiva en este patrón.',
    advanced: 'Revisar periodización y recuperación específica.',
    elite: 'Mantener picos de fuerza y prevenir sobreentrenamiento.',
  };

  const exerciseAdvice: Partial<Record<ExerciseId, string>> = {
    overhead_press: 'Aumentar trabajo de hombro/estabilidad escapular (Face Pulls, Press Arnold).',
    barbell_row: 'Priorizar tracción horizontal (remo con pausa, control excéntrico).',
    weighted_pull_up: 'Mejorar tracción vertical (dominadas estrictas y trabajo de dorsales).',
    squat: 'Elevar fuerza de tren inferior (sentadilla frontal, tempo squats).',
    deadlift: 'Reforzar cadena posterior (RDL, hip thrust, bisagra técnica).',
    dips: 'Fortalecer tríceps y hombro inferior (fondos asistidos, press cerrado).',
    tricep_extension: 'El tríceps puede estar limitando tu press. Aislar con press francés y extensiones.',
    face_pull: 'CRÍTICO: Mejorar resistencia del manguito rotador para prevenir lesiones de hombro.',
  };

  const levelTip = levelAdvice[strengthLevel || 'beginner'];
  const exerciseTip = exerciseAdvice[exerciseId];

  return exerciseTip ? `${levelTip} ${exerciseTip}` : levelTip;
}

/**
 * Calcula el nivel numérico para comparar diferencias entre niveles
 */
function strengthLevelToNumber(level: AnyLevel): number {
  switch (level) {
    case 'beginner':
    case 'novice': return 0;
    case 'intermediate': return 1;
    case 'advanced': return 2;
    case 'elite': return 3;
  }
}

/**
 * Detecta desequilibrios críticos entre ejercicios de empuje y tracción
 * ALERTA CRÍTICA si la diferencia es >= 2 niveles
 */
export function detectCrossExerciseImbalance(
  results: AssessmentResult[]
): CrossExerciseAlert[] {
  const alerts: CrossExerciseAlert[] = [];

  const pushResults = results.filter((r) =>
    PUSH_EXERCISES.includes(r.exercise) || r.exercise === PIVOT_EXERCISE
  );
  const pullResults = results.filter((r) => PULL_EXERCISES.includes(r.exercise));

  for (const push of pushResults) {
    for (const pull of pullResults) {
      if (!push.strengthLevel || !pull.strengthLevel) continue;

      const pushLevelNum = strengthLevelToNumber(push.strengthLevel);
      const pullLevelNum = strengthLevelToNumber(pull.strengthLevel);
      const levelDifference = pushLevelNum - pullLevelNum;

      // Alerta crítica si la diferencia es >= 2 niveles
      if (levelDifference >= 2) {
        alerts.push({
          type: 'push_pull_imbalance',
          severity: 'critical',
          pushExercise: push.exercise,
          pullExercise: pull.exercise,
          pushLevel: push.strengthLevel,
          pullLevel: pull.strengthLevel,
          levelDifference,
          message: `🚨 ALERTA CRÍTICA: Desequilibrio peligroso entre ${formatExercise(push.exercise)} (${LEVEL_LABELS[push.strengthLevel]}) y ${formatExercise(pull.exercise)} (${LEVEL_LABELS[pull.strengthLevel]}). Riesgo de lesión de hombro. Priorizar tracción.`,
        });
      } else if (levelDifference === 1) {
        alerts.push({
          type: 'push_pull_imbalance',
          severity: 'warning',
          pushExercise: push.exercise,
          pullExercise: pull.exercise,
          pushLevel: push.strengthLevel,
          pullLevel: pull.strengthLevel,
          levelDifference,
          message: `⚡ Advertencia: ${formatExercise(push.exercise)} está un nivel por encima de ${formatExercise(pull.exercise)}. Considerar equilibrar volumen de tracción.`,
        });
      }
    }
  }

  return alerts;
}

/**
 * Detecta riesgo de desequilibrio escapular
 * Si el ratio de tracción es 20% menor que el de empuje → ALERTA
 */
export function detectScapularImbalance(
  push1RM: number,
  pull1RM: number
): { hasImbalance: boolean; deviation: number } {
  const ratio = pull1RM / push1RM;
  const deviation = round2((ratio - 1) * 100); // Porcentaje de diferencia
  
  // Si pull es 20% menor que push → deviation <= -20
  const hasImbalance = deviation <= SCAPULAR_IMBALANCE_THRESHOLD;
  
  return { hasImbalance, deviation };
}

export function assessMetrics(
  metrics: StrengthMetrics[],
  bodyWeightKg?: number
): AssessmentResult[] {
  if (metrics.length < 2) throw new Error('Debes ingresar al menos dos ejercicios para comparar.');

  const pivotMetric = metrics.find((m) => m.exerciseId === PIVOT_EXERCISE);
  if (!pivotMetric) throw new Error('El ejercicio pivot (Press de Banca) es obligatorio.');

  const pivot1RM = estimate1RM(pivotMetric.weightKg, pivotMetric.reps);

  return metrics
    .filter((m) => m.exerciseId !== PIVOT_EXERCISE)
    .map((metric) => {
      // Manejo especial para ejercicios de resistencia (face_pull)
      let current1RM: number;
      let statusOverride: 'optimal' | 'warning' | 'critical' | undefined;
      let recommendationOverride: string | undefined;

      if (ENDURANCE_EXERCISES.includes(metric.exerciseId)) {
        const enduranceResult = evaluateEnduranceTest(
          metric.weightKg,
          metric.reps,
          pivot1RM,
          15,
          0.1
        );
        current1RM = enduranceResult.equivalent1RM;
        
        if (!enduranceResult.passed) {
          statusOverride = 'critical';
          recommendationOverride = `CRÍTICO: No completaste 15 reps con ${metric.weightKg} kg (${(enduranceResult.actualPercentage * 100).toFixed(0)}% del bench). El manguito rotador necesita trabajo de resistencia urgente para prevenir lesiones.`;
        }
      } else {
        current1RM = estimate1RM(metric.weightKg, metric.reps);
      }

      const actualRatio = computeCurrentRatio(current1RM, pivot1RM);
      const idealRatio = getMidIdealRatio(metric.exerciseId);

      // Calcular nivel de fuerza si hay peso corporal
      let strengthLevel: Level | StrengthLevel | undefined;
      let levelProgress: number | undefined;
      let relativeRatio: number | undefined;

      if (bodyWeightKg && bodyWeightKg > 0) {
        relativeRatio = calculateRelativeStrength(current1RM, bodyWeightKg);
        const levelData = determineCurrentLevel(relativeRatio, metric.exerciseId);
        strengthLevel = levelData.level;
        levelProgress = levelData.progress;
      }

      const movementPattern = STRENGTH_STANDARDS[metric.exerciseId]?.movementPattern;

      if (!idealRatio) {
        return {
          exercise: metric.exerciseId,
          current1RM,
          target1RM: 0,
          percentageEfficiency: 0,
          status: 'warning',
          recommendation: 'No existe ratio ideal configurado para este ejercicio.',
          strengthLevel,
          levelProgress,
          relativeRatio,
          movementPattern,
        } satisfies AssessmentResult;
      }

      const target1RM = round2(pivot1RM * idealRatio);
      const percentageEfficiency = round2((actualRatio / idealRatio) * 100);
      const deviation = computeDeviationPct(actualRatio, idealRatio);
      const status = statusOverride ?? classifyStatus(deviation);
      const recommendation = recommendationOverride ?? buildRecommendation(metric.exerciseId, status, strengthLevel);

      return {
        exercise: metric.exerciseId,
        current1RM,
        target1RM,
        percentageEfficiency,
        status,
        recommendation,
        strengthLevel,
        levelProgress,
        relativeRatio,
        movementPattern,
      } satisfies AssessmentResult;
    });
}

export const formatExercise = (exerciseId: ExerciseId): string => EXERCISE_LABELS[exerciseId];

export const formatLevel = (level: AnyLevel): string => LEVEL_LABELS[level];
