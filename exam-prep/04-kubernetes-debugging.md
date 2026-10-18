# Kubernetes Debugging — From Zero (Lab ⭐)

> The exam gives you a **broken pod** and asks you to **find out why and fix it**. This is the most important lab topic. Read `03-kubernetes.md` first.

---

## 1. The idea

When a pod isn't working, **don't guess**. Kubernetes tells you what's wrong if you ask it the right questions in the right order. Each command answers one question:

```text
kubectl get pods            →  "What's the status?"       (quick look)
      ↓
kubectl describe pod X       →  "What did K8s try to do?"  (read the EVENTS)
      ↓
kubectl logs X               →  "What is the app saying?"  (app's own messages)
      ↓
kubectl logs X --previous    →  "Why did it crash before?" (logs of the dead container)
      ↓
kubectl exec -it X -- sh     →  "What's it like inside?"   (go into the container)
      ↓
Find the cause → Fix the YAML → kubectl apply → Verify it's Running
```

> **The 3 commands that solve almost everything:** `describe` (read the Events at the bottom), `logs`, and `logs --previous`.

---

## 2. Reading a pod's status ⭐

`kubectl get pods` shows a STATUS column. Here's what each status means and what to check first:

| Status | Plain meaning | Check first |
|--------|---------------|-------------|
| `Running` (`1/1 READY`) | Healthy | nothing (or `logs` if misbehaving) |
| `Running` but `0/1 READY` | Started but not ready for traffic | readiness probe + `logs` |
| `Pending` | Can't be placed on any machine yet | `describe` → Events |
| `ContainerCreating` | Still pulling image / setting up | `describe` → Events |
| `CrashLoopBackOff` | App keeps starting and crashing | `logs --previous` |
| `ImagePullBackOff` / `ErrImagePull` | Can't download the image | `describe` → check image name |
| `CreateContainerConfigError` | A ConfigMap/Secret it needs is missing | `describe` → Events |
| `OOMKilled` | Ran out of memory and was killed | raise memory limit |
| `Error` / `Completed` | Container exited | `logs`, check the command |

The **READY** column shows `ready/total` containers. `0/1` means the one container isn't ready.
The **RESTARTS** column counts restarts — a number that keeps climbing = CrashLoopBackOff.

---

## 3. CrashLoopBackOff — the most likely exam scenario ⭐

**What the words mean:** the container **starts → the app crashes → Kubernetes restarts it → it crashes again**. After repeated crashes, Kubernetes waits longer and longer before retrying ("backing off") — hence *CrashLoop-BackOff*.

```text
start → crash → restart → crash → restart → (wait longer) → CrashLoopBackOff
```

**How to diagnose:**
```bash
kubectl get pods                 # see CrashLoopBackOff + rising RESTARTS
kubectl logs <pod>               # what the current attempt says
kubectl logs <pod> --previous    # ⭐ the logs from the crashed attempt — usually the real clue
kubectl describe pod <pod>       # Events + the container's exit code
```
> Why `--previous`? The container already crashed and a new one is starting, so `logs` alone may show nothing. `--previous` shows the **dead** container's final words.

**Common causes and the fix:**

| Cause | How you'd spot it | Fix |
|-------|-------------------|-----|
| Wrong command in the YAML (`command`/`args`/`CMD`) | logs show "command not found" / instant exit | correct it, re-apply |
| Missing env var / ConfigMap / Secret | logs: "X is not set" / config error | create it or fix the reference |
| App needs a database that's down | logs: "connection refused" | fix/start the dependency |
| App crashes on a bug | logs show a stack trace/error | fix the app |
| **Bad liveness probe** kills a healthy app | pod restarts but logs look fine | fix the probe path/port or raise `initialDelaySeconds` |
| Out of memory | status `OOMKilled` | raise `resources.limits.memory` |

**Fix and verify:**
```bash
kubectl apply -f fixed.yml           # apply the corrected YAML
# or edit the live object directly:
kubectl edit deployment <name>
kubectl get pods -w                  # -w = watch; wait for Running and 1/1 READY
```

---

## 4. ImagePullBackOff — can't download the image

**Meaning:** Kubernetes tried to pull (download) the container image and failed, so it keeps retrying ("backing off").

```bash
kubectl describe pod <pod>    # the Events lines show the exact pull error
```
| Cause | Fix |
|-------|-----|
| Typo in the image name/tag (`nginx:latst`) | fix `image:` in the YAML |
| That tag/version doesn't exist | use a real tag |
| Private image, no login | add an image pull secret |
| No internet on the node | fix networking |

---

## 5. Pending — the pod can't be placed

**Meaning:** Kubernetes can't find a machine (node) to run the pod on.

```bash
kubectl describe pod <pod>    # Events explain why it won't schedule
```
| Cause | Fix |
|-------|-----|
| Nodes don't have enough CPU/memory | lower the pod's requests, or add nodes |
| It needs storage (PVC) that isn't ready | fix/create the PV or StorageClass |
| Node rules (taints/selectors) don't match | fix the scheduling rules |

---

## 6. Service not reachable — the label trap ⭐

**Symptom:** pods are `Running` but you still can't reach the app through the Service.

```bash
kubectl get pods                   # are the pods Running and READY?
kubectl get svc                    # does the Service exist?
kubectl describe svc <svc>         # check its selector
kubectl get endpoints <svc>        # ⭐ EMPTY means no pods matched the Service
```

**The #1 cause:** the Service's `selector` labels **don't match** the Pod's labels. The Service then points at nothing → `endpoints` is empty → no traffic gets through.

```text
Pod labels   ==   Service selector   →   endpoints get filled in   →   traffic flows
```
**Fix:** make the Service `selector` equal the Pod `labels`, re-apply. Also check `targetPort` equals the port the app really uses.

---

## 7. DNS not working — names won't resolve

**Meaning:** inside the cluster, services are reached by **name** (not IP). If name lookup fails, apps can't find each other. **CoreDNS** is the cluster's phone book.

```bash
kubectl exec -it <pod> -- nslookup <service-name>   # test a lookup from inside a pod
kubectl get pods -n kube-system                     # is CoreDNS Running?
kubectl logs -n kube-system -l k8s-app=kube-dns     # CoreDNS logs
```
A service's full DNS name: `<service>.<namespace>.svc.cluster.local`.

---

## 8. Quick reference — which command answers what

| Command | Answers |
|---------|---------|
| `kubectl get pods` | "What's the status?" |
| `kubectl describe pod X` | "What did Kubernetes try? (read Events)" |
| `kubectl logs X` | "What is the app saying now?" |
| `kubectl logs X --previous` | "Why did it crash last time?" |
| `kubectl exec -it X -- sh` | "What does it look like inside?" |
| `kubectl get endpoints X` | "Is the Service actually wired to pods?" |

---

## 9. How to answer a debugging lab (say this out loud) ⭐

1. **Look:** `kubectl get pods` → read the STATUS (e.g. CrashLoopBackOff).
2. **Investigate:** `kubectl describe pod X` → read the **Events** at the bottom.
3. **Read logs:** `kubectl logs X --previous` → find the actual error message.
4. **Name the root cause** in one sentence (e.g. "wrong image tag" / "missing env var" / "liveness probe hitting wrong port").
5. **Fix** the YAML and `kubectl apply -f` (or `kubectl edit`).
6. **Verify:** `kubectl get pods -w` until it shows `Running` and `1/1 READY`.

> Graders want to see this **process**, not a lucky guess. State what you see → explain the cause → fix → prove it's fixed.
