# Networking — From Zero (MCQ Focus)

> A heavy MCQ topic: IP addresses, classes, subnet masks, and a bit of math. Everything explained plainly below.

---

## 1. What is an IP address?

Every device on a network needs a unique number so others can find it — like a postal address for a house. That number is the **IP address** (IP = *Internet Protocol*).

An **IPv4** address looks like `192.168.1.10` — **four numbers (0–255) separated by dots**. Each of the four numbers is called an **octet**.

- Full possible range: `0.0.0.0` to `255.255.255.255`.
- It's a **32-bit** number (4 octets × 8 bits each = 32). A "bit" is a single 0 or 1; computers store the address as 32 of them.
- **`127.0.0.1`** is special: it always means "this computer itself" (the **loopback** address).

---

## 2. IP classes ⭐ (decided by the FIRST octet)

Historically IP addresses were grouped into **classes** based on their **first number**:

| Class | First octet is... | Typical use |
|-------|-------------------|-------------|
| A | 1 – 127 | Huge networks |
| B | 128 – 191 | Medium networks |
| C | 192 – 223 | Small networks |
| D | 224 – 239 | Multicast (special) |
| E | 240 – 255 | Experimental |

> ⭐ MCQ method: look at the **first number only**. `197.x.x.x` → 197 is between 192–223 → **Class C**. `10.x.x.x` → Class A.

---

## 3. What is a subnet mask?

An IP address secretly has **two parts**: the **network part** (which network you're on) and the **host part** (which specific device). The **subnet mask** is what tells you where the split is.

- Where the mask has `255`, that octet is the **network** part.
- Where the mask has `0`, that octet is the **host** part.

Default masks per class:

| Class | Default mask | Network octets | Host octets |
|-------|--------------|----------------|-------------|
| A | 255.0.0.0 | 1 | 3 |
| B | 255.255.0.0 | 2 | 2 |
| C | 255.255.255.0 | 3 | 1 |

---

## 4. What is CIDR (the `/number`)?

Writing out `255.255.255.0` is long, so we shorten it: **CIDR** notation writes `/n`, where **n = how many bits are the network part**.

| CIDR | Same as mask | Network bits | Host bits |
|------|--------------|--------------|-----------|
| /8 | 255.0.0.0 | 8 | 24 |
| /16 | 255.255.0.0 | 16 | 16 |
| /24 | 255.255.255.0 | 24 | 8 |
| /32 | 255.255.255.255 | 32 | 0 (exactly one address) |

> Total bits is always 32, so **host bits = 32 − network bits**. `/24` → 32−24 = **8 host bits**.

---

## 5. Counting hosts ⭐ (a common calculation MCQ)

The host bits decide how many devices fit on the network:

```text
Total addresses = 2 ^ (number of host bits)
Usable hosts    = 2 ^ (number of host bits)  −  2
```

**Why minus 2?** Two addresses are reserved and can't be given to a device:
- the **network address** (all host bits = 0) — names the network itself,
- the **broadcast address** (all host bits = 1) — reaches everyone at once.

**Worked examples:**
- `/24` → 8 host bits → 2⁸ = 256 → **254 usable**.
- `/16` → 16 host bits → 2¹⁶ = 65,536 → **65,534 usable**.
- `/8` → 24 host bits → 2²⁴ → `2²⁴ − 2` usable.

---

## 6. Network & broadcast address (with examples)

- **Network address** = set all **host** octets to **0**.
- **Broadcast address** = set all **host** octets to **255**.

**Examples:**
- IP `197.23.45.10`, mask `255.255.255.0` (/24) → host part is the last octet → broadcast = `197.23.45.255`.
- IP `120.27.1.0`, mask `255.0.0.0` (/8) → host part is the last three octets → broadcast = `120.255.255.255`.

---

## 7. Private IP ranges

Some addresses are reserved for **inside** private networks (home/office) and are never used directly on the public internet:

| Class | Private range |
|-------|---------------|
| A | 10.0.0.0 – 10.255.255.255 |
| B | 172.16.0.0 – 172.31.255.255 |
| C | 192.168.0.0 – 192.168.255.255 |

(That's why your home WiFi gives you something like `192.168.1.x`.)

---

## 8. Supporting vocabulary (easy MCQ points)

| Term | Plain meaning |
|------|---------------|
| **DNS** | Turns a name like `google.com` into an IP address (the internet's phone book) |
| **DHCP** | Automatically hands out IP addresses to devices that join a network |
| **Port** | A numbered "door" for a specific service on a device (0–65535) |
| **Gateway** | The device that sends your traffic out to other networks / the internet |
| **Protocol** | Agreed rules for how data is exchanged (e.g. HTTP, TCP) |

**Well-known ports to remember:**

| Port | Service |
|------|---------|
| 22 | SSH (secure remote login) |
| 53 | DNS |
| 80 | HTTP (web) |
| 443 | HTTPS (secure web) |
