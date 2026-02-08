# Raspberry Pi Network Access Guide

This guide explains how to access your Raspberry Pi 4 from your Mac over the local network.

## 1. Finding the Raspberry Pi's IP Address

### Option A: From the Raspberry Pi (SSH or direct access)

```bash
# Get IP address
hostname -I

# Or more detailed
ip addr show

# Or just the WiFi IP
ip addr show wlan0 | grep "inet " | awk '{print $2}' | cut -d/ -f1
```

### Option B: From your Mac (scan network)

```bash
# Scan your local network (replace 192.168.1 with your network prefix)
nmap -sn 192.168.1.0/24 | grep -B 2 "Raspberry"

# Or use arp to find devices
arp -a | grep -i "raspberry\|b8:27:eb\|dc:a6:32\|e4:5f:01"
```

### Option C: Check your router's admin panel

Most routers have a web interface (usually `192.168.1.1` or `192.168.0.1`) that lists connected devices.

---

## 2. Accessing the Web Application

### Development vs Production

**If running production build:**

- The built client is served by the server (port 4040)
- Access via: `http://<PI_IP>:4040`
- No separate client port needed

**If running dev servers:**

- Client dev server: port 3000
- API server: port 4040
- Access via: `http://<PI_IP>:3000` (client proxies `/atouch` to 4040)

### Prerequisites

1. **Ensure the server binds to all interfaces** (not just localhost)
   - The `@hono/node-server` `serve()` function binds to `0.0.0.0` by default, which is correct
   - Verify by checking server logs: should show `API Listening: http://0.0.0.0:4040` or similar

2. **Check firewall on Raspberry Pi**

   ```bash
   # Check if ufw is active
   sudo ufw status

   # If active, allow ports (if needed)
   sudo ufw allow 3000/tcp
   sudo ufw allow 4040/tcp
   ```

3. **Verify ports are listening**

   ```bash
   # On Raspberry Pi
   sudo netstat -tlnp | grep -E '3000|4040'
   # Or
   sudo ss -tlnp | grep -E '3000|4040'
   ```

### Access URLs

Once you have the IP address (let's say it's `192.168.1.31`):

- **Client (React App)**: `http://192.168.1.31:3000`
- **API Server**: `http://192.168.1.31:4040`
- **API Endpoint**: `http://192.168.1.31:4040/atouch`

### Configuration Changes Needed

#### 1. Vite Dev Server (Client) - Must Change Host Binding

The Vite dev server is currently configured to only listen on `localhost`. To access from other machines, you need to change it to `0.0.0.0`:

**File: `apps/client/vite.config.ts`**

```typescript
server: {
  port: 3000,
  host: '0.0.0.0',  // Change from 'localhost' to '0.0.0.0'
  // ... rest of config
}
```

**Or use environment variable:**

```bash
# In your .env or when running
VITE_HOST=0.0.0.0 pnpm dev
```

#### 2. Server (API) - Should Already Work

The `@hono/node-server` `serve()` function binds to `0.0.0.0` by default, so it should already accept connections from other machines. Verify in server logs that it shows the correct binding.

#### 3. Environment Variables

Ensure your `.env` file on the Pi has:

```bash
# API Server
API_PORT=4040
API_HOST=0.0.0.0  # Optional, serve() binds to 0.0.0.0 by default

# Client origin for CORS (important!)
CLIENT_ORIGIN=http://192.168.1.31:3000
# Or allow all origins in development:
# CLIENT_ORIGIN=*

# Client dev server (if using env vars)
CLIENT_HOST=0.0.0.0
CLIENT_PORT=3000
```

### Testing Connection

From your Mac terminal:

```bash
# Test API server
curl http://192.168.1.31:4040/atouch/health-check

# Test client (should return HTML)
curl http://192.168.1.31:3000
```

---

## 3. File Sharing via SMB/Samba (Finder Access)

### On Raspberry Pi: Install and Configure Samba

```bash
# Install Samba
sudo apt update
sudo apt install samba -y

# Create a share directory (optional - you can share existing directories)
mkdir -p ~/shared
chmod 755 ~/shared

# Backup original config
sudo cp /etc/samba/smb.conf /etc/samba/smb.conf.backup

# Edit Samba config
sudo nano /etc/samba/smb.conf
```

Add this to the end of `/etc/samba/smb.conf`:

```ini
[touch-home]
   comment = Raspberry Pi Home Directory
   path = /home/touch
   browseable = yes
   writable = yes
   guest ok = no
   valid users = touch
   create mask = 0644
   directory mask = 0755

[shared]
   comment = Shared Folder
   path = /home/touch/shared
   browseable = yes
   writable = yes
   guest ok = yes
   create mask = 0664
   directory mask = 0775
```

### Set Samba Password

```bash
# Set password for user 'touch' (or your username)
sudo smbpasswd -a touch

# Enable the user
sudo smbpasswd -e touch
```

### Restart Samba Service

```bash
sudo systemctl restart smbd
sudo systemctl enable smbd  # Enable on boot
```

### From Mac: Connect via Finder

1. **Open Finder**
2. **Press `Cmd + K`** (or Go → Connect to Server)
3. **Enter**: `smb://192.168.1.31`
4. **Authenticate** with username `touch` and password `1234` (or your Samba password)
5. **Select the share** you want to access

### Alternative: Connect via Terminal

```bash
# Create mount point if it doesn't exist
mkdir -p ~/Public/touch

# Mount using mount_smbfs (macOS native SMB client)
sudo mount_smbfs //touch:1234@192.168.1.31/touch ~/Public/touch
```

Or with more options:

```bash
sudo mount_smbfs -o uid=$(id -u),gid=$(id -g) //touch:1234@192.168.1.31/touch ~/Public/touch
```

```bash
# Unmount when done
sudo umount ~/touch
```

---

## 4. Deploy to Pi (Script)

From the monorepo root:

```bash
./scripts/deploy-to-pi.sh
```

This script will:

1. Build Linux deployment zip (if not provided)
2. **SSH**: `killall node` — stop Node processes
3. **SSH**: `rm -rf` — clear `/home/touch/Desktop/APP/*` (including dot files, node_modules)
4. **rsync**: Copy zip to Pi
5. **SSH**: Unzip
6. **SSH**: `npm install`

**Samba vs SSH**: Samba is file sharing only — it cannot execute commands. You **must use SSH** for `killall` and `rm -rf`. For passwordless deployment: `ssh-copy-id touch@192.168.1.31`

---

## 5. SSH Access (Bonus)

If you want SSH access (useful for remote management):

```bash
# On Raspberry Pi: Enable SSH (usually enabled by default)
sudo systemctl enable ssh
sudo systemctl start ssh

# From Mac: Connect via SSH
ssh touch@192.168.1.31
# Password: 1234
```

---

## Troubleshooting

### Can't access web app from Mac

1. **Check firewall on Pi**:

   ```bash
   sudo ufw status
   sudo ufw allow 3000/tcp
   sudo ufw allow 4040/tcp
   ```

2. **Verify server is binding to 0.0.0.0**:

   ```bash
   # On Pi
   sudo netstat -tlnp | grep 4040
   # Should show: 0.0.0.0:4040 (not 127.0.0.1:4040)
   ```

3. **Check CORS settings** - ensure `CLIENT_ORIGIN` includes your Mac's IP or use `*` for development

4. **Test from Pi itself**:

   ```bash
   curl http://localhost:4040/atouch/health-check
   curl http://$(hostname -I | awk '{print $1}'):4040/atouch/health-check
   ```

### Can't access Samba share

1. **Check Samba is running**:

   ```bash
   sudo systemctl status smbd
   ```

2. **Check firewall allows Samba**:

   ```bash
   sudo ufw allow samba
   ```

3. **Verify share permissions**:

   ```bash
   ls -la /home/touch/shared
   ```

4. **Check Samba logs**:

   ```bash
   sudo tail -f /var/log/samba/log.smbd
   ```

### Port conflicts

If ports 3000 or 4040 are already in use:

```bash
# Find what's using the port
sudo lsof -i :3000
sudo lsof -i :4040

# Kill the process if needed
sudo kill -9 <PID>
```

---

## Quick Reference

| Service | Protocol | Port | URL Format |
|---------|----------|------|------------|
| Client (Vite) | HTTP | 3000 | `http://<PI_IP>:3000` |
| API Server | HTTP | 4040 | `http://192.168.1.31:4040/api` |
| Samba | SMB | 445 | `smb://<PI_IP>` |
| SSH | SSH | 22 | `ssh touch@192.168.1.31` |

---

## Security Notes

⚠️ **For Production**:

- Use HTTPS instead of HTTP
- Set up proper firewall rules
- Use strong passwords
- Consider VPN for remote access
- Disable guest access on Samba shares
- Regularly update Raspberry Pi OS

✅ **For Development**:

- The above setup is fine for local network development
- Be aware that anyone on your network can access these services
