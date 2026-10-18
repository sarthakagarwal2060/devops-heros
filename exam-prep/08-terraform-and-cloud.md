# Terraform, IaC & Cloud (MCQ + Lab)

> Covers Infrastructure as Code, the Terraform workflow, and core AWS networking (VPC, subnets, route tables, security groups).

---

## 1. Infrastructure as Code (IaC)

- Define infrastructure in **code** instead of clicking in a console. Flow: `code → plan → apply → cloud infra`.
- Benefits: repeatable, automated, version-controlled (Git), consistent, easy disaster recovery, CI/CD-friendly.
- **Terraform is declarative** — you describe *what you want*, it figures out the API calls. Language = **HCL** (HashiCorp Configuration Language).

---

## 2. Terraform building blocks ⭐

| Component | What it is | Syntax |
|-----------|-----------|--------|
| **Provider** | Plugin to talk to a cloud/API (aws, azure, google) | `source = "hashicorp/aws"`, `version = "~> 6.0"` |
| **Resource** | A piece of infra Terraform manages | `resource "TYPE" "NAME" { ... }` |
| **Variable** | Input value | `variable "env" {}` → use as `var.env` |
| **Output** | Value to expose after apply | `output "id" { value = ... }` |
| **State** | Maps your config → real infra (`terraform.tfstate`) | never edit by hand; never commit |

> Resource **address** = `TYPE.NAME`, e.g. `aws_s3_bucket.demo`. Reference its attributes like `aws_s3_bucket.demo.id`.

**Example**
```hcl
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 6.0" }
  }
}
provider "aws" { region = var.aws_region }

resource "aws_s3_bucket" "demo" {
  bucket = var.bucket_name
  tags   = { Environment = "dev", ManagedBy = "Terraform" }
}

output "bucket_arn" { value = aws_s3_bucket.demo.arn }
```

---

## 3. The Terraform workflow ⭐ (memorize the order)

```bash
terraform init       # download providers, set up backend (run first)
terraform fmt        # format code
terraform validate   # check config is valid
terraform plan       # PREVIEW changes (no changes made)
terraform apply      # create/update infra (type 'yes' to confirm)
terraform destroy    # delete all managed infra
```

**Plan symbols:** `+` create, `~` update in place, `-` destroy, `-/+` replace.

Inspect state: `terraform state list`, `terraform state show <addr>`, `terraform output`.

> ⭐ MCQ: `plan` only previews; `apply` actually changes infra; **state** is how Terraform knows what already exists.

---

## 4. Cloud service models ⭐

| Model | You manage | Cloud manages | Example | Analogy |
|-------|-----------|---------------|---------|---------|
| **IaaS** | App, runtime, OS config | VM, storage, network | EC2, EBS, VPC | Empty house |
| **PaaS** | Just your code | Runtime, OS, servers | Elastic Beanstalk, App Engine | Furnished apartment |
| **SaaS** | Nothing (just use it) | Everything | Gmail, Slack, M365 | Hotel |

---

## 5. Regions & Availability Zones

- **Region** = geographic area (e.g. `ap-south-1` = Mumbai, `us-east-1`). Contains multiple AZs.
- **AZ** = isolated datacenter(s) inside a Region. Multiple AZs → high availability.
- Scope: **VPC is regional**, a **Subnet lives in one AZ**.

---

## 6. VPC & Subnets

- **VPC** = your private virtual network in the cloud, e.g. `10.0.0.0/16`.
- **Subnet** = smaller slice inside the VPC, e.g. `10.0.1.0/24` (must fit inside the VPC CIDR).
- **Public subnet** = its route table has a path to an Internet Gateway. **Private subnet** = no IGW route.

```hcl
resource "aws_vpc" "main"   { cidr_block = "10.0.0.0/16" }
resource "aws_subnet" "pub" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true
}
```

---

## 7. Route Tables & Internet Gateway

- **Route table** = rules sending a destination CIDR to a target. `0.0.0.0/0` = "the whole internet".
- **Internet Gateway (IGW)** connects the VPC to the internet.
- ⭐ Creating an IGW alone does **not** make a subnet public — you also need a route `0.0.0.0/0 → IGW` **and** the route table associated with the subnet.

---

## 8. Security Groups ⭐

- Virtual **firewall** on a resource (e.g. EC2): "what traffic is allowed?"
- Rules: **ingress** (inbound) and **egress** (outbound).
- **Stateful**: if inbound is allowed, the matching response is automatically allowed out.
- Common ports: **22** SSH, **80** HTTP, **443** HTTPS.

```hcl
resource "aws_security_group" "web" {
  vpc_id = aws_vpc.main.id
  ingress { from_port = 80; to_port = 80; protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"] }
  egress  { from_port = 0;  to_port = 0;  protocol = "-1";  cidr_blocks = ["0.0.0.0/0"] }
}
```
> `protocol = "-1"` = all protocols; `0.0.0.0/0` on SSH(22) is risky (exposes SSH to the whole internet).

**Memory trick:** Route Table = **WHERE** traffic goes; Security Group = **ALLOWED or not**.
