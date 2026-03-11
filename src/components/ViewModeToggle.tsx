import type { ViewMode } from '../hooks/useStrengthLogic';
import type { AnyLevel } from '../types/domain';
import { LEVEL_LABELS } from '../constants/ratios';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  targetLevel: AnyLevel;
  hasBodyWeight: boolean;
  onViewModeChange: (mode: ViewMode) => void;
  onTargetLevelChange: (level: AnyLevel) => void;
}

export function ViewModeToggle({
  viewMode,
  targetLevel,
  hasBodyWeight,
  onViewModeChange,
  onTargetLevelChange,
}: ViewModeToggleProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 mb-4" aria-labelledby="view-mode-title">
      <h2 id="view-mode-title" className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <span>🎯</span> Modo de Visualización
      </h2>

      <div className="space-y-3">
        {/* Toggle Simple/Comparativo */}
        <div className="flex gap-2" role="radiogroup" aria-label="Modo de visualización">
          <button
            type="button"
            role="radio"
            aria-checked={viewMode === 'simple'}
            onClick={() => onViewModeChange('simple')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'simple'
                ? 'bg-slate-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Simple
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={viewMode === 'comparative'}
            onClick={() => onViewModeChange('comparative')}
            disabled={!hasBodyWeight}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'comparative'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            } ${!hasBodyWeight ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-disabled={!hasBodyWeight}
          >
            Comparativo
          </button>
        </div>

        {/* Selector de Nivel (solo en modo comparativo) */}
        {viewMode === 'comparative' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Quiero ser nivel:
            </label>
            <select
              value={targetLevel}
              onChange={(e) => onTargetLevelChange(e.target.value as AnyLevel)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Seleccionar nivel objetivo"
            >
              <option value="beginner">Principiante (0.8× BW en Banca)</option>
              <option value="intermediate">Intermedio (1.2× BW en Banca)</option>
              <option value="advanced">Avanzado (1.5× BW en Banca)</option>
              <option value="elite">Élite (1.8× BW en Banca)</option>
            </select>
            <p className="text-xs text-slate-500 mt-2">
              💡 El gráfico mostrará tu rendimiento actual vs. tu meta
            </p>
          </div>
        )}

        {/* Mensaje si no hay peso corporal */}
        {!hasBodyWeight && viewMode === 'comparative' && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
            <p className="text-xs text-amber-700">
              ⚠️ Ingresa tu peso corporal en el perfil para activar el modo comparativo.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
