# Session 19: Cloud Fundamentals & Terraform AWS VPC Assignment

### `terraform apply` / VPC Provisioning Overview Screenshot

<!-- Paste terraform apply output showing VPC and networking resources created here. -->

<br><br><br>

### AWS Management Console / AWS CLI VPC Verification Screenshot

<!-- Paste AWS VPC Console or AWS CLI verification screenshot here. -->

<br><br><br>

Work through the exercises in order. Run the commands from the repository root:

---

## Prerequisites

- Terraform CLI installed (version >= 1.6.0)
- AWS CLI installed and authenticated (`aws configure`)
- Active AWS account with permissions for VPC, Subnets, Gateways, Route Tables, and Security Groups

Check your local toolchain and AWS authentication:

```bash
terraform version
aws --version
aws sts get-caller-identity
```

### Screenshot

<!-- Paste screenshot showing terraform version and AWS CLI identity check here. -->

<br><br><br>

---

## 1. Cloud Service Models (IaaS, PaaS, SaaS)

Understand the responsibilities and architecture across the three cloud service models:
- **IaaS (Infrastructure as a Service)**: AWS EC2, VPC, EBS (You manage OS, runtime, and apps).
- **PaaS (Platform as a Service)**: AWS Elastic Beanstalk, RDS (AWS manages OS and runtime, you manage apps).
- **SaaS (Software as a Service)**: GitHub, Google Workspace (Provider manages the entire stack).

Inspect the service models guide:

```bash
cat session19-cloud-terraform/01-cloud-service-models/README.md
```

### Screenshot

<!-- Paste screenshot showing Cloud Service Models documentation inspection here. -->

<br><br><br>

---

## 2. AWS Regions and Availability Zones

An **AWS Region** is a physical geographical area containing multiple isolated, physically separated data centers called **Availability Zones (AZs)** connected via low-latency links.

Inspect the region and AZ design guide:

```bash
cat session19-cloud-terraform/02-regions-and-availability-zones/README.md
```

List available AWS regions and availability zones using AWS CLI:

```bash
aws ec2 describe-regions --output table
aws ec2 describe-availability-zones --region ap-south-1 --output table
```

### Screenshot

<!-- Paste screenshot showing AWS CLI output listing regions and availability zones here. -->

<br><br><br>

---

## 3. VPC and Subnet CIDR Architecture

A **Virtual Private Cloud (VPC)** is an isolated private virtual network in AWS. A **Subnet** is a segmented range of IP addresses within a specific Availability Zone.

Inspect the VPC and Subnet concepts:

```bash
cat session19-cloud-terraform/03-vpc-and-subnets/README.md
```

Network Architecture:
- VPC CIDR: `10.20.0.0/16` (65,536 private IP addresses)
- Public Subnet: `10.20.1.0/24` in `ap-south-1a` (256 IP addresses with public IP mapping)
- Private Subnet: `10.20.2.0/24` in `ap-south-1b` (isolated backend workloads)

### Screenshot

<!-- Paste screenshot showing VPC and subnet CIDR documentation inspection here. -->

<br><br><br>

---

## 4. Internet Gateway (IGW) and Route Tables

- **Internet Gateway (IGW)**: Horizontally scaled VPC component enabling bidirectional communication between VPC instances and the Internet.
- **Route Table**: Set of routing rules determining where network traffic from subnets is directed (`0.0.0.0/0 -> igw-xxxx`).

Inspect the routing concepts:

```bash
cat session19-cloud-terraform/04-route-tables-and-internet-gateway/README.md
```

### Screenshot

<!-- Paste screenshot showing Internet Gateway and route tables documentation inspection here. -->

<br><br><br>

---

## 5. Security Groups (Stateful Firewalls)

A **Security Group** acts as a virtual firewall controlling inbound and outbound traffic at the instance/resource level. Security Groups are stateful (inbound return traffic is automatically allowed).

Inspect the Security Groups guide:

```bash
cat session19-cloud-terraform/05-security-groups/README.md
```

Standard Inbound Rules for Web Workloads:
- Port 80 (HTTP) from `0.0.0.0/0`
- Port 443 (HTTPS) from `0.0.0.0/0`
- Port 22 (SSH) restricted to authorized admin IPs

### Screenshot

<!-- Paste screenshot showing Security Groups concept inspection here. -->

<br><br><br>

---

## 6. Declaring a VPC with Terraform

Automate the provisioning of a complete custom VPC using modular Terraform files.

Inspect the Terraform VPC configuration:

```bash
cat session19-cloud-terraform/06-terraform-vpc/versions.tf
cat session19-cloud-terraform/06-terraform-vpc/variables.tf
cat session19-cloud-terraform/06-terraform-vpc/main.tf
cat session19-cloud-terraform/06-terraform-vpc/outputs.tf
```

### Screenshot

<!-- Paste screenshot showing 06-terraform-vpc configuration files inspection here. -->

<br><br><br>

---

## 7. Terraform IaC Lifecycle Workflow

Execute the standard validation cycle:

```bash
cd session19-cloud-terraform/07-terraform-workflow
terraform init
terraform fmt -check
terraform validate
cd ../..
```

Inspect the workflow files:

```bash
cat session19-cloud-terraform/07-terraform-workflow/main.tf
```

### Screenshot

<!-- Paste screenshot showing terraform init and validate output here. -->

<br><br><br>

---

## 8. Capstone Mini-Project: Production AWS VPC & Web Security Group

Provision a complete production-ready AWS network topology with an Internet Gateway, Public Subnet, Route Table, and Web Security Group.

### Architecture Diagram:

```text
AWS Region: ap-south-1
 └─ VPC: 10.20.0.0/16
     ├─ Internet Gateway: session19-mini-igw
     ├─ Public Route Table (0.0.0.0/0 ──► IGW)
     ├─ Public Subnet: 10.20.1.0/24 (AZ: ap-south-1a)
     └─ Security Group: session19-mini-web-sg (Ports 80 & 443)
```

### Step 8.1: Navigate to the Mini-Project and Inspect Configuration

```bash
cd session19-cloud-terraform/08-mini-project
cat versions.tf
cat variables.tf
cat main.tf
cat outputs.tf
```

### Step 8.2: Initialize and Validate Terraform

```bash
terraform init
terraform fmt
terraform validate
```

### Step 8.3: Generate and Review the Execution Plan

```bash
terraform plan
```

Confirm that Terraform plans to add:
- `aws_vpc.main`
- `aws_subnet.public`
- `aws_internet_gateway.main`
- `aws_route_table.public`
- `aws_route_table_association.public`
- `aws_security_group.web`

### Step 8.4: Apply the Configuration to AWS

```bash
terraform apply -auto-approve
```

Inspect the Terraform outputs:

```bash
terraform output
```

Verify the provisioned resources using the AWS CLI:

```bash
# Verify VPC
aws ec2 describe-vpcs --vpc-ids $(terraform output -raw vpc_id) --output table

# Verify Subnet
aws ec2 describe-subnets --subnet-ids $(terraform output -raw public_subnet_id) --output table

# Verify Security Group
aws ec2 describe-security-groups --group-ids $(terraform output -raw web_security_group_id) --output table
```

Return to repository root:

```bash
cd ../..
```

### Screenshot

<!-- Paste screenshot showing terraform plan, terraform apply, outputs, and AWS CLI verification here. -->

<br><br><br>

---

## 9. Cleanup

Destroy all provisioned AWS networking resources to prevent cloud resource clutter and potential costs:

```bash
# Navigate to the mini-project directory
cd session19-cloud-terraform/08-mini-project

# Destroy the VPC and all associated resources
terraform destroy -auto-approve

# Clean up local state and lock files
rm -rf .terraform .terraform.lock.hcl terraform.tfstate terraform.tfstate.backup

# Return to repository root
cd ../..

# Verify that the VPC is deleted
aws ec2 describe-vpcs --filters "Name=tag:Name,Values=session19-mini-vpc" --query "Vpcs" --output text
```

### Final Screenshot

<!-- Paste screenshot showing terraform destroy completion and clean AWS state here. -->

<br><br><br>
