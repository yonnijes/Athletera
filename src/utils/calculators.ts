import {
  DEFICIENCY_THRESHOLD,
  EXERCISE_LABELS,
  IDEAL_RATIO_RANGES,
  PIVOT_EXERCISE,
} from '../constants/ratios';
import {
  STRENGTH_STANDARDS,
  determineStrengthLevel,
  STRENGTH_LEVEL_LABELS,
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
} from '../types/domain';

const round2 = (n: number): number => Math.round(n * 100) / 100;

/**
 * Evalúa el test de resistencia para Face Pulls
 * Devuelve el 1RM "equivalente" basado en poder hacer 15 reps con X% del bench
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
  // Convertir a 1RM equivalente usando Epley inverso
  const equivalent1RM = estimate1RM(weightKg, reps);
  return { passed, actualPercentage: round2(actualPercentage), equivalent1RM };
}

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

export function buildRecommendation(
  exerciseId: ExerciseId,
  status: 'optimal' | 'warning' | 'critical',
  strengthLevel?: 'novice' | 'intermediate' | 'advanced' | 'elite'
): string {
  if (status === 'optimal') {
    if (strengthLevel === 'elite') return '¡Nivel élite! Considera competir o especializarte.';
    if (strengthLevel === 'advanced') return 'Nivel avanzado. Mantener progresión y técnica.';
    return 'Mantener progresión y técnica actual.';
  }

  const levelAdvice: Partial<Record<'novice' | 'intermediate' | 'advanced' | 'elite', string>> = {
    novice: 'Enfocarse en técnica y consistencia antes de aumentar carga.',
    intermediate: 'Priorizar sobrecarga progresiva en este patrón.',
    advanced: 'Revisar periodización y recuperación específica.',
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

  const levelTip = levelAdvice[strengthLevel || 'novice'] || 'Incrementar volumen específico.';
  const exerciseTip = exerciseAdvice[exerciseId];

  return exerciseTip ? `${levelTip} ${exerciseTip}` : levelTip;
}

/**
 * Calcula el nivel numérico para comparar diferencias entre niveles
 */
function strengthLevelToNumber(level: StrengthLevel): number {
  switch (level) {
    case 'novice': return 0;
    case 'intermediate': return 1;
    case 'advanced': return 2;
    case 'elite': return 3;
  }
}

/**
 * Detecta desequilibrios críticos entre ejercicios de empuje y tracción
 */
export function detectCrossExerciseImbalance(
  results: AssessmentResult[]
): CrossExerciseAlert[] {
  const alerts: CrossExerciseAlert[] = [];

  // Obtener ejercicios de empuje y tracción con sus niveles
  const pushResults = results.filter((r) =>
    PUSH_EXERCISES.includes(r.exercise) || r.exercise === PIVOT_EXERCISE
  );
  const pullResults = results.filter((r) => PULL_EXERCISES.includes(r.exercise));

  // Comparar cada par push-pull
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
          message: `⚠️ ALERTA CRÍTICA: Desequilibrio peligroso entre ${formatExercise(push.exercise)} (${STRENGTH_LEVEL_LABELS[push.strengthLevel]}) y ${formatExercise(pull.exercise)} (${STRENGTH_LEVEL_LABELS[pull.strengthLevel]}). Riesgo de lesión de hombro. Priorizar tracción.`,
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
        // Para face_pull, evaluamos el test de resistencia
        const enduranceResult = evaluateEnduranceTest(
          metric.weightKg,
          metric.reps,
          pivot1RM,
          15, // target reps
          0.1 // 10% del bench
        );
        current1RM = enduranceResult.equivalent1RM;
        
        // Si no pasa el test de resistencia, marcar como crítico
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
      let strengthLevel: 'novice' | 'intermediate' | 'advanced' | 'elite' | undefined;
      let levelProgress: number | undefined;
      let relativeRatio: number | undefined;

      if (bodyWeightKg && bodyWeightKg > 0) {
        const levelData = determineStrengthLevel(current1RM, bodyWeightKg, metric.exerciseId);
        strengthLevel = levelData.level;
        levelProgress = round2(levelData.progress);
        relativeRatio = round2(current1RM / bodyWeightKg);
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

export const formatStrengthLevel = (
  level: 'novice' | 'intermediate' | 'advanced' | 'elite'
): string => STRENGTH_LEVEL_LABELS[level];
