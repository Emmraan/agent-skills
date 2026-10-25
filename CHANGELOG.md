# Changelog

All notable changes to this repository are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New `bulkpublish-social-publishing` skill in `marketing-growth`: adapts, reviews, schedules, and publishes approved social content through the BulkPublish REST API or hosted MCP server, with an explicit approval gate, draft-first flow, channel health checks, and rate-limit/timeout-dedup guardrails.
- Repository-level L2 (team/community) scaffold: `.gitignore`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md`, `.github/dependabot.yml`, `.github/pull_request_template.md`, and GitHub Actions CI (`validate` + `web` builds with path filters).
- husky pre-commit hook with lint-staged (`package.json`, `.husky/pre-commit`) that runs `validate-skills.mjs` on staged `SKILL.md` files. Install deps yourself with `pnpm install` at the repo root.
- New `creative-web-design` category with six skills and six references for Awwwards-level work: experience orchestration, effect-to-library selection, motion/scroll integration, WebGL/shaders, creative interactions, and runtime performance.
- New `change-friendly-code` skill in `testing-quality`: seven laws for code that is easier to understand, change, and trust — flat main paths, meaningful names, external-system boundaries, valid-by-construction states, decision/action separation, actionable errors, and focused diffs.
- New `security-baseline` skill in `devops-cloud`: a risk-tiered security entry point (L0–L5) that applies the mandatory L1 floor before feature work, audits for exploitable issues with severity and fix proposals, and raises concise in-task reminders when a change touches auth, permissions, payments, uploads, or secrets.

### Changed

- CI toolchain versions now have a single source of truth in the root `package.json`: Node 24 via `engines.node` and pnpm 12 via `packageManager`. Workflows read them with `node-version-file: package.json` and omit the pnpm `version` input, so the two can no longer disagree. `pnpm/action-setup` is pinned to v6.1.0, the first release that can bootstrap pnpm 12.
- Low-end machine rule: heavy installs/builds are the user's job (agent runs them only on request); fast commands (config writes, staged-file lint) auto-run. Applied in `repository-foundation-scaffold`, `saas-production-engineering`, and `docs/reference/tooling-speed-notes.md`.
