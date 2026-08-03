# Phase 2 — Infrastructure Architecture Design

**Goal:** Design the high-level infrastructure topology — compute, storage, networking, and service architecture — before writing any configuration.

6. **Design the system architecture diagram (text-based).**
   - Since you cannot produce images, describe the architecture using structured ASCII or block notation:
     ```
     ┌─────────────────────────────────────────────────────────┐
     │                      INTERNET                           │
     └──────────────────────┬──────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   CloudFront    │  (CDN / Edge Cache)
                    │   + WAF         │
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │   ALB (Public)  │  (Application Load Balancer)
                    └───────┬────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
       ┌──────▼──────┐ ┌───▼───┐  ┌──────▼──────┐
       │ API Service  │ │ Web   │  │ Worker      │
       │ (ECS Fargate)│ │ App   │  │ Service     │
       │ 2-6 tasks    │ │(ECS)  │  │ (ECS)       │
       └──────┬──────┘ └───┬───┘  └──────┬──────┘
              │             │             │
       ┌──────▼─────────────▼─────────────▼──────┐
       │            Private Subnet                │
       │  ┌──────┐  ┌──────┐  ┌───────────────┐  │
       │  │ RDS  │  │Redis │  │ SQS Queues    │  │
       │  │Postgres│ │Cache │  │               │  │
       │  │Multi-AZ│ │     │  │               │  │
       │  └──────┘  └──────┘  └───────────────┘  │
       └──────────────────────────────────────────┘
     ```
   - Label every component with: service name, technology choice, instance/sizing tier, and scaling parameters.

7. **Select and justify the compute strategy.**
   - Evaluate and recommend one (or a combination) of:
     - **Containers (Kubernetes / ECS / Cloud Run):** Best for microservices, consistent environments, team K8s expertise.
     - **Serverless (Lambda / Cloud Functions / Azure Functions):** Best for event-driven, bursty, low-traffic, or cost-sensitive workloads.
     - **Virtual Machines (EC2 / GCE / Azure VMs):** Best for stateful workloads, legacy applications, or specific OS/kernel requirements.
     - **Edge Computing (CloudFront Functions / Deno Deploy / Fly.io):** Best for latency-sensitive, globally distributed request processing.
   - For each recommended compute service, justify using a tradeoff matrix:

   | Dimension | Containers (ECS Fargate) | Serverless (Lambda) | VMs (EC2) |
   |---|---|---|---|
   | Cold start | None | 100ms–10s | None |
   | Scaling speed | 30–120s | Instant | 2–5 min |
   | Max execution time | Unlimited | 15 min | Unlimited |
   | Cost model | Per vCPU-hour | Per invocation + duration | Per instance-hour |
   | Operational overhead | Medium | Low | High |
   | State management | Ephemeral by default | Stateless | Stateful possible |
   | Team familiarity | [Ask user] | [Ask user] | [Ask user] |

8. **Design the data layer.**
   - For each data store, specify:
     - **Technology choice** and justification (e.g., PostgreSQL for relational + JSONB flexibility, DynamoDB for single-digit-ms key-value at scale, Redis for caching + session store).
     - **Deployment mode:** Managed service vs. self-hosted, single-node vs. clustered, read replicas, multi-AZ/multi-region.
     - **Backup strategy:** Automated snapshots, frequency, retention period, cross-region replication.
     - **Scaling strategy:** Vertical (instance size) vs. horizontal (read replicas, sharding, partitioning).
     - **Data lifecycle:** Hot/warm/cold tiering, TTL policies, archival strategy.
   - Apply the **Polyglot Persistence** principle: Use the right data store for each access pattern — do not force a single database to serve all needs.

9. **Design the networking architecture.**
   - **VPC / Network topology:**
     - CIDR block allocation with room for growth (e.g., /16 VPC, /20 subnets).
     - Subnet strategy: public subnets (load balancers, NAT gateways), private subnets (application tier), isolated subnets (databases).
     - Availability Zone distribution: minimum 2 AZs, prefer 3 for production.
   - **Traffic flow:**
     - Ingress: CDN → WAF → Load Balancer → Application.
     - Egress: NAT Gateway or VPC endpoints for AWS service access (avoid traversing public internet).
     - East-west (service-to-service): Service mesh, security groups, or network policies.
   - **DNS strategy:** Route 53 / Cloud DNS with health checks, failover routing, weighted routing for canary releases.
   - **TLS/SSL:** Terminate at the load balancer with ACM-managed certificates; enforce TLS 1.2+ minimum; consider end-to-end encryption (mTLS) for service-to-service communication in high-security environments.

10. **Design the service communication architecture.**
    - Classify each service interaction:
      - **Synchronous (request-response):** REST, gRPC, GraphQL — use for real-time, low-latency queries.
      - **Asynchronous (event-driven):** Message queues (SQS, RabbitMQ), event streams (Kafka, Kinesis, EventBridge) — use for decoupling, reliability, and fan-out.
    - Apply the **Async-First** principle: Default to asynchronous communication unless synchronous response is a hard user-facing requirement. This improves resilience, reduces coupling, and enables retry semantics.
    - Define retry policies, dead-letter queues (DLQ), and idempotency requirements for each async communication channel.
    - If using microservices, define the service boundary map:
      ```
      ┌──────────────┐     gRPC      ┌──────────────┐
      │ User Service │──────────────▶│ Auth Service  │
      └──────┬───────┘               └──────────────┘
             │ REST
             ▼
      ┌──────────────┐    SQS/SNS    ┌──────────────┐
      │ Order Service│──────────────▶│Notification   │
      └──────┬───────┘               │Service        │
             │ Kafka                  └──────────────┘
             ▼
      ┌──────────────┐
      │ Analytics    │
      │ Pipeline     │
      └──────────────┘
      ```
