# Linux & Terminal Commands — From Zero (MCQ Focus)

> MCQs test: reading files, moving between folders, and especially **reading a file buried inside folders**. New to the terminal? Read `00-start-here.md` first.

---

## 1. The idea of a "path" ⭐ (the most tested concept)

A **path** is the address of a file or folder — it tells a command *where* to find it. Folders in a path are separated by `/`.

```bash
cat data1/data2/data.txt
```
`cat` means "show the contents of a file." This command reads:

> go into folder `data1` → then into folder `data2` → then show the file `data.txt`.

**You do NOT have to enter each folder one by one.** One command with the full path reaches it directly, even from where you're standing now.

### Four kinds of path
| Type | Example | Meaning |
|------|---------|---------|
| **Relative** | `cat data1/data2/data.txt` | Starts from the folder you're currently in |
| **Absolute** | `cat /home/user/data1/data2/data.txt` | Starts from the very top, `/` (the root) |
| **Parent** | `cat ../data.txt` | `..` means "the folder one level up" |
| **Current** | `cat ./data.txt` | `.` means "this folder, right here" |

Memorize these symbols — MCQs love them:
- `/` at the **start** = the root (top) of the whole system
- `/` **between** names = "go into"
- `.` = current folder
- `..` = one folder up
- `~` = your home folder

> ⭐ Classic MCQ: *"How do you read `data.txt` inside `data1/data2` without changing directory?"* → **`cat data1/data2/data.txt`**

---

## 2. Looking at what's in a file

| Command | What it does |
|---------|-------------|
| `cat file.txt` | Print the whole file at once |
| `less file.txt` | Scroll through it page by page (press `q` to quit) |
| `head file.txt` | Show the **first 10** lines |
| `head -n 5 file.txt` | First **5** lines |
| `tail file.txt` | Show the **last 10** lines |
| `tail -n 5 file.txt` | Last **5** lines |
| `tail -f log.txt` | Keep showing new lines as they're added (live logs) |
| `wc -l file.txt` | Count how many lines are in the file |

---

## 3. Moving around folders

| Command | What it does | Memory hook |
|---------|-------------|-------------|
| `pwd` | Print the folder you're in (full path) | **p**rint **w**orking **d**irectory |
| `ls` | List files in the current folder | **l**i**s**t |
| `ls -l` | Long list (sizes, dates, permissions) | **l**ong |
| `ls -a` | Show hidden files too (names starting with `.`) | **a**ll |
| `ls -la` | Long list including hidden | |
| `cd folder` | Go **into** a folder | **c**hange **d**irectory |
| `cd ..` | Go **up** one folder | |
| `cd ~` or `cd` | Go to your home folder | |
| `cd /` | Go to the root (top) | |
| `cd -` | Go back to the previous folder | |

---

## 4. Creating, copying, moving, deleting

| Command | What it does |
|---------|-------------|
| `touch file.txt` | Create a new empty file |
| `mkdir folder` | Create a new folder |
| `mkdir -p a/b/c` | Create nested folders `a/b/c` in one go |
| `cp file1 file2` | **Copy** a file |
| `cp -r folder1 folder2` | Copy a whole folder (`-r` = recursive, include contents) |
| `mv old new` | **Move** or **rename** |
| `rm file.txt` | **Delete** a file |
| `rm -r folder` | Delete a folder and its contents |
| `rm -rf folder` | Force-delete without asking (⚠️ dangerous — no undo) |

---

## 5. Finding files and searching inside them

| Command | What it does |
|---------|-------------|
| `find . -name "data.txt"` | Find a file named `data.txt`, searching from here down |
| `find /home -name "*.txt"` | Find all `.txt` files under `/home` (`*` = anything) |
| `grep "word" file.txt` | Show lines in the file that contain "word" |
| `grep -r "word" .` | Search for "word" in all files from here down (`-r` = recursive) |
| `grep -i "word" file` | Ignore upper/lower case |

---

## 6. Redirect and pipe (often on MCQs) ⭐

These control where a command's output goes.

| Symbol | Name | What it does | Example |
|--------|------|--------------|---------|
| `>` | Redirect (overwrite) | Send output **into a file**, replacing it | `echo hi > f.txt` |
| `>>` | Redirect (append) | Add output to the **end** of a file | `echo hi >> f.txt` |
| `\|` | Pipe | Feed one command's output **into** another | `cat f.txt \| grep hi` |

- `echo` just prints text. `echo hi > f.txt` creates/overwrites `f.txt` with "hi".
- A **pipe** `|` chains commands: `cat f.txt | grep hi` = "show the file, then keep only lines with 'hi'".

---

## 7. File permissions (quick MCQ facts)

Every file has permissions for three groups: **owner**, **group**, **others**. Each can **read (r)**, **write (w)**, **execute (x)**.

```bash
chmod +x script.sh     # make a file executable (runnable)
chmod 755 file         # set permissions using numbers
```

Permissions are often written as 3 digits. Each digit is a sum:

| Number | Permission |
|--------|------------|
| 4 | read (r) |
| 2 | write (w) |
| 1 | execute (x) |
| 7 | 4+2+1 = rwx (all) |
| 6 | 4+2 = rw- |
| 5 | 4+1 = r-x |

So `755` = owner `rwx` (7), group `r-x` (5), others `r-x` (5).

---

## 8. A few more you might see

| Command | What it does |
|---------|-------------|
| `whoami` | Print your username |
| `date` | Show current date/time |
| `clear` | Clear the terminal screen |
| `man ls` | Show the manual (help) for a command |
| `history` | Show commands you've typed |
| `sudo <cmd>` | Run a command as administrator (root) |
