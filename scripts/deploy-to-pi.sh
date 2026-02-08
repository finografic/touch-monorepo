#!/bin/bash
# Deploy Touch app to Raspberry Pi
#
# Prerequisites:
# - SSH access: ssh touch@192.168.1.31 (password: 1234)
# - For passwordless deployment: ssh-copy-id touch@192.168.1.31
#
# Uses SSH ControlMaster so you only enter the password ONCE per run.

set -e

PI_USER="touch"
PI_HOST="192.168.1.31"
PI_APP_DIR="/home/touch/Desktop/APP"
PI_NODE_BIN="/home/touch/.nvm/versions/node/v22.17.1/bin"
DEPLOYMENTS_DIR="$(cd "$(dirname "$0")/.." && pwd)/deployments"

# Reuse one SSH connection — password prompt only once
SSH_CONTROL="/tmp/ssh-pi-deploy-$$"
ssh_common=(-o "ControlMaster=auto" -o "ControlPath=$SSH_CONTROL" -o "ControlPersist=120")
cleanup_ssh() { ssh -o ControlPath="$SSH_CONTROL" -O exit "${PI_USER}@${PI_HOST}" 2>/dev/null || true; rm -f "$SSH_CONTROL"; }
trap cleanup_ssh EXIT

# Optional: pass zip path as first argument
ZIP_PATH="${1:-}"

echo "🍓 Deploy to Raspberry Pi"
echo "   Host: ${PI_USER}@${PI_HOST}"
echo "   Target: ${PI_APP_DIR}"
echo ""

# CLEAN EXISTING DEPLOYMENTS (rm -f does not exit when no files match)
echo "🧹 Cleaning existing deployments..."
rm -f "${DEPLOYMENTS_DIR}"/touch-monorepo-linux-*.zip
echo "   Done"
echo ""

# Step 1: Build deployment (if no zip provided)
if [ -z "$ZIP_PATH" ]; then
  echo "📦 Building Linux (arm64) deployment for Raspberry Pi..."
  pnpm build.deployment -p linux -a arm64 -z
  echo ""

  # Find latest zip
  ZIP_PATH=$(ls -t "${DEPLOYMENTS_DIR}"/touch-monorepo-linux-*.zip 2>/dev/null | head -1)
  if [ -z "$ZIP_PATH" ] || [ ! -f "$ZIP_PATH" ]; then
    echo "❌ No deployment zip found in ${DEPLOYMENTS_DIR}"
    exit 1
  fi
  echo "   Using: $(basename "$ZIP_PATH")"
else
  if [ ! -f "$ZIP_PATH" ]; then
    echo "❌ Zip not found: $ZIP_PATH"
    exit 1
  fi
  echo "   Using: $ZIP_PATH"
fi
echo ""

# Step 2: Kill Node processes on Pi (first ssh opens connection — enter password here)
echo "🛑 Stopping Node processes on Pi..."
ssh "${ssh_common[@]}" "${PI_USER}@${PI_HOST}" "killall node 2>/dev/null || true"
echo "   Done"
echo ""

# Step 3: Wipe APP directory (including dot files, node_modules)
echo "🗑️  Clearing ${PI_APP_DIR}..."
ssh "${ssh_common[@]}" "${PI_USER}@${PI_HOST}" "find ${PI_APP_DIR} -mindepth 1 -maxdepth 1 -exec rm -rf {} + 2>/dev/null || true"
echo "   Done"
echo ""

# Step 4: Copy zip via rsync
echo "📤 Copying zip to Pi..."
rsync -avz --progress -e "ssh -o ControlPath=$SSH_CONTROL" "$ZIP_PATH" "${PI_USER}@${PI_HOST}:${PI_APP_DIR}/"
ZIP_NAME=$(basename "$ZIP_PATH")
echo "   Done"
echo ""

# Step 5: Unzip on Pi
echo "📂 Unzipping on Pi..."
ssh "${ssh_common[@]}" "${PI_USER}@${PI_HOST}" "cd ${PI_APP_DIR} && unzip -o ${ZIP_NAME} && rm ${ZIP_NAME}"
echo "   Done"
echo ""

# Step 6: npm install on Pi (PATH needed for node; LC_ALL=C avoids locale warnings)
echo "📦 Running npm install on Pi..."
ssh "${ssh_common[@]}" "${PI_USER}@${PI_HOST}" "cd ${PI_APP_DIR} && export PATH=${PI_NODE_BIN}:\$PATH && export LC_ALL=C && npm install"
echo "   Done"
echo ""

echo "✅ Deployment complete!"
echo ""
echo "   To start the app on the Pi:"
echo "   cd ${PI_APP_DIR} && ./start-both.sh"
echo ""
echo "   💡 To skip password entirely: ssh-copy-id ${PI_USER}@${PI_HOST}"
echo ""
