import { useState, useEffect } from 'react';

export function UpdateToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(true);
    window.addEventListener('sw-update-available', handler);
    return () => window.removeEventListener('sw-update-available', handler);
  }, []);

  if (!show) return null;

  const handleUpdate = () => {
    const updateSW = (window as unknown as Record<string, unknown>)
      .__pwaUpdateSW as ((reload?: boolean) => Promise<void>) | undefined;
    if (updateSW) {
      void updateSW(true);
    } else {
      window.location.reload();
    }
  };

  return (
    <div style={styles.container}>
      <span style={styles.text}>Nueva versión disponible</span>
      <button onClick={handleUpdate} style={styles.button}>
        Actualizar
      </button>
      <button onClick={() => setShow(false)} style={styles.dismiss}>
        &times;
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '0.75rem',
    padding: '0.75rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    zIndex: 9999,
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    maxWidth: 'calc(100vw - 2rem)',
  },
  text: {
    color: '#e2e8f0',
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
  },
  button: {
    background: '#0ea5e9',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.4rem 0.75rem',
    fontSize: '0.8rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  dismiss: {
    background: 'transparent',
    color: '#94a3b8',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0 0.25rem',
    lineHeight: 1,
  },
};
