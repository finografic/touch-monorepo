# 🚧 TODO.FIX_project-scripts

## **Current Status (Updated):**

✅ **Dependencies Updated**: Successfully updated most deps in separate repo
❌ **Still 1 Deprecated Warning**: `source-map@0.8.0-beta.0` from `tsup@8.5.0`
⚠️ **Workspace Conflict**: Package exists in both workspace and as published dependency

## **Confirmed Issue:**

The deprecated dependency warning persists in the separate `@finografic/project-scripts` repo after deleting lock-file and node_modules. This confirms it's a sub-dependency of `tsup`, not a workspace issue.

## **To Remove from Workspace:**

1. **Remove from `pnpm-workspace.yaml`** (currently listed as `scripts`)
2. **Remove any workspace references** in package.json files
3. **Delete the `scripts/` folder from monorepo**
4. **Reinstall to use the published version**

## **Steps to Clean Up:**

1. **Remove from workspace** (if the `scripts` folder is the project-scripts repo)
2. **Update to use published version** in your monorepo
3. **Reinstall dependencies**

This will ensure you're using the clean, published version of `@finografic/project-scripts` with all the updated dependencies, rather than a workspace version that might have conflicting deps.

Once you've published the updated `@finografic/project-scripts` package and removed it from the workspace, you can update your monorepo to use the latest published version! 🎯

---

## **Current Situation Analysis**

You have `@finografic/project-scripts` in two places:
1. **As a workspace package** (`scripts/` in your monorepo)
2. **As a published npm package** (that you consume)

## **What Happens If You Don't Fix It:**

### **✅ Things That Will Still Work:**

- Your monorepo will continue to function normally
- Build processes will work
- The deprecated dependency warnings are just **warnings**, not errors
- All functionality remains intact

### **⚠️ Potential Issues:**

1. **Dependency Confusion**: pnpm might use the workspace version instead of the published version
2. **Inconsistent Versions**: Different parts of your monorepo might use different versions
3. **Build Cache Issues**: Workspace dependencies can cause cache invalidation problems
4. **Maintenance Overhead**: You're maintaining the same code in two places

### **🔍 Check Current State:**

Let me see which version is actually being used:

[1 tool called]

## **My Recommendation: Not Urgent, But Worth Cleaning Up**

### **Short Term (Safe to Leave As-Is):**

- ✅ **No immediate breakage** - everything will continue working
- ✅ **Warnings are cosmetic** - they don't affect functionality
- ✅ **You can address this later** when you have more time

### **Long Term (Worth Fixing Eventually):**

- 🎯 **Cleaner architecture** - single source of truth for the package
- 🎯 **Easier maintenance** - no duplicate codebases
- 🎯 **Fewer warnings** - cleaner build output
- 🎯 **Better dependency resolution** - no workspace conflicts

## **If You Want to Fix It Later:**

1. **Remove `scripts` from `pnpm-workspace.yaml`**
2. **Delete the `scripts/` folder from your monorepo**
3. **Run `pnpm install` to use the published version**

## **Action Plan for Future Fix:**

### **Option 1: Quick Fix (Recommended)**

1. **Remove workspace conflict**:

   ```bash
   # In touch-monorepo
   # Remove 'scripts' from pnpm-workspace.yaml
   # Delete scripts/ folder
   # Run: pnpm install
   ```

### **Option 2: Address Deprecated Dependency**

The `source-map@0.8.0-beta.0` warning is from `tsup@8.5.0`. Options:
- **Wait**: `tsup` will likely update this in future versions
- **Alternative**: Switch to different build tool (not recommended)
- **Ignore**: It's just a warning, doesn't break functionality

### **Recommended Approach:**

1. **Fix workspace conflict first** (Option 1) - this is the main issue
2. **Ignore the source-map warning** - it's cosmetic and will be fixed upstream

## **Bottom Line:**

**Priority: Medium** - The workspace conflict should be fixed to avoid dependency confusion, but the deprecated warning is just cosmetic noise. The server build errors were the real issue and those are now ✅ **FIXED**! 🎯
