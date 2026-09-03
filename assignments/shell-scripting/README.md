# System Telemetry & Automation Script

This module implements a shell script that captures system diagnostics, retrieves environment metrics, processes interactive user input, manages file directory creation, and handles standard output redirection.

---

## Execution Guide

To make the script executable and launch the diagnostic utility:

```bash
chmod +x system-info.sh
./system-info.sh
```

Upon execution, the script prompts for user identity, creates directory `system-info-output/`, initializes `processes.log` using `touch`, and redirects active process state data using `ps > system-info-output/processes.log`.

---

## Utility & Command Mapping

| Shell Utility / Language Feature | Role within Script |
| :--- | :--- |
| **`mkdir -p`** | Ensures creation of target folder `system-info-output` |
| **`touch`** | Prepares destination log file `processes.log` |
| **`echo`** | Outputs formatted diagnostic headers and stored variables |
| **`df -h`** | Retrieves filesystem disk usage metrics in human-readable units |
| **`ps`** | Inspects active system process IDs and command binaries |
| **`read -p`** | Captures operator input interactively from standard input |
| **Variables (`$sys_date`, etc.)** | Stores system date, host ID, active username, operator name, and path targets |
| **`>` Output Redirection** | Directs active process table snapshot into `processes.log` |

---

## Example Terminal Session Log

*Note: PID values, storage capacities, dates, and hostnames reflect the specific host runtime environment.*

```text
$ ./system-info.sh
Enter your name: Alex
System Information
------------------
Date: Thu Sep  3 10:15:22 PDT 2026
Hostname: dev-machine
Username: alex

Disk Usage:
Filesystem   Size   Used  Avail Capacity  Mounted on
/dev/disk3s1  460G   120G   330G    27%    /

Running Processes:
  PID TTY           TIME CMD
  101 ttys000    0:00.04 -zsh
  245 ttys000    0:00.01 ps

Hello, Alex.
Process information was saved to system-info-output/processes.log.
```

