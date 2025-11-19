import createCuid from '@bugsnag/cuid';
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

import { db } from 'db';
import { slot_configurations } from 'db/schemas';
import type { AppRouteHandler } from 'types/app.types';
import type {
  BulkUpdateRoute,
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
  ResetRoute,
} from './slot-configurations.routes';

function cleanTimestamps<T extends { createdAt?: string | null; updatedAt?: string | null }>(
  obj: T,
): Omit<T, 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string } {
  const { createdAt, updatedAt, ...rest } = obj;
  return {
    ...rest,
    ...(createdAt ? { createdAt } : {}),
    ...(updatedAt ? { updatedAt } : {}),
  };
}

export const list: AppRouteHandler<ListRoute> = async (context) => {
  const configs = await db.query.slot_configurations.findMany();
  return context.json(configs.map(cleanTimestamps));
};

export const getOne: AppRouteHandler<GetOneRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const config = await db.query.slot_configurations.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });
  if (!config) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }
  return context.json(cleanTimestamps(config), HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (context) => {
  const data = context.req.valid('json');
  const [inserted] = await db
    .insert(slot_configurations)
    .values({ ...data, id: createCuid() })
    .returning();
  return context.json(cleanTimestamps(inserted), HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const updates = context.req.valid('json');
  const [updated] = await db
    .update(slot_configurations)
    .set(updates)
    .where(eq(slot_configurations.id, id))
    .returning();
  if (!updated) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }
  return context.json(cleanTimestamps(updated), HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const result = await db.delete(slot_configurations).where(eq(slot_configurations.id, id));
  if (result.changes === 0) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }
  return context.body(null, HttpStatusCodes.NO_CONTENT);
};

export const bulkUpdate: AppRouteHandler<BulkUpdateRoute> = async (context) => {
  const { configurations } = context.req.valid('json');
  await db.delete(slot_configurations);
  const inserted = await db
    .insert(slot_configurations)
    .values(configurations.map((c: any) => ({ ...c, id: createCuid() })))
    .returning();
  return context.json(inserted.map(cleanTimestamps), HttpStatusCodes.OK);
};

export const reset: AppRouteHandler<ResetRoute> = async (context) => {
  const defaultConfig = [
    { slotNumber: 1, slotType: 'A' as const, relayNumber: 1 },
    { slotNumber: 2, slotType: 'B' as const, relayNumber: 2 },
    { slotNumber: 3, slotType: 'B' as const, relayNumber: 3 },
    { slotNumber: 4, slotType: 'B' as const, relayNumber: 4 },
    { slotNumber: 5, slotType: 'B' as const, relayNumber: 5 },
    { slotNumber: 6, slotType: 'B' as const, relayNumber: 6 },
    { slotNumber: 7, slotType: 'B' as const, relayNumber: 7 },
    { slotNumber: 8, slotType: 'B' as const, relayNumber: 8 },
    { slotNumber: 9, slotType: 'B' as const, relayNumber: 9 },
    { slotNumber: 10, slotType: 'C' as const, relayNumber: 10 },
  ];
  await db.delete(slot_configurations);
  await db.insert(slot_configurations).values(defaultConfig.map((c) => ({ ...c, id: createCuid() })));
  return context.json({ success: true, message: 'Slot configurations reset to default' }, HttpStatusCodes.OK);
};
