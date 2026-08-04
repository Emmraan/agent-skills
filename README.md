# Agent Skills

This repository collects well-structured `SKILL.md` documents that define capability modules ("SKILL") for AI agents, for example: version control, security, monitoring, frontend engineering, and more. It currently holds 130+ skills, including both curated third-party skills (e.g. `create-website`, `high-perf-browser`) and skills authored by Emmraan (e.g. `seo`, `cloud`, `markdown-for-agents`).

Each top-level folder represents a domain area and contains a `SKILL.md` file that documents the skill's purpose, activation signals, behavior, and usage guidance for an AI agent.

Repository structure
- `skills/` — all skill folders live under this directory. Each domain is a subfolder, for example `skills/frontend-core/`, `skills/security/`, `skills/monitoring/`, `skills/database-architecture/`, `skills/markdown-for-agents/`, etc.
- Every `SKILL.md` follows the [agentskills.io](https://agentskills.io/specification.md) spec: frontmatter `name` matching the folder, a `description` under 1024 chars, a body under 500 lines, content in English. Larger skills split detail into optional `references/`, `scripts/`, and `assets/` folders; smaller skills keep everything in the single `SKILL.md`.

How to use
- Browse a domain folder and open its `SKILL.md` to read the skill's intent, activation signals, and example interactions.
- These skills are written to be consumed by an AI agent: they include guidance the agent should follow when that capability is activated.

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
- To add a new skill, create a new folder inside the `skills/` folder, named for the domain, and add a `SKILL.md` file.
- `SKILL.md` should include a short frontmatter (name and description) and sections describing: when to use the skill, expected inputs, outputs, and example dialogues or actions.
- Follow the style of existing `SKILL.md` files: clear intent, concrete instructions, and example usage patterns.
- Open a pull request and include a short summary of the new skill and representative examples.

License & contact
- This repository is licensed under the [MIT License](/LICENSE)
- For questions about structure or contributions, open an issue in this repository.

Acknowledgements
- This collection centralizes capability specifications to make it easier to extend and maintain agent behavior across domains.