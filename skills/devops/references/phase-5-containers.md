# Phase 5 — Containerization & Orchestration

**Goal:** Design efficient, secure, and reproducible container strategies and orchestration configurations.

20. **Design the container image strategy.**
    - **Dockerfile best practices:**
      - Multi-stage builds to minimize final image size.
      - Pin base image versions (never use `latest` in production).
      - Use minimal base images (Alpine, Distroless, or Chainguard images).
      - Order layers by change frequency (OS packages → language deps → application code) to maximize cache hits.
      - Run as non-root user (`USER 1001`).
      - Include health check instruction (`HEALTHCHECK`).
      - Use `.dockerignore` to exclude unnecessary files.
    - **Image tagging strategy:**
      - Use immutable tags: `<service>:<git-sha-short>` (e.g., `api-service:a1b2c3d`).
      - Additionally tag with semantic version for releases: `api-service:1.4.2`.
      - Never use `latest` for deployment references — always pin to a specific tag.
    - **Image registry:**
      - Recommend managed registry (ECR, GCR, ACR, GitHub Container Registry) with vulnerability scanning enabled.
      - Define image retention policy (keep last 30 tagged images, delete untagged images after 7 days).

21. **Design the orchestration configuration.**
    - If **Kubernetes:**
      - Define resource manifests for each service:
        - `Deployment` (replicas, strategy, resource requests/limits, readiness/liveness probes, pod disruption budgets).
        - `Service` (ClusterIP for internal, LoadBalancer or Ingress for external).
        - `Ingress` / `Gateway API` (routing rules, TLS termination, rate limiting).
        - `HorizontalPodAutoscaler` (target CPU/memory/custom metrics, min/max replicas, scale-down stabilization window).
        - `ConfigMap` and `Secret` (externalized configuration, never baked into images).
        - `NetworkPolicy` (restrict pod-to-pod communication to only what is necessary — zero-trust networking).
      - **Namespace strategy:** One namespace per environment (`dev`, `staging`, `prod`) or per team/service boundary — justify the choice.
      - **Resource quotas and limit ranges:** Define per-namespace to prevent noisy-neighbor issues.
      - **Pod security:** Enforce Pod Security Standards (restricted profile) — no privileged containers, no host networking, read-only root filesystem.
    - If **ECS/Fargate:**
      - Define task definitions: CPU/memory allocation, container definitions, port mappings, log configuration, IAM task role.
      - Define service configuration: desired count, deployment configuration (min/max healthy percent), load balancer target group, auto-scaling policies.
      - Define capacity provider strategy: Fargate vs. Fargate Spot (for non-critical workloads, cost savings up to 70%).
    - Provide **example configuration snippets** (YAML for K8s, JSON/Terraform for ECS) with inline comments explaining each decision.

22. **Design health check and readiness strategy.**
    - For every service, define three probe types:
      - **Startup Probe:** For slow-starting services — prevent premature killing during initialization. Check: `/healthz` returns 200 within 60s.
      - **Readiness Probe:** Indicates the service can accept traffic. Check: `/ready` verifies database connectivity, cache connectivity, and dependency health. Fail = remove from load balancer (but don't restart).
      - **Liveness Probe:** Indicates the process is alive and not deadlocked. Check: `/healthz` basic response. Fail = restart container.
    - Specify probe parameters: `initialDelaySeconds`, `periodSeconds`, `timeoutSeconds`, `failureThreshold`, `successThreshold`.
    - **Anti-pattern warning:** Do NOT include external dependency checks in liveness probes — a database outage should not cause a cascading restart storm.