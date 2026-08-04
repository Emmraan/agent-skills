# Phase 11 — Documentation & Operational Runbooks

**Goal:** Produce clear, structured documentation that enables any team member to understand, operate, troubleshoot, and evolve the infrastructure.

41. **Produce Architecture Decision Records (ADRs).**
    - For every significant infrastructure decision, document:
      ```
      # ADR-001: Use ECS Fargate over Kubernetes for container orchestration

      ## Status: Accepted

      ## Context
      Team of 3 engineers with no Kubernetes experience. Running 4 microservices
      on AWS. Need container orchestration with auto-scaling and zero-downtime deploys.

      ## Decision
      Use AWS ECS with Fargate launch type.

      ## Alternatives Considered
      1. Self-managed Kubernetes (EKS with EC2 nodes) — rejected due to operational
         overhead exceeding team capacity.
      2. AWS Lambda — rejected due to cold start impact on P99 latency requirements
         and 15-minute execution limit for background workers.
      3. AWS App Runner — rejected due to limited networking control (no VPC
         peering, limited security group configuration).

      ## Consequences
      - (+) Minimal operational overhead — no cluster management, patching, or node scaling.
      - (+) Native AWS integration — ALB, CloudWatch, Secrets Manager, IAM.
      - (-) Vendor lock-in to AWS ECS APIs.
      - (-) Less community ecosystem than Kubernetes (no Helm, Istio, ArgoCD).
      - (-) Fargate pricing premium vs. EC2-backed ECS (~20% higher for sustained workloads).

      ## Reversibility
      Medium. Containerized workloads can be migrated to Kubernetes. IaC modules
      would need rewriting. Application code unchanged. Estimated migration: 2-4 weeks.
      ```

42. **Produce an operational runbook for each critical scenario.**
    - Structure each runbook:
      ```
      # Runbook: Database Connection Pool Exhaustion

      ## Symptoms
      - Application logs show "connection pool exhausted" or "too many connections"
      - API latency spike (P99 > 5s)
      - Error rate increase (5xx > 5%)
      - CloudWatch alarm: `RDS-ConnectionCount > 80% of max_connections`

      ## Impact
      - Severity: P1 (user-facing degradation/outage)
      - Affected services: API Service, Worker Service

      ## Diagnosis Steps
      1. Check RDS connection count: `aws cloudwatch get-metric-statistics ...`
      2. Check per-service connection pool metrics in Grafana dashboard: [link]
      3. Identify which service is leaking connections: check application logs for
         unclosed transactions or long-running queries.
      4. Check for recent deployments that may have changed pool configuration.

      ## Resolution Steps
      1. **Immediate mitigation:** Restart the offending service's tasks to release
         connections: `aws ecs update-service --force-new-deployment`
      2. **If restart insufficient:** Increase RDS max_connections parameter
         (requires reboot for static params) or scale to larger instance class.
      3. **Root cause fix:** Identify and fix connection leak in application code.
         Common causes: missing `finally` block closing connection, N+1 query
         pattern, transaction timeout not configured.

      ## Prevention
      - Set connection pool max size to `max_connections / number_of_service_instances - 10`
      - Configure connection idle timeout (30s) and max lifetime (30 min)
      - Add connection pool utilization metric to service dashboard
      - Alert at 70% pool utilization (early warning)
      ```
    - Create runbooks for at minimum:
      - Service outage / health check failure.
      - Database connection issues.
      - High error rate / latency spike.
      - Deployment failure / rollback procedure.
      - Secret rotation / certificate renewal.
      - Disk space / storage exhaustion.
      - DDoS or abnormal traffic spike.
      - Data recovery / backup restore.

43. **Produce an infrastructure README.**
    - Include:
      - **Architecture overview:** Text diagram + description of every component.
      - **Repository map:** What lives where and how repositories relate.
      - **Getting started:** How to set up the local development environment, run tests, and deploy to dev.
      - **Environment details:** URLs, access methods, and configuration for each environment.
      - **CI/CD pipeline description:** What triggers it, what stages run, where to view results.
      - **On-call guide:** Escalation paths, alert routing, communication channels, incident response process.
      - **Common tasks:** Step-by-step guides for frequent operations (scaling, deploying, rotating secrets, running database migrations, accessing logs).

44. **Define open questions and next steps.**
    - List any unresolved infrastructure questions that require load testing, team discussion, or vendor evaluation.
    - Recommend next actions: capacity planning exercises, DR drill schedule, migration timeline, tooling evaluations, or team training needs.