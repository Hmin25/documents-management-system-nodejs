import Router from 'koa-router';
import { Context } from 'koa';
import * as items from '../services/item.services';

const router = new Router();

/**
 * Create folder
 */
router.post('/create-folder', async (ctx: Context) => {
  const { name, parentId, createdBy } = ctx.request.body as {
    name: string;
    parentId: number | null;
    createdBy: string;
  };

  ctx.body = await items.createFolder(name, parentId, createdBy);
});

export default router;