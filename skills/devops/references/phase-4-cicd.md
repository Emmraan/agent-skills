# Phase 4 — CI/CD Pipeline Design

**Goal:** Design automated build, test, and deployment pipelines that enable fast, safe, and reliable software delivery.

15. **Select and justify the CI/CD platform.**
    - Evaluate options based on team context:
      - **GitHub Actions:** Best for GitHub-native workflows, generous free tier, marketplace actions.
      - **GitLab CI/CD:** Best for GitLab-native teams, built-in container registry, strong DevSecOps features.
      - **Jenkins:** Best for complex, highly customized pipelines; high operational overhead.
      - **CircleCI:** Fast execution, good caching, strong Docker support.
      - **AWS CodePipeline / CodeBuild:** Best for deep AWS integration, no third-party dependency.
      - **Argo CD / Flux:** Best for GitOps-based Kubernetes deployments.
      - **Tekton:** Kubernetes-native CI/CD, best for K8s-heavy platform teams.
    - Recommend the platform and justify based on: repository hosting, cloud provider, team expertise, and pipeline complexity.

16. **Design the CI pipeline (Build & Test).**
    - Define the pipeline stages with clear triggers and gates:
      ```
      ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
      │  Source   │───▶│  Build   │───▶│  Test    │───▶│ Security │───▶│ Artifact │
      │  Trigger  │    │  Stage   │    │  Stage   │    │  Scan    │    │  Publish │
      └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
       - Push to PR    - Deps install  - Unit tests   - SAST scan     - Docker build
       - Push to main  - Compile/build - Integration   - Dependency    - Push to ECR/
       - Tag/release   - Lint/format     tests          audit          GCR/ACR
                       - Type check    - Contract      - Container    - Helm chart
                                         tests          image scan     package
                                       - Coverage     - Secrets       - Version tag
                                         gate (>80%)    detection
      ```
    - Specify for each stage:
      - **Runner environment:** Container image, machine type, caching strategy.
      - **Pass/fail criteria:** What gates must pass before proceeding (test coverage threshold, zero critical vulnerabilities, lint passing).
      - **Parallelization:** Which stages/jobs can run concurrently to optimize pipeline speed.
      - **Caching:** Dependency caches (node_modules, .m2, pip cache), Docker layer caching, build artifact caching.
    - **Pipeline performance target:** Total CI pipeline should complete in < 10 minutes. If exceeding this, identify bottlenecks and optimize (parallel test shards, incremental builds, selective testing).

17. **Design the CD pipeline (Deployment).**
    - Define the deployment flow from artifact to production:
      ```
      ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
      │ Artifact  │───▶│ Deploy   │───▶│ Deploy   │───▶│ Deploy   │
      │ Published │    │ to Dev   │    │ to Stage │    │ to Prod  │
      └──────────┘    └──────────┘    └──────────┘    └──────────┘
       Automatic       Automatic       Automatic       Manual gate
                                       + E2E tests     OR auto with
                                       + Smoke tests   canary validation
      ```
    - For each environment deployment:
      - **Trigger:** Automatic (on merge to branch) or manual approval gate.
      - **Pre-deployment checks:** Database migration dry-run, configuration validation, dependency health checks.
      - **Deployment mechanism:** Container image update, Helm upgrade, Terraform apply, serverless framework deploy — specify exactly.
      - **Post-deployment checks:** Smoke tests, synthetic monitoring, health endpoint verification, metric baseline comparison.
      - **Rollback trigger:** Automated (error rate spike, latency breach) or manual. Define the rollback mechanism (redeploy previous image, Helm rollback, feature flag disable).

18. **Define the deployment strategy.**
    - Evaluate and recommend:
      - **Rolling update:** Gradually replace instances. Low risk, but brief mixed-version state. Best for stateless services with backward-compatible changes.
      - **Blue-Green:** Run two identical environments, switch traffic atomically. Zero-downtime, instant rollback. Higher cost (double infrastructure during deployment).
      - **Canary:** Route a small percentage of traffic (1% → 5% → 25% → 100%) to the new version, monitor metrics at each step. Best for high-risk changes.
      - **Feature Flags:** Deploy code to production but gate functionality behind flags. Decouple deployment from release. Best for continuous deployment with controlled rollout.
      - **Progressive Delivery (Canary + Feature Flags + Automated Analysis):** Combine strategies with automated metric analysis (Kayenta, Flagger, Argo Rollouts). Best for mature teams with strong observability.
    - Justify the recommendation based on: team maturity, risk tolerance, infrastructure cost, and change frequency.
    - Present as a tradeoff matrix:

    | Strategy | Rollback Speed | Cost Overhead | Complexity | Risk Level | Best For |
    |---|---|---|---|---|---|
    | Rolling | 1–5 min | None | Low | Medium | Routine updates |
    | Blue-Green | Instant | 2× during deploy | Medium | Low | Critical services |
    | Canary | Instant | +10–20% | High | Very Low | High-traffic services |
    | Feature Flags | Instant (flag off) | Minimal | Medium | Very Low | Product experiments |

19. **Design the GitOps workflow (if applicable).**
    - If Kubernetes is the target platform, recommend a GitOps approach:
      - **Repository structure:** Separate application repo from deployment manifest repo (or use a `/deploy` directory with Kustomize overlays).
      - **Sync mechanism:** Argo CD or Flux continuously reconciles cluster state with the Git-declared desired state.
      - **Promotion flow:** Dev → Staging → Production via pull requests to environment-specific directories/branches.
      - **Drift reconciliation:** Argo CD auto-syncs or alerts on drift; manual overrides are reverted automatically.
    - Define the Git branching strategy that feeds the pipeline:
      - **Trunk-based development (recommended):** Short-lived feature branches → merge to `main` → auto-deploy to dev/staging → manual promote to production.
      - **Gitflow (if required):** `feature/*` → `develop` → `release/*` → `main` → `hotfix/*`. Note: higher overhead, slower delivery.
