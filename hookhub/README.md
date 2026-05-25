# Agentic Coding with Claude Code

- To initialize the project with claude code `/init`
- When a major update is made it is safe to re run `/init`. It will not delete any files but will update the CLAUDE.md file with the latest information about the project.

## Contents of the CLAUDE.md file:

- The project goal
- The business problem being solved
- How the project is run
- The framework in use, including Next.js
- The folder and directory structure

## Example of adding MCP:

- claude mcp add npx @playwright/mcp@latest -s user (global install)
- claude mcp add --scope project npx @playwright/mcp@latest (project install)

## Markdown Personas for AI coding assistants:

- https://cursor.directory/


## Spec Driven Design:

The general idea is to create a spec file describing the application, the use case or business use case, and possibly nofunctional requirements.

### Plan Mode:
```
I want you to help me write a spec file for a project I am building. It's called "hookhub". It's a place where cool open source Claude hooks are displayed and browsed. Search on Claude hooks and write an initial spec for this. Remember it's an MVP ATM and we need only the functionality of displaying the hooks. Hooks are found in GitHub repositories, they have name, category, description and link to repo. The main page should display the hooks in a grid-like view.
```

The Plan mode:

- Described HookHub as a place where open-source claude hooks are displayed and browsed.
- Asked Claude to search for Claude Hooks and write an initial specification
- Clarified that this is an MVP, with functionality limited to displaying hooks
- Specified that hooks are foind in Git repositories and include name, category, discription, and link to the repository
- Stated the main page should display hooks in a grid-like view.

