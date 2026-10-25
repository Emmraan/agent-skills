# Changelog

All notable changes to this repository are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Repository-level L2 (team/community) scaffold: `.gitignore`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md`, `.github/dependabot.yml`, `.github/pull_request_template.md`, and GitHub Actions CI (`validate` + `web` builds with path filters).
- husky pre-commit hook with lint-staged (`package.json`, `.husky/pre-commit`) that runs `validate-skills.mjs` on staged `SKILL.md` files. Install deps yourself with `pnpm install` at the repo root.
- New `creative-web-design` category with six skills and six references for Awwwards-level work: experience orchestration, effect-to-library selection, motion/scroll integration, WebGL/shaders, creative interactions, and runtime performance.
- New `change-friendly-code` skill in `testing-quality`: seven laws for code that is easier to understand, change, and trust — flat main paths, meaningful names, external-system boundaries, valid-by-construction states, decision/action separation, actionable errors, and focused diffs.
- New `security-baseline` skill in `devops-cloud`: a risk-tiered security entry point (L0–L5) that applies the mandatory L1 floor before feature work, audits for exploitable issues with severity and fix proposals, and raises concise in-task reminders when a change touches auth, permissions, payments, uploads, or secrets.

### Changed

- Low-end machine rule: heavy installs/builds are the user's job (agent runs them only on request); fast commands (config writes, staged-file lint) auto-run. Applied in `repository-foundation-scaffold`, `saas-production-engineering`, and `docs/reference/tooling-speed-notes.md`.
