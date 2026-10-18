# CI/CD & GitHub Actions (MCQ + Lab)

> Lab may ask you to write a workflow YAML. MCQs test CI vs CD and the workflow → job → step hierarchy.

---

## 1. CI vs CD ⭐

| Term | Meaning |
|------|---------|
| **CI — Continuous Integration** | Every push automatically **builds + tests** the code. Finds problems early. |
| **CD — Continuous Delivery** | After tests pass, app is always **ready to deploy** (release = manual approval). |
| **CD — Continuous Deployment** | After tests pass, app is **automatically deployed to production** (no manual step). |

**Pipeline stages:** Checkout → Build → Test → Package → Deploy.

---

## 2. GitHub Actions hierarchy ⭐

```text
Workflow  →  Job(s)  →  Step(s)        (a Runner executes a Job)
```

| Level | What it is |
|-------|-----------|
| **Workflow** | YAML file in `.github/workflows/`. Defines WHEN + WHAT. |
| **Job** | Group of steps on one runner. Jobs run **in parallel** unless `needs:` links them. |
| **Step** | One task: either `uses:` (prebuilt action) or `run:` (shell command). Steps run **sequentially**. |
| **Runner** | The machine that runs a job (`ubuntu-latest`, or self-hosted). |

---

## 3. Key YAML keys

| Key | Meaning |
|-----|---------|
| `on:` | Trigger: `push`, `pull_request`, `workflow_dispatch` (manual), `schedule` (cron), `release` |
| `jobs:` | The jobs to run |
| `runs-on:` | Which runner, e.g. `ubuntu-latest` |
| `needs:` | Make this job wait for another (dependency) |
| `steps:` | List of steps |
| `uses:` | Call a prebuilt action, e.g. `actions/checkout@v4` |
| `run:` | Run shell commands (multiline with `\|`) |
| `env:` | Set environment variables |

---

## 4. Minimal workflow (lab template) ⭐

```yaml
name: CI Pipeline
on:
  push:
  workflow_dispatch:         # allow manual run
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Install deps
        run: npm install
      - name: Run build
        run: npm run build
  test:
    needs: build             # waits for build to finish
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

---

## 5. Secrets ⭐

- Sensitive values (tokens, passwords, keys). Store in **Repo → Settings → Secrets and variables → Actions**.
- Use with `${{ secrets.NAME }}`.
- **Never** hardcode or `echo` secrets. GitHub masks them in logs automatically.

```yaml
      - run: echo "Deploying..."
        env:
          API_KEY: ${{ secrets.API_KEY }}
```

---

## 6. Artifacts

- Files produced by a run (build output, reports) saved for later.
- Upload: `actions/upload-artifact@v4` with `name:` and `path:`.
- Download: `actions/download-artifact`.
- **Git stores source code; artifacts store build output.**

---

## 7. gh CLI (handy)

```bash
gh workflow run build.yml    # trigger a workflow
gh run list                  # list runs
gh run view <id> --log       # view logs
```
