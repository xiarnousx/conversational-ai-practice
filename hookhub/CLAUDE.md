# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint check
```

### Docker (includes Postgres + pgAdmin)

```bash
docker compose up --build          # Start all services (dev mode, hot reload)
docker compose up -d postgres      # Start only the database
```

- App: http://localhost:3000
- pgAdmin: http://localhost:5050 (admin@example.com / admin)
- Postgres: localhost:5432 (postgres/postgres, db: hookhub)

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript 5 |
| Database | PostgreSQL 15 (via Docker) |
| Compiler | React Compiler (babel-plugin-react-compiler) |

## Architecture

This is a **Next.js App Router** project under `src/app/`. All routes are file-based under that directory.

**React Compiler is enabled** (`reactCompiler: true` in [next.config.ts](next.config.ts)). Do not add manual `useMemo`, `useCallback`, or `memo` — the compiler handles memoization automatically.

**Tailwind v4** uses a PostCSS-based config ([postcss.config.mjs](postcss.config.mjs)) — there is no `tailwind.config.js`. Custom theme tokens go in the CSS layer in [src/app/globals.css](src/app/globals.css).

**ESLint** uses the v9 flat config format ([eslint.config.mjs](eslint.config.mjs)), not `.eslintrc`.

The database connection string is `DATABASE_URL` (set in docker-compose or `.env.local`):
```
postgresql://postgres:postgres@postgres:5432/hookhub   # inside Docker
postgresql://postgres:postgres@localhost:5432/hookhub  # local dev
```

## Further Information:

- @AGENTS.md