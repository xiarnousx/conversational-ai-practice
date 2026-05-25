# hookhub — Product Spec (MVP)

## Overview

**hookhub** is a public gallery for discovering open-source Claude Code hooks.

Claude Code hooks are user-defined shell commands, HTTP endpoints, or LLM prompts that execute automatically at specific lifecycle points in a Claude Code session — turning best-practice guidelines into enforced, automated rules.

The ecosystem is growing rapidly with no central place to discover quality hooks. hookhub fills that gap.

**MVP scope:** Read-only display of curated hooks. No authentication, no user submissions, no search.

---

## Data Model

Each hook has the following fields:

| Field | Type | Description |
|---|---|---|
| `id` | `number` | Unique identifier |
| `name` | `string` | Display name (e.g. "Risky Bash Blocker") |
| `category` | `Category` | Functional classification (see below) |
| `hook_event` | `HookEvent` | Lifecycle event the hook targets (see below) |
| `description` | `string` | What the hook does (1–3 sentences) |
| `repo_url` | `string` | Full GitHub repository URL |
| `author` | `string` | GitHub username of the hook author |

### Category enum

| Value | Label | Description |
|---|---|---|
| `security` | Security & Safety | Blocks dangerous commands or unauthorized file access |
| `code-quality` | Code Quality | Enforces linting, formatting, or test requirements |
| `session` | Session Management | Context loading, setup/teardown on session start or end |
| `notifications` | Notifications | TTS alerts, Slack messages, email pings |
| `logging` | Logging & Monitoring | Audit trails, transcript backups, observability |
| `workflow` | Workflow Automation | CI/CD triggers, deployment gates, external service calls |

### HookEvent enum

| Value | Description |
|---|---|
| `PreToolUse` | Runs before Claude uses a tool; can inspect and block the action |
| `PostToolUse` | Runs after a tool completes; used for automated quality checks |
| `SessionStart` | Fires when a Claude Code session begins |
| `SessionEnd` | Fires when a Claude Code session ends |
| `Notification` | Fires when Claude sends a notification |
| `SubagentStop` | Fires when a subagent completes its task |

---

## Pages

### `/` — Main page

The only page in the MVP.

#### Layout

```
┌─────────────────────────────────────────────────────┐
│  hookhub                          [tagline]          │
├─────────────────────────────────────────────────────┤
│  [All] [Security] [Code Quality] [Session]           │
│  [Notifications] [Logging] [Workflow]                │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ Hook card│  │ Hook card│  │ Hook card│           │
│  └──────────┘  └──────────┘  └──────────┘           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ Hook card│  │ Hook card│  │ Hook card│           │
│  └──────────┘  └──────────┘  └──────────┘           │
└─────────────────────────────────────────────────────┘
```

**Grid breakpoints:**
- Desktop (≥1024px): 3 columns
- Tablet (≥640px): 2 columns
- Mobile (<640px): 1 column

#### Header

- Product name: **hookhub**
- Tagline: "Discover open-source Claude Code hooks"

#### Category filter bar

- Pill/tab buttons: All · Security · Code Quality · Session · Notifications · Logging · Workflow
- Default selection: **All**
- Selecting a category filters the grid to matching hooks (client-side, no page navigation)

#### Hook card

Each card displays:

| Element | Notes |
|---|---|
| **Name** | Prominent, top of card |
| **Category badge** | Color-coded pill (one per hook) |
| **Hook event chip** | Secondary chip showing the lifecycle event |
| **Description** | Truncated to ~3 lines with ellipsis |
| **"View on GitHub →"** | External link to `repo_url`, opens in new tab |

Cards are non-interactive beyond the GitHub link (no detail/modal view in MVP).

---

## Data Strategy

Hook data is stored in a static TypeScript file:

```
src/data/hooks.ts
```

It exports a typed array of hook objects conforming to the data model above. No database reads at runtime in the MVP. The PostgreSQL instance is available but unused.

---

## Out of Scope (MVP)

- Hook detail page
- Full-text search
- User submissions or contributions via UI
- Authentication
- GitHub star counts or live metadata fetching
- Sorting or pagination
- Dark/light mode toggle
- Hook ratings or comments
