import type { AthleteProfile, StrengthMetrics } from '../types/domain';

interface ProgressStepperProps {
  profile: AthleteProfile;
  metrics: StrengthMetrics[];
}

export function ProgressStepper({ profile, metrics }: ProgressStepperProps) {
  const hasWeight = profile.bodyWeightKg !== undefined && profile.bodyWeightKg > 0;
  const hasBench = metrics.some((m) => m.exerciseId === 'bench_press' && m.weightKg > 0 && m.reps > 0);
  const hasOther = metrics.some((m) => m.exerciseId !== 'bench_press' && m.weightKg > 0 && m.reps > 0);

  const steps = [
    { label: 'Peso corporal', done: hasWeight },
    { label: 'Press de Banca', done: hasBench },
    { label: 'Más ejercicios', done: hasOther },
  ];

  // Determine current step (first incomplete)
  const currentIdx = steps.findIndex((s) => !s.done);

  return (
    <nav className="flex items-center justify-between gap-1 text-xs" aria-label="Progreso de configuración">
      {steps.map((step, idx) => {
        const isActive = idx === currentIdx;
        const isDone = step.done;

        return (
          <div key={step.label} className="flex items-center gap-1 flex-1">
            <span
              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isDone
                  ? 'bg-green-500 text-white'
                  : isActive
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {isDone ? '\u2713' : idx + 1}
            </span>
            <span
              className={`truncate ${
                isDone ? 'text-green-700' : isActive ? 'text-sky-700 font-medium' : 'text-slate-400'
              }`}
            >
              {step.label}
            </span>
            {idx < steps.length - 1 && (
              <span className={`flex-1 h-px mx-1 ${isDone ? 'bg-green-300' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </nav>
  );
}
