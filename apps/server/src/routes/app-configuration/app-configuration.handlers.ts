import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

import { db } from 'db';
import { app_configuration } from 'db/schemas';
import type { AppRouteHandler } from 'types/app.types';
import type { GetByKeyRoute, GetOneRoute, ListRoute, PatchRoute } from './app-configuration.routes';

function parseData(data: string | null): Record<string, unknown> {
  if (data == null || data === '') return {};
  try {
    const parsed = JSON.parse(data) as unknown;
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function cleanTimestamps<T extends { createdAt?: string | null; updatedAt?: string | null; data?: string | null }>(
  row: T,
): Omit<T, 'createdAt' | 'updatedAt' | 'data'> & {
  createdAt?: string;
  updatedAt?: string;
  data: Record<string, unknown>;
} {
  const { createdAt, updatedAt, data, ...rest } = row;
  return {
    ...rest,
    ...(createdAt ? { createdAt } : {}),
    ...(updatedAt ? { updatedAt } : {}),
    data: parseData(data ?? null),
  } as Omit<T, 'createdAt' | 'updatedAt' | 'data'> & {
    createdAt?: string;
    updatedAt?: string;
    data: Record<string, unknown>;
  };
}

export const list: AppRouteHandler<ListRoute> = async (context) => {
  const rows = await db.query.app_configuration.findMany();
  return context.json(rows.map(cleanTimestamps));
};

export const getOne: AppRouteHandler<GetOneRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const row = await db.query.app_configuration.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });
  if (!row) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }
  return context.json(cleanTimestamps(row), HttpStatusCodes.OK);
};

export const getByKey: AppRouteHandler<GetByKeyRoute> = async (context) => {
  const { name } = context.req.valid('param');
  const row = await db.query.app_configuration.findFirst({
    where(fields, operators) {
      return operators.eq(fields.name, name);
    },
  });
  if (!row) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }
  return context.json(cleanTimestamps(row), HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const updates = context.req.valid('json');
  const set: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (updates.isActive !== undefined) set.isActive = updates.isActive;
  if (updates.data !== undefined) set.data = JSON.stringify(updates.data);
  const [updated] = await db
    .update(app_configuration)
    .set(set as any)
    .where(eq(app_configuration.id, id))
    .returning();
  if (!updated) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }
  return context.json(cleanTimestamps(updated), HttpStatusCodes.OK);
};
