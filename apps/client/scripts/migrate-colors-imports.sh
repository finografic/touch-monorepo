#!/bin/bash

# Script to migrate all .styles.ts files from old colors import to colorsDirect
# This fixes the issue where CSS variables no longer exist

echo "🔄 Migrating color imports in .styles.ts files..."

# Find all .styles.ts files and replace the import
find ./src -name "*.styles.ts" -type f | while read file; do
  if grep -q "import.*{.*colors.*}.*from 'styles'" "$file"; then
    echo "📝 Updating: $file"

    # Replace: import { colors } from 'styles'
    # With: import { colorsDirect as colors } from 'styles'
    sed -i '' "s/import { colors }/import { colorsDirect as colors }/g" "$file"

    # Replace: import { colors, other } from 'styles'
    # With: import { colorsDirect as colors, other } from 'styles'
    sed -i '' "s/import { colors,/import { colorsDirect as colors,/g" "$file"

    # Replace: import { other, colors } from 'styles'
    # With: import { other, colorsDirect as colors } from 'styles'
    sed -i '' "s/, colors }/, colorsDirect as colors }/g" "$file"
  fi
done

echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. Check the changes with: git diff"
echo "2. Test your app"
echo "3. Commit if everything works"

