# Session 17: DevSecOps — Secure CI/CD Pipelines Assignment

### GitHub Actions DevSecOps Pipeline Overview Screenshot

<!-- Paste overall DevSecOps pipeline run screenshot here. -->

<br><br><br>

### DevSecOps Application Dashboard / Security Summary Screenshot

<!-- Paste running application UI or security scan summary screenshot here. -->

<br><br><br>

Work through the exercises in order. Run the commands from the repository root:

---

## Prerequisites

- Git configured and authenticated with your GitHub account
- GitHub CLI (`gh`) installed and authenticated
- Python 3.12+ with `pip`
- Docker installed and daemon running
- `kubectl` configured for your cluster (e.g., Minikube)
- Security scanning tools: `pip-audit` (SCA), `trivy` (Container Scanning)

Check your local toolchain and environment:

```bash
git --version
python3 --version
docker --version
kubectl cluster-info
gh --version
gh auth status
```

### Screenshot

<!-- Paste screenshot showing local prerequisite versions and authentication status here. -->

<br><br><br>

---

## 1. Local Testing and Code Coverage

Before securing and automating application builds, ensure the base application code and test suites pass locally.

Navigate to the DevSecOps demo application directory:

```bash
cd session-17-devsecops/demo
```

Create a virtual environment and install dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

Run the unit tests with code coverage reporting:

```bash
pytest --cov=app --cov-report=term-missing
```

Start the Flask application locally:

```bash
python3 app/app.py
```

Test endpoints in a separate terminal:

```bash
curl http://localhost:5001/health
curl http://localhost:5001/api/status
```

Return to repository root:

```bash
deactivate
cd ../..
```

### Screenshot

<!-- Paste screenshot showing pytest execution with coverage report and health check output here. -->

<br><br><br>

---

## 2. Static Application Security Testing (SAST)

**SAST** analyzes application source code at rest for security flaws, insecure functions, and code smells without executing the code.

Inspect the SAST guidance and configuration:

```bash
cat session-17-devsecops/04-sast/README.md
```

Review how SAST is configured in GitHub Actions using GitHub CodeQL:

```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v3
  with:
    languages: python

- name: Perform CodeQL Analysis
  uses: github/codeql-action/analyze@v3
```

Run a local Python security analysis using `bandit` (if installed):

```bash
pip install bandit --break-system-packages
bandit -r session-17-devsecops/demo/app/
```

### Screenshot

<!-- Paste screenshot showing SAST configuration or Bandit code scan output here. -->

<br><br><br>

---

## 3. Software Composition Analysis (SCA)

**SCA** scans third-party libraries and dependencies (`requirements.txt`) against known vulnerability databases (CVEs).

Inspect the SCA guidance:

```bash
cat session-17-devsecops/05-sca/README.md
```

Run a dependency vulnerability audit using `pip-audit`:

```bash
pip install pip-audit --break-system-packages
pip-audit -r session-17-devsecops/demo/requirements.txt
```

Expected output:
```text
No known vulnerabilities found
```

### Screenshot

<!-- Paste screenshot showing pip-audit scan results for dependencies here. -->

<br><br><br>

---

## 4. Secret Scanning and Credential Leak Prevention

Secret scanning prevents credentials, private keys, and API tokens from being accidentally committed to Git repositories.

Inspect secret scanning guidelines:

```bash
cat session-17-devsecops/06-secret-scanning/README.md
```

Check the repository locally for uncommitted secret files:

```bash
find . -type f \( \
  -name ".env" \
  -o -name "*.pem" \
  -o -name "*.key" \
  -o -name "*_rsa" \
\)
```

Verify that `.gitignore` and `.dockerignore` properly exclude environment files:

```bash
grep -E "(\.env|\.pem|\.key)" session-17-devsecops/demo/.gitignore
cat session-17-devsecops/demo/SECURITY.md
```

### Screenshot

<!-- Paste screenshot showing secret scanning command and security policy files here. -->

<br><br><br>

---

## 5. Container Packaging and Image Vulnerability Scanning

Container images frequently package operating system packages and system libraries that may carry unpatched CVEs.

Inspect container scanning concepts:

```bash
cat session-17-devsecops/07-container-image-scanning/README.md
```

Build the application Docker container image:

```bash
docker build -t hey-cicd:latest session-17-devsecops/demo/
docker images | grep hey-cicd
```

Scan the built Docker image for vulnerabilities using **Trivy**:

```bash
trivy image --severity HIGH,CRITICAL hey-cicd:latest
```

### Screenshot

<!-- Paste screenshot showing Docker build output and Trivy vulnerability scan report here. -->

<br><br><br>

---

## 6. Container Registry Integration (GHCR)

Once an image passes security scans, it is tagged and published to a secure container registry.

Inspect registry configuration:

```bash
cat session-17-devsecops/02-container-registry/README.md
```

Authenticate Docker with GitHub Container Registry (GHCR):

```bash
echo $(gh auth token) | docker login ghcr.io -u $(gh api user -q .login) --password-stdin
```

Tag the local image for GHCR:

```bash
export GITHUB_USER=$(gh api user -q .login)
docker tag hey-cicd:latest ghcr.io/$GITHUB_USER/hey-cicd:latest
docker images | grep ghcr.io
```

### Screenshot

<!-- Paste screenshot showing GHCR Docker login and tagged container image here. -->

<br><br><br>

---

## 7. Security Gates and Pipeline Policy Enforcement

A **security gate** evaluates scan results and automatically halts the pipeline if security thresholds are violated.

Inspect security gate principles:

```bash
cat session-17-devsecops/08-security-gates/README.md
```

Review gate enforcement logic in GitHub Actions:

```yaml
# Trivy Security Gate: Fail build if CRITICAL vulnerabilities exist
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'hey-cicd:latest'
    format: 'table'
    exit-code: '1'
    ignore-unfixed: true
    vuln-type: 'os,library'
    severity: 'CRITICAL'
```

### Screenshot

<!-- Paste screenshot showing security gate configuration or policy enforcement here. -->

<br><br><br>

---

## 8. Capstone Mini-Project: Complete DevSecOps Pipeline (`hey-cicd`)

Execute the complete end-to-end DevSecOps lifecycle: test, scan code, scan packages, build container, scan image, push to GHCR, and deploy to Kubernetes.

### Architecture Flow:

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  pytest-cov  │ ──► │  SAST CodeQL │ ──► │  SCA Audit   │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Deploy (k8s) │ ◄── │  Push (GHCR) │ ◄── │ Trivy Image  │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Step 8.1: Inspect the DevSecOps Workflow File

```bash
cat session-17-devsecops/demo/.github/workflows/devsecops.yml
```

### Step 8.2: Deploy Application to Kubernetes

Inspect the manifests:

```bash
cat session-17-devsecops/demo/k8s/deployment.yaml
cat session-17-devsecops/demo/k8s/service.yaml
```

Apply the deployment and service manifests:

```bash
kubectl apply -f session-17-devsecops/demo/k8s/deployment.yaml
kubectl apply -f session-17-devsecops/demo/k8s/service.yaml
```

Verify running pods and services:

```bash
kubectl get pods -l app=hey-cicd
kubectl get svc hey-cicd-service
```

### Step 8.3: Validate Running Service

Port forward or access the service URL:

```bash
kubectl port-forward svc/hey-cicd-service 5001:5001 &
curl http://localhost:5001/health
```

### Screenshot

<!-- Paste screenshot showing Kubernetes deployment, running pods, and live endpoint verification here. -->

<br><br><br>

---

## 9. Cleanup

Tear down local Kubernetes resources and Docker images created during testing:

```bash
# 1. Delete Kubernetes resources
kubectl delete -f session-17-devsecops/demo/k8s/service.yaml --ignore-not-found
kubectl delete -f session-17-devsecops/demo/k8s/deployment.yaml --ignore-not-found

# 2. Kill background port-forward (if running)
pkill -f "kubectl port-forward svc/hey-cicd-service" || true

# 3. Remove local Docker images
docker rmi hey-cicd:latest || true
docker rmi ghcr.io/$GITHUB_USER/hey-cicd:latest || true

# 4. Remove local virtual environment and test caches
rm -rf session-17-devsecops/demo/.venv \
       session-17-devsecops/demo/.pytest_cache \
       session-17-devsecops/demo/.coverage \
       session-17-devsecops/demo/app/__pycache__ \
       session-17-devsecops/demo/tests/__pycache__

# 5. Verify clean cluster state
kubectl get pods
```

### Final Screenshot

<!-- Paste screenshot showing resource cleanup and clean cluster state here. -->

<br><br><br>
