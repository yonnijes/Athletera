import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './assets/styles.css';

// Register SW with periodic update checks (every 60 minutes)
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Dispatch custom event so the UpdateToast component can react
    window.dispatchEvent(new CustomEvent('sw-update-available'));
  },
  onOfflineReady() {
    console.log('[PWA] App lista para uso offline');
  },
});

// Periodic update check every 60 minutes
setInterval(
  () => {
    void updateSW(false); // check for updates without forcing reload
  },
  60 * 60 * 1000,
);

// Expose updateSW globally so the toast can trigger reload
(window as unknown as Record<string, unknown>).__pwaUpdateSW = updateSW;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
