import type { ExerciseId, StrengthMetrics } from '../types/domain';
import { formatExercise } from '../utils/calculators';

interface ExerciseFormProps {
  metrics: StrengthMetrics[];
  availableExercises: { id: ExerciseId; label: string }[];
  onChange: (exerciseId: ExerciseId, field: 'weightKg' | 'reps', value: number) => void;
  onAdd: (exerciseId: ExerciseId) => void;
  onRemove: (exerciseId: ExerciseId) => void;
}

export function ExerciseForm({ metrics, availableExercises, onChange, onAdd, onRemove }: ExerciseFormProps) {
  return (
    <section className="space-y-3 rounded-xl border p-4 bg-white">
      <h2 className="font-semibold">Métricas de ejercicios</h2>
      {metrics.map((metric) => {
        const invalidWeight = metric.weightKg <= 0;
        const invalidReps = metric.reps <= 0;

        return (
          <div key={metric.exerciseId} className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold">{formatExercise(metric.exerciseId)}</label>
              {metric.exerciseId !== 'bench_press' && (
                <button
                  type="button"
                  className="text-xs text-red-600"
                  onClick={() => onRemove(metric.exerciseId)}
                >
                  Quitar
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-slate-600">
                Peso (kg)
                <input
                  type="number"
                  className={`mt-1 w-full rounded-lg border p-2 ${invalidWeight ? 'border-red-500' : ''}`}
                  min={1}
                  value={metric.weightKg}
                  onChange={(e) => onChange(metric.exerciseId, 'weightKg', Number(e.target.value))}
                />
                {invalidWeight && <span className="text-red-600">Debe ser &gt; 0</span>}
              </label>

              <label className="text-xs text-slate-600">
                Repeticiones
                <input
                  type="number"
                  className={`mt-1 w-full rounded-lg border p-2 ${invalidReps ? 'border-red-500' : ''}`}
                  min={1}
                  value={metric.reps}
                  onChange={(e) => onChange(metric.exerciseId, 'reps', Number(e.target.value))}
                />
                {invalidReps && <span className="text-red-600">Debe ser &gt; 0</span>}
              </label>
            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap gap-2 pt-1">
        {availableExercises.map((exercise) => (
          <button
            key={exercise.id}
            type="button"
            className="text-xs border rounded-full px-3 py-1"
            onClick={() => onAdd(exercise.id)}
          >
            + {exercise.label}
          </button>
        ))}
      </div>
    </section>
  );
}
