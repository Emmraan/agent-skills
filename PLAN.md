# PLAN — Phase 6: Level THIS repo (skills collection)

Phases 0-5 are complete and merged into `main`. This branch (`chore/setup-repo-level`) applies the just-built skills to the repo itself.

## Success criteria

Both tasks below have an exit check. Phase 6 is complete only when both pass.

## Task 1 — Branch ready (done)

- Branch `chore/setup-repo-level` created off `main`.
- Exit: branch exists; `main` contains all Phase 0-5 work.

## Task 2 — Apply the matching level's setup

1. Load skill `repository-foundation-scaffold` (skills/agent-meta/repository-foundation-scaffold).
2. Run **Level Detection** against this repo:
   - Signals: solo vs team, public OSS vs closed SAAS vs open-core, expected users, billing/tenancy needs, release/distribution needs.
   - Expected result: this is a public OSS-style skills collection (no billing/tenancy, no multi-arch Docker, no SaaS). Likely L2 (community/team), possibly L1 if solo-only.
3. Apply the detected level's scaffold checklist from the skill:
   - L1: README, LICENSE, .gitignore, one basic CI (lint+test). No husky/CHANGELOG/CONTRIBUTING.
   - L2: adds CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, CHANGELOG, dependabot, PR workflows, husky pre-commit.
   - L3: not expected for this repo (no billing, no multi-arch release).
4. Respect the skill's low-end-machine rule (ask the user before heavy installs/builds).
5. Commit the applied setup on this branch.
- Exit: repo has the correct-level setup per the skill; documented in the PR description.

## Execution notes

- Follow AGENTS.md: no speculative features, surgical changes, minimal code.
- All content in English. No emojis unless the user asks.
- Do NOT push or open a PR until the user asks.