# DevSecOps (MCQ Focus)

> "Shift security left" — build security checks into the CI/CD pipeline. Mostly conceptual MCQs: know what each scan type checks and a sample tool.

**Mindset:** Detect → Evaluate → Enforce → Remediate → Deploy.

---

## The security scan types ⭐ (know what each one checks)

| Type | Full name | What it scans | Example tool |
|------|-----------|---------------|--------------|
| **SAST** | Static Application Security Testing | Your **source code** (without running it) | GitHub CodeQL |
| **SCA** | Software Composition Analysis | Third-party **dependencies** for known CVEs | pip-audit |
| **Secret Scanning** | — | Credentials accidentally committed (keys, tokens, passwords) | GitHub Secret Scanning |
| **Image Scanning** | Container Image Scanning | The final **Docker image** (OS + library packages) | Trivy |

> ⭐ Key distinction: **SAST = your code**, **SCA = your dependencies**, **Image scan = the built image**, **Secret scan = leaked credentials**. Source code can be clean while the image is still vulnerable.

---

## 1. SAST — Static Application Security Testing
- Analyzes **source code** for weaknesses **without executing** it.
- Tool: **CodeQL** (`github/codeql-action/init@v3` → `.../analyze@v3`, needs `security-events: write`).
- A clean SAST result ≠ fully secure.

## 2. SCA — Software Composition Analysis
- Scans **dependencies / libraries** for known vulnerabilities (CVEs).
- Tool: **pip-audit** (`pip install pip-audit` → `pip-audit`).
- Remediation: find the vulnerable package → update to a fixed version → test → re-scan.

## 3. Secret Scanning
- Detects/prevents **credentials** committed to source (API keys, passwords, tokens, cloud/DB creds).
- Fix: use env vars / secret managers (`os.getenv`, `${{ secrets.X }}`).
- GitHub **push protection** blocks known secret patterns before they're pushed.
- ⭐ If a real secret leaks: **revoke/rotate it** — deleting the line is not enough (it's still in Git history).

## 4. Container Image Scanning
- Scans the final **Docker image** for vulnerable OS/language packages.
- Tool: **Trivy** — `trivy image <image>`, filter `--severity HIGH,CRITICAL`, fail the build with `--exit-code 1`.

## 5. Security Gates
- Turn scan **results** into pipeline **decisions**: PASS → continue, FAIL → stop the pipeline.
- In GitHub Actions, built with `needs:` chaining:
  `test → sast/sca → docker-build → image-scan → push → deploy`.
- Goal is to **enforce policy**, not just run the tools.
