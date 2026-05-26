export function HowToInterpret() {
  return (
    <details className="rounded-xl border bg-white p-4">
      <summary className="font-semibold text-sm cursor-pointer select-none">
        ¿Cómo interpretar los resultados?
      </summary>
      <div className="mt-3 space-y-3 text-sm text-slate-600">
        <div>
          <h4 className="font-medium text-slate-800 mb-1">Colores de estado</h4>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
              <span><strong>Óptimo</strong> — Tu marca está dentro del rango ideal de balance.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
              <span><strong>Advertencia</strong> — Hay un desequilibrio leve (-5% a -15%). Merece atención.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span><strong>Crítico</strong> — Desequilibrio significativo (&gt;15%). Riesgo de lesión.</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-slate-800 mb-1">Eficiencia</h4>
          <p>
            Porcentaje de tu 1RM actual respecto al objetivo ideal. 100% = perfectamente balanceado
            con tu Press de Banca.
          </p>
        </div>

        <div>
          <h4 className="font-medium text-slate-800 mb-1">Niveles de fuerza</h4>
          <p>
            Se calculan comparando tu 1RM con tu peso corporal. Los niveles son:
          </p>
          <ul className="mt-1 space-y-0.5 text-xs">
            <li><strong>Principiante</strong> — Primeros meses de entrenamiento</li>
            <li><strong>Intermedio</strong> — 1-2 años de entrenamiento consistente</li>
            <li><strong>Avanzado</strong> — 3+ años de entrenamiento serio</li>
            <li><strong>Élite</strong> — Nivel competitivo</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-slate-800 mb-1">Gráfico radar</h4>
          <p>
            Muestra visualmente el balance entre tus ejercicios. Un polígono simétrico indica
            buen equilibrio. Picos o valles indican músculos desproporcionadamente fuertes o débiles.
          </p>
        </div>
      </div>
    </details>
  );
}
