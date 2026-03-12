import type { ExerciseId, StrengthMetrics } from '../types/domain';
import { formatExercise } from '../utils/calculators';

/**
 * Ejercicios de autocarga donde el peso mostrado es el lastre (no incluye peso corporal)
 */
const BODYWEIGHT_EXERCISES: ExerciseId[] = ['weighted_pull_up', 'dips'];

/**
 * Verifica si un ejercicio es de autocarga
 */
function isBodyweightExercise(exerciseId: ExerciseId): boolean {
  return BODYWEIGHT_EXERCISES.includes(exerciseId);
}

interface ExerciseFormProps {
  metrics: StrengthMetrics[];
  availableExercises: { id: ExerciseId; label: string }[];
  onChange: (exerciseId: ExerciseId, field: 'weightKg' | 'reps', value: number) => void;
  onAdd: (exerciseId: ExerciseId) => void;
  onRemove: (exerciseId: ExerciseId) => void;
}

export function ExerciseForm({ metrics, availableExercises, onChange, onAdd, onRemove }: ExerciseFormProps) {
  return (
    <section className="space-y-3 rounded-xl border p-4 bg-white" aria-labelledby="exercise-form-title">
      <h2 id="exercise-form-title" className="font-semibold">Métricas de ejercicios</h2>
      <p className="text-xs text-slate-500">
        El Press de Banca es obligatorio como referencia. Agrega al menos un ejercicio más.
      </p>

      <div className="space-y-4" role="list">
        {metrics.map((metric) => {
          const invalidWeight = metric.weightKg <= 0;
          const invalidReps = metric.reps <= 0;
          const weightId = `weight-${metric.exerciseId}`;
          const repsId = `reps-${metric.exerciseId}`;

          return (
            <div key={metric.exerciseId} className="rounded-lg border p-3" role="listitem">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={weightId} className="text-sm font-semibold">
                  {formatExercise(metric.exerciseId)}
                  {metric.exerciseId === 'bench_press' && (
                    <span className="ml-2 text-xs text-sky-600 font-normal">(Obligatorio)</span>
                  )}
                </label>
                {metric.exerciseId !== 'bench_press' && (
                  <button
                    type="button"
                    className="text-xs text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
                    onClick={() => onRemove(metric.exerciseId)}
                    aria-label={`Quitar ${formatExercise(metric.exerciseId)}`}
                  >
                    Quitar
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={weightId} className="text-xs text-slate-600">
                    {isBodyweightExercise(metric.exerciseId) ? 'Lastre (kg)' : 'Peso (kg)'}
                    {isBodyweightExercise(metric.exerciseId) && (
                      <span className="block text-[10px] text-amber-600 mt-0.5">
                        💡 Se suma tu peso corporal automáticamente
                      </span>
                    )}
                  </label>
                  <input
                    id={weightId}
                    type="number"
                    min={1}
                    max={500}
                    className={`mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none ${
                      invalidWeight ? 'border-red-500' : ''
                    }`}
                    value={metric.weightKg}
                    onChange={(e) => onChange(metric.exerciseId, 'weightKg', Number(e.target.value))}
                    aria-invalid={invalidWeight}
                    aria-describedby={invalidWeight ? `${weightId}-error` : undefined}
                  />
                  {invalidWeight && (
                    <span id={`${weightId}-error`} className="text-red-600 text-xs" role="alert">
                      Debe ser &gt; 0
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor={repsId} className="text-xs text-slate-600">
                    Repeticiones
                  </label>
                  <input
                    id={repsId}
                    type="number"
                    min={1}
                    max={100}
                    className={`mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none ${
                      invalidReps ? 'border-red-500' : ''
                    }`}
                    value={metric.reps}
                    onChange={(e) => onChange(metric.exerciseId, 'reps', Number(e.target.value))}
                    aria-invalid={invalidReps}
                    aria-describedby={invalidReps ? `${repsId}-error` : undefined}
                  />
                  {invalidReps && (
                    <span id={`${repsId}-error`} className="text-red-600 text-xs" role="alert">
                      Debe ser &gt; 0
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Agregar ejercicios">
        {availableExercises.map((exercise) => (
          <button
            key={exercise.id}
            type="button"
            className="text-xs border rounded-full px-3 py-1 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            onClick={() => onAdd(exercise.id)}
            aria-label={`Agregar ${exercise.label}`}
          >
            + {exercise.label}
          </button>
        ))}
      </div>
    </section>
  );
}
