import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

const rootElement = document.getElementById("root");

function showStartupError(error) {
  const message =
    error?.message || String(error || "Errore sconosciuto durante l'avvio.");

  rootElement.innerHTML = `
    <main class="startup-error">
      <p class="eyebrow">FivePrompt</p>
      <h1>Il frontend non riesce ad avviarsi.</h1>
      <p>${message}</p>
    </main>
  `;
}

window.addEventListener("error", (event) => {
  showStartupError(event.error || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  showStartupError(event.reason);
});

try {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  if (import.meta.env.PROD && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js").catch((error) => {
        console.error("Registrazione service worker non riuscita:", error);
      });
    });
  }
} catch (error) {
  showStartupError(error);
}
