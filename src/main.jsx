/**
 * main.jsx
 * React uygulamasının başlangıç noktasıdır. HTML'deki 'root' elementini bulup
 * App.jsx (ana bileşen) içerisindeki kodları web tarayıcısına render eder (çizer).
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// React Three Fiber kütüphanesinin iç yapısında kullanılan THREE.Clock uyarılarını gizle
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('THREE.Clock: This module has been deprecated')) {
    return;
  }
  originalWarn(...args);
};

import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="245312358088-4mqh45q842vp78r46vned6earldfkiss.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
