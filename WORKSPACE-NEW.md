Great plan! This structure follows common monorepo patterns and will be much cleaner. Let's do this systematically to leverage IDE auto-updates.

## Target Structure

```
touch-monorepo/
├── config/                    (stays)
├── scripts/                   (stays)
├── packages/
│   ├── core/                  (move from core/common)
│   ├── globals/               (move from internal/globals)
│   ├── internal/              (move from internal/internal)
│   └── types/                 (move from internal/types)
└── apps/                      (stays)
```

## Step-by-Step Process

### 1. **Prepare for the Move**

```bash
# Commit current state first!
git add . && git commit -m "Pre-refactor: workspace structure cleanup"

# Clean build artifacts to avoid moving them
pnpm clean
```

### 2. **Create packages/ directory**

```bash
mkdir packages
```

### 3. **Move folders using IDE (for auto-path updates)**

**In your IDE file explorer, drag/move these folders:**

1. `internal/globals/` → `packages/globals/`
2. `internal/types/` → `packages/types/`
3. `internal/internal/` → `packages/internal/`
4. `core/common/` → `packages/core/`

**Let the IDE update import paths automatically!**

### 4. **Clean up empty directories**

```bash
# After moving, remove empty folders
rmdir internal core  # (if empty)
```

### 5. **Update workspace configuration**

**pnpm-workspace.yaml:**

```yaml
packages:
  - config
  - scripts
  - packages/*
  - apps/*
```

### 6. **Update turbo.json dependencies**

```json
{
  "tasks": {
    "@workspace/types#build": {
      "outputs": ["dist/**", "*.tsbuildinfo"]
    },
    "@workspace/globals#build": {
      "dependsOn": ["@workspace/types#build"],
      "outputs": ["dist/**", "*.tsbuildinfo"]
    },
    "@workspace/core#build": {
      "dependsOn": ["@workspace/globals#build"],
      "outputs": ["dist/**", "*.tsbuildinfo"]
    },
    // ... rest stays same
  }
}
```

### 7. **Test the changes**

```bash
# Fresh install to update lockfile
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Test build chain
pnpm build

# Test dev
pnpm dev
```

### 8. **Verify package.json names**

Check that each moved package has correct `name` in its `package.json`:
- `packages/core/package.json` → `"name": "@workspace/core"`
- `packages/globals/package.json` → `"name": "@workspace/globals"`
- etc.

## Benefits of this approach

- ✅ **IDE handles import updates**
- ✅ **Standard monorepo structure**
- ✅ **Cleaner organization**
- ✅ **Follows turbo.js conventions**

Ready to start with step 1? 🚀
