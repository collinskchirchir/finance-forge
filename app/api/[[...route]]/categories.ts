import { z } from 'zod';
import { Hono } from 'hono';
import { db } from '@/db/drizzle';
import { createId } from '@paralleldrive/cuid2';
import { categories, insertCategorySchema } from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { and, eq, inArray } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';

const app = new Hono()
  .get('/',
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      const data = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(eq(categories.userId, auth.userId))
        .orderBy(categories.name);

      return c.json({ data });
    })
  .get(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({
      id: z.string().optional(),
    })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json({ error: 'Missing id' }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const [data] = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            eq(categories.id, id), // only fetching 'id' passed as param
          ),
        );
      if (!data) {
        return c.json({ error: 'Not Found' }, 404);
      }
      return c.json({ data });
    },
  )
  .post(
    '/',
    clerkMiddleware(),
    zValidator('json', insertCategorySchema.pick(
      { name: true },
    )),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid('json');
      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const [data] = await db.insert(categories).values({
        id: createId(),
        userId: auth.userId,
        ...values,
      }).returning();

      return c.json({ data });
    })
  .post(
    '/bulk-delete',
    clerkMiddleware(),
    zValidator('json', z.object({
      ids: z.array(z.string()),
    })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid('json');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      const data = await db
        .delete(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            inArray(categories.id, values.ids),
          ),
        )
        .returning({ id: categories.id });
      return c.json({ data });
    },
  )
  .patch(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({
      id: z.string().optional(),
    })),
    zValidator(
      'json',
      insertCategorySchema.pick({
        name: true,
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid('param');
      const values = c.req.valid('json');

      if (!id) {
        return c.json({ error: 'Missing id' }, 400);
      }
      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const [data] = await db
        .update(categories)
        .set(values)
        .where(
          and(
            eq(categories.userId, auth.userId),
            eq(categories.id, id),
          ),
        )
        .returning();
      if (!data) {
        return c.json({ error: 'Not Found' }, 404);
      }
      return c.json({ data });
    },
  )
  .delete(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({
      id: z.string().optional(),
    })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json({ error: 'Missing id' }, 400);
      }
      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const [data] = await db
        .delete(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            eq(categories.id, id),
          ),
        )
        .returning({
          id: categories.id,
        });
      if (!data) {
        return c.json({ error: 'Not Found' }, 404);
      }
      return c.json({ data });
    },
  )
;

export default app;