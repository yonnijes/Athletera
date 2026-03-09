import { useMemo, useState } from 'react';
import type { AssessmentResult, ExerciseId, StrengthMetrics } from '../types/domain';
import { PIVOT_EXERCISE } from '../constants/ratios';
import { assessMetrics, estimate1RM } from '../utils/calculators';

export interface UseStrengthLogicResult {
  metrics: StrengthMetrics[];
  results: AssessmentResult[];
  error: string | null;
  canAssess: boolean;
  pivot1RM: number | null;
  updateMetric: (exerciseId: ExerciseId, field: 'weightKg' | 'reps', value: number) => void;
  addMetric: (exerciseId: ExerciseId) => void;
  removeMetric: (exerciseId: ExerciseId) => void;
}

export function useStrengthLogic(initialMetrics?: StrengthMetrics[]): UseStrengthLogicResult {
  const [metrics, setMetrics] = useState<StrengthMetrics[]>(
    initialMetrics ?? [
      { exerciseId: 'bench_press', weightKg: 80, reps: 8 },
      { exerciseId: 'overhead_press', weightKg: 45, reps: 6 },
    ],
  );

  const pivot1RM = useMemo(() => {
    const pivot = metrics.find((m) => m.exerciseId === PIVOT_EXERCISE);
    if (!pivot) return null;
    try {
      return estimate1RM(pivot.weightKg, pivot.reps);
    } catch {
      return null;
    }
  }, [metrics]);

  const { results, error } = useMemo(() => {
    try {
      return { results: assessMetrics(metrics), error: null };
    } catch (e) {
      return { results: [] as AssessmentResult[], error: e instanceof Error ? e.message : 'Error desconocido' };
    }
  }, [metrics]);

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

  return {
    metrics,
    results,
    error,
    canAssess: metrics.length >= 2 && Boolean(metrics.find((m) => m.exerciseId === PIVOT_EXERCISE)),
    pivot1RM,
    updateMetric,
    addMetric,
    removeMetric,
  };
}
