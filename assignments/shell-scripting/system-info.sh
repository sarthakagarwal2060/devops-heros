#!/bin/bash
# ==============================================================================
# System Information & Resource Snapshot Utility
# Description: Gathers system metadata, disk storage, active process table,
#              and logs process status to an output log file.
# ==============================================================================

sys_date=$(date)
host_id=$(hostname)
active_user=$(whoami)
output_dir="system-info-output"
log_output="$output_dir/processes.log"

# Prompt user for operator identification
read -p "Enter your name: " user_name

# Prepare output directory and log target
mkdir -p "$output_dir"
touch "$log_output"
ps > "$log_output"

# Print system diagnostic banner
echo "System Information"
echo "------------------"
echo "Date: $sys_date"
echo "Hostname: $host_id"
echo "Username: $active_user"
echo
echo "Disk Usage:"
df -h
echo
echo "Running Processes:"
ps
echo
echo "Hello, $user_name."
echo "Process information was saved to $log_output."