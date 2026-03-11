import type { AssessmentResult } from '../types/domain';
import { formatExercise } from '../utils/calculators';
import { STRENGTH_LEVEL_LABELS, STRENGTH_LEVEL_COLORS } from '../constants/strengthStandards';

interface ResultsSummaryProps {
  results: AssessmentResult[];
  bodyWeightKg?: number;
}

export function ResultsSummary({ results, bodyWeightKg }: ResultsSummaryProps) {
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

  return (
    <div className="space-y-2" role="list">
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
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STRENGTH_LEVEL_COLORS[r.strengthLevel]}`}>
                  {STRENGTH_LEVEL_LABELS[r.strengthLevel]}
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
          {r.strengthLevel && r.levelProgress !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Progreso hacia {STRENGTH_LEVEL_LABELS[r.strengthLevel === 'novice' ? 'intermediate' : r.strengthLevel === 'intermediate' ? 'advanced' : r.strengthLevel === 'advanced' ? 'elite' : 'elite']}</span>
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
  );
}
