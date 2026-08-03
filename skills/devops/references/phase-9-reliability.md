# Phase 9 — Reliability & Resilience Engineering

**Goal:** Design the system to withstand failures gracefully, recover quickly, and maintain user-facing availability.

34. **Apply resilience patterns.**
    - For each service, evaluate and implement relevant patterns:
      - **Circuit Breaker (Hystrix / Resilience4j / Polly pattern):** When a downstream dependency fails repeatedly, stop sending requests (open circuit), wait (half-open), and retry. Prevents cascade failures.
      - **Retry with Exponential Backoff + Jitter:** For transient failures. Define max retries (3–5), base delay (100ms), backoff multiplier (2×), and jitter (±20%) to prevent thundering herd.
      - **Timeout budgets:** Every external call has a timeout. Define per-dependency: database queries (5s), external APIs (10s), internal services (3s). Total request timeout = sum of critical-path timeouts + buffer.
      - **Bulkhead (isolation):** Separate thread pools / connection pools per dependency. A slow dependency exhausts only its pool, not the entire service.
      - **Fallback / Graceful Degradation:** When a non-critical dependency fails, serve cached/default data instead of erroring. Define which features are critical (must error) vs. non-critical (can degrade).
      - **Idempotency:** All write operations (especially those triggered by retries or message queues) must be idempotent. Use idempotency keys (UUID per request) stored in the database.

35. **Design the auto-scaling strategy.**
    - For each scalable component, define:
      - **Scaling metric:** CPU utilization, memory utilization, request count, queue depth, custom business metric.
      - **Target value:** E.g., "Scale out when average CPU > 60% for 3 minutes."
      - **Min / Max / Desired capacity:** E.g., min=2, max=20, desired=3.
      - **Scale-out behavior:** How many instances to add per scaling event. Prefer aggressive scale-out (add 50% of current capacity) with conservative scale-in (remove 1 at a time).
      - **Scale-in cooldown:** Minimum 5 minutes between scale-in events to avoid flapping.
      - **Predictive scaling:** For predictable traffic patterns (e.g., business hours spike), use scheduled scaling or predictive auto-scaling (AWS Predictive Scaling).

36. **Design the disaster recovery (DR) strategy.**
    - Classify the system's DR tier:
      - **Backup & Restore (RTO: hours, RPO: hours):** Cheapest. Regular backups to another region. Restore from backup on disaster. Suitable for non-critical systems.
      - **Pilot Light (RTO: 10–30 min, RPO: minutes):** Core infrastructure running in DR region (database replicas), compute scaled to zero. Scale up on failover. Suitable for important but not mission-critical systems.
      - **Warm Standby (RTO: minutes, RPO: seconds):** Scaled-down but fully functional copy in DR region. Scale up and redirect traffic on failover. Suitable for business-critical systems.
      - **Multi-Region Active-Active (RTO: ~0, RPO: ~0):** Full production stack in multiple regions with global load balancing. Most expensive, most resilient. Suitable for mission-critical, revenue-generating systems.
    - Recommend the appropriate tier based on the RTO/RPO requirements from Phase 1.
    - **Backup strategy specifics:**
      - Database: Automated daily snapshots + continuous WAL/binlog archiving for point-in-time recovery. Cross-region replication for DR.
      - Object storage: Cross-region replication enabled. Versioning enabled.
      - Configuration/secrets: Stored in version control (IaC) and secrets manager — inherently recoverable.
      - **Test restores regularly.** A backup that has never been tested is not a backup. Schedule quarterly restore drills.

37. **Design chaos engineering experiments (for mature teams).**
    - Propose experiments to validate resilience:
      - **Terminate a random pod/instance:** Verify auto-healing and zero user impact.
      - **Inject latency into a dependency:** Verify circuit breaker activates and graceful degradation works.
      - **Fail an entire AZ:** Verify multi-AZ failover works transparently.
      - **Exhaust connection pool:** Verify bulkhead isolation prevents cascade.
      - **Corrupt a configuration change:** Verify rollback mechanisms work.
    - Tools: Chaos Monkey, Litmus Chaos, Gremlin, AWS Fault Injection Simulator, `tc` (traffic control) for network simulation.
    - **Rule:** Always run chaos experiments in staging first. Production chaos requires mature observability, automated rollback, and team buy-in.