# Phase 7 — Observability & Monitoring

**Goal:** Design a comprehensive observability stack that provides full visibility into system health, performance, and behavior — enabling fast incident detection, diagnosis, and resolution.

26. **Design the three pillars of observability.**

    **Logging:**
    - **Structured logging (mandatory):** All logs in JSON format with consistent fields: `timestamp`, `level`, `service`, `trace_id`, `span_id`, `message`, `context`.
    - **Log levels:** Define usage standards:
      - `ERROR`: Unexpected failures requiring attention (alert-worthy).
      - `WARN`: Degraded but functioning (potential issue).
      - `INFO`: Significant business events (user created, order placed, deployment completed).
      - `DEBUG`: Diagnostic detail (disabled in production by default, enable dynamically for troubleshooting).
    - **Log aggregation:** Ship logs to centralized platform (CloudWatch Logs, Elasticsearch/OpenSearch, Datadog Logs, Grafana Loki).
    - **Log retention:** Define policy: 30 days hot (searchable), 90 days warm (archived), 1 year cold (compliance).
    - **Sensitive data:** Never log passwords, tokens, PII, or credit card numbers. Implement log scrubbing/masking.

    **Metrics:**
    - **System metrics:** CPU, memory, disk I/O, network I/O — collected from host/container/orchestrator.
    - **Application metrics (RED method for services):**
      - **Rate:** Requests per second.
      - **Errors:** Error rate (4xx, 5xx) as a percentage of total requests.
      - **Duration:** Request latency (P50, P95, P99).
    - **Application metrics (USE method for resources):**
      - **Utilization:** How busy the resource is (CPU %).
      - **Saturation:** How much queued/waiting work exists (queue depth, thread pool exhaustion).
      - **Errors:** Resource-level errors (disk failures, connection pool exhaustion).
    - **Business metrics:** Signups, transactions, conversions — instrumented in application code.
    - **Metrics platform:** Prometheus + Grafana, Datadog, CloudWatch Metrics, or New Relic — select based on existing tooling and budget.

    **Distributed Tracing:**
    - Implement OpenTelemetry (OTel) as the instrumentation standard — vendor-neutral, wide language support.
    - Propagate trace context (`traceparent` header per W3C Trace Context specification) across all service boundaries.
    - Send traces to: Jaeger, Zipkin, Tempo (Grafana), Datadog APM, AWS X-Ray, or Honeycomb.
    - Define sampling strategy: 100% for errors, 10–100% for normal traffic depending on volume and cost.
    - Correlate logs, metrics, and traces via shared `trace_id`.

27. **Define SLOs, SLIs, and alerting.**
    - For each critical user journey, define:
      - **SLI (Service Level Indicator):** The metric that measures success (e.g., "proportion of API requests completing in < 300ms with a 2xx status").
      - **SLO (Service Level Objective):** The target (e.g., "99.9% of requests meet the SLI over a 30-day rolling window").
      - **Error Budget:** 100% − SLO = budget for failure/experimentation (e.g., 0.1% = ~43 minutes of downtime per month).
      - **Burn Rate Alert:** Alert when the error budget is being consumed too quickly (e.g., 14.4× burn rate over 1 hour = will exhaust monthly budget in 2 days → page on-call).

    - **Alerting design principles:**
      - **Alert on symptoms, not causes.** Alert on "error rate > 1%" (symptom), not "CPU > 80%" (cause that may not impact users).
      - **Every alert must be actionable.** If the responder cannot take a concrete action, the alert is noise — remove it or convert to a dashboard panel.
      - **Tiered severity:**
        - `P1/Critical`: User-facing outage. Page on-call immediately. Auto-escalate after 15 min.
        - `P2/High`: Significant degradation. Page on-call during business hours. Slack notification off-hours.
        - `P3/Medium`: Non-urgent issue. Slack notification. Address within 24 hours.
        - `P4/Low`: Informational. Dashboard only. Review in weekly ops review.
      - **Alert routing:** PagerDuty / Opsgenie / Grafana OnCall → on-call rotation → escalation chain.

28. **Design dashboards.**
    - Define at least three dashboard tiers:
      - **Executive / Status Dashboard:** System health at a glance — green/yellow/red per service, uptime percentage, error budget remaining. Audience: leadership, stakeholders.
      - **Service Dashboard (one per service):** RED metrics, resource utilization, deployment markers, top error types, dependency health. Audience: engineering team.
      - **Debugging / Investigation Dashboard:** Request traces, log search, individual host/pod metrics, correlation views. Audience: on-call engineer during incidents.
    - Include **deployment event annotations** on all time-series dashboards to correlate performance changes with releases.