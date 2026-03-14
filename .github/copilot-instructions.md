# Project Guidelines

## Code Style
- Use JavaScript/JSX with single quotes and semicolons, matching `client/src/App.jsx` and `server/src/index.js`.
- Keep React components functional and concise; app entry flow is `client/index.html` → `client/src/main.jsx` → `client/src/App.jsx`.
- Prefer Tailwind utility classes in JSX; keep global CSS minimal in `client/src/index.css`.
- Reuse theme tokens from `client/tailwind.config.js` (`night`, `bunker`, `neon.*`, `shadow.neon`) instead of hardcoded colors.

## Architecture
- Workspace has two apps:
  - `client/`: Vite + React frontend.
  - `server/`: Express API backend.
- Server entry is `server/src/index.js` with middleware (`cors`, `express.json`) and `/api/*` routes.
- Frontend currently uses local sample lots in `client/src/App.jsx`; backend exposes similar data at `/api/lots`.

## Build and Test
- Client (`client/package.json`):
  - `npm install`
  - `npm run dev`
  - `npm run build`
  - `npm run preview`
- Server (`server/package.json`):
  - `npm install`
  - `npm run dev`
  - `npm run start`
- No test scripts are defined yet; do not assume Jest/Vitest/Supertest setup exists.

## Project Conventions
- Keep API paths under `/api/*` (see `/api/health`, `/api/lots` in `server/src/index.js`).
- Use `dotenv` for config (`server/.env.example`, `dotenv.config()` in `server/src/index.js`).
- Keep Tailwind content globs aligned with `client/tailwind.config.js` when adding directories.
- Prefer minimal, direct structure over introducing abstractions unless requested.

## Integration Points
- Backend health endpoint: `GET /api/health`.
- Lots endpoint: `GET /api/lots`, items shaped as `{ id, item, bid }`.
- Vite dev server defaults to `5173` (`client/vite.config.js`), backend defaults to `4000` (`server/src/index.js`).

## Security
- `cors()` is currently open in `server/src/index.js`; restrict origins before production.
- No auth/rate limiting/input validation exists yet; treat all input as untrusted for new write endpoints.
- Keep secrets in `.env`; do not commit real credentials.
