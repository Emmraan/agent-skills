# Phase 6 — Environment Management

**Goal:** Design a consistent, reproducible, and isolated environment strategy across the development lifecycle.

23. **Define the environment topology.**
    - Specify each environment and its purpose:

    | Environment | Purpose | Data | Access | Deployment Trigger | Infra Parity |
    |---|---|---|---|---|---|
    | Local/Dev | Developer workstation | Mocked/seeded | Individual dev | Manual | Minimal (Docker Compose) |
    | CI | Automated testing | Ephemeral/fixtures | CI system only | Every PR/push | Containers only |
    | Preview/Ephemeral | PR-specific full-stack preview | Seeded/snapshot | PR author + reviewers | Per PR (auto-created, auto-destroyed) | Medium (shared DB, isolated app) |
    | Staging | Pre-production validation | Sanitized prod copy or realistic synthetic | Engineering team | Auto on merge to main | High (mirrors prod architecture) |
    | Production | Live user traffic | Real | Operations team | Manual gate or auto-canary | N/A (this IS the reference) |

24. **Design environment parity strategy.**
    - Apply the **Twelve-Factor App** principle of dev/prod parity:
      - Same container images across all environments (only configuration changes).
      - Same database engine and version (no SQLite in dev, Postgres in prod).
      - Same message queue and cache technology.
      - Configuration differences managed through environment variables or external config services (not code branches).
    - Define what IS allowed to differ: instance sizes, replica counts, domain names, log verbosity, feature flags.

25. **Design configuration management.**
    - **Hierarchy:** Environment variables → config files → secrets manager → defaults in code.
    - **Naming convention:** `<SERVICE>_<CATEGORY>_<KEY>` (e.g., `API_DATABASE_HOST`, `API_CACHE_TTL_SECONDS`).
    - **Secrets:** Never in code, never in environment files committed to git. Use:
      - AWS Secrets Manager / GCP Secret Manager / Azure Key Vault for production secrets.
      - HashiCorp Vault for cross-cloud or complex secret rotation requirements.
      - SOPS or sealed-secrets for GitOps-managed secrets in Kubernetes.
    - **Secret rotation:** Define rotation schedule (90 days for API keys, automatic rotation for database credentials via Secrets Manager).