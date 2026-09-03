# Network Engineering & Diagnostic Utilities

This assignment reviews fundamental networking protocols, practice repositories, and diagnostic utilities executed during operational troubleshooting sessions.

---

## Task 1: Reference Materials & Practice Repositories

The following core modules were reviewed from the DevOps Heroes training collection:

- [Network Troubleshooting Guides](https://github.com/Nency-Ravaliya/Network-Troubleshooting) - Analytical methodologies for network path diagnosis.
- [OSI Layer Network Devices](https://github.com/Nency-Ravaliya/OSI-Network-devices) - Layer 1 through Layer 7 hardware function maps.
- [Fundamentals of Networking](https://github.com/Nency-Ravaliya/Networking) - TCP/IP protocols and sockets.
- [IP Subnetting & Addressing](https://github.com/Nency-Ravaliya/Subnetting) - CIDR notation and network partitioning.
- [IP Addressing Quest](https://github.com/Nency-Ravaliya/IP-quest) - IPv4/IPv6 problem solving.
- [Flow & Telemetry Tools (IPFIX, NetFlow, NTP)](https://github.com/Nency-Ravaliya/IPFIX-NETFLOW-NTP) - Traffic telemetry monitoring and time sync.
- [DHCP Protocol Mechanics](https://github.com/Nency-Ravaliya/How-DHCP-Works) - DORA packet exchange sequence.

---

## Task 2: Hands-on Command Diagnostics & Analysis

The diagnostic commands were executed on macOS against public endpoint `example.com`. Output captures record live network metrics.

### 1. `ping`

**Functional Objective:** Verifies ICMP echo reachability, measures round-trip time (RTT), and identifies packet loss.

```text
$ ping -c 4 example.com
PING example.com (172.66.147.243): 56 data bytes
64 bytes from 172.66.147.243: icmp_seq=0 ttl=57 time=12.759 ms
64 bytes from 172.66.147.243: icmp_seq=1 ttl=57 time=14.639 ms
64 bytes from 172.66.147.243: icmp_seq=2 ttl=57 time=11.029 ms
64 bytes from 172.66.147.243: icmp_seq=3 ttl=57 time=10.808 ms

--- example.com ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 10.808/12.309/14.639/1.543 ms
```

**Diagnostic Analysis:** All 4 ICMP requests succeeded with zero packet drop. Mean round-trip latency measured 12.3 ms, confirming target endpoint reachability and network stability.

---

### 2. `traceroute`

**Functional Objective:** Maps intermediate router hops along the IP path to a destination by manipulating TTL limits.

```text
$ traceroute -m 5 -w 1 example.com
traceroute to example.com (172.66.147.243), 5 hops max, 40 byte packets
 1  wifi.height8tech.com (100.129.160.1)  6.618 ms  5.274 ms  6.510 ms
 2  202.131.133.5.convergentindia.com (202.131.133.5)  5.561 ms  5.800 ms  5.420 ms
 3  115.117.125.189.static-mumbai.vsnl.net.in (115.117.125.189)  6.742 ms  8.014 ms  8.543 ms
 4  * * *
 5  * * *
```

**Diagnostic Analysis:** Hops 1-3 successfully returned ICMP Time Exceeded packets. Subsequent asterisks (`* * *`) indicate intermediate firewall rules filtering ICMP responses rather than host unreachability.

---

### 3. `netstat`

**Functional Objective:** Displays active kernel routing tables, active network connections, and interface statistics.

```text
$ netstat -rn | head -12
Routing tables

Internet:
Destination        Gateway            Flags               Netif Expire
default            100.129.160.1      UGScg                 en0
100.129.160/20     link#11            UCS                   en0      !
100.129.160.1/32   link#11            UCS                   en0      !
100.129.160.1      f4:1e:57:3d:a6:d6  UHLWIir               en0   1161
100.129.160.29     6e:45:83:dc:3a:98  UHLWI                 en0   1077
100.129.160.47     ee:c8:bc:df:c5:b0  UHLWI                 en0     80
100.129.160.51     72:31:fe:8:8d:a7   UHLWI                 en0   1047
100.129.160.53     8e:37:ba:9:fe:fa   UHLWI                 en0    284
```

**Diagnostic Analysis:** The default outbound gateway is set to `100.129.160.1` via interface `en0`. The table details active network paths, local subnet masks, and dynamic MAC routing entries.

---

### 4. `telnet`

**Functional Objective:** Establishes a raw TCP connection to verify port openness and socket accessibility.

```text
$ telnet example.com 80
Trying 172.66.147.243...
Connected to example.com.
Escape character is '^]'.
Connection closed by foreign host.
```

**Diagnostic Analysis:** The TCP handshake with port 80 succeeded, proving HTTP port reachability. The remote server closed the connection after receiving no HTTP request payload.

---

### 5. `tcpdump`

**Functional Objective:** Captures live packet traffic on specified network interfaces for deep protocol analysis.

```text
$ tcpdump -c 5 -i lo0 -nn
tcpdump: lo0: You don't have permission to capture on that device
((cannot open BPF device) /dev/bpf0: Permission denied)
```

**Diagnostic Analysis:** macOS enforces strict BPF permissions. Running `sudo tcpdump -c 5 -i lo0 -nn` with administrative privileges resolves the permission restriction to capture packet streams.

---

### 6. `nslookup`

**Functional Objective:** Queries DNS servers to resolve hostnames to IP addresses.

```text
$ nslookup example.com
Server:         100.129.160.1
Address:        100.129.160.1#53

Non-authoritative answer:
Name:   example.com
Address: 104.20.23.154
Name:   example.com
Address: 172.66.147.243
```

**Diagnostic Analysis:** Local resolver `100.129.160.1#53` returned two IPv4 addresses (`104.20.23.154` and `172.66.147.243`). The response is non-authoritative as it was fetched from cache.

---

### 7. `dig`

**Functional Objective:** Performs detailed DNS lookups, outputting query flags, TTL values, and record sections.

```text
$ dig example.com
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 6825
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 2, ADDITIONAL: 6

;; ANSWER SECTION:
example.com.            291     IN      A       172.66.147.243
example.com.            291     IN      A       104.20.23.154

;; AUTHORITY SECTION:
example.com.            26419   IN      NS      hera.ns.cloudflare.com.
example.com.            26419   IN      NS      elliott.ns.cloudflare.com.

;; Query time: 18 msec
;; SERVER: 100.129.160.1#53(100.129.160.1)
```

**Diagnostic Analysis:** `dig` provides comprehensive DNS diagnostic telemetry including NOERROR query status, 18 ms response latency, TTL lifetimes, and Cloudflare NS authority assignments.

---

### 8. `curl`

**Functional Objective:** Issues HTTP/HTTPS requests to validate API web endpoints and inspect headers.

```text
$ curl -I --max-time 10 https://example.com
HTTP/2 200
date: Thu, 03 Sep 2026 05:05:25 GMT
content-type: text/html
server: cloudflare
allow: GET, HEAD
accept-ranges: bytes
```

**Diagnostic Analysis:** The target web server responded with `HTTP/2 200 OK`, returning standard Cloudflare headers, confirming operational web service health.

---

### 9. `arp`

**Functional Objective:** Inspects the local Address Resolution Protocol (ARP) cache mapping IPv4 addresses to physical MAC addresses.

```text
$ arp -an | head -12
? (100.129.160.1) at f4:1e:57:3d:a6:d6 on en0 ifscope [ethernet]
? (100.129.160.29) at 6e:45:83:dc:3a:98 on en0 ifscope [ethernet]
? (100.129.160.47) at ee:c8:bc:df:c5:b0 on en0 ifscope [ethernet]
? (100.129.160.51) at 72:31:fe:8:8d:a7 on en0 ifscope [ethernet]
? (100.129.160.53) at 8e:37:ba:9:fe:fa on en0 ifscope [ethernet]
? (100.129.160.54) at c6:b2:8b:d6:35:f5 on en0 ifscope [ethernet]
```

**Diagnostic Analysis:** Local ARP cache correctly lists gateway IP `100.129.160.1` mapped to hardware MAC address `f4:1e:57:3d:a6:d6` on physical interface `en0`.

---

### 10. `systemctl`

**Functional Objective:** Manages and queries systemd init daemons and background services on Linux systems.

```text
$ systemctl --version
PID     Status  Label
-       0       com.apple.SafariHistoryServiceAgent
-       -9      com.apple.progressd
-       0       com.apple.enhancedloggingd
14596   -9      com.apple.cloudphotod
-       -9      com.apple.MENotificationService
618     0       com.apple.Finder
64379   -9      com.apple.homed
65531   -9      com.apple.dataaccess.dataaccessd
-       0       com.apple.quicklook
-       0       com.apple.parentalcontrols.check
731     0       com.apple.mediaremoteagent
659     0       com.apple.FontWorker
63673   -9      com.apple.bird
-       0       com.apple.amp.mediasharingd
-       -9      com.apple.knowledgeconstructiond
64338   -9      com.apple.inputanalyticsd
-       0       com.apple.familycontrols.useragent
-       0       com.apple.AssetCache.agent
15854   0       com.apple.GameController.gamecontrolleragentd
-       0       com.apple.universalaccessAuthWarn
-       0       com.apple.UserPictureSyncAgent
```

**Diagnostic Analysis:** On systemd-based Linux systems, `systemctl status <service>` manages background services. On macOS, process management maps to `launchctl`.

---

## Executive Summary

These tools form an essential operational toolkit across the OSI layers:
- **Connectivity:** `ping` (L3 ICMP)
- **Path Routing:** `traceroute` & `netstat` (L3/L4)
- **Port Auditing:** `telnet` (L4 TCP)
- **Packet Inspection:** `tcpdump` (L2-L7)
- **Domain Resolution:** `nslookup` & `dig` (L7 DNS)
- **Web Application Verification:** `curl` (L7 HTTP/HTTPS)
- **Link Layer Resolution:** `arp` (L2 ARP)
- **Service Management:** `systemctl` (Init/Daemon management)

