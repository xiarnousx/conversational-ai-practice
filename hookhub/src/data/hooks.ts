export type Category =
  | "security"
  | "code-quality"
  | "session"
  | "notifications"
  | "logging"
  | "workflow";

export type HookEvent =
  | "PreToolUse"
  | "PostToolUse"
  | "SessionStart"
  | "SessionEnd"
  | "Notification"
  | "SubagentStop";

export interface Hook {
  id: number;
  name: string;
  category: Category;
  hook_event: HookEvent;
  description: string;
  repo_url: string;
  author: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  security: "Security & Safety",
  "code-quality": "Code Quality",
  session: "Session Management",
  notifications: "Notifications",
  logging: "Logging & Monitoring",
  workflow: "Workflow Automation",
};

export const hooks: Hook[] = [
  {
    id: 1,
    name: "Risky Bash Blocker",
    category: "security",
    hook_event: "PreToolUse",
    description:
      "Intercepts Bash tool calls and blocks commands containing destructive patterns like `rm -rf`, `dd`, or `mkfs`. Outputs a clear refusal message so Claude knows the action was denied.",
    repo_url: "https://github.com/anthropics/claude-code-hooks-examples",
    author: "anthropics",
  },
  {
    id: 2,
    name: "File Access Guard",
    category: "security",
    hook_event: "PreToolUse",
    description:
      "Prevents Claude from reading or writing files outside a configurable allowlist of directories. Useful for restricting Claude to a specific project root without touching system files.",
    repo_url: "https://github.com/anthropics/claude-code-hooks-examples",
    author: "anthropics",
  },
  {
    id: 3,
    name: "ESLint Enforcer",
    category: "code-quality",
    hook_event: "PostToolUse",
    description:
      "Runs ESLint on any file modified by Claude immediately after a write. If lint errors are found, it appends them to Claude's context so they can be fixed in the same session.",
    repo_url: "https://github.com/anthropics/claude-code-hooks-examples",
    author: "anthropics",
  },
  {
    id: 4,
    name: "Test Runner Gate",
    category: "code-quality",
    hook_event: "PostToolUse",
    description:
      "Triggers your test suite after every file edit. If tests fail, the results are injected back into the conversation as a tool result, keeping Claude in a fix loop until green.",
    repo_url: "https://github.com/anthropics/claude-code-hooks-examples",
    author: "anthropics",
  },
  {
    id: 5,
    name: "Context Loader",
    category: "session",
    hook_event: "SessionStart",
    description:
      "Reads a `.claude-context.md` file from your project root on session start and prepends its contents as system context. Great for injecting per-project conventions automatically.",
    repo_url: "https://github.com/anthropics/claude-code-hooks-examples",
    author: "anthropics",
  },
  {
    id: 6,
    name: "Session Teardown",
    category: "session",
    hook_event: "SessionEnd",
    description:
      "Runs cleanup scripts (killing dev servers, pruning temp files) when a Claude Code session ends. Keeps your environment tidy between coding sessions.",
    repo_url: "https://github.com/anthropics/claude-code-hooks-examples",
    author: "anthropics",
  },
  {
    id: 7,
    name: "TTS Notifier",
    category: "notifications",
    hook_event: "Notification",
    description:
      "Converts Claude's notification text to speech using the system TTS engine. Lets you step away and be called back audibly when Claude finishes a long-running task.",
    repo_url: "https://github.com/anthropics/claude-code-hooks-examples",
    author: "anthropics",
  },
  {
    id: 8,
    name: "Slack Ping",
    category: "notifications",
    hook_event: "SubagentStop",
    description:
      "Sends a Slack message to a configured channel when a subagent completes. Includes the agent name and a brief summary so you can monitor multi-agent pipelines from Slack.",
    repo_url: "https://github.com/anthropics/claude-code-hooks-examples",
    author: "anthropics",
  },
  {
    id: 9,
    name: "Transcript Logger",
    category: "logging",
    hook_event: "SessionEnd",
    description:
      "Appends a timestamped transcript of every tool call and response to a local JSONL file on session end. Provides a full audit trail of what Claude did during a session.",
    repo_url: "https://github.com/anthropics/claude-code-hooks-examples",
    author: "anthropics",
  },
  {
    id: 10,
    name: "Tool Call Auditor",
    category: "logging",
    hook_event: "PreToolUse",
    description:
      "Logs every tool invocation with its full input to a structured audit log before execution. Useful for compliance workflows where every file write or shell command must be recorded.",
    repo_url: "https://github.com/anthropics/claude-code-hooks-examples",
    author: "anthropics",
  },
  {
    id: 11,
    name: "CI Trigger",
    category: "workflow",
    hook_event: "PostToolUse",
    description:
      "Calls a GitHub Actions workflow dispatch endpoint after Claude commits code. Kicks off your CI pipeline automatically without requiring a manual push.",
    repo_url: "https://github.com/anthropics/claude-code-hooks-examples",
    author: "anthropics",
  },
  {
    id: 12,
    name: "Deploy Gate",
    category: "workflow",
    hook_event: "PreToolUse",
    description:
      "Queries an external feature-flag service before allowing Claude to run deployment commands. Blocks deploys outside of approved windows or when the service reports a freeze.",
    repo_url: "https://github.com/anthropics/claude-code-hooks-examples",
    author: "anthropics",
  },
];
