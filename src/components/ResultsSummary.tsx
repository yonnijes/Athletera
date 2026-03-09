import type { AssessmentResult } from '../types/domain';
import { formatExercise } from '../utils/calculators';

interface ResultsSummaryProps {
  results: AssessmentResult[];
}

export function ResultsSummary({ results }: ResultsSummaryProps) {
  if (results.length === 0) {
    return <p className="text-sm text-slate-500" role="status">Agrega datos válidos para evaluar.</p>;
  }

  const getStatusIcon = (status: AssessmentResult['status']) => {
    switch (status) {
      case 'optimal':
        return '🟢';
      case 'warning':
        return '🟡';
      case 'critical':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getStatusLabel = (status: AssessmentResult['status']) => {
    switch (status) {
      case 'optimal':
        return 'Óptimo';
      case 'warning':
        return 'Advertencia';
      case 'critical':
        return 'Crítico';
      default:
        return status;
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
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium">{formatExercise(r.exercise)}</p>
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
          <p>
            Eficiencia:{' '}
            <strong className={r.percentageEfficiency >= 95 ? 'text-green-600' : r.percentageEfficiency >= 85 ? 'text-yellow-600' : 'text-red-600'}>
              {r.percentageEfficiency}%
            </strong>
          </p>
          <p>1RM actual: {r.current1RM} kg</p>
          <p>1RM objetivo: {r.target1RM} kg</p>
          <p className="text-slate-600 mt-1">{r.recommendation}</p>
        </article>
      ))}
    </div>
  );
}
