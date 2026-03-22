import type { AuthRoles } from '@workspace/shared/auth';

/**
 * Controls whether page-segment role labels like `(admin)` / `(public)` are shown.
 * Omit `userRole` or set `display: false` to hide labels.
 * Use `default` for unmodified page slugs (no `_public` / `_admin` suffix).
 */
export type UserRoleDisplayConfig = {
  /** When true, role labels are shown (subject to `default`). Defaults to false. */
  display?: boolean;
  /** Role shown for segments without a `_public` / `_admin` suffix, e.g. `sound` → `(admin)`. */
  default?: AuthRoles;
};

/**
 * Matches the penultimate segment in keys like `admin.pages.sound_public.title`
 * (role suffix on the page slug: `_public` | `_admin`).
 */
const PAGE_SEGMENT_ROLE = /^(.*)_(public|admin)$/;

/**
 * Returns the auth role when the page segment uses a `_public` / `_admin` suffix; otherwise undefined.
 */
export function parseRoleFromPageSegment(pageSegment: string): AuthRoles | undefined {
  const m = pageSegment.match(PAGE_SEGMENT_ROLE);
  if (!m) return undefined;
  return m[2] as AuthRoles;
}

/**
 * Resolves the role label for a page segment when `userRole.display` is true:
 * explicit `_public` / `_admin` on the slug wins; otherwise `userRole.default` if set.
 */
export function resolveRoleForPageSegment(
  pageSegment: string,
  userRole: UserRoleDisplayConfig | undefined,
): AuthRoles | undefined {
  if (!userRole?.display) return undefined;
  const explicit = parseRoleFromPageSegment(pageSegment);
  if (explicit !== undefined) return explicit;
  return userRole.default;
}

/**
 * Appends ` (public)` / ` (admin)` after a label when `userRole` enables display and a role applies.
 */
export function appendRoleLabelToPageTitle({
  pageTitle,
  pageSegment,
  userRole,
}: {
  pageTitle: string;
  pageSegment: string;
  userRole?: UserRoleDisplayConfig;
}) {
  const role = resolveRoleForPageSegment(pageSegment, userRole);
  if (role === undefined) return pageTitle;
  return `${pageTitle} (${role})`;
}

/**
 * Extracts the page slug from keys like `admin.pages.sound_public.title` → `sound_public`.
 */
export function parsePageSegmentFromPagesKey(fullKey: string, domain: string): string | null {
  const prefix = `${domain}.pages.`;
  if (!fullKey.startsWith(prefix)) return null;
  const rest = fullKey.slice(prefix.length);
  const dot = rest.indexOf('.');
  if (dot === -1) return rest;
  return rest.slice(0, dot);
}

/** Keys under `*.pages.*_public.*` (public-facing page copy). */
export function isPublicPagesRoleKey(key: string, domain: string): boolean {
  const segment = parsePageSegmentFromPagesKey(key, domain);
  if (!segment) return false;
  return parseRoleFromPageSegment(segment) === 'public';
}
