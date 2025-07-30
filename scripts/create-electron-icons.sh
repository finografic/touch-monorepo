#!/bin/bash

# Script to create electron icons from a source image
# Usage: ./scripts/create-electron-icons.sh path/to/source-image.png

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <source-image.png>"
    echo "Example: $0 assets/logo.png"
    exit 1
fi

SOURCE_IMAGE="$1"
ELECTRON_ASSETS_DIR="electron/assets"

# Check if source image exists
if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "Error: Source image '$SOURCE_IMAGE' not found"
    exit 1
fi

# Create assets directory if it doesn't exist
mkdir -p "$ELECTRON_ASSETS_DIR"

echo "Creating Electron icons from $SOURCE_IMAGE..."

# Check if ImageMagick is available
if command -v convert >/dev/null 2>&1; then
    echo "Using ImageMagick to convert icons..."

    # Create PNG icon (512x512)
    convert "$SOURCE_IMAGE" -resize 512x512 "$ELECTRON_ASSETS_DIR/icon.png"
    echo "✅ Created icon.png (512x512)"

    # Create ICO for Windows (multiple sizes)
    convert "$SOURCE_IMAGE" -resize 256x256 -depth 8 "$ELECTRON_ASSETS_DIR/icon.ico"
    echo "✅ Created icon.ico (Windows)"

    # For macOS ICNS, we need a more complex process
    echo "📝 Note: For macOS .icns, please use a dedicated tool or macOS"
    echo "   You can use 'iconutil' on macOS or online converters"

elif command -v sips >/dev/null 2>&1; then
    # macOS specific tool
    echo "Using macOS sips to convert icons..."

    # Create PNG icon
    sips -z 512 512 "$SOURCE_IMAGE" --out "$ELECTRON_ASSETS_DIR/icon.png"
    echo "✅ Created icon.png (512x512)"

    # For ICO and ICNS, recommend other tools
    echo "📝 Note: For .ico and .icns, consider using online converters or:"
    echo "   - ICO: Use online converter or ImageMagick"
    echo "   - ICNS: Use 'iconutil' on macOS"

else
    echo "⚠️  No image conversion tools found"
    echo "Please install ImageMagick or use online converters:"
    echo "1. Convert $SOURCE_IMAGE to:"
    echo "   - icon.png (512x512) -> $ELECTRON_ASSETS_DIR/icon.png"
    echo "   - icon.ico (Windows) -> $ELECTRON_ASSETS_DIR/icon.ico"
    echo "   - icon.icns (macOS) -> $ELECTRON_ASSETS_DIR/icon.icns"
    exit 1
fi

echo ""
echo "🎉 Icon creation complete!"
echo "📁 Check $ELECTRON_ASSETS_DIR/ for the generated icons"
echo ""
echo "Next steps:"
echo "1. If using macOS, create .icns file using iconutil"
echo "2. If icons look good, rebuild your Electron app"
echo "3. Test the app to ensure icons display correctly"
