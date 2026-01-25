#!/bin/bash
# Quick script to find Raspberry Pi on local network
# Run this from your Mac

echo "🔍 Searching for Raspberry Pi on local network..."
echo ""

# Get your Mac's network info
MAC_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "unknown")
NETWORK_PREFIX=$(echo $MAC_IP | cut -d. -f1-3)

echo "Your Mac IP: $MAC_IP"
echo "Scanning network: $NETWORK_PREFIX.0/24"
echo ""

# Try common Raspberry Pi hostnames
echo "Checking common hostnames..."
ping -c 1 raspberrypi.local > /dev/null 2>&1 && echo "✅ Found: raspberrypi.local" || echo "❌ raspberrypi.local not found"

# Scan for devices with Raspberry Pi MAC prefixes
echo ""
echo "Scanning for Raspberry Pi MAC addresses..."
echo "(Common prefixes: b8:27:eb, dc:a6:32, e4:5f:01)"
echo ""

# Use arp to find devices
arp -a | grep -iE "b8:27:eb|dc:a6:32|e4:5f:01" | while read line; do
  IP=$(echo $line | awk '{print $2}' | tr -d '()')
  MAC=$(echo $line | awk '{print $4}')
  echo "  IP: $IP  MAC: $MAC"
done

echo ""
echo "💡 If no results, try:"
echo "   1. SSH into Pi and run: hostname -I"
echo "   2. Check your router's admin panel"
echo "   3. Use: nmap -sn $NETWORK_PREFIX.0/24"
echo ""
echo "📝 Once you have the IP, access:"
echo "   Client: http://<PI_IP>:3000"
echo "   API:    http://<PI_IP>:4040/api"
