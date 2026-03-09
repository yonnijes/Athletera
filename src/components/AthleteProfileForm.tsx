import { ATHLETE_CATEGORIES } from '../constants/athlete';
import type { AthleteProfile } from '../types/domain';

interface AthleteProfileFormProps {
  profile: AthleteProfile;
  onChange: (next: AthleteProfile) => void;
}

export function AthleteProfileForm({ profile, onChange }: AthleteProfileFormProps) {
  return (
    <section className="rounded-xl border p-4 bg-white space-y-3" aria-labelledby="profile-form-title">
      <h2 id="profile-form-title" className="font-semibold">Perfil de atleta</h2>
      <p className="text-xs text-slate-500">
        Esta información se usará en futuras versiones para ajustar los ratios.
      </p>

      <div className="grid grid-cols-1 gap-3">
        <label className="text-sm text-slate-700">
          <span className="block font-medium mb-1">Categoría</span>
          <select
            id="athlete-category"
            className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
            value={profile.category}
            onChange={(e) => onChange({ ...profile, category: e.target.value as AthleteProfile['category'] })}
            aria-describedby="category-help"
          >
            {ATHLETE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <span id="category-help" className="sr-only">
            Selecciona tu deporte o categoría principal
          </span>
        </label>

        {/* Nivel oculto en MVP - no afecta ratios todavía */}
        <input
          type="hidden"
          name="level"
          value={profile.level}
          readOnly
        />

        <label className="text-sm text-slate-700">
          <span className="block font-medium mb-1">Peso corporal (kg)</span>
          <input
            id="athlete-weight"
            type="number"
            min={1}
            max={300}
            placeholder="Ej: 75"
            className="mt-1 w-full rounded-lg border p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
            value={profile.bodyWeightKg ?? ''}
            onChange={(e) => {
              const value = Number(e.target.value);
              onChange({
                ...profile,
                bodyWeightKg: Number.isFinite(value) && value > 0 ? value : undefined,
              });
            }}
            aria-describedby="weight-help"
          />
          <span id="weight-help" className="sr-only">
            Opcional. Tu peso corporal en kilogramos
          </span>
        </label>
      </div>
    </section>
  );
}
