# Agent Skills

A collection of `SKILL.md` documents that define capability modules for AI agents. It holds 160+ skills across version control, security, monitoring, frontend engineering, and other areas, including curated third-party skills (for example `create-website`, `high-perf-browser`, and the addyosmani engineering-workflow set) and skills authored by Emmraan (for example `seo`, `cloud`, `markdown-for-agents`).

Each skill folder contains a `SKILL.md` file that documents the skill's purpose, activation signals, behavior, and usage guidance for an AI agent.

## Repository structure

- `skills/` — all skill folders live under this directory, grouped into category folders. Each skill lives one level down, for example `skills/frontend-ui/react/`, `skills/devops-cloud/security/`, `skills/marketing-growth/seo/`, `skills/databases-data/database-architecture/`, etc.
- Every `SKILL.md` follows the [agentskills.io](https://agentskills.io/specification.md) spec: frontmatter `name` matching the folder, a `description` under 1024 chars, a body under 500 lines, content in English. Larger skills split detail into optional `references/`, `scripts/`, and `assets/` folders; smaller skills keep everything in the single `SKILL.md`.

## How to use

- Browse a category folder, then open a skill's `SKILL.md` to read its intent, activation signals, and example interactions.
- These skills are written to be consumed by an AI agent: they include guidance the agent should follow when that capability is activated.

## Design: loop engineering and user experience

- The lifecycle skills are engineered as **loops** — each phase runs with a deterministic exit condition, an iteration budget, and maker/checker verification, so a task stops on evidence, not on the agent "feeling done".
- The **user experience** is deliberately paired with that engineering: a user drops one prompt, approves the plan once, and the agent runs the rest of the lifecycle autonomously — then returns a delivery report. Two moments of engagement, everything between is unattended.
- The entry point for this model is the [`loop-orchestrator`](skills/agent-meta/loop-orchestrator/SKILL.md) skill. It scales itself to the task: trivial fixes execute directly, while full app/project work runs the complete DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP lifecycle with every quality gate.
- All skills stay portable: plain `SKILL.md` per the [agentskills.io](https://agentskills.io/specification.md) spec, no tool-specific files, so they work in any agent that supports skills.

## Skills by category

- Install every skill in a category with a single command: `npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/<category>` (the CLI resolves a category folder as a source and installs all skills under it).
- To install the whole collection, or browse and pick skills individually, run: `npx skills add https://github.com/Emmraan/agent-skills`
- See [SKILLS_CATEGORIES.md](SKILLS_CATEGORIES.md) for the install command of every category.
- New to the repo? See [SKILLS_INSTALLATION_GUIDE.md](SKILLS_INSTALLATION_GUIDE.md) for an auto-install master prompt and a manual project-type guide that installs only the skills you need.

### Frontend & UI

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/frontend-ui
```

### Animation & WebGL

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/animation-webgl
```

### Backend & APIs

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/backend-apis
```

[Browse all categories](SKILLS_CATEGORIES.md)

## Example: add a skill via the `skills` CLI

You can pull skills from a Git repository using the `skills` CLI. Example usage:

```bash
# Add a specific skill from a repository
npx skills add https://github.com/Emmraan/agent-skills --skill frontend-core

# Add the markdown-for-agents skill (makes built websites AI-agent-friendly)
npx skills add https://github.com/Emmraan/agent-skills --skill markdown-for-agents

# Example (fetch the `find-skills` skill from Vercel Labs' skills repo):
npx skills add https://github.com/vercel-labs/skills --skill find-skills

# To view all commands:
npx skills --help
```

Documentation: For full CLI options and usage, see the [skills.sh docs](https://skills.sh/docs).

## Contributing

- To add a new skill, create a new folder inside the matching category folder under `skills/`, named for the skill, and add a `SKILL.md` file.
- `SKILL.md` should include a short frontmatter (name and description) and sections describing: when to use the skill, expected inputs, outputs, and example dialogues or actions.
- Follow the style of existing `SKILL.md` files: clear intent, concrete instructions, and example usage patterns.
- Open a pull request and include a short summary of the new skill and representative examples.

## License and contact

- This repository is licensed under the [MIT License](/LICENSE)
- For questions about structure or contributions, open an issue in this repository.

## Acknowledgements

This collection centralizes capability specifications to make it easier to extend and maintain agent behavior across domains.
