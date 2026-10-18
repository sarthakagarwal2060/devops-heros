# Shell / Bash Scripting — From Zero (MCQ + Lab)

> A **script** is just a text file containing terminal commands that run one after another. The lab may ask you to write a small one. New to the terminal? Read `00-start-here.md` and `01-linux-commands.md` first.

---

## 1. What is a shell script, and how do you run it?

Instead of typing commands one by one, you save them in a file (e.g. `hello.sh`) and run them all at once. That file is a **shell script**. **Bash** is the most common shell (the program that runs the commands).

**Every script starts with a "shebang" line** that says which shell to use:
```bash
#!/bin/bash
```

To run a script:
```bash
chmod +x hello.sh    # one-time: make the file executable (allowed to run)
./hello.sh           # run it ( ./ means "in this folder" )
# or simply:
bash hello.sh
```

---

## 2. Variables — storing a value ⭐

A **variable** is a labelled box that holds a value you can reuse.

```bash
name="Nensi"             # create a variable called name
roll_no=123
echo "My name is $name"  # use it by putting $ in front → prints: My name is Nensi
```

**Rules (common MCQ traps):**
- **No spaces around the `=`.** `name="x"` is correct; `name = "x"` is **wrong**.
- To **read** a variable, prefix it with `$`: `$name`.
- `echo` just prints text to the screen.

**Command substitution — store a command's *output* in a variable:**
```bash
today=$(date)      # run the 'date' command, put its result into 'today'
echo $today
host=$(hostname)   # correct: runs the hostname command
```
> ⭐ Trap: `$hostname` reads a *variable* named hostname (probably empty). `$(hostname)` *runs the command* `hostname`. The `$(...)` is what runs a command.

---

## 3. Getting input from the user

```bash
read -p "Enter your name: " name   # show the prompt, store what they type in 'name'
echo "Hello $name"
```
`read` pauses and waits for the user to type. `-p` shows a prompt message first.

---

## 4. Making decisions — if / elif / else ⭐

```bash
if [ $age -lt 0 ]; then
    echo "invalid"
elif [ $age -lt 13 ]; then
    echo "child"
else
    echo "adult"
fi
```
How to read it:
- `if [ condition ]; then` ... `fi` (`fi` = "if" backwards, closes the block).
- **You must put spaces inside the `[ ]`.** `[ $age -lt 0 ]` is correct; `[$age -lt 0]` is wrong.
- `-lt` means "less than". The comparison words are below.

**Comparing numbers:**

| Operator | Means |
|----------|-------|
| `-eq` | equal |
| `-ne` | not equal |
| `-lt` | less than |
| `-le` | less than or equal |
| `-gt` | greater than |
| `-ge` | greater than or equal |

**Comparing text / checking files** (use double brackets `[[ ]]`):
```bash
if [[ $input == "q" ]]; then echo "quit"; fi   # text equality
if [ -f file.txt ]; then echo "file exists"; fi  # -f file, -d folder, -e exists
```

---

## 5. Repeating things — loops ⭐

**For loop** — repeat a set number of times:
```bash
for i in {1..5}        # i goes 1,2,3,4,5  (brace range)
do
  echo "iteration $i"
done
```

**While loop** — repeat while a condition is true:
```bash
count=0
while [ $count -lt 5 ]     # while count is less than 5
do
  echo "count = $count"
  ((count++))              # add 1 to count  ( ((...)) does math )
done
```

**Controlling a loop:**
- `break` → jump out of the loop entirely.
- `continue` → skip the rest of this round and start the next.
```bash
while true                 # 'true' = loop forever
do
  read -p "> " x
  if [[ $x == "q" ]]; then break; fi
done
```

---

## 6. Functions — a reusable block ⭐

A **function** groups commands under a name so you can run them whenever.

```bash
show_info() {              # define a function named show_info
  echo "This is a function"
}

show_info                  # call it — just the name, NO parentheses
```
> ⭐ Trap: you **define** with `name() { ... }`, but you **call** it by writing just `show_info` (no `()`).

---

## 7. Saving output to files (redirection)

| Symbol | Meaning | Example |
|--------|---------|---------|
| `>` | Write output to a file (overwrite) | `echo hi > f.txt` |
| `>>` | Add output to the end of a file | `echo hi >> f.txt` |
| `\|` | Send one command's output into another | `cat f.txt \| grep hi` |

```bash
ps > process.log     # save the list of running processes into process.log
```

Handy info commands often used in scripts: `date`, `hostname`, `whoami`, `who`, `ps`, `df -h` (disk space).

---

## 8. A tiny complete example

```bash
#!/bin/bash
read -p "Enter a number: " n
if [ $n -gt 0 ]; then
  echo "$n is positive"
else
  echo "$n is zero or negative"
fi

for i in {1..3}
do
  echo "line $i"
done
```
