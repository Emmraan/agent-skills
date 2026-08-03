# Phase 10 — Cost Optimization

**Goal:** Ensure infrastructure spending is efficient, transparent, and aligned with business value.

38. **Establish cost visibility.**
    - Enable cost allocation tags on all resources (same tags as the tagging strategy in Phase 3).
    - Set up cost dashboards: AWS Cost Explorer / GCP Billing / Azure Cost Management — grouped by service, environment, and team.
    - Configure budget alerts: Notify at 50%, 80%, 100% of monthly budget. Auto-alert on anomalous spending (> 20% increase day-over-day).

39. **Apply cost optimization strategies.**
    - **Right-sizing:** Analyze resource utilization (AWS Compute Optimizer, GCP Recommender). Downsize over-provisioned instances.
    - **Reserved capacity:** For stable, predictable workloads — commit to 1-year or 3-year reservations (30–60% savings). Use savings plans for flexibility across instance types.
    - **Spot/Preemptible instances:** For fault-tolerant workloads (batch processing, CI runners, stateless workers). Savings up to 90%. Implement graceful shutdown handling.
    - **Auto-scaling to zero:** For development environments, scale to zero outside business hours. Use scheduled scaling or event-based scaling (KEDA).
    - **Storage tiering:** Move infrequently accessed data to cheaper tiers (S3 Infrequent Access → Glacier; GP3 vs. GP2 EBS).
    - **Network cost reduction:** Use VPC endpoints instead of NAT Gateway for AWS service access. Minimize cross-AZ/cross-region data transfer. Cache aggressively at the edge (CDN).
    - **License optimization:** Prefer open-source alternatives where equivalent (PostgreSQL over commercial databases, Grafana over licensed monitoring).

40. **Present cost estimates.**
    - When designing infrastructure, provide a monthly cost estimate table:

    | Component | Service | Sizing | Monthly Cost (est.) | Notes |
    |---|---|---|---|---|
    | Compute | ECS Fargate | 2 tasks × 0.5 vCPU, 1GB | $60 | Auto-scales to 6 |
    | Database | RDS PostgreSQL | db.t3.medium, Multi-AZ | $130 | Reserved instance pricing |
    | Cache | ElastiCache Redis | cache.t3.small | $50 | Single node (non-prod) |
    | Load Balancer | ALB | 1 ALB + 10 LCU-hours | $25 | |
    | Storage | S3 | 100 GB + 1M requests | $5 | |
    | Monitoring | CloudWatch | Logs + Metrics + Alarms | $40 | |
    | **Total** | | | **$310/month** | |

    - Note: estimates are approximate and based on on-demand/public pricing. Actual costs will vary.