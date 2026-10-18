# Exam Prep — DevOps

Beginner-friendly, exam-only study material — **assumes you know nothing**. Organized **by topic** (not by lecture). Built from the session notes in this repo.

Exam format: **MCQ** (terminal commands, concepts) + **Lab** (write & run Docker / Kubernetes / YAML, debug Kubernetes).

> **New to all of this? Read [00-start-here.md](00-start-here.md) first** — it explains terminal, files, images/containers, cloud, and how every topic fits together.

| # | File | Topic | Exam part |
|---|------|-------|-----------|
| 00 | [00-start-here.md](00-start-here.md) | Absolute basics: terminal, files, image vs container, the big picture | **read first** |
| 01 | [01-linux-commands.md](01-linux-commands.md) | Linux terminal, reading nested files (`cat data1/data2/data.txt`), navigation, permissions | **MCQ** |
| 02 | [02-docker.md](02-docker.md) | Dockerfile, build & run containers, compose, volumes | **Lab** (no debugging) |
| 03 | [03-kubernetes.md](03-kubernetes.md) | YAML (Pod/Deployment), `kubectl apply`, services, probes, scaling | **Lab** |
| 04 | [04-kubernetes-debugging.md](04-kubernetes-debugging.md) | Fix CrashLoopBackOff, ImagePullBackOff, Pending, Service/DNS | **Lab ⭐** |
| 05 | [05-shell-scripting.md](05-shell-scripting.md) | Bash: variables, if, loops, functions, input | MCQ + Lab |
| 06 | [06-git.md](06-git.md) | Git workflow: add → commit → push, branching | MCQ |
| 07 | [07-networking.md](07-networking.md) | IP, classes, subnet masks, CIDR, host math | **MCQ ⭐** |
| 08 | [08-terraform-and-cloud.md](08-terraform-and-cloud.md) | IaC, Terraform workflow, VPC/subnets/security groups, cloud models | MCQ + Lab |
| 09 | [09-helm.md](09-helm.md) | Charts, values, templates, install/upgrade/rollback | MCQ + Lab |
| 10 | [10-github-actions-cicd.md](10-github-actions-cicd.md) | CI vs CD, workflow/job/step, secrets, artifacts | MCQ + Lab |
| 11 | [11-monitoring-gitops.md](11-monitoring-gitops.md) | Metrics/logs/traces, Prometheus, Grafana, GitOps, ArgoCD | MCQ |
| 12 | [12-devsecops.md](12-devsecops.md) | SAST, SCA, secret & image scanning, security gates | MCQ |

## Priority (what to study first)
1. **Kubernetes debugging (04)** — highest-value lab topic.
2. **Docker build/run (02)** and **K8s YAML + apply (03)** — core labs.
3. **Linux file reading (01)** and **Networking (07)** — heaviest MCQ topics.
4. **Shell scripting (05)** — likely a small lab script.
5. Skim the rest (06, 08–12) for concept MCQs.

## Lab one-liners to have memorized
- Docker: `docker build -t app .` → `docker run -d -p 8080:80 app`
- Kubernetes: `kubectl apply -f file.yml` → `kubectl get pods` → `kubectl describe pod X` → `kubectl logs X --previous`
- Terraform: `init → plan → apply → destroy`
- Helm: `install / upgrade --install / rollback`
