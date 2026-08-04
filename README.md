# Agent Skills

This repository collects well-structured `SKILL.md` documents that define capability modules ("SKILL") for AI agents, for example: version control, security, monitoring, frontend engineering, and more. It currently holds 140+ skills, including both curated third-party skills (e.g. `create-website`, `high-perf-browser`, the addyosmani engineering-workflow set), skills authored by Emmraan (e.g. `seo`, `cloud`, `markdown-for-agents`), and more.

Each skill folder contains a `SKILL.md` file that documents the skill's purpose, activation signals, behavior, and usage guidance for an AI agent.

Repository structure
- `skills/` — all skill folders live under this directory, grouped into category folders. Each skill lives one level down, for example `skills/frontend-ui/react/`, `skills/devops-cloud/security/`, `skills/marketing-growth/seo/`, `skills/databases-data/database-architecture/`, etc.
- Every `SKILL.md` follows the [agentskills.io](https://agentskills.io/specification.md) spec: frontmatter `name` matching the folder, a `description` under 1024 chars, a body under 500 lines, content in English. Larger skills split detail into optional `references/`, `scripts/`, and `assets/` folders; smaller skills keep everything in the single `SKILL.md`.

How to use
- Browse a category folder, then open a skill's `SKILL.md` to read its intent, activation signals, and example interactions.
- These skills are written to be consumed by an AI agent: they include guidance the agent should follow when that capability is activated.

Skills by category
- Install every skill in a category with a single command: `npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/<category>` (the CLI resolves a category folder as a source and installs all skills under it).
- To install the whole collection, or browse and pick skills individually, run: `npx skills add https://github.com/Emmraan/agent-skills`

Frontend & UI

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/frontend-ui
```

Animation & WebGL

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/animation-webgl
```

Backend & APIs

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/backend-apis
```

Languages

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/languages
```

Databases & Data

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/databases-data
```

AI & Machine Learning

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/ai-ml
```

DevOps & Cloud

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/devops-cloud
```

Testing & Quality

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/testing-quality
```

Design & UX

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/design-ux
```

Marketing & Growth

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/marketing-growth
```

Agent & Meta

```bash
npx skills add https://github.com/Emmraan/agent-skills/tree/main/skills/agent-meta
```

Example: add a skill via the `skills` CLI

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

Contributing
- To add a new skill, create a new folder inside the matching category folder under `skills/`, named for the skill, and add a `SKILL.md` file.
- `SKILL.md` should include a short frontmatter (name and description) and sections describing: when to use the skill, expected inputs, outputs, and example dialogues or actions.
- Follow the style of existing `SKILL.md` files: clear intent, concrete instructions, and example usage patterns.
- Open a pull request and include a short summary of the new skill and representative examples.

License & contact
- This repository is licensed under the [MIT License](/LICENSE)
- For questions about structure or contributions, open an issue in this repository.

Acknowledgements
- This collection centralizes capability specifications to make it easier to extend and maintain agent behavior across domains.