import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as ReRadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { getMidIdealRatio, formatExercise } from '../utils/calculators';
import type { AssessmentResult } from '../types/domain';

interface RadarChartProps {
  results: AssessmentResult[];
}

export function RadarChart({ results }: RadarChartProps) {
  const data = results.map((r) => {
    const idealRatio = getMidIdealRatio(r.exercise) ?? 0;
    const actualRatio = idealRatio * (r.percentageEfficiency / 100);

    return {
      exercise: formatExercise(r.exercise),
      exerciseId: r.exercise,
      ideal: Number((idealRatio * 100).toFixed(2)),
      actual: Number((actualRatio * 100).toFixed(2)),
      status: r.status,
    };
  });

  if (data.length === 0) {
    return (
      <div className="h-72 w-full flex items-center justify-center text-slate-500 text-sm" role="status">
        Agrega datos válidos para ver la comparativa
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="h-72 w-full" role="img" aria-label="Gráfico de radar comparando rendimiento ideal vs actual por ejercicio">
        <ResponsiveContainer width="100%" height="100%">
          <ReRadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="exercise" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis tick={{ fontSize: 10 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const point = payload[0]?.payload;
                return (
                  <div className="bg-white border rounded-lg p-2 text-xs shadow-lg">
                    <p className="font-semibold mb-1">{point.exercise}</p>
                    <p className="text-slate-600">Ideal: {point.ideal}%</p>
                    <p className="text-sky-600 font-medium">Actual: {point.actual}%</p>
                    <p className="mt-1">
                      Estado:{' '}
                      <span
                        className={
                          point.status === 'optimal'
                            ? 'text-green-600'
                            : point.status === 'warning'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }
                      >
                        {point.status}
                      </span>
                    </p>
                  </div>
                );
              }}
            />
            <Radar
              name="Ratio Ideal"
              dataKey="ideal"
              stroke="#334155"
              fill="#94a3b8"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Tu Rendimiento"
              dataKey="actual"
              stroke="#0ea5e9"
              fill="#38bdf8"
              fillOpacity={0.4}
              strokeWidth={2}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => (
                <span className={value === 'Ratio Ideal' ? 'text-slate-600' : 'text-sky-600 font-medium'}>
                  {value}
                </span>
              )}
            />
          </ReRadarChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda accesible para lectores de pantalla */}
      <div className="sr-only">
        <p>El área gris representa el ratio ideal esperado. El área azul representa tu rendimiento actual.</p>
        <p>Si el azul no alcanza el gris, hay una deficiencia en ese ejercicio.</p>
      </div>
    </div>
  );
}
