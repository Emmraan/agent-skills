# Contributing

Thanks for contributing to this skills collection. This guide covers how to run, test, and contribute skills, and the conventions this repo follows.

## Repository layout

- `skills/` — every skill lives in its own folder under a category folder (for example `skills/frontend-ui/react/`), and contains a `SKILL.md`.
- `web/` — optional React/Vite UI for browsing and installing skills (pnpm workspace).
- `scripts/validate-skills.mjs` — validates that the core skills meet the [agentskills.io](https://agentskills.io/specification.md) spec and pass prompt-injection hygiene.

## Running validation

```bash
node scripts/validate-skills.mjs
```

Expect `4/4 skills passed.` The script checks the core skills for valid frontmatter, description length, body line limit, and prompt-injection hygiene patterns.

## Building the web UI

```bash
cd web
pnpm install
pnpm dev          # local dev
pnpm build        # production build
```

`pnpm dev` and `pnpm build` regenerate `src/data/skills-index.json` and `skills.sh.json` from the skill folders, so a skill addition updates the index automatically.

## Adding or editing a skill

1. Create a new folder under the matching category in `skills/`, or edit an existing `SKILL.md`.
2. Frontmatter: `name` must match the folder name; `description` under 1024 characters.
3. Body under 500 lines; content in English. Larger skills split detail into optional `references/`, `scripts/`, and `assets/` folders.
4. Keep it a plain `SKILL.md` per the agentskills.io spec — no tool-specific files.
5. Run `node scripts/validate-skills.mjs` and confirm it still passes.

## Commit conventions

Use Conventional Commits:

- `feat: ...` for new skills or features.
- `fix: ...` for bug fixes.
- `docs: ...` for documentation.
- `chore: ...` for tooling and maintenance.

Keep commits atomic: one logical change per commit.

## Opening a PR

- Include a short summary of the change and representative examples where relevant.
- A PR must be checkable and reviewable: every changed skill passes `node scripts/validate-skills.mjs`, and web changes must build.
- Prefer small PRs; if a change touches both skills and the web UI, separate them where practical.

## Code of conduct

All contributions fall under the [Code of Conduct](CODE_OF_CONDUCT.md).
