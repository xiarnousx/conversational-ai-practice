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

