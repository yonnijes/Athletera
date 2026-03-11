import type { AssessmentResult, CrossExerciseAlert, AnyLevel } from '../types/domain';
import { formatExercise, detectCrossExerciseImbalance } from '../utils/calculators';
import { LEVEL_LABELS, LEVEL_COLORS } from '../constants/ratios';

interface ResultsSummaryProps {
  results: AssessmentResult[];
  bodyWeightKg?: number;
}

export function ResultsSummary({ results, bodyWeightKg }: ResultsSummaryProps) {
  const crossExerciseAlerts: CrossExerciseAlert[] = bodyWeightKg ? detectCrossExerciseImbalance(results) : [];

  if (results.length === 0) {
    return (
      <p className="text-sm text-slate-500" role="status">
        {bodyWeightKg ? 'Agrega datos válidos para evaluar.' : 'Ingresa tu peso corporal para ver el nivel de fuerza.'}
      </p>
    );
  }

  const getStatusIcon = (status: AssessmentResult['status']) => {
    switch (status) {
      case 'optimal': return '🟢';
      case 'warning': return '🟡';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  const getStatusLabel = (status: AssessmentResult['status']) => {
    switch (status) {
      case 'optimal': return 'Óptimo';
      case 'warning': return 'Advertencia';
      case 'critical': return 'Crítico';
      default: return status;
    }
  };

  const getNextLevel = (level: AssessmentResult['strengthLevel']) => {
    if (!level) return null;
    const next: Record<AnyLevel, string | null> = {
      beginner: 'Intermedio',
      novice: 'Intermedio',
      intermediate: 'Avanzado',
      advanced: 'Élite',
      elite: null,
    };
    return next[level];
  };

  return (
    <div className="space-y-4" role="list">
      {/* Alertas Cross-Ejercicio (PRIORITARIAS) */}
      {crossExerciseAlerts.length > 0 && (
        <section className="rounded-lg border-2 border-red-300 bg-red-50 p-4" role="alert" aria-live="assertive">
          <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
            <span className="text-xl">🚨</span> Alertas de Desequilibrio Crítico
          </h3>
          <ul className="space-y-2">
            {crossExerciseAlerts.map((alert, idx) => (
              <li
                key={idx}
                className={`text-sm ${alert.severity === 'critical' ? 'text-red-700 font-medium' : 'text-orange-700'}`}
              >
                {alert.message}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Resultados por ejercicio */}
      <div className="space-y-2">
        {results.map((r) => (
          <article
            key={r.exercise}
            className="rounded-lg bg-slate-50 p-3 text-sm"
            role="listitem"
            aria-label={`Resultado para ${formatExercise(r.exercise)}`}
          >
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <p className="font-medium">{formatExercise(r.exercise)}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {r.strengthLevel && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_COLORS[r.strengthLevel]}`}>
                    {LEVEL_LABELS[r.strengthLevel]}
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    r.status === 'optimal'
                      ? 'bg-green-100 text-green-700'
                      : r.status === 'warning'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                  aria-label={`Estado: ${getStatusLabel(r.status)}`}
                >
                  {getStatusIcon(r.status)} {getStatusLabel(r.status)}
                </span>
              </div>
            </div>
            <p>
              Eficiencia:{' '}
              <strong className={r.percentageEfficiency >= 95 ? 'text-green-600' : r.percentageEfficiency >= 85 ? 'text-yellow-600' : 'text-red-600'}>
                {r.percentageEfficiency}%
              </strong>
            </p>
            <p>1RM actual: {r.current1RM} kg</p>
            <p>1RM objetivo: {r.target1RM} kg</p>
            {r.relativeRatio && bodyWeightKg && (
              <p className="text-xs text-slate-500">Fuerza relativa: {r.relativeRatio}× peso corporal</p>
            )}
            {r.strengthLevel && r.levelProgress !== undefined && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Progreso hacia {getNextLevel(r.strengthLevel) || 'Máximo'}</span>
                  <span>{r.levelProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      r.strengthLevel === 'elite' ? 'bg-amber-500' :
                      r.strengthLevel === 'advanced' ? 'bg-purple-500' :
                      r.strengthLevel === 'intermediate' ? 'bg-blue-500' : 'bg-slate-500'
                    }`}
                    style={{ width: `${Math.min(100, r.levelProgress)}%` }}
                  />
                </div>
              </div>
            )}
            <p className="text-slate-600 mt-2">{r.recommendation}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
