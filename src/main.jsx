import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Plain paths such as /terms or /contribute (served the same index.html) become hash routes.
if (location.pathname !== '/' && !location.hash) {
  history.replaceState(null, '', `/#/${location.pathname.replace(/^\/+|\/+$/g, '')}`);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
