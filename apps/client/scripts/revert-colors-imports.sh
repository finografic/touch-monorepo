#!/bin/bash

# Revert colorsDirect imports back to colors
# Now that we've flipped the exports in styles/index.ts,
# 'colors' is the direct values (what we want)

echo "Reverting colorsDirect imports back to colors..."

# Find all .styles.ts files and revert the import
find apps/client/src -name "*.styles.ts" -type f -exec sed -i '' 's/import { colorsDirect as colors } from '\''styles'\'';/import { colors } from '\''styles'\'';/g' {} +

echo "✅ Reverted imports in .styles.ts files!"
echo ""
echo "Summary:"
echo "- Changed: import { colorsDirect as colors } from 'styles';"
echo "- Back to: import { colors } from 'styles';"
echo ""
echo "Now 'colors' from 'styles' gives direct hex values (not CSS variables)!"

