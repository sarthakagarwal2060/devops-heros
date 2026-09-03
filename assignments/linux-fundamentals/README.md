# Linux Administration & Core Fundamentals

This module covers filesystem link mechanics, user account administration, systemd log inspection using `journalctl`, and an operational Linux CLI reference guide tailored for Ubuntu environments.

---

## Task 1: Symbolic Links vs. Hard Links

### Comparative Overview

| Technical Aspect | Symbolic (Soft) Link | Hard Link |
| :--- | :--- | :--- |
| **Pointer Mechanism** | References the target file path string | Direct pointer to the underlying filesystem inode |
| **Directory Support** | Supported across directories | Restricted; generally not permitted for directories |
| **Cross-Filesystem** | Works across distinct filesystems/mounts | Confined strictly to the same filesystem |
| **Target Removal** | Becomes broken ("dangling link") | Preserves data access as long as at least one link remains |
| **Inode Allocation** | Unique inode assigned to link file | Shares identical inode with original target file |
| **Creation Command** | `ln -s TARGET_PATH LINK_NAME` | `ln TARGET_FILE LINK_NAME` |

### Hands-on Verification Procedure

```bash
mkdir -p ~/links-demo && cd ~/links-demo
echo "Core data payload" > source.txt

# Generate soft and hard links
ln -s source.txt soft_link.txt
ln source.txt hard_link.txt

# Inspect file attributes and inode values
ls -li source.txt soft_link.txt hard_link.txt
stat source.txt hard_link.txt
```

**Observed Result:** `source.txt` and `hard_link.txt` share matching inode identifiers. `soft_link.txt` displays a distinct inode and references `soft_link.txt -> source.txt`.

#### Unlink Behavior Test

```bash
rm source.txt
cat hard_link.txt   # Outputs content successfully
cat soft_link.txt   # Fails: No such file or directory
```

#### Directory Cleanup

```bash
rm hard_link.txt soft_link.txt
cd .. && rmdir ~/links-demo
```

### Technical Interview Response Summary

A symbolic link operates as a path shortcut, allowing cross-partition and directory targeting, but breaks if the original file path changes or is removed. Conversely, a hard link creates an additional directory entry sharing the identical inode and data block; removing the original filename leaves the data accessible through remaining hard links. Hard links cannot span across different filesystems or link directories. Use `ln -s` for soft links and `ln` for hard links.

---

## Task 2: Account Provisioning: `adduser` vs. `useradd`

### Command Comparison

| Utility | Architectural Level & Operational Characteristics |
| :--- | :--- |
| **`adduser`** | High-level interactive Perl wrapper (Debian/Ubuntu standard). Automatically provisions skeleton home directories, assigns standard shells, and guides password setup. |
| **`useradd`** | Low-level native binary tool. Performs raw system modifications; flags like `--create-home` and `--shell` must be explicitly provided. Ideal for automation. |

### Interactive User Creation Workflow (Ubuntu)

```bash
sudo adduser devopspractice

# Inspect created user metadata
id devopspractice
getent passwd devopspractice
ls -ld /home/devopspractice

# Clean up practice user account and associated home directory
sudo deluser --remove-home devopspractice
```

### Automated Scripting Alternative (`useradd`)

For non-interactive CI/CD pipelines or provisioning scripts:

```bash
sudo useradd --create-home --shell /bin/bash --comment "Automated DevOps Account" devopspractice
sudo passwd devopspractice

# Removal command for useradd setup:
sudo userdel --remove devopspractice
```

---

## Task 3: System Logging with `journalctl`

`journalctl` serves as the primary query interface for `systemd-journald`, analyzing system logs, kernel logs, and service daemon event streams.

### Frequently Used Query Patterns

```bash
# Display entire log stream sequentially
sudo journalctl

# Live-tail incoming journal events
sudo journalctl -f

# Filter log records for current system boot
sudo journalctl -b

# Filter kernel log messages from current boot
sudo journalctl -k -b

# Limit output to most recent 50 entries
sudo journalctl -n 50

# Query logs within a relative time window
sudo journalctl --since "1 hour ago"
sudo journalctl --since "today"
```

### Service Diagnostic Sequence

```bash
# Step 1: Check unit operational status
sudo systemctl status ssh

# Step 2: Query service log records for current boot without paging
sudo journalctl -u ssh.service -b --no-pager

# Step 3: Filter for warning or critical error levels
sudo journalctl -u ssh.service -p warning..alert --no-pager
```

### Operating System Note (macOS / Linux)

`systemd` and `journalctl` are standard across Linux distributions like Ubuntu, Debian, RHEL, and Arch. On macOS environments, service diagnostics rely on Apple's Unified Logging system (`log show` and `log stream`).

---

## Task 4: Operational Linux Command Reference

| Command | Primary Utility | Typical Command Syntax |
| :--- | :--- | :--- |
| `pwd` | Print working directory path | `pwd` |
| `ls` | List directory contents with detail | `ls -la` |
| `cd` | Navigate active directory | `cd /var/log` |
| `mkdir` | Create nested directory hierarchy | `mkdir -p project/build` |
| `touch` | Create blank file or refresh timestamp | `touch application.log` |
| `cp` | Copy file or recursive directory | `cp -r src/ dist/` |
| `mv` | Relocate or rename file/folder | `mv old_name.txt new_name.txt` |
| `rm` | Remove files or directory trees | `rm -rf temp_dir/` |
| `rmdir` | Delete empty directory | `rmdir empty_folder` |
| `cat` | Concatenate and print file contents | `cat application.log` |
| `less` | Page-by-page file viewer | `less /var/log/syslog` |
| `head` | Output leading lines of a file | `head -n 10 config.json` |
| `tail` | Output trailing lines or follow log stream | `tail -f -n 20 app.log` |
| `grep` | Pattern matching and string search | `grep -rn 'ERROR' /var/log/` |
| `find` | Search filesystem by attributes | `find . -type f -name '*.sh'` |
| `wc` | Count line, word, or character totals | `wc -l access.log` |
| `sort` | Sort text lines alphabetically/numerically | `sort entries.txt` |
| `uniq` | Deduplicate adjacent text lines | `sort entries.txt \| uniq` |
| `echo` | Print text strings or environment variables | `echo "$PATH"` |
| `man` | Open binary system reference manuals | `man journalctl` |
| `chmod` | Modify file access permissions | `chmod 755 deploy.sh` |
| `chown` | Update file ownership and group | `sudo chown -R dev:dev /app` |
| `df` | Inspect mounted filesystem storage capacity | `df -h` |
| `du` | Calculate directory disk usage | `du -sh /var/log` |
| `free` | Display system RAM and swap utilization | `free -h` |
| `ps` | Display current active process table | `ps aux` |
| `top` | Dynamic real-time system monitor | `top` |
| `kill` | Terminate process via PID signal | `kill -9 <PID>` |
| `ip` | Display and configure network interfaces | `ip addr show` |
| `ss` | View active network socket listeners | `ss -tulpn` |
| `curl` | Transfer data over HTTP/HTTPS protocols | `curl -I https://localhost:8080` |
| `tar` | Archive and compress directory files | `tar -czvf archive.tar.gz folder/` |
| `sudo` | Execute commands with root privileges | `sudo systemctl restart nginx` |
| `systemctl` | Control systemd init service manager | `sudo systemctl status docker` |