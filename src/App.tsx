import { UpdateToast } from './components/UpdateToast';
import { ProgressStepper } from './components/ProgressStepper';
import { HowToInterpret } from './components/HowToInterpret';
import { AthleteProfileForm } from './components/AthleteProfileForm';
import { ExerciseForm } from './components/ExerciseForm';
import { RadarChart } from './components/RadarChart';
import { ResultsSummary } from './components/ResultsSummary';
import { DiagnosticCard } from './components/DiagnosticCard';
import { ViewModeToggle } from './components/ViewModeToggle';
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
    viewMode,
    targetLevel,
    ghostProfile,
    crossExerciseAlerts,
    diagnosticCard,
    updateProfile,
    updateMetric,
    addMetric,
    removeMetric,
    setViewMode,
    setTargetLevel,
    resetAll,
  } = useStrengthLogic();

  const availableExercises = EXERCISES.filter((e) => !metrics.some((m) => m.exerciseId === e.id));

  const handleReset = () => {
    if (window.confirm('¿Estás seguro? Se borrarán todos tus datos.')) {
      resetAll();
    }
  };

  return (
    <main className="app-container mx-auto max-w-md p-4 space-y-4 bg-slate-50 min-h-screen" role="main">
      <header className="space-y-2 pt-8">
        <h1 className="text-2xl font-bold">Athletera</h1>
        <p className="text-sm text-slate-700">
          Detecta desequilibrios musculares que pueden causar lesiones.
        </p>
        <p className="text-xs text-slate-500">
          Ingresa tus marcas en ejercicios clave y obtén un diagnóstico personalizado.
          Solo necesitas tu peso corporal y los kg/repeticiones de tus levantamientos.
        </p>
      </header>

      <ProgressStepper profile={profile} metrics={metrics} />

      {/* Selector de Modo (Simple/Comparativo) */}
      <ViewModeToggle
        viewMode={viewMode}
        targetLevel={targetLevel}
        hasBodyWeight={!!profile.bodyWeightKg}
        onViewModeChange={setViewMode}
        onTargetLevelChange={setTargetLevel}
      />

      <AthleteProfileForm profile={profile} onChange={updateProfile} />

      <ExerciseForm
        metrics={metrics}
        availableExercises={availableExercises}
        onChange={updateMetric}
        onAdd={addMetric}
        onRemove={removeMetric}
        pivot1RM={pivot1RM}
      />

      {errors.length > 0 && (
        <section
          className="rounded-xl border border-red-200 bg-red-50 p-3"
          role="alert"
          aria-live="assertive"
          aria-labelledby="errors-title"
        >
          <h3 id="errors-title" className="text-sm font-semibold text-red-700 mb-2">
            Corrige lo siguiente
          </h3>
          <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border p-4 bg-white space-y-3" aria-labelledby="radar-title">
        <h2 id="radar-title" className="font-semibold">
          Comparativa Ideal vs Actual
          {viewMode === 'comparative' && (
            <span className="ml-2 text-xs font-normal text-purple-600">
              (incluye tu meta: {targetLevel})
            </span>
          )}
        </h2>
        <RadarChart results={results} ghostProfile={ghostProfile} />
      </section>

      <section className="rounded-xl border p-4 bg-white space-y-2" aria-labelledby="results-title">
        <h2 id="results-title" className="font-semibold">
          Resumen de diagnóstico
          {profile.bodyWeightKg && (
            <span className="ml-2 text-xs font-normal text-slate-500">
              (con peso corporal: {profile.bodyWeightKg} kg)
            </span>
          )}
        </h2>
        <ResultsSummary results={results} bodyWeightKg={profile.bodyWeightKg} />
      </section>

      {/* Tarjeta de Diagnóstico Narrativo */}
      {diagnosticCard && <DiagnosticCard diagnostic={diagnosticCard} />}

      <HowToInterpret />

      <div className="pt-2 pb-8">
        <button
          type="button"
          onClick={handleReset}
          className="w-full rounded-lg border border-red-300 text-red-600 text-sm py-2.5 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        >
          Reiniciar todo
        </button>
      </div>
      <UpdateToast />
    </main>
  );
}
