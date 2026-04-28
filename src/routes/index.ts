import Router from 'koa-router';

import foldersRoutes from './folders.routes';
import filesRoutes from './files.routes';
import itemsRoutes from './items.routes';

const router = new Router();

router.use(foldersRoutes.routes());
router.use(filesRoutes.routes());
router.use(itemsRoutes.routes());

export default router;