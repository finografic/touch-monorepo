#!/bin/bash
# Configure static IP address for Raspberry Pi
# This script configures wlan0 (WiFi) with a static IP address

# Ensure we're using bash
if [ -z "$BASH_VERSION" ]; then
    exec /bin/bash "$0" "$@"
fi

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Raspberry Pi Static IP Configuration${NC}"
echo ""

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
    echo -e "${RED}❌ Please run as root (use sudo)${NC}"
    exit 1
fi

# Configuration variables
INTERFACE="wlan0"
STATIC_IP="192.168.1.31"
SUBNET_MASK="/24"
CONFIG_FILE="/etc/dhcpcd.conf"
BACKUP_FILE="/etc/dhcpcd.conf.backup"

# Get current network info
echo -e "${YELLOW}📡 Detecting current network configuration...${NC}"

# Get current IP
CURRENT_IP=$(ip -4 addr show $INTERFACE | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | head -1)
if [ -z "$CURRENT_IP" ]; then
    echo -e "${RED}❌ Could not detect current IP for $INTERFACE${NC}"
    echo "   Make sure WiFi is connected"
    exit 1
fi

# Get gateway (router IP)
GATEWAY=$(ip route | grep default | grep $INTERFACE | awk '{print $3}' | head -1)
if [ -z "$GATEWAY" ]; then
    # Fallback: try to get default gateway
    GATEWAY=$(ip route | grep default | awk '{print $3}' | head -1)
fi

# Get DNS servers (from /etc/resolv.conf)
DNS_SERVERS=$(grep nameserver /etc/resolv.conf | awk '{print $2}' | head -2 | tr '\n' ' ')
if [ -z "$DNS_SERVERS" ]; then
    DNS_SERVERS="8.8.8.8 8.8.4.4"  # Google DNS fallback
fi

echo -e "${GREEN}✓ Current IP: $CURRENT_IP${NC}"
echo -e "${GREEN}✓ Gateway: $GATEWAY${NC}"
echo -e "${GREEN}✓ DNS: $DNS_SERVERS${NC}"
echo ""

# Confirm configuration
echo -e "${YELLOW}📝 Configuration to apply:${NC}"
echo "   Interface: $INTERFACE"
echo "   Static IP: $STATIC_IP$SUBNET_MASK"
echo "   Gateway: $GATEWAY"
echo "   DNS: $DNS_SERVERS"
echo ""
printf "Continue? (y/n) "
read REPLY
if [ "$REPLY" != "y" ] && [ "$REPLY" != "Y" ]; then
    echo -e "${YELLOW}❌ Cancelled${NC}"
    exit 0
fi

# Backup current config
echo -e "${YELLOW}💾 Backing up current configuration...${NC}"
if [ -f "$CONFIG_FILE" ]; then
    cp "$CONFIG_FILE" "$BACKUP_FILE"
    echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"
else
    echo -e "${YELLOW}⚠️  Config file not found, will create new one${NC}"
fi

# Check if static IP config already exists
if grep -q "interface $INTERFACE" "$CONFIG_FILE" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Static IP configuration for $INTERFACE already exists${NC}"
    echo "   Removing old configuration..."
    # Remove existing configuration for this interface
    sed -i "/^# Static IP configuration for $INTERFACE/,/^$/d" "$CONFIG_FILE"
    sed -i "/^interface $INTERFACE$/,/^$/d" "$CONFIG_FILE"
fi

# Add static IP configuration
echo -e "${YELLOW}✏️  Adding static IP configuration...${NC}"
cat >> "$CONFIG_FILE" << EOF

# Static IP configuration for $INTERFACE
# Added by configure-static-ip.sh on $(date)
interface $INTERFACE
static ip_address=$STATIC_IP$SUBNET_MASK
static routers=$GATEWAY
static domain_name_servers=$DNS_SERVERS
EOF

echo -e "${GREEN}✓ Configuration added to $CONFIG_FILE${NC}"

# Restart networking service
echo -e "${YELLOW}🔄 Restarting networking service...${NC}"
RESTARTED=false

# Try different methods to restart dhcpcd
if systemctl list-units --type=service | grep -q "dhcpcd"; then
    if systemctl restart dhcpcd 2>/dev/null; then
        RESTARTED=true
    elif systemctl restart dhcpcd.service 2>/dev/null; then
        RESTARTED=true
    fi
elif command -v service >/dev/null 2>&1 && service dhcpcd restart 2>/dev/null; then
    RESTARTED=true
fi

if [ "$RESTARTED" = false ]; then
    echo -e "${YELLOW}⚠️  Could not restart dhcpcd service automatically${NC}"
    echo ""
    echo -e "${YELLOW}📝 Manual steps:${NC}"
    echo "   1. Restart the service manually:"
    echo "      sudo systemctl restart dhcpcd"
    echo ""
    echo "   2. Or reboot the system:"
    echo "      sudo reboot"
    echo ""
    echo -e "${GREEN}✓ Configuration has been saved to $CONFIG_FILE${NC}"
    echo "   The static IP will be applied after restarting dhcpcd or rebooting."
    echo ""
    read -p "Press Enter to continue (you can restart manually later)..."
else
    echo -e "${GREEN}✓ Service restarted successfully${NC}"
fi

# Wait a moment for network to stabilize
sleep 3

# Verify new IP
echo -e "${YELLOW}🔍 Verifying new IP address...${NC}"
NEW_IP=$(ip -4 addr show $INTERFACE | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | head -1)

if [ "$NEW_IP" = "$STATIC_IP" ]; then
    echo -e "${GREEN}✅ Success! Static IP configured: $NEW_IP${NC}"
    echo ""
    echo -e "${GREEN}📋 Summary:${NC}"
    echo "   IP Address: $NEW_IP"
    echo "   Gateway: $GATEWAY"
    echo "   DNS: $DNS_SERVERS"
    echo "   Interface: $INTERFACE"
    echo ""
    echo -e "${YELLOW}💡 Note: This IP will persist after reboots${NC}"
else
    echo -e "${YELLOW}⚠️  IP address is: $NEW_IP (expected $STATIC_IP)${NC}"
    echo "   This might take a moment to update. Check again with:"
    echo "   ip addr show $INTERFACE"
fi

echo ""
echo -e "${GREEN}✅ Configuration complete!${NC}"
