# PR Readiness & Submission Guide

> **Read this before opening a PR — human or AI agent.**
> This is the enforceable pre-submission checklist for this repo. `CONTRIBUTING.md` states the short rules; this file states the exact gates, commands, and evidence.
> If you are an AI agent working in this repo: follow this guide for every PR, and keep this guide in sync when you change the workflow (see §11).

## 1. Purpose and scope

This repo holds 180+ agent skills (`skills/**/SKILL.md`) plus an optional React/Vite browser UI (`web/`). There is no unit-test suite, no linter, no typechecker. The only automated gates are:

1. `scripts/validate-skills.mjs` — skill spec + prompt-injection hygiene + destructive-command safety + secret-values scan.
2. `web` build — `pnpm build` regenerates `src/data/skills-index.json` and `skills.sh.json`.

A PR is **predictable** when it passes those two gates plus the template, and **reviewable** when it is small, focused, and shows exactly what was run.

Sources: `CONTRIBUTING.md`, `.github/pull_request_template.md`, `.github/workflows/ci.yml`, `.github/workflows/web.yml`, `package.json`, `web/package.json`, `scripts/validate-skills.mjs`, `SECURITY.md`.

## 2. When to open a PR

Open when **all** apply:

- [ ] Purpose is single and clear (one skill, one fix, one UI change). — Recommended, `CONTRIBUTING.md:53`
- [ ] Changed skills pass validation locally (see §5). — Mandatory, `CONTRIBUTING.md:52`
- [ ] Web changes build locally if you touched `web/**` (see §5). — Mandatory, `CONTRIBUTING.md:52`
- [ ] PR template sections (Summary / Changes / Testing) are fillable truthfully. — Mandatory, `.github/pull_request_template.md`
- [ ] No secrets, no debug leftovers, no unrelated churn. — Mandatory, validator `SECRET_PATTERNS` + `SECURITY.md`

## 3. When NOT to open yet

Do not open if any apply:

- Validator fails on a changed skill (`FAIL` line). Fix first — CI runs the same script on the diff (`ci.yml:39-50`).
- `cd web && pnpm build` fails after a `web/**` change. Fix first — CI runs `pnpm install --frozen-lockfile` + `pnpm build` (`web.yml:29-30`).
- Skill spec violation you already know about: `name` ≠ folder, `description` ≥ 1024 chars, body ≥ 500 lines, non-English content. The validator will fail (`validate-skills.mjs:191-199`, `CONTRIBUTING.md:32-33`).
- You have not run the relevant command but plan to claim it passed. Never claim unrun checks.
- Security report (prompt-injection, exfiltration, leaked key) — do **not** open a public PR. Use the private advisory flow (`SECURITY.md:5`).

## 4. Decision procedure

| State | Meaning | Action |
|---|---|---|
| **READY TO OPEN** | §5 mandatory BEFORE_PR items pass for your change type (§6); diff is clean (§7); description is complete (§8) | Open, fill template, monitor CI |
| **NOT READY — ACTION REQUIRED** | A mandatory item fails or a known defect remains | Resolve the listed blocker, re-run, then open |
| **NEEDS CLARIFICATION** | A rule cannot be verified from repo evidence (marked NOT VERIFIED below) | Ask a maintainer; do not guess. Do not block on optional polish |

Optional polish or post-merge work never makes a PR NOT READY.

## 5. Universal pre-submission checklist (BEFORE_PR)

Run top to bottom. Stop at the first failure.

### G1 — Validation (skills changes)

- [ ] Changed skills pass the validator.
- Classification: **Mandatory** · Stage: **BEFORE_PR** · Applies when: any `skills/**/SKILL.md`, `references/`, `scripts/`, or `scripts/validate-*` changed.
- Command (use exactly this, from repo root):
  ```bash
  node scripts/validate-skills.mjs <paths-to-changed-SKILL.md>
  # full sweep when validator/grandfather changed or when unsure:
  node scripts/validate-skills.mjs --all
  ```
- Expected: `PASS` per skill, exit 0. `WARN … grandfathered` is acceptable only for entries already in `scripts/validate-grandfather.json`. Baseline with no args: `4/4 skills passed.`
- If fails: read the `FAIL` lines (`frontmatter:`, `hygiene:`, `safety:`, `secret:`), fix the skill, re-run. Do not add new grandfather entries without maintainer review (`validate-grandfather.json:2`).
- Source: `CONTRIBUTING.md:17,36,52`, `.github/pull_request_template.md:11`, `.github/workflows/ci.yml:39-50`, `package.json:6`.

### G2 — Web build (UI changes)

- [ ] Web UI builds.
- Classification: **Mandatory** · Stage: **BEFORE_PR** · Applies when: any `web/**` changed.
- Commands (from `web/`; CI reads Node and pnpm versions from the root `package.json` — currently Node 24 and pnpm 12):
  ```bash
  cd web
  pnpm install --frozen-lockfile
  pnpm build
  ```
- Expected: exit 0. Note: `pnpm dev`/`pnpm build` regenerate `src/data/skills-index.json` and repo-root `skills.sh.json` (`web/package.json:7-9`, `web/scripts/generate-index.mjs:125-143`) — commit those regenerated files when a skill add/rename affects the index; do not hand-edit generated output.
- If fails: fix, rebuild. Per repo low-end-machine rule (`CHANGELOG.md:14`), heavy installs/builds are the user's job — an AI agent runs them only on request or when the PR requires the evidence.
- Source: `CONTRIBUTING.md:25-28,52`, `.github/pull_request_template.md:12`, `.github/workflows/web.yml:29-30`.

### G3 — Skill spec compliance

- [ ] `name` matches folder name; `description` < 1024 chars; body < 500 lines; English; plain `SKILL.md`, detail split into `references/`/`scripts/`/`assets/`.
- Classification: **Mandatory** · Stage: **BEFORE_PR** · Applies when: skill added/edited.
- Verify: G1 covers it automatically (`validate-skills.mjs:189-199`). No separate command.
- If fails: rename frontmatter or folder, shorten description/body, move detail to `references/`.
- Source: `CONTRIBUTING.md:32-35`, `README.md:9-10`, `scripts/validate-skills.mjs:189-199`.

### G4 — Safety & secrets

- [ ] No hardcoded secret values; no unsafe destructive commands without an adjacent approval note; no prompt-injection / instruction-override / exfiltration language.
- Classification: **Mandatory** · Stage: **BEFORE_PR** · Applies when: always (validator scans every line).
- Verify: G1 covers it. Secret patterns: `bp_*`, `sk-ant-*`, `gh[pousr]_*`, `xox[abp]-*`, `AKIA*`, `PRIVATE KEY` (`validate-skills.mjs:69-76`). Safety patterns: `rm -rf /~`, `curl|wget … | sh`, `sudo rm/mv/dd/…`, `kubectl delete … --all`, `terraform destroy/apply -auto-approve` — each needs a nearby `SAFETY:` / explicit-approval / testing-only note within ±8 lines (`validate-skills.mjs:57-65,143-148`). Hygiene patterns: `ignore/disregard/override … instructions`, `forget everything above`, `exfiltrat`, `upload/send logs|data|keys` (`validate-skills.mjs:41-52`).
- Placeholders (`YOUR_API_KEY`, `$VAR`, `${…}`, `...`, `REDACTED`, `EXAMPLE`) never trigger the secret scan — use them in docs.
- If fails: remove the secret (rotate if ever committed), rephrase to defensive framing ("do not … without approval", "monitor/detect/prevent …"), or add the approval note. Never paste a real secret into the PR to "prove it works".
- Source: `scripts/validate-skills.mjs:35-111,150-165,201-223`, `docs/reference/DECISIONS.md:17`, `SECURITY.md:14,23`.

### G5 — Commits & template

- [ ] Commits use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`), one logical change per commit; PR fills Summary / Changes / Testing.
- Classification: **Mandatory** (policy wording is "Use" / template headings) · Stage: **BEFORE_PR**.
- Verify: manual — `git log --oneline -5`, check PR preview renders the three headings.
- Source: `CONTRIBUTING.md:40-53`, `.github/pull_request_template.md:1-13`.

### G6 — Diff hygiene

- [ ] `git status` + `git diff` show only intended files; no debug output, temp files, local env files, or unrelated formatting churn; base branch is `main`.
- Classification: **Mandatory** · Stage: **BEFORE_PR**.
- Verify: manual. Current base branch: `main` (verified via `git branch --show-current`).
- Source: `AGENTS.md` surgical-changes rule; `CONTRIBUTING.md:53`.

### G7 — Docs & changelog (conditional)

- [ ] Install/usage docs updated when behavior changed; `CHANGELOG.md` `[Unreleased]` entry for notable changes.
- Classification: **Conditional** · Stage: **BEFORE_PR** · Applies when: install commands, usage, categories, or user-visible behavior changed.
- Verify: manual — check `README.md`, `SKILLS_CATEGORIES.md`, `SKILLS_INSTALLATION_GUIDE.md`, `skills.sh.json` (generated — see G2), `CHANGELOG.md:3-5` (Keep a Changelog + SemVer).
- Source: `.github/pull_request_template.md:13`, `CHANGELOG.md:3-9`.

## 6. Change-type checklists

Do §5 plus only the block that matches your change. Skip the rest.

### T1 — New / edited skill

1. Folder `skills/<category>/<skill-name>/SKILL.md`, frontmatter `name` = folder name. — Mandatory, G3.
2. Representative example included in PR or skill body where relevant. — Recommended, `CONTRIBUTING.md:51`.
3. `references/`/`scripts/`/`assets/` scanned too — same hygiene/safety/secret rules apply to siblings with extensions `.md/.sh/.js/.py/.yml/` etc. (`validate-skills.mjs:97-111,217-223`). — Mandatory.
4. No new `validate-grandfather.json` entry without maintainer approval. — Mandatory.
5. Evidence in PR: paste the `PASS <path>` lines for changed skills.

### T2 — Validator / scripts change (`scripts/**`)

1. Run the full sweep: `node scripts/validate-skills.mjs --all` — CI does this whenever `scripts/validate-skills.mjs` or `validate-grandfather.json` changes (`ci.yml:44-45`). — Mandatory.
2. Explain the rule change in PR Summary; call out any new failure modes for existing skills. — Mandatory (reviewability).
3. Update this guide (§11) if the gate behavior changed. — Mandatory (see §11).

### T3 — Web UI change (`web/**`)

1. `pnpm build` passes (G2). — Mandatory.
2. If skills were added/renamed, confirm `src/data/skills-index.json` + `skills.sh.json` diffs are included and generated, not hand-edited. — Conditional.
3. Dependency change: `web/pnpm-lock.yaml` consistent (`--frozen-lockfile` in CI); Dependabot covers `web` npm + Actions weekly (`.github/dependabot.yml`). — Conditional.
4. Evidence in PR: paste build tail (e.g. `Indexed N skills…`, `vite build … built in …`).

### T4 — Docs / category / install-guide only

1. No validator or build run required unless you touched skills or `web/**` (CI path filters: `ci.yml:6-26`, `web.yml:4-12`). — Conditional.
2. Install commands copy-pasteable; category lists match `skills.sh.json` groupings. — Mandatory (reviewability).
3. Evidence: state "docs-only, no skill/web paths touched" in Testing section.

## 7. Before merging (BEFORE_MERGE, after PR is open)

- [ ] CI green: `Validate skills` (path-filtered per §5/G1) and `Build web UI` (only on `web/**` changes). Path-filtered workflows may not run on docs-only PRs — that is expected.
- [ ] Maintainer review addressed; re-run G1/G2 after every push and paste fresh results.
- [ ] Final `git diff origin/main...HEAD` re-checked for accidental files.
- [ ] NOT VERIFIED from repo evidence — confirm with maintainer if needed: required approval count, CODEOWNERS (no `CODEOWNERS` file found), branch protection / required-checks settings, merge queue, signed commits. A workflow running on PRs does not prove it is a required status check.

## 8. PR description requirements

Reuse the template — do not delete its headings (`.github/pull_request_template.md`):

```markdown
## Summary
<!-- What changes and why. One paragraph. Link issue if exists (optional — issue linkage is NOT mandated by repo policy). -->

## Changes
- <!-- bullet per logical change; flag breaking changes, API/install changes, generated-file updates -->

## Testing
- [ ] `node scripts/validate-skills.mjs` passes on changed skills (`--all` for the full sweep)
- [ ] Web UI changes: `cd web && pnpm build` passes
- [ ] Docs updated if the change affects installation or usage
<!-- Paste actual PASS lines / build tail. Never tick a box for a command you did not run. -->
```

Add when applicable: behavior impact, security implications, migration notes, known limitations, screenshots for UI changes.

## 9. Post-submission responsibilities

1. Watch CI; fix validator/build failures in the same PR.
2. Respond to review feedback; keep PRs small — split skills vs. web changes where practical (`CONTRIBUTING.md:53`).
3. Do not bundle unrelated refactors.
4. Security follow-up privately if a reviewer flags a hygiene/secret issue (`SECURITY.md:5-7`).

## 10. Exception & escalation

- Grandfather exception: only via `scripts/validate-grandfather.json`, requires maintainer review (file header). Do not invent new entries silently.
- Security exception: never public — private advisory flow, ack within 5 business days (`SECURITY.md:16-18`).
- Policy conflict / unknown rule (NOT VERIFIED items in §7): ask a maintainer in the PR; do not treat an inferred convention as policy.
- No documented general-waiver process exists — if you need one, request it in the PR and let maintainers define it.

## 11. Guide maintenance (AI agents and humans)

This guide goes stale when the workflow changes. Keep it current in the same PR:

- **Must update this file when the PR changes:** validator rules (`scripts/validate-skills.mjs`), grandfather policy, CI paths/commands (`ci.yml`, `web.yml`), PR template, package scripts (`package.json`, `web/package.json`), skill spec limits, commit conventions, or generated-index behavior (`generate-index.mjs`). — Mandatory, applies to the PR that makes the change.
- **How:** edit the affected checklist item (command, expected result, source path + line), keep Mandatory vs Conditional vs Recommended labels honest, mark anything unverifiable as NOT VERIFIED.
- **Verify:** `git diff --name-only origin/main...HEAD` includes `docs/contributing/pr-readiness.md` alongside the workflow/script change; reviewer confirms the new command was copy-pasted from the changed config, not invented.
- Low-end-machine rule reminder: don't run heavy `pnpm install`/`pnpm build` unprompted on a user's machine; do run them when the PR needs the evidence (`CHANGELOG.md:14`).

## 12. Maintainer policy & evidence report

| # | Requirement | Class | Stage | Source | Verify |
|---|---|---|---|---|---|
| M1 | Changed skills pass validator | Mandatory | BEFORE_PR | `CONTRIBUTING.md:52`, `pull_request_template.md:11`, `ci.yml:39-50` | `node scripts/validate-skills.mjs <files>` → exit 0 |
| M2 | Web changes build | Mandatory | BEFORE_PR | `CONTRIBUTING.md:52`, `pull_request_template.md:12`, `web.yml:29-30` | `cd web && pnpm build` → exit 0 |
| M3 | Template Summary/Changes/Testing filled | Mandatory | BEFORE_PR | `pull_request_template.md:1-13` | PR preview |
| M4 | Conventional Commits, atomic | Mandatory | BEFORE_PR | `CONTRIBUTING.md:40-47` | `git log` |
| M5 | No secrets / hygiene / safety pass | Mandatory | BEFORE_PR | `validate-skills.mjs:35-96`, `SECURITY.md` | G1 |
| M6 | Spec: name=folder, desc<1024, body<500, English | Mandatory | BEFORE_PR | `validate-skills.mjs:189-199`, `CONTRIBUTING.md:32-33` | G1 |
| C1 | Docs updated if install/usage affected | Conditional | BEFORE_PR | `pull_request_template.md:13` | manual |
| C2 | Generated index committed when skills change | Conditional | BEFORE_PR | `web/package.json:7-9`, `generate-index.mjs:125-143` | `git status` |
| C3 | Destructive cmds need approval note | Conditional | BEFORE_PR | `validate-skills.mjs:54-65` | G1 |
| R1 | Small focused PRs; split skills vs web | Recommended | BEFORE_PR | `CONTRIBUTING.md:53` | manual |
| R2 | Husky+lint-staged on staged `SKILL.md` | Recommended | BEFORE_PR | `package.json:12-14`, `.husky/pre-commit`, `CHANGELOG.md:10` | auto on commit after `pnpm install` |
| U1 | Approvals / CODEOWNERS / branch protection / merge queue / signed commits | Unknown (NOT VERIFIED) | BEFORE_MERGE | no file found; no `CODEOWNERS` | ask maintainer |

Existing policy vs proposal: everything Mandatory above is existing policy. Proposed (not yet policy, needs maintainer approval): §11 self-update rule, §10 escalation wording, automation ideas in §14. Conflicts found: none — `AGENTS.md`/`CLAUDE.md` surgical-change guidance aligns with small-PRs rule. Gaps: no documented approval count, no CODEOWNERS, no coverage requirement (correctly absent — no test framework), no secret-scanning beyond the validator's value-patterns (names/placeholders intentionally not matched).

## 13. Quick check (copy into PR or run mentally)

```markdown
- [ ] `node scripts/validate-skills.mjs <changed-SKILL.md>` → PASS (or `--all` if validator changed)
- [ ] `cd web && pnpm build` → pass (only if `web/**` touched)
- [ ] Template Summary/Changes/Testing filled with real results
- [ ] Conventional, atomic commits; base `main`; diff contains only intended files
- [ ] No secrets; destructive cmds have SAFETY note; docs/CHANGELOG updated if user-visible
- [ ] If workflow/validator changed → this guide updated in the same PR (§11)
```

## 14. Automation opportunities (proposals — maintainer approval required)

1. **PR checklist bot** echoing §13 on every PR. Benefit: predictable submissions. Scope: small Actions workflow. Approval: yes.
2. **Grandfather-diff guard**: fail if `validate-grandfather.json` gains entries without `maintainer-review` label. Benefit: prevents silent waivers. Scope: small job in `ci.yml`. Approval: yes.
3. **Generated-index drift check**: fail `web` job if `skills.sh.json`/`skills-index.json` differ from a fresh `pnpm build`. Benefit: catches hand-edits. Scope: `git diff --exit-code` step. Approval: yes.
4. **Conventional-commit lint** (e.g. commitlint + husky). Benefit: enforces existing `CONTRIBUTING.md` rule. Scope: new devDependency + config. Approval: yes (adds tooling).
5. **Secret scanning beyond value-patterns** (e.g. GitHub secret scanning / push protection). Benefit: validator only matches high-entropy values, not all leak shapes. Scope: repo settings. Approval: yes.

Do not implement automation in this task — proposals only.

## 15. References

- `CONTRIBUTING.md` — contribution rules, validation command, commit conventions, PR rules
- `.github/pull_request_template.md` — required PR sections
- `.github/workflows/ci.yml` — skill validation gate (path-filtered)
- `.github/workflows/web.yml` — web build gate (Node 24, pnpm 12, both pinned in `package.json`)
- `.github/workflows/sweep.yml` — weekly full sweep (informational, not a PR gate)
- `scripts/validate-skills.mjs` — exact spec/hygiene/safety/secret rules
- `scripts/validate-grandfather.json` — legacy waivers (maintainer review only)
- `SECURITY.md` — private reporting, skill-content scope
- `CODE_OF_CONDUCT.md` — community standards
- `AGENTS.md` / `CLAUDE.md` — surgical-change, simplicity rules for agents
- `CHANGELOG.md` — Keep a Changelog + SemVer, low-end-machine rule
- `web/package.json`, `web/scripts/generate-index.mjs` — index generation
