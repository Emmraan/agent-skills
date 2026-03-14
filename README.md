# Agent-Skills

This repository collects well-structured `SKILLS.md` documents that define capability modules ("skills") for AI agents for example: version control, security, monitoring, frontend engineering, and more.

Each top-level folder represents a domain area and contains a `SKILLS.md` file that documents the skill's purpose, activation signals, behavior, and usage guidance for an AI agent.

Repository structure
- `skills/` all skill folders live under this directory. Each domain is a subfolder, for example `skills/frontend-core/`, `skills/security/`, `skills/monitoring/`, `skills/database-architecture/`, etc.

How to use
- Browse a domain folder and open its `SKILLS.md` to read the skill's intent, activation signals, and example interactions.
- These SKILLS are written to be consumed by an AI agent: they include guidance the agent should follow when that capability is activated.

Example: add skills via the `skills` CLI

You can pull skills from a Git repository using the `skills` CLI. Example usage:

```bash
# Add a specific skill from repo
npx skills add https://github.com/Emmraan/agent-skills --skill frontend-core

# Example (fetch the `find-skills` skill from Vercel Labs' skills repo):
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

Documentation: For full CLI options and usage, see https://skills.sh/docs

Contributing
- To add a new skill, create a new folder inside `skills` folder, named for the domain and add a `SKILLS.md` file.
- `SKILLS.md` should include a short frontmatter (name and description) and sections describing: when to use the skill, expected inputs, outputs, and example dialogues or actions.
- Follow the style of existing `SKILLS.md` files: clear intent, concrete instructions, and example usage patterns.
- Open a pull request and include a short summary of the new skill and representative examples.

License & contact
- This repository is licensed under the [MIT License](/LICENSE)
- For questions about structure or contributions, open an issue in this repository.

Acknowledgements
- This collection centralizes capability specifications to make it easier to extend and maintain agent behavior across domains.