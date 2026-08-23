# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape

This is **not a single application** — it's a personal workspace of independent, unrelated
projects used to practice MCP server development and agentic coding with Claude Code. There is
no root-level `package.json`, build system, or shared dependency graph. Each top-level directory
is self-contained: `cd` into it before running any command, and treat its own docs/config as
authoritative over anything at the root.

Several subprojects already have their own `CLAUDE.md` — read that file first when working inside
one of them, since it takes precedence over the generic guidance below.

| Directory | What it is | Stack | Own CLAUDE.md? |
|---|---|---|---|
| `weather_mcp_python/` | MCP server exercise (STDIO transport, tools, prompts) built with FastMCP | Python 3.12, `uv`, `mcp[cli]`/FastMCP | No |
| `weather_mcp_nodejs/` | Same MCP exercise, Node.js implementation | Node.js, `@modelcontextprotocol/sdk`, zod | No |
| `devsnap/` | Udemy-course Next.js app — a developer knowledge hub (snippets/notes/files) | Next.js 16, React 19 (Compiler on), Tailwind v4, Prisma + PostgreSQL, Vitest | Yes — `devsnap/CLAUDE.md` |
| `hookhub/` | Next.js app for the "Agentic Coding With Claude Code" book | Next.js 16, React 19 (Compiler on), Tailwind v4, PostgreSQL via Docker | Yes — `hookhub/CLAUDE.md` (+ `hookhub/AGENTS.md`) |
| `agentic-coding-with-chelsea-troy/` | Course materials/exercises (Chelsea Troy) incl. a packaged analysis tool | Python, `.claude/` skills & agents | No (has `.claude/` config) |
| `agentic-coding-with-claude-code/` | Notes and exercises for the Claude Code book, organized by chapter (`notes/chapter-NN/`); `agents/` is a placeholder for a not-yet-started chapter | Markdown notes, example `.claude/` configs | Some chapters do (e.g. `notes/chapter-01/CLAUDE.md`) |
| `mastering-claude-ai-book/` | Reading notes for a Claude AI book | Markdown | Yes — `mastering-claude-ai-book/CLAUDE.md` |
| `test-project/` | Throwaway script (fetches/prints Chuck Norris jokes) | Python stdlib only | No |

## Running the MCP servers (root-level, no CLAUDE.md of their own)

**Python** (`weather_mcp_python/`):
```bash
uv --directory /home/ihab/PoC/conversational-ai/weather_mcp_python run server.py
```
Inspect it with the MCP Inspector: `npx @modelcontextprotocol/inspector@latest`.

**Node.js** (`weather_mcp_nodejs/`):
```bash
node /home/ihab/PoC/conversational-ai/weather_mcp_nodejs/index.js
```
Both register a single `get_weather` tool over STDIO transport and are meant to be wired into
Claude Desktop / an MCP client, not run as long-lived servers on their own.

## Working across this repo

- Don't assume conventions from one subproject apply to another (e.g. `hookhub` and `devsnap` are
  both Next.js 16 + React 19 + Tailwind v4, but `devsnap` has Prisma/tests/S3 and `hookhub` doesn't;
  the two MCP servers implement the same exercise in different languages).
- `hookhub`'s `AGENTS.md` warns that its vendored Next.js version has breaking changes vs. training
  data — check `node_modules/next/dist/docs/` there before writing Next.js code in that project.
- `.gitignore` at the root is what actually excludes each subproject's build output/venvs
  (`devsnap/.next`, `hookhub/.next`, `weather_mcp_python/.venv`, etc.) — check it before assuming a
  generated directory should be committed.
