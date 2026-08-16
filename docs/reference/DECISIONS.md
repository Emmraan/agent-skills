# Decision Freeze — Skill Development Plan

Frozen at Phase 0. These decisions are locked and referenced by every skill; no scope creep beyond them.

## The 4 decisions

1. **4 skills**, English content, `references/` optional (SKILL.md must stay fully usable standalone), placement:
   - `skills/agent-meta/repository-foundation-scaffold/` — level-based (L1/L2/L3), includes low-end-machine rule and ultra-fast local dev matrix.
   - `skills/agent-meta/open-source-project-maintainer/` — OSS governance + release propagation.
   - `skills/devops-cloud/github-actions-engineering/` — CI/CD workflow engineering.
   - `skills/devops-cloud/saas-production-engineering/` — paid-product / closed-SaaS production practices.

2. **Level-based setup**: full enterprise setup is ONLY for L3 (future PASS/SAAS) projects. L1 (solo) gets minimal files; L2 (team/community) gets the standard governance set. Every scaffold decision maps to the project's level, never to a fixed "all projects get everything".

3. **Ultra-fast local dev** is a hard requirement for L3: typecheck/lint/test/build must be fast in local dev (see `docs/reference/tooling-speed-notes.md`). Fast tools are opt-in where experimental; proven tools remain the default.

4. **Safety/hygiene**: skills must pass SkillSpector prompt-injection hygiene — no instruction-override language, no data-exfiltration requests, no scripts that move data off the machine. No emojis in skill content.

## References

- `docs/reference/omniroute-notes.md` — pure-OSS (MIT) npm monorepo, release engineering.
- `docs/reference/dokploy-notes.md` — open-core pnpm monorepo, dual-license, multi-arch release.
- `docs/reference/tooling-speed-notes.md` — fast-tool matrix + low-end-machine rules.
