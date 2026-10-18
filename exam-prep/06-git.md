# Git & GitHub — From Zero (MCQ)

> **Git** = a tool that saves snapshots of your project over time, so you can track changes and never lose work. **GitHub** = a website that stores your Git projects online so you can back them up and share with others.

---

## 1. Why does Git exist?

Imagine saving `project_final.doc`, `project_final2.doc`, `project_really_final.doc`... Git replaces that mess. It records a **history of snapshots** of your code. You can see what changed, who changed it, go back to any old version, and work with a team without overwriting each other.

- **Repository (repo)** = a project folder that Git is tracking.
- **Commit** = one saved snapshot, with a message describing what changed.

---

## 2. The three areas ⭐ (this explains every command)

Your changes move through three stages before reaching GitHub:

```text
Working Directory → (git add) → Staging Area → (git commit) → Local Repo → (git push) → GitHub
  (files you edit)              (changes you                (saved history           (the online
                                 marked to save)             on your computer)         copy)
```

| Area | What it is |
|------|-----------|
| Working directory | Your actual files as you edit them |
| Staging area | The changes you've *selected* to include in the next snapshot |
| Local repo | The saved history **on your computer** |
| Remote (GitHub) | The copy stored **online** |

---

## 3. Starting a project

```bash
git init                      # turn the current folder into a git repo
git clone <url>               # download an existing repo from GitHub
git remote add origin <url>   # connect your local repo to a GitHub repo
```
- `git init` = start fresh here.
- `git clone` = copy someone's existing online repo to your computer.
- `origin` = the standard nickname for "the main remote (GitHub)".

---

## 4. The everyday workflow ⭐

```bash
git status                 # what's changed / what's staged  (run this often)
git add file.txt           # stage one file for the next snapshot
git add .                  # stage ALL changes ( . = everything )
git commit -m "message"    # save a snapshot locally, with a description
git push origin main       # upload your commits to GitHub
git pull origin main       # download others' changes from GitHub
git log                    # show the history of commits
```

The loop you'll repeat constantly: **edit → `git add` → `git commit -m` → `git push`.**

---

## 5. Branches (working without breaking the main copy)

A **branch** is a separate line of work. You make changes on a branch, then **merge** them into the main code when ready. The default branch is called **`main`**.

```bash
git branch                 # list branches
git checkout -b feature    # create a new branch called 'feature' and switch to it
git switch main            # switch back to the main branch
git merge feature          # bring 'feature's changes into the current branch
```

---

## 6. Undoing things

```bash
git restore file.txt       # throw away unsaved changes to a file
git reset HEAD file.txt     # un-stage a file (opposite of git add)
git revert <commit>        # safely undo a commit by making a new one
```

---

## 7. Quick MCQ facts ⭐

| Question | Answer |
|----------|--------|
| Start tracking a folder with git | `git init` |
| Copy a repo from GitHub | `git clone` |
| Mark changes to be saved | `git add` |
| Save a snapshot locally | `git commit` |
| Where does a commit go first? | Your **local** repo (not GitHub) |
| Upload to GitHub | `git push` |
| Download from GitHub | `git pull` (= `fetch` + `merge`) |
| File listing what git should ignore | `.gitignore` |
| Default main branch name | `main` (older projects: `master`) |
| The standard name for the remote | `origin` |
