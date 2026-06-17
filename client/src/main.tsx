import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { toast } from './lib/toast';

window.addEventListener('unhandledrejection', (event) => {
  const message = event.reason?.message || 'An unexpected error occurred';
  if (!message.includes('ResizeObserver') && !message.includes('chunk')) {
    toast.error(message);
  }
});

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update();
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
