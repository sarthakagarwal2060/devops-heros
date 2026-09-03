# Git Version Control & Commit Management

This report details the execution and observed results for advanced Git workflow exercises, focusing on commit behavior differences and selective commit porting using cherry-pick.

---

## Task 1: Staging Behaviors & Commit Flag Comparisons

### Conceptual Breakdown

- **`git commit -a -m "message"` (All-inclusive Commit):**
  Automatically detects and stages changes (modifications and deletions) made to files that are already tracked by Git. Crucially, **untracked files** (newly created files not yet added to the index) are ignored and omitted from the resulting commit snapshot.

- **`git commit -m "message"` (Explicit Index Commit):**
  Only commits changes that currently exist inside the Git staging area (index). New files, modifications, or deletions must be explicitly staged beforehand using `git add`.

### Execution Log & Demonstration

1. A tracked file (`README.md`) was edited alongside creating a brand-new untracked file (`task1-untracked.txt`).
2. Executed automatic staging commit:

```bash
git commit -a -m "git homework: test commit all"
```

*Resulting Terminal Log:*

```text
[main a6580ab] git homework: test commit all
 2 files changed, 11 insertions(+), 1 deletion(-)
?? assignments/git-github/task1-untracked.txt
```

As demonstrated by the `??` status indicator, `task1-untracked.txt` remained untracked.

3. Staged and committed the new untracked file:

```bash
git add assignments/git-github/task1-untracked.txt
git commit -m "git homework: add untracked file"
```

---

## Task 2: Selective Commit Integration via `git cherry-pick`

Cherry-picking enables applying specific commits from one branch onto the current working branch without performing a full branch merge.

### Workflow & Step-by-Step Operations

1. **Commit Identification:**
   On feature branch `git-homework-cherry-pick`, inspected log history using `git log --oneline --decorate -4` to target the target commit hash:

```text
<selected-commit> (HEAD -> git-homework-cherry-pick) git homework: selected cherry-pick change
48cf6f9 git homework: add branch-only change
b81c20e (main) git homework: add untracked file
```

2. **Executing Cherry-Pick:**
   Switched to `main` branch and targeted the specific commit:

```bash
git cherry-pick <selected-commit>
```

3. **Validation & Selective Verification:**
   The file `cherry-pick-selected.txt` was integrated into `main`, while unselected branch changes remained isolated on `git-homework-cherry-pick`.

*Terminal Verification Output:*

```text
Cherry-picked commit: <cherry-picked-commit>
Verified: selected file exists on main
Verified: branch-only file is absent from main
```

*Final Log Inspection (`git log --oneline --decorate -5`):*

```text
<cherry-picked-commit> (HEAD -> main) git homework: selected cherry-pick change
b81c20e git homework: add untracked file
a6580ab git homework: test commit all
b3e7a0f git homework: initialize assignment
3b77bf8 (origin/main, origin/HEAD) docker-fundamentals asg done
```

