দারুণ প্রশ্ন! GitHub-এর `README.md`-এ এমনভাবে কোড ব্লক লিখলে, প্রতিটি কমান্ড আলাদা করে কপি করার জন্য বক্স হিসেবে দেখায়—যেটা ইউজাররা এক ক্লিকে কপি করতে পারে।

তোমার চাহিদা অনুযায়ী প্রতিটি কমান্ড একে একে সুন্দরভাবে সাজিয়ে `README.md`-টি নিচে আরও প্রফেশনালভাবে উপস্থাপন করলাম, যাতে সব কমান্ড আলাদাভাবে কপি করা যায়:

```markdown
# DDOS Testing Tool for Termux

A lightweight and customizable Python-based DDOS simulation tool designed for educational and testing purposes in Termux.

---

## Features

- UDP attack simulation
- Fully customizable (URL, IP, Port, Threads, Packet Size, etc.)
- Optional support for Proxies and TOR
- Designed for Android Termux environment

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/mehedi-x/ddos
```

```bash
cd ddos
```

### Step 2: Update Termux and Install Python

```bash
pkg update
```

```bash
pkg upgrade -y
```

```bash
pkg install python -y
```

### Step 3: Install Required Python Libraries

```bash
pip install requests
```

```bash
pip install colorama
```

```bash
pip install fake-useragent
```

```bash
pip install aiohttp
```

```bash
pip install pysocks
```

---

## Setup

### Step 4: Paste the Script

```bash
nano ddos_tool.py
```

- Paste your script/code inside the editor
- Save it by pressing `CTRL + X`, then press `Y`, then `Enter`

---

## Running the Tool

```bash
python ddos_tool.py
```

### Example Inputs (when prompted):

```
Username: MEHEDI
Password: CPDDOS
Target URL: http://localhost:8080
Target IP: 127.0.0.1
Port: 8080
Threads: 10
Packet Size: 1024
Attack Type: udp
Duration (in seconds): 10
Use proxies? n
Use TOR? n
```

---

## Disclaimer

> **Warning:** This tool is provided for **educational and authorized testing purposes only**.  
> Any unauthorized use against third-party servers is **strictly prohibited** and may be considered illegal.  
> The developer holds **no responsibility** for any misuse or damage caused.

---

## License

Licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## Author

**Mehedi-X**  
GitHub: [@mehedi-x](https://github.com/mehedi-x)
```
