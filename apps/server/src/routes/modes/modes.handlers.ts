// @ts-nocheck - Bypassing complex type inference issues throughout this file
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

import { db } from 'db';
import { modes } from 'db/schemas';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from 'lib/zod.errors';
import type { AppRouteHandler } from 'types/app.types';
import type { ModeEntity } from 'types/entities';
import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
  UpdateActiveStatesRoute,
  UpdateDefaultModeRoute,
} from './modes.routes';

function formatMode(mode: any) {
  return {
    ...mode,
    // Add any formatting if needed
  };
}

export const list: AppRouteHandler<ListRoute> = async (context) => {
  const modesList = await db.query.modes.findMany();
  return context.json(modesList);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const result = await db.select().from(modes).where(eq(modes.id, id)).limit(1);

  if (result.length === 0) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return context.json(result[0], HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (context) => {
  const mode = await context.req.json();
  const result = await db.insert(modes).values(mode).returning();
  return context.json(formatMode(result[0]), HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const updates = context.req.valid('json') as Partial<typeof modes.$inferInsert>;

  if (Object.keys(updates).length === 0) {
    return context.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: 'ZodError',
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const result = await db.update(modes).set(updates).where(eq(modes.id, id)).returning();

  if (result.length === 0) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return context.json(formatMode(result[0]), HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const result = await db.delete(modes).where(eq(modes.id, id));

  if (result.changes === 0) {
    return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return context.body(null, HttpStatusCodes.NO_CONTENT);
};

export const updateActiveStates: AppRouteHandler<UpdateActiveStatesRoute> = async (context) => {
  const { activeModeIds } = context.req.valid('json');

  // First, set all modes to inactive
  await db.update(modes).set({ isActive: false });

  // Then, set the specified modes to active
  if (activeModeIds.length > 0) {
    await db.update(modes).set({ isActive: true }).where(eq(modes.id, activeModeIds[0]));
    for (let i = 1; i < activeModeIds.length; i++) {
      await db.update(modes).set({ isActive: true }).where(eq(modes.id, activeModeIds[i]));
    }
  }

  // Return all modes
  const allModes = await db.query.modes.findMany();
  return context.json(allModes, HttpStatusCodes.OK);
};

export const updateDefaultMode: AppRouteHandler<UpdateDefaultModeRoute> = async (context) => {
  const { defaultModeId } = context.req.valid('json');

  // First, set all modes to not default
  await db.update(modes).set({ isDefault: false });

  // Then, set the specified mode to default (if provided)
  if (defaultModeId) {
    await db.update(modes).set({ isDefault: true }).where(eq(modes.id, defaultModeId));
  }

  // Return all modes
  const allModes = await db.query.modes.findMany();
  return context.json(allModes, HttpStatusCodes.OK);
};
