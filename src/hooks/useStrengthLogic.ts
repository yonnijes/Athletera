import { useEffect, useMemo, useState } from 'react';
import type { AssessmentResult, AthleteProfile, ExerciseId, StrengthMetrics } from '../types/domain';
import { PIVOT_EXERCISE } from '../constants/ratios';
import { assessMetrics, estimate1RM } from '../utils/calculators';

export interface UseStrengthLogicResult {
  profile: AthleteProfile;
  metrics: StrengthMetrics[];
  results: AssessmentResult[];
  errors: string[];
  canAssess: boolean;
  pivot1RM: number | null;
  updateProfile: (next: AthleteProfile) => void;
  updateMetric: (exerciseId: ExerciseId, field: 'weightKg' | 'reps', value: number) => void;
  addMetric: (exerciseId: ExerciseId) => void;
  removeMetric: (exerciseId: ExerciseId) => void;
}

const STORAGE_KEY = 'athletera:strength-state:v2';

interface PersistedState {
  profile: AthleteProfile;
  metrics: StrengthMetrics[];
}

const DEFAULT_PROFILE: AthleteProfile = {
  category: 'general_fitness',
  level: 'beginner',
};

const DEFAULT_METRICS: StrengthMetrics[] = [
  { exerciseId: 'bench_press', weightKg: 80, reps: 8 },
  { exerciseId: 'overhead_press', weightKg: 45, reps: 6 },
];

const isStrengthMetric = (value: unknown): value is StrengthMetrics => {
  if (!value || typeof value !== 'object') return false;
  const maybe = value as Partial<StrengthMetrics>;
  return (
    typeof maybe.exerciseId === 'string' &&
    typeof maybe.weightKg === 'number' &&
    Number.isFinite(maybe.weightKg) &&
    typeof maybe.reps === 'number' &&
    Number.isFinite(maybe.reps)
  );
};

const loadStoredState = (): PersistedState => {
  if (typeof window === 'undefined') return { profile: DEFAULT_PROFILE, metrics: DEFAULT_METRICS };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { profile: DEFAULT_PROFILE, metrics: DEFAULT_METRICS };

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
      metrics: metrics.length > 0 ? metrics : DEFAULT_METRICS,
    };
  } catch {
    return { profile: DEFAULT_PROFILE, metrics: DEFAULT_METRICS };
  }
};

export function useStrengthLogic(): UseStrengthLogicResult {
  const initial = loadStoredState();
  const [profile, setProfile] = useState<AthleteProfile>(initial.profile);
  const [metrics, setMetrics] = useState<StrengthMetrics[]>(initial.metrics);

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
      return assessMetrics(metrics);
    } catch {
      return [] as AssessmentResult[];
    }
  }, [metrics, errors]);

  const updateMetric = (exerciseId: ExerciseId, field: 'weightKg' | 'reps', value: number) => {
    setMetrics((prev) => prev.map((m) => (m.exerciseId === exerciseId ? { ...m, [field]: value } : m)));
  };

  const addMetric = (exerciseId: ExerciseId) => {
    setMetrics((prev) => {
      if (prev.some((m) => m.exerciseId === exerciseId)) return prev;
      return [...prev, { exerciseId, weightKg: 1, reps: 1 }];
    });
  };

  const removeMetric = (exerciseId: ExerciseId) => {
    if (exerciseId === PIVOT_EXERCISE) return;
    setMetrics((prev) => prev.filter((m) => m.exerciseId !== exerciseId));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const state: PersistedState = { profile, metrics };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [profile, metrics]);

  return {
    profile,
    metrics,
    results,
    errors,
    canAssess: errors.length === 0,
    pivot1RM,
    updateProfile: setProfile,
    updateMetric,
    addMetric,
    removeMetric,
  };
}
