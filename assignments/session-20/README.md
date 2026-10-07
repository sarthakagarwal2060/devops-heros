# Session 20: Monitoring, Observability & GitOps with Argo CD Assignment

### Argo CD Dashboard / GitOps Application Sync Screenshot

<!-- Paste Argo CD web UI showing synced healthy application state here. -->

<br><br><br>

### Prometheus & Grafana Monitoring Dashboard Screenshot

<!-- Paste Prometheus metrics query or Grafana dashboard screenshot here. -->

<br><br><br>

Work through the exercises in order. Run the commands from the repository root:

---

## Prerequisites

- A running Kubernetes cluster (e.g., Minikube or Kind)
- `kubectl` installed and configured
- Docker and Docker Compose installed
- Git configured with your GitHub account
- Argo CD CLI (`argocd`) installed (optional, or access via Web UI)

Check your local environment and tool versions:

```bash
kubectl cluster-info
kubectl get nodes
docker --version
docker compose version
git --version
```

### Screenshot

<!-- Paste screenshot showing local cluster connection and tool versions here. -->

<br><br><br>

---

## 1. Monitoring vs. Observability

Understand the fundamental shift from traditional monitoring to modern observability:
- **Monitoring**: Tells you *when* a system is failing by checking predefined thresholds (e.g., CPU > 80%, endpoint HTTP 500). Focuses on "known unknowns".
- **Observability**: A property of a system that allows you to infer internal states based on external outputs. Allows debugging "unknown unknowns".

Inspect the core concepts:

```bash
cat session20-monitoring-observability-gitops/01-monitoring-vs-observability/README.md
```

### Screenshot

<!-- Paste screenshot showing Monitoring vs Observability documentation inspection here. -->

<br><br><br>

---

## 2. The Three Pillars of Observability (Metrics, Logs, Traces)

Observability relies on three complementary telemetry data types:
1. **Metrics**: Aggregable numerical measurements recorded over time (CPU usage, request rate, error count).
2. **Logs**: Timestamped, structured or unstructured event records emitted by applications.
3. **Traces**: End-to-end journey of a single request traversing distributed microservices.

Inspect the telemetry guide and sample Kubernetes workload:

```bash
cat session20-monitoring-observability-gitops/02-metrics-logs-traces/README.md
cat session20-monitoring-observability-gitops/02-metrics-logs-traces/k8s-demo/deployment.yaml
cat session20-monitoring-observability-gitops/02-metrics-logs-traces/k8s-demo/service.yaml
```

Deploy the sample logging/metrics app:

```bash
kubectl apply -f session20-monitoring-observability-gitops/02-metrics-logs-traces/k8s-demo/
kubectl get pods -l app=observability-demo
kubectl logs -l app=observability-demo --tail=20
```

### Screenshot

<!-- Paste screenshot showing deployed demo pods and streaming application logs here. -->

<br><br><br>

---

## 3. Metrics Collection with Prometheus

**Prometheus** is an open-source, pull-based monitoring system and time-series database. It scrapes metrics from HTTP endpoints (e.g., `/metrics`) on defined scrape intervals.

Inspect the Prometheus configuration:

```bash
cat session20-monitoring-observability-gitops/03-prometheus/prometheus.yml
cat session20-monitoring-observability-gitops/03-prometheus/docker-compose.yml
```

Launch Prometheus using Docker Compose:

```bash
docker compose -f session20-monitoring-observability-gitops/03-prometheus/docker-compose.yml up -d
docker compose -f session20-monitoring-observability-gitops/03-prometheus/docker-compose.yml ps
```

Verify Prometheus web interface:
- Access URL: `http://localhost:9090`
- Query basic metrics in the expression browser:
  - `up`
  - `prometheus_http_requests_total`
  - `rate(prometheus_http_requests_total[1m])`

Stop the Prometheus container:

```bash
docker compose -f session20-monitoring-observability-gitops/03-prometheus/docker-compose.yml down
```

### Screenshot

<!-- Paste screenshot showing Prometheus targets page or PromQL query results here. -->

<br><br><br>

---

## 4. Visualizing Metrics with Grafana

**Grafana** is an interactive visualization and analytics platform. It queries data sources (like Prometheus) and displays rich charts, heatmaps, and dashboards.

Inspect the Grafana integration:

```bash
cat session20-monitoring-observability-gitops/04-grafana/docker-compose.yml
cat session20-monitoring-observability-gitops/04-grafana/prometheus.yml
```

Start Prometheus and Grafana together:

```bash
docker compose -f session20-monitoring-observability-gitops/04-grafana/docker-compose.yml up -d
docker compose -f session20-monitoring-observability-gitops/04-grafana/docker-compose.yml ps
```

Access Grafana UI:
- Access URL: `http://localhost:3000`
- Default login: `admin` / `admin`
- Data Source: Add Prometheus pointing to `http://prometheus:9090`

Stop the monitoring stack:

```bash
docker compose -f session20-monitoring-observability-gitops/04-grafana/docker-compose.yml down
```

### Screenshot

<!-- Paste screenshot showing Grafana dashboard visualizing Prometheus metrics here. -->

<br><br><br>

---

## 5. Introduction to GitOps

**GitOps** is an operational framework that uses Git as the single source of truth for declarative infrastructure and application definitions:
- **Declarative Descriptions**: Entire system state declared in Git (Kubernetes YAML).
- **Version Controlled**: Every change is tracked through Git commits, branches, and PRs.
- **Automated Pull Reconciliation**: An operator in the cluster continuously pulls desired state from Git and applies it to the cluster (eliminating direct manual `kubectl apply`).

Inspect the GitOps introduction:

```bash
cat session20-monitoring-observability-gitops/05-introduction-to-gitops/README.md
cat session20-monitoring-observability-gitops/05-introduction-to-gitops/app/deployment.yaml
cat session20-monitoring-observability-gitops/05-introduction-to-gitops/app/service.yaml
```

### Screenshot

<!-- Paste screenshot showing GitOps concepts and manifest inspection here. -->

<br><br><br>

---

## 6. Git as the Single Source of Truth

In a GitOps workflow, direct manual modifications in the cluster are treated as **drift**. The GitOps operator automatically detects drift and heals the cluster back to the state recorded in Git.

Inspect the Git repository structure for GitOps:

```bash
cat session20-monitoring-observability-gitops/06-git-as-source-of-truth/README.md
ls -la session20-monitoring-observability-gitops/06-git-as-source-of-truth/gitops-repo/app/
```

### Screenshot

<!-- Paste screenshot showing Git as source of truth structure inspection here. -->

<br><br><br>

---

## 7. Declarative Continuous Delivery with Argo CD

**Argo CD** is a declarative, GitOps continuous delivery tool for Kubernetes that runs inside the cluster as an operator.

Inspect the Argo CD application manifest:

```bash
cat session20-monitoring-observability-gitops/07-argocd/app/argocd-application.yaml
```

Key Argo CD Application specifications:
- `spec.source.repoURL`: The Git repository hosting manifests.
- `spec.source.path`: Directory inside the repo containing YAML manifests.
- `spec.destination.server`: Target cluster API (`https://kubernetes.default.svc`).
- `spec.syncPolicy.automated`: Enables automatic sync and `selfHeal: true`.

### Screenshot

<!-- Paste screenshot showing Argo CD application manifest inspection here. -->

<br><br><br>

---

## 8. Capstone Mini-Project: Automated GitOps Pipeline with Argo CD

Deploy and manage a complete application using Argo CD continuous reconciliation.

### GitOps Architecture:

```text
┌─────────────────┐
│ Git Repository  │ ── (Desired State: replicas=2)
└────────┬────────┘
         │
         ▼  (Poll / Webhook)
┌─────────────────┐
│     Argo CD     │ ── (Compares Desired vs Actual State)
└────────┬────────┘
         │
         ▼  (Auto-Sync & Self-Heal)
┌─────────────────┐
│ Kubernetes Pods │ ── (Actual State: 2 Running Pods)
└─────────────────┘
```

### Step 8.1: Install Argo CD into the Cluster

Create the `argocd` namespace and apply official installation manifests:

```bash
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Wait for Argo CD controller pods to become ready:

```bash
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=120s
kubectl get pods -n argocd
```

### Step 8.2: Access Argo CD Web UI

Retrieve the initial `admin` password:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo ""
```

Port forward the Argo CD API server:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443 &
```

Open `https://localhost:8080` in your browser and log in with username `admin` and the retrieved password.

### Step 8.3: Deploy the Mini-Project Application via Argo CD

Inspect the mini-project manifests:

```bash
cat session20-monitoring-observability-gitops/08-mini-project/app/namespace.yaml
cat session20-monitoring-observability-gitops/08-mini-project/app/deployment.yaml
cat session20-monitoring-observability-gitops/08-mini-project/app/service.yaml
cat session20-monitoring-observability-gitops/08-mini-project/app/argocd-application.yaml
```

Apply the Argo CD Application resource:

```bash
kubectl apply -f session20-monitoring-observability-gitops/08-mini-project/app/argocd-application.yaml
```

### Step 8.4: Verify Deployment and Self-Healing

Check Argo CD application sync status:

```bash
kubectl get applications -n argocd
kubectl get pods -n session20-mini
kubectl get svc -n session20-mini
```

Test GitOps Self-Healing (delete a pod manually and watch Argo CD recreate it):

```bash
kubectl delete pod -n session20-mini --all
kubectl get pods -n session20-mini
```

### Screenshot

<!-- Paste screenshot showing Argo CD UI with healthy synced app and kubectl pods running in session20-mini namespace here. -->

<br><br><br>

---

## 9. Cleanup

Clean up the Argo CD application and local cluster resources:

```bash
# 1. Delete the Argo CD application
kubectl delete -f session20-monitoring-observability-gitops/08-mini-project/app/argocd-application.yaml --ignore-not-found

# 2. Delete the application namespace
kubectl delete namespace session20-mini --ignore-not-found
kubectl delete -f session20-monitoring-observability-gitops/02-metrics-logs-traces/k8s-demo/ --ignore-not-found

# 3. Stop background port-forward
pkill -f "kubectl port-forward svc/argocd-server" || true

# 4. Optional: Uninstall Argo CD if desired
# kubectl delete -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml --ignore-not-found
# kubectl delete namespace argocd --ignore-not-found

# 5. Verify clean cluster state
kubectl get pods -A | grep -E "(session20|observability)" || echo "Cluster clean"
```

### Final Screenshot

<!-- Paste screenshot showing cleanup execution and clean cluster verification here. -->

<br><br><br>
