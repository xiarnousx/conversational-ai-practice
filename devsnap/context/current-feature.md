# Current Feature

Prisma + Docker PostgreSQL Setup

## Status

In Progress

## Goals

- Set up Prisma ORM with Docker PostgreSQL database
- Create initial schema based on data models in project-overview.md
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Use Prisma 7 (breaking changes — follow upgrade guide)
- Always create migrations, never push directly

## Notes

- Reference: `@context/features/database-spec.md`
- Uses the PostgreSQL service defined in `docker-compose.yaml`
- Use `prisma migrate dev` for all schema changes (via `npm run db:migrate`)
- DATABASE_URL points to development branch; production branch separate
- Requires Node.js 22 (Prisma 7 minimum is 20.19+) — use `nvm use 22`

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-03-19: Initial Next.js project setup and boilerplate cleanup
- 2026-03-21: Dashboard UI Phase 1 completed — ShadCN init, dark mode, /dashboard route with topbar, sidebar and main placeholders
- 2026-03-21: Dashboard UI Phase 2 completed — collapsible sidebar, item types with links, favorite/recent collections, user avatar area, mobile drawer
- 2026-03-21: Dashboard UI Phase 3 completed — stats cards, collections grid, pinned items, and recent items sections using mock data
