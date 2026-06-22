# FivePrompt App

Prima versione della web app FivePrompt costruita con React + Vite.

## Funzioni

- Input per prompt grezzo
- Chiamata al backend Render su `/api/optimize`
- Output diviso in Stage, Task, Audience, Rules e Prompt ottimizzato
- Copia del prompt finale
- Stato di caricamento
- Gestione errori

## Sviluppo locale

```bash
npm install
npm run dev
```

L'app usa di default:

```text
https://fiveprompt-backend.onrender.com
```

Per cambiare backend, crea un file `.env`:

```env
VITE_API_BASE_URL=https://fiveprompt-backend.onrender.com
```

## Build

```bash
npm run build
```

## Deploy

Su Vercel, Netlify o Render Static Site:

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://fiveprompt-backend.onrender.com`

Il backend deve accettare richieste CORS dal dominio del frontend.
