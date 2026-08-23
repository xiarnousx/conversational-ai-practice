---
allowed-tools: Read, Glob, Bash(mkdir:*), Bash(ls:*), Bash(find:*), Agent
argument-hint: <spec-file> <output-dir> <count>
description: Read a spec file and spawn N agents in parallel, each producing its own independent implementation variation into an output directory.
---

## Inputs

This skill takes exactly three arguments, in order, whitespace-separated:

1. **spec file** — path to a spec/markdown file describing the feature to implement.
2. **output directory** — where each agent's implementation artifact should be written.
3. **count** — how many agents to spawn (positive integer).

Parse these from whatever arguments were passed to this skill invocation. If any argument is
missing, ask the user for it rather than guessing. If the spec file doesn't exist, say so and
stop.

## What this skill does

It fans a single spec out into N independently-implemented variations, produced concurrently by N
separate agents that don't see each other's work. This is for exploring a design space (e.g. "give
me 5 different takes on this Hero component") rather than converging on one correct answer.

## Steps

1. **Read the spec file** in full. This is the shared brief every agent will implement against.

2. **Prepare the output directory.** Create it if it doesn't exist (`mkdir -p`). Then look at what's
   already inside it: if it already contains prior variation artifacts from an earlier run of this
   skill against the same spec, treat this as an incremental batch — continue numbering after the
   highest existing variation index instead of overwriting anything. Never overwrite an existing
   artifact.

3. **Sanity-check the count.** If it's not a positive integer, ask the user to clarify. If it's
   large (double digits or more), confirm with the user before spawning — that many concurrent
   agents is a real cost/time commitment, not a free action.

4. **Decide the artifact shape.** From the spec and the surrounding project (check how/where the
   spec says the component or feature is currently implemented, its file type, its location
   convention), determine what each agent should produce: typically one implementation file (or a
   small, self-contained set of files) per variation, following the project's existing stack and
   conventions rather than inventing new ones.

5. **Spawn exactly `count` agents in parallel**, all in a single message with multiple `Agent` tool
   calls (`subagent_type: "general-purpose"`, no isolation needed unless the spec implies the
   variations would collide on shared files/build state). Each agent starts with zero context, so
   each prompt must be fully self-contained:
   - The complete spec content, verbatim.
   - The exact output file path this agent must write to (pre-assigned by you, using a consistent
     naming scheme like `<spec-slug>-v<N>.<ext>`, continuing from step 2's numbering).
   - An explicit statement that N other agents are independently building *different* variations of
     the same spec right now, and that this agent should commit hard to one distinct, coherent
     creative direction rather than a safe middle-ground — otherwise the variations converge and the
     exercise is wasted. Assign each agent a different differentiation axis to anchor its direction
     (rotate through things like: layout/structural approach, visual style or theme, interaction/
     motion pattern, content or copy strategy, information density/hierarchy, technical approach) —
     don't leave "be different" unguided.
   - Everything the spec marks as a fixed contract (e.g. required props, accessibility rules,
     non-negotiable behavior) must still hold — variation is for the things the spec explicitly
     leaves open, not the things it fixes.
   - An instruction to self-verify before finishing: run the project's lint/typecheck/build (as
     applicable — check the project's own CLAUDE.md/AGENTS.md for the right commands) against just
     its own new file, fix any errors, and only then report done.
   - An instruction to end its report with a one-line summary of the creative direction it took, for
     you to relay to the user.

6. **Do not poll.** Once the agents are launched, tell the user how many are running and where the
   artifacts will land, then wait for their completion notifications rather than checking in a loop.

7. **When agents report back**, summarize the batch for the user: one line per variation — file
   path plus its one-line creative direction. Do not dump each agent's full transcript.

## Notes

- This skill is spec-driven and generic — it doesn't assume the feature is a React component. The
  artifact type, file extension, and verification commands all come from reading the spec and the
  project, not from a hardcoded assumption.
- If the user re-runs this skill against the same spec and output directory, that's an intentional
  way to grow the variation set — keep accumulating, keep the numbering monotonic, never clobber.
