# 🗺️ Master Roadmap - Touch Monorepo Modernization

📅 Nov 15, 2025

> **Last Updated:** 2025-11-15
> **Status:** Planning Phase

---

## 📋 Overview

This roadmap outlines the strategic modernization of the Touch Monorepo, focusing on:

1. Dependency upgrades (Zod, BetterAuth)
2. Modern TypeScript patterns (Standard Schema)
3. API endpoint architecture consolidation

---

## 🚦 Phase 0: Current State Assessment

### ✅ Current Tech Stack

- **Validation:** Zod v3.x
- **Auth:** BetterAuth (lower version due to dependency issues)
- **API Layer:** Hono + manual REST endpoints + manual React Query hooks
- **Database:** Drizzle ORM + SQLite
- **Frontend:** React + Vite + Emotion
- **Type Safety:** TypeScript + branded types

### ⚠️ Known Issues

- [ ] BetterAuth upgrade blocked by dependency conflicts
- [X] Zod v4 not adopted (possibly related to BetterAuth)
- [ ] ~34 manual API hooks in `apps/client/src/queries/*`
- [X] 3 files per API resource (routes, handlers, index)
- [ ] Type safety not enforced across client/server boundary
- [X] **API Endpoint Architecture:** Three overlapping endpoint systems (`EndpointHelper`, `FetchEndpointHelper`, `api/endpoints/` folder) causing confusion and duplication

---

## 📅 Phase 1: Dependency Stabilization (Wait Period)

**Timeline:** TBD - monitor ecosystem
**Priority:** 🔴 Critical (blocker for next phases)

### 1.1 Monitor BetterAuth Updates

- [ ] Check BetterAuth GitHub for dependency resolution
  - **Repo:** <https://github.com/better-auth/better-auth>
  - **Issue Tracker:** Look for dependency conflict issues
- [ ] Test BetterAuth upgrade in a separate branch
- [ ] Document specific dependency conflicts (Zod? Drizzle? Hono?)
- [ ] Wait for official resolution/workaround

**Dependencies to investigate:**

- Zod version requirements
- Drizzle ORM compatibility
- Hono integration

### 1.2 Monitor Zod v4 Stability

- [ ] Track Zod v4 release status
  - **Current:** Beta/RC
  - **Repo:** <https://github.com/colinhacks/zod>
- [ ] Check ecosystem adoption:
  - [ ] React Hook Form support
  - [ ] Drizzle-Zod adapter
  - [ ] BetterAuth compatibility ⚠️ **CRITICAL**
- [ ] Review breaking changes documentation
- [ ] Test Zod v4 in isolated branch

**Blockers:**

- BetterAuth must support Zod v4 before upgrade
- All form resolvers must be compatible

### 1.3 Dependency Compatibility Matrix

Create a test matrix:

```bash
# Test combinations
BetterAuth v? + Zod v3 + Drizzle vX → ✅/❌
BetterAuth v? + Zod v4 + Drizzle vX → ✅/❌
```

**Action Items:**

- [ ] Document current versions: `pnpm list zod better-auth drizzle-orm`
- [ ] Create compatibility test branch
- [ ] Run `pnpm why zod` to identify all Zod dependencies

---

### Questions to Resolve

- [ ] What specific BetterAuth dependency is conflicting?
- [ ] Can we upgrade BetterAuth independently of Zod?
- [ ] Do we need OpenAPI docs for external consumers?
