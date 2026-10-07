# Session 21: DevOps Final Capstone — TaskBoard (Full-Stack Cloud-Native SaaS) Assignment

### TaskBoard Full-Stack Application UI Screenshot

<!-- Paste TaskBoard React frontend connected to FastAPI backend screenshot here. -->

<br><br><br>

### Production Kubernetes Cluster & Helm Deployment Screenshot

<!-- Paste kubectl get all -n taskboard or Helm release overview screenshot here. -->

<br><br><br>

Work through the exercises in order. Run the commands from the repository root:

---

## Prerequisites

- Python 3.12+ with `pip` and `venv`
- Node.js (v18+) and `npm`
- Docker Engine & Docker Compose
- `kubectl` configured for your cluster (Minikube / Kind / EKS)
- Helm 3 package manager
- Terraform CLI (>= 1.6.0) & AWS CLI (configured)
- Security scanning tools: `trivy`

Check local tool versions and environment readiness:

```bash
docker --version
docker compose version
python3 --version
node --version
kubectl cluster-info
helm version
terraform version
```

### Screenshot

<!-- Paste screenshot showing local toolchain versions and cluster connectivity here. -->

<br><br><br>

---

## Module 1: Full-Stack Application Architecture & Local Docker Compose

TaskBoard is a multi-tier SaaS project management application comprising:
- **Frontend**: React + Vite single-page application (`frontend/`)
- **Backend**: FastAPI REST API with SQLAlchemy ORM and Alembic migrations (`backend/`)
- **Database**: PostgreSQL persistent database (`postgres:16-alpine`)

Inspect the local multi-container stack:

```bash
cat session21-python/docker-compose.yml
```

Launch the entire stack using Docker Compose:

```bash
cd session21-python
docker compose up --build -d
docker compose ps
```

Verify service endpoints:

```bash
# Frontend UI
curl -I http://localhost:3000

# Backend Health, Readiness, and API docs
curl http://localhost:8000/health
curl http://localhost:8000/ready
curl http://localhost:8000/api/tasks
```

Open `http://localhost:3000` in your browser to verify the interactive TaskBoard dashboard.

Stop the local stack:

```bash
docker compose down
cd ..
```

### Screenshot

<!-- Paste screenshot showing docker compose running containers and TaskBoard browser UI here. -->

<br><br><br>

---

## Module 2: Automated Testing & Code Quality with Pytest

Automated testing is the primary quality gate in the CI/CD pipeline, guaranteeing that bugs and regressions are caught before container images are generated.

Navigate to the backend and configure dependencies:

```bash
cd session21-python/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Execute the automated test suite with verbose output:

```bash
pytest -v
```

Inspect the test suite coverage:

```bash
cat tests/test_api.py
deactivate
cd ../..
```

### Screenshot

<!-- Paste screenshot showing all backend pytest unit tests passing here. -->

<br><br><br>

---

## Module 3: Production Containerization & Multi-Stage Dockerfiles

Inspect how both services are packaged into optimized container images:
- **Backend Dockerfile**: Installs dependencies, sets up Alembic, runs database migrations, creates a non-root user, and runs Uvicorn.
- **Frontend Dockerfile**: Multi-stage build (Node.js build stage compiles assets; lightweight Nginx alpine serves static files).

Inspect the Dockerfiles:

```bash
cat session21-python/backend/Dockerfile
cat session21-python/frontend/Dockerfile
```

Build the production images locally:

```bash
docker build -t taskboard-backend:latest session21-python/backend/
docker build -t taskboard-frontend:latest session21-python/frontend/
docker images | grep taskboard
```

### Screenshot

<!-- Paste screenshot showing Dockerfile inspection and image build output here. -->

<br><br><br>

---

## Module 4: DevSecOps Vulnerability Scanning with Trivy

Before pushing container images to the registry, scan both the application dependencies and base OS packages for CVEs.

Run Trivy vulnerability scans on the built images:

```bash
# Scan backend image for HIGH and CRITICAL vulnerabilities
trivy image --severity HIGH,CRITICAL taskboard-backend:latest

# Scan frontend image
trivy image --severity HIGH,CRITICAL taskboard-frontend:latest
```

### Screenshot

<!-- Paste screenshot showing Trivy container security scan results here. -->

<br><br><br>

---

## Module 5: Automated CI/CD Pipeline (GitHub Actions)

The CI/CD pipeline automates the complete developer lifecycle on every push to `main`:
1. Run backend tests (`pytest`)
2. Build frontend production bundle (`npm run build`)
3. Build Docker container images
4. Perform Trivy vulnerability scans
5. Publish secured images to GitHub Container Registry (GHCR)

Inspect the GitHub Actions workflow definition:

```bash
cat session21-python/.github/workflows/ci-cd.yml
```

### Screenshot

<!-- Paste screenshot showing GitHub Actions ci-cd.yml workflow inspection here. -->

<br><br><br>

---

## Module 6: Infrastructure as Code with Terraform (AWS VPC & EKS)

TaskBoard infrastructure is declared using Terraform to provision a production-ready AWS network and Kubernetes cluster.

Inspect the Terraform configuration:

```bash
cat session21-python/terraform/versions.tf
cat session21-python/terraform/variables.tf
cat session21-python/terraform/main.tf
cat session21-python/terraform/outputs.tf
```

Validate the Terraform configuration:

```bash
cd session21-python/terraform
terraform init
terraform validate
cd ../..
```

### Screenshot

<!-- Paste screenshot showing Terraform EKS/VPC configuration and terraform validate output here. -->

<br><br><br>

---

## Module 7: Kubernetes Package Management with Helm

The application is packaged into a reusable Helm chart (`taskboard`) with parameterizable environment values:
- `values.yaml`: Default configuration
- `values-dev.yaml`: Development deployment configuration
- `values-prod.yaml`: Production deployment configuration with multiple replicas, ingress, and resource limits

Inspect the Helm chart structure and templates:

```bash
ls -la session21-python/helm/taskboard/
cat session21-python/helm/taskboard/Chart.yaml
cat session21-python/helm/taskboard/values.yaml
```

Lint the Helm chart to ensure best practices:

```bash
helm lint session21-python/helm/taskboard
```

Render chart manifests locally:

```bash
helm template taskboard-dev session21-python/helm/taskboard -f session21-python/helm/taskboard/values-dev.yaml
```

### Screenshot

<!-- Paste screenshot showing helm lint and helm template rendering output here. -->

<br><br><br>

---

## Module 8: Kubernetes Deployment, Ingress & Autoscaling (HPA)

Deploy TaskBoard to Kubernetes using the Helm chart.

Create the namespace and deploy the application:

```bash
kubectl apply -f session21-python/k8s/namespace.yaml
helm install taskboard session21-python/helm/taskboard -n taskboard -f session21-python/helm/taskboard/values-dev.yaml
```

Inspect all deployed workloads:

```bash
helm list -n taskboard
kubectl get pods,svc,ingress,hpa -n taskboard
```

Test application connectivity inside the cluster:

```bash
kubectl port-forward svc/taskboard-frontend -n taskboard 3000:80 &
kubectl port-forward svc/taskboard-backend -n taskboard 8000:8000 &
curl http://localhost:8000/health
```

### Screenshot

<!-- Paste screenshot showing Helm release install, kubectl get all -n taskboard, and live health check here. -->

<br><br><br>

---

## Module 9: Production Observability with Prometheus & Grafana

Monitor application metrics, request latencies, and pod health using Prometheus and Grafana.

Inspect the monitoring values:

```bash
cat session21-python/monitoring/prometheus-values.yaml
```

Verify backend Prometheus metrics scraping endpoint:

```bash
curl http://localhost:8000/metrics | grep -E "(http_requests_total|process_cpu_seconds)"
```

Execute load testing to trigger metrics and observe autoscaling:

```bash
chmod +x session21-python/scripts/load-test.sh
./session21-python/scripts/load-test.sh http://localhost:8000 50
```

### Screenshot

<!-- Paste screenshot showing Prometheus metrics endpoint query or Grafana dashboard here. -->

<br><br><br>

---

## Module 10: Troubleshooting Real-World Kubernetes Incidents

Diagnose and resolve common production failures using provided troubleshooting manifests:
- **Incident A (Broken Service Selector)**: Service fails to route traffic to backend pods.
- **Incident B (ImagePullBackOff)**: Pod fails due to non-existent image tag.

Inspect the broken manifests:

```bash
cat session21-python/troubleshooting/broken-service.yaml
cat session21-python/troubleshooting/broken-image.yaml
```

Deploy the broken workloads and inspect failure states:

```bash
kubectl apply -f session21-python/troubleshooting/broken-image.yaml -n taskboard
kubectl get pods -n taskboard -l app=broken-image
kubectl describe pod -n taskboard -l app=broken-image | grep -A 5 "Events:"
```

Clean up the troubleshooting resources:

```bash
kubectl delete -f session21-python/troubleshooting/broken-image.yaml -n taskboard --ignore-not-found
```

### Screenshot

<!-- Paste screenshot showing kubectl describe pod ImagePullBackOff diagnostics here. -->

<br><br><br>

---

## Module 11: Cleanup

Tear down all deployed Kubernetes resources, Helm releases, and Docker images:

```bash
# 1. Uninstall Helm release
helm uninstall taskboard -n taskboard --ignore-not-found

# 2. Delete namespace
kubectl delete namespace taskboard --ignore-not-found

# 3. Stop background port-forwards
pkill -f "kubectl port-forward" || true

# 4. Remove local Docker images
docker rmi taskboard-backend:latest taskboard-frontend:latest || true

# 5. Remove local test caches and venvs
rm -rf session21-python/backend/.venv \
       session21-python/backend/.pytest_cache \
       session21-python/backend/app/__pycache__ \
       session21-python/backend/tests/__pycache__

# 6. Verify clean cluster state
kubectl get pods -A | grep taskboard || echo "Cluster clean"
```

### Final Screenshot

<!-- Paste screenshot showing helm uninstall and clean cluster state here. -->

<br><br><br>
