# Phase 8 — Security (DevSecOps)

**Goal:** Embed security into every layer of the infrastructure and pipeline — security is not a gate at the end but a continuous practice throughout.

29. **Apply the Principle of Least Privilege across all access.**
    - **IAM Policies:**
      - Every service/workload gets its own IAM role with only the permissions it needs — no shared roles, no `*` wildcards in production.
      - Use IAM policy conditions (source IP, MFA required, tag-based access) to further restrict.
      - Review and audit IAM permissions quarterly. Use tools like IAM Access Analyzer, Prowler, or ScoutSuite.
    - **Human access:**
      - No long-lived access keys. Use SSO (SAML/OIDC) + temporary credentials (AWS STS, `gcloud auth`).
      - Production access via break-glass procedure only — require MFA + justification + automatic session timeout.
      - Audit all production access with CloudTrail / Audit Logs.

30. **Secure the software supply chain.**
    - **Dependency management:**
      - Pin dependency versions (lockfiles: `package-lock.json`, `go.sum`, `Pipfile.lock`).
      - Automated vulnerability scanning in CI: Dependabot, Snyk, Trivy, or Grype.
      - Block merges with critical/high CVEs (configurable policy).
    - **Container image security:**
      - Scan images in CI and in registry (ECR scanning, Trivy, Snyk Container).
      - Use signed images (Cosign/Sigstore) and enforce signature verification in the cluster (Kyverno, OPA Gatekeeper).
      - Minimal base images: Distroless or Alpine — fewer packages = smaller attack surface.
    - **SBOM (Software Bill of Materials):** Generate SBOM for each build artifact (Syft, `docker sbom`). Store alongside the artifact for audit/compliance.

31. **Secure the network.**
    - **Defense in depth:**
      - Layer 1: WAF (Web Application Firewall) at the edge — block OWASP Top 10 attacks, rate limit, geo-restrict.
      - Layer 2: Load balancer with TLS termination — only accept HTTPS.
      - Layer 3: Security groups / firewall rules — whitelist only required ports and source IPs/CIDRs.
      - Layer 4: Network policies (Kubernetes) or VPC flow controls — restrict east-west traffic.
      - Layer 5: Application-level authentication and authorization (JWT validation, API key verification, RBAC).
    - **Encryption:**
      - At rest: Enable for all data stores (RDS encryption, S3 SSE-KMS, EBS encryption). Use customer-managed KMS keys for sensitive data.
      - In transit: TLS 1.2+ for all external traffic. mTLS for service-to-service communication in high-security environments.
      - Key management: AWS KMS / GCP Cloud KMS / Azure Key Vault. Define key rotation policy (annual minimum).

32. **Implement secrets management.**
    - **Never** hardcode secrets in source code, Dockerfiles, CI config files, or environment file committed to version control.
    - Secret injection hierarchy (from most to least preferred):
      1. Secrets manager (AWS Secrets Manager, Vault) → injected at runtime by the platform.
      2. Kubernetes Secrets (encrypted at rest with KMS via EncryptionConfiguration) → mounted as volumes or env vars.
      3. CI/CD platform secrets (GitHub Actions secrets, GitLab CI variables) → for pipeline-only secrets.
    - **Secret detection in CI:** Run tools like `gitleaks`, `truffleHog`, or `detect-secrets` as a pre-commit hook AND in the CI pipeline. Block merge on detection.

33. **Implement compliance and audit controls.**
    - Enable cloud audit logging (CloudTrail, GCP Audit Logs, Azure Activity Log) — write to immutable storage (S3 with Object Lock).
    - Implement cloud configuration compliance scanning: AWS Config Rules, GCP Security Command Center, Azure Policy, or third-party (Prowler, Checkov, tfsec, Bridgecrew).
    - For regulated workloads, map infrastructure controls to the relevant compliance framework:

    | Compliance Requirement | Infrastructure Control | Implementation |
    |---|---|---|
    | HIPAA: Encryption at rest | All data stores encrypted | RDS encryption, S3 SSE-KMS, EBS encryption |
    | SOC 2: Access logging | Audit trail for all access | CloudTrail → S3 (immutable) → SIEM |
    | PCI-DSS: Network segmentation | Cardholder data isolated | Dedicated VPC/subnet, strict SG rules |
    | GDPR: Data deletion | Right to erasure | Soft-delete + hard-delete job, audit trail |