# DevSnap

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types. Built with Next.js 16, React 19, and Tailwind CSS v4.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19** with React Compiler enabled (`reactCompiler: true` in `next.config.ts`)
- **Tailwind CSS v4** — imported via `@import "tailwindcss"` in `globals.css` (no `tailwind.config` file needed)
- **TypeScript** with strict mode; path alias `@/*` maps to `src/*`

## PostgreSQL MCP

A PostgreSQL MCP server is connected and can be used to query the database directly during development.

### Available Tools

- `mcp__postgres__execute_sql` — Run any SQL query (SELECT, INSERT, UPDATE, DELETE)
- `mcp__postgres__list_schemas` — List all schemas in the database
- `mcp__postgres__list_objects` — List tables, views, and other objects in a schema
- `mcp__postgres__get_object_details` — Get column definitions and constraints for a table
- `mcp__postgres__explain_query` — Get the query execution plan for a SQL statement
- `mcp__postgres__analyze_query_indexes` — Suggest indexes for a specific query
- `mcp__postgres__analyze_workload_indexes` — Suggest indexes based on overall workload
- `mcp__postgres__get_top_queries` — Show slowest/most expensive queries
- `mcp__postgres__analyze_db_health` — General database health report

### Usage

Use these tools to:
- Inspect real data without switching to a DB client: `SELECT * FROM "Collection";`
- Debug data issues during development
- Verify seed data, migrations, and schema state
- Analyze query performance and suggest indexes

### Notes

- Table and column names in Prisma-generated schemas use **quoted PascalCase** (e.g., `"Collection"`, `"isFavorite"`)
- The database is the local Docker PostgreSQL instance defined in `docker-compose.yaml`
- Always use the MCP tools instead of running `psql` via Bash when possible

