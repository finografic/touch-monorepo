import type { AuthRoles } from 'admin/config/admin.routes.map';
import { m } from 'i18n/messages';

type MessageParams = Record<string, unknown>;

export function getMessageTexts<
  Segments extends string[],
  Elements extends string[],
  Role extends AuthRoles | undefined = undefined,
>(
  segments: [...Segments],
  options: {
    elements: [...Elements];
    role?: Role;
  } & MessageParams,
): Record<Elements[number], string> {
  const { elements, role, ...params } = options;

  const base = segments.join('_');
  const result: Record<string, string> = {};

  for (const element of elements) {
    const candidates = [
      role ? `${base}_${element}_${role}` : undefined, //  1. New preferred convention:  role last
      role ? `${base}_${role}_${element}` : undefined, //  2. Older legacy convention: role before element
      `${base}_${element}`, //                             3. No role
      base, //                                             4. Just base — rarely used, but valid fallback
    ].filter(Boolean) as string[];

    const foundKey = candidates.find((k) => k in m);

    if (!foundKey) {
      console.warn(`⚠️ Missing translation for: ${base}_${element}`);
      result[element] = `${base}_${element}`;
      continue;
    }

    const key = foundKey as keyof typeof m;
    const translator = m[key];

    result[element] =
      typeof translator === 'function' ? translator({ element, role, ...params }) : (translator as string);
  }

  return result as Record<Elements[number], string>;
}
