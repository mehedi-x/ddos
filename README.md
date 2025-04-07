# CYBER PROTECTION TOOL v5.0 - ULTIMATE POWER

A powerful DDoS (Distributed Denial of Service) attack tool designed for educational purposes and stress testing on authorized servers. This tool supports UDP, TCP, and HTTP flood attacks and is optimized to run on non-rooted Android devices using Termux.

> **⚠️ Legal Warning**: Using this tool to attack servers without explicit permission is illegal in most countries and can lead to severe legal consequences. Use this tool only for educational purposes or on servers you own or have permission to test.

## Features
- **Multi-Protocol Attacks**: Supports UDP, TCP, and HTTP flood attacks.
- **Non-Root Support**: Works on non-rooted Android devices using Termux.
- **Proxy Support**: Includes auto-rotating proxy support for anonymity.
- **TOR Integration**: Option to route traffic through the TOR network (requires Orbot).
- **Customizable Parameters**: Allows customization of threads, packet size, and attack duration.
- **User-Friendly Interface**: Colorful terminal output with a login system.

## Requirements
- **Termux**: A terminal emulator for Android.
- **Python 3**: Required to run the script.
- **Python Libraries**:
  - `requests`
  - `colorama`
  - `fake-useragent`
  - `aiohttp`
  - `pysocks`
- **Orbot** (optional): For TOR network support.

## Installation
Follow these steps to set up the tool on Termux:

1. **Update Termux and Install Python**:
   ```bash
   pkg update && pkg upgrade -y
   pkg install python -y
