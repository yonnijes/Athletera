import { useEffect, useMemo, useState } from 'react';
import type {
  AssessmentResult,
  AthleteProfile,
  ExerciseId,
  StrengthMetrics,
  CrossExerciseAlert,
  AnyLevel,
} from '../types/domain';
import { PIVOT_EXERCISE } from '../constants/ratios';
import {
  assessMetrics,
  estimate1RM,
  detectCrossExerciseImbalance,
  detectScapularImbalance,
  calculateTarget1RM,
  formatExercise,
  formatLevel,
} from '../utils/calculators';
import { BW_STANDARDS } from '../constants/ratios';

export type ViewMode = 'simple' | 'comparative';

export interface DiagnosticCard {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  body: string;
  risks: string[];
  actions: string[];
}

export interface GhostProfile {
  exercise: ExerciseId;
  target1RM: number;
  targetLevel: AnyLevel;
  current1RM: number;
  gap: number;
  gapPercentage: number;
}

export interface UseStrengthLogicResult {
  profile: AthleteProfile;
  metrics: StrengthMetrics[];
  results: AssessmentResult[];
  errors: string[];
  canAssess: boolean;
  pivot1RM: number | null;
  
  // Modo de visualización
  viewMode: ViewMode;
  targetLevel: AnyLevel;
  setViewMode: (mode: ViewMode) => void;
  setTargetLevel: (level: AnyLevel) => void;
  
  // Ghost Profile (Modo Comparativo)
  ghostProfile: GhostProfile[] | null;
  
  // Alertas y Diagnóstico
  crossExerciseAlerts: CrossExerciseAlert[];
  diagnosticCard: DiagnosticCard | null;
  
  // Acciones
  updateProfile: (next: AthleteProfile) => void;
  updateMetric: (exerciseId: ExerciseId, field: 'weightKg' | 'reps' | 'implement', value: number | string) => void;
  addMetric: (exerciseId: ExerciseId) => void;
  removeMetric: (exerciseId: ExerciseId) => void;
}

const STORAGE_KEY = 'athletera:strength-state:v2';

interface PersistedState {
  profile: AthleteProfile;
  metrics: StrengthMetrics[];
  viewMode: ViewMode;
  targetLevel: AnyLevel;
}

const DEFAULT_PROFILE: AthleteProfile = {
  category: 'general_fitness',
  level: 'beginner',
};

const DEFAULT_METRICS: StrengthMetrics[] = [
  { exerciseId: 'bench_press', weightKg: 80, reps: 8, implement: 'barbell' },
  { exerciseId: 'overhead_press', weightKg: 45, reps: 6, implement: 'barbell' },
];

const isStrengthMetric = (value: unknown): value is StrengthMetrics => {
  if (!value || typeof value !== 'object') return false;
  const maybe = value as Partial<StrengthMetrics>;
  const implementValid =
    maybe.implement === undefined || maybe.implement === 'barbell' || maybe.implement === 'dumbbell';

  return (
    typeof maybe.exerciseId === 'string' &&
    typeof maybe.weightKg === 'number' &&
    Number.isFinite(maybe.weightKg) &&
    typeof maybe.reps === 'number' &&
    Number.isFinite(maybe.reps) &&
    implementValid
  );
};

const loadStoredState = (): PersistedState => {
  if (typeof window === 'undefined') {
    return { profile: DEFAULT_PROFILE, metrics: DEFAULT_METRICS, viewMode: 'simple', targetLevel: 'intermediate' };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { profile: DEFAULT_PROFILE, metrics: DEFAULT_METRICS, viewMode: 'simple', targetLevel: 'intermediate' };
    }

    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    const metrics = Array.isArray(parsed.metrics) ? parsed.metrics.filter(isStrengthMetric) : DEFAULT_METRICS;

    const profile = parsed.profile ?? DEFAULT_PROFILE;

    return {
      profile: {
        category: profile.category ?? DEFAULT_PROFILE.category,
        level: profile.level ?? DEFAULT_PROFILE.level,
        bodyWeightKg:
          typeof profile.bodyWeightKg === 'number' && Number.isFinite(profile.bodyWeightKg) && profile.bodyWeightKg > 0
            ? profile.bodyWeightKg
            : undefined,
      },
      metrics: (metrics.length > 0 ? metrics : DEFAULT_METRICS).map((metric) => ({
        ...metric,
        implement: metric.implement ?? 'barbell',
      })),
      viewMode: parsed.viewMode === 'comparative' ? 'comparative' : 'simple',
      targetLevel: (parsed.targetLevel as AnyLevel) ?? 'intermediate',
    };
  } catch {
    return { profile: DEFAULT_PROFILE, metrics: DEFAULT_METRICS, viewMode: 'simple', targetLevel: 'intermediate' };
  }
};

/**
 * Genera el Ghost Profile comparando el rendimiento actual vs el nivel objetivo
 */
function calculateGhostProfile(
  metrics: StrengthMetrics[],
  bodyWeightKg: number | undefined,
  targetLevel: AnyLevel
): GhostProfile[] | null {
  if (!bodyWeightKg || bodyWeightKg <= 0) return null;

  const pivotMetric = metrics.find((m) => m.exerciseId === 'bench_press');
  if (!pivotMetric) return null;

  return metrics.map((metric) => {
    const current1RM = estimate1RM(metric.weightKg, metric.reps);
    const target1RM = calculateTarget1RM(bodyWeightKg, metric.exerciseId, targetLevel);
    const gap = round2(target1RM - current1RM);
    const gapPercentage = current1RM > 0 ? round2((gap / current1RM) * 100) : 0;

    return {
      exercise: metric.exerciseId,
      target1RM,
      targetLevel,
      current1RM,
      gap,
      gapPercentage,
    };
  });
}

const round2 = (n: number): number => Math.round(n * 100) / 100;

/**
 * Genera un diagnóstico narrativo basado en los resultados y alertas
 */
function generateDiagnosticCard(
  results: AssessmentResult[],
  crossExerciseAlerts: CrossExerciseAlert[],
  pivot1RM: number | null,
  bodyWeightKg: number | undefined
): DiagnosticCard | null {
  if (results.length === 0 || !pivot1RM) return null;

  // Buscar el ejercicio más fuerte y el más débil
  const sortedByLevel = [...results].sort((a, b) => {
    const levelOrder: Record<AnyLevel, number> = {
      beginner: 0,
      novice: 0,
      intermediate: 1,
      advanced: 2,
      elite: 3,
    };
    return (levelOrder[b.strengthLevel || 'beginner'] || 0) - (levelOrder[a.strengthLevel || 'beginner'] || 0);
  });

  const strongestExercise = sortedByLevel[0];
  const weakestExercise = sortedByLevel[sortedByLevel.length - 1];

  // Verificar si hay alerta crítica de cross-exercise
  const criticalAlert = crossExerciseAlerts.find((a) => a.severity === 'critical');

  if (criticalAlert) {
    return {
      severity: 'critical',
      title: '🚨 Desequilibrio Crítico Detectado',
      body: `${formatExercise(criticalAlert.pushExercise)} está en nivel ${formatLevel(criticalAlert.pushLevel)}, pero ${formatExercise(criticalAlert.pullExercise)} está en nivel ${formatLevel(criticalAlert.pullLevel)}. Esta diferencia de ${criticalAlert.levelDifference} niveles es peligrosa.`,
      risks: [
        'Lesión de hombro (manguito rotador)',
        'Postura cifótica (hombros adelantados)',
        'Dolor cervical y de espalda alta',
        'Desequilibrio escapular permanente',
      ],
      actions: [
        'Priorizar tracción sobre empuje (ratio 2:1)',
        'Face Pulls diarios (3-4 × 15-20 reps)',
        'Reducir volumen de press 20-30% por 2-3 semanas',
        'Consultar con fisioterapeuta si hay dolor',
      ],
    };
  }

  // Si hay diferencia significativa entre ejercicio más fuerte y más débil
  if (strongestExercise && weakestExercise && strongestExercise.strengthLevel && weakestExercise.strengthLevel) {
    const levelOrder: Record<AnyLevel, number> = {
      beginner: 0,
      novice: 0,
      intermediate: 1,
      advanced: 2,
      elite: 3,
    };
    const levelDiff = (levelOrder[strongestExercise.strengthLevel] || 0) - (levelOrder[weakestExercise.strengthLevel] || 0);

    if (levelDiff >= 2) {
      return {
        severity: 'critical',
        title: '⚠️ Desequilibrio Muscular Importante',
        body: `Tu ${formatExercise(strongestExercise.exercise)} es de nivel ${formatLevel(strongestExercise.strengthLevel)} (${strongestExercise.current1RM} kg), pero tu ${formatExercise(weakestExercise.exercise)} es de nivel ${formatLevel(weakestExercise.strengthLevel)} (${weakestExercise.current1RM} kg).`,
        risks: [
          'Riesgo de lesión en el ejercicio más débil',
          'Limitación de progreso en ejercicios compuestos',
          'Desequilibrio postural',
        ],
        actions: [
          `Priorizar ${formatExercise(weakestExercise.exercise)} en tu rutina`,
          'Añadir 2-3 ejercicios accesorios para el grupo débil',
          'Considerar periodización ondulante',
        ],
      };
    }
  }

  // Verificar si hay múltiples deficiencias críticas
  const criticalResults = results.filter((r) => r.status === 'critical');
  if (criticalResults.length >= 2) {
    const exercises = criticalResults.map((r) => formatExercise(r.exercise)).join(', ');
    return {
      severity: 'warning',
      title: '⚡ Múltiples Deficiencias Detectadas',
      body: `Tienes deficiencias críticas en: ${exercises}. Esto indica un desbalance general que requiere atención.`,
      risks: [
        'Progreso estancado en múltiples ejercicios',
        'Alto riesgo de lesión por compensaciones',
        'Desequilibrios estructurales acumulativos',
      ],
      actions: [
        'Reducir intensidad general 10-15% por 1-2 semanas',
        'Enfocarse en técnica y volumen moderado',
        'Priorizar los ejercicios más débiles al inicio del entrenamiento',
      ],
    };
  }

  // Mensaje positivo si todo está bien
  const optimalResults = results.filter((r) => r.status === 'optimal');
  if (optimalResults.length === results.length) {
    return {
      severity: 'info',
      title: '🎉 ¡Excelente Balance Muscular!',
      body: `Todos tus ejercicios están en niveles equilibrados. Tu ${formatExercise(strongestExercise?.exercise || 'bench_press')} destaca como tu punto fuerte.`,
      risks: [],
      actions: [
        'Mantener la progresión actual',
        'Considerar aumentar ligeramente la intensidad',
        'Continuar con volumen equilibrado entre empuje y tracción',
      ],
    };
  }

  return null;
}

export function useStrengthLogic(): UseStrengthLogicResult {
  const initial = loadStoredState();
  const [profile, setProfile] = useState<AthleteProfile>(initial.profile);
  const [metrics, setMetrics] = useState<StrengthMetrics[]>(initial.metrics);
  const [viewMode, setViewMode] = useState<ViewMode>(initial.viewMode);
  const [targetLevel, setTargetLevel] = useState<AnyLevel>(initial.targetLevel);

  const pivot1RM = useMemo(() => {
    const pivot = metrics.find((m) => m.exerciseId === PIVOT_EXERCISE);
    if (!pivot) return null;
    try {
      return estimate1RM(pivot.weightKg, pivot.reps);
    } catch {
      return null;
    }
  }, [metrics]);

  const errors = useMemo(() => {
    const list: string[] = [];

    if (!metrics.some((m) => m.exerciseId === PIVOT_EXERCISE)) {
      list.push('El ejercicio pivot (Press de Banca) es obligatorio.');
    }

    if (metrics.length < 2) {
      list.push('Debes ingresar al menos dos ejercicios para comparar.');
    }

    for (const metric of metrics) {
      if (metric.weightKg <= 0) {
        list.push(`${metric.exerciseId}: el peso debe ser mayor a 0.`);
      }
      if (metric.reps <= 0) {
        list.push(`${metric.exerciseId}: las repeticiones deben ser mayores a 0.`);
      }
    }

    return list;
  }, [metrics]);

  const results = useMemo(() => {
    if (errors.length > 0) return [] as AssessmentResult[];
    try {
      return assessMetrics(metrics, profile.bodyWeightKg);
    } catch {
      return [] as AssessmentResult[];
    }
  }, [metrics, errors, profile.bodyWeightKg]);

  // Calcular Ghost Profile (Modo Comparativo)
  const ghostProfile = useMemo(() => {
    if (viewMode !== 'comparative') return null;
    return calculateGhostProfile(metrics, profile.bodyWeightKg, targetLevel);
  }, [viewMode, targetLevel, metrics, profile.bodyWeightKg]);

  // Detectar alertas cross-ejercicio
  const crossExerciseAlerts = useMemo(() => {
    if (!profile.bodyWeightKg) return [];
    return detectCrossExerciseImbalance(results);
  }, [results, profile.bodyWeightKg]);

  // Generar diagnóstico narrativo
  const diagnosticCard = useMemo(() => {
    return generateDiagnosticCard(results, crossExerciseAlerts, pivot1RM, profile.bodyWeightKg);
  }, [results, crossExerciseAlerts, pivot1RM, profile.bodyWeightKg]);

  const updateMetric = (
    exerciseId: ExerciseId,
    field: 'weightKg' | 'reps' | 'implement',
    value: number | string
  ) => {
    setMetrics((prev) =>
      prev.map((m) =>
        m.exerciseId === exerciseId
          ? {
              ...m,
              [field]: field === 'implement' ? (value as 'barbell' | 'dumbbell') : Number(value),
            }
          : m
      )
    );
  };

  const addMetric = (exerciseId: ExerciseId) => {
    setMetrics((prev) => {
      if (prev.some((m) => m.exerciseId === exerciseId)) return prev;
      return [...prev, { exerciseId, weightKg: 1, reps: 1, implement: 'barbell' }];
    });
  };

  const removeMetric = (exerciseId: ExerciseId) => {
    if (exerciseId === PIVOT_EXERCISE) return;
    setMetrics((prev) => prev.filter((m) => m.exerciseId !== exerciseId));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const state: PersistedState = { profile, metrics, viewMode, targetLevel };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [profile, metrics, viewMode, targetLevel]);

  return {
    profile,
    metrics,
    results,
    errors,
    canAssess: errors.length === 0,
    pivot1RM,
    
    // Modo de visualización
    viewMode,
    targetLevel,
    setViewMode,
    setTargetLevel,
    
    // Ghost Profile
    ghostProfile,
    
    // Alertas y Diagnóstico
    crossExerciseAlerts,
    diagnosticCard,
    
    // Acciones
    updateProfile: setProfile,
    updateMetric,
    addMetric,
    removeMetric,
  };
}
