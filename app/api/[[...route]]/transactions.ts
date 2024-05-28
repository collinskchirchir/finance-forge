import { z } from 'zod';
import { Hono } from 'hono';
import { parse, subDays } from 'date-fns';
import { db } from '@/db/drizzle';
import { createId } from '@paralleldrive/cuid2';
import { accounts, categories, insertTransactionSchema, transactions } from '@/db/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { and, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';

const app = new Hono()
  .get('/',
    zValidator('query', z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid('query');
      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);
      const startDate = from
        ? parse(from, 'yyyy-MM-dd', new Date())
        : defaultFrom;
      const endDate = to
        ? parse(to, 'yyyy-MM-dd', new Date())
        : defaultTo;

      const data = await db
        .select({
          id: transactions.id,
          category: categories.name,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
          date: transactions.date,
          createdAt: transactions.createdAt,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate),
          ),
        )
        .orderBy(desc(transactions.date));

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
          id: transactions.id,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          accountId: transactions.accountId,
          date: transactions.date,
          createdAt: transactions.createdAt,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            eq(transactions.id, id), // only fetching 'id' passed as param
            eq(accounts.userId, auth.userId),
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
    zValidator('json', insertTransactionSchema.omit(
      { id: true },
    )),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid('json');
      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const [data] = await db.insert(transactions).values({
        id: createId(),
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

      // Common Table Expressiongs (CTE's) to check authorId matches accountId matches with userId
      const transactionsToDelete = db
        .$with('transactions_to_delete')
        .as(db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(
            inArray(transactions.id, values.ids),
            eq(accounts.userId, auth.userId),
          )),
        );
      const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionsToDelete})`),
        )
        .returning({
          id: transactions.id,
        });

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
      insertTransactionSchema.omit({
        id: true,
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
      // Common Table Expressiongs (CTE's) to check authorId matches accountId matches with userId
      const transactionsToUpdate = db
        .$with('transactions_to_update')
        .as(db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(
            eq(transactions.id, id),
            eq(accounts.userId, auth.userId),
          )),
        );

      const [data] = await db
        .with(transactionsToUpdate)
        .update(transactions)
        .set(values)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`),
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
      // Common Table Expressiongs (CTE's) to check authorId matches accountId matches with userId
      const transactionsToDelete = db
        .$with('transactions_to_delete')
        .as(db
          .select({ id: transactions.id })
          .from(transactions)
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))
          .where(and(
            eq(transactions.id, id),
            eq(accounts.userId, auth.userId),
          )),
        );

      const [data] = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(transactions.id, sql`(select id from ${transactionsToDelete})`),
        )

        .returning({
          id: transactions.id,
        });
      if (!data) {
        return c.json({ error: 'Not Found' }, 404);
      }
      return c.json({ data });
    },
  )
;

export default app;