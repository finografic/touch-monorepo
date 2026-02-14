# scripts/ubuntu

Scripts for setting up and running Ubuntu / Raspberry Pi OS on a Pi (and for local QEMU testing on macOS).

**None of these scripts are referenced from `package.json`** — run them manually when needed.

---

## Setup (run on the Pi, in order)

| Script | What it does |
|--------|--------------|
| **01-install-nvm.sh** | Installs nvm (Node Version Manager) on the Pi. Prompts before overwriting existing install. |
| **02-install-others.sh** | Installs Node 22.17.1 via nvm, sets it default, and adds global `ntl` plus `run` / `bar` aliases to `.bashrc`. |
| **03-install-apt-hid-v1.sh** | Installs libusb + build-essential and udev rules for USBRelay8; adds user `touch` to `input` group. Simpler variant. |
| **04-install-apt-hid-v2.sh** | Full node-hid setup for Pi: deps, udev rules for USBRelay8 (16c0:05df), group membership. Run with `sudo`. |
| **05-configure-static-ip.sh** | Sets static IP 192.168.1.31 on `wlan0` via `/etc/dhcpcd.conf`. Run with `sudo`. |
