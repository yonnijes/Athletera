import type { ExerciseId, StrengthMetrics } from '../types/domain';
import { formatExercise } from '../utils/calculators';

/**
 * Ejercicios de autocarga donde el peso mostrado es el lastre (no incluye peso corporal)
 */
const BODYWEIGHT_EXERCISES: ExerciseId[] = ['weighted_pull_up', 'dips'];

/**
 * Ejercicios donde aplica el selector de implemento (barra vs mancuerna)
 */
const IMPLEMENT_EXERCISES: ExerciseId[] = [
  'bench_press',
  'overhead_press',
  'barbell_row',
  'squat',
  'deadlift',
  'tricep_extension',
];

/**
 * Verifica si un ejercicio es de autocarga
 */
function isBodyweightExercise(exerciseId: ExerciseId): boolean {
  return BODYWEIGHT_EXERCISES.includes(exerciseId);
}

/**
 * Verifica si un ejercicio admite selector de implemento
 */
function hasImplementToggle(exerciseId: ExerciseId): boolean {
  return IMPLEMENT_EXERCISES.includes(exerciseId);
}

interface ExerciseFormProps {
  metrics: StrengthMetrics[];
  availableExercises: { id: ExerciseId; label: string }[];
  onChange: (exerciseId: ExerciseId, field: 'weightKg' | 'reps' | 'implement', value: number | string) => void;
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

              {hasImplementToggle(metric.exerciseId) && !isBodyweightExercise(metric.exerciseId) && (
                <div className="mb-3">
                  <div className="flex items-center gap-2" role="radiogroup" aria-label="Implemento">
                    <span className="text-xs text-slate-600">Implemento:</span>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={(metric.implement ?? 'barbell') === 'barbell'}
                      onClick={() => onChange(metric.exerciseId, 'implement', 'barbell')}
                      className={`min-h-[44px] px-3 py-2 rounded-md text-xs font-medium border transition-all ${
                        (metric.implement ?? 'barbell') === 'barbell'
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-white text-slate-600 border-slate-300'
                      }`}
                    >
                      Barra
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={metric.implement === 'dumbbell'}
                      onClick={() => onChange(metric.exerciseId, 'implement', 'dumbbell')}
                      className={`min-h-[44px] px-3 py-2 rounded-md text-xs font-medium border transition-all ${
                        metric.implement === 'dumbbell'
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-white text-slate-600 border-slate-300'
                      }`}
                    >
                      Mancuerna
                    </button>
                  </div>
                  {metric.implement === 'dumbbell' && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      Ingresa el peso por mancuerna (por lado). Se multiplica ×2 y se aplica -10% por estabilidad.
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={weightId} className="text-xs text-slate-600">
                    {isBodyweightExercise(metric.exerciseId) ? 'Lastre (kg)' : 'Peso (kg)'}
                  </label>
                  <input
                    id={weightId}
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    min={1}
                    max={500}
                    className={`mt-1 w-full rounded-lg border p-4 text-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none ${
                      invalidWeight ? 'border-red-500' : ''
                    }`}
                    value={metric.weightKg}
                    onChange={(e) => onChange(metric.exerciseId, 'weightKg', Number(e.target.value))}
                    aria-invalid={invalidWeight}
                    aria-describedby={invalidWeight ? `${weightId}-error` : undefined}
                  />
                  {isBodyweightExercise(metric.exerciseId) && (
                    <span className="block text-[10px] text-amber-600 mt-1">
                      💡 Se suma tu peso corporal automáticamente
                    </span>
                  )}
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
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min={1}
                    max={100}
                    className={`mt-1 w-full rounded-lg border p-4 text-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none ${
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
