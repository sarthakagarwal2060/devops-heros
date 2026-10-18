# Docker — From Zero (Lab: Build & Run)

> Exam lab = **write a Dockerfile → build an image → run a container**. No Docker debugging questions.
> New to this? Read `00-start-here.md` first.

---

## 1. What problem does Docker solve?

You build an app on your laptop. It works. You send it to a server — it breaks, because the server has a different version of some library, or is missing something your app needs. The classic complaint: *"but it works on my machine!"*

**Docker** fixes this by putting your app **and everything it needs** (code, libraries, settings) into one sealed box called a **container**. That box runs the same way everywhere — your laptop, a server, the cloud.

Think of it like shipping: instead of loading loose items, you pack everything into a standard shipping **container** that any ship, truck, or crane can handle identically.

---

## 2. The three words you must understand ⭐

| Word | What it is | Everyday analogy |
|------|-----------|------------------|
| **Dockerfile** | A text file of instructions: *how to build the box* | A recipe |
| **Image** | The built box template, saved and ready to run | A cake frozen, ready to bake copies |
| **Container** | A running copy of an image | The actual cake being served |

The flow, which you must know cold:

```text
Dockerfile   --(docker build)-->   Image   --(docker run)-->   Container
(the recipe)                     (template)                  (running app)
```

You can run **many containers** from **one image** (like printing many copies from one template).

---

## 3. The two commands at the heart of the lab ⭐

```bash
docker build -t myapp:1.0 .
```
Builds an image from the Dockerfile. Breaking it down:
- `docker build` = "build an image"
- `-t myapp:1.0` = `-t` means **tag** (give it a name). Name = `myapp`, version = `1.0`
- `.` = "the Dockerfile is in **this** folder" (`.` means current folder)

```bash
docker run -d -p 8080:80 myapp:1.0
```
Runs a container from that image. Breaking it down:
- `docker run` = "start a container"
- `-d` = **detached** → run in the background (you get your terminal back)
- `-p 8080:80` = **publish a port**. Connect **port 8080 on your computer** to **port 80 inside the container**. (A **port** is like a numbered door a program listens on.)
- `myapp:1.0` = which image to run

After this, visiting `http://localhost:8080` in a browser reaches the app inside the container.

> **Port mapping read as `host:container`** → `-p 8080:80` = my-computer-8080 → container-80.

---

## 4. The Dockerfile — writing the recipe ⭐

A Dockerfile is a list of instructions, one per line. Each instruction is an UPPERCASE keyword followed by its value.

```dockerfile
FROM node:18                 # start from an existing image (Node.js v18)
WORKDIR /app                 # work inside the /app folder in the container
COPY package.json .          # copy this file from my computer into the image
RUN npm install              # run a command NOW, while building (installs libraries)
COPY . .                     # copy the rest of my project into the image
EXPOSE 3000                  # note that the app uses port 3000 (documentation)
CMD ["node", "server.js"]    # the command to run WHEN the container starts
```

What each keyword means:

| Keyword | Plain meaning | When it happens |
|---------|---------------|-----------------|
| `FROM` | Start from an existing base image (you never start from nothing) — **must be the first line** | build |
| `WORKDIR` | Set the current folder inside the image | build |
| `COPY` | Copy files from your computer into the image | build |
| `RUN` | Run a command while **building** (e.g. install software) | build |
| `EXPOSE` | Document which port the app uses (informational only) | — |
| `ENV` | Set an environment variable (a setting) | build/run |
| `CMD` | The default command that runs when the **container starts** | start |
| `ENTRYPOINT` | Like CMD, but a fixed command that can't be easily overridden | start |

### Three MCQ traps ⭐
- **`RUN` vs `CMD`:** `RUN` happens while **building the image** (e.g. install libraries). `CMD` happens when the **container starts** (the app runs). Only the **last** `CMD` counts.
- **`COPY` vs `ADD`:** Use `COPY` (simple copy). `ADD` is `COPY` plus extra tricks (download a URL, auto-unzip a tar). Prefer `COPY`.
- **`EXPOSE` does not open the port** to the outside — it's just a note. The real opening is `-p` on `docker run`.

---

## 5. Full worked lab (do this once, by hand) ⭐

**Goal:** serve a web page in a container.

**Step 1 — create a file `index.html`:**
```html
<h1>Hello from my container</h1>
```

**Step 2 — create a file named `Dockerfile` (no extension):**
```dockerfile
FROM nginx:latest
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
```
(`nginx` is a ready-made web-server image. We just drop our page into the folder it serves.)

**Step 3 — build the image:**
```bash
docker build -t my-website:1.0 .
```

**Step 4 — run the container:**
```bash
docker run -d -p 8080:80 --name web my-website:1.0
```

**Step 5 — check it:** open `http://localhost:8080`, or run `docker ps` to see it running.

That's the entire exam lab shape: **write Dockerfile → build → run → verify.**

---

## 6. Everyday commands (reference)

| Command | What it does |
|---------|-------------|
| `docker ps` | List **running** containers |
| `docker ps -a` | List **all** containers (including stopped) |
| `docker images` | List images you have |
| `docker stop <name/id>` | Stop a running container |
| `docker start <name/id>` | Start a stopped container |
| `docker rm <name/id>` | Delete a container |
| `docker rmi <image>` | Delete an image |
| `docker logs <name/id>` | See what the container printed |
| `docker exec -it <name> bash` | Open a shell **inside** a running container |
| `docker pull <image>` | Download an image from the internet (Docker Hub) |

**Common `docker run` flags:**

| Flag | Meaning |
|------|---------|
| `-d` | Background (detached) |
| `-p 8080:80` | Port map (host:container) |
| `--name web` | Give the container a name |
| `-e KEY=value` | Set an environment variable |
| `-v data:/path` | Attach storage (a volume) |
| `-it` | Interactive terminal (to type inside it) |

---

## 7. Two extra concepts (good to recognize)

**Volumes — saving data.** When a container is deleted, everything inside it is lost. A **volume** is storage that lives *outside* the container so data survives.
```bash
docker run -v mydata:/var/lib/mysql mysql:8.0   # mysql stores its data in the "mydata" volume
```

**Docker Compose — many containers at once.** Instead of typing many `docker run` commands, you describe all your containers in one file `docker-compose.yml` and start them together.
```yaml
services:
  web:
    image: nginx
    ports:
      - "8080:80"
  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
```
```bash
docker compose up -d     # start everything
docker compose down      # stop and remove everything
```

---

## 8. Cleanup (handy during a lab)

```bash
docker stop $(docker ps -q)       # stop all running containers
docker rm -f $(docker ps -aq)     # remove all containers
docker rmi -f $(docker images -q) # remove all images
docker system prune -a            # delete everything unused
```
> `$(...)` runs the inner command first and feeds its output to the outer one — here, the list of container IDs.
