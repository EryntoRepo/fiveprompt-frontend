import React, { useMemo, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://fiveprompt-backend.onrender.com";

const EMPTY_RESULT = {
  stage: "",
  task: "",
  audience: "",
  rules: "",
  optimized: "",
};

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(EMPTY_RESULT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copia prompt");

  const hasResult = useMemo(() => Boolean(result.optimized), [result]);

  async function handleOptimize(event) {
    event.preventDefault();

    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) {
      setError("Scrivi un prompt prima di ottimizzarlo.");
      setResult(EMPTY_RESULT);
      return;
    }

    setIsLoading(true);
    setError("");
    setCopyLabel("Copia prompt");

    try {
      const response = await fetch(`${API_BASE_URL}/api/optimize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: cleanPrompt }),
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Il servizio non è disponibile in questo momento. Riprova tra poco."
        );
      }

      setResult({
        stage: data?.stage || "",
        task: data?.task || "",
        audience: data?.audience || "",
        rules: data?.rules || "",
        optimized: data?.optimized || "",
      });
    } catch (err) {
      setResult(EMPTY_RESULT);
      setError(err.message || "Errore imprevisto. Riprova tra poco.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!result.optimized) return;

    try {
      await navigator.clipboard.writeText(result.optimized);
      setCopyLabel("Copiato");
      window.setTimeout(() => setCopyLabel("Copia prompt"), 1600);
    } catch {
      setError("Non sono riuscito a copiare il prompt. Selezionalo manualmente.");
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img
            className="brand-logo"
            src="/fiveprompt-logo.png"
            alt="FivePrompt"
          />
          <div>
            <strong>FivePrompt</strong>
            <span>Prompt workspace</span>
          </div>
        </div>
        <div className="service-status">
          <span className="status-dot" />
          AI optimizer
        </div>
      </header>

      <main className="app-shell">
        <section className="workspace">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Input</p>
              <h1>Crea un prompt migliore</h1>
            </div>
            {prompt && (
              <button
                className="text-button"
                type="button"
                onClick={() => {
                  setPrompt("");
                  setError("");
                }}
              >
                Svuota
              </button>
            )}
          </div>

          <div className="panel-intro">
            <p>
              Scrivi liberamente la tua richiesta. FivePrompt la trasformerà in
              una struttura precisa e pronta all'uso.
            </p>
          </div>

          <form className="composer" onSubmit={handleOptimize}>
            <label htmlFor="prompt">Prompt grezzo</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Es. Scrivi un post LinkedIn per presentare il mio nuovo corso..."
              maxLength={4000}
              autoFocus
            />

            <div className="composer-footer">
              <span>{prompt.length} / 4000 caratteri</span>
              <button
                className="primary-button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="button-loader" />
                    Ottimizzazione
                  </>
                ) : (
                  "Ottimizza prompt"
                )}
              </button>
            </div>
          </form>

          {error && <div className="error-message">{error}</div>}
        </section>

        <section className="result-area" aria-live="polite">
          <div className="panel-header result-header">
            <div>
              <p className="eyebrow">Output strutturato</p>
              <h2>Il tuo FivePrompt</h2>
            </div>
            <button
              className="secondary-button"
              type="button"
              onClick={handleCopy}
              disabled={!hasResult}
            >
              {copyLabel}
            </button>
          </div>

          {isLoading && (
            <div className="loading-state">
              <div className="loader" />
              <div>
                <strong>Sto dando struttura alla tua idea</strong>
                <p>Analizzo obiettivo, pubblico e regole.</p>
              </div>
            </div>
          )}

          {!isLoading && !hasResult && (
            <div className="empty-state">
              <div className="empty-heading">
                <span className="empty-icon">5</span>
                <div>
                  <strong>Il risultato prenderà forma qui</strong>
                  <p>Cinque elementi, un prompt pronto da usare.</p>
                </div>
              </div>
              <ol className="method-list">
                <MethodItem number="01" title="Stage" text="Il ruolo dell'AI" />
                <MethodItem number="02" title="Task" text="L'azione richiesta" />
                <MethodItem number="03" title="Audience" text="Il destinatario" />
                <MethodItem number="04" title="Rules" text="Tono e vincoli" />
                <MethodItem number="05" title="Prompt" text="La versione finale" />
              </ol>
            </div>
          )}

          {!isLoading && hasResult && (
            <div className="result-grid">
              <ResultBlock number="01" title="Stage" content={result.stage} />
              <ResultBlock number="02" title="Task" content={result.task} />
              <ResultBlock number="03" title="Audience" content={result.audience} />
              <ResultBlock number="04" title="Rules" content={result.rules} />
              <ResultBlock
                number="05"
                title="Prompt ottimizzato"
                content={result.optimized}
                featured
              />
            </div>
          )}
        </section>
      </main>
      <footer className="app-footer">
        <span>Released by</span>
        <strong>Erynto</strong>
      </footer>
    </div>
  );
}

function MethodItem({ number, title, text }) {
  return (
    <li>
      <span>{number}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </li>
  );
}

function ResultBlock({ number, title, content, featured = false }) {
  return (
    <article className={featured ? "result-block featured" : "result-block"}>
      <div className="result-label">
        <span>{number}</span>
        <h3>{title}</h3>
      </div>
      <p>{content || "Nessun contenuto ricevuto."}</p>
    </article>
  );
}

export default App;
