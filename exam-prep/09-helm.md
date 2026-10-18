# Helm (MCQ + Lab)

> Helm = the **package manager for Kubernetes**. Write one chart, deploy it with different values per environment.

---

## 1. Three core concepts ⭐

| Term | Meaning | Analogy |
|------|---------|---------|
| **Chart** | Packaged templates + default values | The recipe |
| **Release** | A running instance of a chart in a cluster | The cooked meal |
| **Values** | Variables passed in | The ingredients |

Helm solves copy-paste and config drift across many YAML files.

---

## 2. Chart structure ⭐

```text
my-chart/
├── Chart.yaml      # metadata (name, version, appVersion)
├── values.yaml     # default variables
├── charts/         # dependency charts
└── templates/      # K8s YAML with {{ }} placeholders
    ├── _helpers.tpl
    └── NOTES.txt
```

**Chart.yaml** key fields:
| Field | Meaning |
|-------|---------|
| `apiVersion: v2` | Required for Helm 3 |
| `name` | Chart name |
| `version` | The **chart's** version (SemVer) |
| `appVersion` | The **app/image** version |
| `type` | `application` or `library` |

---

## 3. Templating (Go templates in `{{ }}`)

```yaml
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: app
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
```

| Placeholder | Source |
|-------------|--------|
| `{{ .Values.x }}` | from `values.yaml` |
| `{{ .Release.Name }}` | release name at install time |
| `{{ .Chart.Name }}` / `.Chart.Version` | from `Chart.yaml` |

Conditionals: `{{- if .Values.service.enabled }} ... {{- end }}`.

**Values override precedence (low → high):** `values.yaml` → `-f file` → `--set`. `--set` always wins.

---

## 4. Core commands ⭐

```bash
helm create my-chart              # generate skeleton chart
helm lint ./my-chart              # check for errors
helm template my-rel ./my-chart   # render YAML locally (dry run, no cluster)
helm install my-rel ./my-chart    # install a release
helm install my-rel ./chart -f values-prod.yaml --set replicaCount=3
helm list                         # list releases
helm upgrade my-rel ./chart --set replicaCount=3
helm upgrade --install my-rel ./chart   # install if new, upgrade if exists (CI-safe)
helm history my-rel               # list revisions
helm rollback my-rel 1            # roll back to revision 1
helm uninstall my-rel             # delete the release
```

| Command | Behavior |
|---------|----------|
| `install` | Fails if release already exists |
| `upgrade` | Fails if release doesn't exist |
| `upgrade --install` | Handles both — safest for CI/CD |
| each install/upgrade | Creates a new **REVISION** (enables rollback) |

> `rollback` creates a **new** revision that matches an old one. `--atomic` auto-rolls back if pods fail to become ready.

---

## 5. Helm 2 vs Helm 3 (MCQ)

| Helm 2 | Helm 3 |
|--------|--------|
| Needed **Tiller** server pod (security risk) | **No Tiller**, client-only |
| Tiller had cluster-admin | Uses your kubeconfig permissions |
| — | Release state stored as **Kubernetes Secrets** |
