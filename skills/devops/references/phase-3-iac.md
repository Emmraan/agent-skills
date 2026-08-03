# Phase 3 — Infrastructure as Code (IaC)

**Goal:** Codify all infrastructure decisions into version-controlled, reproducible, reviewable configuration.

11. **Select and justify the IaC tooling.**
    - Evaluate options based on team context:
      - **Terraform:** Multi-cloud, mature ecosystem, HCL syntax, large community. Best for: multi-cloud or cloud-agnostic teams.
      - **Pulumi:** Real programming languages (TypeScript, Python, Go), strong for teams who prefer general-purpose languages over DSLs.
      - **AWS CDK / CDKTF:** Imperative wrapper over CloudFormation/Terraform, good for AWS-heavy teams.
      - **CloudFormation:** AWS-native, deep integration, but verbose and AWS-only.
      - **Ansible:** Configuration management + light provisioning, best for VM-centric environments.
      - **Crossplane:** Kubernetes-native infrastructure management, best for teams already invested in K8s.
    - Recommend the tool and state the rationale explicitly.

12. **Define the IaC repository structure.**
    - Propose a clear module/directory layout:
      ```
      infrastructure/
      ├── modules/                    # Reusable, composable modules
      │   ├── networking/
      │   │   ├── vpc/
      │   │   ├── security-groups/
      │   │   └── dns/
      │   ├── compute/
      │   │   ├── ecs-service/
      │   │   ├── lambda-function/
      │   │   └── auto-scaling/
      │   ├── data/
      │   │   ├── rds-postgres/
      │   │   ├── redis-cluster/
      │   │   └── s3-bucket/
      │   └── observability/
      │       ├── cloudwatch-alarms/
      │       ├── log-groups/
      │       └── dashboards/
      ├── environments/               # Environment-specific configurations
      │   ├── dev/
      │   │   ├── main.tf
      │   │   ├── variables.tf
      │   │   ├── terraform.tfvars
      │   │   └── backend.tf
      │   ├── staging/
      │   └── production/
      ├── global/                     # Shared resources (IAM, DNS zones, ECR repos)
      │   ├── iam/
      │   ├── ecr/
      │   └── route53/
      └── scripts/                    # Helper scripts for plan/apply/destroy
      ```
    - Apply the **DRY (Don't Repeat Yourself)** principle: Shared logic lives in modules; environment directories only contain variable overrides and backend configuration.

13. **Define IaC best practices to follow.**
    - **State management:** Remote state backend (S3 + DynamoDB locking for Terraform, GCS for GCP), separate state file per environment, never commit state files to git.
    - **Secrets handling in IaC:** Never hardcode secrets in `.tf` files. Use AWS Secrets Manager, HashiCorp Vault, or SOPS-encrypted files. Reference secrets by ARN/path, not value.
    - **Tagging strategy:** All resources must be tagged with: `Environment`, `Service`, `Team`, `CostCenter`, `ManagedBy=terraform`. Define tags as a shared variable map applied to all resources.
    - **Drift detection:** Schedule periodic `terraform plan` runs in CI to detect manual changes (configuration drift). Alert on drift.
    - **Module versioning:** Pin module versions (use git tags or registry versions). Never reference `main` branch for production modules.
    - **Blast radius control:** Split infrastructure into independent state files by domain (networking, compute, data, observability) to limit the impact of a bad apply.

14. **Produce IaC code snippets or templates when appropriate.**
    - When the user requests specific infrastructure, provide well-structured, commented IaC code (Terraform, Pulumi, CDK, etc.) with:
      - Clear variable definitions with descriptions, types, default values, and validation rules.
      - Output definitions for values needed by other modules or services.
      - Inline comments explaining non-obvious decisions.
      - Security-hardened defaults (encryption enabled, public access blocked, least-privilege IAM).
