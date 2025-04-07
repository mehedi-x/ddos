import requests
import threading
import time
import random
from concurrent.futures import ThreadPoolExecutor

def send_request(target_url, request_id):
    headers = {
        "User-Agent": random.choice([
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36"
        ])
    }
    try:
        response = requests.get(target_url, headers=headers, timeout=5)
        print(f"Request {request_id}: Status Code - {response.status_code}")
    except Exception as e:
        print(f"Request {request_id} failed: {e}")
    time.sleep(0.5)  # সার্ভারে চাপ কমাতে বিরতি

def simulate_network_load(target_url, num_requests, num_threads):
    print(f"Starting simulation on {target_url} with {num_requests} requests and {num_threads} threads...")
    start_time = time.time()

    with ThreadPoolExecutor(max_workers=num_threads) as executor:
        for i in range(num_requests):
            executor.submit(send_request, target_url, i + 1)

    end_time = time.time()
    print(f"Simulation completed in {end_time - start_time:.2f} seconds (Educational purpose only).")

if __name__ == "__main__":
    target = input("Enter target URL (e.g., http://localhost): ")
    requests_count = int(input("Enter number of requests (e.g., 10): "))
    threads_count = int(input("Enter number of threads (e.g., 2): "))

    # সীমাবদ্ধতা যোগ করা হয়েছে যাতে অতিরিক্ত চাপ না পড়ে
    if requests_count > 100 or threads_count > 10:
        print("Error: Maximum limit is 100 requests and 10 threads for safety.")
    else:
        simulate_network_load(target, requests_count, threads_count)
