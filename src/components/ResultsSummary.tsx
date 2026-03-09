import type { AssessmentResult } from '../types/domain';
import { formatExercise } from '../utils/calculators';

interface ResultsSummaryProps {
  results: AssessmentResult[];
}

export function ResultsSummary({ results }: ResultsSummaryProps) {
  if (results.length === 0) {
    return <p className="text-sm text-slate-500">Agrega datos válidos para evaluar.</p>;
  }

  return (
    <div className="space-y-2">
      {results.map((r) => (
        <article key={r.exercise} className="rounded-lg bg-slate-50 p-3 text-sm">
          <p className="font-medium">{formatExercise(r.exercise)}</p>
          <p>Eficiencia: {r.percentageEfficiency}%</p>
          <p>1RM actual: {r.current1RM} kg</p>
          <p>1RM objetivo: {r.target1RM} kg</p>
          <p>Estado: {r.status}</p>
          <p className="text-slate-600">{r.recommendation}</p>
        </article>
      ))}
    </div>
  );
}
