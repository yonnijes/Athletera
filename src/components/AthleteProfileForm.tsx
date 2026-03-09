import { ATHLETE_CATEGORIES, ATHLETE_LEVELS } from '../constants/athlete';
import type { AthleteProfile } from '../types/domain';

interface AthleteProfileFormProps {
  profile: AthleteProfile;
  onChange: (next: AthleteProfile) => void;
}

export function AthleteProfileForm({ profile, onChange }: AthleteProfileFormProps) {
  return (
    <section className="rounded-xl border p-4 bg-white space-y-3">
      <h2 className="font-semibold">Perfil de atleta</h2>

      <div className="grid grid-cols-1 gap-3">
        <label className="text-sm text-slate-700">
          Categoría
          <select
            className="mt-1 w-full rounded-lg border p-2"
            value={profile.category}
            onChange={(e) => onChange({ ...profile, category: e.target.value as AthleteProfile['category'] })}
          >
            {ATHLETE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-700">
          Nivel
          <select
            className="mt-1 w-full rounded-lg border p-2"
            value={profile.level}
            onChange={(e) => onChange({ ...profile, level: e.target.value as AthleteProfile['level'] })}
          >
            {ATHLETE_LEVELS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-700">
          Peso corporal (kg)
          <input
            type="number"
            min={1}
            className="mt-1 w-full rounded-lg border p-2"
            value={profile.bodyWeightKg ?? ''}
            onChange={(e) => {
              const value = Number(e.target.value);
              onChange({ ...profile, bodyWeightKg: Number.isFinite(value) && value > 0 ? value : undefined });
            }}
          />
        </label>
      </div>
    </section>
  );
}
