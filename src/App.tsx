import { AthleteProfileForm } from './components/AthleteProfileForm';
import { ExerciseForm } from './components/ExerciseForm';
import { RadarChart } from './components/RadarChart';
import { ResultsSummary } from './components/ResultsSummary';
import { EXERCISE_LABELS } from './constants/ratios';
import { useStrengthLogic } from './hooks/useStrengthLogic';
import type { ExerciseId } from './types/domain';

const EXERCISES: { id: ExerciseId; label: string }[] = (Object.keys(EXERCISE_LABELS) as ExerciseId[]).map((id) => ({
  id,
  label: EXERCISE_LABELS[id],
}));

export default function App() {
  const {
    profile,
    metrics,
    results,
    errors,
    pivot1RM,
    updateProfile,
    updateMetric,
    addMetric,
    removeMetric,
  } = useStrengthLogic();

  const availableExercises = EXERCISES.filter((e) => !metrics.some((m) => m.exerciseId === e.id));

  return (
    <main className="mx-auto max-w-md p-4 space-y-4 bg-slate-50 min-h-screen">
      <header>
        <h1 className="text-2xl font-bold">Athletera MVP</h1>
        <p className="text-sm text-slate-600">Evaluador de balance muscular basado en 1RM (Epley).</p>
        <p className="text-xs text-slate-500 mt-1">Pivot obligatorio: Press de Banca.</p>
        {pivot1RM && <p className="text-sm mt-2">1RM Pivot: <strong>{pivot1RM} kg</strong></p>}
      </header>

      <AthleteProfileForm profile={profile} onChange={updateProfile} />

      <ExerciseForm
        metrics={metrics}
        availableExercises={availableExercises}
        onChange={updateMetric}
        onAdd={addMetric}
        onRemove={removeMetric}
      />

      {errors.length > 0 && (
        <section className="rounded-xl border border-red-200 bg-red-50 p-3">
          <h3 className="text-sm font-semibold text-red-700">Corrige lo siguiente</h3>
          <ul className="list-disc pl-5 text-sm text-red-700">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border p-4 bg-white space-y-3">
        <h2 className="font-semibold">Comparativa Ideal vs Actual</h2>
        <RadarChart results={results} />
      </section>

      <section className="rounded-xl border p-4 bg-white space-y-2">
        <h2 className="font-semibold">Resumen de diagnóstico</h2>
        <ResultsSummary results={results} />
      </section>
    </main>
  );
}
