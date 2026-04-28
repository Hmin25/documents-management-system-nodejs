import Router from 'koa-router';
import { Context } from 'koa';
import * as items from '../services/item.services';

const router = new Router();

router.get('/items', async (ctx) => {
    const parentId =
      ctx.query.parentId && !isNaN(Number(ctx.query.parentId))
        ? Number(ctx.query.parentId)
        : null;
  
    ctx.body = await items.getChildren(parentId);
  });

export default router;