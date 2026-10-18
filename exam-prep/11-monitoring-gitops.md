# Monitoring, Observability & GitOps (MCQ Focus)

> Mostly conceptual MCQs: the three signals, Prometheus vs Grafana, GitOps/ArgoCD idea.

---

## 1. Monitoring vs Observability ⭐

| | Monitoring | Observability |
|--|-----------|---------------|
| Question | "Is the system **healthy**?" | "**Why** is it behaving this way?" |
| Problems | Known problems | Unknown problems |
| Tools | Dashboards + alerts | Deep investigation |

Production uses **both**.

---

## 2. The three signals of observability ⭐

| Signal | Answers | Example |
|--------|---------|---------|
| **Metrics** | "How much / how often" (numbers over time) | `http_requests_total`, CPU %, latency |
| **Logs** | "What happened" (timestamped events) | `INFO`/`ERROR` log lines |
| **Traces** | "Where did time go" (one request across services) | Trace ID + per-service timing |

---

## 3. Prometheus (metrics)

- Monitoring tool focused on **metrics**; stores **time-series** data.
- **Pulls / scrapes** a `/metrics` endpoint from each target (pull model).
- Key terms: **Target, Scrape, Metric, Label, Query**.
- Query language = **PromQL** (e.g. `up` → `1` means target is healthy).
- Config in `prometheus.yml`: `global.scrape_interval`, `scrape_configs` (`job_name`, `static_configs.targets`). UI on port **9090**.

---

## 4. Grafana (visualization)

- **Visualization / dashboard** layer. Prometheus = the data, Grafana = the pretty dashboards.
- UI on port **3000**, default login `admin/admin` (change in prod).
- Add Prometheus as a **data source** (`http://prometheus:9090`) → build dashboard panels.

> ⭐ MCQ: Prometheus **collects/stores** metrics; Grafana **visualizes** them.

---

## 5. GitOps ⭐

- Manage deployments using **Git as the single source of truth** (the desired state).
- Flow: `Developer → Git → Argo CD → Kubernetes` (instead of manual `kubectl apply`).
- A controller continuously **reconciles** desired state (Git) vs actual state (cluster).
- Benefits: history, code review, diffs, easy rollback, audit trail.

---

## 6. Argo CD

- GitOps **controller** that watches a Git repo and syncs the cluster to match it.
- You apply an **Application** custom resource once; it then auto-deploys and keeps syncing.
- UI via `kubectl port-forward svc/argocd-server -n argocd 8080:443`.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
spec:
  source: { repoURL: <git-url>, targetRevision: main, path: app }
  destination: { server: https://kubernetes.default.svc, namespace: demo }
  syncPolicy:
    automated: { prune: true, selfHeal: true }
    # prune    = delete resources removed from Git
    # selfHeal = revert manual cluster changes back to Git state
```

> ⭐ In GitOps you scale/change by editing YAML and `git push` — **not** `kubectl scale`. App status shows **SYNC** (Synced/OutOfSync) + **HEALTH** (Healthy).
