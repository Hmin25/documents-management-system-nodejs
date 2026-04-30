import Router from 'koa-router';
import { Context } from 'koa';
import * as items from '../services/item.services';

const router = new Router();

router.get('/items', async (ctx: Context) => {
  const parentId =
    ctx.query.parentId && !isNaN(Number(ctx.query.parentId))
      ? Number(ctx.query.parentId)
      : null;

  const page = ctx.query.page ? Number(ctx.query.page) : 1;
  const limit = ctx.query.limit ? Number(ctx.query.limit) : 10;
  const sort = ctx.query.sort as string | undefined;
  const search = typeof ctx.query.search === 'string'
    ? ctx.query.search
    : undefined;

  ctx.body = await items.getChildren({
    parentId,
    page,
    limit,
    sort,
    search,
  });
});

export default router;