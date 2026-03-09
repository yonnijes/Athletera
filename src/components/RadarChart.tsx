import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as ReRadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { getMidIdealRatio } from '../utils/calculators';
import type { AssessmentResult } from '../types/domain';

interface RadarChartProps {
  results: AssessmentResult[];
}

export function RadarChart({ results }: RadarChartProps) {
  const data = results.map((r) => {
    const idealRatio = getMidIdealRatio(r.exercise) ?? 0;
    const actualRatio = idealRatio * (r.percentageEfficiency / 100);

    return {
      exercise: r.exercise,
      ideal: Number((idealRatio * 100).toFixed(2)),
      actual: Number((actualRatio * 100).toFixed(2)),
    };
  });

  if (data.length === 0) return null;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ReRadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="exercise" />
          <PolarRadiusAxis />
          <Tooltip />
          <Radar name="Ideal" dataKey="ideal" stroke="#334155" fill="#94a3b8" fillOpacity={0.3} />
          <Radar name="Actual" dataKey="actual" stroke="#0ea5e9" fill="#38bdf8" fillOpacity={0.4} />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
