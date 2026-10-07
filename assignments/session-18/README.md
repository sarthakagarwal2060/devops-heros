# Session 18: Infrastructure as Code (IaC) with Terraform & AWS Assignment

### `terraform apply` / Provisioned Resources Screenshot

<!-- Paste overall successful terraform apply execution screenshot here. -->

<br><br><br>

### AWS S3 Console / AWS CLI Verification Screenshot

<!-- Paste AWS S3 bucket verification screenshot (CLI or AWS Console) here. -->

<br><br><br>

Work through the exercises in order. Run the commands from the repository root:

---

## Prerequisites

- Terraform CLI installed (version >= 1.6.0)
- AWS CLI installed and configured with appropriate IAM credentials
- Active AWS account connection

Check your local toolchain and AWS credentials:

```bash
terraform version
aws --version
aws sts get-caller-identity
```

### Screenshot

<!-- Paste screenshot showing terraform version and AWS sts get-caller-identity output here. -->

<br><br><br>

---

## 1. IaC Fundamentals and Terraform Block Syntax

Infrastructure as Code (IaC) allows you to define, provision, and manage cloud infrastructure using declarative configuration files rather than manual point-and-click console interactions.

Inspect the basic configuration block:

```bash
cat session18-terraform-iac/01-iac-basics/main.tf
```

Key elements to observe:
- `terraform { ... }`: Defines the minimum Terraform CLI version and required provider versions.
- `required_providers`: Configures the official HashiCorp AWS provider (`hashicorp/aws`).
- `provider "aws" { ... }`: Sets target AWS region parameters (e.g., `ap-south-1`).

Validate syntax formatting:

```bash
terraform fmt -check session18-terraform-iac/01-iac-basics/
```

### Screenshot

<!-- Paste screenshot showing IaC configuration inspection and fmt check here. -->

<br><br><br>

---

## 2. Terraform Architecture and the Declarative Engine

Terraform operates using two primary components:
1. **Terraform Core**: Parses HCL code, manages state, and constructs the Resource Dependency Graph.
2. **Terraform Plugins (Providers)**: Translates generic resource requests into provider-specific API calls (AWS, Azure, GCP).

Inspect the architecture demonstration file:

```bash
cat session18-terraform-iac/02-terraform-architecture/main.tf
```

### Screenshot

<!-- Paste screenshot showing Terraform architecture configuration inspection here. -->

<br><br><br>

---

## 3. Configuring Cloud Providers

A provider is responsible for understanding API interactions and exposing cloud resources.

Inspect the provider declaration:

```bash
cat session18-terraform-iac/03-providers/main.tf
```

Notice:
- Providers can be parameterized dynamically using variables: `region = var.aws_region`.
- Multiple provider configurations can be defined using `alias` for multi-region deployments.

### Screenshot

<!-- Paste screenshot showing provider configuration inspection here. -->

<br><br><br>

---

## 4. Declaring AWS Cloud Resources

Resources are the fundamental building block in Terraform. Each resource block describes one or more cloud infrastructure objects.

Inspect the resource definition:

```bash
cat session18-terraform-iac/04-resources/main.tf
```

Resource block structure:
```hcl
resource "aws_s3_bucket" "demo_bucket" {
  bucket        = "my-unique-bucket-name"
  force_destroy = true
}
```
- **Resource Type**: `aws_s3_bucket` (managed by the AWS provider)
- **Local Name**: `demo_bucket` (used for internal references within the configuration)
- **Address**: `aws_s3_bucket.demo_bucket`

### Screenshot

<!-- Paste screenshot showing resource declaration inspection here. -->

<br><br><br>

---

## 5. Parameterizing Configurations with Input Variables

Input variables make Terraform configurations reusable across multiple environments (dev, stage, prod) without changing code.

Inspect variable definitions:

```bash
cat session18-terraform-iac/05-variables/main.tf
cat session18-terraform-iac/05-variables/terraform.tfvars.example
```

Key variable capabilities:
- `type`: Enforces data types (`string`, `number`, `bool`, `list`, `map`).
- `default`: Provides fallback values if none are explicitly passed.
- `description`: Self-documenting variable explanations.

Override variable values:
```bash
# Via CLI flag:
# terraform plan -var="aws_region=ap-south-1"

# Via variables file:
# terraform plan -var-file="terraform.tfvars"
```

### Screenshot

<!-- Paste screenshot showing variable definitions and tfvars example here. -->

<br><br><br>

---

## 6. Exposing Values with Terraform Outputs

Output values return information about your infrastructure (IDs, ARNs, public IPs, DNS names) after provisioning, making them accessible to CI/CD pipelines or users.

Inspect output definitions:

```bash
cat session18-terraform-iac/06-outputs/main.tf
```

Output attributes:
```hcl
output "bucket_name" {
  description = "The name of the created S3 bucket"
  value       = aws_s3_bucket.devops553.bucket
}
```

### Screenshot

<!-- Paste screenshot showing output configuration inspection here. -->

<br><br><br>

---

## 7. The Core Workflow: `init`, `validate`, `plan`, and `apply`

Every Terraform deployment follows the standardized lifecycle workflow:

```text
┌────────────────┐     ┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│ terraform init │ ──► │  terraform fmt │ ──► │ terraform plan │ ──► │terraform apply │
└────────────────┘     └────────────────┘     └────────────────┘     └────────────────┘
```

Inspect the workflow demo configuration:

```bash
cat session18-terraform-iac/07-init-plan-apply/main.tf
```

Run validation tests:

```bash
cd session18-terraform-iac/07-init-plan-apply
terraform init
terraform validate
cd ../..
```

### Screenshot

<!-- Paste screenshot showing terraform init and terraform validate success here. -->

<br><br><br>

---

## 8. Safe Resource Decommissioning (`terraform destroy`)

`terraform destroy` safely removes all infrastructure managed by the current configuration in reverse dependency order.

Inspect destroy demonstration configuration:

```bash
cat session18-terraform-iac/08-destroy/main.tf
```

Key safety flags:
- `terraform plan -destroy`: Previews what resources will be removed before actually deleting them.
- Target destruction: `terraform destroy -target=aws_s3_bucket.example`.

### Screenshot

<!-- Paste screenshot showing destroy configuration inspection or preview here. -->

<br><br><br>

---

## 9. State Management and Drift Detection

Terraform stores metadata about managed infrastructure in a state file (`terraform.tfstate`). This maps configuration code to real cloud resources.

Inspect state demonstration files:

```bash
cat session18-terraform-iac/09-state/main.tf
```

Useful state commands:
```bash
# List all resources tracked in state
terraform state list

# Show detailed attributes of a specific resource
terraform state show aws_s3_bucket.devops553

# Refresh state against real-world infrastructure (detect drift)
terraform refresh
```

### Screenshot

<!-- Paste screenshot showing state configuration inspection and state commands here. -->

<br><br><br>

---

## 10. Capstone Project: AWS S3 Bucket Provisioning (`terraform-s3-demo`)

Deploy a fully parameterized AWS S3 bucket with tagging, region configuration, and output extraction.

### Step 10.1: Inspect the Project Files

Navigate to the project directory:

```bash
cd session18-terraform-iac/terraform-s3-demo
```

Inspect all configuration files:

```bash
cat terraform.tf
cat providers.tf
cat variables.tf
cat main.tf
cat outputs.tf
```

### Step 10.2: Initialize and Validate the Project

Initialize the AWS provider plugin:

```bash
terraform init
```

Format and validate the configuration:

```bash
terraform fmt
terraform validate
```

### Step 10.3: Generate and Review the Execution Plan

Create an execution plan:

```bash
terraform plan
```

Review the plan output confirming `1 to add, 0 to change, 0 to destroy`.

### Step 10.4: Apply the Configuration to AWS

Provision the S3 bucket:

```bash
terraform apply -auto-approve
```

Inspect the generated outputs:

```bash
terraform output
```

Verify the bucket directly using the AWS CLI:

```bash
aws s3 ls | grep $(terraform output -raw bucket_name)
```

Return to repository root:

```bash
cd ../..
```

### Screenshot

<!-- Paste screenshot showing terraform plan, terraform apply, output values, and aws s3 ls verification here. -->

<br><br><br>

---

## 11. Cleanup

Destroy the AWS cloud infrastructure to prevent ongoing charges:

```bash
# Navigate to the project directory
cd session18-terraform-iac/terraform-s3-demo

# Destroy all provisioned AWS resources
terraform destroy -auto-approve

# Clean up local Terraform runtime state and cache
rm -rf .terraform .terraform.lock.hcl terraform.tfstate terraform.tfstate.backup

# Return to repository root
cd ../..

# Verify that the bucket is deleted
aws s3 ls
```

### Final Screenshot

<!-- Paste screenshot showing terraform destroy completion and clean AWS state here. -->

<br><br><br>
