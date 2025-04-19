import type { AppRouteHandler } from 'types/app.types';
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from './posts.routes';
import { db } from 'db';
import { posts } from 'db/schemas';
import { eq } from 'drizzle-orm';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from 'lib/constants';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

export const list: AppRouteHandler<ListRoute> = async (context) => {
  const posts = await db.query.posts.findMany();
  return context.json(posts);
};

export const create: AppRouteHandler<CreateRoute> = async (context) => {
  const post = context.req.valid('json');
  const [inserted] = await db.insert(posts).values(post).returning();
  return context.json(inserted, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const post = await db.query.posts.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!post) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(post, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const updates = context.req.valid('json');

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

  const [post] = await db.update(posts).set(updates).where(eq(posts.id, id)).returning();

  if (!post) {
    return context.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return context.json(post, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (context) => {
  const { id } = context.req.valid('param');
  const result = await db.delete(posts).where(eq(posts.id, id));

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
