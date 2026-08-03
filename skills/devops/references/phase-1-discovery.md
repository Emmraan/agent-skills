# Phase 1 — Discovery & System Requirements

**Goal:** Establish a thorough understanding of what system you are building infrastructure for, its constraints, its scale requirements, and its operational expectations before making any infrastructure decisions.

1. **Extract and restate the system context.**
   - Identify the application type (web application, API service, data pipeline, ML platform, SaaS product, internal tool, mobile backend, IoT platform, etc.).
   - Identify the technology stack: programming language(s), framework(s), database(s), message queue(s), cache layer(s), third-party service dependencies.
   - Restate the core system purpose in one sentence: *"This system exists to [function] for [users/systems], processing [data/requests] with [key characteristic — e.g., low latency, high throughput, strong consistency]."*
   - If the user has not provided this, ask explicitly: *"Before I design infrastructure, I need to understand: What does this system do, what tech stack does it use, and what are its key operational characteristics?"*

2. **Identify scale and performance requirements.**
   - Current and projected traffic patterns:
     - Requests per second (RPS) — average, peak, burst.
     - Data volume — storage size, ingestion rate, query patterns.
     - Concurrent users — typical and peak.
   - Latency requirements: P50, P95, P99 targets for key endpoints/operations.
   - Throughput requirements: messages/second, events/second, batch processing windows.
   - Growth projections: 6-month, 12-month, 24-month scale estimates.
   - If the user cannot provide exact numbers, help them estimate using order-of-magnitude reasoning and document assumptions explicitly.

3. **Identify reliability and availability requirements.**
   - Target uptime SLA (e.g., 99.9% = 8.76 hours downtime/year, 99.95% = 4.38 hours, 99.99% = 52.6 minutes).
   - Recovery objectives:
     - **RTO (Recovery Time Objective):** Maximum acceptable downtime after a failure.
     - **RPO (Recovery Point Objective):** Maximum acceptable data loss window.
   - Maintenance windows: Are zero-downtime deployments required, or are scheduled maintenance windows acceptable?
   - Regulatory/compliance mandates: SOC 2, HIPAA, PCI-DSS, GDPR, FedRAMP, ISO 27001 — each imposes specific infrastructure constraints.

4. **Identify organizational and team context.**
   - Team size and DevOps maturity level (ad hoc → repeatable → defined → managed → optimized — cite the DORA/CALMS model).
   - Existing tooling and infrastructure: What is already in place? What must be preserved vs. can be replaced?
   - Deployment frequency target: How often does the team want to ship (hourly, daily, weekly)?
   - On-call structure: Who responds to incidents? Is there a formal on-call rotation?
   - Budget constraints: Is cost optimization a primary concern, or is reliability the priority?

5. **Compile a Constraints Register.**
   - Document all constraints in a structured table:

   | Constraint | Type | Impact on Infrastructure | Mitigation Strategy |
   |---|---|---|---|
   | Must run on AWS | Cloud Provider | Limits service choices to AWS ecosystem | Use provider-agnostic abstractions where possible |
   | HIPAA compliance | Regulatory | Requires encryption at rest/in transit, audit logging, BAA | Use compliant managed services, enable CloudTrail |
   | Team of 3 engineers | Organizational | Cannot operate complex Kubernetes clusters | Consider managed K8s (EKS) or serverless options |
   | $5K/month budget | Financial | Limits instance sizes and redundancy | Right-size instances, use reserved/spot capacity |
