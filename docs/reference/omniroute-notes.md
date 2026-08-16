# OmniRoute — Repository Reference Notes

Deep-analysis summary of `github.com/diegosouzapw/OmniRoute` (branch `release/v3.8.50`). Pure-OSS (MIT), npm workspaces monorepo. Serves as the reference for L2/L3 open-source scaffolding and release engineering.

## Stack & layout

- npm workspaces monorepo: `open-sse`, `packages/browser-pool` (and browser packages).
- `engines.node`: `>=22.22.2 <23 || >=24 <27`.
- `Makefile` wraps npm scripts (single entry for common tasks).

## Changelog workflow (do not edit CHANGELOG.md by hand)

- Contributors write fragments under `changelog.d/{features|fixes|maintenance}/<PR>-<slug>.md`.
- `scripts/release/aggregate-changelog.mjs` aggregates fragments into `CHANGELOG.md` at release time.
- Integrity gated by `check:changelog-integrity` — a PR that touches CHANGELOG.md directly fails.

## Quality ratchets

- Quality metrics tracked against `quality-baseline.json`; CI enforces `no-regression` (metrics may not get worse than baseline).
- Budget check `check:any-budget:t11` runs as a pre-commit gate.

## Git hooks (husky)

- `pre-commit`: lint-staged + `check-docs-sync.mjs` (docs stay in sync) + `check:any-budget:t11` + `check-tracked-artifacts.mjs`.
- `pre-push`: intentionally light (pushes shouldn't be slow); heavy gates live in CI.

## Merge queue (Mergify)

- `.mergify.yml` with `queue` action on `main`.
- Adding the `queue` label to a PR IS the merge approval — no manual merge button. CI must be green and reviews done.

## CI/CD workflow taxonomy (20+ workflows)

- `ci.yml`: change-classification via path filters; unit tests split into 8 shards for parallelism.
- `quality.yml`: fast gates run on both PR and release branches.
- Security: codeql, semgrep, scorecard, dast-smoke.
- `npm-publish.yml`: staged publishing — version, then publish with 2FA, SBOM, provenance, and a `boot-smoke` test of the installed artifact.
- `docker-publish.yml`: multi-arch builds; Trivy scan gates on CRITICAL findings (no critical → push).
- Nightly: `nightly-compat`, `nightly-llm-security`, `nightly-mutation`, `nightly-property`, `nightly-release-green`, `nightly-resilience`, `nightly-schemathesis` — run outside PR critical path.
- Dependabot: grouped updates to reduce PR noise; `ignore-major` for deps blocked by peer ranges.

## Secrets scanning

- `.gitleaks.toml` with `[extend] useDefault = true` — detects leaked keys before they reach remote.

## AI-agent context

- `AGENTS.md` is the single source of truth for AI agents (architecture, conventions, commands).
- `CLAUDE.md` / `GEMINI.md` exist as thin pointers back to `AGENTS.md` (no duplicated rules).

## Contributor-facing docs

- `CONTRIBUTING.md` redirects to `docs/ops/CONTRIBUTION_GOLDEN_PATH.md` — the full, maintained contribution guide lives in `docs/`.
- `SECURITY.md`: reports via GitHub Security Advisories, documented response timeline, supported versions table.
- `CODE_OF_CONDUCT.md`, `CODEOWNERS`, `FUNDING.yml`, `pull_request_template.md`, `ROADMAP.md`.

## Dockerfile practices

- Multi-stage build; `--mount=type=cache` for dependency caches; `--ignore-scripts` where possible; non-root user; healthcheck; CVE overlay applied in CI image.
- `.vscode/settings.json`: perf-tuned (watcherExclude for heavy dirs, tsserver memory bump to 4096MB) — file watching on heavy folders disabled to keep the editor fast.

## Key takeaways for skills

1. Changelog fragments + aggregated CHANGELOG = reviewable, conflict-free changelogs.
2. Merge queue (label = approval) beats merge-button discipline.
3. Fast gates on PR, heavy gates nightly — never block contributors on slow jobs.
4. Quality ratchets prevent regressions mechanically.
5. Secrets scan in pre-commit + CI (gitleaks).
6. AI context lives in ONE file (AGENTS.md); other AI files point at it.
