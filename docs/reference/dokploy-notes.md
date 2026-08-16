# Dokploy — Repository Reference Notes

Deep-analysis summary of `github.com/dokploy/dokploy` (branch `main`). Open-core, pnpm workspaces monorepo. Serves as the reference for the L3 open-source + paid-cloud (SAAS) hybrid model and for ultra-fast multi-arch release pipelines.

## Stack & layout

- pnpm (workspaces) monorepo: `apps/*` (`apps/api`, `apps/dokploy`, `apps/monitoring`, `apps/schedules`), `packages/*` (`packages/server`).
- `packageManager`: `pnpm@10.22.0`; `engines.node`: `^24.4.0`, pnpm `>=9.12.0`.
- Lint/format: Biome (single tool for both), run via lint-staged (`biome check --write` on staged files).
- `.nvmrc` pins Node; pnpm `overrides` + `onlyBuiltDependencies` control the dependency graph.
- Drizzle ORM migrations tracked under `apps/dokploy/drizzle/meta/` (snapshot + `_journal.json`).
- `openapi.json` generated from the API and synced downstream.

## Licensing — the open-core / source-available model

- `LICENSE.MD` — the open-source license covering the core.
- `LICENSE_PROPRIETARY.md` — "Dokploy Source Available License (DSAL) v1.0" applies only to code under `/proprietary` folders. Free to modify/patch; production use requires a commercial agreement; dev/testing exempt.
- `TERMS_AND_CONDITIONS.md` — service terms: no commercial resale/redistribution as a service without consent; data-collection policy (none); "AS IS" warranty; terms may change.
- Pattern to copy: keep the open core fully OSS, gate premium features behind a folder-level source-available license + terms file.

## Branching & release model

- `canary` is the dev source of truth; `main` always reflects the latest stable release. PRs merge to `canary`.
- `create-pr.yml`: on push to `canary`, if `apps/dokploy/package.json` version differs from the latest tag, auto-opens a release PR `canary → main` (labelled `release`/`automated pr`, assigned to maintainer).
- `hotfix-cherry-pick.yml`: on merged PR tagged `hotfix`, cherry-picks the fix onto `main`, then syncs `main` back into `canary` (with conflict detection).
- `hotfix-release.yml`: manual `workflow_dispatch` that bumps the patch version in `apps/dokploy/package.json` on `main` and pushes.

## Release / publish pipeline (dokploy.yml)

- Multi-arch Docker: separate `docker-amd` and `docker-arm` jobs (arm on `ubuntu-24.04-arm` runners), then a `combine-manifests` job using `docker buildx imagetools create` to publish `latest`, `canary`, `feature`, and versioned tags.
- `generate-release`: creates a GitHub Release with `generate_release_notes: true` and an attached `install.sh` pinned to the exact `DOKPLOY_VERSION` (fetched from the website repo, verified, re-pinned).
- `sync-version`: after release, regenerates the OpenAPI spec and syncs version + spec to downstream repos (`mcp`, `cli`, `sdk`) via a DOCS_SYNC_TOKEN — keeps all client artifacts in lockstep.

## Deployment workflows

- `deploy.yml` (Build Docker images): builds & pushes `cloud`, `schedule`, `server` images from their own Dockerfiles (`Dockerfile.cloud`, `Dockerfile.schedule`, `Dockerfile.server`) — one image per service, main vs canary tags.
- `monitoring.yml`: build+push `dokploy/monitoring` per arch, then combine manifests.
- 5 Dockerfiles total: `Dockerfile`, `Dockerfile.cloud`, `Dockerfile.monitoring`, `Dockerfile.schedule`, `Dockerfile.server`.

## PR CI (pull-request.yml)

- Matrix over `[build, test, typecheck]`; Node `24.4.0` pinned via `actions/setup-node` with pnpm cache; `pnpm install --frozen-lockfile`.
- For the `test` job: installs Nixpacks + Railpack (deployment buildpack engines), inits Docker Swarm + an overlay network — integration tests run against the real container stack.
- PR checks required to merge.

## Dockerfile practices

- `# syntax=docker/dockerfile:1`; corepack to enable pinned pnpm (`corepack prepare pnpm@10.22.0`).
- Build stage: `--mount=type=cache,id=pnpm,target=/pnpm/store` for dependency cache; builds the server filter (`pnpm --filter=@dokploy/server build`); deploys only the app via `pnpm --filter=./apps/dokploy --prod deploy --legacy /prod/dokploy` (slim node_modules).
- Runtime stage: installs only what runtime needs (curl, git-lfs, docker client, nixpacks, railpack, buildpacks via `buildpacksio/pack`); `HEALTHCHECK` against a tRPC health endpoint; `exec` form with `node -r dotenv/config` so no shell stays resident (comment: pnpm wrapper kept ~100MB RSS).

## Contributor-facing docs

- `CONTRIBUTING.md`: Conventional Commits; clone from `canary`; Node v24.4.0 via nvm; Docker required; Biome note (turn off Prettier); explicit policy — "Untested PRs will be rejected"; keep PRs single-purpose; large features must be discussed in an issue first.
- `SECURITY.md`: report via email (`contact@dokploy.com`), no public disclosure before investigation, no DoS/social engineering, minimal data access.
- `GUIDES.md` for dev setup; issue templates (`bug_report.yml`, `feature-request.yml`, `config.yml`), `pull_request_template.md`, `CODEOWNERS`, `FUNDING.yml` + `sponsors/` images.
- Ships its own `.claude/skills/frontend-design/SKILL.md`, `.devcontainer/` (devcontainer.json), `.vscode/extensions.json` + `settings.json`.

## Key takeaways for skills

1. Open-core licensing: LICENSE + per-folder source-available license + terms file.
2. canary→main with version-gated auto-PR, hotfix cherry-pick + back-sync.
3. Multi-arch buildx + imagetools manifest combine; versioned + channel tags.
4. Release artifact = version-pinned install script; downstream CLI/SDK/MCP sync via token.
5. One Dockerfile per service variant; slim runtime image; healthcheck; exec-form CMD.
6. Container-isolated local deps (install buildpacks in CI, run tests against real Docker Swarm).
7. pnpm + Biome + lint-staged for fast, uniform quality gates.
