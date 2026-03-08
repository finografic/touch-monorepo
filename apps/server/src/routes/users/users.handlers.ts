// @ts-nocheck - Bypassing complex type inference issues throughout this file
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

import { db } from 'db';
import { user as userSchema } from 'db/schemas';
import { ERROR_CODES, ERROR_MESSAGES } from 'lib/valibot.errors';
import type { AppHandler } from 'types/app.types';

export const list: AppHandler = async (context) => {
  const users = await db.query.user.findMany();
  return context.json(users);
};

export const getOne: AppHandler = async (context) => {
  const { id } = context.req.valid('param');
  const foundUser = await db.query.user.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!foundUser) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(foundUser, HttpStatusCodes.OK);
};

export const patch: AppHandler = async (context) => {
  const { id } = context.req.valid('param');
  const updates = context.req.valid('json');

  if (Object.keys(updates).length === 0) {
    return context.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: 'ValidationError',
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const [updated] = await db.update(userSchema).set(updates).where(eq(userSchema.id, id)).returning();

  if (!updated) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(updated, HttpStatusCodes.OK);
};

export const remove: AppHandler = async (context) => {
  const { id } = context.req.valid('param');
  const result = await db.delete(userSchema).where(eq(userSchema.id, id));

  if (result.changes === 0) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.body(null, HttpStatusCodes.NO_CONTENT);
};
