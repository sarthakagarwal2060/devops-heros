# Start Here — The Absolute Basics

> Read this first. It explains the words everything else uses, assuming you know nothing.

---

## What is the terminal?

The **terminal** (also called shell, command line, or CLI) is a text window where you **type commands** to tell the computer what to do, instead of clicking buttons.

- You type a **command**, press **Enter**, the computer runs it and prints the result.
- Example: you type `ls` and press Enter → it lists the files in your current folder.

A **command** usually looks like this:

```bash
command  option(s)  argument(s)
```
```bash
ls       -l         /home
```
- `ls` = the command (what to do)
- `-l` = an **option/flag** (changes how it behaves; flags start with `-`)
- `/home` = an **argument** (what to act on)

---

## What is a file and a folder (directory)?

- A **file** holds data (text, a picture, code).
- A **folder** (also called a **directory**) holds files and other folders.
- Folders are nested inside folders, forming a tree. We write the path through that tree with `/`:
  - `data1/data2/data.txt` means: folder `data1` → inside it folder `data2` → inside that the file `data.txt`.

---

## What is a server?

A **server** is just a computer that runs all the time and provides a service to other computers (a website, a database, an app). When your app "runs on a server," it means it's running on one of these always-on machines, usually in a data center / the cloud.

---

## What is "the cloud"?

The **cloud** = renting computers over the internet from companies like **AWS** (Amazon), **Azure** (Microsoft), or **Google Cloud**, instead of buying your own. You pay for what you use and can get more computers instantly.

---

## What is DevOps? (one line)

**DevOps** = the practices and tools for **building, shipping, and running software reliably and automatically**. The tools in this course are the common DevOps toolkit.

---

## The big picture: how the pieces fit

Here is the journey of an app, and which tool does what. Don't memorize it yet — just see how the topics connect.

```text
1. You write code
        │
   (Git / GitHub)         ← save & share code, track changes
        │
2. Package the app into a "container"
        │
   (Docker)               ← put the app + everything it needs in a box
        │
3. Run many containers reliably at scale
        │
   (Kubernetes)           ← starts, restarts, scales, connects containers
        │
   (Helm)                 ← installs apps onto Kubernetes easily
        │
4. Automate build → test → deploy
        │
   (GitHub Actions / CI-CD) ← runs steps automatically on every code change
        │
5. Create the servers/network to run on
        │
   (Terraform + Cloud)    ← build infrastructure with code
        │
6. Watch it & keep it correct
        │
   (Prometheus/Grafana)   ← monitor health
   (GitOps / ArgoCD)      ← keep cluster matching Git
   (DevSecOps)            ← security checks along the way
```

---

## Two words you'll see constantly

| Word | Plain meaning |
|------|---------------|
| **Image** | A saved "template" or snapshot of an app, ready to run. Like an installer. |
| **Container** | A running copy made from an image. Like the installed, running program. |
| **YAML** | A simple text format for writing configuration (used by Kubernetes, GitHub Actions, etc.). Uses indentation (spaces) to show structure. |
| **Deploy** | To put your app onto a server so people can use it. |
| **Cluster** | A group of computers working together as one (Kubernetes runs on a cluster). |

> Now go to the topic files. `01` (Linux) and `02` (Docker) are the gentlest starting points.
