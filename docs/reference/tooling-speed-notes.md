# Tooling Speed & Low-End Machine Notes

Research summary (web + repo analysis) for keeping `typecheck`, `lint`, `test`, and `build` ultra-fast in local development, plus rules for low-end machines. Source material: cpojer.net "Fastest Frontend Tooling", nodewire.net TS/Node setup 2026, webdev.cloud/devtools.cloud dev-env guides, secure-local-dev-env, and OmniRoute/Dokploy CI observations.

## Speed-first principles

1. **Separate jobs.** Type-checking must never block the dev loop. Run typecheck on commit/CI, not in the hot reload path. Dev runner (tsx) and typechecker (tsc/tsgo) are different jobs.
2. **Measure before optimizing.** Benchmark cold vs warm runs with `hyperfine` (p50/p95). Do not guess whether I/O, CPU, or memory is the bottleneck.
3. **Cache aggressively.** `incremental: true` in tsconfig (second `tsc --noEmit` drops from ~4s to ~0.9s on a 12k-line codebase); pnpm content-addressed store; BuildKit cache mounts; vitest cache.
4. **Parallelize only what is safe.** `npm-run-all2 --parallel` runs scripts concurrently (exits on first failure, clean Ctrl+C). Don't oversubscribe cores on small machines.
5. **Run fast gates on PR, heavy gates nightly.** Never block contributors on slow jobs (OmniRoute: 8 unit shards on PR, mutation/property/schemathesis nightly).
6. **Scoped runs.** lint-staged runs only staged files; pnpm `--filter` builds only changed packages; tsconfig references keep typecheck scoped.

## Toolchain matrix (fast tool → replaces → fallback)

| Job | Fast tool | Replaces | Fallback / notes |
|---|---|---|---|
| Typecheck | `tsgo` (`@typescript/native-preview`, TS Go rewrite, ~10x faster, opt-in/experimental) | `tsc` | `tsc --noEmit` + `incremental: true` is the safe default; adopt tsgo only when it stays stable |
| Dev runner | `tsx` (~150ms cold) | `ts-node` (~900ms), `nodemon`+`tsc --watch` | Node 24 native type-stripping for one-off scripts; `tsx watch` for dev servers |
| Lint | Biome or Oxlint (Rust-based, can run ESLint plugins via NAPI shim) | ESLint+Prettier pair | ESLint 9 flat config when plugin ecosystem is required (e.g. React Compiler) |
| Format | `oxfmt` / Biome | Prettier | Keep ONE formatter; disable others in the editor |
| Build | tsdown / Vite (Rolldown) / tsup / SWC | esbuild hand-rolling, slow webpack | `tsc` alone for plain Node services (build ≈ typecheck) |
| Test | vitest (watch + cache, vite config reuse) | jest | run only changed files; parallel shards in CI |
| Parallel scripts | `npm-run-all2` | sequential `&&` chains | exits fast on failure |
| Measure | `hyperfine` | guessing | benchmark cold vs warm, p50/p95 |

## Editor / IDE speed

- `.vscode/settings.json`: `files.watcherExclude` for `node_modules`, `.git`, `dist`, `.next` (file watching is slow, especially on Windows); bump tsserver memory (`typescript.tsserver.maxTsServerMemory: 4096`); disable overlapping formatters/linters.
- Pin runtime versions (`.nvmrc`, `engines.node`, `packageManager`) so everyone runs the same Node + package manager.
- One package manager per repo; commit the lockfile (`pnpm-lock.yaml`).

## Low-end machine rules

Detect the machine (RAM, cores) before running heavy work. Never silently run a long command on a low-end system.

1. **Defer heavy installs/builds to the user.** `pnpm install`, Docker image builds, full monorepo builds on a low-end machine: ask the user to run them, or run them one at a time with output shown.
2. **Container-isolated deps.** Best pattern (secure-local-dev-env): deps install inside a `deps` profile container; the host needs no Node/pnpm — low-end host stays light. `just deps` handles it.
3. **Lightweight tools.** Prefer pnpm (content-addressed store dedupes disk) over npm; prefer Biome/Oxlint over heavy ESLint configs; skip Docker entirely for simple projects.
4. **Disk hygiene.** `pnpm store prune`, `npm cache verify`, `docker system prune` on a schedule; move ephemeral build dirs to fast NVMe/tmpfs if I/O-bound.
5. **Watch resource limits.** Containers with too much CPU/memory allocation slow the whole machine; keep file-watcher scope minimal.
6. **Never block on parallel heavy jobs.** On low-end, run check/lint/typecheck sequentially instead of `--parallel`.
7. **Clean checkout validation.** Verify `install`, `dev`, `test`, `lint`, `build` work from a clean checkout on the low-end machine before declaring setup done.

## CI speed notes

- `pnpm install --frozen-lockfile` + pnpm cache in `actions/setup-node`.
- BuildKit cache mounts (`--mount=type=cache`) for dependency layers.
- Matrix shards for tests; path filters (change-classification) to skip unaffected jobs.
- Cache keys tied to branch/commit hash to avoid cross-branch pollution; prune stale caches (N commits / M days / 80% disk threshold).
- Benchmark PR build duration; fail on surprising regression (+10% p50).

## Stability guardrails

- Adopt fast/experimental tools (tsgo, oxlint) as **opt-in** with the proven tool as default. Document the switch in the repo.
- If a fast tool misses a class of errors, keep the slower tool for that specific gate (e.g. ESLint for plugin-dependent rules).
