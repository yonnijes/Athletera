import type { DiagnosticCard as DiagnosticCardType } from '../hooks/useStrengthLogic';

interface DiagnosticCardProps {
  diagnostic: DiagnosticCardType;
}

export function DiagnosticCard({ diagnostic }: DiagnosticCardProps) {
  const getStyles = () => {
    switch (diagnostic.severity) {
      case 'critical':
        return {
          border: 'border-2 border-red-300',
          bg: 'bg-red-50',
          title: 'text-red-800',
          text: 'text-red-700',
          icon: 'bg-red-100',
        };
      case 'warning':
        return {
          border: 'border-2 border-yellow-300',
          bg: 'bg-yellow-50',
          title: 'text-yellow-800',
          text: 'text-yellow-700',
          icon: 'bg-yellow-100',
        };
      case 'info':
        return {
          border: 'border-2 border-blue-300',
          bg: 'bg-blue-50',
          title: 'text-blue-800',
          text: 'text-blue-700',
          icon: 'bg-blue-100',
        };
    }
  };

  const styles = getStyles();

  return (
    <article
      className={`rounded-xl ${styles.border} ${styles.bg} p-4 mb-4`}
      role="alert"
      aria-live={diagnostic.severity === 'critical' ? 'assertive' : 'polite'}
    >
      <header className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-lg ${styles.icon}`}>
          {diagnostic.severity === 'critical' && <span className="text-2xl">🚨</span>}
          {diagnostic.severity === 'warning' && <span className="text-2xl">⚡</span>}
          {diagnostic.severity === 'info' && <span className="text-2xl">🎉</span>}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${styles.title}`}>{diagnostic.title}</h3>
        </div>
      </header>

      <div className={`space-y-3 ${styles.text}`}>
        <p className="text-sm leading-relaxed">{diagnostic.body}</p>

        {diagnostic.risks.length > 0 && (
          <section>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <span>⚠️</span> Riesgos:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {diagnostic.risks.map((risk, idx) => (
                <li key={idx}>{risk}</li>
              ))}
            </ul>
          </section>
        )}

        {diagnostic.actions.length > 0 && (
          <section>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <span>✅</span> Acciones Recomendadas:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              {diagnostic.actions.map((action, idx) => (
                <li key={idx}>{action}</li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </article>
  );
}
