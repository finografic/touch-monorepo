import type { TranslationsFormItem } from '../../shared/types/translations.types';

// ─── Sorting ────────────────────────────────────────────────────────────────

/**
 * Order of segments under `domains.` within a page.
 * Root strings (`title`, `description`) sort first, then ui → app → admin.
 */
const DOMAIN_SEGMENT_ORDER: readonly string[] = ['title', 'description', 'ui', 'app', 'admin'];

function domainSegmentRank(segment: string): number {
  const index = DOMAIN_SEGMENT_ORDER.indexOf(segment);
  return index === -1 ? 100 : index;
}

/** Coarse tier within one page bucket: page copy → domains.* → tabs.* → other. */
function pageTier(relativeKey: string): number {
  if (relativeKey === 'title' || relativeKey === 'description') return 0;
  if (relativeKey.startsWith('domains.')) return 1;
  if (relativeKey.startsWith('tabs.')) return 2;
  return 3;
}

/** Within tier 1 (domains.*), title < description < other — not alphabetical. */
function leafRank(relativeKey: string): number {
  if (relativeKey.endsWith('.title')) return 0;
  if (relativeKey.endsWith('.description')) return 1;
  return 2;
}

/**
 * Sort items within one `{i18nDomain}.pages.{pageName}.*` bucket so that:
 * 1. Page-level `title` / `description` appear first.
 * 2. All `domains.*` keys are contiguous, ordered by `DOMAIN_SEGMENT_ORDER`
 *    (ui → app → admin after bare root strings), with `title` before `description`
 *    within each sub-group.
 * 3. `tabs.*` keys follow, then anything else (locale order).
 *
 * Does not mutate the input array.
 */
export function sortPageItemsWithDomainsGrouped<T extends { key: string }>(
  items: T[],
  i18nDomain: string,
  pageName: string,
): T[] {
  const pagePrefix = `${i18nDomain}.pages.${pageName}.`;

  return [...items].sort((a, b) => {
    const relativeKeyA = a.key.startsWith(pagePrefix) ? a.key.slice(pagePrefix.length) : a.key;
    const relativeKeyB = b.key.startsWith(pagePrefix) ? b.key.slice(pagePrefix.length) : b.key;

    const tierA = pageTier(relativeKeyA);
    const tierB = pageTier(relativeKeyB);
    if (tierA !== tierB) return tierA - tierB;

    if (tierA === 1) {
      const segmentA = relativeKeyA.slice('domains.'.length).split('.')[0] ?? '';
      const segmentB = relativeKeyB.slice('domains.'.length).split('.')[0] ?? '';
      const rankA = domainSegmentRank(segmentA);
      const rankB = domainSegmentRank(segmentB);
      if (rankA !== rankB) return rankA - rankB;

      const leafA = leafRank(relativeKeyA);
      const leafB = leafRank(relativeKeyB);
      if (leafA !== leafB) return leafA - leafB;
    }

    return relativeKeyA.localeCompare(relativeKeyB);
  });
}

// ─── Display grouping ────────────────────────────────────────────────────────

/**
 * Extract the domain sub-group segment from a translation key within a page.
 *
 * Given key `admin.pages.translations.domains.ui.title` with
 * pagePrefix `admin.pages.translations.`, returns `"ui"`.
 *
 * Returns `null` for keys that don't start with `{pagePrefix}domains.`, or
 * bare root strings like `domains.title` / `domains.description` (single segment
 * after `domains.`) which are not sub-group members.
 */
export function getDomainSubGroupSegment(key: string, pagePrefix: string): string | null {
  const domainsPrefix = `${pagePrefix}domains.`;
  if (!key.startsWith(domainsPrefix)) return null;

  const parts = key.slice(domainsPrefix.length).split('.');
  if (parts.length < 2) return null;

  return parts[0];
}

/**
 * Build a domain sub-group map for fields within the pages group.
 *
 * Maps each field index to a compound key `{pageName}:::{segment}`, where
 * `segment` is the sub-domain after `domains.` (e.g. `"ui"`, `"app"`, `"admin"`).
 *
 * Only fields matching `{domain}.pages.{pageName}.domains.{segment}.*`
 * (two or more levels after `domains.`) receive an entry. Bare `domains.title` /
 * `domains.description` keys are excluded — they sort with page-level rows and
 * don't trigger a sub-group header.
 *
 * Returns `null` when no domain sub-groups are found.
 */
export function computeDomainSubGrouping(
  items: TranslationsFormItem[],
  fields: TranslationsFormItem[],
  pageGrouping: Map<number, string> | null,
  domain: string,
): Map<number, string> | null {
  let hasAny = false;
  const groupingMap = new Map<number, string>();

  items.forEach((item) => {
    const fieldIndex = fields.findIndex((f) => f.id === item.id || f.key === item.key);
    if (fieldIndex === -1) return;

    const pageName = pageGrouping?.get(fieldIndex);
    if (!pageName || pageName === '_other') return;

    const segment = getDomainSubGroupSegment(item.key ?? '', `${domain}.pages.${pageName}.`);
    if (!segment) return;

    groupingMap.set(fieldIndex, `${pageName}:::${segment}`);
    hasAny = true;
  });

  return hasAny ? groupingMap : null;
}
