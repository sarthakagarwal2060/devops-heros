# Kubernetes — From Zero (Lab: Apply & Manage)

> Exam lab = **write YAML → `kubectl apply` → check it's running**. Debugging is in `04-kubernetes-debugging.md`.
> Make sure you've read `02-docker.md` first — Kubernetes runs Docker-style containers.

---

## 1. What problem does Kubernetes solve?

Docker runs **one** container on **one** machine. But a real app needs:
- many copies running (for lots of users),
- to restart automatically if one crashes,
- to spread across many machines,
- a stable way for parts to find each other.

Doing all that by hand is impossible. **Kubernetes** (often written **K8s**) is the **manager** that does it for you: it starts containers, restarts dead ones, scales them up/down, and networks them together — across a group of machines.

Analogy: Docker makes one shipping container; Kubernetes is the **port authority** running thousands of them — loading, replacing, routing.

**Cluster** = the group of machines Kubernetes manages. Each machine is a **node**. Minikube (below) gives you a tiny one-machine cluster on your laptop for practice.

---

## 2. What is a Pod? (the smallest unit) ⭐

Kubernetes does **not** run containers directly. It wraps them in a **Pod**.

- A **Pod** = the smallest thing Kubernetes runs. Usually it holds **one container** (sometimes a couple that must stay together).
- You almost never create Pods directly — you let a **Deployment** create them (next section).

---

## 3. What is `kubectl`?

`kubectl` ("kube control") is the **command you type** to talk to the cluster. Every Kubernetes command starts with it.

```bash
kubectl get pods            # list the pods
kubectl apply -f file.yml   # create/update whatever is described in file.yml
```

---

## 4. What is YAML and why every object has the same shape

Kubernetes objects are described in **YAML** text files. YAML uses **indentation (spaces, never tabs)** to show what belongs to what.

**Every** Kubernetes YAML has these 4 top-level keys:

| Key | Means |
|-----|-------|
| `apiVersion` | Which version of the API this object uses |
| `kind` | What type of object (Pod, Deployment, Service...) |
| `metadata` | Name and **labels** (tags) for the object |
| `spec` | The actual desired configuration |

> **Declarative:** you write *what you want* (e.g. "3 copies of nginx"), run `kubectl apply`, and Kubernetes makes reality match. You don't write step-by-step instructions.

---

## 5. The objects you must be able to write

### (a) Pod — one running container
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx          # a label = a tag; used later to find this pod
spec:
  containers:
    - name: nginx
      image: nginx:latest     # which Docker image to run
      ports:
        - containerPort: 80    # the port the app listens on
```

### (b) Deployment — the one you'll actually use ⭐
A **Deployment** manages Pods for you: it keeps a set number of copies alive and replaces any that die. "Copies" are called **replicas**.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3                  # keep 3 identical pods running
  selector:
    matchLabels:
      app: nginx               # "manage pods that have the label app=nginx"
  template:                    # the blueprint for each pod it creates
    metadata:
      labels:
        app: nginx             # pods get this label
    spec:
      containers:
        - name: nginx
          image: nginx:1.25
          ports:
            - containerPort: 80
```

> ⭐ **The #1 rule:** `selector.matchLabels` **must match** the labels under `template.metadata.labels`. If they don't match, the Deployment is invalid. (The Deployment finds "its" pods by their label.)

**Why a Deployment and not a bare Pod?** If a lone Pod dies, it's gone. A Deployment notices and recreates it, and lets you scale and do rolling updates.

---

## 6. Running and managing it ⭐

```bash
kubectl apply -f deployment.yml        # create it (or update if it exists)
kubectl get pods                       # see the pods (should show 3 Running)
kubectl get deployments                # see the deployment
kubectl describe pod <name>            # detailed info about one pod
kubectl logs <pod-name>                # see what a pod's app printed
kubectl delete -f deployment.yml       # delete everything in that file
```

**Scaling (change number of copies):**
```bash
kubectl scale deployment nginx-deployment --replicas=5
```

**Rolling update (change the image with no downtime):**
```bash
kubectl set image deployment/nginx-deployment nginx=nginx:1.26
kubectl rollout status deployment/nginx-deployment   # watch it update
kubectl rollout undo deployment/nginx-deployment     # go back if it broke
```

Common verbs: `get` (list), `describe` (details), `logs` (output), `apply` (create/update), `delete` (remove).
Short names: `po`=pods, `svc`=services, `deploy`=deployments, `ns`=namespace.

---

## 7. Services — giving pods a stable address ⭐

**The problem:** Pods are disposable. When one dies and is recreated, it gets a **new IP address**. So you can't rely on a Pod's IP to reach it.

**The fix:** a **Service** is a permanent front door with a fixed address. It automatically forwards traffic to the healthy pods behind it (chosen by **label**), and load-balances across them.

Analogy: pods are delivery drivers whose phone numbers keep changing; the Service is the one permanent 1-800 number customers always call.

### The 4 ports (classic MCQ) ⭐
```text
Browser → NodeIP:nodePort(30080) → Service port(80) → targetPort(8080) → container
```
| Port | Lives on | Meaning |
|------|----------|---------|
| `nodePort` | The node (machine) | External door, range **30000–32767** |
| `port` | The Service | The Service's own port (inside the cluster) |
| `targetPort` | The Pod | The port your app actually listens on |
| `containerPort` | The Pod spec | Documentation only |

### Service types
| Type | Who can reach it | Use |
|------|------------------|-----|
| **ClusterIP** (default) | Only things **inside** the cluster | Internal app-to-app |
| **NodePort** | Outside, via `NodeIP:30000–32767` | Simple external access / demos |
| **LoadBalancer** | Outside, via a cloud load balancer | Real production |
| **ExternalName** | Redirects to an outside address | Alias to an external service |
| **Headless** (`clusterIP: None`) | Direct to each pod | Databases / StatefulSets |

### Service YAML
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  type: NodePort
  selector:
    app: nginx          # send traffic to pods labelled app=nginx (must match pod labels!)
  ports:
    - port: 80          # the Service's port
      targetPort: 80    # the container's port
      nodePort: 30080   # external port (NodePort only)
```
```bash
kubectl get svc
kubectl get endpoints nginx-svc   # lists the pod IPs behind the service; EMPTY = labels don't match
```

---

## 8. ConfigMap & Secret — supplying settings

Apps need settings (a color, a database password). You don't hardcode those in the image; you inject them.

- **ConfigMap** = non-secret settings (plain text).
- **Secret** = sensitive settings (passwords, keys). Stored base64-encoded.

```bash
kubectl create configmap app-config --from-literal=COLOR=blue
kubectl create secret generic db-secret --from-literal=PASSWORD=root
```
Used in a pod:
```yaml
    envFrom:
      - configMapRef: { name: app-config }
      - secretRef:    { name: db-secret }
```

---

## 9. Probes — health checks (links to debugging)

Kubernetes can regularly check if your container is healthy.

| Probe | Question | If it fails |
|-------|----------|-------------|
| **livenessProbe** | "Is the app alive?" | Kubernetes **restarts** the container |
| **readinessProbe** | "Is it ready for traffic?" | Pod is kept **out** of the Service until ready |
| **startupProbe** | "Has it finished starting up?" | Delays the other probes |

```yaml
      livenessProbe:
        httpGet: { path: /, port: 80 }
        initialDelaySeconds: 5     # wait 5s before first check
        periodSeconds: 5           # then check every 5s
        failureThreshold: 3        # 3 fails in a row = unhealthy
```
> ⚠️ A badly-configured liveness probe keeps restarting a perfectly healthy app — it *looks* like a crash. (See `04`.)

---

## 10. Scaling automatically (HPA) — recognize it

**HPA (Horizontal Pod Autoscaler)** automatically adds/removes pods based on load (e.g. CPU usage).
```bash
kubectl autoscale deployment nginx-deployment --cpu-percent=50 --min=1 --max=5
```
"Horizontal" = more copies (not a bigger machine).

---

## 11. Storage vocabulary (recognize the terms)

| Term | Plain meaning |
|------|---------------|
| **Volume** (`emptyDir`) | Temporary storage; dies with the pod |
| **PV** (PersistentVolume) | A real piece of storage in the cluster |
| **PVC** (PersistentVolumeClaim) | A pod's **request** for storage; it binds to a PV |
| **StorageClass** | Creates storage automatically on demand |

Flow: `Pod → asks via PVC → gets a PV`.

---

## 12. Namespaces & Minikube

**Namespace** = a folder to group and separate resources inside one cluster.
```bash
kubectl get pods -n kube-system     # pods in the "kube-system" namespace
kubectl create namespace myapp
```

**Minikube** = a tiny Kubernetes cluster on your own laptop, for learning.
```bash
minikube start                       # start the local cluster
kubectl get nodes                    # should show one node, Ready
minikube service nginx-svc --url     # get a URL to open a NodePort service
```
