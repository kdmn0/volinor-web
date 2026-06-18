/**
 * main.jsx
 * React uygulamasının başlangıç noktasıdır. HTML'deki 'root' elementini bulup
 * App.jsx (ana bileşen) içerisindeki kodları web tarayıcısına render eder (çizer).
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// React Three Fiber kütüphanesinin iç yapısında kullanılan THREE.Clock uyarılarını gizle
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0] &&
    typeof args[0] === "string" &&
    args[0].includes("THREE.Clock: This module has been deprecated")
  ) {
    return;
  }
  originalWarn(...args);
};

import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="245312358088-4mqh45q842vp78r46vned6earldfkiss.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);

// Backend'in çalışıp çalışmadığını kontrol edip tarayıcı konsoluna yazdıralım
fetch("http://localhost:8000/api/health/")
  .then(() => {
    console.log(
      "%c🚀 BACKEND AKTİF! Tüm sistemler hazır.",
      "color: #22c55e; font-size: 14px; font-weight: bold; border: 1px solid #22c55e; padding: 5px; border-radius: 5px;"
    );
  })
  .catch(() => {
    console.log(
      "%c⚠️ BACKEND KAPALI! (Django şu an çalışmıyor)",
      "color: #ef4444; font-size: 14px; font-weight: bold; border: 1px solid #ef4444; padding: 5px; border-radius: 5px;"
    );
  });
